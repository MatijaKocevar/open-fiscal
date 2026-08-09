using System.Text.Json.Serialization;

namespace Bridge.Models;

public class InvoiceRequest
{
    [JsonPropertyName("taxNumber")]
    public string TaxNumber { get; init; } = string.Empty;

    [JsonPropertyName("issueDateTime")]
    public DateTime IssueDateTime { get; init; }

    [JsonPropertyName("invoiceNumber")]
    public string InvoiceNumber { get; init; } = string.Empty;

    [JsonPropertyName("premiseId")]
    public string PremiseId { get; init; } = string.Empty;

    [JsonPropertyName("deviceId")]
    public string DeviceId { get; init; } = string.Empty;

    [JsonPropertyName("invoiceAmount")]
    public decimal InvoiceAmount { get; init; }

    [JsonPropertyName("paymentMethod")]
    public string PaymentMethod { get; init; } = "CASH";

    [JsonPropertyName("items")]
    public List<InvoiceLineItem> Items { get; init; } = new();

    [JsonPropertyName("customerVatId")]
    public string? CustomerVatId { get; init; }

    [JsonPropertyName("operatorTaxNumber")]
    public string? OperatorTaxNumber { get; init; }
}

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
