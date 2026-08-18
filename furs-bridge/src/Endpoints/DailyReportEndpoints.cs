using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Endpoints;

public static class DailyReportEndpoints
{
    public static void MapDailyReport(this WebApplication app)
    {
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
    }
}
