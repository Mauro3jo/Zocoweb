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
    public class CuponesController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
       
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenservice;
        private readonly IPDFService _pfService;

        public CuponesController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco, IPDFService pfService)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _pfService = pfService;
        }

        [HttpPost("cupones")]
        public async Task<ActionResult> Cupones([FromBody] VMDatosInicio request)
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
                if (sas == null)
                {
                    return NotFound("Datos no disponibles");
                }
                if (request.Year == currentDate.Year && request.Month == currentDate.Month && request.Week == currentWeek)
                {



                    var fechaPagoMasActual = sas.Where(s => s.FechaDePago.HasValue)
                             .Max(s => s.FechaDePago);


                    if (request.comercio.ToLower() == "todos")
                    {


                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                       
                        
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalBrutoHoy = ObtenerTotalBruto(listaMes);
                     
                        var sumasPorDia = ObtenerSumaPorDia(listaMes, usuarioEncontrado.usuario.Id);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            listaMes = sumasPorDia.Result,
                            TotalBrutoHoy = totalBrutoHoy,
                            contracargo = 0,
                            retenciones = 0,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                   
                        sas = sas.Where(s => s.NombreComercio != null &&
                          s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();

                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                     
                     
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalBrutoHoy = ObtenerTotalBruto(listaMes);
                      
                        var sumasPorDia = ObtenerSumaPorDia(listaMes, usuarioEncontrado.usuario.Id);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            listaMes = sumasPorDia.Result,
                            TotalBrutoHoy = totalBrutoHoy,
                            contracargo = 0,
                            retenciones = 0,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }
                else
                {
                    if (request.comercio.ToLower() == "todos")
                    {
                        DateTime fechaInicial = new DateTime(request.Year, request.Month, 1);
                        DateTime fechaInicialsemana;
                        DateTime fechaFinalDeLaSemana;

                        if (request.Week == 8)
                        {
                           
                            fechaInicialsemana = fechaInicial;
                            fechaFinalDeLaSemana = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));
                        }
                        else
                        {
                            
                            fechaInicialsemana = GetFirstDayOfWeekInMonth(request.Year, request.Month, request.Week);
                            fechaFinalDeLaSemana = GetLastDayOfWeek(fechaInicialsemana);
                        }


                        var listaFiltrada = sas.Where(s =>
                         s.FechaDePago.HasValue &&
                             s.FechaDePago.Value.Date >= fechaInicial.Date &&
                             s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                              .ToList();

                        var listaHoy = ObtenerListaPorFecha(listaFiltrada, fechaFinalDeLaSemana);
                        var listaMes = ObtenerListaPorRangoFecha(listaFiltrada, fechaInicial, fechaFinalDeLaSemana);


                        var totalBrutoHoy = ObtenerTotalBruto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);


                        
                        var sumasPorDia = ObtenerSumaPorDia(listaMes, usuarioEncontrado.usuario.Id);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            listaMes = sumasPorDia.Result,
                            TotalBrutoHoy = totalBrutoHoy,
                            contracargo = 0,
                            retenciones = 0,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                          s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();
                        DateTime fechaInicial = new DateTime(request.Year, request.Month, 1);
                        DateTime fechaInicialsemana;
                        DateTime fechaFinalDeLaSemana;

                        if (request.Week == 8)
                        {
                          
                            fechaInicialsemana = fechaInicial;
                            fechaFinalDeLaSemana = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));
                        }
                        else
                        {
                           
                            fechaInicialsemana = GetFirstDayOfWeekInMonth(request.Year, request.Month, request.Week);
                            fechaFinalDeLaSemana = GetLastDayOfWeek(fechaInicialsemana);
                        }


                        var listaFiltrada = sas.Where(s =>
                         s.FechaDePago.HasValue &&
                             s.FechaDePago.Value.Date >= fechaInicial.Date &&
                             s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                              .ToList();

                        var listaHoy = ObtenerListaPorFecha(listaFiltrada, fechaFinalDeLaSemana);
                        var listaMes = ObtenerListaPorRangoFecha(listaFiltrada, fechaInicial, fechaFinalDeLaSemana);


                        var totalBrutoHoy = ObtenerTotalBruto(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);


                    
                        var sumasPorDia = ObtenerSumaPorDia(listaMes, usuarioEncontrado.usuario.Id);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            listaMes = sumasPorDia.Result,
                            TotalBrutoHoy = totalBrutoHoy,
                            contracargo = 0,
                            retenciones = 0,

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }





            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        private List<BaseDashboard> ObtenerListaPorFecha(List<BaseDashboard> sas, DateTime fecha)
        {
            return sas.Where(s => s.FechaDePago == fecha.Date).ToList();
        }
        private double ObtenerTotalBruto(List<BaseDashboard> lista)
        {
            return (double)(lista.Sum(s => s.TotalConDescuentos) ?? 0);
        }
        private double ObtenerTotalOperaciones(List<BaseDashboard> sas)
        {
            return (double)sas.Count();
        }
        private List<BaseDashboard> ObtenerListaPorRangoFecha(List<BaseDashboard> sas, DateTime fechaInicio, DateTime fechaFin)
        {
            return sas.Where(s => s.FechaDePago >= fechaInicio.Date && s.FechaDePago <= fechaFin.Date).ToList();
        }


        public async Task<List<object>> ObtenerSumaPorDia(List<BaseDashboard> lista, int usuarioId)
        {
            if (lista == null)
            {
                return new List<object>();
            }

            var resultados = new List<object>();

            var sumasPorDia = lista
                .GroupBy(item => item.FechaDePago?.Date)
                .Select(group => new
                {
                    Fecha = group.Key,
                    Totales = new
                    {
                        TotalBruto = group.Sum(item => item.TotalBruto ?? 0),
                        CostoFinancieroEn = group.Sum(item => item.CostoFinancieroEn ?? 0),
                        Arancel = group.Sum(item => item.Arancel ?? 0),
                        Iva21 = group.Sum(item => item.Iva21 ?? 0),
                        ImpuestoDebitoCredito = group.Sum(item => item.ImpuestoDebitoCredito ?? 0),
                        RetencionProvincial = group.Sum(item => item.RetencionProvincial ?? 0),
                        RetencionGanacia = group.Sum(item => item.RetencionGanacia ?? 0),
                        RetencionIva = group.Sum(item => item.RetencionIva ?? 0),
                        TotalConDescuentos = group.Sum(item => item.TotalConDescuentos ?? 0)
                    }
                })
                .OrderByDescending(x => x.Fecha)
                .ToList(); 

            foreach (var item in sumasPorDia)
            {
                DateTime? fechaNullable = item.Fecha; 
                bool tieneDocumentos = fechaNullable.HasValue ? await _pfService.ExisteDocumentoEnFecha(usuarioId, fechaNullable) : false;

                resultados.Add(new
                {
                    Fecha = item.Fecha,
                    TotalBruto = item.Totales.TotalBruto,
                    CostoFinancieroEn = item.Totales.CostoFinancieroEn,
                    Arancel = item.Totales.Arancel,
                    Iva21 = item.Totales.Iva21,
                    ImpuestoDebitoCredito = item.Totales.ImpuestoDebitoCredito,
                    RetencionProvincial = item.Totales.RetencionProvincial,
                    RetencionGanacia = item.Totales.RetencionGanacia,
                    RetencionIva = item.Totales.RetencionIva,
                    TotalConDescuentos = item.Totales.TotalConDescuentos,
                    TieneDocumentos = tieneDocumentos
                });
            }

            return resultados;
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

    }
}
