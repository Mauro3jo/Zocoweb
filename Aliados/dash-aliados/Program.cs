//using DinkToPdf;
//using DinkToPdf.Contracts;
//using IOC;
//using Microsoft.AspNetCore.Authentication.Cookies;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using Microsoft.AspNetCore.Mvc;
//using dash_aliados.Utilidades.Automapper;
//using Microsoft.Extensions.Caching.Memory;
//using DAL.DBContext; // Asegúrate de incluir esta línea

//var builder = WebApplication.CreateBuilder(args);

//builder.Services.AddControllersWithViews();

//builder.Services.AddControllersWithViews().AddMvcOptions(options =>
//{
//    options.Filters.Add(
//        new ResponseCacheAttribute
//        {
//            NoStore = true
//        });
//});

////Agregar IMemoryCache al contenedor de servicios
//builder.Services.AddMemoryCache();


//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(option =>
//    {
//        option.LoginPath = "/Acceso/Login";
//        option.ExpireTimeSpan = TimeSpan.FromMinutes(1440);
//    });

//builder.Services.InyectarDependencia(builder.Configuration);

//builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

//builder.Services.AddSession(opt =>
//{
//    opt.IdleTimeout = TimeSpan.FromMinutes(30);
//});

//var app = builder.Build();

//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Home/Error");
//}

//app.UseSession();

//app.UseStaticFiles();

//app.UseRouting();

//app.UseAuthentication();

//app.UseAuthorization();

//app.MapControllerRoute(
//    name: "default",
//    pattern: "{controller=Acceso}/{action=Login}/{id?}");

//app.Run();







///////////////////////PRODUCCION/////////////////////////////////




//using DinkToPdf;
//using DinkToPdf.Contracts;
//using IOC;
//using Microsoft.AspNetCore.Authentication.Cookies;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using Microsoft.AspNetCore.Mvc;
//using dash_aliados.Utilidades.Automapper;
//using Microsoft.AspNetCore.Server.Kestrel.Core;

//var builder = WebApplication.CreateBuilder(args);

//// Configurar Kestrel para escuchar en los puertos deseados y establecer límite de tamaño de cuerpo de solicitud
//builder.WebHost.UseKestrel(options =>
//{
//    options.Limits.MaxRequestBodySize = 524288000; // 500 MB
//    options.ListenAnyIP(80); // Escuchar en todas las interfaces en el puerto 80
//    options.ListenAnyIP(443, listenOptions =>
//    {
//        listenOptions.UseHttps(); // Asegura el puerto 443
//    });
//});

//builder.Services.AddControllersWithViews();

//builder.Services.AddControllersWithViews().AddMvcOptions(options =>
//{
//    options.Filters.Add(
//        new ResponseCacheAttribute
//        {
//            NoStore = true
//        });
//});

//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(option =>
//    {
//        option.LoginPath = "/Acceso/Login";
//        option.ExpireTimeSpan = TimeSpan.FromMinutes(1440);
//    });

//builder.Services.InyectarDependencia(builder.Configuration);

//builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

//builder.Services.AddSession(opt =>
//{
//    opt.IdleTimeout = TimeSpan.FromMinutes(30);
//});

//var app = builder.Build();

//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Home/Error");
//}

//app.UseSession();

//app.UseStaticFiles();

//app.UseRouting();

//app.UseAuthentication();

//app.UseAuthorization();

//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllerRoute(
//        name: "default",
//        pattern: "{controller}/{action=Index}/{id?}");
//    endpoints.MapFallbackToFile("index.html"); // Verifica que esta sea la ruta correcta al archivo index.html de tu SPA
//});

//app.Run();

////////////////////// PRODUCCION FINAL ////////////////////////////////////////
///
/// 
/// 
/// 
////////
//using DinkToPdf;
//using DinkToPdf.Contracts;
//using IOC;
//using Microsoft.AspNetCore.Authentication.Cookies;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using System.Text;
//using Microsoft.AspNetCore.Mvc;
//using dash_aliados.Utilidades.Automapper;
//using Microsoft.AspNetCore.Server.Kestrel.Core;
//using Microsoft.AspNetCore.ResponseCompression;

//var builder = WebApplication.CreateBuilder(args);

////Configurar Kestrel para escuchar en los puertos deseados y establecer límite de tamaño de cuerpo de solicitud
//builder.WebHost.UseKestrel(options =>
//{
//    options.Limits.MaxRequestBodySize = 524288000; // 500 MB
//    options.Limits.MaxConcurrentConnections = 10000; // Ajustar según la capacidad del servidor
//    options.Limits.MaxConcurrentUpgradedConnections = 10000; // Ajustar según sea necesario
//    options.ListenAnyIP(80); // Escuchar en todas las interfaces en el puerto 80 44458
//    options.ListenAnyIP(443, listenOptions =>
//    {
//        listenOptions.UseHttps(); // Asegura el puerto 443
//    });

