using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class EchoResponse
{
    [JsonPropertyName("EchoResponse")]
    public string EchoResponseValue { get; init; } = string.Empty;
}
