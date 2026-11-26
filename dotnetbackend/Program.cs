using System.Diagnostics;
using DevHms.Abdm.CallbackApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<AbdmCallbackStore>();
builder.Services.AddSingleton<AbdmConsentStore>();
var fideliusBaseUrl = builder.Configuration["Fidelius:BaseUrl"] ?? "http://localhost:8090/";
if (!fideliusBaseUrl.EndsWith("/", StringComparison.Ordinal))
{
    fideliusBaseUrl += "/";
}

if (!Uri.TryCreate(fideliusBaseUrl, UriKind.Absolute, out var fideliusBaseUri))
{
    throw new InvalidOperationException("Fidelius:BaseUrl must be an absolute URL.");
}

builder.Services.AddHttpClient<AbdmFideliusClient>(client =>
{
    client.BaseAddress = fideliusBaseUri;
});
var abdmOptions = new AbdmGatewayOptions
{
    SessionUrl = builder.Configuration["ABDM_SESSION_URL"]
                 ?? "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions",
    OnDiscoverUrl = builder.Configuration["ABDM_ON_DISCOVER_URL"]
                    ?? "https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover",
    ConsentNotifyAcknowledgementUrl = builder.Configuration["ABDM_CONSENT_NOTIFY_ACK_URL"]
                                      ?? "https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify",
    ClientId = builder.Configuration["ABDM_CLIENT_ID"] ?? "",
    ClientSecret = builder.Configuration["ABDM_CLIENT_SECRET"] ?? "",
    CmId = builder.Configuration["ABDM_CM_ID"] ?? "sbx",
    HipId = builder.Configuration["ABDM_HIP_ID"] ?? "",
    DemoPatient = new DemoDiscoveryPatient
    {
        AbhaNumber = builder.Configuration["ABDM_DEMO_ABHA_NUMBER"] ?? "",
        AbhaAddress = builder.Configuration["ABDM_DEMO_ABHA_ADDRESS"] ?? "",
        Name = builder.Configuration["ABDM_DEMO_PATIENT_NAME"] ?? "",
        Gender = builder.Configuration["ABDM_DEMO_PATIENT_GENDER"] ?? "",
        YearOfBirth = int.TryParse(
            builder.Configuration["ABDM_DEMO_PATIENT_YEAR_OF_BIRTH"],
            out var demoYearOfBirth)
            ? demoYearOfBirth
            : null,
        ReferenceNumber = builder.Configuration["ABDM_DEMO_PATIENT_REFERENCE"]
                          ?? "DEMO-PATIENT-001",
    },
};
builder.Services.AddSingleton(abdmOptions);
builder.Services.AddSingleton<AbdmDiscoveryQueue>();
builder.Services.AddHttpClient<AbdmSessionTokenProvider>();
builder.Services.AddHttpClient<AbdmDiscoveryClient>();
builder.Services.AddHttpClient<AbdmConsentNotificationAcknowledger>();
builder.Services.AddHostedService<AbdmDiscoveryWorker>();

var app = builder.Build();

