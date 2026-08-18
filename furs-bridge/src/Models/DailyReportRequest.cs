using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class DailyReportRequest
{
    [JsonPropertyName("taxNumber")]
    public string TaxNumber { get; init; } = string.Empty;

    [JsonPropertyName("premiseId")]
    public string PremiseId { get; init; } = string.Empty;

    [JsonPropertyName("deviceId")]
    public string DeviceId { get; init; } = string.Empty;

    [JsonPropertyName("date")]
    public DateTime Date { get; init; }
}
