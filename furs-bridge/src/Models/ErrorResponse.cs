using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class ErrorResponse
{
    [JsonPropertyName("code")]
    public string Code { get; init; } = string.Empty;

    [JsonPropertyName("message")]
    public string? Message { get; init; }
}
