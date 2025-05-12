using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Text.RegularExpressions;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumenAliadoController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IChechAsesores _CheckAsesores;
        private readonly ICheckImagenService _CheckAsesoresImagen;
        private readonly IComandaService _comandaService;
        private readonly IPanelControlInterno _panelControlInterno;
        private readonly IAltaService _altaService;
        private readonly IBaseDashboardService _baseService;
        private readonly IBajaService _bajaService;
        private readonly ICalculadoraService _CalculadoraService;

        public ResumenAliadoController(IUsuarioZocoService usuarioZocoService, ITokenService tokenService, IChechAsesores checkasesores,
            ICheckImagenService checasesoresimagen, IComandaService comandaService, IPanelControlInterno panelControlInterno, IAltaService altaService, IBaseDashboardService baseService,
            ICalculadoraService calculadoraService,
            IBajaService bajaService)
        {
            _usuariozoco = usuarioZocoService;
            _tokenService = tokenService;
            _CheckAsesores = checkasesores;
            _CheckAsesoresImagen = checasesoresimagen;
            _comandaService = comandaService;
            _panelControlInterno = panelControlInterno;
            _altaService = altaService;
            _baseService = baseService;
            _bajaService = bajaService;
            _CalculadoraService = calculadoraService;

        }

        [HttpPost("gestionesaliados")]
        public async Task<IActionResult> GestionesAliados([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            var usuarioaliado = await _usuariozoco.ObtenerPorCuit(request.Cuit);

            // Verificar si el usuario aliado es nulo
            if (usuarioaliado == null)
            {
                return NotFound("No se encontraron datos para el CUIT proporcionado.");
            }

            var historialaliado = await _panelControlInterno.ObtenerPorusuariId(usuarioaliado.Id);

            // Ordenar por FechaCarga de manera descendente
            var historialOrdenado = historialaliado.OrderByDescending(h => h.FechaCarga).ToList();

            return Ok(historialOrdenado);
        }
        [HttpPost("gestionesaliadosfacturacion")]
        public async Task<IActionResult> GestionesAliadosFacturacion([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Intentar convertir el CUIT del request a double
            if (!double.TryParse(request.Cuit, out double cuitRequest))
            {
                return BadRequest("CUIT inválido");
            }

            // Obtener todas las terminales y filtrar por CUIT
            var terminales = await _altaService.ObtenerCRM();
            var terminalesFiltradas = terminales.Where(t => t.CuitCuil == cuitRequest).DistinctBy(t => t.NDeTerminal).ToList();

            // Lista para almacenar los resultados por terminal y datos acumulados del CUIT
            List<object> resultado = new List<object>();
            Dictionary<string, decimal> datosSemanaCUIT = new Dictionary<string, decimal>(); // Acumulado por día para el CUIT
            decimal totalBrutoCUITMes = 0; // Total bruto mensual del CUIT
            decimal totalDebitoCUITMes = 0;
            decimal totalCreditoCUITMes = 0;
            decimal total1PagoCUITMes = 0;
            int totalOperacionesCUITMes = 0;

            // Diccionario para días de la semana en español
            var diasSemanaEspañol = new Dictionary<string, string>
    {
        { "Sunday", "Domingo" },
        { "Monday", "Lunes" },
        { "Tuesday", "Martes" },
        { "Wednesday", "Miércoles" },
        { "Thursday", "Jueves" },
        { "Friday", "Viernes" },
        { "Saturday", "Sábado" }
    };

            // Calcular el rango de la semana pasada (domingo a sábado)
            DateTime fechaHoy = DateTime.Now;
            DateTime inicioSemanaAnterior = fechaHoy.AddDays(-(int)fechaHoy.DayOfWeek - 14); // Domingo de hace dos semanas
            DateTime finSemanaAnterior = inicioSemanaAnterior.AddDays(6); // Sábado de hace dos semanas

            // Obtener el primer día del mes de la semana pasada y el último día de la semana anterior
            DateTime inicioMesSemanaAnterior = new DateTime(inicioSemanaAnterior.Year, inicioSemanaAnterior.Month, 1);
            DateTime finMesSemanaAnterior = fechaHoy;

            foreach (var terminal in terminalesFiltradas)
            {
                // Obtener facturación diaria de la terminal desde el inicio del mes hasta el final de la semana anterior
                var datosMes = await _baseService.DatosCuitPorFechaOperacionDiaria(
                    terminal.CuitCuil.ToString(),
                    terminal.NDeTerminal.ToString(),
                    inicioMesSemanaAnterior
                );

                if (datosMes != null && datosMes.Any())
                {
                    // Calcular totales mensuales por tipo de financiación para esta terminal
                    decimal totalBrutoDebitoMes = datosMes.Sum(d => d.TotalBrutoDebito);
                    decimal totalBrutoCreditoMes = datosMes.Sum(d => d.TotalBrutoCredito);
                    decimal totalBruto1PagoMes = datosMes.Sum(d => d.TotalBruto1Pago);
                    int totalOperacionesMes = datosMes.Sum(d => d.CantidadDebito + d.CantidadCredito + d.Cantidad1Pago);

                    // Acumular en el total general para el CUIT
                    totalDebitoCUITMes += totalBrutoDebitoMes;
                    totalCreditoCUITMes += totalBrutoCreditoMes;
                    total1PagoCUITMes += totalBruto1PagoMes;
                    totalOperacionesCUITMes += totalOperacionesMes;
                    totalBrutoCUITMes += datosMes.Sum(d => d.TotalBruto);

                    // Calcular ticket promedio por terminal
                    var ticketPromedioDebitoTerminal = totalOperacionesMes > 0 ? totalBrutoDebitoMes / totalOperacionesMes : 0;
                    var ticketPromedioCreditoTerminal = totalOperacionesMes > 0 ? (totalBrutoCreditoMes + totalBruto1PagoMes) / totalOperacionesMes : 0;

                    // Filtrar los datos hasta el fin de la semana anterior y acumular en datosSemanaCUIT
                    var datosMesFiltrados = datosMes
                        .Where(d => !string.IsNullOrEmpty(d.Fecha) && DateTime.ParseExact(d.Fecha, "dd/MM/yyyy", null) <= finMesSemanaAnterior)
                        .ToList();

                    // Acumular en datosSemanaCUIT solo para la semana anterior
                    var datosSemanaFiltrados = datosMesFiltrados
                        .Where(d => DateTime.ParseExact(d.Fecha, "dd/MM/yyyy", null) >= inicioSemanaAnterior &&
                                    DateTime.ParseExact(d.Fecha, "dd/MM/yyyy", null) <= finSemanaAnterior)
                        .ToList();

                    foreach (var dia in datosSemanaFiltrados)
                    {
                        if (!string.IsNullOrEmpty(dia.Fecha) && datosSemanaCUIT.ContainsKey(dia.Fecha))
                        {
                            datosSemanaCUIT[dia.Fecha] += dia.TotalBruto;
                        }
                        else if (!string.IsNullOrEmpty(dia.Fecha))
                        {
                            datosSemanaCUIT[dia.Fecha] = dia.TotalBruto;
                        }
                    }

                    // Encontrar el mejor y peor día para esta terminal específica en la semana pasada
                    var mejorDia = datosSemanaFiltrados.OrderByDescending(f => f.TotalBruto).FirstOrDefault();
                    var peorDia = datosSemanaFiltrados.OrderBy(f => f.TotalBruto).FirstOrDefault();

                    var datosTerminal = new
                    {
                        terminal.Estado,
                        terminal.NDeTerminal,
                        terminal.NombreDeFantasia,
                        terminal.Provincia,
                        terminal.CuitCuil,
                        MejorDiaFacturacion = !string.IsNullOrEmpty(mejorDia.Fecha) ? diasSemanaEspañol[DateTime.ParseExact(mejorDia.Fecha, "dd/MM/yyyy", null).DayOfWeek.ToString()] : "Sin facturación",
                        PeorDiaFacturacion = !string.IsNullOrEmpty(peorDia.Fecha) ? diasSemanaEspañol[DateTime.ParseExact(peorDia.Fecha, "dd/MM/yyyy", null).DayOfWeek.ToString()] : "Sin facturación",
                        FacturacionMejorDia = !string.IsNullOrEmpty(mejorDia.Fecha) ? mejorDia.TotalBruto : 0,
                        FacturacionPeorDia = !string.IsNullOrEmpty(peorDia.Fecha) ? peorDia.TotalBruto : 0,
                        TotalBrutoTerminalMes = totalBrutoCUITMes, // Total bruto mensual de esta terminal
                        TotalBrutoDebitoMes = totalBrutoDebitoMes,
                        TotalBrutoCreditoMes = totalBrutoCreditoMes,
                        TotalBruto1PagoMes = totalBruto1PagoMes,
                        TotalOperacionesMes = totalOperacionesMes,
                        TicketPromedioDebitoTerminal = ticketPromedioDebitoTerminal,
                        TicketPromedioCreditoTerminal = ticketPromedioCreditoTerminal,
                        FacturacionDiaria = datosSemanaFiltrados.Select(d => new
                        {
                            Dia = !string.IsNullOrEmpty(d.Fecha) ? diasSemanaEspañol[DateTime.ParseExact(d.Fecha, "dd/MM/yyyy", null).DayOfWeek.ToString()] : "Sin fecha",
                            MontoFacturado = d.TotalBruto,
                            TotalBrutoDebito = d.TotalBrutoDebito,
                            CantidadDebito = d.CantidadDebito,
                            TotalBrutoCredito = d.TotalBrutoCredito,
                            CantidadCredito = d.CantidadCredito,
                            TotalBruto1Pago = d.TotalBruto1Pago,
                            Cantidad1Pago = d.Cantidad1Pago
                        }).ToList()
                    };


                    resultado.Add(datosTerminal);
                }
            }

            // Calcular el mejor y peor día para el CUIT completo en la semana pasada
            decimal totalBrutoCUITSemana = datosSemanaCUIT.Values.Sum();
            var mejorDiaCUIT = datosSemanaCUIT.OrderByDescending(f => f.Value).FirstOrDefault();
            var peorDiaCUIT = datosSemanaCUIT.OrderBy(f => f.Value).FirstOrDefault();

            // Calcular ticket promedio para el CUIT total
            var ticketPromedioDebitoCUIT = totalOperacionesCUITMes > 0 ? totalDebitoCUITMes / totalOperacionesCUITMes : 0;
            var ticketPromedioCreditoCUIT = totalOperacionesCUITMes > 0 ? (totalCreditoCUITMes + total1PagoCUITMes) / totalOperacionesCUITMes : 0;

            // Agregar los datos totales al resultado
            var resumenCUIT = new
            {
                TotalBrutoCUITMes = totalBrutoCUITMes, // Total bruto mensual para el CUIT completo
                TotalBrutoCUITSemana = totalBrutoCUITSemana, // Total bruto de la semana pasada
                MejorDiaFacturacionCUIT = mejorDiaCUIT.Key != null ? diasSemanaEspañol[DateTime.ParseExact(mejorDiaCUIT.Key, "dd/MM/yyyy", null).DayOfWeek.ToString()] : "Sin facturación",
                PeorDiaFacturacionCUIT = peorDiaCUIT.Key != null ? diasSemanaEspañol[DateTime.ParseExact(peorDiaCUIT.Key, "dd/MM/yyyy", null).DayOfWeek.ToString()] : "Sin facturación",
                FacturacionMejorDiaCUIT = mejorDiaCUIT.Value,
                FacturacionPeorDiaCUIT = peorDiaCUIT.Value,
                TotalDebitoCUITMes = totalDebitoCUITMes,
                TotalCreditoCUITMes = totalCreditoCUITMes,
                Total1PagoCUITMes = total1PagoCUITMes,
                TotalOperacionesCUITMes = totalOperacionesCUITMes,
                TicketPromedioDebitoCUIT = ticketPromedioDebitoCUIT,
                TicketPromedioCreditoCUIT = ticketPromedioCreditoCUIT
            };

            resultado.Add(resumenCUIT);

            // Retornar el resultado con la facturación diaria por cada terminal única y el resumen del CUIT
            return Ok(resultado);
        }
        [HttpPost("ahorroaliado")]
        public async Task<IActionResult> AhorroAliado([FromBody] VMToken request)
        {
            // Validar el token del usuario
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Convertir el CUIT a double
            if (!double.TryParse(request.Cuit, out double cuitRequest))
            {
                return BadRequest("CUIT inválido");
            }
            var culture = new CultureInfo("es-ES");

            // Obtener todas las terminales y filtrar por CUIT
            var terminales = await _altaService.ObtenerCRM();
            var terminalebaja = await _bajaService.ObtenerCRMBaja();

            // Filtrar terminales activas por CUIT
            var terminalesActivas = terminales
                .Where(t => t.CuitCuil == cuitRequest)
                .DistinctBy(t => t.NDeTerminal)
                .Select(t => new
                {
                    NDeTerminal = t.NDeTerminal?.ToString(), // Convertimos double? a string
                    Estado = "Activa",
                    CuitCuil = t.CuitCuil
                })
                .ToList();

            // Filtrar terminales de baja por el mismo CUIT, excluyendo las que ya están en terminalesActivas
            var terminalesBaja = terminalebaja
                .Where(b => b.CuitCuil == cuitRequest)
                .Where(b => !terminalesActivas.Any(t => t.NDeTerminal == b.NDeTerminal)) // Evitar duplicados
                .Select(b => new
                {
                    NDeTerminal = b.NDeTerminal,
                    Estado = "Baja",
                    CuitCuil = b.CuitCuil
                })
                .ToList();

            // Combinar ambas listas
            var terminalesFiltradas = terminalesActivas.Concat(terminalesBaja).ToList();



            if (!terminalesFiltradas.Any())
            {
                return NotFound("No se encontraron terminales asociadas al CUIT.");
            }

            DateTime fechaInicio = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            DateTime fechaFin = fechaInicio.AddMonths(1).AddDays(-1);

            Dictionary<DateTime, List<BaseDashboard>> facturacionPorMes = new();
            // Lista para los resultados finales
            var resultadosfinales = new List<Resultado>();

            var resultadospayway = new List<PaywayResult>();
            var resultadosmercadopago = new List<MercadopagoResult>();
            var resultadosnaranjax = new List<NaranjaXResult>();
            var resultadosgetnet = new List<GetnetResult>();
            //resultadosviumi
            var resultadosviumi = new List<ViumiResult>();
            var resultadosnave = new List<NaveResult>(); 
            while (true)
            {
                List<BaseDashboard> facturacionMesActual = new();

                foreach (var terminal in terminalesFiltradas)
                {
                    var facturacion = await _baseService.ObtenerFacturacionPorTerminalRango(
                        cuitRequest.ToString(),
                        terminal.NDeTerminal.ToString(),
                        fechaInicio,
                        fechaFin
                    );

                    facturacionMesActual.AddRange(facturacion);
                }

                decimal montoBrutoTotal = facturacionMesActual
                    .Where(f => f.TotalBruto.HasValue)
                    .Sum(f => f.TotalBruto.Value);

                if (montoBrutoTotal > 0)
                {
                    facturacionPorMes[fechaInicio] = facturacionMesActual;

                    // Buscar el mes anterior también
                    DateTime fechaInicioAnterior = fechaInicio.AddMonths(-1);
                    DateTime fechaFinAnterior = fechaInicioAnterior.AddMonths(1).AddDays(-1);

                    List<BaseDashboard> facturacionMesAnterior = new();

                    foreach (var terminal in terminalesFiltradas)
                    {
                        var facturacionAntigua = await _baseService.ObtenerFacturacionPorTerminalRango(
                            cuitRequest.ToString(),
                            terminal.NDeTerminal.ToString(),
                            fechaInicioAnterior,
                            fechaFinAnterior
                        );

                        facturacionMesAnterior.AddRange(facturacionAntigua);
                    }

                    facturacionPorMes[fechaInicioAnterior] = facturacionMesAnterior;
                    break; // Ya tenemos datos, salimos
                }

                // Retroceder un mes
                fechaInicio = fechaInicio.AddMonths(-1);
                fechaFin = fechaInicio.AddMonths(1).AddDays(-1);
            }

            // Seleccionar el mes con la mayor facturación bruta
            var mejorMes = facturacionPorMes.OrderByDescending(m => m.Value.Sum(f => f.TotalBruto ?? 0)).First();
            var transacciones = mejorMes.Value;

            // Agrupar por cuotas, tipo de tarjeta, etc.
            var grupos = transacciones
                .GroupBy(t => new { t.DebitoCredito, t.Cuotas, t.TarjetaTipo, t.Tarjeta });

            var resultados = new List<object>();
            var resultadostrasacciones = new List<object>();

            // Diccionario para almacenar sumas por cuota
            var resultadosAgrupados = new Dictionary<int, (decimal SumaTotalBruto, decimal SumaTotalNeto)>();
            decimal ConvertPercentageToDecimal(string percentage)
            {
                if (string.IsNullOrWhiteSpace(percentage) || percentage.TrimEnd('%').Equals("0"))
                {
                    return 0m;
                }
                return decimal.Parse(percentage.TrimEnd('%')) / 100;
            }
            foreach (var grupo in grupos)
            {
                decimal sumCostoTarjeta = 0, sumComisionMasIva = 0, sumIvaFinal = 0, sumDebcredFinal = 0;
                decimal sumNarFinal = 0, sumCostoAnticipo = 0, sumBruto = 0, sumNeto = 0;
                decimal sumMontoinicial = 0, sumMontofinal = 0, sumComision = 0, sumIvaComision = 0;
                decimal sumAlicuotaFinal = 0, sumGananciaFinal = 0;
                decimal sumtransaccionneto = 0;

                foreach (var transaccion in grupo)
                {
                    decimal monto = transaccion.TotalBruto ?? 0;
                    decimal bruto = monto;
                    decimal neto = monto;
                    decimal montofinal = 0;

                    // Obtener lista de cuotas
                    var listacuota = await _CalculadoraService.ListaCuota();
                    var transaccioncuotas = transaccion.Cuotas;
                    if(transaccioncuotas == 13)
                    {
                        transaccioncuotas = 3;
                    } else if(transaccioncuotas == 16)
                    {
                        transaccioncuotas = 6;
                    }
                    var costosTarjeta = GetCostoTarjeta(
                        listacuota,
                        transaccion.TarjetaTipo?.ToLower() ?? "",
                        transaccioncuotas.ToString() ?? "0",
                        usuarioEncontrado.usuario.Nombre
                    );

                    decimal costoTarjeta = 0, comisionMasIva = 0, comision = 0;
                    if (costosTarjeta.Count > 0)
                    {
                        var detalle = costosTarjeta.First();

                        // Función para convertir porcentajes en decimales correctamente
                    

                        costoTarjeta = ConvertPercentageToDecimal(detalle.CostoTarjeta) * monto;
                        comisionMasIva = ConvertPercentageToDecimal(detalle.ComisionMasIva) * monto;
                        comision = ConvertPercentageToDecimal(detalle.Comision) * monto;
                    }
                    else
                    {
                        var detalle = costosTarjeta.First();

                        // Función para convertir porcentajes en decimales correctamente


                        costoTarjeta = 0m;
                        comisionMasIva = ConvertPercentageToDecimal(detalle.ComisionMasIva) * monto;
                        comision = ConvertPercentageToDecimal(detalle.Comision) * monto;
                    }

                    // **Separar el IVA de la comisión**
                    decimal porcentajeIVA = 0.21m;
                    sumComision = comisionMasIva / (1 + porcentajeIVA); // Comisión sin IVA
                    sumIvaComision = comisionMasIva - sumComision;     // IVA de la comisión

                    // **Obtener impuestos de acuerdo a la provincia y cuota**
                    string provincia = transaccion.Provincia ?? "Vacio";
                    var listaprovincia = await _CalculadoraService.ListaIIBBProvincia();
                    var ListaImpositiva = await _CalculadoraService.ListaImpositiva();

                    var provinciaEncontrada = listaprovincia.FirstOrDefault(p => p.Provincia.ToLower() == provincia.ToLower());
                    string alicuota = provinciaEncontrada?.Alicuota ?? "0";
                    string ganancia = "0", iva = "0", debcred = "0", nar = "0";

                    if (Convert.ToInt32(transaccion.Cuotas) == 0)
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "ganancia") ganancia = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "iva") iva = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito") debcred = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja") nar = impuesto.Porcentaje;
                        }
                    }
                    else if (Convert.ToInt32(transaccion.Cuotas) == 1)
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "ganancia") ganancia = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "iva") iva = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito") debcred = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja") nar = impuesto.Porcentaje;
                        }
                    }
                    else
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "ganancia") ganancia = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "iva") iva = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito") debcred = impuesto.Porcentaje;
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja") nar = impuesto.Porcentaje;
                        }
                    }
               
                    // Convertir los valores de impuestos a decimal
                    decimal alicuotaFinal = ConvertPercentageToDecimal(alicuota) * comision;
                    decimal gananciaFinal = ConvertPercentageToDecimal(ganancia) * comision;
                    decimal ivaFinal = ConvertPercentageToDecimal(iva) * comision;
                    decimal debcredFinal = monto * ConvertPercentageToDecimal(debcred);
                    decimal narFinal = monto * ConvertPercentageToDecimal(nar);

                    // **Cálculo del costo de anticipo**
                    //  decimal costoAnticipo = 0;
                    decimal costoAnticipo = monto * SafeConvertPercentage(transaccion.Anticipo);
                    //if (Convert.ToInt32(transaccion.Cuotas) > 1)
                    //{
                    //    costoAnticipo = monto * 0.027104m; // Anticipo 5.71% para más de 1 cuota
                    //}

                    // **Aplicar descuentos**
                    if (transaccion.Cuotas == 1)
                    {
                        costoTarjeta = 0;
                    }
                    decimal descuentos = costoTarjeta + comisionMasIva + alicuotaFinal + /*gananciaFinal + ivaFinal + */ debcredFinal /*+ narFinal*/ + costoAnticipo;
                    neto = monto - descuentos;
                    bruto = monto;
                    if (Math.Truncate((decimal)transaccion.TotalConDescuentos)> Math.Truncate(neto))
                    {
                        neto = (decimal)transaccion.TotalConDescuentos;
                    }
                    //else
                    //{
                    //    montofinal = (decimal)transaccion.TotalConDescuentos;
                    //}



                    // **Acumular sumas con dos decimales**
                    // **Acumular sumas ignorando los decimales después de los dos primeros**
                    sumCostoTarjeta += costoTarjeta;
                    sumComisionMasIva += comisionMasIva;
                    sumAlicuotaFinal += alicuotaFinal;
                    sumGananciaFinal += gananciaFinal;
                    sumIvaFinal += ivaFinal;
                    sumDebcredFinal += debcredFinal;
                    sumNarFinal += narFinal;
                    sumCostoAnticipo += costoAnticipo;
                    sumBruto += bruto;
                    sumNeto += neto;
                    sumMontoinicial += monto;
                    sumMontofinal += neto;
                    sumtransaccionneto += (decimal)transaccion.TotalConDescuentos;

                }

                // **Objeto de respuesta corregido con impuestos**
                var resultadoGrupo = new
                {
                    DebitoCredito = grupo.Key.DebitoCredito,
                    Cuotas = grupo.Key.Cuotas,
                    TarjetaTipo = grupo.Key.TarjetaTipo,
                    Tarjeta = grupo.Key.Tarjeta,
                    CostoTarjeta = sumCostoTarjeta.ToString(culture),
                    Comision = sumComision.ToString(culture),
                    IvaComision = sumIvaComision.ToString(culture),
                    ComisionMasIva = sumComisionMasIva.ToString(culture),
                    AlicuotaFinal = sumAlicuotaFinal.ToString(culture),
                    GananciaFinal = sumGananciaFinal.ToString(culture),
                    IvaFinal = sumIvaFinal.ToString(culture),
                    DebcredFinal = sumDebcredFinal.ToString(culture),
                    NarFinal = sumNarFinal.ToString(culture),
                    CostoAnticipo = sumCostoAnticipo.ToString(culture),
                    Neto = sumNeto.ToString(culture),
                    Bruto = sumBruto.ToString(culture),
                    MontoInicial = sumMontoinicial.ToString(culture),
                    MontoFinal = sumMontofinal.ToString(culture),
                    Sumtransaccionneto = sumtransaccionneto

                };

                resultados.Add(resultadoGrupo);
            



            // 🔹 **Agrupar por cuota y sumar los valores**
            int cuotaKey = (int)(grupo.Key.Cuotas ?? 0);


                if (resultadosAgrupados.ContainsKey(cuotaKey))
                {
                    resultadosAgrupados[cuotaKey] = (
                        resultadosAgrupados[cuotaKey].SumaTotalBruto + sumBruto,
                        resultadosAgrupados[cuotaKey].SumaTotalNeto + sumNeto
                    );
                }
                else
                {
                    resultadosAgrupados[cuotaKey] = (sumBruto, sumNeto);
                }
            }

            // 🔹 **Convertir a lista para recorrer en el otro foreach**
            var agrupados = resultadosAgrupados
                .Select(r => new
                {
                    Cuotas = r.Key,
                    SumaTotalBruto = r.Value.SumaTotalBruto,
                    SumaTotalNeto = r.Value.SumaTotalNeto
                })
                .ToList();

            // Definir culture antes de usarlo en los formateos numéricos
            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto; // Usar el nombre exacto de la propiedad

                if (cuota == 0)
                {
                    // Calcular deducciones para cuota 0
                    var arancel = monto * 0.008m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;
                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadospayway.Add(new PaywayResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Calcular deducciones para cuotas específicas
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;
                    var costoFinancieroPaywayIva = 0.0m;
                    var costoAnticipoPaywayIva = 0.0m;

                    // Definir costos financieros y de anticipo según cuota
                    switch (cuota)
                    {
                        case 1:
                            costoAnticipo = monto * 0.0441m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 3:
                            costofinanciero = monto * 0.0488m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.0934m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.1352m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.1743m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.0488m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.0934m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m;
                            costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                            break;
                    }

                    var arancel = monto * 0.018m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto + costofinanciero + costoAnticipo + costoAnticipoPaywayIva + costoFinancieroPaywayIva;
                    var totalADepositar = monto - totalDeducciones;

                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }

                    resultadospayway.Add(new PaywayResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });

                }
                else
                {
                    var arancel = monto * 0.018m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;
                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;
                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadospayway.Add(new PaywayResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }
            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto; // Usar el nombre exacto de la propiedad

                if (cuota == 0)
                {
                    // Calcular deducciones para cuota 0 en MercadoPago
                    var arancel = monto * 0.0325m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadosmercadopago.Add(new MercadopagoResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Calcular deducciones para cuotas específicas en MercadoPago
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;

                    switch (cuota)
                    {
                        case 1:
                            costoAnticipo = monto * 0.0m;
                            break;
                        case 3:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.135036m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.366025m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.44649m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.135036m;
                            break;
                    }

                    var arancel = monto * 0.0629m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                    var totalADepositar = monto - totalDeducciones;
                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }
                    resultadosmercadopago.Add(new MercadopagoResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else
                {
                    var arancel = monto * 0.0629m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;
                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadosmercadopago.Add(new MercadopagoResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }

            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto;

                if (cuota == 0)
                {
                    // Cálculos para cuota 0
                    var arancel = monto * 0.0315m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.035m;
                    var percepcionIBB = arancel * 0.035m;
                    var percepcionIva = arancel * 0.03m;

                    // Estas variables se mantienen como 0 para cuota 0
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.012m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + percepcionIBB + percepcionIva + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadosnaranjax.Add(new NaranjaXResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Cálculos para cuotas específicas
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;

                    switch (cuota)
                    {
                        case 1:
                            //costoAnticipo = monto * 0.0653m;
                            break;
                        case 3:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.135036m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.581647m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.828971m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.135036m;
                            break;
                    }

                    var arancel = monto * 0.0579m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var percepcionIBB = arancel * 0.035m;
                    var percepcionIva = arancel * 0.03m;

                    // Estas variables se mantienen como 0
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.012m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                    var totalADepositar = monto - totalDeducciones;
                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }

                    resultadosnaranjax.Add(new NaranjaXResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else
                {
                    var arancel = monto * 0.0579m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var percepcionIBB = arancel * 0.035m;
                    var percepcionIva = arancel * 0.03m;

                    // Estas variables se mantienen como 0
                    var retencionesIva = 0m;
                    var retencionesGcias = 0m;
                    var impuestodtocrto = monto * 0.012m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;
                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadosnaranjax.Add(new NaranjaXResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }

            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto;

                if (cuota == 0)
                {
                    // Cálculos para cuota 0
                    var arancel = monto * 0.0319m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuota 0
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuota 0
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadosgetnet.Add(new GetnetResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Cálculos para cuotas específicas
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;

                    switch (cuota)
                    {
                        case 1:
                            costoAnticipo = monto * 0.047432m;
                            break;
                        case 3:
                            costofinanciero = monto * 0.071027m;
                            costoAnticipo = monto * 0.07319m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.135036m;
                            costoAnticipo = monto * 0.07319m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.36905m;
                            costoAnticipo = monto * 0.047432m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.450725m;
                            costoAnticipo = monto * 0.047432m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.071027m;
                            costoAnticipo = monto * 0.07319m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.135036m;
                            costoAnticipo = monto * 0.07319m;
                            break;
                    }

                    var arancel = monto * 0.02m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuotas específicas
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuotas específicas
                    var impuestodtocrto = monto * 0.006m;
                    var percepcionIva = arancel * 0.00m;
                    var costoanticipoiva = 0.0m;
                    var costofinancieroiva = 0.0m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                    var totalADepositar = monto - totalDeducciones;
                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }
                    resultadosgetnet.Add(new GetnetResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else
                {
                    var arancel = monto * 0.02m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuotas específicas
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuotas específicas
                    var impuestodtocrto = monto * 0.006m;
                    var percepcionIva = arancel * 0.00m;
                    var costoanticipoiva = 0.0m;
                    var costofinancieroiva = 0.0m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;
                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadosgetnet.Add(new GetnetResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }

            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto;

                if (cuota == 0)
                {
                    // Cálculos para cuota 0
                    var arancel = monto * 0.023m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuota 0
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuota 0
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadosviumi.Add(new ViumiResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Cálculos para cuotas específicas
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;

                    switch (cuota)
                    {
                        case 1:
                            costoAnticipo = monto * 0.0m; // No hay costo de anticipo para cuota 1
                            break;
                        case 3:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.135036m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.3751m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.4598m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.071027m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.135036m;
                            break;
                    }

                    var arancel = monto * 0.0519m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuotas específicas
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuotas específicas
                    var impuestodtocrto = monto * 0.006m;
                    var percepcionIva = arancel * 0.00m;
                    var costoanticipoiva = 0.0m;
                    var costofinancieroiva = 0.0m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                    var totalADepositar = monto - totalDeducciones;
                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }
                    resultadosviumi.Add(new ViumiResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else
                {
                    var arancel = monto * 0.0519m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var retencionesIibb = monto * 0.05m;
                    var retencionesIva = 0m; // Sin retenciones de IVA para cuotas específicas
                    var retencionesGcias = 0m; // Sin retenciones de ganancias para cuotas específicas
                    var impuestodtocrto = monto * 0.006m;
                    var percepcionIva = arancel * 0.00m;
                    var costoanticipoiva = 0.0m;
                    var costofinancieroiva = 0.0m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;
                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadosviumi.Add(new ViumiResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }

            foreach (var grupo in agrupados)
            {
                var cuota = grupo.Cuotas;
                var monto = grupo.SumaTotalBruto;
                var neto = grupo.SumaTotalNeto; // Usar el nombre exacto de la propiedad

                if (cuota == 0)
                {
                    // Calcular deducciones para cuota 0
                    var arancel = monto * 0.0199m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;
                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto;
                    var totalADepositar = monto - totalDeducciones;

                    resultadosnave.Add(new NaveResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else if (cuota == 1 || cuota == 3 || cuota == 6 || cuota == 9 || cuota == 12 || cuota == 13 || cuota == 16)
                {
                    // Calcular deducciones para cuotas específicas
                    var costofinanciero = 0.0m;
                    var costoAnticipo = 0.0m;
                    var costoFinancieroPaywayIva = 0.0m;
                    var costoAnticipoPaywayIva = 0.0m;

                    // Definir costos financieros y de anticipo según cuota
                    switch (cuota)
                    {
                        case 3:
                            costofinanciero = monto * 0.0587m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                        case 6:
                            costofinanciero = monto * 0.01116m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                        case 9:
                            costofinanciero = monto * 0.4807m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                        case 12:
                            costofinanciero = monto * 0.6851m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                        case 13:
                            costofinanciero = monto * 0.0587m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                        case 16:
                            costofinanciero = monto * 0.01116m;
                            costoFinancieroPaywayIva = costofinanciero * 0.21m;
                            break;
                    }

                    var arancel = monto * 0.0579m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto + costofinanciero + costoAnticipo + costoAnticipoPaywayIva + costoFinancieroPaywayIva;
                    var totalADepositar = monto - totalDeducciones;
                    // Si totalADepositar es menor que neto, usar neto en su lugar
                    if (totalADepositar > neto)
                    {
                        totalADepositar = neto;
                    }
                    resultadosnave.Add(new NaveResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = totalDeducciones,
                        TotalADepositar = totalADepositar,
                        TotalNetozoco = neto
                    });
                }
                else
                {
                    var arancel = monto * 0.0579m;
                    var ivaSobreArancel = arancel * 0.21m;
                    var percepcionesIva = arancel * 0.03m;
                    var retencionesIibb = monto * 0.05m;
                    var impuestodtocrto = monto * 0.006m;

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto;
                    var totalADepositar = neto - totalDeducciones;

                    // Caso donde la cuota no es 0, 1, 3, 6, 9, 12, 13 o 16
                    resultadosnave.Add(new NaveResult
                    {
                        Cuotas = cuota,
                        BrutoPayway = monto,
                        TotalDeducciones = 0, // No hay deducciones
                        TotalADepositar = totalADepositar, // Se usa el neto en TotalADepositar
                        TotalNetozoco = neto
                    });
                }
            }

            decimal totalBrutoGeneral = resultados.Sum(r => decimal.Parse(r.GetType().GetProperty("Bruto").GetValue(r).ToString(), culture));
            decimal totalNetoGeneral = resultados.Sum(r => decimal.Parse(r.GetType().GetProperty("Neto").GetValue(r).ToString(), culture));
            decimal totalNetoTransaccion = resultados.Sum(r => decimal.Parse(r.GetType().GetProperty("Sumtransaccionneto").GetValue(r).ToString(), culture));

            // Calcular el ahorro de Payway (para porcentaje)
            var ahorroRealPayway = resultadospayway.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Payway
            var totalNetozocoPayway = resultadospayway.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroPayway = totalNetozocoPayway != 0
                ? (ahorroRealPayway / totalNetozocoPayway) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de Payway
            var montoAhorroPayway = (porcentajeAhorroPayway / 100) * totalNetozocoPayway;

            // Calcular el ahorro de MercadoPago (para porcentaje)
            var ahorroRealMercadoPago = resultadosmercadopago.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de MercadoPago
            var totalNetozocoMercadoPago = resultadosmercadopago.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroMercadoPago = totalNetozocoMercadoPago != 0
                ? (ahorroRealMercadoPago / totalNetozocoMercadoPago) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de MercadoPago
            var montoAhorroMercadoPago = (porcentajeAhorroMercadoPago / 100) * totalNetozocoMercadoPago;

            // Calcular el ahorro de NaranjaX (para porcentaje)
            var ahorroRealNaranjaX = resultadosnaranjax.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de NaranjaX
            var totalNetozocoNaranjaX = resultadosnaranjax.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroNaranjaX = totalNetozocoNaranjaX != 0
                ? (ahorroRealNaranjaX / totalNetozocoNaranjaX) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de NaranjaX
            var montoAhorroNaranjaX = (porcentajeAhorroNaranjaX / 100) * totalNetozocoNaranjaX;

            // Calcular el ahorro de Getnet (para porcentaje)
            var ahorroRealGetnet = resultadosgetnet.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Getnet
            var totalNetozocoGetnet = resultadosgetnet.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroGetnet = totalNetozocoGetnet != 0
                ? (ahorroRealGetnet / totalNetozocoGetnet) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de Getnet
            var montoAhorroGetnet = (porcentajeAhorroGetnet / 100) * totalNetozocoGetnet;

            // Calcular el ahorro de Viumi (para porcentaje)
            var ahorroRealViumi = resultadosviumi.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Viumi
            var totalNetozocoViumi = resultadosviumi.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroViumi = totalNetozocoViumi != 0
                ? (ahorroRealViumi / totalNetozocoViumi) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de Viumi
            var montoAhorroViumi = (porcentajeAhorroViumi / 100) * totalNetozocoViumi;

            // Calcular el ahorro de Nave (para porcentaje)
            var ahorroRealNave = resultadosnave.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Nave
            var totalNetozocoNave = resultadosnave.Sum(item => item.TotalNetozoco);
            var porcentajeAhorroNave = totalNetozocoNave != 0
                ? (ahorroRealNave / totalNetozocoNave) * 100
                : 0;

            // Valor absoluto del porcentaje de ahorro de Nave
            var montoAhorroNave = (porcentajeAhorroNave / 100) * totalNetozocoNave;

            // Sumar los totales generales
          

            // Calcular el menor entre totalNetoGeneral y totalNetoTransaccion
            decimal netoZocoMenor = Math.Max(totalNetoGeneral, totalNetoTransaccion);
            var fechacomparacion = mejorMes.Key.ToString("yyyy-MM-dd");
            // Crear el resultado final con valores formateados
            var resultado = new Resultado
            {
                AhorroPayway = "$ " + resultadospayway.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroPayway = "↓" + porcentajeAhorroPayway.ToString("F2") + "%",
                MontoAhorroPayway = "$ " + montoAhorroPayway.ToString("N0"),

                AhorroMercadoPago = "$ " + resultadosmercadopago.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroMercadoPago = "↓" + porcentajeAhorroMercadoPago.ToString("F2") + "%",
                MontoAhorroMercadoPago = "$ " + montoAhorroMercadoPago.ToString("N0"),

                AhorroNaranjaX = "$ " + resultadosnaranjax.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroNaranjaX = "↓" + porcentajeAhorroNaranjaX.ToString("F2") + "%",
                MontoAhorroNaranjaX = "$ " + montoAhorroNaranjaX.ToString("N0"),

                AhorroGetnet = "$ " + resultadosgetnet.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroGetnet = "↓" + porcentajeAhorroGetnet.ToString("F2") + "%",
                MontoAhorroGetnet = "$ " + montoAhorroGetnet.ToString("N0"),

                AhorroViumi = "$ " + resultadosviumi.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroViumi = "↓" + porcentajeAhorroViumi.ToString("F2") + "%",
                MontoAhorroViumi = "$ " + montoAhorroViumi.ToString("N0"),

                AhorroNave = "$ " + resultadosnave.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroNave = "↓" + porcentajeAhorroNave.ToString("F2") + "%",
                MontoAhorroNave = "$ " + montoAhorroNave.ToString("N0"),

                // Mostrar el NetoZoco con el menor valor entre totalNetoGeneral y totalNetoTransaccion
                NetoZoco = "$ " + netoZocoMenor.ToString("N0", culture),
                NetozocoTransaccion ="$ " + totalNetoTransaccion.ToString("N0", culture),
                totalbruto = "$ " + totalBrutoGeneral.ToString("N0", culture),
                FechaComparacion = fechacomparacion
            };


            // Agregar estos valores al resultado final
            return Ok(resultado);



        }


        private static List<DetalleCuota> GetCostoTarjeta(List<ListaCuotum> listaCuotum, string tipoTarjeta, string cuota, string usuario)
        {
            List<DetalleCuota> detalles = new List<DetalleCuota>();

            foreach (var item in listaCuotum)
            {
                if (item.Cuota == cuota)
                {
                    string? costoSeleccionado = null;
                    string tipoTarjetaLower = tipoTarjeta.ToLower();

                    if (tipoTarjetaLower.Contains("visa"))
                        costoSeleccionado = item.CostoVisaCredito;
                    else if (tipoTarjetaLower.Contains("american express") || tipoTarjetaLower.Contains("amex"))
                        costoSeleccionado = item.CostoAmericanExpressCredito;
                    else if (tipoTarjetaLower.Contains("mastercard"))
                        costoSeleccionado = item.CostoMastercardCredito;
                    else if (tipoTarjetaLower.Contains("argencard"))
                        costoSeleccionado = item.CostoArgencardCredito;
                    else if (tipoTarjetaLower.Contains("cabal"))
                        costoSeleccionado = item.CostoCabalCredito;
                    else if (tipoTarjetaLower.Contains("naranja"))
                        costoSeleccionado = item.CostoNaranjaCredito;
                    else costoSeleccionado = item.CostoVisaCredito;
                    // Obtener comisiones
                    string comision = item.Comision;
                    string iva = item.Iva;
                    string comisionMasIva = item.ComisionMasIva;

                    if (usuario == "11111111116")
                    {
                        if (cuota == "0")
                        {
                            comision = "2,528%";
                            iva = "0,672%";
                            comisionMasIva = "3,200%";
                        }
                        else
                        {
                            comision = "3,3338%";
                            iva = "0,8862%";
                            comisionMasIva = "4,2200%";

                            if (tipoTarjetaLower.Contains("naranja"))
                            {
                                // No se aplica costo adicional a Naranja
                            }
                            else
                            {
                                switch (cuota)
                                {
                                    case "3":
                                    case "13":
                                        costoSeleccionado = "9,01%";
                                        break;
                                    case "6":
                                    case "16":
                                        costoSeleccionado = "14,41%";
                                        break;
                                    case "9":
                                        costoSeleccionado = "19,38%";
                                        break;
                                    case "12":
                                        costoSeleccionado = "23,97%";
                                        break;
                                }
                            }
                        }
                    }

                    // Solo agregar si se encontró un costo válido
                    if (!string.IsNullOrEmpty(costoSeleccionado))
                    {
                        detalles.Add(new DetalleCuota
                        {
                            Id = item.Id,
                            Cuota = item.Cuota,
                            CodigoPosnet = item.CodigoPosnet,
                            CostoTarjeta = costoSeleccionado,
                            Comision = comision,
                            Iva = iva,
                            ComisionMasIva = comisionMasIva
                        });
                    }
                }
            }
            return detalles;
        }
        private static decimal SafeConvertPercentage(string percentage)
        {
            if (string.IsNullOrWhiteSpace(percentage) || percentage.TrimEnd('%').Equals("0"))
            {
                return 0m; // Si es nulo, vacío o "0%", retorna 0
            }

            try
            {
                // Intenta convertir primero con notación científica o formato decimal
                if (decimal.TryParse(percentage, System.Globalization.NumberStyles.Float,
                                     System.Globalization.CultureInfo.InvariantCulture, out decimal result))
                {
                    return Math.Round(result / 100m, 8, MidpointRounding.AwayFromZero); // Convierte porcentaje a decimal
                }

                // Si el valor no estaba en notación científica, aplica la lógica original
                return decimal.Parse(percentage.TrimEnd('%')) / 100m;
            }
            catch
            {
                return 0m; // Si algo falla, devuelve 0 para evitar errores
            }
        }


        public class Resultado
        {
            public string AhorroPayway { get; set; }
            public string PorcentajeAhorroPayway { get; set; }
            public string MontoAhorroPayway { get; set; } // Nuevo campo

            public string AhorroMercadoPago { get; set; }
            public string PorcentajeAhorroMercadoPago { get; set; }
            public string MontoAhorroMercadoPago { get; set; } // Nuevo campo

            public string AhorroNaranjaX { get; set; }
            public string PorcentajeAhorroNaranjaX { get; set; }
            public string MontoAhorroNaranjaX { get; set; } // Nuevo campo

            public string AhorroGetnet { get; set; }
            public string PorcentajeAhorroGetnet { get; set; }
            public string MontoAhorroGetnet { get; set; } // Nuevo campo

            public string AhorroViumi { get; set; }
            public string PorcentajeAhorroViumi { get; set; }
            public string MontoAhorroViumi { get; set; } // Nuevo campo

            public string AhorroNave { get; set; }
            public string PorcentajeAhorroNave { get; set; }
            public string MontoAhorroNave { get; set; } // Nuevo campo

            public string NetoZoco { get; set; }
            public string NetozocoTransaccion { get; set; }
            public string totalbruto { get; set; }
            public string FechaComparacion { get; set; }
        }




        public class PaywayResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }
        public class MercadopagoResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }
        public class GetnetResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }
        public class NaranjaXResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }
        public class ViumiResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }
        public class NaveResult
        {
            public double Cuotas { get; set; }
            public decimal BrutoPayway { get; set; }
            public decimal TotalDeducciones { get; set; }
            public decimal TotalADepositar { get; set; }
            public decimal TotalNetozoco { get; set; }
        }



    }
}
