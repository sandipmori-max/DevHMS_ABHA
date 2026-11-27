using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Channels;

namespace DevHms.Abdm.CallbackApi;

public sealed class AbdmM3Options
{
    public string ConsentFetchUrl { get; init; } =
        "https://dev.abdm.gov.in/api/hiecm/consent/v3/fetch";

    public string HealthInformationRequestUrl { get; init; } =
        "https://dev.abdm.gov.in/api/hiecm/data-flow/v3/health-information/request";

    public string DataPushUrl { get; init; } = "";
    public string CmId { get; init; } = "sbx";

    public bool HasHttpsDataPushUrl =>
        Uri.TryCreate(DataPushUrl, UriKind.Absolute, out var uri) &&
        uri.Scheme == Uri.UriSchemeHttps;
}

public sealed record StartConsentDataFetch(string? PollId, string? ConsentArtefactId);

public sealed record PollConsentDataFetch(string? PollId, string? ConsentArtefactId);

public sealed record ConsentDetailsSummary(
    string ConsentId,
    string PatientId,
    string HipId,
    string HiuId,
    string[] HiTypes,
    string AccessMode,
    DateTimeOffset From,
    DateTimeOffset To,
    DateTimeOffset? DataEraseAt);

public sealed record ConsentDataFetchResult(
    string Status,
    string? Error,
    ConsentDetailsSummary? Consent,
    IReadOnlyList<JsonElement> Records);

public sealed class AbdmM3Store
{
    private static readonly TimeSpan TransferLifetime = TimeSpan.FromHours(24);
    private readonly object _sync = new();
    private readonly Dictionary<string, Transfer> _transfers = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _consentFetchRequests = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _healthRequests = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _transactions = new(StringComparer.Ordinal);

