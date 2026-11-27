using System.Security.Cryptography;
using System.Text.Json;

namespace DevHms.Abdm.CallbackApi;

public sealed class AbdmCallbackStore
{
    private static readonly TimeSpan RequestLifetime = TimeSpan.FromMinutes(10);
    private static readonly TimeSpan CareContextStatusLifetime = TimeSpan.FromHours(24);
    private readonly object _sync = new();
    private readonly Dictionary<string, PendingTokenRequest> _requests = new(StringComparer.Ordinal);
    private readonly Dictionary<string, string> _requestIdsByAddress = new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, PendingCareContextRequest> _careContextRequests = new(StringComparer.OrdinalIgnoreCase);

    public bool TryCreateTokenRequest(
        string abhaAddress,
        string abdmRequestId,
        out CreatedTokenRequest? createdRequest)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var address = NormalizeAddress(abhaAddress);
            if (_requestIdsByAddress.ContainsKey(address))
            {
                createdRequest = null;
                return false;
            }

            var requestId = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLowerInvariant();
            var expiresAt = DateTimeOffset.UtcNow.Add(RequestLifetime);
            var request = new PendingTokenRequest(
                requestId,
                abhaAddress.Trim(),
                abdmRequestId,
                expiresAt);
            _requests.Add(requestId, request);
            _requestIdsByAddress.Add(address, requestId);
            createdRequest = new CreatedTokenRequest(requestId, expiresAt);
            return true;
        }
    }

    public bool SaveLinkToken(GenerateTokenCallback callback)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var address = NormalizeAddress(callback.AbhaAddress!);
            if (!_requestIdsByAddress.TryGetValue(address, out var requestId) ||
                !_requests.TryGetValue(requestId, out var request) ||
                !string.Equals(
                    request.AbdmRequestId,
                    callback.Response!.RequestId,
                    StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            _requests[requestId] = request with
            {
                LinkToken = callback.LinkToken,
                LinkTokenExpiresAt = GetJwtExpiration(callback.LinkToken!),
            };
            return true;
        }
    }

    public bool CancelTokenRequest(string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (!_requests.TryGetValue(requestId, out var request))
            {
                return false;
            }

            RemoveRequest(request);
            return true;
        }
    }

    public TokenRequestPollResult PollTokenRequest(string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (!_requests.TryGetValue(requestId, out var request))
            {
                return new TokenRequestPollResult(TokenRequestStatus.NotFound);
            }

            if (string.IsNullOrWhiteSpace(request.LinkToken))
            {
                return new TokenRequestPollResult(TokenRequestStatus.Pending);
            }

            RemoveRequest(request);
            return new TokenRequestPollResult(
                TokenRequestStatus.Ready,
                request.LinkToken,
                request.LinkTokenExpiresAt);
        }
    }

    public bool TryCreateCareContextRequest(string requestId, string abhaAddress)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var normalizedRequestId = requestId.Trim();
            return _careContextRequests.TryAdd(
                normalizedRequestId,
                new PendingCareContextRequest(
                    normalizedRequestId,
                    NormalizeAddress(abhaAddress),
                    DateTimeOffset.UtcNow.Add(CareContextStatusLifetime)));
        }
    }

    public bool CancelCareContextRequest(string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            return _careContextRequests.Remove(requestId.Trim());
        }
    }

    public bool SaveCareContextStatus(CareContextCallback callback)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            var requestId = callback.Response?.RequestId?.Trim();
            if (string.IsNullOrWhiteSpace(requestId) ||
                !_careContextRequests.TryGetValue(requestId, out var request))
            {
                return false;
            }

            if (!string.Equals(
                    request.AbhaAddress,
                    NormalizeAddress(callback.AbhaAddress!),
                    StringComparison.OrdinalIgnoreCase))
            {
                return false;
            }

            var errorJson = callback.Error is { } error &&
                            error.ValueKind is not (JsonValueKind.Null or JsonValueKind.Undefined)
                ? error.GetRawText()
                : null;

            _careContextRequests[requestId] = request with
            {
                Result = new StoredCareContextStatus(callback.Status!, errorJson),
            };
            return true;
        }
    }

    public CareContextStatusPollResult PollCareContextStatus(string requestId)
    {
        lock (_sync)
        {
            RemoveExpiredRequests();
            if (!_careContextRequests.TryGetValue(requestId.Trim(), out var request))
            {
                return new CareContextStatusPollResult(CareContextRequestStatus.NotFound);
            }

            if (request.Result is null)
            {
                return new CareContextStatusPollResult(CareContextRequestStatus.Pending);
            }

            return new CareContextStatusPollResult(
                CareContextRequestStatus.Completed,
                request.Result.Status,
                request.Result.ErrorJson);
        }
    }

    private void RemoveExpiredRequests()
    {
        var expiredRequests = _requests.Values
            .Where(request => request.ExpiresAt <= DateTimeOffset.UtcNow)
            .ToArray();

        foreach (var request in expiredRequests)
        {
            RemoveRequest(request);
        }

        var expiredCareContextRequests = _careContextRequests.Values
            .Where(request => request.ExpiresAt <= DateTimeOffset.UtcNow)
            .Select(request => request.RequestId)
            .ToArray();

        foreach (var requestId in expiredCareContextRequests)
        {
            _careContextRequests.Remove(requestId);
        }
    }

    private void RemoveRequest(PendingTokenRequest request)
    {
        _requests.Remove(request.RequestId);
        _requestIdsByAddress.Remove(NormalizeAddress(request.AbhaAddress));
    }

    private static string NormalizeAddress(string address) => address.Trim();

    private static DateTimeOffset? GetJwtExpiration(string token)
    {
        var parts = token.Split('.');
        if (parts.Length != 3)
        {
            return null;
        }

        var payload = parts[1]
            .Replace('-', '+')
            .Replace('_', '/');
        payload += new string('=', (4 - payload.Length % 4) % 4);

        try
        {
            using var document = JsonDocument.Parse(
                Convert.FromBase64String(payload));
            if (!document.RootElement.TryGetProperty("exp", out var exp) ||
                !exp.TryGetInt64(out var unixSeconds))
            {
                return null;
            }

            return DateTimeOffset.FromUnixTimeSeconds(unixSeconds);
        }
        catch (FormatException)
        {
            return null;
        }
        catch (JsonException)
        {
            return null;
        }
        catch (ArgumentOutOfRangeException)
        {
            return null;
        }
    }

    private sealed record PendingTokenRequest(
        string RequestId,
        string AbhaAddress,
        string AbdmRequestId,
        DateTimeOffset ExpiresAt,
        string? LinkToken = null,
        DateTimeOffset? LinkTokenExpiresAt = null);

    private sealed record PendingCareContextRequest(
        string RequestId,
        string AbhaAddress,
        DateTimeOffset ExpiresAt,
        StoredCareContextStatus? Result = null);

    private sealed record StoredCareContextStatus(
        string Status,
        string? ErrorJson);
}

