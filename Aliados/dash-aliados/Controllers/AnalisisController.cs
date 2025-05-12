using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Diagnostics.Eventing.Reader;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalisisController : ControllerBase
    {

        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
      
        private readonly IMapper _mapper;
        private readonly IInflacionService _inflacionService;
        private readonly ITokenService _tokenservice;
        public AnalisisController(IBaseDashboardService sasService, ITokenService tok, IMapper mapper, IUsuarioZocoService usuarioZoco,IInflacionService inflacionService)
        {
            _baseService = sasService;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _inflacionService = inflacionService;
            _tokenservice = tok;
        }
        [HttpPost("analisis")]
        public async Task<ActionResult> Analisis([FromBody] VMDatosInicio request)
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
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalConDescuentoCuotas0 = ObtenerTotalConDescuentoCuotas(listaMes, 0);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaMes, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaMes, 2);
                        var cuotas = ObtenerCuotasYTotales(listaMes);
                        var datosImportantes = cuotas
         .Select(cuota => new
         {
             Cuota = cuota.Cuota,
             TotalBruto = cuota.TotalBruto
         
         })
         .ToList();
                        var totalCuotas = totalConDescuentoCuotas1 + totalConDescuentoCuotas2;
                        var tarea = ObtenerResumenUltimos7Meses(sas);
                        var resumenUltimos7Meses = tarea.Result;
                        var creditofacturacion = ObtenerTotalNeto(listaMes);
                        var debitofacturacion = ObtenerTotalBruto(listaMes);
                        var debito = ObtenerTicketPromedio(listaMes, 0);
                        var credito = ObtenerTicketPromedio(listaMes, 1);
                        var porcentajeporcuotas = ObtenerPorcentaje(totalConDescuentoCuotas0, totalCuotas);
                        var porcentajeticket = ObtenerPorcentaje(debito, credito);
                        var porcentajetipopago = ObtenerPorcentaje(totalConDescuentoCuotas0, totalConDescuentoCuotas1);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas0 = totalConDescuentoCuotas0,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,
                            TotalCuotas = totalCuotas,
                            ResumenUltimos7Meses = resumenUltimos7Meses,
                            Porcentajeporcuotas = porcentajeporcuotas,
                            Porcentajeticket = porcentajeticket,
                            Porcentajetipopago = porcentajetipopago,
                            Debito = debito,
                            Credito = credito,
                            CreditoFacturacion = creditofacturacion,
                            DebitoFacturacion = debitofacturacion,
                            Cuotas = datosImportantes

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                          s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();
                        var listaMes = ObtenerListaPorRangoFecha(sas, new DateTime(request.Year, request.Month, 1), fechaPagoMasActual.Value);
                        var totalOperaciones = ObtenerTotalOperaciones(listaMes);
                        var totalConDescuentoCuotas0 = ObtenerTotalConDescuentoCuotas(listaMes, 0);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaMes, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaMes, 2);
                        var totalCuotas = totalConDescuentoCuotas1 + totalConDescuentoCuotas2;
                        var tarea = ObtenerResumenUltimos7Meses(sas);
                        var cuotas = ObtenerCuotasYTotales(listaMes);
                        var datosImportantes = cuotas
      .Select(cuota => new
      {
          Cuota = cuota.Cuota,
          TotalBruto = cuota.TotalBruto
        
      })
      .ToList();
                        var resumenUltimos7Meses = tarea.Result;
                        var creditofacturacion = ObtenerTotalNeto(listaMes);
                        var debitofacturacion = ObtenerTotalBruto(listaMes);
                        var debito = ObtenerTicketPromedio(listaMes, 0);
                        var credito = ObtenerTicketPromedio(listaMes, 1);
                        var porcentajeporcuotas = ObtenerPorcentaje(totalConDescuentoCuotas0, totalCuotas);
                        var porcentajeticket = ObtenerPorcentaje(debito, credito);
                        var porcentajetipopago = ObtenerPorcentaje(totalConDescuentoCuotas0, totalConDescuentoCuotas1);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas0 = totalConDescuentoCuotas0,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,
                            TotalCuotas = totalCuotas,
                            ResumenUltimos7Meses = resumenUltimos7Meses,
                            Porcentajeporcuotas = porcentajeporcuotas,
                            Porcentajeticket = porcentajeticket,
                            Porcentajetipopago = porcentajetipopago,
                            Debito = debito,
                            Credito = credito,
                            CreditoFacturacion = creditofacturacion,
                            DebitoFacturacion = debitofacturacion,
                            Cuotas = datosImportantes

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

                       
                        DateTime fechaInicioRango = fechaFinalDeLaSemana.AddMonths(-7);

                     
                        var listaFiltradaUltimos7Meses = sas.Where(s =>
                            s.FechaDePago.HasValue &&
                            s.FechaDePago.Value >= fechaInicioRango &&
                            s.FechaDePago.Value <= fechaFinalDeLaSemana)
                            .ToList();

                        var listaFiltrada = sas.Where(s =>
                          s.FechaDePago.HasValue &&
                              s.FechaDePago.Value.Date >= fechaInicial.Date &&
                              s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                               .ToList();
                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);
                        var totalConDescuentoCuotas0 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 0);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 2);
                        var totalCuotas = totalConDescuentoCuotas1 + totalConDescuentoCuotas2;

                        var tarea = ObtenerResumenUltimos7Meses(listaFiltradaUltimos7Meses);
                        var resumenUltimos7Meses = tarea.Result;
                        var creditofacturacion = ObtenerTotalNeto(listaFiltrada);
                        var debitofacturacion = ObtenerTotalBruto(listaFiltrada);
                        var cuotas = ObtenerCuotasYTotales(listaFiltrada);
                        var datosImportantes = cuotas