    public (TransferSnapshot Transfer, bool Created) StartTransfer(
        string pollId,
        string consentRequestId,
        string patientAddress,
        string consentArtefactId,
        string hiuId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            var key = GetTransferKey(pollId, consentArtefactId);
            if (_transfers.TryGetValue(key, out var existing))
            {
                if (existing.Status != "FAILED")
                {
                    return (Snapshot(existing), false);
                }

                RemoveTransfer(key);
            }

            var transfer = new Transfer(
                pollId,
                consentRequestId,
                patientAddress,
                consentArtefactId,
                hiuId,
                DateTimeOffset.UtcNow.Add(TransferLifetime));
            _transfers.Add(key, transfer);
            return (Snapshot(transfer), true);
        }
    }

    public bool SetConsentFetchRequest(
        string pollId,
        string consentArtefactId,
        string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (!TryFindTransfer(pollId, consentArtefactId, out var transfer))
            {
                return false;
            }

            transfer.ConsentFetchRequestId = requestId;
            _consentFetchRequests[requestId] = GetTransferKey(pollId, consentArtefactId);
            return true;
        }
    }

    public bool TryGetForConsentFetch(
        string requestId,
        string hiuId,
        out TransferSnapshot? transfer)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            transfer = null;
            if (!_consentFetchRequests.TryGetValue(requestId, out var key) ||
                !_transfers.TryGetValue(key, out var found) ||
                !string.Equals(found.HiuId, hiuId, StringComparison.Ordinal))
            {
                return false;
            }

            transfer = Snapshot(found);
            return true;
        }
    }

    public bool SetConsentDetails(
        string pollId,
        string consentArtefactId,
        ConsentDetailsSummary details)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (!TryFindTransfer(pollId, consentArtefactId, out var transfer))
            {
                return false;
            }

            transfer.Consent = details;
            transfer.Status = "REQUESTING_DATA";
            return true;
        }
    }

    public bool SetKeyMaterial(
        string pollId,
        string consentArtefactId,
        FideliusKeyMaterial keyMaterial,
        string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (!TryFindTransfer(pollId, consentArtefactId, out var transfer))
            {
                return false;
            }

            transfer.PrivateKey = keyMaterial.PrivateKey;
            transfer.PublicKey = keyMaterial.PublicKey;
            transfer.Nonce = keyMaterial.Nonce;
            transfer.HealthRequestId = requestId;
            _healthRequests[requestId] = GetTransferKey(pollId, consentArtefactId);
            return true;
        }
    }

    public void AddTransaction(string requestId, string? transactionId)
    {
        if (string.IsNullOrWhiteSpace(transactionId))
        {
            return;
        }

        lock (_sync)
        {
            if (_healthRequests.TryGetValue(requestId, out var key))
            {
                _transactions[transactionId] = key;
            }
        }
    }

    public bool TryGetForHealthRequest(
        string requestId,
        string hiuId,
        out TransferSnapshot? transfer)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            transfer = null;
            if (!_healthRequests.TryGetValue(requestId, out var key) ||
                !_transfers.TryGetValue(key, out var found) ||
                !string.Equals(found.HiuId, hiuId, StringComparison.Ordinal))
            {
                return false;
            }

            transfer = Snapshot(found);
            return true;
        }
    }

    public bool TryGetForDataPush(
        string? transactionId,
        string? hipId,
        out TransferSnapshot? transfer)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            transfer = null;
            if (string.IsNullOrWhiteSpace(transactionId) ||
                !_transactions.TryGetValue(transactionId, out var key) ||
                !_transfers.TryGetValue(key, out var found) ||
                (!string.IsNullOrWhiteSpace(hipId) &&
                 !string.Equals(
                     found.Consent?.HipId,
                     hipId,
                     StringComparison.Ordinal)))
            {
                return false;
            }

            transfer = Snapshot(found);
            if (found.Status is "COMPLETED" or "REVOKED" or "FAILED")
            {
                return true;
            }

            if (found.Consent is null ||
                found.PrivateKey is null ||
                found.Nonce is null)
            {
                transfer = null;
                return false;
            }

            return true;
        }
    }

    public bool AddPage(
        string pollId,
        string consentArtefactId,
        int pageNumber,
        int pageCount,
        IReadOnlyList<JsonElement> records)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (!TryFindTransfer(pollId, consentArtefactId, out var transfer) ||
                transfer.Status is "REVOKED" or "FAILED" ||
                pageNumber < 1 ||
                pageCount < 1 ||
                pageNumber > pageCount)
            {
                return false;
            }

            transfer.Pages.TryAdd(pageNumber, records.ToArray());
            transfer.PageCount = Math.Max(transfer.PageCount, pageCount);
            transfer.Status = transfer.Pages.Count >= transfer.PageCount
                ? "COMPLETED"
                : "RECEIVING";
            if (transfer.Status == "COMPLETED")
            {
                transfer.ClearKeys();
            }

            return true;
        }
    }

    public void MarkFailed(string pollId, string consentArtefactId, string error)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (TryFindTransfer(pollId, consentArtefactId, out var transfer) &&
                transfer.Status is not ("COMPLETED" or "REVOKED"))
            {
                transfer.Status = "FAILED";
                transfer.Error = error;
                transfer.ClearKeys();
            }
        }
    }

    public void MarkFailedByFetchRequest(string requestId, string error)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (_consentFetchRequests.TryGetValue(requestId, out var key) &&
                _transfers.TryGetValue(key, out var transfer))
            {
                transfer.Status = "FAILED";
                transfer.Error = error;
                transfer.ClearKeys();
            }
        }
    }

    public void MarkRevoked(string consentRequestId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            foreach (var transfer in _transfers.Values.Where(item =>
                         string.Equals(
                             item.ConsentRequestId,
                             consentRequestId,
                             StringComparison.Ordinal)))
            {
                transfer.Status = "REVOKED";
                transfer.Error = "The patient revoked this consent.";
                transfer.Pages.Clear();
                transfer.ClearKeys();
            }
        }
    }

    public ConsentDataFetchResult? Poll(string pollId, string consentArtefactId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            if (!TryFindTransfer(pollId, consentArtefactId, out var transfer))
            {
                return null;
            }

            var records = transfer.Status == "COMPLETED"
                ? transfer.Pages.OrderBy(page => page.Key)
                    .SelectMany(page => page.Value)
                    .ToArray()
                : [];
            return new ConsentDataFetchResult(
                transfer.Status,
                transfer.Error,
                transfer.Consent,
                records);
        }
    }

    public TransferSnapshot? GetSnapshot(string pollId, string consentArtefactId)
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
            return TryFindTransfer(pollId, consentArtefactId, out var transfer)
                ? Snapshot(transfer)
                : null;
        }
    }

    public void CleanupExpiredTransfers()
    {
        lock (_sync)
        {
            RemoveExpiredTransfers();
        }
    }

    private bool TryFindTransfer(
        string pollId,
        string consentArtefactId,
        out Transfer transfer) =>
        _transfers.TryGetValue(GetTransferKey(pollId, consentArtefactId), out transfer!);

    private void RemoveExpiredTransfers()
    {
        var expiredKeys = _transfers
            .Where(item =>
                item.Value.ExpiresAt <= DateTimeOffset.UtcNow ||
                item.Value.Consent?.DataEraseAt <= DateTimeOffset.UtcNow)
            .Select(item => item.Key)
            .ToHashSet(StringComparer.Ordinal);
        foreach (var key in expiredKeys)
        {
            RemoveTransfer(key);
        }
    }

    private void RemoveTransfer(string key)
    {
        if (!_transfers.Remove(key, out var transfer))
        {
            return;
        }

        transfer.ClearKeys();
        if (transfer.ConsentFetchRequestId is not null)
        {
            _consentFetchRequests.Remove(transfer.ConsentFetchRequestId);
        }

        if (transfer.HealthRequestId is not null)
        {
            _healthRequests.Remove(transfer.HealthRequestId);
            foreach (var transactionId in _transactions
                         .Where(item => item.Value == key)
                         .Select(item => item.Key)
                         .ToArray())
            {
                _transactions.Remove(transactionId);
            }
        }
    }

    private static string GetTransferKey(string pollId, string consentArtefactId) =>
        $"{pollId.Trim()}:{consentArtefactId.Trim()}";

    private static TransferSnapshot Snapshot(Transfer transfer) =>
        new(
            transfer.PollId,
            transfer.ConsentRequestId,
            transfer.ConsentArtefactId,
            transfer.HiuId,
            transfer.PatientAddress,
            transfer.Status,
            transfer.ConsentFetchRequestId,
            transfer.HealthRequestId,
            transfer.Consent,
            transfer.PrivateKey,
            transfer.PublicKey,
            transfer.Nonce,
            transfer.Error,
            transfer.ExpiresAt);

    private sealed class Transfer(
        string pollId,
        string consentRequestId,
        string patientAddress,
        string consentArtefactId,
        string hiuId,
        DateTimeOffset expiresAt)
    {
        public string PollId { get; } = pollId;
        public string ConsentRequestId { get; } = consentRequestId;
        public string PatientAddress { get; } = patientAddress;
        public string ConsentArtefactId { get; } = consentArtefactId;
        public string HiuId { get; } = hiuId;
        public DateTimeOffset ExpiresAt { get; } = expiresAt;
        public string Status { get; set; } = "FETCHING_CONSENT";
        public string? ConsentFetchRequestId { get; set; }
        public string? HealthRequestId { get; set; }
        public string? PrivateKey { get; set; }
        public string? PublicKey { get; set; }
        public string? Nonce { get; set; }
        public string? Error { get; set; }
        public ConsentDetailsSummary? Consent { get; set; }
        public int PageCount { get; set; }
        public Dictionary<int, JsonElement[]> Pages { get; } = [];

        public void ClearKeys()
        {
            PrivateKey = null;
            PublicKey = null;
            Nonce = null;
        }
    }
}