public sealed record GenerateTokenCallback(
    string? AbhaAddress,
    string? LinkToken,
    CallbackResponse? Response);

public sealed record CareContextCallback(
    string? AbhaAddress,
    string? Status,
    CallbackResponse? Response,
    JsonElement? Error);

public sealed record CallbackResponse(string? RequestId);

public sealed record CreateLinkTokenRequest(
    string? AbhaAddress,
    string? AbdmRequestId);

public sealed record PollLinkTokenRequest(string? RequestId);

public sealed record CancelLinkTokenRequest(string? RequestId);

public sealed record CreateCareContextRequest(string? RequestId, string? AbhaAddress);

public sealed record PollCareContextRequest(string? RequestId);

public sealed record CancelCareContextRequest(string? RequestId);

public sealed record CreatedTokenRequest(string RequestId, DateTimeOffset ExpiresAt);

public sealed record TokenRequestPollResult(
    TokenRequestStatus Status,
    string? LinkToken = null,
    DateTimeOffset? ExpiresAt = null);

public sealed record CareContextStatusPollResult(
    CareContextRequestStatus Status,
    string? LinkStatus = null,
    string? Error = null);

public enum TokenRequestStatus
{
    Pending,
    Ready,
    NotFound,
}

public enum CareContextRequestStatus
{
    Pending,
    Completed,
    NotFound,
}
