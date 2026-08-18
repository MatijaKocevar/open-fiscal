using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class InvoiceLineItem
{
    [JsonPropertyName("name")]
    public string Name { get; init; } = string.Empty;

    [JsonPropertyName("quantity")]
    public decimal Quantity { get; init; }

    [JsonPropertyName("unitPrice")]
    public decimal UnitPrice { get; init; }

    [JsonPropertyName("vatRate")]
    public decimal VatRate { get; init; }

    [JsonPropertyName("totalNet")]
    public decimal TotalNet { get; init; }

    [JsonPropertyName("totalVat")]
    public decimal TotalVat { get; init; }
}