public sealed record TransferSnapshot(
    string PollId,
    string ConsentRequestId,
    string ConsentArtefactId,
    string HiuId,
    string PatientAddress,
    string Status,
    string? ConsentFetchRequestId,
    string? HealthRequestId,
    ConsentDetailsSummary? Consent,
    string? PrivateKey,
    string? PublicKey,
    string? Nonce,
    string? Error,
    DateTimeOffset ExpiresAt);

public sealed record ConsentFetchWorkItem(string PollId, string ConsentArtefactId);

public sealed class AbdmM3Queue
{
    private readonly Channel<ConsentFetchWorkItem> _channel =
        Channel.CreateBounded<ConsentFetchWorkItem>(
            new BoundedChannelOptions(100)
            {
                FullMode = BoundedChannelFullMode.Wait,
                SingleReader = true,
                SingleWriter = false,
            });

    public bool TryEnqueue(ConsentFetchWorkItem item) => _channel.Writer.TryWrite(item);

    public IAsyncEnumerable<ConsentFetchWorkItem> ReadAllAsync(
        CancellationToken cancellationToken) =>
        _channel.Reader.ReadAllAsync(cancellationToken);
}

public sealed class AbdmM3CleanupWorker : BackgroundService
{
    private readonly AbdmM3Store _store;

