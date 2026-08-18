namespace FursBridge.Endpoints;

public static class HealthEndpoints
{
    public static void MapHealth(this WebApplication app)
    {
        app.MapGet("/api/health", (IConfiguration config) =>
        {
            var mock = config.GetValue<bool>("BRIDGE_MOCK", true);
            return Results.Ok(new { ok = true, mock });
        });
    }
}