.Select(cuota => new
{
Cuota = cuota.Cuota,
TotalBruto = cuota.TotalBruto
    
})
.ToList();
                        var debito = ObtenerTicketPromedio(listaFiltrada, 0);
                        var credito = ObtenerTicketPromedio(listaFiltrada, 1);
                        var porcentajeporcuotas = ObtenerPorcentaje(totalConDescuentoCuotas0, totalCuotas);
                        var porcentajeticket = ObtenerPorcentaje(debito, credito);
                        var porcentajetipopago = ObtenerPorcentaje(totalConDescuentoCuotas0, totalConDescuentoCuotas1);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas0 = totalConDescuentoCuotas0,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,
                            TotalCuotas = totalCuotas,
                            ResumenUltimos7Meses = resumenUltimos7Meses,
                            Porcentajeporcuotas = porcentajeporcuotas,
                            Porcentajeticket = porcentajeticket,
                            Porcentajetipopago = porcentajetipopago,
                            Debito = debito,
                            Credito = credito,
                            CreditoFacturacion = creditofacturacion,
                            DebitoFacturacion = debitofacturacion,
                            Cuotas = datosImportantes
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
                        DateTime fechaInicioRango = fechaFinalDeLaSemana.AddMonths(-7);

                     
                        var listaFiltradaUltimos7Meses = sas.Where(s =>
                            s.FechaDePago.HasValue &&
                            s.FechaDePago.Value >= fechaInicioRango &&
                            s.FechaDePago.Value <= fechaFinalDeLaSemana)
                            .ToList();

                        var listaFiltrada = sas.Where(s =>
                         s.FechaDePago.HasValue &&
                             s.FechaDePago.Value.Date >= fechaInicial.Date &&
                             s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                              .ToList();

                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);
                        var totalConDescuentoCuotas0 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 0);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 2);
                        var totalCuotas = totalConDescuentoCuotas1 + totalConDescuentoCuotas2;
                        var tarea = ObtenerResumenUltimos7Meses(listaFiltradaUltimos7Meses);
                        var resumenUltimos7Meses = tarea.Result;
                        var creditofacturacion = ObtenerTotalNeto(listaFiltrada);
                        var debitofacturacion = ObtenerTotalBruto(listaFiltrada);
                        var debito = ObtenerTicketPromedio(listaFiltrada, 0);
                        var credito = ObtenerTicketPromedio(listaFiltrada, 1);
                        var cuotas = ObtenerCuotasYTotales(listaFiltrada);
                        var datosImportantes = cuotas