    public AbdmM3CleanupWorker(AbdmM3Store store)
    {
        _store = store;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        using var timer = new PeriodicTimer(TimeSpan.FromMinutes(5));
        while (await timer.WaitForNextTickAsync(stoppingToken))
        {
            _store.CleanupExpiredTransfers();
        }
    }
}

public sealed class AbdmM3Client
{
    private readonly HttpClient _httpClient;
    private readonly AbdmSessionTokenProvider _tokenProvider;
    private readonly AbdmM3Options _options;

    public AbdmM3Client(
        HttpClient httpClient,
        AbdmSessionTokenProvider tokenProvider,
        AbdmM3Options options)
    {
        _httpClient = httpClient;
        _tokenProvider = tokenProvider;
        _options = options;
    }

    public async Task FetchConsentAsync(
        string requestId,
        string consentArtefactId,
        string hiuId,
        CancellationToken cancellationToken)
    {
        using var response = await SendGatewayRequestAsync(
            _options.ConsentFetchUrl,
            requestId,
            hiuId,
            new
            {
                requestId,
                timestamp = DateTimeOffset.UtcNow,
                consentId = consentArtefactId,
            },
            cancellationToken);
    }

    public async Task<string?> RequestHealthInformationAsync(
        TransferSnapshot transfer,
        CancellationToken cancellationToken)
    {
        if (transfer.Consent is null ||
            transfer.PublicKey is null ||
            transfer.Nonce is null ||
            transfer.HealthRequestId is null)
        {
            throw new InvalidOperationException("The consent transfer is missing request material.");
        }

        using var response = await SendGatewayRequestAsync(
            _options.HealthInformationRequestUrl,
            transfer.HealthRequestId,
            transfer.HiuId,
            new
            {
                requestId = transfer.HealthRequestId,
                timestamp = DateTimeOffset.UtcNow,
                hiRequest = new
                {
                    consent = new { id = transfer.ConsentArtefactId },
                    dateRange = new
                    {
                        from = transfer.Consent.From,
                        to = transfer.Consent.To,
                    },
                    dataPushUrl = _options.DataPushUrl,
                    keyMaterial = new
                    {
                        cryptoAlg = "ECDH",
                        curve = "Curve25519",
                        dhPublicKey = new
                        {
                            expiry = DateTimeOffset.UtcNow.AddMinutes(10),
                            parameters = "Curve25519/32byte random key",
                            keyValue = transfer.PublicKey,
                        },
                        nonce = transfer.Nonce,
                    },
                },
            },
            cancellationToken);

        if (response.Content.Headers.ContentLength == 0)
        {
            return null;
        }

        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);
        if (string.IsNullOrWhiteSpace(responseBody))
        {
            return null;
        }

