using System.Text.Json.Serialization;

namespace Bridge.Models;

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

public class DailyReportResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; init; }

    [JsonPropertyName("reportId")]
    public string ReportId { get; init; } = string.Empty;

    [JsonPropertyName("totalInvoices")]
    public int TotalInvoices { get; init; }

    [JsonPropertyName("totalGross")]
    public decimal TotalGross { get; init; }

    [JsonPropertyName("totalVat")]
    public decimal TotalVat { get; init; }

    [JsonPropertyName("timestamp")]
    public DateTime Timestamp { get; init; }
}
