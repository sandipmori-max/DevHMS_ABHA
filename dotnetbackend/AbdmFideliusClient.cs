using System.Net.Http.Json;

namespace DevHms.Abdm.CallbackApi;

public sealed class AbdmFideliusClient
{
    private readonly HttpClient _httpClient;

    public AbdmFideliusClient(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<FideliusKeyMaterial> GenerateKeysAsync(
        CancellationToken cancellationToken)
    {
        using var response = await _httpClient.GetAsync(
            "keys/generate",
            cancellationToken);
        await EnsureSuccessAsync(response, "keys/generate", cancellationToken);

        var result = await response.Content.ReadFromJsonAsync<FideliusKeyMaterial>(
            cancellationToken: cancellationToken);
        if (result is null ||
            string.IsNullOrWhiteSpace(result.PrivateKey) ||
            string.IsNullOrWhiteSpace(result.PublicKey) ||
            string.IsNullOrWhiteSpace(result.Nonce))
        {
            throw new InvalidOperationException(
                "Fidelius key generation returned incomplete key material.");
        }

        return result;
    }

    public async Task<FideliusEncryptedData> EncryptAsync(
        FideliusEncryptRequest request,
        CancellationToken cancellationToken)
    {
        using var response = await _httpClient.PostAsJsonAsync(
            "encrypt",
            request,
            cancellationToken);
        await EnsureSuccessAsync(response, "encrypt", cancellationToken);

        var result = await response.Content.ReadFromJsonAsync<FideliusEncryptedData>(
            cancellationToken: cancellationToken);
        if (result is null ||
            string.IsNullOrWhiteSpace(result.EncryptedData) ||
            string.IsNullOrWhiteSpace(result.KeyToShare))
        {
            throw new InvalidOperationException(
                "Fidelius encryption returned incomplete encrypted data.");
        }

        return result;
    }

    public async Task<string> DecryptAsync(
        FideliusDecryptRequest request,
        CancellationToken cancellationToken)
    {
        using var response = await _httpClient.PostAsJsonAsync(
            "decrypt",
            request,
            cancellationToken);
        await EnsureSuccessAsync(response, "decrypt", cancellationToken);

        var result = await response.Content.ReadFromJsonAsync<FideliusDecryptedData>(
            cancellationToken: cancellationToken);
        if (string.IsNullOrWhiteSpace(result?.DecryptedData))
        {
            throw new InvalidOperationException(
                "Fidelius decryption returned no plaintext data.");
        }

        return result.DecryptedData;
    }

    private static async Task EnsureSuccessAsync(
        HttpResponseMessage response,
        string path,
        CancellationToken cancellationToken)
    {
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        throw new HttpRequestException(
            $"Fidelius endpoint '{path}' returned HTTP {(int)response.StatusCode}.",
            null,
            response.StatusCode);
    }
}

public sealed record FideliusKeyMaterial(
    string? PrivateKey,
    string? PublicKey,
    string? Nonce);

public sealed record FideliusEncryptRequest(
    string ReceiverPublicKey,
    string ReceiverNonce,
    string SenderPrivateKey,
    string SenderPublicKey,
    string SenderNonce,
    string PlainTextData);

public sealed record FideliusEncryptedData(
    string? EncryptedData,
    string? KeyToShare);

public sealed record FideliusDecryptRequest(
    string ReceiverPrivateKey,
    string ReceiverNonce,
    string SenderPublicKey,
    string SenderNonce,
    string EncryptedData);

public sealed record FideliusDecryptedData(string? DecryptedData);
