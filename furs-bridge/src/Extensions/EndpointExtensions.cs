using System.Text.Json;
using Bridge.Models;
using Bridge.Services;

namespace Bridge.Extensions;

public static class EndpointExtensions
{
    public static void MapBridgeEndpoints(this WebApplication app)
    {
        app.MapGet("/api/health", (IConfiguration config) =>
        {
            var mock = config.GetValue<bool>("BRIDGE_MOCK", true);
            return Results.Ok(new { ok = true, mock });
        });

        app.MapPost("/api/invoice", async (IFursClient furs, IZoiCalculator zoi, IConfiguration config, InvoiceRequest request, CancellationToken ct) =>
        {
            try
            {
                var response = await furs.SendInvoice(request, ct);

                var issueDateTime = request.IssueDateTime.ToString("dd.MM.yyyy HH:mm:ss");
                var calculatedZoi = zoi.Calculate(
                    request.TaxNumber, issueDateTime, request.InvoiceNumber,
                    request.PremiseId, request.DeviceId, request.InvoiceAmount);

                return Results.Ok(new
                {
                    success = true,
                    eor = response.Eor,
                    zoi = calculatedZoi,
                    jir = response.Jir,
                    qrCode = response.QrCode,
                    verifyUrl = response.VerifyUrl,
                    timestamp = response.Timestamp,
                    isMock = config.GetValue<bool>("BRIDGE_MOCK", true)
                });
            }
            catch (FursApiException ex)
            {
                return Results.Problem(
                    detail: ex.Message,
                    statusCode: MapFursErrorToHttp(ex.Code),
                    title: $"FURS Error {ex.Code}");
            }
        });

        app.MapPost("/api/premise/register", async (IFursClient furs, IConfiguration config, PremiseRequest request, CancellationToken ct) =>
        {
            var response = await furs.RegisterPremise(request, ct);
            return Results.Ok(new
            {
                response.Success,
                response.PremiseId,
                response.TaxNumber,
                response.Status,
                response.Timestamp,
                isMock = config.GetValue<bool>("BRIDGE_MOCK", true)
            });
        });

        app.MapPost("/api/premise/close", async (IFursClient furs, IConfiguration config, PremiseRequest request, CancellationToken ct) =>
        {
            var response = await furs.ClosePremise(request, ct);
            return Results.Ok(new
            {
                response.Success,
                response.PremiseId,
                response.TaxNumber,
                response.Status,
                response.Timestamp,
                isMock = config.GetValue<bool>("BRIDGE_MOCK", true)
            });
        });

        app.MapPost("/api/echo", async (IFursClient furs, IConfiguration config, EchoRequest request, CancellationToken ct) =>
        {
            var response = await furs.Echo(request, ct);
            return Results.Ok(new { response.EchoResponseValue, isMock = config.GetValue<bool>("BRIDGE_MOCK", true) });
        });

        app.MapPost("/api/daily-report", async (IFursClient furs, IConfiguration config, DailyReportRequest request, CancellationToken ct) =>
        {
            var response = await furs.SendDailyReport(request, ct);
            return Results.Ok(new
            {
                response.Success,
                response.ReportId,
                response.TotalInvoices,
                response.TotalGross,
                response.TotalVat,
                response.Timestamp,
                isMock = config.GetValue<bool>("BRIDGE_MOCK", true)
            });
        });

        app.MapGet("/api/device-info", (IConfiguration config) =>
        {
            return Results.Ok(new
            {
                deviceId = config.GetValue<string>("DEVICE_ID", ""),
                premiseId = config.GetValue<string>("PREMISE_ID", ""),
                taxNumber = config.GetValue<string>("TAX_NUMBER", ""),
                isMock = config.GetValue<bool>("BRIDGE_MOCK", true)
            });
        });
    }

    private static int MapFursErrorToHttp(string code) => code switch
    {
        "S001" or "S002" => 422,
        "S003" or "S004" or "S007" or "S008" => 401,
        "S005" or "S006" => 403,
        "S100" => 502,
        _ => 500
    };
}
