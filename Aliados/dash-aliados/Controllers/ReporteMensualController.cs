using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReporteMensualController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariosService;
        private readonly IUsuarioCajeroService _usuariosCajeroService;
        private readonly IAltaService _altaservice;
        private readonly ITokenService _tokenService;
        private readonly ITokenCajeroService _tokencajeroservice;
        private readonly IReporteMensualService _reporteMensualService;
        private readonly IBaseDashboardService _baseDashboardService;
        private readonly IMapper _mapper;
        private readonly string secretKey;

        public ReporteMensualController(IUsuarioZocoService usuariosService, ITokenCajeroService tokenCajeroService,
            IUsuarioCajeroService usuarioCajeroService,
            ITokenService tokenService, IMapper mapper,
            IConfiguration config, IReporteMensualService reporteMensualService, IBaseDashboardService baseDashboardService
            , IAltaService altaservice)
        {
            _usuariosService = usuariosService;
            _usuariosCajeroService = usuarioCajeroService;
            _tokencajeroservice = tokenCajeroService;
            _tokenService = tokenService;
            _mapper = mapper;
            _reporteMensualService = reporteMensualService;
            _baseDashboardService = baseDashboardService;
            _altaservice = altaservice;

        }
        [HttpPost("reportemensual")]
        public async Task<IActionResult> ReporteMensual([FromBody] VMReparte request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            try
            {
                string fechaString = request.Fecha;
                DateTime fechahoy;
                bool success = DateTime.TryParse(fechaString, out fechahoy);
                var datosbase = await _baseDashboardService.Listahoy(fechahoy);
                var ExisteReporte = await _reporteMensualService.ExisteReporteFecha(fechahoy);
                if (ExisteReporte)
                {
                    return BadRequest("El reporte ya existe");
                }

                var grupos = datosbase
                    .GroupBy(d => new { d.NroDeComercio, d.NombreComercio, d.FechaOperacion })
                    .Select(g => new
                    {
                        NroDeComercio = g.Key.NroDeComercio,
                        NombreComercio = g.Key.NombreComercio,
                        FechaOperacion = g.Key.FechaOperacion,
                        Datos = g.ToList()
                    });

                var reportes = new List<ReporteMensual>();
                var alta = await _altaservice.ObtenerCRM();
                foreach (var grupo in grupos)
                {
                    var reporte = new ReporteMensual
                    {
                        NroDeComercio = grupo.NroDeComercio,
                        NombreComercio = grupo.NombreComercio,
                        FechaDePago = grupo.Datos.FirstOrDefault()?.FechaDePago,
                        FechaOperacion = grupo.Datos.FirstOrDefault()?.FechaOperacion,
                        TotalBruto = (double?)grupo.Datos.Sum(d => d.TotalBruto ?? 0),
                        TotalDebito = (double?)grupo.Datos.Where(d => d.TipoDeFinanciacion.Contains("0")).Sum(d => d.TotalBruto ?? 0),
                        _1Pago = (double?)grupo.Datos.Where(d => d.TipoDeFinanciacion.Contains("Credito") && d.Cuotas == 1).Sum(d => d.TotalBruto ?? 0),
                        CreditoCuotas = (double?)grupo.Datos.Where(d => (d.TipoDeFinanciacion.Contains("Credito") || d.TipoDeFinanciacion.Contains("Ahora")) && d.Cuotas > 1).Sum(d => d.TotalBruto ?? 0),
                        TotalNeto = (double?)grupo.Datos.Sum(d => d.TotalConDescuentos ?? 0),
                        TotalCostoFinanciero = (double?)grupo.Datos.Sum(d => d.CostoFinancieroEn ?? 0),
                        CostoPorAnticipoTotal = (double?)grupo.Datos.Sum(d => d.CostoPorAnticipo ?? 0),
                        Arancel = (double?)grupo.Datos.Sum(d => d.Arancel ?? 0),
                        ImpuestoAlDebitoYCredito = (double?)grupo.Datos.Sum(d => d.ImpuestoDebitoCredito ?? 0),
                        RetencionProvincial = (double?)grupo.Datos.Sum(d => d.RetencionProvincial ?? 0),
                        RetencionGanancia = (double?)grupo.Datos.Sum(d => d.RetencionGanacia ?? 0),
                        RetencionIva = (double?)grupo.Datos.Sum(d => d.RetencionIva ?? 0),
                        RetencionMunicipal = (double?)grupo.Datos.Sum(d => d.RetencionMunicipal ?? 0),
                        RetencionImpositiva = (double?)grupo.Datos.Sum(d => d.RetencionImpositiva ?? 0),
                        CbuCvu = grupo.Datos.FirstOrDefault()?.CbuCvu,
                        Banco = grupo.Datos.FirstOrDefault()?.Banco,
                        TipoDeCuenta = grupo.Datos.FirstOrDefault()?.TipoDeCuenta,
                        NroDeCuenta = grupo.Datos.FirstOrDefault()?.NroDeCuenta,
                        Alias = grupo.Datos.FirstOrDefault()?.Alias,
                        Retencion = grupo.Datos.FirstOrDefault()?.Retencion,
                        AsesorAbm = grupo.Datos.FirstOrDefault()?.AsesorAbm,
                        Rubro = grupo.Datos.FirstOrDefault()?.Rubro,
                        FechaAltaComercio = grupo.Datos.FirstOrDefault()?.FechaAltaComercio,
                        ProvinciaAbm = grupo.Datos.FirstOrDefault()?.ProvinciaAbm,
                        RazonSocial = grupo.Datos.FirstOrDefault()?.RazonSocial,
                        Legajo = grupo.Datos.FirstOrDefault()?.Legajo,
                        CodActividad = grupo.Datos.FirstOrDefault()?.CodActividad,
                        AñoPago = grupo.Datos.FirstOrDefault()?.AñoPago,
                        MesPago = grupo.Datos.FirstOrDefault()?.MesPago,
                    };

                    await _reporteMensualService.NuevoReporte(reporte);

                    reportes.Add(reporte);
                }

                foreach (var item in alta)
                {
                    var existeEnBaseDashboard = datosbase.Any(d => d.NroDeComercio == item.NDeTerminal && d.FechaDePago == fechahoy);
                    if (!existeEnBaseDashboard)
                    {
                        var reporte = new ReporteMensual
                        {
                            NroDeComercio = item.NDeTerminal,
                            NombreComercio = item.NombreDeFantasia,
                            FechaDePago = fechahoy,
                            FechaOperacion = fechahoy,

                            TotalBruto = 0,
                            TotalDebito = null,
                            _1Pago = null,
                            CreditoCuotas = null,
                            TotalNeto = null,
                            TotalCostoFinanciero = null,
                            CostoPorAnticipoTotal = null,
                            Arancel = null,
                            ImpuestoAlDebitoYCredito = null,
                            RetencionProvincial = null,
                            RetencionGanancia = null,
                            RetencionIva = null,
                            RetencionMunicipal = null,
                            RetencionImpositiva = null,
                            CbuCvu = item.CbuCvu,
                            Banco = item.Banco,
                            TipoDeCuenta = item.TipoDeCuenta,
                            NroDeCuenta = item.NDeCuenta,
                            Alias = item.Alias,
                            Retencion = null,
                            AsesorAbm = item.NombreDelAsesor,
                            Rubro = item.Rubro,
                            FechaAltaComercio = item.FechaDeAlta.HasValue ? item.FechaDeAlta.Value.ToOADate() : (double?)null,
                            ProvinciaAbm = item.Provincia,
                            RazonSocial = item.RazonSocial,
                            Legajo = item.Legajo,
                            CodActividad = item.CodActividadRentas,
                            AñoPago = fechahoy.Year,
                            MesPago = fechahoy.Month,
                        };

                        await _reporteMensualService.NuevoReporte(reporte);
                        reportes.Add(reporte);
                    }
                }

                return Ok(reportes);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "No se pudieron obtener los reportes debido a un error interno del servidor." });
            }
        }

        [HttpPost("evolucionterminales")]
        public async Task<IActionResult> EvolucionTerminales([FromBody] VMReparte request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            string fechaString = request.Fecha;
            DateTime fechahoy;
            bool success = DateTime.TryParse(fechaString, out fechahoy);
            if (!success)
            {
                return BadRequest("Fecha no válida");
            }

            var resultadosPorDia = new Dictionary<DateTime, List<ReporteMensual>>();
            var conteoRegistrosPorDia = new Dictionary<DateTime, int>();

            double totalBrutoSum = 0;
            double totalDebitoSum = 0;
            double total1PagoSum = 0;
            double totalCreditoCuotasSum = 0;
            double totalNetoSum = 0;
            double totalBrutoSinIdentificar = 0;  // Suma de facturaciones sin identificar
            double totalDebitoSinIdentificar = 0;
            double total1PagoSinIdentificar = 0;
            double totalCreditoCuotasSinIdentificar = 0;
            double totalNetoSinIdentificar = 0;
            int comerciosConBruto = 0;
            int comerciosSinBruto = 0;
            int comerciosTotales = 0;
            double porcentajeSinBruto = 0;
            double porcentajeConBruto = 0;
            DateTime primerDiaMes = new DateTime(fechahoy.Year, fechahoy.Month, 1);

            // Variables para el análisis de los últimos 30 días
            DateTime fechaInicio = fechahoy.AddDays(-30);
            var categoriasFacturacion = new int[6];

            var comercioDiasFacturados = new Dictionary<string, HashSet<DateTime>>();

            for (DateTime fecha = primerDiaMes; fecha <= fechahoy; fecha = fecha.AddDays(1))
            {
                var reportesDelDia = await _reporteMensualService.ObtenerListaReporteMes(fecha);

                var reportesFiltrados = new List<ReporteMensual>();

                foreach (var reporte in reportesDelDia)
                {
                    Alta alta = null;
                    if (!string.IsNullOrEmpty(Convert.ToString(reporte.NroDeComercio)))
                    {
                        alta = await _altaservice.ObtenerPorNroTerminal(Convert.ToString(reporte.NroDeComercio));
                    }
                    if (alta != null)
                    {
                        reportesFiltrados.Add(reporte);
                    }
                    else
                    {
                        totalBrutoSinIdentificar += reporte.TotalBruto ?? 0;
                        totalDebitoSinIdentificar += reporte.TotalDebito ?? 0;
                        total1PagoSinIdentificar += reporte._1Pago ?? 0;
                        totalCreditoCuotasSinIdentificar += reporte.CreditoCuotas ?? 0;
                        totalNetoSinIdentificar += reporte.TotalNeto ?? 0;
                    }
                }
                resultadosPorDia[fecha.Date] = reportesFiltrados;
                var registrosDelDia = await _baseDashboardService.Listahoy(fecha);
                conteoRegistrosPorDia[fecha.Date] = registrosDelDia.Count;


                var reportesAgrupados = reportesDelDia
                    .GroupBy(r => r.NroDeComercio)
                    .Select(g => new ReporteMensual
                    {
                        NroDeComercio = g.Key,
                        TotalBruto = g.Sum(r => r.TotalBruto ?? 0),
                        TotalDebito = g.Sum(r => r.TotalDebito ?? 0),
                        _1Pago = g.Sum(r => r._1Pago ?? 0),
                        CreditoCuotas = g.Sum(r => r.CreditoCuotas ?? 0),
                        TotalNeto = g.Sum(r => r.TotalNeto ?? 0)
                    }).ToList();

                foreach (var reporte in reportesAgrupados)
                {
                    totalBrutoSum += reporte.TotalBruto ?? 0;
                    totalDebitoSum += reporte.TotalDebito ?? 0;
                    total1PagoSum += reporte._1Pago ?? 0;
                    totalCreditoCuotasSum += reporte.CreditoCuotas ?? 0;
                    totalNetoSum += reporte.TotalNeto ?? 0;

                    if (reporte.TotalBruto.HasValue && reporte.TotalBruto.Value > 0)
                    {
                        comerciosConBruto = reportesDelDia.Count(r => r.TotalBruto > 0);
                        comerciosSinBruto = reportesDelDia.Count(r => r.TotalBruto <= 0);
                        comerciosTotales = comerciosConBruto + comerciosSinBruto;
                        porcentajeConBruto = Math.Round(((double)comerciosConBruto / comerciosTotales) * 100, 2);
                        porcentajeSinBruto = Math.Round(((double)comerciosSinBruto / comerciosTotales) * 100, 2);
                    }
                }
            }

            // Análisis de los últimos 30 días
            for (DateTime fecha = fechaInicio; fecha <= fechahoy; fecha = fecha.AddDays(1))
            {
                var reportesDelDia = await _reporteMensualService.ObtenerListaReporteMes(fecha);

                var reportesAgrupados = reportesDelDia
                    .GroupBy(r => r.NroDeComercio)
                    .Select(g => new
                    {
                        NroDeComercio = g.Key.ToString(), // Convertir a string
                        TotalBruto = g.Sum(r => r.TotalBruto ?? 0)
                    }).ToList();

                foreach (var reporte in reportesAgrupados)
                {

                    if (!comercioDiasFacturados.ContainsKey(reporte.NroDeComercio))
                    {
                        comercioDiasFacturados[reporte.NroDeComercio] = new HashSet<DateTime>();
                    }
                    if (reporte.TotalBruto > 0)
                    {
                        comercioDiasFacturados[reporte.NroDeComercio].Add(fecha);
                    }
                }
            }

            foreach (var comercio in comercioDiasFacturados)
            {
                double porcentajeFacturacion = (comercio.Value.Count / 30.0) * 100;
                if (porcentajeFacturacion == 0)
                {
                    categoriasFacturacion[0]++;
                }
                else if (porcentajeFacturacion > 0 && porcentajeFacturacion <= 20)
                {
                    categoriasFacturacion[1]++;
                }
                else if (porcentajeFacturacion > 20 && porcentajeFacturacion <= 40)
                {
                    categoriasFacturacion[2]++;
                }
                else if (porcentajeFacturacion > 40 && porcentajeFacturacion <= 60)
                {
                    categoriasFacturacion[3]++;
                }
                else if (porcentajeFacturacion > 60 && porcentajeFacturacion <= 80)
                {
                    categoriasFacturacion[4]++;
                }
                else if (porcentajeFacturacion > 80)
                {
                    categoriasFacturacion[5]++;
                }
            }

            double porcentajeDebito = totalBrutoSum != 0 ? (totalDebitoSum / totalBrutoSum) * 100 : 0;
            double porcentaje1Pago = totalBrutoSum != 0 ? (total1PagoSum / totalBrutoSum) * 100 : 0;
            double porcentajeCreditoCuotas = totalBrutoSum != 0 ? (totalCreditoCuotasSum / totalBrutoSum) * 100 : 0;
            double sumaPorcentajes = porcentajeDebito + porcentaje1Pago + porcentajeCreditoCuotas;

            if (sumaPorcentajes > 0)
            {
                porcentajeDebito = Math.Round((porcentajeDebito / sumaPorcentajes) * porcentajeConBruto, 2);
                porcentaje1Pago = Math.Round((porcentaje1Pago / sumaPorcentajes) * porcentajeConBruto, 2);
                porcentajeCreditoCuotas = Math.Round((porcentajeCreditoCuotas / sumaPorcentajes) * porcentajeConBruto, 2);
            }

            var resultadosAdicionales = new
            {
                TotalBruto = Math.Round(totalBrutoSum, 2),
                TotalDebito = Math.Round(totalDebitoSum, 2),
                _1Pago = Math.Round(total1PagoSum, 2),
                CreditoCuotas = Math.Round(totalCreditoCuotasSum, 2),
                TotalNeto = Math.Round(totalNetoSum, 2),
                Fecha = fechahoy.ToString(),
                ComerciosConBruto = comerciosConBruto,
                ComerciosSinBruto = comerciosSinBruto,
                Comercios = comerciosTotales,
                porcentajesSinBruto = porcentajeSinBruto,
                porcentajesConBruto = porcentajeConBruto,
                PorcentajeDebito = porcentajeDebito,
                Porcentaje1Pago = porcentaje1Pago,
                PorcentajeCreditoCuotas = porcentajeCreditoCuotas
            };

            var resultadoFinal = new
            {
                ResultadosPorDia = resultadosPorDia,
                ResultadosAdicionales = resultadosAdicionales,
                ConteoOperaciones = conteoRegistrosPorDia,
                CategoriasFacturacion = categoriasFacturacion
            };

            return Ok(resultadoFinal);
        }

        //[HttpPost("evolucionterminales")]
        //public async Task<IActionResult> EvolucionTerminales([FromBody] VMReparte request)
        //{
        //    bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
        //    if (!esTokenValido)
        //    {
        //        return Unauthorized("El token o el ID de la sesión no son válidos");
        //    }

        //    var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
        //    if (usuarioEncontrado.usuario == null)
        //    {
        //        return NotFound("Usuario no encontrado.");
        //    }

        //    string fechaString = request.Fecha;
        //    DateTime fechahoy;
        //    bool success = DateTime.TryParse(fechaString, out fechahoy);
        //    if (!success)
        //    {
        //        return BadRequest("Fecha no válida");
        //    }

        //    var resultadosPorDia = new Dictionary<DateTime, List<ReporteMensual>>();
        //    var conteoRegistrosPorDia = new Dictionary<DateTime, int>();

        //    double totalBrutoSum = 0;
        //    double totalDebitoSum = 0;
        //    double total1PagoSum = 0;
        //    double totalCreditoCuotasSum = 0;
        //    double totalNetoSum = 0;
        //    int comerciosConBruto = 0;
        //    int comerciosSinBruto = 0;
        //    int comerciosTotales = 0;
        //    double porcentajeSinBruto = 0;
        //    double porcentajeConBruto = 0;
        //    DateTime primerDiaMes = new DateTime(fechahoy.Year, fechahoy.Month, 1);

        //    // Variables para el análisis de los últimos 30 días
        //    DateTime fechaInicio = fechahoy.AddDays(-30);
        //    var categoriasFacturacion = new int[6];

        //    var comercioDiasFacturados = new Dictionary<string, HashSet<DateTime>>();

        //    for (DateTime fecha = primerDiaMes; fecha <= fechahoy; fecha = fecha.AddDays(1))
        //    {
        //        var reportesDelDia = await _reporteMensualService.ObtenerListaReporteMes(fecha);
        //        resultadosPorDia[fecha.Date] = reportesDelDia;
        //        var registrosDelDia = await _baseDashboardService.Listahoy(fecha);
        //        conteoRegistrosPorDia[fecha.Date] = registrosDelDia.Count;

        //        var reportesAgrupados = reportesDelDia
        //            .GroupBy(r => r.NroDeComercio)
        //            .Select(g => new ReporteMensual
        //            {
        //                NroDeComercio = g.Key,
        //                TotalBruto = g.Sum(r => r.TotalBruto ?? 0),
        //                TotalDebito = g.Sum(r => r.TotalDebito ?? 0),
        //                _1Pago = g.Sum(r => r._1Pago ?? 0),
        //                CreditoCuotas = g.Sum(r => r.CreditoCuotas ?? 0),
        //                TotalNeto = g.Sum(r => r.TotalNeto ?? 0)
        //            }).ToList();

        //        foreach (var reporte in reportesAgrupados)
        //        {
        //            totalBrutoSum += reporte.TotalBruto ?? 0;
        //            totalDebitoSum += reporte.TotalDebito ?? 0;
        //            total1PagoSum += reporte._1Pago ?? 0;
        //            totalCreditoCuotasSum += reporte.CreditoCuotas ?? 0;
        //            totalNetoSum += reporte.TotalNeto ?? 0;

        //            if (reporte.TotalBruto.HasValue && reporte.TotalBruto.Value > 0)
        //            {
        //                comerciosConBruto = reportesDelDia.Count(r => r.TotalBruto > 0);
        //                comerciosSinBruto = reportesDelDia.Count(r => r.TotalBruto <= 0);
        //                comerciosTotales = comerciosConBruto + comerciosSinBruto;
        //                porcentajeConBruto = Math.Round(((double)comerciosConBruto / comerciosTotales) * 100, 2);
        //                porcentajeSinBruto = Math.Round(((double)comerciosSinBruto / comerciosTotales) * 100, 2);
        //            }
        //        }
        //    }

        //    // Análisis de los últimos 30 días
        //    for (DateTime fecha = fechaInicio; fecha <= fechahoy; fecha = fecha.AddDays(1))
        //    {
        //        var reportesDelDia = await _reporteMensualService.ObtenerListaReporteMes(fecha);

        //        var reportesAgrupados = reportesDelDia
        //            .GroupBy(r => r.NroDeComercio)
        //            .Select(g => new
        //            {
        //                NroDeComercio = g.Key.ToString(), // Convertir a string
        //                TotalBruto = g.Sum(r => r.TotalBruto ?? 0)
        //            }).ToList();

        //        foreach (var reporte in reportesAgrupados)
        //        {
        //            if (!comercioDiasFacturados.ContainsKey(reporte.NroDeComercio))
        //            {
        //                comercioDiasFacturados[reporte.NroDeComercio] = new HashSet<DateTime>();
        //            }
        //            if (reporte.TotalBruto > 0)
        //            {
        //                comercioDiasFacturados[reporte.NroDeComercio].Add(fecha);
        //            }
        //        }
        //    }

        //    foreach (var comercio in comercioDiasFacturados)
        //    {
        //        double porcentajeFacturacion = (comercio.Value.Count / 30.0) * 100;
        //        if (porcentajeFacturacion == 0)
        //        {
        //            categoriasFacturacion[0]++;
        //        }
        //        else if (porcentajeFacturacion > 0 && porcentajeFacturacion <= 20)
        //        {
        //            categoriasFacturacion[1]++;
        //        }
        //        else if (porcentajeFacturacion > 20 && porcentajeFacturacion <= 40)
        //        {
        //            categoriasFacturacion[2]++;
        //        }
        //        else if (porcentajeFacturacion > 40 && porcentajeFacturacion <= 60)
        //        {
        //            categoriasFacturacion[3]++;
        //        }
        //        else if (porcentajeFacturacion > 60 && porcentajeFacturacion <= 80)
        //        {
        //            categoriasFacturacion[4]++;
        //        }
        //        else if (porcentajeFacturacion > 80)
        //        {
        //            categoriasFacturacion[5]++;
        //        }
        //    }

        //    double porcentajeDebito = totalBrutoSum != 0 ? (totalDebitoSum / totalBrutoSum) * 100 : 0;
        //    double porcentaje1Pago = totalBrutoSum != 0 ? (total1PagoSum / totalBrutoSum) * 100 : 0;
        //    double porcentajeCreditoCuotas = totalBrutoSum != 0 ? (totalCreditoCuotasSum / totalBrutoSum) * 100 : 0;
        //    double sumaPorcentajes = porcentajeDebito + porcentaje1Pago + porcentajeCreditoCuotas;

        //    if (sumaPorcentajes > 0)
        //    {
        //        porcentajeDebito = Math.Round((porcentajeDebito / sumaPorcentajes) * porcentajeConBruto, 2);
        //        porcentaje1Pago = Math.Round((porcentaje1Pago / sumaPorcentajes) * porcentajeConBruto, 2);
        //        porcentajeCreditoCuotas = Math.Round((porcentajeCreditoCuotas / sumaPorcentajes) * porcentajeConBruto, 2);
        //    }

        //    var resultadosAdicionales = new
        //    {
        //        TotalBruto = Math.Round(totalBrutoSum, 2),
        //        TotalDebito = Math.Round(totalDebitoSum, 2),
        //        _1Pago = Math.Round(total1PagoSum, 2),
        //        CreditoCuotas = Math.Round(totalCreditoCuotasSum, 2),
        //        TotalNeto = Math.Round(totalNetoSum, 2),
        //        Fecha = fechahoy.ToString(),
        //        ComerciosConBruto = comerciosConBruto,
        //        ComerciosSinBruto = comerciosSinBruto,
        //        Comercios = comerciosTotales,
        //        porcentajesSinBruto = porcentajeSinBruto,
        //        porcentajesConBruto = porcentajeConBruto,
        //        PorcentajeDebito = porcentajeDebito,
        //        Porcentaje1Pago = porcentaje1Pago,
        //        PorcentajeCreditoCuotas = porcentajeCreditoCuotas
        //    };

        //    var resultadoFinal = new
        //    {
        //        ResultadosPorDia = resultadosPorDia,
        //        ResultadosAdicionales = resultadosAdicionales,
        //        ConteoOperaciones = conteoRegistrosPorDia,
        //        CategoriasFacturacion = categoriasFacturacion
        //    };

        //    return Ok(resultadoFinal);
        //}



        //conteoComerciosPorDia.Add(new
        //{
        //    Fecha = fecha.ToString("yyyy-MM-dd"),
        //    ComerciosConBruto = comerciosConBruto,
        //    ComerciosSinBruto = comerciosSinBruto,
        //    Comercios= comerciosTotales,
        //    porcentajesSinBruto= porcentajeSinBruto,
        //    porcentajesConBruto= porcentajeConBruto,
        //});


        [HttpGet("listartodos")]
        public async Task<IActionResult> ListarTodosLosReportes()
        {
            try
            {
                var reportes = await _reporteMensualService.ObtenerListaReporte();
                return Ok(reportes);
            }
            catch (Exception ex)
            {

                return StatusCode(500, new { message = "No se pudieron obtener los reportes debido a un error interno del servidor." });
            }
        }
       
        [HttpPost("reporteMensualAutomatizado")]
        public async Task<IActionResult> ReporteMensualAutomatizado([FromBody] VMReparte request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            try
            {
                DateTime fechaHoy = DateTime.Today;
                DateTime primerDiaMes = new DateTime(fechaHoy.Year, fechaHoy.Month, 1);
                DateTime ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                for (DateTime fecha = primerDiaMes; fecha <= ultimoDiaMes; fecha = fecha.AddDays(1))
                {
                    var datosBase = await _baseDashboardService.Listahoy(fecha);
                    var reportesDelDia = datosBase
                        .GroupBy(d => new { d.NroDeComercio, d.NombreComercio, d.FechaOperacion })
                        .Select(g => new ReporteMensual
                        {
                            NroDeComercio = g.Key.NroDeComercio,
                            NombreComercio = g.Key.NombreComercio,
                            FechaDePago = g.FirstOrDefault()?.FechaDePago,
                            FechaOperacion = g.Key.FechaOperacion,
                            TotalBruto = (double?)g.Sum(d => d.TotalBruto ?? 0),
                            TotalDebito = (double?)g.Where(d => d.TipoDeFinanciacion.Contains("0")).Sum(d => d.TotalBruto ?? 0),
                            _1Pago = (double?)g.Where(d => d.TipoDeFinanciacion.Contains("Credito") && d.Cuotas == 1).Sum(d => d.TotalBruto ?? 0),
                            CreditoCuotas = (double?)g.Where(d => (d.TipoDeFinanciacion.Contains("Credito") || d.TipoDeFinanciacion.Contains("Ahora")) && d.Cuotas > 1).Sum(d => d.TotalBruto ?? 0),
                            TotalNeto = (double?)g.Sum(d => d.TotalConDescuentos ?? 0),
                            TotalCostoFinanciero = (double?)g.Sum(d => d.CostoFinancieroEn ?? 0),
                            CostoPorAnticipoTotal = (double?)g.Sum(d => d.CostoPorAnticipo ?? 0),
                            Arancel = (double?)g.Sum(d => d.Arancel ?? 0),
                            ImpuestoAlDebitoYCredito = (double?)g.Sum(d => d.ImpuestoDebitoCredito ?? 0),
                            RetencionProvincial = (double?)g.Sum(d => d.RetencionProvincial ?? 0),
                            RetencionGanancia = (double?)g.Sum(d => d.RetencionGanacia ?? 0),
                            RetencionIva = (double?)g.Sum(d => d.RetencionIva ?? 0),
                            RetencionMunicipal = (double?)g.Sum(d => d.RetencionMunicipal ?? 0),
                            RetencionImpositiva = (double?)g.Sum(d => d.RetencionImpositiva ?? 0),
                            CbuCvu = g.FirstOrDefault()?.CbuCvu,
                            Banco = g.FirstOrDefault()?.Banco,
                            TipoDeCuenta = g.FirstOrDefault()?.TipoDeCuenta,
                            NroDeCuenta = g.FirstOrDefault()?.NroDeCuenta,
                            Alias = g.FirstOrDefault()?.Alias,
                            Retencion = g.FirstOrDefault()?.Retencion,
                            AsesorAbm = g.FirstOrDefault()?.AsesorAbm,
                            Rubro = g.FirstOrDefault()?.Rubro,
                            FechaAltaComercio = g.FirstOrDefault()?.FechaAltaComercio,
                            ProvinciaAbm = g.FirstOrDefault()?.ProvinciaAbm,
                            RazonSocial = g.FirstOrDefault()?.RazonSocial,
                            Legajo = g.FirstOrDefault()?.Legajo,
                            CodActividad = g.FirstOrDefault()?.CodActividad,
                            AñoPago = g.FirstOrDefault()?.AñoPago,
                            MesPago = g.FirstOrDefault()?.MesPago,
                        }).ToList();

                    foreach (var reporte in reportesDelDia)
                    {
                        await _reporteMensualService.NuevoReporte(reporte);
                    }
                }

                return Ok("Reportes guardados exitosamente.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "No se pudieron obtener los reportes debido a un error interno del servidor." });
            }


        }


    }
}
