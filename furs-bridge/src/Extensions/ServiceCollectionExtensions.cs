using Bridge.Services;

namespace Bridge.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddBridgeServices(this IServiceCollection services, IConfiguration config)
    {
        var isMock = config.GetValue<bool>("BRIDGE_MOCK", true);

        if (isMock)
        {
            services.AddSingleton<IZoiCalculator, MockZoiCalculator>();
            services.AddSingleton<IJwsSigner, MockJwsSigner>();
            services.AddSingleton<IFursClient, MockFursClient>();
        }
        else
        {
            var certPath = config.GetValue<string>("CERT_STORE_PATH", "/certs");
            var certPassword = config.GetValue<string>("CERT_PASSWORD", "");

            services.AddSingleton<ICertificateManager, CertificateManager>();
            var certManager = new CertificateManager(
                services.BuildServiceProvider().GetRequiredService<ILogger<CertificateManager>>());
            var cert = certManager.LoadCertificate($"{certPath}/app-cert.pfx", certPassword);

            if (cert == null)
                throw new InvalidOperationException(
                    $"Cannot load application certificate from {certPath}/app-cert.pfx");

            services.AddSingleton(cert);
            services.AddSingleton<IZoiCalculator>(sp =>
                new ZoiCalculator(sp.GetRequiredService<System.Security.Cryptography.X509Certificates.X509Certificate2>()));
            services.AddSingleton<IJwsSigner>(sp =>
                new JwsSigner(sp.GetRequiredService<System.Security.Cryptography.X509Certificates.X509Certificate2>()));

            services.AddHttpClient<IFursClient, FursClient>(client =>
            {
                var baseUrl = config.GetValue<string>("FURS_BASE_URL", "https://blagajne-test.fu.gov.si:9002");
                client.BaseAddress = new Uri(baseUrl);
                client.Timeout = TimeSpan.FromSeconds(30);
            });
        }

        return services;
    }
}
