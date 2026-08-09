using System.Security.Cryptography.X509Certificates;

namespace Bridge.Services;

public interface ICertificateManager
{
    X509Certificate2? LoadCertificate(string certPath, string? password);
    bool ValidateCertificate(X509Certificate2 cert);
    string GetTaxNumber(X509Certificate2 cert);
    bool IsExpiringSoon(X509Certificate2 cert, int daysThreshold = 30);
}

public class CertificateManager : ICertificateManager
{
    private readonly ILogger<CertificateManager> _logger;

    public CertificateManager(ILogger<CertificateManager> logger)
    {
        _logger = logger;
    }

    public X509Certificate2? LoadCertificate(string certPath, string? password)
    {
        if (!File.Exists(certPath))
        {
            _logger.LogWarning("Certificate file not found: {Path}", certPath);
            return null;
        }

        try
        {
            return new X509Certificate2(certPath, password,
                X509KeyStorageFlags.Exportable | X509KeyStorageFlags.MachineKeySet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load certificate from {Path}", certPath);
            return null;
        }
    }

    public bool ValidateCertificate(X509Certificate2 cert)
    {
        return cert.NotBefore <= DateTime.UtcNow && cert.NotAfter >= DateTime.UtcNow;
    }

    public string GetTaxNumber(X509Certificate2 cert)
    {
        var subject = cert.Subject;
        var parts = subject.Split(',');
        foreach (var part in parts)
        {
            var trimmed = part.Trim();
            if (trimmed.StartsWith("OID.1.2.840.113583.1.1.8=") || trimmed.StartsWith("SERIALNUMBER="))
            {
                var value = trimmed[(trimmed.IndexOf('=') + 1)..];
                return new string(value.Where(char.IsDigit).ToArray());
            }
        }
        return string.Empty;
    }

    public bool IsExpiringSoon(X509Certificate2 cert, int daysThreshold = 30)
    {
        return cert.NotAfter <= DateTime.UtcNow.AddDays(daysThreshold);
    }
}