.Select(cuota => new
{
Cuota = cuota.Cuota,
TotalBruto = cuota.TotalBruto
   
})
.ToList();
                        var porcentajeporcuotas = ObtenerPorcentaje(totalConDescuentoCuotas0, totalCuotas);
                        var porcentajeticket = ObtenerPorcentaje(debito, credito);
                        var porcentajetipopago = ObtenerPorcentaje(totalConDescuentoCuotas0, totalConDescuentoCuotas1);
                        var resultado = new
                        {
                            AñoActual = request.Year,
                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas0 = totalConDescuentoCuotas0,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,
                            TotalCuotas = totalCuotas,
                            ResumenUltimos7Meses = resumenUltimos7Meses,
                            Porcentajeporcuotas = porcentajeporcuotas,
                            Porcentajeticket = porcentajeticket,
                            Porcentajetipopago = porcentajetipopago,
                            Debito = debito,
                            Credito = credito,
                            CreditoFacturacion = creditofacturacion,
                            DebitoFacturacion = debitofacturacion,
                            Cuotas = datosImportantes

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        private List<(double Cuota, decimal TotalBruto)> ObtenerCuotasYTotales(List<BaseDashboard> listaMes)
        {
            var cuotasYTotales = listaMes
                .Where(s => s.Cuotas.HasValue && s.TotalBruto.HasValue) 
                .GroupBy(s => s.Cuotas.Value) 
                .Select(g => new
                {
                    Cuota = g.Key,
                    TotalBruto = g.Sum(x => x.TotalBruto.Value) 
                })
                .OrderByDescending(d => d.Cuota) 
                .Select(d => (d.Cuota, d.TotalBruto)) 
                .ToList();

            return cuotasYTotales;
        }




        private DateTime GetFirstDayOfWeekInMonth(int year, int month, int weekNumber)
        {
       
            if (weekNumber == 0)
            {
                return new DateTime(year, month, 1);
            }

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
        private double ObtenerTotalOperaciones(List<BaseDashboard> sas)
        {
            return (double)sas.Count();
        }
        private double ObtenerTotalConDescuentoCuotas(List<BaseDashboard> sas, int cuotas)
        {
            if (cuotas == 2)
            {
                return (double)sas.Where(s => s.Cuotas >= cuotas)
                                  .Sum(s => s.TotalConDescuentos ?? 0);
            }
            else
            {
                return (double)sas.Where(s => s.Cuotas == cuotas)
                                  .Sum(s => s.TotalConDescuentos ?? 0);
            }
        }
        public async Task<List<object>> ObtenerResumenUltimos7Meses(List<BaseDashboard> sas)
        {
            if (sas == null || !sas.Any())
            {
                return new List<object>();
            }
            DateTime fechaMasReciente = sas.Max(s => s.FechaDePago) ?? DateTime.Today;
            DateTime primerDiaMesActual = new DateTime(fechaMasReciente.Year, fechaMasReciente.Month, 1);

            var resumenUltimos7Meses = new List<object>();
            string primerCuit = sas.FirstOrDefault()?.Cuit?.ToString();

            var inflacion = await _inflacionService.ObtenerPorRubro(primerCuit);

            for (int i = 0; i < 7; i++)
            {
                DateTime fechaMes = primerDiaMesActual.AddMonths(-i);
               
                if (fechaMes.Year != fechaMasReciente.Year)
                {
                    continue; 
                }

                DateTime primerDiaMes = new DateTime(fechaMes.Year, fechaMes.Month, 1);
                DateTime ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                var datosMes = sas.Where(s => s.FechaDePago >= primerDiaMes && s.FechaDePago <= ultimoDiaMes).ToList();

                if (datosMes.Any())
                {
                    decimal? totalBruto = datosMes.Sum(s => s.TotalBruto);
                    int cantidadDatos = datosMes.Count;

                   
                    var inflacionMes = inflacion.FirstOrDefault(inf => inf.Fecha?.Month == fechaMes.Month && inf.Fecha?.Year == fechaMes.Year)?.Inflacion1 ?? 0;

                    double? totalBrutoMenosInflacion = inflacionMes != 0
                        ? Convert.ToDouble(totalBruto) - (Convert.ToDouble(totalBruto) * inflacionMes / 100)
                        : 0;

                    var resumenMes = new
                    {
                        Mes = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(fechaMes.Month).ToUpper(),
                        TotalBruto = totalBruto,
                        CantidadDatos = cantidadDatos,
                        Inflacion = inflacionMes,
                        TotalBrutoMenosInflacion = totalBrutoMenosInflacion
                    };

                    resumenUltimos7Meses.Add(resumenMes);
                }
            }

            return resumenUltimos7Meses;
        }






        private List<BaseDashboard> ObtenerListaPorRangoFecha(List<BaseDashboard> sas, DateTime fechaInicio, DateTime fechaFin)
        {
            return sas.Where(s => s.FechaDePago >= fechaInicio.Date && s.FechaDePago <= fechaFin.Date).ToList();
        }




        private double ObtenerPorcentaje(double comparativaHoy, double comparativaDiaAnterior)
        {
            if (comparativaHoy == 0) return 0;

            var compa = comparativaHoy - comparativaDiaAnterior;
            var resultado = compa / comparativaHoy;
            return resultado;
        }
        private double ObtenerTicketPromedio(List<BaseDashboard> sas, int cuotas)
        {
           
            DateTime fechaMasReciente = sas.Where(s => s.FechaDePago.HasValue).Max(s => s.FechaDePago) ?? DateTime.Today;

            if (cuotas == 0)
            {
                var totaltipo = (double)sas.Where(s => s.Cuotas == cuotas && s.FechaDePago.HasValue && s.FechaDePago.Value.Month == fechaMasReciente.Month && s.FechaDePago.Value.Year == fechaMasReciente.Year)
                                           .Sum(s => s.TotalBruto ?? 0);

                var totaloperaciones = (double)sas.Count(s => s.Cuotas == cuotas && s.FechaDePago.HasValue && s.FechaDePago.Value.Month == fechaMasReciente.Month && s.FechaDePago.Value.Year == fechaMasReciente.Year);

                var ticket = totaltipo / totaloperaciones;
                return totaloperaciones > 0 ? totaltipo / totaloperaciones : 0;

            }
            else
            {
                var totaltipo = (double)sas.Where(s => s.Cuotas >= cuotas && s.FechaDePago.HasValue && s.FechaDePago.Value.Month == fechaMasReciente.Month && s.FechaDePago.Value.Year == fechaMasReciente.Year)
                                           .Sum(s => s.TotalBruto ?? 0);

                var totaloperaciones = (double)sas.Count(s => s.Cuotas >= cuotas && s.FechaDePago.HasValue && s.FechaDePago.Value.Month == fechaMasReciente.Month && s.FechaDePago.Value.Year == fechaMasReciente.Year);

                var ticket = totaltipo / totaloperaciones;
                return totaloperaciones > 0 ? totaltipo / totaloperaciones : 0;

            }

        }
        private double ObtenerTotalNeto(List<BaseDashboard> lista)
        {
            return (double)lista.Where(s => s.Cuotas >= 1).Sum(s => s.TotalBruto);
        }


        private double ObtenerTotalBruto(List<BaseDashboard> lista)
        {
            return (double)lista.Where(s => s.Cuotas == 0).Sum(s => s.TotalBruto);
        }



    }
}
