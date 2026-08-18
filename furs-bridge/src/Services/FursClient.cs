using System.Text;
using System.Text.Json;
using FursBridge.Exceptions;
using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Services;

public class FursClient : IFursClient
{
    private readonly HttpClient _http;
    private readonly IJwsSigner _jwsSigner;
    private readonly ILogger<FursClient> _logger;

    public FursClient(HttpClient http, IJwsSigner jwsSigner, ILogger<FursClient> logger)
    {
        _http = http;
        _jwsSigner = jwsSigner;
        _logger = logger;
    }

    public async Task<InvoiceResponse> SendInvoice(InvoiceRequest request, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(request);
        var token = _jwsSigner.Sign(payload);
        var content = new StringContent($"\"{token}\"", Encoding.UTF8, "application/json; charset=UTF-8");

        var response = await _http.PostAsync("/v1/cash_registers/invoices", content, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = JsonSerializer.Deserialize<ErrorResponse>(body)
                ?? new ErrorResponse { Code = "UNKNOWN", Message = body };
            throw new FursApiException(error.Code, error.Message ?? body);
        }

        var result = JsonSerializer.Deserialize<InvoiceResponse>(body)!;
        return result;
    }

    public async Task<PremiseResponse> RegisterPremise(PremiseRequest request, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(request);
        var token = _jwsSigner.Sign(payload);
        var content = new StringContent($"\"{token}\"", Encoding.UTF8, "application/json; charset=UTF-8");

        var response = await _http.PostAsync("/v1/cash_registers/invoices/register", content, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = JsonSerializer.Deserialize<ErrorResponse>(body)
                ?? new ErrorResponse { Code = "UNKNOWN", Message = body };
            throw new FursApiException(error.Code, error.Message ?? body);
        }

        return JsonSerializer.Deserialize<PremiseResponse>(body)!;
    }

    public async Task<PremiseResponse> ClosePremise(PremiseRequest request, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(request);
        var token = _jwsSigner.Sign(payload);
        var content = new StringContent($"\"{token}\"", Encoding.UTF8, "application/json; charset=UTF-8");

        var response = await _http.PostAsync("/v1/cash_registers/invoices/register", content, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = JsonSerializer.Deserialize<ErrorResponse>(body)
                ?? new ErrorResponse { Code = "UNKNOWN", Message = body };
            throw new FursApiException(error.Code, error.Message ?? body);
        }

        return JsonSerializer.Deserialize<PremiseResponse>(body)!;
    }

    public async Task<EchoResponse> Echo(EchoRequest request, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(request);
        var token = _jwsSigner.Sign(payload);
        var content = new StringContent($"\"{token}\"", Encoding.UTF8, "application/json; charset=UTF-8");

        var response = await _http.PostAsync("/v1/cash_registers/echo", content, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = JsonSerializer.Deserialize<ErrorResponse>(body)
                ?? new ErrorResponse { Code = "UNKNOWN", Message = body };
            throw new FursApiException(error.Code, error.Message ?? body);
        }

        return JsonSerializer.Deserialize<EchoResponse>(body)!;
    }

    public async Task<DailyReportResponse> SendDailyReport(DailyReportRequest request, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(request);
        var token = _jwsSigner.Sign(payload);
        var content = new StringContent($"\"{token}\"", Encoding.UTF8, "application/json; charset=UTF-8");

        var response = await _http.PostAsync("/v1/cash_registers_batch/invoices", content, ct);
        var body = await response.Content.ReadAsStringAsync(ct);

        if (!response.IsSuccessStatusCode)
        {
            var error = JsonSerializer.Deserialize<ErrorResponse>(body)
                ?? new ErrorResponse { Code = "UNKNOWN", Message = body };
            throw new FursApiException(error.Code, error.Message ?? body);
        }

        return JsonSerializer.Deserialize<DailyReportResponse>(body)!;
    }
}
