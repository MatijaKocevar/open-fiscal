using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class PremiseResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("premiseId")]
    public string PremiseId { get; init; } = string.Empty;

    [JsonPropertyName("taxNumber")]
    public string TaxNumber { get; init; } = string.Empty;

    [JsonPropertyName("status")]
    public string Status { get; init; } = string.Empty;

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; init; }
}
