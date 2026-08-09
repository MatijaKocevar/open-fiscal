using Bridge.Extensions;
using Bridge.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddBridgeServices(builder.Configuration);

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();
app.MapBridgeEndpoints();

app.Run();

public partial class Program { }
