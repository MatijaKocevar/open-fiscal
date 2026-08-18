using System.Text.Json.Serialization;

namespace FursBridge.Models;

public class EchoRequest
{
    [JsonPropertyName("EchoRequest")]
    public string EchoRequestValue { get; init; } = "furs";
}
