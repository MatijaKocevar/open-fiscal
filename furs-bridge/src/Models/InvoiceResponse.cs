using System.Text.Json.Serialization;

namespace Bridge.Models;

public class InvoiceResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("eor")]
    public string Eor { get; init; } = string.Empty;

    [JsonPropertyName("zoi")]
    public string Zoi { get; init; } = string.Empty;

    [JsonPropertyName("jir")]
    public string Jir { get; init; } = string.Empty;

    [JsonPropertyName("qrCode")]
    public string? QrCode { get; init; }

    [JsonPropertyName("verifyUrl")]
    public string? VerifyUrl { get; init; }

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; init; }
}
