using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Channels;

namespace DevHms.Abdm.CallbackApi;

public sealed class AbdmGatewayOptions
{
    public string SessionUrl { get; init; } =
        "https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions";

    public string OnDiscoverUrl { get; init; } =
        "https://dev.abdm.gov.in/api/hiecm/user-initiated-linking/v3/patient/care-context/on-discover";

    public string ConsentNotifyAcknowledgementUrl { get; init; } =
        "https://dev.abdm.gov.in/api/hiecm/consent/v3/request/hiu/on-notify";

    public string ClientId { get; init; } = "";
    public string ClientSecret { get; init; } = "";
    public string CmId { get; init; } = "sbx";
    public string HipId { get; init; } = "";
    public DemoDiscoveryPatient DemoPatient { get; init; } = new();

    public bool HasSessionCredentials =>
        !string.IsNullOrWhiteSpace(ClientId) &&
        !string.IsNullOrWhiteSpace(ClientSecret) &&
        !string.IsNullOrWhiteSpace(CmId);
}

public sealed class DemoDiscoveryPatient
{
    public string AbhaNumber { get; init; } = "";
    public string AbhaAddress { get; init; } = "";
    public string Name { get; init; } = "";
    public string Gender { get; init; } = "";
    public int? YearOfBirth { get; init; }
    public string ReferenceNumber { get; init; } = "DEMO-PATIENT-001";
}

public sealed record CareContextDiscoveryCallback(
    string? TransactionId,
    DiscoveryPatient? Patient);

public sealed record DiscoveryPatient(
    string? Id,
    string? Name,
    string? Gender,
    string? Dob,
    JsonElement? YearOfBirth,
    List<DiscoveryIdentifier>? VerifiedIdentifiers);

public sealed record DiscoveryIdentifier(string? Type, string? Value);

public sealed record DiscoveryWorkItem(
    string RequestId,
    CareContextDiscoveryCallback Callback);

public enum DiscoveryEnqueueResult
{
    Queued,
    Duplicate,
    Full,
}

public sealed class AbdmDiscoveryQueue
{
    private static readonly TimeSpan SeenRequestLifetime = TimeSpan.FromHours(24);
    private readonly object _sync = new();
    private readonly Dictionary<string, DateTimeOffset> _seenTransactions = new(StringComparer.Ordinal);
    private readonly Channel<DiscoveryWorkItem> _channel =
        Channel.CreateBounded<DiscoveryWorkItem>(
            new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.Wait,
                SingleReader = true,
                SingleWriter = false,
            });

    public DiscoveryEnqueueResult TryEnqueue(DiscoveryWorkItem item)
    {
        lock (_sync)
        {
            RemoveExpiredTransactions();
            if (_seenTransactions.ContainsKey(item.Callback.TransactionId!))
            {
                return DiscoveryEnqueueResult.Duplicate;
            }

            if (!_channel.Writer.TryWrite(item))
            {
                return DiscoveryEnqueueResult.Full;
            }

            _seenTransactions.Add(
                item.Callback.TransactionId!,
                DateTimeOffset.UtcNow);
            return DiscoveryEnqueueResult.Queued;
        }
    }

    public IAsyncEnumerable<DiscoveryWorkItem> ReadAllAsync(
        CancellationToken cancellationToken) =>
        _channel.Reader.ReadAllAsync(cancellationToken);

    private void RemoveExpiredTransactions()
    {
        var cutoff = DateTimeOffset.UtcNow - SeenRequestLifetime;
        foreach (var transactionId in _seenTransactions
                     .Where(entry => entry.Value <= cutoff)
                     .Select(entry => entry.Key)
                     .ToArray())
        {
            _seenTransactions.Remove(transactionId);
        }
    }
}

public sealed class AbdmSessionTokenProvider
{
    private static readonly TimeSpan RefreshBeforeExpiry = TimeSpan.FromSeconds(60);
    private readonly HttpClient _httpClient;
    private readonly AbdmGatewayOptions _options;
    private readonly SemaphoreSlim _refreshLock = new(1, 1);
    private string? _accessToken;
    private DateTimeOffset _expiresAt;

    public AbdmSessionTokenProvider(HttpClient httpClient, AbdmGatewayOptions options)
    {
        _httpClient = httpClient;
        _options = options;
    }

