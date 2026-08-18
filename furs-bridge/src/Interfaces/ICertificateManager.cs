using System.Security.Cryptography.X509Certificates;

namespace FursBridge.Interfaces;

public interface ICertificateManager
{
    X509Certificate2? LoadCertificate(string certPath, string? password);
    bool ValidateCertificate(X509Certificate2 cert);
    string GetTaxNumber(X509Certificate2 cert);
    bool IsExpiringSoon(X509Certificate2 cert, int daysThreshold = 30);
}
