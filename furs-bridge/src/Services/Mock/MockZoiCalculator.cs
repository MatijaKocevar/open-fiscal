using FursBridge.Interfaces;

namespace FursBridge.Services.Mock;

public class MockZoiCalculator : IZoiCalculator
{
    public string Calculate(string taxNumber, string issueDateTime, string invoiceNumber,
        string premiseId, string deviceId, decimal invoiceAmount)
    {
        var input = $"{taxNumber}{issueDateTime}{invoiceNumber}{premiseId}{deviceId}{invoiceAmount:F2}";
        var hash = System.Security.Cryptography.MD5.HashData(
            System.Text.Encoding.UTF8.GetBytes(input));
        return "MOCK-" + Convert.ToHexString(hash).ToLowerInvariant();
    }
}
