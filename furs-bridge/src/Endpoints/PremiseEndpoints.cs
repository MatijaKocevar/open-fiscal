using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Endpoints;

public static class PremiseEndpoints
{
    public static void MapPremise(this WebApplication app)
    {
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
    }
}
