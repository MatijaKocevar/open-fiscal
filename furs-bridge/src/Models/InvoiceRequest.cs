using System.Text.Json.Serialization;

namespace FursBridge.Models;

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
