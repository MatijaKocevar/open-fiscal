using System.Text.Json.Serialization;

namespace Bridge.Models;

public class EchoRequest
{
    [JsonPropertyName("EchoRequest")]
    public string EchoRequestValue { get; init; } = "furs";
}

public class EchoResponse
{
    [JsonPropertyName("EchoResponse")]
    public string EchoResponseValue { get; init; } = string.Empty;
}