    public async Task<string> GetAccessTokenAsync(CancellationToken cancellationToken)
    {
        if (!string.IsNullOrWhiteSpace(_accessToken) &&
            DateTimeOffset.UtcNow < _expiresAt)
        {
            return _accessToken;
        }

        await _refreshLock.WaitAsync(cancellationToken);
        try
        {
            if (!string.IsNullOrWhiteSpace(_accessToken) &&
                DateTimeOffset.UtcNow < _expiresAt)
            {
                return _accessToken;
            }

            using var request = new HttpRequestMessage(HttpMethod.Post, _options.SessionUrl)
            {
                Content = JsonContent.Create(new
                {
                    clientId = _options.ClientId,
                    clientSecret = _options.ClientSecret,
                    grantType = "client_credentials",
                }),
            };
            request.Headers.TryAddWithoutValidation("X-CM-ID", _options.CmId);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            if (!response.IsSuccessStatusCode)
            {
                throw new HttpRequestException(
                    $"ABDM session request returned HTTP {(int)response.StatusCode}.");
            }

            var session = await response.Content.ReadFromJsonAsync<AbdmSessionResponse>(
                cancellationToken: cancellationToken);
            if (string.IsNullOrWhiteSpace(session?.AccessToken) || session.ExpiresIn <= 0)
            {
                throw new InvalidOperationException(
                    "ABDM session response did not contain a valid access token and expiry.");
            }

            _accessToken = session.AccessToken;
            _expiresAt = DateTimeOffset.UtcNow.AddSeconds(session.ExpiresIn) -
                         RefreshBeforeExpiry;
            return _accessToken;
        }
        finally
        {
            _refreshLock.Release();
        }
    }

    private sealed record AbdmSessionResponse(string? AccessToken, int ExpiresIn);
}

public sealed class AbdmConsentNotificationAcknowledger
{
    private readonly HttpClient _httpClient;
    private readonly AbdmSessionTokenProvider _tokenProvider;
    private readonly AbdmGatewayOptions _options;
    private readonly ILogger<AbdmConsentNotificationAcknowledger> _logger;

    public AbdmConsentNotificationAcknowledger(
        HttpClient httpClient,
        AbdmSessionTokenProvider tokenProvider,
        AbdmGatewayOptions options,
        ILogger<AbdmConsentNotificationAcknowledger> logger)
    {
        _httpClient = httpClient;
        _tokenProvider = tokenProvider;
        _options = options;
        _logger = logger;
    }

    public async Task AcknowledgeAsync(
        string callbackRequestId,
        string hiuId,
        IEnumerable<string> consentArtefactIds,
        CancellationToken cancellationToken)
    {
        var accessToken = await _tokenProvider.GetAccessTokenAsync(cancellationToken);
        var acknowledgement = consentArtefactIds
            .Select(consentId => new { status = "OK", consentId })
            .ToArray();
        using var request = new HttpRequestMessage(
            HttpMethod.Post,
            _options.ConsentNotifyAcknowledgementUrl)
        {
            Content = JsonContent.Create(new
            {
                acknowledgement,
                response = new { requestId = callbackRequestId },
            }),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.TryAddWithoutValidation("REQUEST-ID", Guid.NewGuid().ToString());
        request.Headers.TryAddWithoutValidation(
            "TIMESTAMP",
            DateTimeOffset.UtcNow.ToString("O"));
        request.Headers.TryAddWithoutValidation("X-CM-ID", _options.CmId);
        request.Headers.TryAddWithoutValidation("X-HIU-ID", hiuId);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "ABDM consent notification acknowledgement failed with HTTP {StatusCode}.",
                (int)response.StatusCode);
            throw new HttpRequestException(
                $"ABDM consent notification acknowledgement returned HTTP {(int)response.StatusCode}.");
        }

        _logger.LogInformation("ABDM consent notification acknowledged.");
    }
}

public sealed class AbdmDiscoveryClient
{
    private static readonly JsonSerializerOptions JsonOptions =
        new(JsonSerializerDefaults.Web);

    private readonly HttpClient _httpClient;
    private readonly AbdmSessionTokenProvider _tokenProvider;
    private readonly AbdmGatewayOptions _options;
    private readonly ILogger<AbdmDiscoveryClient> _logger;

    public AbdmDiscoveryClient(
        HttpClient httpClient,
        AbdmSessionTokenProvider tokenProvider,
        AbdmGatewayOptions options,
        ILogger<AbdmDiscoveryClient> logger)
    {
        _httpClient = httpClient;
        _tokenProvider = tokenProvider;
        _options = options;
        _logger = logger;
    }

    public async Task RespondAsync(
        DiscoveryWorkItem item,
        CancellationToken cancellationToken)
    {
        var accessToken = await _tokenProvider.GetAccessTokenAsync(cancellationToken);
        var result = BuildResponse(item, _options.DemoPatient);
        using var request = new HttpRequestMessage(HttpMethod.Post, _options.OnDiscoverUrl)
        {
            Content = JsonContent.Create(result, options: JsonOptions),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.TryAddWithoutValidation("REQUEST-ID", Guid.NewGuid().ToString());
        request.Headers.TryAddWithoutValidation(
            "TIMESTAMP",
            DateTimeOffset.UtcNow.ToString("O"));
        request.Headers.TryAddWithoutValidation("X-CM-ID", _options.CmId);
        request.Headers.TryAddWithoutValidation("X-HIP-ID", _options.HipId);

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError(
                "ABDM on-discover response failed with HTTP {StatusCode}.",
                (int)response.StatusCode);
            throw new HttpRequestException(
                $"ABDM on-discover returned HTTP {(int)response.StatusCode}.");
        }

        _logger.LogInformation("ABDM on-discover response accepted.");
    }

