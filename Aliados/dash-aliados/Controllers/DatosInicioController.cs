using Microsoft.AspNetCore.Mvc;
using AutoMapper;

using System.Globalization;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using dash_aliados.Models;
using System;
using Entity.Zoco;
using System.Diagnostics.Eventing.Reader;
using DocumentFormat.OpenXml.ExtendedProperties;
using Irony.Parsing;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatosInicioController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
      
        private readonly IMapper _mapper;

        public DatosInicioController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
        }

        [HttpPost("lista")]
        public async Task<ActionResult<List<VMBaseDashboard>>> Lista([FromBody] VMBase request)
        {
            DateTime? fecha = null;
            if (!string.IsNullOrEmpty(request.Fecha))
            {

                bool parseOk = DateTime.TryParseExact(request.Fecha, "MM/yy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime parsedDate);
                if (parseOk)
                {
                    fecha = parsedDate;
                }
                else
                {
                    return BadRequest("Formato de fecha inválido. Utiliza 'MM/yy'.");
                }
            }


             var sasLista = await _baseService.Lista(fecha);
           // var sasLista = await _baseService.Listahoy(fecha);
            if (sasLista == null || sasLista.Count == 0)
            {
                return NotFound("No hay datos para la lista de Sas.");
            }

            var sasListaVM = sasLista.Select(s => _mapper.Map<VMBaseDashboard>(s)).ToList();
            sasListaVM.ForEach(vm =>
            {
                if (!string.IsNullOrEmpty(vm.FechaDePago))
                {
                    vm.FechaDePago = vm.FechaDePago.Split(' ')[0]; 
                }
                if (!string.IsNullOrEmpty(vm.FechaOperacion))
                {
                    vm.FechaOperacion = vm.FechaOperacion.Split(' ')[0]; 
                }
            });

            return Ok(sasListaVM);
        }


        [HttpPost("base")]
        public async Task<ActionResult> Inicio([FromBody] VMDatosInicio request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido==true)
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
                if (fechaActual.Day > ultimoDiaMesPasadoComparable.Day)
                {
                    fechaComparableMesPasado = ultimoDiaMesPasadoComparable; 
                }

               
                var listaMesActual = sas.Where(x => x.FechaDePago >= primerDiaMesActual && x.FechaDePago <= fechaActual)
                                        .OrderBy(x => x.FechaDePago)
                                        .ToList();

               
                var listaMesPasado = sas.Where(x => x.FechaDePago >= primerDiaMesPasado && x.FechaDePago <= fechaComparableMesPasado)
                                        .OrderBy(x => x.FechaDePago)
                                        .ToList();


                if (request.Year == currentDate.Year && request.Month == currentDate.Month && request.Week == currentWeek)
                {


                    if (request.comercio.ToLower() == "todos")
                    {
                        var fantasiasnombre = ObtenerFantasiasNombre(sas);
                        var mesesHastaHoy = ObtenerMesesHastaHoy(request.Year, request.Month, request.Day);
                        var semanasPorMes = ObtenerSemanasPorMes(mesesHastaHoy, request.Year);

                        var listaMismoDiaMesAnterior = ObtenerListaMismoDiaMesAnterior(sas);
                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                       
                        DateTime fechaFin = DateTime.Today.AddDays(1);

                        if (fechaFin.DayOfWeek == DayOfWeek.Saturday)
                        {
                            fechaFin = fechaFin.AddDays(2); 
                        }
                        else if (fechaFin.DayOfWeek == DayOfWeek.Sunday)
                        {
                            fechaFin = fechaFin.AddDays(1); 
                        }

                      
                        var fechaInicio = new DateTime(request.Year, request.Month, 1);
                        var fechaFinMes = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));

                        var listaMes = ObtenerListaPorRangoFecha(sas, fechaInicio, fechaFinMes);
                        var listaMañana = ObtenerListaPorFechaMañana(sas, fechaFin);
                        var movimientosUltimos7Dias = ObtenerMovimientosUltimos7Dias(listaMes);
                        var fechasUnicas = ObtenerFechasUnicas(movimientosUltimos7Dias);
                        var ComparativaMes = ObtenerMes(listaHoy);

                        var totalesPorDiaPorTarjeta = ObtenerTotalesPorDiaPorTarjeta(sas, fechasUnicas);
                        var descuentosPorTarjeta = ObtenerDescuentosPorTarjeta(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(sas);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(sas, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(sas, 2);


                        var totalNetoHoy = ObtenerTotalNeto(listaHoy);
                        var totalBrutoHoy = ObtenerTotalBruto(listaHoy);
                        var totalNetoMañana = ObtenerTotalNeto(listaMañana);
                        var totalBrutoMañana = ObtenerTotalBruto(listaMañana);
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalBrutoMes = ObtenerTotalBruto(listaMes);

                        var comparativahot = ObtenerComparativa(sas, listaMesActual);
                        var comparativaHotmesanterior = ObtenerComparativa(sas, listaMesPasado);
                        var porcentaje = ObtenerPorcentaje(comparativahot, comparativaHotmesanterior);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            MesesHastaHoy = mesesHastaHoy,
                            SemanasPorMes = semanasPorMes,
                            TotalNetoHoy = totalNetoHoy,
                            TotalBrutoHoy = totalBrutoHoy,
                            TotalNetoMañana = totalNetoMañana,
                            TotalBrutoMañana = totalBrutoMañana,
                            TotalNetoMes = totalNetoMes,
                            TotalBrutoMes = totalBrutoMes,
                            Comparativahoy = comparativahot,
                            ComparativaHoymesanterior = comparativaHotmesanterior,
                            Porcentaje = porcentaje,
                            DescuentosPorTarjeta = descuentosPorTarjeta,
                            TotalesPorDiaTarjeta = totalesPorDiaPorTarjeta,
                            Fantasiasnombre = fantasiasnombre,

                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,
                            

                            comparativadiasemana = "dia",
                            ComparativaMes = ComparativaMes,
                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                         s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();

                        var fantasiasnombre = ObtenerFantasiasNombre(sas);
                        var mesesHastaHoy = ObtenerMesesHastaHoy(request.Year, request.Month, request.Day);
                        var semanasPorMes = ObtenerSemanasPorMes(mesesHastaHoy, request.Year);

                        var listaMismoDiaMesAnterior = ObtenerListaMismoDiaMesAnterior(sas);
                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                        
                       
                        DateTime fechaFin = DateTime.Today.AddDays(1);

                      
                        if (fechaFin.DayOfWeek == DayOfWeek.Saturday)
                        {
                            fechaFin = fechaFin.AddDays(2); 
                        }
                        else if (fechaFin.DayOfWeek == DayOfWeek.Sunday)
                        {
                            fechaFin = fechaFin.AddDays(1); 
                        }

                       
                        var fechaInicio = new DateTime(request.Year, request.Month, 1);
                        var fechaFinMes = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month));

                        var listaMes = ObtenerListaPorRangoFecha(sas, fechaInicio, fechaFinMes);
                        var listaMañana = ObtenerListaPorFechaMañana(sas, fechaFin);
                        var movimientosUltimos7Dias = ObtenerMovimientosUltimos7Dias(sas);
                        var fechasUnicas = ObtenerFechasUnicas(movimientosUltimos7Dias);
                        var ComparativaMes = ObtenerMes(listaHoy);
                        var totalesPorDiaPorTarjeta = ObtenerTotalesPorDiaPorTarjeta(sas, fechasUnicas);
                        var descuentosPorTarjeta = ObtenerDescuentosPorTarjeta(listaMes);
                        var totalOperaciones = ObtenerTotalOperaciones(sas);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(sas, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(sas, 2);
                        var totalNetoHoy = ObtenerTotalNeto(listaHoy);
                        var totalBrutoHoy = ObtenerTotalBruto(listaHoy);
                        var totalNetoMañana = ObtenerTotalNeto(listaMañana);
                        var totalBrutoMañana = ObtenerTotalBruto(listaMañana);
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalBrutoMes = ObtenerTotalBruto(listaMes);
                        var comparativahot = ObtenerComparativa(sas, listaMesActual);
                        var comparativaHotmesanterior = ObtenerComparativa(sas, listaMesPasado);
                        var porcentaje = ObtenerPorcentaje(comparativahot, comparativaHotmesanterior);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            MesesHastaHoy = mesesHastaHoy,
                            SemanasPorMes = semanasPorMes,
                            TotalNetoHoy = totalNetoHoy,
                            TotalBrutoHoy = totalBrutoHoy,
                            TotalNetoMañana = totalNetoMañana,
                            TotalBrutoMañana = totalBrutoMañana,
                            TotalNetoMes = totalNetoMes,
                            TotalBrutoMes = totalBrutoMes,
                            Comparativahoy = comparativahot,
                            ComparativaHoymesanterior = comparativaHotmesanterior,
                            Porcentaje = porcentaje,
                            DescuentosPorTarjeta = descuentosPorTarjeta,
                            TotalesPorDiaTarjeta = totalesPorDiaPorTarjeta,
                            Fantasiasnombre = fantasiasnombre,

                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,



                            ComparativaMes = ComparativaMes,
                            comparativadiasemana = "dia",
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

                        
                        int semanaActualDelSistema = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(DateTime.Today, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
                        bool esLaMismaSemana = request.Week == semanaActualDelSistema && request.Year == DateTime.Today.Year;

                        DateTime fechaFin;

                        DateTime fechaInicioMes = new DateTime(request.Year, request.Month, 1); 
                        int diasParaPrimerDiaSemana = (request.Week - 1) * 7; 
                        DateTime primerDiaSemana = fechaInicioMes.AddDays(diasParaPrimerDiaSemana); 

                        DayOfWeek diaSemana = primerDiaSemana.DayOfWeek;

                       
                        int diasParaDomingo = (int)DayOfWeek.Sunday - (int)diaSemana;
                        if (diasParaDomingo < 0) 
                        {
                            diasParaDomingo += 7;
                        }

                        DateTime domingoDeLaSemana = primerDiaSemana.AddDays(diasParaDomingo);

                       
                        bool esMesActual = request.Year == DateTime.Now.Year && request.Month == DateTime.Now.Month;

                        DateTime ultimoDiaMes = new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month)); 

                        if (request.Week == 8) 
                        {
                            fechaFin = ultimoDiaMes;
                        }
                        else if (esMesActual && DateTime.Today < domingoDeLaSemana) 
                        {
                            fechaFin = DateTime.Today;
                        }
                        else 
                        {
                            fechaFin = domingoDeLaSemana > ultimoDiaMes ? ultimoDiaMes : domingoDeLaSemana;
                        }


                   
                        var listaFiltrada = sas.Where(s =>
                            s.FechaDePago.HasValue &&
                            s.FechaDePago.Value.Date >= fechaInicial.Date &&
                            s.FechaDePago.Value.Date <= fechaFin.Date)
                            .ToList();
                        var listaoperacion = sas.Where(s =>
                          s.FechaOperacion.HasValue &&
                          s.FechaOperacion.Value.Date >= fechaInicial.Date &&
                          s.FechaOperacion.Value.Date <= fechaFin.Date)
                          .ToList();
                        var fantasiasnombre = ObtenerFantasiasNombre(sas);
                        var mesesHastaHoy = ObtenerMesesHastaHoy(fechaFinalDeLaSemana.Year, fechaFinalDeLaSemana.Month, fechaFinalDeLaSemana.Day);
                        var semanasPorMes = ObtenerSemanasPorMes(mesesHastaHoy, fechaFinalDeLaSemana.Year);

                        var listaMismoSemanaMesAnterior = ObtenerListaMismoSemanaMesAnterior(sas, fechaFinalDeLaSemana.Year,fechaFinalDeLaSemana.Month,request.Week);

                        var listaMismoDiaMesAnterior = ObtenerListaMismoDiaMesAnterior(sas);
                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);

                        var listaMes = ObtenerListaPorRangoFecha(sas, fechaInicial, fechaFin);

                        var movimientosUltimos7Dias = ObtenerMovimientosUltimos7Dias(listaoperacion);
                        var fechasUnicas = ObtenerFechasUnicas(movimientosUltimos7Dias);

                        var totalesPorDiaPorTarjeta = ObtenerTotalesPorDiaPorTarjeta(movimientosUltimos7Dias, fechasUnicas);
                        var descuentosPorTarjeta = ObtenerDescuentosPorTarjeta(listaFiltrada);
                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 2);
                       
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalBrutoMes = ObtenerTotalBruto(listaMes);
                        var ComparativaMes = ObtenerMes(listaHoy);
                       

                        var comparativahot = ObtenerComparativa(sas, listaMesActual);
                        var comparativaHotmesanterior = ObtenerComparativa(sas, listaMesPasado);
                        var porcentaje = ObtenerPorcentaje(comparativahot, comparativaHotmesanterior);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            MesesHastaHoy = mesesHastaHoy,
                            SemanasPorMes = semanasPorMes,
                            TotalNetoHoy = 0,
                            TotalBrutoHoy = 0,
                            TotalNetoMañana = 0,
                            TotalBrutoMañana = 0,
                            TotalNetoMes = totalNetoMes,
                            TotalBrutoMes = totalBrutoMes,
                            Comparativahoy = comparativahot,
                            ComparativaHoymesanterior = comparativaHotmesanterior,
                            Porcentaje = porcentaje,
                            DescuentosPorTarjeta = descuentosPorTarjeta,
                            TotalesPorDiaTarjeta = totalesPorDiaPorTarjeta,
                            Fantasiasnombre = fantasiasnombre,

                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,




                            ComparativaMes = ComparativaMes,

                            comparativadiasemana = "dia",

                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                    else
                    {
                        sas = sas.Where(s => s.NombreComercio != null &&
                                             s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList(); DateTime fechaInicial = GetFirstDayOfWeekInMonth(request.Year, request.Month, request.Week);
                        DateTime fechaFinalDeLaSemana = GetLastDayOfWeek(fechaInicial);

                        var listaFiltrada = sas.Where(s =>
                                             s.FechaDePago.HasValue &&
                                                 s.FechaDePago.Value.Date >= fechaInicial.Date &&
                                                 s.FechaDePago.Value.Date <= fechaFinalDeLaSemana.Date)
                                              .ToList();

                        var mesesHastaHoy = ObtenerMesesHastaHoy(fechaFinalDeLaSemana.Year, fechaFinalDeLaSemana.Month, fechaFinalDeLaSemana.Day);
                        var semanasPorMes = ObtenerSemanasPorMes(mesesHastaHoy, fechaFinalDeLaSemana.Year);

                        var listaMismoSemanaMesAnterior = ObtenerListaMismoSemanaMesAnterior(sas, fechaFinalDeLaSemana.Year, fechaFinalDeLaSemana.Month, request.Week);
                        var listaMismoDiaMesAnterior = ObtenerListaMismoDiaMesAnterior(sas);
                        var listaHoy = ObtenerListaPorFecha(sas, DateTime.Today);
                        DateTime fechaInicio = new DateTime(request.Year, request.Month, 1);
                        DateTime fechaFin;

                        bool esMesActual = request.Year == DateTime.Now.Year && request.Month == DateTime.Now.Month;

        
                        fechaFin = request.Week == 8 ? new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month))
                                    : (esMesActual ? DateTime.Today
                                    : new DateTime(request.Year, request.Month, DateTime.DaysInMonth(request.Year, request.Month)));


                        var listaMes = ObtenerListaPorRangoFecha(sas, fechaInicio, fechaFin);

                        var movimientosUltimos7Dias = ObtenerMovimientosUltimos7Dias(listaFiltrada);
                        var fechasUnicas = ObtenerFechasUnicas(movimientosUltimos7Dias);

                        var totalesPorDiaPorTarjeta = ObtenerTotalesPorDiaPorTarjeta(listaFiltrada, fechasUnicas);
                        var descuentosPorTarjeta = ObtenerDescuentosPorTarjeta(listaFiltrada);
                        var totalOperaciones = ObtenerTotalOperaciones(listaFiltrada);
                        var totalConDescuentoCuotas1 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 1);
                        var totalConDescuentoCuotas2 = ObtenerTotalConDescuentoCuotas(listaFiltrada, 2);
                     
                        var totalNetoMes = ObtenerTotalNeto(listaMes);
                        var totalBrutoMes = ObtenerTotalBruto(listaMes);
                        var ComparativaMes = ObtenerMes(listaHoy);
                        var comparativahot  = ObtenerComparativa(sas, listaMesActual);
                        var comparativaHotmesanterior = ObtenerComparativa(sas, listaMesPasado);
                        var porcentaje = ObtenerPorcentaje(comparativahot, comparativaHotmesanterior);

                        var resultado = new
                        {
                            AñoActual = request.Year,
                            MesesHastaHoy = mesesHastaHoy,
                            SemanasPorMes = semanasPorMes,
                            TotalNetoHoy = 0,
                            TotalBrutoHoy = 0,
                            TotalNetoMañana = 0,
                            TotalBrutoMañana = 0,
                            TotalNetoMes = totalNetoMes,
                            TotalBrutoMes = totalBrutoMes,
                            Comparativahoy = comparativahot,
                            ComparativaHoymesanterior = comparativaHotmesanterior,
                            Porcentaje = porcentaje,
                            DescuentosPorTarjeta = descuentosPorTarjeta,
                            TotalesPorDiaTarjeta = totalesPorDiaPorTarjeta,
                      

                            TotalOperaciones = totalOperaciones,
                            TotalConDescuentoCuotas1 = totalConDescuentoCuotas1,
                            TotalConDescuentoCuotas2 = totalConDescuentoCuotas2,



                            ComparativaMes = ComparativaMes,


                            comparativadiasemana = "dia",
                        };

                        return StatusCode(StatusCodes.Status200OK, resultado);
                    }
                }
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        private object ObtenerMes(List<BaseDashboard> lista)
        {
            DateTime fecha;

            if (lista == null || lista.Count == 0)
            {
                fecha = DateTime.Today;
            }
            else
            {
                fecha = lista.First(d => d.FechaDePago.HasValue).FechaDePago.Value;
            }

            string mesActual = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName(fecha.Month);
            string mesAnterior = CultureInfo.CurrentCulture.DateTimeFormat.GetMonthName((fecha.Month - 1) == 0 ? 12 : fecha.Month - 1);

            return new { MesActual = mesActual, MesAnterior = mesAnterior };
        }


        private List<BaseDashboard> ObtenerListaMismoSemanaMesAnterior(List<BaseDashboard> sas, int year, int month, int week)
        {
            DateTime primerDiaMesActual = new DateTime(year, month, 1);

            DateTime primerDiaMesAnterior;
            DateTime ultimoDiaSemanaMesAnterior;

            if (month == 1) 
            {
                primerDiaMesAnterior = new DateTime(year - 1, 12, 1); 
            }
            else
            {
                primerDiaMesAnterior = primerDiaMesActual.AddMonths(-1);
            }

            DateTime primerDiaSemanaMesAnterior;

            if (week == 8)
            {
                primerDiaSemanaMesAnterior = primerDiaMesAnterior;
                ultimoDiaSemanaMesAnterior = primerDiaMesAnterior.AddMonths(1).AddDays(-1);
            }
            else
            {
                DateTime primerDiaSemanaActual = GetFirstDayOfWeekInMonth(year, month, week);
                DateTime ultimoDiaSemanaActual = GetLastDayOfWeek(primerDiaSemanaActual);

                int diasDiferencia = (primerDiaSemanaActual - primerDiaMesActual).Days;
                primerDiaSemanaMesAnterior = primerDiaMesAnterior.AddDays(diasDiferencia);
                ultimoDiaSemanaMesAnterior = GetLastDayOfWeek(primerDiaSemanaMesAnterior);
            }

            return sas.Where(s =>
                s.FechaDePago.HasValue &&
                s.FechaDePago.Value.Date >= primerDiaSemanaMesAnterior.Date &&
                s.FechaDePago.Value.Date <= ultimoDiaSemanaMesAnterior.Date)
                .ToList();
        }



        private DateTime GetFirstDayOfWeekInMonth(int year, int month, int weekNumber)
        {
            var cultureInfo = CultureInfo.CurrentCulture;
            var firstDayOfMonth = new DateTime(year, month, 1);
            var dayOfWeek = cultureInfo.Calendar.GetDayOfWeek(firstDayOfMonth);
            var firstDayOfWeek = DayOfWeek.Monday; 

            var offset = dayOfWeek - firstDayOfWeek;
            if (offset < 0)
            {
                offset += 7; 
            }

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

        private HashSet<string> ObtenerFantasiasNombre(List<BaseDashboard> sas)
        {
            HashSet<string> fantasiasnombre = new HashSet<string>();
            int index = 0;

            while (index < sas.Count)
            {
                if (!fantasiasnombre.Contains(sas[index].NombreComercio))
                {
                    fantasiasnombre.Add(sas[index].NombreComercio);
                }
                index++;
            }

            return fantasiasnombre;
        }

        private List<string> ObtenerMesesHastaHoy(int year, int month, int day)
        {
            DateTime hoy = new DateTime(year, month, day);
            int añoActual = year;

            List<string> mesesHastaHoy = new List<string>();
            for (DateTime date = new DateTime(añoActual, 1, 1); date <= hoy; date = date.AddMonths(1))
            {
                mesesHastaHoy.Add(date.ToString("MMMM"));
            }

            return mesesHastaHoy;
        }

        private Dictionary<string, List<int>> ObtenerSemanasPorMes(List<string> mesesHastaHoy, int year)
        {
            Dictionary<string, List<int>> semanasPorMes = new Dictionary<string, List<int>>();
            foreach (var mes in mesesHastaHoy)
            {
                DateTime primerDiaDelMes = new DateTime(year, DateTime.ParseExact(mes, "MMMM", CultureInfo.CurrentCulture).Month, 1);
                DateTime ultimoDiaDelMes = primerDiaDelMes.AddMonths(1).AddDays(-1);
                int numeroSemanas = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(ultimoDiaDelMes, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);

                List<int> semanasDelMes = Enumerable.Range(1, numeroSemanas)
                                                     .Where(week => primerDiaDelMes.AddDays((week - 1) * 7).Month == primerDiaDelMes.Month)
                                                     .ToList();
                semanasPorMes.Add(mes, semanasDelMes);
            }

            return semanasPorMes;
        }
        private List<BaseDashboard> ObtenerListaMismoDiaMesAnterior(List<BaseDashboard> sas)
        {
            DateTime hoy = DateTime.Today;
            DateTime primerDiaMesActual = new DateTime(hoy.Year, hoy.Month, 1);
            DateTime ultimoDiaMesAnterior = primerDiaMesActual.AddDays(-1);

            return sas.Where(s => s.FechaDePago?.Date == ultimoDiaMesAnterior).ToList();
        }

        private List<BaseDashboard> ObtenerListaPorFecha(List<BaseDashboard> sas, DateTime? fecha = null)
        {
            // Asignar la fecha de hoy si no se proporciona una fecha
            DateTime fechaEfectiva = fecha ?? DateTime.Today;

            var resultado = sas.Where(s => s.FechaDePago == fechaEfectiva.Date).ToList();

            if (!resultado.Any())
            {
                var fechaMasProximaAnterior = sas
                    .Where(s => s.FechaDePago < fechaEfectiva.Date)
                    .OrderByDescending(s => s.FechaDePago)
                    .FirstOrDefault()?.FechaDePago?.Date;

                //if (fechaMasProximaAnterior.HasValue)
                //{
                //    resultado = sas.Where(s => s.FechaDePago == fechaMasProximaAnterior.Value).ToList();
                //}
            }

            return resultado;
        }


        private List<BaseDashboard> ObtenerListaPorRangoFecha(List<BaseDashboard> sas, DateTime fechaInicio, DateTime fechaFin)
        {
            return sas.Where(s => s.FechaDePago >= fechaInicio.Date && s.FechaDePago <= fechaFin.Date).ToList();
        }
        private List<BaseDashboard> ObtenerMovimientosUltimos7Dias(List<BaseDashboard> sas)
        {
            DateTime fechaMasReciente = sas.Max(s => s.FechaOperacion) ?? DateTime.Today;

            DateTime haceUnaSemana = fechaMasReciente.AddDays(-7);

            return sas.Where(s => s.FechaOperacion.HasValue && s.FechaOperacion.Value.Date >= haceUnaSemana.Date && s.FechaOperacion.Value.Date <= fechaMasReciente.Date).ToList();
        }



        public List<DateTime> ObtenerFechasUnicas(List<BaseDashboard> movimientosUltimos7Dias)
        {
            if (movimientosUltimos7Dias == null || !movimientosUltimos7Dias.Any())
            {
                return new List<DateTime>();
            }

            DateTime fechaMasReciente = movimientosUltimos7Dias.Max(s => s.FechaOperacion) ?? DateTime.MinValue;

            int ajusteDiaDeLaSemana = (int)fechaMasReciente.DayOfWeek - 1;
            if (ajusteDiaDeLaSemana < 0) 
            {
                ajusteDiaDeLaSemana = 6;
            }

            DateTime primerDiaSemana = fechaMasReciente.AddDays(-ajusteDiaDeLaSemana);

            DateTime fechaHasta = fechaMasReciente < DateTime.Today ? fechaMasReciente : DateTime.Today;

            var fechasUnicas = movimientosUltimos7Dias
                .Select(s => s.FechaOperacion ?? DateTime.MinValue)
                .Distinct()
                .Where(d => d >= primerDiaSemana && d <= fechaHasta)
                .OrderByDescending(d => d)
                .ToList();

            return fechasUnicas;
        }










        private Dictionary<string, List<KeyValuePair<string, decimal>>> ObtenerTotalesPorDiaPorTarjeta(List<BaseDashboard> sas, List<DateTime> fechasUnicas)
        {
            if (sas == null || fechasUnicas == null || !sas.Any() || !fechasUnicas.Any())
            {
                return new Dictionary<string, List<KeyValuePair<string, decimal>>>();
            }
            var totalesPorDiaPorTarjeta = new Dictionary<string, Dictionary<string, decimal>>();

            foreach (var fecha in fechasUnicas)
            {
                string diaSemana = fecha.ToString("dddd");

                foreach (var s in sas)
                {
                    var nombreComercio = s.NombreComercio.Replace(" ", "");
                    if (!totalesPorDiaPorTarjeta.ContainsKey(nombreComercio))
                    {
                        totalesPorDiaPorTarjeta[nombreComercio] = new Dictionary<string, decimal>();
                    }

                    if (!totalesPorDiaPorTarjeta[nombreComercio].ContainsKey(diaSemana))
                    {
                        totalesPorDiaPorTarjeta[nombreComercio][diaSemana] = 0M;
                    }
                }
            }

            foreach (var fecha in fechasUnicas)
            {
                var totalesPorTarjetaEnFecha = sas
                    .Where(s => s.FechaOperacion.HasValue && s.FechaOperacion.Value.Date == fecha)
                    .GroupBy(s => s.NombreComercio.Replace(" ", ""))
                    .ToList();

                foreach (var grupoTarjeta in totalesPorTarjetaEnFecha)
                {
                    var totalPorDia = grupoTarjeta.Sum(item => item.TotalBruto ?? 0M); 
                    var diaSemana = fecha.ToString("dddd");
                    var comercio = grupoTarjeta.Key;

                    if (totalesPorDiaPorTarjeta[comercio].ContainsKey(diaSemana))
                    {
                        totalesPorDiaPorTarjeta[comercio][diaSemana] = totalPorDia;
                    }
                }
            }

            var totalesOrdenadosPorDiaPorTarjeta = new Dictionary<string, List<KeyValuePair<string, decimal>>>();

            foreach (var comercio in totalesPorDiaPorTarjeta.Keys)
            {
                var totalesOrdenados = totalesPorDiaPorTarjeta[comercio]
                    .OrderBy(pair => GetDayOfWeekNumber(pair.Key))
                    .ToList();

                totalesOrdenadosPorDiaPorTarjeta[comercio] = totalesOrdenados;
            }

            return totalesOrdenadosPorDiaPorTarjeta;
        }





        private int ObtenerSemanaDelMes(DateTime fecha)
        {
            var primeraSemanaDelMes = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(new DateTime(fecha.Year, fecha.Month, 1), CalendarWeekRule.FirstDay, DayOfWeek.Monday);
            return CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(fecha, CalendarWeekRule.FirstDay, DayOfWeek.Monday) - primeraSemanaDelMes + 1;
        }

        private int GetDayOfWeekNumber(string dayOfWeek)
        {
            return dayOfWeek switch
            {
                "lunes" => 0,
                "martes" => 1,
                "miércoles" => 2,
                "jueves" => 3,
                "viernes" => 4,
                "sábado" => 5,
                "domingo" => 6,
                _ => 7 
            };
        }




        private List<object> ObtenerDescuentosPorTarjeta(List<BaseDashboard> sas)
        {
            return sas.Select(s => new BaseDashboard
            {
                TarjetaTipo = NormalizarNombreTarjeta(s.TarjetaTipo),
                TotalConDescuentos = s.TotalConDescuentos
            })
                      .GroupBy(s => s.TarjetaTipo)
                      .Select(group => new
                      {
                          Tarjeta = group.Key,
                          TotalConDescuento = group.Sum(item => item.TotalConDescuentos)
                      }).ToList<object>();
        }

        private string NormalizarNombreTarjeta(string tarjetaTipo)
        {
            if (tarjetaTipo.Contains("Visa"))
                return "Visa";
            if (tarjetaTipo.Contains("Mastercard"))
                return "MasterCard";
            if (tarjetaTipo.Contains("Cabal"))
                return "Cabal";
            if (tarjetaTipo.Contains("Maestro"))
                return "Argencard";
            if (tarjetaTipo.Contains("American Express") || tarjetaTipo.Contains("Amex"))
                return "Amex";
        
            if (tarjetaTipo.Contains("Naranja"))
                return "Naranjax";
            if (tarjetaTipo.Contains("Diners"))
                return "Diners";
            return tarjetaTipo;
        }


        private double ObtenerTotalOperaciones(List<BaseDashboard> sas)
        {
            return (double)sas.Count();
        }

        private double ObtenerTotalConDescuentoCuotas(List<BaseDashboard> sas, int cuotas)
        {
            return (double)sas.Where(s => s.Cuotas == cuotas)
                              .Sum(s => s.TotalConDescuentos ?? 0);
        }
        private double ObtenerTotalNeto(List<BaseDashboard> lista)
        {
            return (double)(lista.Sum(s => s.TotalConDescuentos) ?? 0);
        }

        private double ObtenerTotalBruto(List<BaseDashboard> lista)
        {
            return (double)(lista.Sum(s => s.TotalBruto) ?? 0);
        }



        private double ObtenerComparativa(List<BaseDashboard> sas, List<BaseDashboard> lista)
        {
            return (double)lista.Sum(s => s.TotalConDescuentos);
        }

        private double ObtenerPorcentaje(double comparativaHoy, double comparativaDiaAnterior)
        {
            if (comparativaHoy == 0) return 0;

            var diferencia = comparativaHoy - comparativaDiaAnterior;
            return diferencia / comparativaHoy;
        }



        public int ObtenerSemanaDelMesActual()
        {
            DateTime fechaHoy = DateTime.Now;
            DateTime primerDiaDelMes = new DateTime(fechaHoy.Year, fechaHoy.Month, 1);
            int diaDeLaSemanaDelPrimerDia = (int)primerDiaDelMes.DayOfWeek;

            int semanaDelMes = (fechaHoy.Day + diaDeLaSemanaDelPrimerDia - 1) / 7 + 1;
            return semanaDelMes;
        }
        private List<BaseDashboard> ObtenerListaPorFechaMañana(List<BaseDashboard> sas, DateTime fecha)
        {
            var resultado = sas.Where(s => s.FechaDePago?.Date == fecha.Date).ToList();

            if (!resultado.Any())
            {
                var fechaMasProximaPosterior = sas
                    .Where(s => s.FechaDePago?.Date > fecha.Date)
                    .OrderBy(s => s.FechaDePago)
                    .FirstOrDefault()?.FechaDePago?.Date;

                if (fechaMasProximaPosterior.HasValue)
                {
                    resultado = sas.Where(s => s.FechaDePago?.Date == fechaMasProximaPosterior.Value).ToList();
                }
            }

            return resultado;
        }



    }
}