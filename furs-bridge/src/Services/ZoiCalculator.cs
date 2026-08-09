using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;
using System.Text;

namespace Bridge.Services;

public class ZoiCalculator : IZoiCalculator
{
    private readonly RSA _privateKey;

    public ZoiCalculator(X509Certificate2 certificate)
    {
        _privateKey = certificate.GetRSAPrivateKey()!;
    }

    public string Calculate(string taxNumber, string issueDateTime, string invoiceNumber,
        string premiseId, string deviceId, decimal invoiceAmount)
    {
        var input = $"{taxNumber}{issueDateTime}{invoiceNumber}{premiseId}{deviceId}{invoiceAmount.ToString("F2", System.Globalization.CultureInfo.InvariantCulture)}";

        var signature = _privateKey.SignData(
            Encoding.UTF8.GetBytes(input),
            HashAlgorithmName.SHA256,
            RSASignaturePadding.Pkcs1);

        var md5 = MD5.HashData(signature);
        return Convert.ToHexString(md5).ToLowerInvariant();
    }
}
