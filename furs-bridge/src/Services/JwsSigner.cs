using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Text.Json;

namespace Bridge.Services;

public class JwsSigner : IJwsSigner
{
    private readonly RSA _privateKey;
    private readonly string _subjectName;
    private readonly string _issuerName;
    private readonly string _serial;

    public JwsSigner(X509Certificate2 certificate)
    {
        _privateKey = certificate.GetRSAPrivateKey()!;
        _subjectName = certificate.Subject;
        _issuerName = certificate.Issuer;
        _serial = certificate.SerialNumber ?? "0";
    }

    public string Sign(string payloadJson)
    {
        var header = new { alg = "RS256", subject_name = _subjectName, issuer_name = _issuerName, serial = _serial };

        var headerBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(header)));
        var payloadBase64 = Base64UrlEncode(Encoding.UTF8.GetBytes(payloadJson));
        var token = $"{headerBase64}.{payloadBase64}";

        var signature = _privateKey.SignData(
            Encoding.UTF8.GetBytes(token),
            HashAlgorithmName.SHA256,
            RSASignaturePadding.Pkcs1);

        return $"{token}.{Base64UrlEncode(signature)}";
    }

    private static string Base64UrlEncode(byte[] data)
    {
        return Convert.ToBase64String(data)
            .Replace('+', '-')
            .Replace('/', '_')
            .TrimEnd('=');
    }
}