    private static object BuildResponse(
        DiscoveryWorkItem item,
        DemoDiscoveryPatient demoPatient)
    {
        var matchedBy = MatchPatient(item.Callback.Patient, demoPatient);
        if (matchedBy.Count == 0)
        {
            return new
            {
                transactionId = item.Callback.TransactionId,
                error = new
                {
                    code = "ABDM-9999",
                    message = "No matching sandbox demo patient was found.",
                },
                response = new { requestId = item.RequestId },
            };
        }

        return new
        {
            transactionId = item.Callback.TransactionId,
            patient = new[]
            {
                new
                {
                    referenceNumber = demoPatient.ReferenceNumber,
                    display = demoPatient.Name,
                    careContexts = new[]
                    {
                        new
                        {
                            referenceNumber = "DEMO-CC-OPD-001",
                            display = "Sandbox Cardiology OPD",
                        },
                        new
                        {
                            referenceNumber = "DEMO-CC-OPD-002",
                            display = "Sandbox General Medicine OPD",
                        },
                    },
                    hiType = "Prescription",
                    count = 2,
                },
            },
            matchedBy,
            response = new { requestId = item.RequestId },
        };
    }

    private static List<string> MatchPatient(
        DiscoveryPatient? patient,
        DemoDiscoveryPatient demoPatient)
    {
        if (patient is null ||
            string.IsNullOrWhiteSpace(demoPatient.AbhaNumber) ||
            string.IsNullOrWhiteSpace(demoPatient.AbhaAddress) ||
            string.IsNullOrWhiteSpace(demoPatient.Name) ||
            string.IsNullOrWhiteSpace(demoPatient.Gender) ||
            demoPatient.YearOfBirth is null)
        {
            return [];
        }

        var identifiers = patient.VerifiedIdentifiers ?? [];
        var abhaNumberMatched = identifiers.Any(identifier =>
            string.Equals(identifier.Type, "ABHA_NUMBER", StringComparison.OrdinalIgnoreCase) &&
            NormalizeNumber(identifier.Value) == NormalizeNumber(demoPatient.AbhaNumber));
        var abhaAddressMatched = identifiers.Any(identifier =>
            string.Equals(identifier.Type, "ABHA_ADDRESS", StringComparison.OrdinalIgnoreCase) &&
            string.Equals(
                identifier.Value?.Trim(),
                demoPatient.AbhaAddress.Trim(),
                StringComparison.OrdinalIgnoreCase));

        if (!abhaNumberMatched && !abhaAddressMatched)
        {
            return [];
        }

        var nameMatched = string.Equals(
            NormalizeName(patient.Name),
            NormalizeName(demoPatient.Name),
            StringComparison.Ordinal);
        var genderMatched = string.Equals(
            patient.Gender?.Trim(),
            demoPatient.Gender.Trim(),
            StringComparison.OrdinalIgnoreCase);
        var yearOfBirthMatched =
            TryGetYearOfBirth(patient) is int year &&
            year == demoPatient.YearOfBirth;

        if (!nameMatched || !genderMatched || !yearOfBirthMatched)
        {
            return [];
        }

        var matchedBy = new List<string>();
        if (abhaNumberMatched)
        {
            matchedBy.Add("ABHA_NUMBER");
        }

        if (abhaAddressMatched)
        {
            matchedBy.Add("ABHA_ADDRESS");
        }

        return matchedBy;
    }

    private static string NormalizeNumber(string? value) =>
        new((value ?? "").Where(char.IsDigit).ToArray());

    private static string NormalizeName(string? value) =>
        string.Join(
            ' ',
            (value ?? "").Split(
                (char[]?)null,
                StringSplitOptions.RemoveEmptyEntries))
            .ToUpperInvariant();

    private static int? TryGetYearOfBirth(DiscoveryPatient patient)
    {
        if (patient.YearOfBirth is { } yearOfBirth)
        {
            if (yearOfBirth.ValueKind == JsonValueKind.Number &&
                yearOfBirth.TryGetInt32(out var numericYear))
            {
                return numericYear;
            }

            if (yearOfBirth.ValueKind == JsonValueKind.String &&
                int.TryParse(yearOfBirth.GetString(), out var stringYear))
            {
                return stringYear;
            }
        }

        return DateTimeOffset.TryParse(patient.Dob, out var dateOfBirth)
            ? dateOfBirth.Year
            : null;
    }
}

public sealed class AbdmDiscoveryWorker : BackgroundService
{
    private readonly AbdmDiscoveryQueue _queue;
    private readonly AbdmDiscoveryClient _client;
    private readonly ILogger<AbdmDiscoveryWorker> _logger;

    public AbdmDiscoveryWorker(
        AbdmDiscoveryQueue queue,
        AbdmDiscoveryClient client,
        ILogger<AbdmDiscoveryWorker> logger)
    {
        _queue = queue;
        _client = client;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var item in _queue.ReadAllAsync(stoppingToken))
        {
            try
            {
                await _client.RespondAsync(item, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception, "Failed to process ABDM care-context discovery.");
            }
        }
    }
}