        try
        {
            using var document = JsonDocument.Parse(responseBody);
            return TryReadString(document.RootElement, "transactionId");
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private async Task<HttpResponseMessage> SendGatewayRequestAsync(
        string url,
        string requestId,
        string hiuId,
        object body,
        CancellationToken cancellationToken)
    {
        var accessToken = await _tokenProvider.GetAccessTokenAsync(cancellationToken);
        using var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = JsonContent.Create(body),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
        request.Headers.TryAddWithoutValidation("REQUEST-ID", requestId);
        request.Headers.TryAddWithoutValidation(
            "TIMESTAMP",
            DateTimeOffset.UtcNow.ToString("O"));
        request.Headers.TryAddWithoutValidation("X-CM-ID", _options.CmId);
        request.Headers.TryAddWithoutValidation("X-HIU-ID", hiuId);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (response.IsSuccessStatusCode)
        {
            return response;
        }

        var status = (int)response.StatusCode;
        response.Dispose();
        throw new HttpRequestException(
            $"ABDM M3 request returned HTTP {status}.",
            null,
            (System.Net.HttpStatusCode)status);
    }

    internal static string? TryReadString(JsonElement element, string propertyName)
    {
        if (element.ValueKind != JsonValueKind.Object)
        {
            return null;
        }

        foreach (var property in element.EnumerateObject())
        {
            if (string.Equals(property.Name, propertyName, StringComparison.OrdinalIgnoreCase) &&
                property.Value.ValueKind == JsonValueKind.String)
            {
                return property.Value.GetString();
            }
        }

        return null;
    }
}

public sealed class AbdmM3Worker : BackgroundService
{
    private readonly AbdmM3Queue _queue;
    private readonly AbdmM3Store _store;
    private readonly AbdmConsentStore _consentStore;
    private readonly AbdmM3Client _client;
    private readonly AbdmFideliusClient _fidelius;
    private readonly ILogger<AbdmM3Worker> _logger;

    public AbdmM3Worker(
        AbdmM3Queue queue,
        AbdmM3Store store,
        AbdmConsentStore consentStore,
        AbdmM3Client client,
        AbdmFideliusClient fidelius,
        ILogger<AbdmM3Worker> logger)
    {
        _queue = queue;
        _store = store;
        _consentStore = consentStore;
        _client = client;
        _fidelius = fidelius;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await foreach (var item in _queue.ReadAllAsync(stoppingToken))
        {
            try
            {
                await ProcessAsync(item, stoppingToken);
            }
            catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
            {
                break;
            }
            catch (Exception exception)
            {
                _store.MarkFailed(item.PollId, item.ConsentArtefactId, exception.Message);
                _logger.LogError(
                    exception,
                    "ABDM M3 transfer failed for consent artefact.");
            }
        }
    }

    private async Task ProcessAsync(
        ConsentFetchWorkItem item,
        CancellationToken cancellationToken)
    {
        var transfer = _store.GetSnapshot(item.PollId, item.ConsentArtefactId);
        var registration = _consentStore.GetGrantedRequest(
            item.PollId,
            item.ConsentArtefactId);
        if (transfer is null ||
            registration is null ||
            transfer.Status != "REQUESTING_DATA" ||
            transfer.Consent is null)
        {
            throw new InvalidOperationException(
                "The approved consent transfer is no longer available.");
        }

        var keys = await _fidelius.GenerateKeysAsync(cancellationToken);
        var requestId = Guid.NewGuid().ToString();
        if (!_store.SetKeyMaterial(
                item.PollId,
                item.ConsentArtefactId,
                keys,
                requestId))
        {
            throw new InvalidOperationException("The consent transfer could not be prepared.");
        }

        var transactionId = await _client.RequestHealthInformationAsync(
            _store.GetSnapshot(item.PollId, item.ConsentArtefactId)
                ?? throw new InvalidOperationException(
                    "The consent transfer expired before request."),
            cancellationToken);
        _store.AddTransaction(requestId, transactionId);
    }
}

public sealed class AbdmM3Coordinator
{
    private readonly AbdmM3Store _store;
    private readonly AbdmConsentStore _consentStore;
    private readonly AbdmM3Queue _queue;
    private readonly AbdmM3Client _client;
    private readonly AbdmFideliusClient _fidelius;