app.Use(async (context, next) =>
{
    var path = context.Request.Path;
    var isAbdmFlowRoute =
        path.StartsWithSegments("/api/v3/hip/token/on-generate-token") ||
        path.StartsWithSegments("/api/v3/link/on_carecontext") ||
        path.StartsWithSegments("/api/v3/hip/patient/care-context/discover") ||
        path.StartsWithSegments("/api/v3/hiu/consent/request/on-init") ||
        path.StartsWithSegments("/api/v3/hiu/consent/request/notify") ||
        path.StartsWithSegments("/mobile/abdm/link-token-requests") ||
        path.StartsWithSegments("/mobile/abdm/care-context-requests") ||
        path.StartsWithSegments("/mobile/abdm/consent-requests");

    if (!isAbdmFlowRoute)
    {
        await next();
        return;
    }

    var stopwatch = Stopwatch.StartNew();
    app.Logger.LogInformation(
        "ABDM flow request started: {Method} {Path}",
        context.Request.Method,
        path);

    try
    {
        await next();
    }
    catch (Exception exception)
    {
        app.Logger.LogError(
            exception,
            "ABDM flow request failed: {Method} {Path}",
            context.Request.Method,
            path);
        throw;
    }
    finally
    {
        app.Logger.LogInformation(
            "ABDM flow request completed: {Method} {Path} -> {StatusCode} in {ElapsedMs} ms",
            context.Request.Method,
            path,
            context.Response.StatusCode,
            stopwatch.ElapsedMilliseconds);
    }
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

app.MapPost(
    "/api/v3/hip/patient/care-context/discover",
    (
        CareContextDiscoveryCallback callback,
        HttpRequest request,
        AbdmDiscoveryQueue queue,
        AbdmGatewayOptions options) =>
    {
        var requestId = request.Headers["REQUEST-ID"].FirstOrDefault();
        var hipId = request.Headers["X-HIP-ID"].FirstOrDefault();
        if (string.IsNullOrWhiteSpace(requestId) ||
            string.IsNullOrWhiteSpace(callback.TransactionId) ||
            callback.Patient is null ||
            !string.Equals(hipId, options.HipId, StringComparison.Ordinal))
        {
            return Results.BadRequest(new
            {
                message = "Invalid ABDM discovery callback headers or payload.",
            });
        }

        if (!options.HasSessionCredentials)
        {
            return Results.Json(
                new { message = "ABDM server credentials and HIP ID are not configured." },
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var result = queue.TryEnqueue(new DiscoveryWorkItem(requestId, callback));
        return result switch
        {
            DiscoveryEnqueueResult.Queued => Results.Accepted(),
            DiscoveryEnqueueResult.Duplicate => Results.BadRequest(new
            {
                code = "ABDM-1103",
                message = "This ABDM discovery transaction has already been received.",
            }),
            _ => Results.Json(
                new { message = "The ABDM discovery queue is full. Retry the callback." },
                statusCode: StatusCodes.Status503ServiceUnavailable),
        };
    });

app.MapPost(
    "/api/v3/hiu/consent/request/on-init",
    (
        HiuConsentRequestInitCallback callback,
        HttpRequest request,
        AbdmConsentStore store) =>
    {
        var hiuId = request.Headers["X-HIU-ID"].FirstOrDefault();
        var hasError = callback.Error is { } error &&
                       error.ValueKind is not (
                           System.Text.Json.JsonValueKind.Null or
                           System.Text.Json.JsonValueKind.Undefined);
        if (string.IsNullOrWhiteSpace(request.Headers["REQUEST-ID"].FirstOrDefault()) ||
            string.IsNullOrWhiteSpace(hiuId) ||
            string.IsNullOrWhiteSpace(callback.Response?.RequestId) ||
            (string.IsNullOrWhiteSpace(callback.ConsentRequest?.Id) &&
             !hasError))
        {
            return Results.BadRequest(new { message = "Invalid ABDM consent init callback payload." });
        }

        return store.SaveRequestInit(callback, hiuId)
            ? Results.Ok()
            : Results.NotFound(new
            {
                message = "No active consent request matches this callback HIU ID and request ID.",
            });
    });

app.MapPost(
    "/api/v3/hiu/consent/request/notify",
    async (
        HiuConsentNotificationCallback callback,
        HttpRequest request,
        AbdmConsentStore store,
        AbdmConsentNotificationAcknowledger acknowledger,
        AbdmGatewayOptions options,
        CancellationToken cancellationToken) =>
    {
        var requestId = request.Headers["REQUEST-ID"].FirstOrDefault();
        var hiuId = request.Headers["X-HIU-ID"].FirstOrDefault();
        var notification = callback.Notification;
        if (string.IsNullOrWhiteSpace(requestId) ||
            string.IsNullOrWhiteSpace(hiuId) ||
            string.IsNullOrWhiteSpace(notification?.ConsentRequestId) ||
            string.IsNullOrWhiteSpace(notification.Status))
        {
            return Results.BadRequest(new { message = "Invalid ABDM consent notification payload." });
        }

        if (!store.SaveNotification(callback, hiuId))
        {
            return Results.NotFound(
                new
                {
                    message = "No active consent request matches this notification HIU ID and consent request ID.",
                });
        }

        if (!options.HasSessionCredentials)
        {
            return Results.Json(
                new { message = "ABDM session credentials are not configured on the callback server." },
                statusCode: StatusCodes.Status503ServiceUnavailable);
        }

        var consentArtefactIds = (notification.ConsentArtefacts ?? [])
            .Select(artefact => artefact.Id)
            .Where(id => !string.IsNullOrWhiteSpace(id))
            .Select(id => id!);
        await acknowledger.AcknowledgeAsync(
            requestId,
            hiuId,
            consentArtefactIds,
            cancellationToken);
        return Results.Ok();
    });

app.MapPost(
    "/mobile/abdm/consent-requests",
    (
        CreateConsentRequestRegistration request,
        AbdmConsentStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId) ||
            string.IsNullOrWhiteSpace(request.PatientAddress) ||
            string.IsNullOrWhiteSpace(request.HiuId))
        {
            return Results.BadRequest(
                new { message = "Request ID, patient ABHA address, and HIU ID are required." });
        }

        return store.TryCreateRequest(
                request.RequestId,
                request.PatientAddress,
                request.HiuId,
                out var createdRequest)
            ? Results.Json(
                new
                {
                    requestId = request.RequestId,
                    pollId = createdRequest!.PollId,
                    expiresAt = createdRequest.ExpiresAt,
                },
                statusCode: StatusCodes.Status201Created)
            : Results.Conflict(
                new { message = "A consent request with this ID already exists." });
    });

app.MapPost(
    "/mobile/abdm/consent-requests/cancel",
    (CancelConsentRequestRegistration request, AbdmConsentStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
        {
            return Results.BadRequest(new { message = "Consent request ID is required." });
        }

        return store.CancelRequest(request.RequestId)
            ? Results.NoContent()
            : Results.NotFound(new { message = "Consent request was not found or has expired." });
    });

app.MapPost(
    "/mobile/abdm/consent-requests/poll",
    (PollConsentRequest request, AbdmConsentStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.PollId))
        {
            return Results.BadRequest(new { message = "Consent poll ID is required." });
        }

        var result = store.PollRequest(request.PollId);
        if (result is null)
        {
            return Results.NotFound(new { message = "Consent request was not found or has expired." });
        }

        if (result.Status == "PENDING")
        {
            return Results.Json(
                new { status = result.Status },
                statusCode: StatusCodes.Status202Accepted);
        }

        return Results.Ok(new
        {
            status = result.Status,
            consentRequestId = result.ConsentRequestId,
            consentArtefactIds = result.ConsentArtefactIds,
            error = result.Error,
        });
    });