//});

//builder.Services.AddControllersWithViews();

////Habilitar compresión de respuestas
//builder.Services.AddResponseCompression(options =>
//{
//    options.EnableForHttps = true;
//    options.Providers.Add<GzipCompressionProvider>();
//});

////Configuración de caché de respuestas
//builder.Services.AddControllersWithViews().AddMvcOptions(options =>
//{
//    options.Filters.Add(
//        new ResponseCacheAttribute
//        {
//            Duration = 60, // Cache por 60 segundos
//            Location = ResponseCacheLocation.Any,
//            NoStore = false
//        });
//});

////Configuración de autenticación con cookies
//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(option =>
//    {
//        option.LoginPath = "/Acceso/Login";
//        option.ExpireTimeSpan = TimeSpan.FromMinutes(1440);
//    });

////Inyección de dependencias
//builder.Services.InyectarDependencia(builder.Configuration);

////Configuración de AutoMapper
//builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

////Configuración de sesiones
//builder.Services.AddDistributedMemoryCache();
//builder.Services.AddSession(opt =>
//{
//    opt.IdleTimeout = TimeSpan.FromMinutes(30);
//    opt.Cookie.HttpOnly = true;
//    opt.Cookie.IsEssential = true;
//});

////Configuración de logging
//builder.Services.AddLogging(logging =>
//{
//    logging.ClearProviders();
//    logging.AddConsole();
//    logging.AddDebug();
//});

//var app = builder.Build();

//if (!app.Environment.IsDevelopment())
//{
//    app.UseExceptionHandler("/Home/Error");
//}

////Middleware de compresión de respuestas
//app.UseResponseCompression();

//app.UseStaticFiles();

//app.UseSession();

//app.UseRouting();

//app.UseAuthentication();

//app.UseAuthorization();

//app.UseEndpoints(endpoints =>
//{
//    endpoints.MapControllerRoute(
//        name: "default",
//        pattern: "{controller}/{action=Index}/{id?}");
//    endpoints.MapFallbackToFile("index.html"); // Verifica que esta sea la ruta correcta al archivo index.html de tu SPA
//});

//app.Run();



///////////////////////////////////////////////////////////////////////
/////////////////////  PRODUCION IIS//////////////////////////////////////



using DinkToPdf;
using DinkToPdf.Contracts;
using IOC;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using dash_aliados.Utilidades.Automapper;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.AspNetCore.ResponseCompression;
using System.Globalization;

var builder = WebApplication.CreateBuilder(args);

// ✅ Forzar cultura regional es-AR globalmente
CultureInfo.DefaultThreadCurrentCulture = new CultureInfo("es-AR");
CultureInfo.DefaultThreadCurrentUICulture = new CultureInfo("es-AR");

// ✅ Configurar Kestrel para producción sin HTTPS (manejado por IIS)
builder.WebHost.UseKestrel(options =>
{
    options.Limits.MaxRequestBodySize = 524_288_000; // 500 MB
    options.Limits.MaxConcurrentConnections = 10000;
    options.Limits.MaxConcurrentUpgradedConnections = 10000;
    options.ListenAnyIP(80);
});

builder.Services.AddControllersWithViews();

builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<GzipCompressionProvider>();
});

builder.Services.AddControllersWithViews().AddMvcOptions(options =>
{
    options.Filters.Add(new ResponseCacheAttribute
    {
        Duration = 60,
        Location = ResponseCacheLocation.Any,
        NoStore = false
    });
});

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(option =>
    {
        option.LoginPath = "/Acceso/Login";
        option.ExpireTimeSpan = TimeSpan.FromMinutes(1440);
    });

builder.Services.InyectarDependencia(builder.Configuration);
builder.Services.AddAutoMapper(typeof(AutoMapperProfile));

builder.Services.AddDistributedMemoryCache();
builder.Services.AddSession(opt =>
{
    opt.IdleTimeout = TimeSpan.FromMinutes(30);
    opt.Cookie.HttpOnly = true;
    opt.Cookie.IsEssential = true;
});

builder.Services.AddLogging(logging =>
{
    logging.ClearProviders();
    logging.AddConsole();
    logging.AddDebug();
});

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}

app.UseResponseCompression();
app.UseStaticFiles();
app.UseSession();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller}/{action=Index}/{id?}");

    endpoints.MapFallbackToFile("index.html");
});

app.Run();