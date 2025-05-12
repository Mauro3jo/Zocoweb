using AutoMapper;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContablidadController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
    
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenservice;
        public ContablidadController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
        }
        [HttpPost("contabilidad")]
        public async Task<ActionResult> Contabilidad([FromBody] VMDatosInicio request)
        {

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {


                var currentDate = DateTime.Now; 
                var firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1); 
                var dayOfWeek = (int)firstDayOfMonth.DayOfWeek; 
                var currentWeek = (int)Math.Ceiling((currentDate.Day + dayOfWeek) / 7.0);



                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);

                DateTime fechaActual = DateTime.Now;


                DateTime primerDiaMesActual = new DateTime(fechaActual.Year, fechaActual.Month, 1);

                DateTime primerDiaMesPasado = primerDiaMesActual.AddMonths(-1);


                DateTime ultimoDiaMesPasadoComparable = primerDiaMesPasado.AddMonths(1).AddDays(-1);
                DateTime fechaComparableMesPasado = primerDiaMesPasado.AddDays(fechaActual.Day - 1);
              
                if (request.Year == currentDate.Year && request.Month == currentDate.Month && request.Week == currentWeek)
                {

                    var fechaPagoMasActual = sas.Max(s => s.FechaDePago);
                    
                    if (request.comercio.ToLower() == "todos")
                    {
                      
                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalNetoHoy = ObtenerTotalNeto(listaHoy);
                        var totalBrutoHoy = ObtenerTotalBruto(listaHoy);
                      var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalRetencionesMes = ObtenerTotalRetenciones(listaMes);
                        var totalIvaMes = ObtenerTotalIva(listaMes);
                        var totalIva21Mes = ObtenerTotalIva21(listaMes); 
                        var totalbrutomes = ObtenerTotalBruto(listaMes); 
                        var totaldebito = (totalbrutomes * 21) / 100; 
                        var arancel = obtenerarancelmes(listaMes); 
                        var ingresobruto = obteneringresobruto(listaMes);
                        var retencionganancia = obtenerretencionganancia(listaMes); 
                        var retencioniva = ObtenerTotalRetencionesIva(listaMes);  
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalNetoMes = totalNetoMes,
                            TotalNetoHoy = totalNetoHoy,
                            TotalBrutoHoy = totalBrutoHoy,
                            TotalOperaciones = totalOperaciones,
                            TotalRetencionesMes = totalRetencionesMes,
                            TotalIvaMes = totalIvaMes,
                            TotalIva21Mes = totalIva21Mes,
                            Totaldebito = totaldebito,
                            Arancel = arancel,
                            TotalBrutoMes = totalbrutomes,
                            Ingresobruto = ingresobruto,
                            Retencionganancia = retencionganancia,
                            RetecionIva = retencioniva,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                          s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();

                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalNetoHoy = ObtenerTotalNeto(listaHoy);
                        var totalBrutoHoy = ObtenerTotalBruto(listaHoy);
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalRetencionesMes = ObtenerTotalRetenciones(listaMes);
                        var totalIvaMes = ObtenerTotalIva(listaMes);
                        var totalIva21Mes = ObtenerTotalIva21(listaMes);
                        var totalbrutomes = ObtenerTotalBruto(listaMes);
                        var totaldebito = (totalbrutomes * 21) / 100;
                        var arancel = obtenerarancelmes(listaMes);
                        var ingresobruto = obteneringresobruto(listaMes);
                        var retencionganancia = obtenerretencionganancia(listaMes);
                        var retencioniva = ObtenerTotalRetencionesIva(listaMes);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalNetoMes = totalNetoMes,
                            TotalNetoHoy = totalNetoHoy,
                            TotalBrutoHoy = totalBrutoHoy,
                            TotalOperaciones = totalOperaciones,
                            TotalRetencionesMes = totalRetencionesMes,
                            TotalIvaMes = totalIvaMes,
                            TotalIva21Mes = totalIva21Mes,
                            Totaldebito = totaldebito,
                            Arancel = arancel,
                            TotalBrutoMes = totalbrutomes,
                            Ingresobruto = ingresobruto,
                            Retencionganancia = retencionganancia,
                            RetecionIva = retencioniva,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }
                else 
                {
                  
                   
                    if (request.comercio.ToLower() == "todos")
                    {

                        DateTime fechaInicial = GetFirstDayOfWeekInMonth(request.Year, request.Month, request.Week);
                        DateTime fechaFinalDeLaSemana;

                      
                        if (request.Week == 8)
                        {
                            fechaFinalDeLaSemana = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));
                        }
                        else
                        {

                            fechaFinalDeLaSemana = GetLastDayOfWeek(fechaInicial);
                        }


                        var listaFiltrada = sas.Where(s =>
                         s.FechaDePago.HasValue &&
                             s.FechaDePago.Value.Date >= fechaInicial.Date &&
                             s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                              .ToList();

                        var listaHoy = ObtenerListaPorFecha(listaFiltrada, fechaFinalDeLaSemana);
                        var listaMes = ObtenerListaPorRangoFecha(listaFiltrada, fechaInicial, fechaFinalDeLaSemana);
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalRetencionesMes = ObtenerTotalRetenciones(listaMes);
                        var totalIvaMes = ObtenerTotalIva(listaMes);
                        var totalIva21Mes = ObtenerTotalIva21(listaMes);
                        var totalbrutomes = ObtenerTotalBruto(listaMes);
                        var totaldebito = (totalbrutomes * 21) / 100;
                        var arancel = obtenerarancelmes(listaMes);
                        var ingresobruto = obteneringresobruto(listaMes);
                        var retencionganancia = obtenerretencionganancia(listaMes);
                        var retencioniva = ObtenerTotalRetencionesIva(listaMes);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalNetoMes = totalNetoMes,
                            TotalNetoHoy = 0,
                            TotalBrutoHoy = 0,
                            TotalOperaciones = totalOperaciones,
                            TotalRetencionesMes = totalRetencionesMes,
                            TotalIvaMes = totalIvaMes,
                            TotalIva21Mes = totalIva21Mes,
                            Totaldebito = totaldebito,
                            Arancel = arancel,
                            TotalBrutoMes = totalbrutomes,
                            Ingresobruto = ingresobruto,
                            Retencionganancia = retencionganancia,
                            RetecionIva = retencioniva,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                          s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();

                        DateTime fechaInicial = GetFirstDayOfWeekInMonth(request.Year, request.Month, request.Week);
                        DateTime fechaFinalDeLaSemana;

                       
                        if (request.Week == 8)
                        {
                            fechaFinalDeLaSemana = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));
                        }
                        else
                        {
                           
                            fechaFinalDeLaSemana = GetLastDayOfWeek(fechaInicial);
                        }


                        var listaFiltrada = sas.Where(s =>
                          s.FechaDePago.HasValue &&
                              s.FechaDePago.Value.Date >= fechaInicial.Date &&
                              s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                               .ToList();
                        var listaHoy = ObtenerListaPorFecha(listaFiltrada, fechaFinalDeLaSemana);
                        var listaMes = ObtenerListaPorRangoFecha(listaFiltrada, fechaInicial, fechaFinalDeLaSemana);
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalRetencionesMes = ObtenerTotalRetenciones(listaMes);
                        var totalIvaMes = ObtenerTotalIva(listaMes);
                        var totalIva21Mes = ObtenerTotalIva21(listaMes);
                        var totalbrutomes = ObtenerTotalBruto(listaMes);
                        var totaldebito = (totalbrutomes * 21) / 100;
                        var arancel = obtenerarancelmes(listaMes);
                        var ingresobruto = obteneringresobruto(listaMes);
                        var retencionganancia = obtenerretencionganancia(listaMes);
                        var retencioniva = ObtenerTotalRetencionesIva(listaMes);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalNetoMes = totalNetoMes,
                            TotalNetoHoy = 0,
                            TotalBrutoHoy = 0,
                            TotalOperaciones = totalOperaciones,
                            TotalRetencionesMes = totalRetencionesMes,
                            TotalIvaMes = totalIvaMes,
                            TotalIva21Mes = totalIva21Mes,
                            Totaldebito = totaldebito,
                            Arancel = arancel,
                            TotalBrutoMes = totalbrutomes,
                            Ingresobruto = ingresobruto,
                            Retencionganancia = retencionganancia,
                            RetecionIva = retencioniva,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        private DateTime GetFirstDayOfWeekInMonth(int year, int month, int weekNumber)
        {
            var cultureInfo = CultureInfo.CurrentCulture;
            var firstDayOfMonth = new DateTime(year, month, 1);
            var dayOfWeek = cultureInfo.Calendar.GetDayOfWeek(firstDayOfMonth);
            var firstDayOfWeek = cultureInfo.DateTimeFormat.FirstDayOfWeek;

            var offset = (7 + (dayOfWeek - firstDayOfWeek)) % 7;
            var firstWeekStart = firstDayOfMonth.AddDays(-offset);
            var weekStart = firstWeekStart.AddDays((weekNumber - 1) * 7);

            return weekStart.Month == month ? weekStart : firstDayOfMonth;
        }
        private DateTime GetLastDayOfWeek(DateTime startDate)
        {
            var endDate = startDate.AddDays(6); 

            
            var lastDayOfMonth = new DateTime(startDate.Year, startDate.Month, DateTime.DaysInMonth(startDate.Year, startDate.Month));
            if (endDate > lastDayOfMonth)
            {
                endDate = lastDayOfMonth;
            }

            return endDate;
        }
        private int GetWeekOfYear(DateTime date)
        {
            
            var cultureInfo = CultureInfo.CurrentCulture;
            var calendarWeekRule = cultureInfo.DateTimeFormat.CalendarWeekRule;
            var firstDayOfWeek = cultureInfo.DateTimeFormat.FirstDayOfWeek;

            return cultureInfo.Calendar.GetWeekOfYear(date, calendarWeekRule, firstDayOfWeek);
        }
        private DateTime GetLastDayOfWeek(DateTime date, int weekNumber)
        {
            var cultureInfo = CultureInfo.CurrentCulture;
            var calendar = cultureInfo.Calendar;
            var firstDayOfWeek = cultureInfo.DateTimeFormat.FirstDayOfWeek;

            
            var firstDayOfYear = new DateTime(date.Year, 1, 1);
            var daysOffset = firstDayOfWeek - firstDayOfYear.DayOfWeek;
            var firstDayOfFirstWeek = firstDayOfYear.AddDays(daysOffset);

            
            var weekStart = firstDayOfFirstWeek.AddDays((weekNumber - 1) * 7);
            var weekEnd = weekStart.AddDays(6);

            return weekEnd;
        }
        private object obtenerretencionganancia(List<BaseDashboard> listaMes)
        {
            return (double)(listaMes.Sum(s => s.RetencionGanacia) ?? 0);
        }

        private object obteneringresobruto(List<BaseDashboard> listaMes)
        {
            return (double)listaMes.Sum(s => s.RetencionProvincial);
        }

        private object obtenerarancelmes(List<BaseDashboard> listaMes)
        {
            return (double)listaMes.Sum(s => s.Arancel);
        }

        private double ObtenerTotalOperaciones(List<BaseDashboard> sas)
        {
            return (double)sas.Count();
        }
        private double ObtenerTotalIva21(List<BaseDashboard> listaMes)
        {
            return (double)(listaMes.Sum(s => s.Iva21) ?? 0);
        }


        private List<BaseDashboard> ObtenerListaPorFecha(List<BaseDashboard> sas, DateTime fecha)
        {
            return sas.Where(s => s.FechaDePago == fecha.Date).ToList();
        }
        private List<BaseDashboard> ObtenerListaPorRangoFecha(List<BaseDashboard> sas, DateTime fechaInicio, DateTime fechaFin)
        {
            return sas.Where(s => s.FechaDePago >= fechaInicio.Date && s.FechaDePago <= fechaFin.Date).ToList();
        }
        private double ObtenerTotalNeto(List<BaseDashboard> lista)
        {
            return (double)(lista.Sum(s => s.TotalConDescuentos) ?? 0);
        }
        private double ObtenerTotalBruto(List<BaseDashboard> lista)
        {
            return (double)lista.Sum(s => s.TotalBruto);
        }
        private double ObtenerTotalRetenciones(List<BaseDashboard> lista)
        {
            return (double)lista.Sum(s => s.RetencionImpositiva);
        }
        private double ObtenerTotalRetencionesIva(List<BaseDashboard> lista)
        {
            return (double)lista.Sum(s => s.RetencionIva);
        }
        private double ObtenerTotalIva(List<BaseDashboard> lista)
        {
            return (double)lista.Sum(s => s.Arancel + s.Iva21);
        }
    }
}
