using DevHms.Abdm.CallbackApi;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<AbdmCallbackStore>();

var app = builder.Build();

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));

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