    public AbdmM3Coordinator(
        AbdmM3Store store,
        AbdmConsentStore consentStore,
        AbdmM3Queue queue,
        AbdmM3Client client,
        AbdmFideliusClient fidelius)
    {
        _store = store;
        _consentStore = consentStore;
        _queue = queue;
        _client = client;
        _fidelius = fidelius;
    }

    public async Task<bool> StartFetchAsync(
        string pollId,
        string consentArtefactId,
        CancellationToken cancellationToken)
    {
        var registration = _consentStore.GetGrantedRequest(pollId, consentArtefactId);
        if (registration is null)
        {
            return false;
        }

        var (_, created) = _store.StartTransfer(
            pollId,
            registration.ConsentRequestId,
            registration.PatientAddress,
            consentArtefactId,
            registration.HiuId);
        if (!created)
        {
            return true;
        }

        var requestId = Guid.NewGuid().ToString();
        _store.SetConsentFetchRequest(pollId, consentArtefactId, requestId);
        try
        {
            await _client.FetchConsentAsync(
                requestId,
                consentArtefactId,
                registration.HiuId,
                cancellationToken);
            return true;
        }
        catch (Exception exception)
        {
            _store.MarkFailed(pollId, consentArtefactId, exception.Message);
            throw;
        }
    }

    public bool OnConsentFetched(
        string requestId,
        string hiuId,
        JsonElement callback)
    {
        if (!_store.TryGetForConsentFetch(requestId, hiuId, out var transfer) ||
            transfer is null)
        {
            return false;
        }

        if (transfer.Status != "FETCHING_CONSENT")
        {
            return true;
        }

        if (!TryGetProperty(callback, "consent", out var consent) ||
            TryGetProperty(callback, "error", out var error) &&
            error.ValueKind is not (JsonValueKind.Null or JsonValueKind.Undefined) ||
            !TryGetProperty(consent, "consentDetail", out var details) ||
            !TryBuildConsentSummary(details, transfer, out var summary))
        {
            _store.MarkFailedByFetchRequest(
                requestId,
                "ABDM returned an invalid or non-granted consent artefact.");
            return true;
        }

        if (!string.Equals(
                AbdmM3Client.TryReadString(consent, "status"),
                "GRANTED",
                StringComparison.OrdinalIgnoreCase) ||
            !_store.SetConsentDetails(
                transfer.PollId,
                transfer.ConsentArtefactId,
                summary!))
        {
            _store.MarkFailedByFetchRequest(
                requestId,
                "The fetched consent is not granted or does not match the request.");
            return true;
        }

        if (!_queue.TryEnqueue(
                new ConsentFetchWorkItem(transfer.PollId, transfer.ConsentArtefactId)))
        {
            _store.MarkFailedByFetchRequest(
                requestId,
                "The M3 processing queue is full. Retry the records request.");
        }

        return true;
    }

