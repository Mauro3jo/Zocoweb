using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Migrations.Operations;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static dash_aliados.Controllers.ExcelController;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController] 
    /// hola amigo baking tene cuidado que al pelado pederasta le gusta hacerce el boludo con los pagos
    /// no te dejes empenar :) y hace como yo y renuncia 
    /// perdon por el codigo esta medio peton pero es lo que hay
    public class FacturacionController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IChechAsesores _checkasesores;
        private readonly ICheckImagenService _checkimagenService;
        private readonly IComandaService _comandaService;
        private readonly IAltaService _altaservice;
        private readonly IBajaService _IBajaservice;
        private readonly IMemoryCache _cache;

        public FacturacionController(
            IBaseDashboardService sasService,
            IMapper mapper,
            ITokenService tok,
            IUsuarioZocoService usuarioZoco,
            IChechAsesores checkasesores,
            ICheckImagenService checkimagenService,
            IComandaService comandaService,
            IAltaService altaservice,
            IBajaService iBajaservice,
            IMemoryCache cache
            )
        {
            _baseService = sasService;
            _tokenService = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _checkasesores = checkasesores;
            _checkimagenService = checkimagenService;
            _comandaService = comandaService;
            _altaservice = altaservice;
            _IBajaservice = iBajaservice;
            _cache = cache;

        }
        [HttpPost("facturacionpagina1")]
        public async Task<IActionResult> ExcelFacturacionDiaria(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha inicial del token
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now; // Usar el día de hoy
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now; // Si la conversión falla, usar el día de hoy
                }
            }

            // Ahora obtenemos la última fecha usando el servicio
            DateTime? fechaDesdeServicio = await _baseService.ObtenerUltimaFechaPorMesYAnio(fechaToken);

            // Si el servicio devuelve una fecha válida, esa será la usada para los cálculos
            DateTime fecha = fechaDesdeServicio.HasValue ? fechaDesdeServicio.Value : fechaToken;
            // Generar una clave única para cachear los resultados
            // Extraer el día, mes y año de la fecha
            string diaMesAnio = fecha.ToString("dd-MM-yyyy"); // Formato "día-mes-año"

            // Generar la clave de cache con el día, mes y año de la fecha
            string cacheKey = $"Facturacion_{diaMesAnio}_{token.Provincia}";

            if (!_cache.TryGetValue(cacheKey, out List<object> resultado))
            {
                // Si no está en cache, calcular y almacenar en cache
                DateTime diaReferencia = fecha;
                string provincia = string.IsNullOrEmpty(token.Provincia) ? "todos" : token.Provincia;

                var alta = await _altaservice.ObtenerCRM();
                if (provincia != "todos")
                {
                    alta = alta.Where(a =>
                        RemoverAcentos(a.Provincia).Equals(RemoverAcentos(provincia), StringComparison.OrdinalIgnoreCase)
                    ).ToList();
                }

                // Obtener la fecha de inicio del mes
                DateTime fechaInicioMes = new DateTime(fecha.Year, fecha.Month, 1); // Primer día del mes
                int diasDelMes = (diaReferencia - fechaInicioMes).Days + 1; // Días desde el inicio del mes hasta la fecha de referencia

                // Filtrar y seleccionar todas las **altas** que tengan estado "ALTA"
                var listaAltas = alta
                    .Where(a => a.Estado == "ALTA") // Filtrar terminales con estado "ALTA"
                    .Select(a => new RegistroCRM
                    {
                        Estado = a.Estado ?? "",
                        NDeTerminal = a.NDeTerminal,
                        NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                        Provincia = a.Provincia ?? "Sin provincia",
                        FechaDeAlta = a.FechaDeAlta,
                        FechaDeBaja = a.FechaDeBaja,
                        TipoAlta = a.Altas ?? "",
                        TipoBaja = a.Baja ?? "",
                        Gestor = a.NombreDelAsesor ?? "Desconocido",
                        Cuit = a.CuitCuil,
                        RazonSocial = a.RazonSocial ?? "Sin Razón Social",
                        TipoTransaccion = "ALTA"
                    })
                    .ToList();

                // Agrupar por Cuit y calcular la facturación total por Cuit
                var agrupadoPorCuit = listaAltas
                    .GroupBy(a => a.Cuit)
                    .Select(grupo => new
                    {
                        Cuit = grupo.Key,
                        FacturacionTotalPorCuit = grupo.Sum(terminal => CalcularFacturacion(terminal, fechaInicioMes, diasDelMes)),
                        Terminales = grupo.ToList()
                    })
                    .OrderByDescending(g => g.FacturacionTotalPorCuit) // Ordenar por facturación total de mayor a menor
                    .ToList();

                resultado = new List<object>();

                foreach (var grupo in agrupadoPorCuit)
                {
                    foreach (var terminal in grupo.Terminales)
                    {
                        decimal totalFacturacion = CalcularFacturacion(terminal, fechaInicioMes, diasDelMes);

                        int diasSinFacturarConsecutivos = 0;
                        string estadoFacturacion;

                        // Lista para almacenar la facturación diaria
                        List<decimal> facturacionDiaria = new List<decimal>();

                        // Obtener los datos de facturación diaria
                        var datosDia = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                            ? await _baseService.DatosCuitPorFechaDiaria(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicioMes)
                            : new List<KeyValuePair<string, decimal>>();

                        // Evaluar los días desde el primero hasta el último del mes
                        for (int i = 1; i <= diasDelMes; i++)
                        {
                            var diaClave = new DateTime(fecha.Year, fecha.Month, i).ToString("dd/MM/yyyy");
                            var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
                            decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;

                            facturacionDiaria.Add(facturacionDia);
                            totalFacturacion += facturacionDia;

                            if (facturacionDia == 0)
                            {
                                diasSinFacturarConsecutivos++;
                            }
                            else
                            {
                                diasSinFacturarConsecutivos = 0;
                            }
                        }

                        // Determinar el estado de facturación
                        // Determinar el estado de facturación
                        var datosdias = diasDelMes * 50000;
                        if (diasSinFacturarConsecutivos > 2)
                        {
                            estadoFacturacion = $"No factura hace {diasSinFacturarConsecutivos} días";
                        }
                        else if (totalFacturacion < datosdias)
                        {
                            estadoFacturacion = "Baja facturación";
                        }
                        else
                        {
                            // Verificar si el último día del mes no facturó
                            decimal ultimaFacturacionDia = facturacionDiaria.LastOrDefault();

                            if (ultimaFacturacionDia == 0)
                            {
                                estadoFacturacion = "Activo (Hoy no facturó)";
                            }
                            else
                            {
                                estadoFacturacion = "Activo";
                            }
                        }


                        // Agregar el mes y año en formato "MM/yy"
                        var mesYAnio = fecha.ToString("MM/yy");

                        // Crear el objeto anónimo con el estado de facturación y la facturación diaria
                        var datosTerminal = new
                        {
                            terminal.Estado,
                            terminal.NDeTerminal,
                            terminal.NombreDeFantasia,
                            terminal.Provincia,
                            FechaDeAlta = terminal.FechaDeAlta?.ToString("dd/MM/yyyy"),
                            FechaDeBaja = terminal.FechaDeBaja?.ToString("dd/MM/yyyy"),
                            terminal.TipoAlta,
                            terminal.TipoBaja,
                            terminal.Gestor,
                            terminal.Cuit,
                            TiempoInactiva = estadoFacturacion,
                            FacturacionDiaria = facturacionDiaria,
                            FacturacionTotal = totalFacturacion, // Facturación de la terminal individual
                            FacturacionTotalPorCuit = grupo.FacturacionTotalPorCuit, // Facturación total por Cuit
                            MesYAnio = mesYAnio // Agregar mes y año
                        };

                        resultado.Add(datosTerminal);
                    }
                }

                // Almacenar en cache con expiración de 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            return Ok(resultado);
        }

        [HttpPost("facturacionpagina2")]
        public async Task<IActionResult> FacturacionPagina2(VMToken token, [FromServices] IMemoryCache cache)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha desde el token o usar la fecha de mañana si no se proporciona
            DateTime fecha;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fecha = DateTime.Now.AddDays(1); // Usar el día de mañana
            }
            else
            {
                try
                {
                    fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fecha = DateTime.Now.AddDays(1); // Si falla la conversión, usar el día de mañana
                }
            }

            // Generar una clave única para cachear los resultados
            string cacheKey = $"facturacionpagina2_{token.Token}_{fecha:yyyyMMdd}_{token.Provincia}";

            // Verificar si los resultados ya están en cache
            if (!cache.TryGetValue(cacheKey, out List<object> resultado))
            {
                // Si no está en cache, calcular los resultados
                var alta = await _altaservice.ObtenerCRM();

                // Filtrar por provincia si se proporciona
                if (!string.IsNullOrEmpty(token.Provincia) && token.Provincia != "todos")
                {
                    alta = alta.Where(a => string.Equals(RemoverAcentos(a.Provincia), RemoverAcentos(token.Provincia), StringComparison.OrdinalIgnoreCase)).ToList();
                }

                // Obtener los últimos tres meses para las columnas dinámicas
                DateTime fechaInicio = fecha.AddMonths(-3); // Desde hace tres meses
                DateTime fechaActual = fecha;

                var meses = new List<DateTime>();
                for (var date = fechaInicio; date <= fechaActual; date = date.AddMonths(1))
                {
                    meses.Add(new DateTime(date.Year, date.Month, 1));
                }

                // Facturación diaria mínima
                decimal facturacionDiariaMinima = 50000;
                int diasTranscurridosMes = fecha.Day; // Días transcurridos en el mes actual
                decimal facturacionMinimaEsperada = facturacionDiariaMinima * diasTranscurridosMes; // Facturación mínima esperada hasta el día actual

                // Filtrar y seleccionar solo las terminales con estado "ALTA"
                var listaAltas = alta
                    .Where(a => a.Estado == "ALTA") // Solo terminales con estado ALTA
                    .Select(a => new RegistroCRM
                    {
                        Estado = a.Estado ?? "",
                        NDeTerminal = a.NDeTerminal,
                        NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                        Provincia = a.Provincia ?? "Sin provincia",
                        FechaDeAlta = a.FechaDeAlta,
                        FechaDeBaja = a.FechaDeBaja,
                        TipoAlta = a.Altas ?? "",
                        TipoBaja = a.Baja ?? "",
                        Gestor = a.NombreDelAsesor ?? "Desconocido",
                        Cuit = a.CuitCuil,
                        RazonSocial = a.RazonSocial ?? "Sin Razón Social",
                        TipoTransaccion = "ALTA"
                    })
                    .ToList();

                // Agrupar por CUIT y calcular la facturación del último mes
                var listaAgrupadaPorCuit = listaAltas
                    .GroupBy(a => a.Cuit)
                    .Select(g => new
                    {
                        Cuit = g.Key,
                        RazonSocial = g.FirstOrDefault()?.RazonSocial ?? "Sin Razón Social",
                        Terminales = g.ToList(),
                        FacturacionTotalUltimoMes = g.Sum(a =>
                        {
                            if (a.Cuit.HasValue && a.NDeTerminal.HasValue)
                            {
                                var datosmes = _baseService.DatosCuitPorFecha(a.Cuit.ToString(), a.NDeTerminal.ToString(), fechaInicio).Result;
                                return datosmes.FirstOrDefault(d => d.Key == meses.Last().ToString("MM/yyyy")).Value;
                            }
                            else
                            {
                                return 0;
                            }
                        })
                    })
                    .OrderByDescending(g => g.FacturacionTotalUltimoMes)
                    .ToList();

                // Preparar los datos para ser devueltos
                resultado = new List<object>();

                foreach (var grupo in listaAgrupadaPorCuit)
                {
                    decimal[] totalFacturacionPorMes = new decimal[meses.Count]; // Para sumar la facturación por mes de todas las terminales de este CUIT

                    // Calcular la facturación mínima esperada total por CUIT
                    decimal facturacionMinimaTotalPorCuit = facturacionMinimaEsperada * grupo.Terminales.Count;
                    bool cuitCumple = grupo.FacturacionTotalUltimoMes >= facturacionMinimaTotalPorCuit;

                    // Añadir los datos de cada terminal
                    foreach (var terminal in grupo.Terminales)
                    {
                        var datosmes = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                            ? await _baseService.DatosCuitPorFecha(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicio)
                            : new List<KeyValuePair<string, decimal>>();

                        var facturacionPorMes = new List<decimal>();
                        decimal facturacionUltimoMes = 0;

                        for (int i = 0; i < meses.Count; i++)
                        {
                            var mesClave = meses[i].ToString("MM/yyyy");
                            var totalBruto = datosmes.FirstOrDefault(d => d.Key == mesClave);
                            decimal facturacionMes = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
                            facturacionPorMes.Add(facturacionMes);
                            totalFacturacionPorMes[i] += facturacionMes; // Sumar facturación al total por mes de este CUIT
                            if (i == meses.Count - 1)
                            {
                                facturacionUltimoMes = facturacionMes; // Guardar la facturación del último mes
                            }
                        }

                        // Determinar el estado de facturación
                        string estadoFacturacion;
                        if (!cuitCumple && facturacionUltimoMes < facturacionMinimaEsperada)
                        {
                            estadoFacturacion = facturacionUltimoMes == 0 ? "No Factura" : "Baja Facturación";
                        }
                        else
                        {
                            estadoFacturacion = "Activo";
                        }

                        // Crear un objeto para la terminal
                        var datosTerminal = new
                        {
                            terminal.Estado,
                            terminal.NDeTerminal,
                            terminal.NombreDeFantasia,
                            terminal.Provincia,
                            FechaDeAlta = terminal.FechaDeAlta?.ToString("dd/MM/yyyy"),
                            FechaDeBaja = terminal.FechaDeBaja?.ToString("dd/MM/yyyy"),
                            terminal.TipoAlta,
                            terminal.TipoBaja,
                            terminal.Gestor,
                            terminal.Cuit,
                            EstadoFacturacion = estadoFacturacion, // Estado basado en la facturación
                            MesFacturacion = fecha.Month, // Mes en formato numérico (del 1 al 12)
                            FacturacionPorMes = facturacionPorMes // Lista de facturación por mes
                        };

                        resultado.Add(datosTerminal);
                    }

                    // Agregar el total por CUIT como un objeto más en el mismo array
                    var totalPorCuit = new
                    {
                        Estado = "ALTA",  // Simula un registro más
                        NDeTerminal = "Todas", // Puedes poner un identificador genérico o "Todas"
                        NombreDeFantasia = grupo.RazonSocial,
                        Provincia = "",
                        FechaDeAlta = "", // Vacío o información relevante si aplica
                        FechaDeBaja = "",
                        TipoAlta = "",
                        TipoBaja = "",
                        Gestor = "",
                        Cuit = grupo.Cuit,
                        MesFacturacion = fecha.Month, // Mes en formato numérico (1 al 12)
                        FacturacionPorMes = totalFacturacionPorMes, // Totales por mes
                        TotalFacturacion = totalFacturacionPorMes.Sum() // Sumar la facturación total de todos los meses
                    };

                    resultado.Add(totalPorCuit); // Añadir el total como un objeto normal
                }

                // Almacenar en cache con expiración de 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver los datos en formato JSON desde el cache (o recién calculado)
            return Ok(resultado);
        }





        // Método para calcular la facturación de una terminal
        private decimal CalcularFacturacion(RegistroCRM terminal, DateTime fechaInicioMes, int diasDelMes)
        {
            decimal totalFacturacion = 0;
            var datosDia = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                ? _baseService.DatosCuitPorFechaDiaria(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicioMes).Result
                : new List<KeyValuePair<string, decimal>>();

            for (int i = 1; i <= diasDelMes; i++)
            {
                var diaClave = new DateTime(fechaInicioMes.Year, fechaInicioMes.Month, i).ToString("dd/MM/yyyy");
                var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
                decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
                totalFacturacion += facturacionDia;
            }

            return totalFacturacion;
        }




        private string RemoverAcentos(string texto)
        {
            if (string.IsNullOrWhiteSpace(texto)) return texto;

            // Normalizar el texto a su forma básica y eliminar los caracteres diacríticos
            return string.Concat(texto
                .Normalize(NormalizationForm.FormD)
                .Where(c => CharUnicodeInfo.GetUnicodeCategory(c) != UnicodeCategory.NonSpacingMark))
                .Normalize(NormalizationForm.FormC);
        }
        [HttpPost("bienvenidopanelfacturacion")]
        public async Task<IActionResult> Bienvenidopanelfacturacion(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha inicial del token
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now; // Usar el día de hoy
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now; // Si la conversión falla, usar el día de hoy
                }
            }

            // Obtener la última fecha usando el servicio
            DateTime? fechaDesdeServicio = await _baseService.ObtenerUltimaFechaPorMesYAnio(fechaToken);

            // Si el servicio devuelve una fecha válida, esa será la usada para los cálculos
            DateTime fecha = fechaDesdeServicio.HasValue ? fechaDesdeServicio.Value : fechaToken;

            // Generar una clave única para cachear los resultados
            string diaMesAnio = fecha.ToString("dd-MM-yyyy"); // Formato "día-mes-año"
            string cacheKey = $"bienvenidopanelfacturacion_{diaMesAnio}_{token.Provincia}";

            // Aquí cambiamos el tipo de resultado para que no sea una lista, sino un objeto único
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Si no está en cache, calcular y almacenar en cache
                DateTime diaReferencia = fecha;
                string provincia = string.IsNullOrEmpty(token.Provincia) ? "todos" : token.Provincia;

                var alta = await _altaservice.ObtenerCRM();
                if (provincia != "todos")
                {
                    alta = alta.Where(a =>
                        RemoverAcentos(a.Provincia).Equals(RemoverAcentos(provincia), StringComparison.OrdinalIgnoreCase)
                    ).ToList();
                }

                // Obtener la fecha de inicio del mes
                DateTime fechaInicioMes = new DateTime(fecha.Year, fecha.Month, 1); // Primer día del mes
                int diasDelMes = (diaReferencia - fechaInicioMes).Days + 1; // Días desde el inicio del mes hasta la fecha de referencia

                // Variables para contar las terminales
                var TotalTerminales = alta.Count();
                int totalTerminalesNuevas = alta.Count(a => a.Altas == "ALTA NUEVA" || a.Altas == "AGREGA");
                int totalTerminalesAlta = alta.Count(a => a.Estado == "ALTA");
                int totalTerminalesBaja = alta.Count(a => a.Estado == "BAJA");
                int totalFacturan = 0, totalBajaFacturacion = 0, totalNoFacturan = 0;
                int totalHoyNoFacturan = 0; // Variable para contar las activas pero no facturaron hoy
                int totalHoyCeroFacturacion = 0; // Nueva variable para contar todas las terminales que no facturaron hoy
                int totalHoyFacturacion = 0; // Nueva variable para contar todas las terminales que facturaron hoy

                // Filtrar y seleccionar todas las **altas** que tengan estado "ALTA"
                var listaAltas = alta
                    .Where(a => a.Estado == "ALTA") // Filtrar terminales con estado "ALTA"
                    .Select(a => new RegistroCRM
                    {
                        Estado = a.Estado ?? "",
                        NDeTerminal = a.NDeTerminal,
                        NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                        Provincia = a.Provincia ?? "Sin provincia",
                        FechaDeAlta = a.FechaDeAlta,
                        FechaDeBaja = a.FechaDeBaja,
                        TipoAlta = a.Altas ?? "",
                        TipoBaja = a.Baja ?? "",
                        Gestor = a.NombreDelAsesor ?? "Desconocido",
                        Cuit = a.CuitCuil,
                        RazonSocial = a.RazonSocial ?? "Sin Razón Social",
                        TipoTransaccion = "ALTA"
                    })
                    .ToList();

                // Agrupar por Cuit y calcular la facturación total por Cuit
                var agrupadoPorCuit = listaAltas
                    .GroupBy(a => a.Cuit)
                    .Select(grupo => new
                    {
                        Cuit = grupo.Key,
                        FacturacionTotalPorCuit = grupo.Sum(terminal => CalcularFacturacion(terminal, fechaInicioMes, diasDelMes)),
                        Terminales = grupo.ToList()
                    })
                    .OrderByDescending(g => g.FacturacionTotalPorCuit) // Ordenar por facturación total de mayor a menor
                    .ToList();

                foreach (var grupo in agrupadoPorCuit)
                {
                    foreach (var terminal in grupo.Terminales)
                    {
                        decimal totalFacturacion = CalcularFacturacion(terminal, fechaInicioMes, diasDelMes);

                        int diasSinFacturarConsecutivos = 0;

                        // Obtener los datos de facturación diaria
                        var datosDia = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                            ? await _baseService.DatosCuitPorFechaDiaria(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicioMes)
                            : new List<KeyValuePair<string, decimal>>();

                        List<decimal> facturacionDiaria = new List<decimal>();

                        // Evaluar los días desde el primero hasta el último del mes
                        for (int i = 1; i <= diasDelMes; i++)
                        {
                            var diaClave = new DateTime(fecha.Year, fecha.Month, i).ToString("dd/MM/yyyy");
                            var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
                            decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;

                            facturacionDiaria.Add(facturacionDia);
                            totalFacturacion += facturacionDia;

                            if (facturacionDia == 0)
                            {
                                diasSinFacturarConsecutivos++;
                            }
                            else
                            {
                                diasSinFacturarConsecutivos = 0;
                            }
                        }

                        // Verificar si el último día del mes no facturó
                        decimal ultimaFacturacionDia = facturacionDiaria.LastOrDefault();

                        // Contar todas las terminales que no facturaron hoy
                        if (ultimaFacturacionDia == 0)
                        {
                            totalHoyCeroFacturacion++;
                        }
                        else
                        {
                            totalHoyFacturacion++;
                        }

                        // Determinar el estado de facturación solo para las terminales en estado "ALTA"
                        if (terminal.Estado == "ALTA")
                        {
                            var datosdias = diasDelMes * 50000;
                            if (diasSinFacturarConsecutivos > 2)
                            {
                                totalNoFacturan++; // No factura hace más de 2 días
                            }
                            else if (totalFacturacion < datosdias)
                            {
                                totalBajaFacturacion++; // Baja facturación
                            }
                            else
                            {
                                if (ultimaFacturacionDia == 0)
                                {
                                    totalHoyNoFacturan++; // Activo pero hoy no facturó
                                }
                                else
                                {
                                    totalFacturan++; // Activo y facturó hoy
                                }
                            }
                        }
                    }
                }

                // Ahora el tipo de resultado es un objeto, no una lista
                resultado = new
                {
                    TotalTerminales,
                    TotalTerminalesNuevas = totalTerminalesNuevas, // Terminales con "ALTA NUEVA" o "AGREGA"
                    TotalTerminalesAlta = totalTerminalesAlta,     // Terminales con estado "ALTA"
                    TotalTerminalesBaja = totalTerminalesBaja,
                    TotalFacturan = totalFacturan,                 // Terminales que están activas y facturaron hoy
                    TotalHoyNoFacturan = totalHoyNoFacturan,       // Terminales activas que no facturaron hoy
                    TotalBajaFacturacion = totalBajaFacturacion,
                    TotalNoFacturan = totalNoFacturan,
                    TotalHoyCeroFacturacion = totalHoyCeroFacturacion,// Total de terminales que no facturaron hoy (incluye todas)
                    TotalHoyFacturacion = totalHoyFacturacion
                };

                // Guardar el resultado en el cache con una expiración de 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            return Ok(resultado);
        }




    }
}
