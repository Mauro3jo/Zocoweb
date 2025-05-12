using AutoMapper;
using BLL.ImplementacionZoco;
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
    public class InicioAhorroController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IMapper _mapper;

        public InicioAhorroController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
        }
        [HttpPost("inicioahorro")]
        public async Task<ActionResult> InicioAhorro([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos.");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);

            DateTime fechaToken;
            if (string.IsNullOrEmpty(request.Fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(request.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now;
                }
            }

            // Obtener datos del mes actual
            var datos = await _baseService.DatosMesActual(usuarioEncontrado.usuario.Usuario1, fechaToken);

            if (datos == null || !datos.Any())
            {
                if (datos == null || !datos.Any())
                {
                    var resultadoVacio = new Resultado
                    {
                        AhorroPayway = "$ 0",
                        PorcentajeAhorroPayway = "↓0.00%",

                        AhorroMercadoPago = "$ 0",
                        PorcentajeAhorroMercadoPago = "↓0.00%",

                        AhorroNaranjaX = "$ 0",
                        PorcentajeAhorroNaranjaX = "↓0.00%",

                        AhorroGetnet = "$ 0",
                        PorcentajeAhorroGetnet = "↓0.00%",

                        AhorroViumi = "$ 0",
                        PorcentajeAhorroViumi = "↓0.00%",

                        AhorroNave = "$ 0",
                        PorcentajeAhorroNave = "↓0.00%",

                        NetoZoco = "$ 0"
                    };

                    return Ok(resultadoVacio);
                }
            }

            // Agrupar por cuotas y sumar los brutos
            var agrupados = datos
           .Where(d => d.Cuotas.HasValue && d.TotalBruto.HasValue && d.TotalConDescuentos.HasValue) // Validar nulos
           .GroupBy(d => d.Cuotas.Value) // Agrupar por cuotas
           .Select(g => new
           {
               Cuotas = g.Key,
               SumaTotalBruto = g.Sum(d => d.TotalBruto.Value),
               SumaTotalNeto = g.Sum(d => d.TotalConDescuentos.Value) // Nombre correcto de la propiedad
           })
           .ToList();

            // Lista para los resultados finales
            var resultados = new List<Resultado>();

            var resultadospayway = new List<PaywayResult>();
            var resultadosmercadopago = new List<MercadopagoResult>();
            var resultadosnaranjax = new List<NaranjaXResult>();
            var resultadosgetnet = new List<GetnetResult>();
            //resultadosviumi
            var resultadosviumi = new List<ViumiResult>();
            var resultadosnave = new List<NaveResult>();

            // Recorrer los datos agrupados y calcular deducciones
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

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias +  impuestodtocrto ;
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

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias +  impuestodtocrto ;
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

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias +  impuestodtocrto ;
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

                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto ;
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



            // Calcular el ahorro de Payway (para porcentaje)
            var ahorroRealPayway = resultadospayway.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Payway
            var porcentajeAhorroPayway = resultadospayway.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealPayway / resultadospayway.Sum(item => item.TotalNetozoco)) * 100
                : 0;

            // Calcular el ahorro de MercadoPago (para porcentaje)
            var ahorroRealMercadoPago = resultadosmercadopago.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de MercadoPago
            var porcentajeAhorroMercadoPago = resultadosmercadopago.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealMercadoPago / resultadosmercadopago.Sum(item => item.TotalNetozoco)) * 100
                : 0;

            // Calcular el ahorro de NaranjaX (para porcentaje)
            var ahorroRealNaranjaX = resultadosnaranjax.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de NaranjaX
            var porcentajeAhorroNaranjaX = resultadosnaranjax.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealNaranjaX / resultadosnaranjax.Sum(item => item.TotalNetozoco)) * 100
                : 0;

            // Calcular el ahorro de Getnet (para porcentaje)
            var ahorroRealGetnet = resultadosgetnet.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Getnet
            var porcentajeAhorroGetnet = resultadosgetnet.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealGetnet / resultadosgetnet.Sum(item => item.TotalNetozoco)) * 100
                : 0;

            // Calcular el ahorro de Viumi (para porcentaje)
            var ahorroRealViumi = resultadosviumi.Sum(item =>
                item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Viumi
            var porcentajeAhorroViumi = resultadosviumi.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealViumi / resultadosviumi.Sum(item => item.TotalNetozoco)) * 100
                : 0;
            var ahorroRealNave = resultadosnave.Sum(item =>
    item.TotalNetozoco - item.TotalADepositar);

            // Calcular el porcentaje de ahorro de Nave
            var porcentajeAhorroNave = resultadosnave.Sum(item =>
                item.TotalNetozoco) != 0
                ? (ahorroRealNave / resultadosnave.Sum(item => item.TotalNetozoco)) * 100
                : 0;
            // Crear el resultado final con valores formateados
            var resultado = new Resultado
            {
                // Usamos TotalADepositar en lugar del cálculo anterior de ahorro
                AhorroPayway = "$ " + resultadospayway.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroPayway = "↓" + porcentajeAhorroPayway.ToString("F2") + "%",

                AhorroMercadoPago = "$ " + resultadosmercadopago.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroMercadoPago = "↓" + porcentajeAhorroMercadoPago.ToString("F2") + "%",

                AhorroNaranjaX = "$ " + resultadosnaranjax.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroNaranjaX = "↓" + porcentajeAhorroNaranjaX.ToString("F2") + "%",

                AhorroGetnet = "$ " + resultadosgetnet.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroGetnet = "↓" + porcentajeAhorroGetnet.ToString("F2") + "%",

                AhorroViumi = "$ " + resultadosviumi.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroViumi = "↓" + porcentajeAhorroViumi.ToString("F2") + "%",

                AhorroNave = "$ " + resultadosnave.Sum(item => item.TotalADepositar).ToString("N0"),
                PorcentajeAhorroNave = "↓" + porcentajeAhorroNave.ToString("F2") + "%",

                NetoZoco = "$ " + resultadosviumi.Sum(item => item.TotalNetozoco).ToString("N0")
            };

            // Devolver el resultado
            return Ok(resultado);







        }
        public class Resultado
        {
            public string AhorroPayway { get; set; }
            public string PorcentajeAhorroPayway { get; set; }
            public string AhorroMercadoPago { get; set; }
            public string PorcentajeAhorroMercadoPago { get; set; }
            public string AhorroNaranjaX { get; set; }
            public string PorcentajeAhorroNaranjaX { get; set; }
            public string AhorroGetnet { get; set; } // Nuevo campo
            public string PorcentajeAhorroGetnet { get; set; } // Nuevo campo
            public string AhorroViumi { get; set; } // Nuevo campo
            public string PorcentajeAhorroViumi { get; set; } // Nuevo campo
            public string AhorroNave { get; set; } // Nuevo campo
            public string PorcentajeAhorroNave { get; set; } // Nuevo campo
            public string NetoZoco { get; set; }
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