    public async Task<bool> ReceiveDataPushAsync(
        string? hipId,
        JsonElement callback,
        CancellationToken cancellationToken)
    {
        var transactionId = AbdmM3Client.TryReadString(callback, "transactionId");
        if (!_store.TryGetForDataPush(
                transactionId,
                hipId,
                out var transfer) ||
            transfer is null)
        {
            return false;
        }

        if (transfer.Status is "COMPLETED" or "REVOKED" or "FAILED")
        {
            return true;
        }

        if (!TryGetProperty(callback, "entries", out var entries) ||
            entries.ValueKind != JsonValueKind.Array)
        {
            _store.MarkFailed(
                transfer.PollId,
                transfer.ConsentArtefactId,
                "ABDM data push did not contain health record entries.");
            return true;
        }

        var decryptedRecords = new List<JsonElement>();
        foreach (var entry in entries.EnumerateArray())
        {
            if (!TryGetProperty(entry, "content", out var content) ||
                content.ValueKind != JsonValueKind.String ||
                !TryGetKeyMaterial(entry, callback, out var senderPublicKey, out var senderNonce))
            {
                _store.MarkFailed(
                    transfer.PollId,
                    transfer.ConsentArtefactId,
                    "ABDM data push entry is missing encrypted content or key material.");
                return true;
            }

            string plaintext;
            try
            {
                plaintext = await _fidelius.DecryptAsync(
                    new FideliusDecryptRequest(
                        transfer.PrivateKey!,
                        transfer.Nonce!,
                        senderPublicKey,
                        senderNonce,
                        content.GetString()!),
                    cancellationToken);
            }
            catch (Exception exception) when (exception is not OperationCanceledException)
            {
                _store.MarkFailed(
                    transfer.PollId,
                    transfer.ConsentArtefactId,
                    "The encrypted health record could not be decrypted.");
                return true;
            }
            if (!TryParseFhirPayload(plaintext, out var record))
            {
                _store.MarkFailed(
                    transfer.PollId,
                    transfer.ConsentArtefactId,
                    "The decrypted health record is not valid JSON.");
                return true;
            }

            decryptedRecords.Add(record);
        }

        var pageNumber = TryReadInt(callback, "pageNumber");
        var pageCount = TryReadInt(callback, "pageCount");
        if (pageNumber is null || pageCount is null)
        {
            _store.MarkFailed(
                transfer.PollId,
                transfer.ConsentArtefactId,
                "ABDM data push is missing the required pageNumber or pageCount.");
            return true;
        }

        return _store.AddPage(
            transfer.PollId,
            transfer.ConsentArtefactId,
            pageNumber.Value,
            pageCount.Value,
            decryptedRecords);
    }

    public bool OnHealthInformationRequested(
        string requestId,
        string hiuId,
        JsonElement callback)
    {
        if (!_store.TryGetForHealthRequest(requestId, hiuId, out var transfer) ||
            transfer is null)
        {
            return false;
        }

        var hiRequest = TryGetProperty(callback, "hiRequest", out var request)
            ? request
            : callback;
        var sessionStatus = AbdmM3Client.TryReadString(hiRequest, "sessionStatus");
        if (!string.Equals(
                sessionStatus,
                "ACKNOWLEDGED",
                StringComparison.OrdinalIgnoreCase))
        {
            var errorMessage = TryGetProperty(callback, "error", out var error)
                ? AbdmM3Client.TryReadString(error, "message")
                : null;
            _store.MarkFailed(
                transfer.PollId,
                transfer.ConsentArtefactId,
                errorMessage ?? $"ABDM did not acknowledge the health request (status: {sessionStatus ?? "unknown"}).");
            return true;
        }

        var transactionId = AbdmM3Client.TryReadString(hiRequest, "transactionId");
        if (string.IsNullOrWhiteSpace(transactionId))
        {
            _store.MarkFailed(
                transfer.PollId,
                transfer.ConsentArtefactId,
                "ABDM acknowledged the health request without a transaction ID.");
            return true;
        }

        _store.AddTransaction(requestId, transactionId);
        return true;
    }

