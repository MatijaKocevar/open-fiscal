using System.Security.Cryptography.X509Certificates;
using FursBridge.Endpoints;
using FursBridge.Extensions;
using FursBridge.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddBridgeServices(builder.Configuration);

var app = builder.Build();

if (!app.Configuration.GetValue<bool>("BRIDGE_MOCK", true))
{
    _ = app.Services.GetRequiredService<X509Certificate2>();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapHealth();
app.MapInvoice();
app.MapPremise();
app.MapEcho();
app.MapDailyReport();
app.MapDeviceInfo();

app.Run();

public partial class Program { }
