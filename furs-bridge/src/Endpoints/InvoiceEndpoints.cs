using FursBridge.Exceptions;
using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Endpoints;

public static class InvoiceEndpoints
{
    public static void MapInvoice(this WebApplication app)
    {
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