    private static bool TryBuildConsentSummary(
        JsonElement details,
        TransferSnapshot transfer,
        out ConsentDetailsSummary? summary)
    {
        summary = null;
        if (!string.Equals(
                AbdmM3Client.TryReadString(details, "consentId"),
                transfer.ConsentArtefactId,
                StringComparison.Ordinal) ||
            !TryGetProperty(details, "patient", out var patient) ||
            !string.Equals(
                AbdmM3Client.TryReadString(patient, "id"),
                transfer.PatientAddress,
                StringComparison.OrdinalIgnoreCase) ||
            !TryGetProperty(details, "hiu", out var hiu) ||
            !string.Equals(
                AbdmM3Client.TryReadString(hiu, "id"),
                transfer.HiuId,
                StringComparison.Ordinal) ||
            !TryGetProperty(details, "hip", out var hip) ||
            !TryGetProperty(details, "permission", out var permission) ||
            !TryGetProperty(permission, "dateRange", out var range) ||
            !DateTimeOffset.TryParse(
                AbdmM3Client.TryReadString(range, "from"),
                out var from) ||
            !DateTimeOffset.TryParse(
                AbdmM3Client.TryReadString(range, "to"),
                out var to) ||
            to < from)
        {
            return false;
        }

        var hiTypes = TryGetProperty(details, "hiTypes", out var types) &&
                      types.ValueKind == JsonValueKind.Array
            ? types.EnumerateArray()
                .Where(type => type.ValueKind == JsonValueKind.String)
                .Select(type => type.GetString()!)
                .ToArray()
            : [];
        if (hiTypes.Length == 0)
        {
            return false;
        }

        DateTimeOffset? eraseAt = null;
        if (TryGetProperty(permission, "dataEraseAt", out var eraseElement) &&
            eraseElement.ValueKind == JsonValueKind.String &&
            DateTimeOffset.TryParse(eraseElement.GetString(), out var parsedEraseAt))
        {
            eraseAt = parsedEraseAt;
        }

        summary = new ConsentDetailsSummary(
            transfer.ConsentArtefactId,
            AbdmM3Client.TryReadString(patient, "id")!,
            AbdmM3Client.TryReadString(hip, "id") ?? "",
            transfer.HiuId,
            hiTypes,
            AbdmM3Client.TryReadString(permission, "accessMode") ?? "",
            from,
            to,
            eraseAt);
        return true;
    }

    private static bool TryGetKeyMaterial(
        JsonElement entry,
        JsonElement root,
        out string senderPublicKey,
        out string senderNonce)
    {
        senderPublicKey = "";
        senderNonce = "";
        if (!TryGetProperty(entry, "keyMaterial", out var keyMaterial) &&
            !TryGetProperty(root, "keyMaterial", out keyMaterial))
        {
            return false;
        }

        if (!TryGetProperty(keyMaterial, "dhPublicKey", out var dhPublicKey))
        {
            return false;
        }

        senderPublicKey = AbdmM3Client.TryReadString(dhPublicKey, "keyValue") ?? "";
        senderNonce = AbdmM3Client.TryReadString(keyMaterial, "nonce") ?? "";
        return !string.IsNullOrWhiteSpace(senderPublicKey) &&
               !string.IsNullOrWhiteSpace(senderNonce);
    }

    private static bool TryParseFhirPayload(string plaintext, out JsonElement record)
    {
        try
        {
            using var document = JsonDocument.Parse(plaintext);
            record = document.RootElement.Clone();
            return true;
        }
        catch (JsonException)
        {
            try
            {
                var decoded = Encoding.UTF8.GetString(Convert.FromBase64String(plaintext));
                using var document = JsonDocument.Parse(decoded);
                record = document.RootElement.Clone();
                return true;
            }
            catch (Exception exception) when (
                exception is FormatException or JsonException)
            {
                record = default;
                return false;
            }
        }
    }

    private static int? TryReadInt(JsonElement element, string propertyName)
    {
        if (!TryGetProperty(element, propertyName, out var value))
        {
            return null;
        }

        return value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var number)
            ? number
            : null;
    }

    private static bool TryGetProperty(
        JsonElement element,
        string propertyName,
        out JsonElement value)
    {
        if (element.ValueKind == JsonValueKind.Object)
        {
            foreach (var property in element.EnumerateObject())
            {
                if (string.Equals(
                        property.Name,
                        propertyName,
                        StringComparison.OrdinalIgnoreCase))
                {
                    value = property.Value;
                    return true;
                }
            }
        }

        value = default;
        return false;
    }
}
