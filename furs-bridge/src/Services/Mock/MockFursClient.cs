using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Services.Mock;

public class MockFursClient : IFursClient
{
    private int _counter;

    public Task<InvoiceResponse> SendInvoice(InvoiceRequest request, CancellationToken ct = default)
    {
        var n = Interlocked.Increment(ref _counter);
        return Task.FromResult(new InvoiceResponse
        {
            Success = true,
            Eor = $"MOCK-EOR-{n:D8}",
            Zoi = Guid.NewGuid().ToString("N"),
            Jir = $"MOCK-JIR-{n:D8}",
            QrCode = $"{request.TaxNumber}|{request.IssueDateTime:dd.MM.yyyy HH:mm:ss}|{request.InvoiceNumber}|{request.PremiseId}|{request.DeviceId}|{request.InvoiceAmount:F2}|MOCK-ZOI-{n}|MOCK-EOR-{n:D8}",
            VerifyUrl = $"https://blagajne-test.fu.gov.si:9002/cash_registers/ui/check_invoice/index.html?ik=MOCK-{n:D8}",
            Timestamp = DateTime.UtcNow
        });
    }

    public Task<PremiseResponse> RegisterPremise(PremiseRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new PremiseResponse
        {
            Success = true,
            PremiseId = request.PremiseId,
            TaxNumber = request.TaxNumber,
            Status = "REGISTERED",
            Timestamp = DateTime.UtcNow
        });
    }

    public Task<PremiseResponse> ClosePremise(PremiseRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new PremiseResponse
        {
            Success = true,
            PremiseId = request.PremiseId,
            TaxNumber = request.TaxNumber,
            Status = "CLOSED",
            Timestamp = DateTime.UtcNow
        });
    }

    public Task<EchoResponse> Echo(EchoRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new EchoResponse
        {
            EchoResponseValue = request.EchoRequestValue
        });
    }

    public Task<DailyReportResponse> SendDailyReport(DailyReportRequest request, CancellationToken ct = default)
    {
        return Task.FromResult(new DailyReportResponse
        {
            Success = true,
            ReportId = Guid.NewGuid().ToString("N")[..8].ToUpper(),
            TotalInvoices = 42,
            TotalGross = 12500.50m,
            TotalVat = 2500.10m,
            Timestamp = DateTime.UtcNow
        });
    }
}
