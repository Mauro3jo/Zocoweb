using AutoMapper;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using static dash_aliados.Controllers.ExcelController;
using System.Globalization;
using System.Text;
using BLL.ImplementacionZoco;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumenMensualController : ControllerBase
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
        public ResumenMensualController(
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
        [HttpPost("resumenapi1")]
        public async Task<IActionResult> resumenapi1(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha del token, o usar el día de hoy si no se especifica
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now;
                }
            }

            // Obtener la última fecha válida desde el servicio, usando la fecha proporcionada o calculada
            DateTime? fechaDesdeServicio = await _baseService.ObtenerUltimaFechaPorMesYAnio(fechaToken);
            DateTime fecha = fechaDesdeServicio.HasValue ? fechaDesdeServicio.Value : fechaToken;

            // Generar la clave de caché
            string cacheKey = $"ResumenFacturacion_{fecha:MM-yyyy}_{token.Provincia ?? "todas"}";

            // Intentar obtener los resultados de la caché
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Si no está en caché, obtener los datos del servicio, filtrando por provincia si es necesario
                (decimal totalBrutoDebito, decimal totalBrutoCredito, decimal totalBruto1Pago, int totalCantidadOperaciones) =
                    await _baseService.ObtenerResumenBrutoYOperacionesPorTipoYProvincia(fecha, token.Provincia);

                // Crear el resultado
                resultado = new
                {
                    TotalBrutoDebito = totalBrutoDebito,
                    TotalBrutoCredito = totalBrutoCredito,
                    TotalBruto1Pago = totalBruto1Pago,
                    TotalCantidadOperaciones = totalCantidadOperaciones,
                    Fecha = fecha.ToString("dd/MM/yyyy"),
                    Provincia = token.Provincia ?? "Todas"
                };

                // Almacenar en la caché por 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver el resultado
            return Ok(resultado);
        }
        [HttpPost("resumenFacturacionPorTerminales")]
        public async Task<IActionResult> ResumenFacturacionPorTerminales(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha del token o usar el día de hoy si no se especifica
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now;
                }
            }

            // Obtener la última fecha válida desde el servicio
            DateTime? fechaDesdeServicio = await _baseService.ObtenerUltimaFechaPorMesYAnio(fechaToken);
            DateTime fecha = fechaDesdeServicio.HasValue ? fechaDesdeServicio.Value : fechaToken;

            // Generar la clave de caché
            string cacheKey = $"ResumenFacturacionTerminales_{fecha:MM-yyyy}_{token.Provincia ?? "todas"}";

            // Intentar obtener los resultados de la caché
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Obtener todas las terminales activas
                var terminalesActivas = await _altaservice.ObtenerCRM();

                // Filtrar por provincia si es necesario
                if (!string.IsNullOrEmpty(token.Provincia) && token.Provincia != "todos")
                {
                    terminalesActivas = terminalesActivas
                        .Where(t => RemoverAcentos(t.Provincia).Equals(RemoverAcentos(token.Provincia), StringComparison.OrdinalIgnoreCase))
                        .ToList();
                }

                // Inicializar variables para las sumas
                decimal totalBruto = 0;
                int totalDebito = 0;
                int totalCredito = 0;
                int total1Pago = 0;
                int totalCantidadOperaciones = 0;
                int totalFacturan = 0;
                int totalNoFacturan = 0;

                // Recorrer todas las terminales activas y sumar los totales
                foreach (var terminal in terminalesActivas)
                {
                    // Si la terminal no está en estado "ALTA", se cuenta como que no factura
                    if (terminal.Estado != "ALTA")
                    {
                        totalNoFacturan++;
                        continue;
                    }

                    // Obtener facturación para las terminales en estado "ALTA"
                    var (brutoTerminal, debitoTerminal, creditoTerminal, unPagoTerminal, cantidadOperacionesTerminal) =
                        await _baseService.ObtenerFacturacionPorTerminal(terminal.CuitCuil.ToString(), terminal.NDeTerminal.ToString(), fecha);

                    if (brutoTerminal == 0)
                    {
                        totalNoFacturan++;
                    }
                    else
                    {
                        totalFacturan++;
                    }

                    totalBruto += brutoTerminal;
                    totalDebito += debitoTerminal;
                    totalCredito += creditoTerminal;
                    total1Pago += unPagoTerminal;
                    totalCantidadOperaciones += cantidadOperacionesTerminal;
                }

                // Calcular los porcentajes y redondearlos a 2 decimales
                decimal porcentajeFacturan = Math.Round((totalFacturan * 100m) / (totalFacturan + totalNoFacturan), 2);
                decimal porcentajeNoFacturan = Math.Round((totalNoFacturan * 100m) / (totalFacturan + totalNoFacturan), 2);

                decimal porcentajeDebito = Math.Round((totalDebito * 100m) / totalCantidadOperaciones, 2);
                decimal porcentajeCredito = Math.Round((totalCredito * 100m) / totalCantidadOperaciones, 2);
                decimal porcentaje1Pago = Math.Round((total1Pago * 100m) / totalCantidadOperaciones, 2);

                // Crear el resultado
                resultado = new
                {
                    TotalFacturan = totalFacturan,
                    TotalNoFacturan = totalNoFacturan,
                    PorcentajeFacturan = porcentajeFacturan,
                    PorcentajeNoFacturan = porcentajeNoFacturan,
                    TotalBruto = totalBruto,
                    TotalCantidadOperaciones = totalCantidadOperaciones,
                    PorcentajeDebito = porcentajeDebito,
                    PorcentajeCredito = porcentajeCredito,
                    Porcentaje1Pago = porcentaje1Pago
                };

                // Guardar el resultado en la caché por 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver el resultado
            return Ok(resultado);
        }

        [HttpPost("barracomparativa")]
        public async Task<IActionResult> BarraComparativa(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest("Token inválido.");
            }

            // Obtener la fecha de inicio o utilizar la actual si no se proporciona
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    return BadRequest("Fecha inválida.");
                }
            }

            // Generar la clave de caché
            string cacheKey = $"BarraComparativa_{fechaToken:MM-yyyy}_{token.Provincia ?? "todas"}";

            // Verificar si los resultados ya están en caché
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Llamar al servicio para obtener los datos de los últimos 4 meses
                resultado = await _baseService.ObtenerDatosComparativos(fechaToken, token.Provincia);

                // Guardar en caché por 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver el resultado
            return Ok(resultado);
        }
        [HttpPost("barracomparativaprovincia")]
        public async Task<IActionResult> BarraComparativaProvincia(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest("Token inválido.");
            }

            // Obtener la fecha de inicio o utilizar la actual si no se proporciona
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    return BadRequest("Fecha inválida.");
                }
            }

            // Generar la clave de caché
            string cacheKey = $"BarraComparativaProvincia_{fechaToken:MM-yyyy}_{token.Provincia ?? "todas"}";

            // Verificar si los resultados ya están en caché
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Llamar al servicio para obtener los datos de los últimos 4 meses
                resultado = await _baseService.ObtenerDatosComparativosPorProvincia(fechaToken);

                // Guardar en caché por 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver el resultado
            return Ok(resultado);
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
        [HttpPost("facturacionPorTerminalSemana")]
        public async Task<IActionResult> FacturacionPorTerminalSemana(VMToken token)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest("Token inválido.");
            }

            // Obtener la fecha de inicio o utilizar la actual si no se proporciona
            DateTime fechaToken;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    return BadRequest("Fecha inválida.");
                }
            }

            // Generar la clave de caché, incluyendo la provincia
            string cacheKey = $"FacturacionPorTerminalSemana_{fechaToken:MM-yyyy}_{RemoverAcentos(token.Provincia ?? "todas")}";

            // Verificar si los resultados ya están en caché
            if (!_cache.TryGetValue(cacheKey, out var resultado))
            {
                // Calcular el primer día del mes actual
                DateTime primerDiaDelMes = new DateTime(fechaToken.Year, fechaToken.Month, 1);

                // Obtener todas las terminales
                var terminales = await _altaservice.ObtenerCRM();

                // Aplicar filtro de provincia si se proporciona en el token
                if (!string.IsNullOrEmpty(token.Provincia))
                {
                    string provinciaNormalizada = RemoverAcentos(token.Provincia).ToLower();
                    terminales = terminales.Where(t => RemoverAcentos(t.Provincia)?.ToLower() == provinciaNormalizada).ToList();
                }

                // Filtrar terminales con estado "ALTA"
                var terminalesActivas = terminales.Where(t => t.Estado == "ALTA").ToList();

                // Variables para contar terminales en cada rango de facturación
                int facturacionMas80 = 0;
                int facturacionMas60 = 0;
                int facturacionMas40 = 0;
                int facturacionMas20 = 0;
                int facturacionMenos20 = 0;

                // El total de terminales ahora incluye todas, no solo las "ALTA"
                int totalTerminales = terminales.Count;

                // Procesar las terminales "ALTA"
                foreach (var terminal in terminalesActivas)
                {
                    int diasHabiles = 0;
                    int diasFacturados = 0;

                    // Verificar que la terminal tenga CuitCuil y NDeTerminal antes de continuar
                    if (string.IsNullOrEmpty(terminal.CuitCuil.ToString()) || string.IsNullOrEmpty(terminal.NDeTerminal.ToString()))
                    {
                        facturacionMenos20++;
                        continue; // Si no tiene CuitCuil o NDeTerminal, omitir esta terminal y pasar a la siguiente
                    }

                    // Obtener todas las facturaciones del mes para esta terminal en una sola consulta
                    var facturacionesDelMes = await _baseService.ObtenerFacturacionPorTerminalRango(
                        terminal.CuitCuil.ToString(),
                        terminal.NDeTerminal.ToString(),
                        primerDiaDelMes,
                        fechaToken
                    );

                    // Recorrer todos los días hábiles del mes
                    for (DateTime fecha = primerDiaDelMes; fecha <= fechaToken; fecha = fecha.AddDays(1))
                    {
                        if (fecha.DayOfWeek != DayOfWeek.Saturday && fecha.DayOfWeek != DayOfWeek.Sunday)
                        {
                            diasHabiles++;

                            // Verificar si hubo facturación en este día
                            if (facturacionesDelMes.Any(f => f.FechaDePago.HasValue && f.FechaDePago.Value.Date == fecha.Date))
                            {
                                diasFacturados++;
                            }
                        }
                    }

                    // Calcular el porcentaje de días que facturó
                    decimal porcentajeFacturacion = (diasFacturados * 100m) / diasHabiles;

                    // Incrementar el conteo en el rango correspondiente
                    if (porcentajeFacturacion > 80)
                    {
                        facturacionMas80++;
                    }
                    else if (porcentajeFacturacion > 60)
                    {
                        facturacionMas60++;
                    }
                    else if (porcentajeFacturacion > 40)
                    {
                        facturacionMas40++;
                    }
                    else if (porcentajeFacturacion > 20)
                    {
                        facturacionMas20++;
                    }
                    else
                    {
                        facturacionMenos20++;
                    }
                }

                // Las terminales que no están en estado "ALTA" van directamente a "facturacionMenos20"
                facturacionMenos20 += terminales.Count(t => t.Estado != "ALTA");

                // Calcular los porcentajes de terminales en cada rango
                decimal porcentajeMas80 = (facturacionMas80 * 100m) / totalTerminales;
                decimal porcentajeMas60 = (facturacionMas60 * 100m) / totalTerminales;
                decimal porcentajeMas40 = (facturacionMas40 * 100m) / totalTerminales;
                decimal porcentajeMas20 = (facturacionMas20 * 100m) / totalTerminales;
                decimal porcentajeMenos20 = (facturacionMenos20 * 100m) / totalTerminales;

                // Preparar el resultado
                resultado = new
                {
                    TotalTerminales = totalTerminales,
                    FacturacionMas80 = new { Cantidad = facturacionMas80, Porcentaje = porcentajeMas80 },
                    FacturacionMas60 = new { Cantidad = facturacionMas60, Porcentaje = porcentajeMas60 },
                    FacturacionMas40 = new { Cantidad = facturacionMas40, Porcentaje = porcentajeMas40 },
                    FacturacionMas20 = new { Cantidad = facturacionMas20, Porcentaje = porcentajeMas20 },
                    FacturacionMenos20 = new { Cantidad = facturacionMenos20, Porcentaje = porcentajeMenos20 }
                };

                // Guardar en caché por 10 minutos
                var cacheOptions = new MemoryCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
                };
                _cache.Set(cacheKey, resultado, cacheOptions);
            }

            // Devolver el resultado
            return Ok(resultado);
        }
        [HttpPost("excelcrmsemanal")]
        public async Task<IActionResult> excelcrmsemanal(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (!esTokenValido)
            {
                return BadRequest("Token inválido.");
            }

            DateTime fecha;
            if (string.IsNullOrEmpty(token.Fecha))
            {
                fecha = DateTime.Now; // Si no se proporciona fecha, usar la actual
            }
            else
            {
                try
                {
                    fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fecha = DateTime.Now; // Si la conversión falla, usar la fecha actual
                }
            }

            var alta = await _altaservice.ObtenerCRM();
            var baja = await _IBajaservice.ObtenerCRMBaja();

            int mesFecha = fecha.Month;
            int anioFecha = fecha.Year;

            // Normalizar provincia si se proporciona
            string provinciaNormalizada = string.IsNullOrEmpty(token.Provincia) ? null : RemoverAcentos(token.Provincia).ToLower();

            // Filtrar y ordenar las altas del mes por fecha de alta descendente
            var altasDelMes = alta
                .Where(a => a.FechaDeAlta.HasValue
                            && a.FechaDeAlta.Value.Month == mesFecha
                            && a.FechaDeAlta.Value.Year == anioFecha
                            && (a.Altas == "ALTA NUEVA" || a.Altas == "AGREGA" || a.Altas == "ALTA CCTT")
                            && (provinciaNormalizada == null || RemoverAcentos(a.Provincia)?.ToLower() == provinciaNormalizada)) // Filtro de provincia
                .OrderByDescending(a => a.FechaDeAlta) // Ordenar por fecha de alta más reciente
                .ToList();

            // Filtrar y ordenar las bajas del mes por fecha de baja descendente
            var bajasDelMes = baja
                .Where(b => b.FechaDeBaja.HasValue
                            && b.FechaDeBaja.Value.Month == mesFecha
                            && b.FechaDeBaja.Value.Year == anioFecha
                            && (b.Baja1 == "BAJA POR FACTURACION" || b.Baja1 == "BAJA")
                            && (provinciaNormalizada == null || RemoverAcentos(b.Provincia)?.ToLower() == provinciaNormalizada)) // Filtro de provincia
                .OrderByDescending(b => b.FechaDeBaja) // Ordenar por fecha de baja más reciente
                .ToList();

            // Crear arrays para las altas y bajas
            var altasArray = altasDelMes.Select(a => new
            {
                Estado = a.Estado,
                NDeTerminal = a.NDeTerminal,
                NombreDeFantasia = a.NombreDeFantasia,
                Provincia = a.Provincia,
                FechaDeAlta = a.FechaDeAlta?.ToString("dd/MM/yyyy"),
                Alta = a.Altas,
                Gestor = a.NombreDelAsesor,
                Cuit = a.CuitRazonSocial
            }).ToArray();

            var bajasArray = bajasDelMes.Select(b => new
            {
                FechaDeBaja = b.FechaDeBaja?.ToString("dd/MM/yyyy"),
                NDeTerminal = b.NDeTerminal,
                NombreDeFantasia = b.NombreDeFantasia,
                Domicilio = b.Domicilio,
                Provincia = b.Provincia,
                Tipo = b.Baja1,
                Motivo = b.Observacion,
                BajaPor = altasDelMes.Any(a => a.CuitRazonSocial == Convert.ToDouble(b.CuitRazonSocial) && a.Estado == "ALTA") ? "Terminal" : "CUIT"
            }).ToArray();

            // Contar el total de altas y bajas
            int totalAltas = altasDelMes.Count;
            int totalBajas = bajasDelMes.Count;

            // Devolver los arrays de altas y bajas junto con los conteos
            return Ok(new
            {
                Altas = altasArray,
                Bajas = bajasArray,
                TotalAltas = totalAltas, // Contador de altas
                TotalBajas = totalBajas  // Contador de bajas
            });
        }






    }
}
