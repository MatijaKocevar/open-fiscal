using FursBridge.Interfaces;
using FursBridge.Models;

namespace FursBridge.Endpoints;

public static class EchoEndpoints
{
    public static void MapEcho(this WebApplication app)
    {
        app.MapPost("/api/echo", async (IFursClient furs, IConfiguration config, EchoRequest request, CancellationToken ct) =>
        {
            var response = await furs.Echo(request, ct);
            return Results.Ok(new { response.EchoResponseValue, isMock = config.GetValue<bool>("BRIDGE_MOCK", true) });
        });
    }
}