app.MapPost(
    "/api/v3/hip/token/on-generate-token",
    (GenerateTokenCallback callback, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(callback.AbhaAddress) ||
            string.IsNullOrWhiteSpace(callback.LinkToken) ||
            string.IsNullOrWhiteSpace(callback.Response?.RequestId))
        {
            return Results.BadRequest(new { message = "Invalid ABDM token callback payload." });
        }

        if (!store.SaveLinkToken(callback))
        {
            return Results.NotFound(new { message = "No active token request matches this ABDM request ID and ABHA address." });
        }

        return Results.Accepted();
    });

app.MapPost(
    "/api/v3/link/on_carecontext",
    (CareContextCallback callback, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(callback.AbhaAddress) ||
            string.IsNullOrWhiteSpace(callback.Status) ||
            string.IsNullOrWhiteSpace(callback.Response?.RequestId))
        {
            return Results.BadRequest(new { message = "Invalid ABDM care-context callback payload." });
        }

        if (!store.SaveCareContextStatus(callback))
        {
            return Results.NotFound(new { message = "No active care-context request matches this callback request ID." });
        }

        return Results.Ok();
    });

app.MapPost(
    "/mobile/abdm/care-context-requests",
    (CreateCareContextRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId) ||
            string.IsNullOrWhiteSpace(request.AbhaAddress))
        {
            return Results.BadRequest(new { message = "Care-context request ID and ABHA address are required." });
        }

        return store.TryCreateCareContextRequest(request.RequestId, request.AbhaAddress)
            ? Results.Json(new { requestId = request.RequestId }, statusCode: StatusCodes.Status201Created)
            : Results.Conflict(new { message = "A care-context request with this ID already exists." });
    });

app.MapPost(
    "/mobile/abdm/care-context-requests/cancel",
    (CancelCareContextRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
        {
            return Results.BadRequest(new { message = "Care-context request ID is required." });
        }

        return store.CancelCareContextRequest(request.RequestId)
            ? Results.NoContent()
            : Results.NotFound(new { message = "Care-context request was not found or has expired." });
    });

app.MapPost(
    "/mobile/abdm/care-context-requests/poll",
    (PollCareContextRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
        {
            return Results.BadRequest(new { message = "Care-context request ID is required." });
        }

        var result = store.PollCareContextStatus(request.RequestId);
        return result.Status switch
        {
            CareContextRequestStatus.Pending => Results.Json(new { status = "pending" }, statusCode: StatusCodes.Status202Accepted),
            CareContextRequestStatus.Completed => Results.Ok(new
            {
                status = "completed",
                linkStatus = result.LinkStatus,
                error = result.Error,
            }),
            _ => Results.NotFound(new { message = "Care-context request was not found or has expired." }),
        };
    });

app.MapPost(
    "/mobile/abdm/link-token-requests",
    (CreateLinkTokenRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.AbhaAddress) ||
            string.IsNullOrWhiteSpace(request.AbdmRequestId))
        {
            return Results.BadRequest(new { message = "ABHA address and ABDM request ID are required." });
        }

        if (!store.TryCreateTokenRequest(
                request.AbhaAddress,
                request.AbdmRequestId,
                out var tokenRequest))
        {
            return Results.Conflict(new { message = "A token request is already active for this ABHA address." });
        }

        return Results.Json(tokenRequest, statusCode: StatusCodes.Status201Created);
    });

app.MapPost(
    "/mobile/abdm/link-token-requests/cancel",
    (CancelLinkTokenRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
        {
            return Results.BadRequest(new { message = "Token request ID is required." });
        }

        return store.CancelTokenRequest(request.RequestId)
            ? Results.NoContent()
            : Results.NotFound(new { message = "Token request was not found or has expired." });
    });

app.MapPost(
    "/mobile/abdm/link-token-requests/poll",
    (PollLinkTokenRequest request, AbdmCallbackStore store) =>
    {
        if (string.IsNullOrWhiteSpace(request.RequestId))
        {
            return Results.BadRequest(new { message = "Token request ID is required." });
        }

        var result = store.PollTokenRequest(request.RequestId);
        return result.Status switch
        {
            TokenRequestStatus.Pending => Results.Json(new { status = "pending" }, statusCode: StatusCodes.Status202Accepted),
            TokenRequestStatus.Ready => Results.Ok(new
            {
                status = "ready",
                linkToken = result.LinkToken,
                expiresAt = result.ExpiresAt,
            }),
            _ => Results.NotFound(new { message = "Token request was not found or has expired." }),
        };
    });

app.Run();
