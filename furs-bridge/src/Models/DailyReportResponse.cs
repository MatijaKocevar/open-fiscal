using System.Text.Json.Serialization;

namespace FursBridge.Models;

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
