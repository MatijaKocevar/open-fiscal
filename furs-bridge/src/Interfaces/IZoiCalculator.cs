namespace FursBridge.Interfaces;

public interface IZoiCalculator
{
    string Calculate(string taxNumber, string issueDateTime, string invoiceNumber,
        string premiseId, string deviceId, decimal invoiceAmount);
}
