namespace FursBridge.Endpoints;

public static class DeviceInfoEndpoints
{
    public static void MapDeviceInfo(this WebApplication app)
    {
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
}
