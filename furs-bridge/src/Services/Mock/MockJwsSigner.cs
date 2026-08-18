using FursBridge.Interfaces;

namespace FursBridge.Services.Mock;

public class MockJwsSigner : IJwsSigner
{
    public string Sign(string payloadJson)
    {
        var headerBase64 = "eyJhbGciOiJSUzI1NiIsInN1YmplY3RfbmFtZSI6Ik1PQ0siLCJpc3N1ZXJfbmFtZSI6Ik1PQ0siLCJzZXJpYWwiOiIwIn0";
        var payloadBase64 = Base64UrlEncode(System.Text.Encoding.UTF8.GetBytes(payloadJson));
        return $"{headerBase64}.{payloadBase64}.MOCK_SIGNATURE";
    }

    private static string Base64UrlEncode(byte[] data)
    {
        return Convert.ToBase64String(data)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }
}
