using Bridge.Models;

namespace Bridge.Services;

public interface IFursClient
{
    Task<InvoiceResponse> SendInvoice(InvoiceRequest request, CancellationToken ct = default);
    Task<PremiseResponse> RegisterPremise(PremiseRequest request, CancellationToken ct = default);
    Task<PremiseResponse> ClosePremise(PremiseRequest request, CancellationToken ct = default);
    Task<EchoResponse> Echo(EchoRequest request, CancellationToken ct = default);
    Task<DailyReportResponse> SendDailyReport(DailyReportRequest request, CancellationToken ct = default);
}
