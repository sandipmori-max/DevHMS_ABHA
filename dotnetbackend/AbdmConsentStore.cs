using System.Security.Cryptography;
using System.Text.Json;

namespace DevHms.Abdm.CallbackApi;

public sealed class AbdmConsentStore
{
    private static readonly TimeSpan RequestLifetime = TimeSpan.FromHours(24);
    private readonly object _sync = new();
    private readonly Dictionary<string, PendingConsentRequest> _requestsByPollId =
        new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _pollIdsByRequestId =
        new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, string> _pollIdsByConsentRequestId =
        new(StringComparer.OrdinalIgnoreCase);

    public bool TryCreateRequest(
        string requestId,
        string patientAddress,
        string hiuId,
        out CreatedConsentRequest? createdRequest)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (_pollIdsByRequestId.ContainsKey(requestId.Trim()))
            {
                createdRequest = null;
                return false;
            }

            var pollId = Convert.ToHexString(RandomNumberGenerator.GetBytes(32))
                .ToLowerInvariant();
            var request = new PendingConsentRequest(
                pollId,
                requestId.Trim(),
                patientAddress.Trim(),
                hiuId.Trim(),
                DateTimeOffset.UtcNow.Add(RequestLifetime));
            _requestsByPollId.Add(pollId, request);
            _pollIdsByRequestId.Add(request.RequestId, pollId);
            createdRequest = new CreatedConsentRequest(pollId, request.ExpiresAt);
            return true;
        }
    }

    public bool CancelRequest(string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (!_pollIdsByRequestId.TryGetValue(requestId.Trim(), out var pollId) ||
                !_requestsByPollId.TryGetValue(pollId, out var request))
            {
                return false;
            }

            RemoveRequest(request);
            return true;
        }
    }

    public bool SaveRequestInit(
        HiuConsentRequestInitCallback callback,
        string? callbackHiuId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var requestId = callback.Response?.RequestId?.Trim();
            var hiuId = callbackHiuId?.Trim();
            if (string.IsNullOrWhiteSpace(requestId) ||
                string.IsNullOrWhiteSpace(hiuId) ||
                !_pollIdsByRequestId.TryGetValue(requestId, out var pollId) ||
                !_requestsByPollId.TryGetValue(pollId, out var request) ||
                !string.Equals(request.HiuId, hiuId, StringComparison.Ordinal))
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(callback.ConsentRequest?.Id))
            {
                var consentRequestId = callback.ConsentRequest.Id.Trim();
                if (_pollIdsByConsentRequestId.TryGetValue(consentRequestId, out var otherPollId) &&
                    !string.Equals(otherPollId, pollId, StringComparison.Ordinal))
                {
                    return false;
                }

                _pollIdsByConsentRequestId[consentRequestId] = pollId;
                _requestsByPollId[pollId] = request with
                {
                    ConsentRequestId = consentRequestId,
                    Status = "REQUESTED",
                    Error = null,
                };
                return true;
            }

            var errorMessage = ReadErrorMessage(callback.Error);
            if (string.IsNullOrWhiteSpace(errorMessage))
            {
                return false;
            }

            _requestsByPollId[pollId] = request with
            {
                Status = "FAILED",
                Error = errorMessage,
            };
            return true;
        }
    }

    public bool SaveNotification(
        HiuConsentNotificationCallback callback,
        string? callbackHiuId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var notification = callback.Notification;
            var consentRequestId = notification?.ConsentRequestId?.Trim();
            var status = notification?.Status?.Trim().ToUpperInvariant();
            var hiuId = callbackHiuId?.Trim();
            if (string.IsNullOrWhiteSpace(consentRequestId) ||
                string.IsNullOrWhiteSpace(status) ||
                string.IsNullOrWhiteSpace(hiuId) ||
                status is not ("GRANTED" or "DENIED" or "EXPIRED" or "REVOKED") ||
                !_pollIdsByConsentRequestId.TryGetValue(consentRequestId, out var pollId) ||
                !_requestsByPollId.TryGetValue(pollId, out var request) ||
                !string.Equals(request.HiuId, hiuId, StringComparison.Ordinal))
            {
                return false;
            }

            var artefactIds = (notification!.ConsentArtefacts ?? [])
                .Select(artefact => artefact.Id?.Trim())
                .Where(id => !string.IsNullOrWhiteSpace(id))
                .Select(id => id!)
                .Distinct(StringComparer.Ordinal)
                .ToArray();
            if ((status is "GRANTED" or "REVOKED") && artefactIds.Length == 0)
            {
                return false;
            }

            _requestsByPollId[pollId] = request with
            {
                Status = status,
                ConsentArtefactIds = artefactIds,
            };
            return true;
        }
    }

    public ConsentRequestPollResult? PollRequest(string pollId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (!_requestsByPollId.TryGetValue(pollId.Trim(), out var request))
            {
                return null;
            }

            return new ConsentRequestPollResult(
                request.Status ?? "PENDING",
                request.ConsentRequestId,
                request.ConsentArtefactIds,
                request.Error);
        }
    }

    private void RemoveExpiredRequests()
    {
        var expiredRequests = _requestsByPollId.Values
            .Where(request => request.ExpiresAt <= DateTimeOffset.UtcNow)
            .ToArray();

        foreach (var request in expiredRequests)
        {
            RemoveRequest(request);
        }
    }

    private void RemoveRequest(PendingConsentRequest request)
    {
        _requestsByPollId.Remove(request.PollId);
        _pollIdsByRequestId.Remove(request.RequestId);
        if (request.ConsentRequestId is not null)
        {
            _pollIdsByConsentRequestId.Remove(request.ConsentRequestId);
        }
    }

    private static string? ReadErrorMessage(JsonElement? error)
    {
        if (error is not { } value ||
            value.ValueKind is JsonValueKind.Null or JsonValueKind.Undefined)
        {
            return null;
        }

        if (value.ValueKind == JsonValueKind.Object &&
            value.TryGetProperty("message", out var message) &&
            message.ValueKind == JsonValueKind.String)
        {
            return message.GetString();
        }

        return value.ValueKind == JsonValueKind.String
            ? value.GetString()
            : value.GetRawText();
    }

    private sealed record PendingConsentRequest(
        string PollId,
        string RequestId,
        string PatientAddress,
        string HiuId,
        DateTimeOffset ExpiresAt,
        string? ConsentRequestId = null,
        string? Status = null,
        string[]? StoredArtefactIds = null,
        string? Error = null)
    {
        public string[] ConsentArtefactIds { get; init; } = StoredArtefactIds ?? [];
    }
}

public sealed record CreatedConsentRequest(string PollId, DateTimeOffset ExpiresAt);

public sealed record CreateConsentRequestRegistration(
    string? RequestId,
    string? PatientAddress,
    string? HiuId);

public sealed record CancelConsentRequestRegistration(string? RequestId);

public sealed record PollConsentRequest(string? PollId);

public sealed record ConsentRequestPollResult(
    string Status,
    string? ConsentRequestId,
    IReadOnlyList<string> ConsentArtefactIds,
    string? Error);

public sealed record HiuConsentRequestInitCallback(
    ConsentRequestCallbackDetails? ConsentRequest,
    JsonElement? Error,
    CallbackResponse? Response);

public sealed record ConsentRequestCallbackDetails(string? Id);

public sealed record HiuConsentNotificationCallback(
    HiuConsentNotification? Notification);

public sealed record HiuConsentNotification(
    string? ConsentRequestId,
    string? Status,
    List<ConsentArtefact>? ConsentArtefacts);

public sealed record ConsentArtefact(string? Id);
