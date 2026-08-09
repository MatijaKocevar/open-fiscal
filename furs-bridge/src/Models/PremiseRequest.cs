using System.Text.Json.Serialization;

namespace Bridge.Models;

public class PremiseRequest
{
    [JsonPropertyName("taxNumber")]
    public string TaxNumber { get; init; } = string.Empty;

    [JsonPropertyName("premiseId")]
    public string PremiseId { get; init; } = string.Empty;

    [JsonPropertyName("premiseName")]
    public string PremiseName { get; init; } = string.Empty;

    [JsonPropertyName("address")]
    public string Address { get; init; } = string.Empty;

    [JsonPropertyName("city")]
    public string City { get; init; } = string.Empty;

    [JsonPropertyName("postalCode")]
    public string PostalCode { get; init; } = string.Empty;

    [JsonPropertyName("deviceId")]
    public string? DeviceId { get; init; }
}

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
