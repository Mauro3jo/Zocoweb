using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using dash_aliados.Models.ViewModelsZoco;
using System.Globalization;
using Irony.Parsing;
using System.Threading;
using Org.BouncyCastle.Asn1.Ocsp;
using AutoMapper;
using BLL.InterfacesZoco;
using System.Runtime.InteropServices;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using System.Net;
using DocumentFormat.OpenXml.Office2013.Excel;
using BLL.ImplementacionZoco;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalculadoraController : ControllerBase

    {
        private readonly ICalculadoraService _CalculadoraService;
        private readonly ITokenService _tokenService;
        private readonly ITokenCajeroService _tokenCajeroService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly IUsuarioCajeroService _usuaarioCajeroService;
        private readonly IBaseDashboardService _baseService;

        private readonly IMapper _mapper;

        public CalculadoraController(IUsuarioZocoService usuarioZocoService,ICalculadoraService calculadoraService,
            ITokenService tokenService, IMapper mapper,IBaseDashboardService baseDashboardService, ITokenCajeroService tokenCajeroService, IUsuarioCajeroService usuarioCajeroService)
        {
            _CalculadoraService = calculadoraService;
            _usuarioZocoService = usuarioZocoService;
            _tokenService = tokenService;
            _mapper = mapper;
            _baseService = baseDashboardService;
            _usuaarioCajeroService = usuarioCajeroService;
            _tokenCajeroService = tokenCajeroService;

        }
        [HttpPost("calculadora")]
        public async Task<IActionResult> CalcularAsync([FromBody] VMCalculadora calculadora)
        {
            Func<decimal, string> formatMonto = (monto) =>
            {
                if (monto == Math.Floor(monto))
                {
                    return monto.ToString("C2");
                }
                else
                {
                    return monto.ToString("C2");
                }
            };

            bool esTokenValido = await _tokenService.ValidarTokenAsync(calculadora.Token);
            var usuario = "";
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(calculadora.Token);
                usuario = usuarioEncontrado.usuario.Usuario1;
            }
            var listacuota = await _CalculadoraService.ListaCuota();

            if (!int.TryParse(calculadora.Cuota, out int cuota))
            {
                return BadRequest("La cuota proporcionada no es un número válido.");
            }

            decimal costoVisaCreditoDecimal = 0;

            if (cuota != 1)
            {
                var cuotaEncontrada = listacuota.FirstOrDefault(c => c.Cuota == cuota.ToString());

                if (cuotaEncontrada != null)
                {
                    if (decimal.TryParse(cuotaEncontrada.CostoVisaCredito.TrimEnd('%'), NumberStyles.Any, CultureInfo.InvariantCulture, out decimal costoVisaCredito))
                    {
                        costoVisaCreditoDecimal = costoVisaCredito / 100;
                    }
                }
            }

            if (calculadora.Competencia == "payway" && calculadora.TipoPago == "debito")
            {
             var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var arancel = monto * 0.008m;
                var ivaSobreArancel = arancel * 0.21m; 
                var percepcionesIva = arancel * 0.03m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.005m;
                //var retencionesGcias = monto * 0.005m;
                var retencionesIva = 0m;
                var retencionesGcias =0m;
                var impuestodtocrto = monto * 0.006m;
                var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + retencionesIva + retencionesGcias+ impuestodtocrto;
                var totalADepositar = monto - totalDeducciones;

            

                var payway = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0,8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },

    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionesIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,49504%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%"},
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%"}
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 2.545454545m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0319m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 2.863636364m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 2.545454545m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si vmcalculadora.zoco no es 1, 2 o 3
                    }
                }
                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.005m;
                //var retencionesIvaZoco = arancelZoco * 0.005m;
                //var retencionesGciasZoco = arancelZoco * 0.005m; 
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;
                
                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;

             
                var zoco = new[]
                {
                    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
                    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "3,19%" },
                    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "0,6699%" },
                    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                    new { Nombre = "PERCEPCIONES IVA", Monto ="-", Porcentaje = "-" },
                    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,11165%" },
                    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,0957%" },
                    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0319%" },


                     new { Nombre = "TOTAL DEDUCCIONES",Monto = formatMonto(totalDeduccionesZoco),  Porcentaje = monto != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%"},
                   new {  Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco),  Porcentaje = monto != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%"}
                };
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);
              
                if (terminales == 0)
                {
                    terminales = 1;

                }
                var costospayway = 24179.20* terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco -totalADepositar )/ totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes= pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }


            if (calculadora.Competencia == "mercadopago" && calculadora.TipoPago == "debito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var arancel = monto * 0.0325m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.005m;
                //var retencionesGcias = monto * 0.005m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;

                var totalDeducciones = arancel + ivaSobreArancel  + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                var totalADepositar = monto - totalDeducciones;
            
                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS ", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0,8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,49504%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%"},
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%"}
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 2.545454545m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0319m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 2.863636364m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 2.545454545m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si vmcalculadora.zoco no es 1, 2 o 3
                    }
                }
                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.005m;
                //var retencionesIvaZoco = arancelZoco * 0.005m;
                //var retencionesGciasZoco = arancelZoco * 0.005m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;

                var zoco = new[]
       {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "3,19%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "0,6699%" },
    new { Nombre = "COSTO TRANSC. DEBITO/CREDITO", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,11165%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,0957%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0319%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);
               
                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 30000* terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }


            if (calculadora.Competencia == "naranjax" && calculadora.TipoPago == "debito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var arancel = monto * 0.0315m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.035m;
                var percepcionIBB= arancel * 0.035m;
                var percepcionIva = arancel * 0.03m;

                //var retencionesIva = (monto -arancel - ivaSobreArancel -percepcionIBB - percepcionIva)* 0.03m;
                //var retencionesGcias = (monto - arancel - ivaSobreArancel - percepcionIBB - percepcionIva) * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.012m;

                var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                var totalADepositar = monto - totalDeducciones;

                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS ", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0,8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,49504%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%"},
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%"}
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 2.545454545m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0319m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 2.863636364m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 2.545454545m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si vmcalculadora.zoco no es 1, 2 o 3
                    }
                }
                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.005m;
                //var retencionesIvaZoco = arancelZoco * 0.005m;
                //var retencionesGciasZoco = arancelZoco * 0.005m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;

                var zoco = new[]
       {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "3,19%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "0,6699%" },
    new { Nombre =  "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,11165%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,0957%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0319%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 0 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }


            if (calculadora.Competencia == "getnet" && calculadora.TipoPago == "debito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var arancel = monto * 0.0319m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.005m;
                //var retencionesGcias = monto * 0.005m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;

                var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                var totalADepositar = monto - totalDeducciones;

                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS ", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0,8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,49504%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%"},
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%"}
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 2.545454545m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0319m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 2.863636364m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 2.545454545m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si vmcalculadora.zoco no es 1, 2 o 3
                    }
                }
                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.005m;
                //var retencionesIvaZoco = arancelZoco * 0.005m;
                //var retencionesGciasZoco = arancelZoco * 0.005m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;

                var zoco = new[]
       {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "3,19%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "0,6699%" },
    new { Nombre =  "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,11165%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,0957%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0319%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 0 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }


            if (calculadora.Competencia == "viumi" && calculadora.TipoPago == "debito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var arancel = monto * 0.023m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.005m;
                //var retencionesGcias = monto * 0.005m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;

                var totalDeducciones = arancel + ivaSobreArancel + retencionesIibb + retencionesIva + retencionesGcias + impuestodtocrto;
                var totalADepositar = monto - totalDeducciones;

                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS ", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0,8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,49504%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%"},
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%"}
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 2.545454545m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0319m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 2.863636364m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 2.545454545m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si vmcalculadora.zoco no es 1, 2 o 3
                    }
                }
                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.005m;
                //var retencionesIvaZoco = arancelZoco * 0.005m;
                //var retencionesGciasZoco = arancelZoco * 0.005m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;

                var zoco = new[]
       {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "3,19%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "0,6699%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,11165%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,0957%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0319%" },
    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 25000 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }





            if (calculadora.Competencia == "mercadopago" && calculadora.TipoPago == "credito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var costofinanciero = 0.0m;
                var costoAnticipo = 0.0m;
                if (cuota == 1)
                {
                    costoAnticipo = monto * 0.0m;
                }
                else if (cuota == 3)
                {
                    costofinanciero = monto * 0.071027m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 6)
                {
                    costofinanciero = monto * 0.135036m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 9)
                {
                    costofinanciero = monto * 0.366025m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 12)
                {
                    costofinanciero = monto * 0.44649m;
                    //costoAnticipo = monto * 0.0653m;
                }
                var arancel = monto * 0.0629m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.03m;
                //var retencionesGcias = monto * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;
                var costofinancieroiva = 0m;
                var percepcionesIva = monto * 0.0m;
                var costoanticipoiva = 0m;

                var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                var totalADepositar = monto - totalDeducciones;
                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0.8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
                        new { Nombre = "COSTO FINANCIERO", Monto = formatMonto(costofinanciero), Porcentaje = "-" },
                        new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costofinancieroiva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipo), Porcentaje = "7,11%" },
             new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoanticipoiva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionesIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,97768%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%" }
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                decimal costoAnticipoZoco = 0.0m;
                decimal costofinancierozoco = 0.0m;
                decimal costoAnticipoZocoIva = 0.0m;
                decimal costoFinancieroZocoIva = 0.0m;

                // Determinar arancelZoco
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 3.834710744m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0499m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 4.479338843m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 3.834710744m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si calculadora.Zoco no es 1, 2 o 3
                    }
                }

                // Determinar costoAnticipoZoco y costofinancierozoco
                if (calculadora.Zoco == 1)
                {
                    if (cuota != 1)
                    {
                        // Porcentaje base ya con IVA incluido
                        decimal porcentajeCalculo = costoVisaCreditoDecimal / 100;

                        // Separar el porcentaje en sin IVA y solo IVA
                        decimal porcentajeBaseSinIva = porcentajeCalculo / 1.21m; // Divides por 1.21 para excluir el IVA
                        decimal porcentajeIva = porcentajeCalculo - porcentajeBaseSinIva; // Calculas la parte del IVA

                        // Calcular el costo financiero sin IVA (reutilizando la variable existente)
                        costofinancierozoco = montoZoco * porcentajeBaseSinIva;

                        // Calcular la parte correspondiente al IVA (reutilizando la variable existente)
                        costoFinancieroZocoIva = montoZoco * porcentajeIva;


                        costoAnticipoZoco = montoZoco * 4.72m / 100;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;
                    }

                    if (cuota == 1)
                    {
                        //  costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0319m; 2,7104
                        costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0224m;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;

                    }
                }
                else if (calculadora.Zoco == 2)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 3.03m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 12.53m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 18.22m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 23.47m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 28.32m / 100;
                    }
                }
                else if (calculadora.Zoco == 3)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 2.87m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 11.87m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 17.27m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 22.24m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 26.83m / 100;
                    }
                }

                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.035m;
                //var retencionesIvaZoco = arancelZoco * 0.03m;
                //var retencionesGciasZoco = arancelZoco * 0.01m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco + costoAnticipoZoco + costofinancierozoco + costoFinancieroZocoIva + costoAnticipoZocoIva;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;
                var zoco = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "4,99%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "1,0479%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                  new { Nombre = "COSTO FINANCIERO", Monto =  formatMonto(costofinancierozoco), Porcentaje = "-" },
                       new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costoFinancieroZocoIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZoco), Porcentaje = "12,24%" },
         new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZocoIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = "-", Porcentaje = "-" },

    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,17465%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,1497%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0499%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);
                if (terminales == 0)
                {
                    terminales = 1;

                }
                var costomercadopago = 30000 * terminales;
                var poranio = costomercadopago * 12;
                decimal porcentaje = 0;

                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costomercadopago,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }
    
            /////////////////////////////////////////////////////////////////////////////
            if (calculadora.Competencia == "payway" && calculadora.TipoPago == "credito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var costofinanciero = 0.0m;
                var costoAnticipo = 0.0m;
                var costoFinancieroPaywayIva = 0.0m;
                var costoAnticipoPaywayIva = 0.0m;
                if(cuota == 1)
                {
                    // costoAnticipo = monto * 0.0653m; //5,3361
                    costoAnticipo = monto * 0.0441m;
                    costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                }
                else if (cuota == 3)
                {
                    //costofinanciero = monto * 0.0666m; 5,9048

                    costofinanciero = monto * 0.0488m;
                    costoFinancieroPaywayIva = costofinanciero * 0.21m;
                    // costoAnticipo = monto * 0.0653m; //6,0984
                    costoAnticipo = monto * 0.0504m;
                    costoAnticipoPaywayIva = costoAnticipo * 0.21m;


                }
                else if (cuota == 6)
                {
                    // costofinanciero = monto * 0.1265m; //11,3014 9,34

                    costofinanciero = monto * 0.0934m; 
                    costoFinancieroPaywayIva = costofinanciero * 0.21m;

                    //costoAnticipo = monto * 0.0653m;
                    costoAnticipo = monto * 0.0504m;
                    costoAnticipoPaywayIva = costoAnticipo * 0.21m;

                }
                else if (cuota == 9)
                {
                    // costofinanciero = monto * 0.1818m; //16,3592 13,52


                    costofinanciero = monto * 0.1352m;
                    costoFinancieroPaywayIva = costofinanciero * 0.21m;

                    //costoAnticipo = monto * 0.0653m;
                    costoAnticipo = monto * 0.0504m;
                    costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                }
                else if (cuota == 12)
                {
                    //   costofinanciero = monto * 0.2328m; ///21,0903 17,43

                    costofinanciero = monto * 0.1743m;
                    costoFinancieroPaywayIva = costofinanciero * 0.21m;

                    //costoAnticipo = monto * 0.0653m;
                    costoAnticipo = monto * 0.0504m;
                    costoAnticipoPaywayIva = costoAnticipo * 0.21m;
                }
                var arancel = monto * 0.018m;
                var ivaSobreArancel = arancel * 0.21m;
                var percepcionesIva = arancel * 0.03m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.03m;
                //var retencionesGcias = monto * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;

                var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero+costoAnticipoPaywayIva+ costoFinancieroPaywayIva;
                var totalADepositar = monto - totalDeducciones;
              
                var payway = new[]
 {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0.8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
                        new { Nombre = "COSTO FINANCIERO", Monto = formatMonto(costofinanciero), Porcentaje = "-" },
                        new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costoFinancieroPaywayIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipo), Porcentaje = "7,11%" },
     new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoPaywayIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionesIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,97768%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%" }
}; 
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                decimal costoAnticipoZoco = 0.0m;
                decimal costofinancierozoco = 0.0m;
                decimal costoAnticipoZocoIva = 0.0m;
                decimal costoFinancieroZocoIva = 0.0m;

                // Determinar arancelZoco
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 3.834710744m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0499m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 4.479338843m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 3.834710744m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si calculadora.Zoco no es 1, 2 o 3
                    }
                }

                // Determinar costoAnticipoZoco y costofinancierozoco
                if (calculadora.Zoco == 1)
                {
                    if (cuota != 1)
                    {
                        // Porcentaje base ya con IVA incluido
                        decimal porcentajeCalculo = costoVisaCreditoDecimal / 100;

                        // Separar el porcentaje en sin IVA y solo IVA
                        decimal porcentajeBaseSinIva = porcentajeCalculo / 1.21m; // Divides por 1.21 para excluir el IVA
                        decimal porcentajeIva = porcentajeCalculo - porcentajeBaseSinIva; // Calculas la parte del IVA

                        // Calcular el costo financiero sin IVA (reutilizando la variable existente)
                        costofinancierozoco = montoZoco * porcentajeBaseSinIva;

                        // Calcular la parte correspondiente al IVA (reutilizando la variable existente)
                        costoFinancieroZocoIva = montoZoco * porcentajeIva;


                        costoAnticipoZoco = montoZoco * 4.72m / 100;
                        costoAnticipoZocoIva = costoAnticipoZoco *0.21m;
                    }

                    if (cuota == 1)
                    {
                        //  costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0319m; 2,7104
                        costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0224m;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;

                    }
                }
                else if (calculadora.Zoco == 2)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 3.03m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 12.53m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 18.22m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 23.47m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 28.32m / 100;
                    }
                }
                else if (calculadora.Zoco == 3)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 2.87m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 11.87m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 17.27m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 22.24m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 26.83m / 100;
                    }
                }

                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.035m;
                //var retencionesIvaZoco = arancelZoco * 0.03m;
                //var retencionesGciasZoco = arancelZoco * 0.01m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco + costoAnticipoZoco + costofinancierozoco + costoFinancieroZocoIva + costoAnticipoZocoIva;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;
                var zoco = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "4,99%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "1,0479%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                  new { Nombre = "COSTO FINANCIERO", Monto =  formatMonto(costofinancierozoco), Porcentaje = "-" },
                       new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costoFinancieroZocoIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZoco), Porcentaje = "12,24%" },
         new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZocoIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = "-", Porcentaje = "-" },

    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,17465%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,1497%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0499%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);
                if (terminales == 0)
                {
                    terminales = 1;

                }
                var costospayway = 24179.20 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;

                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }
            /////////
            //////////
            ///////////
            /////////////
            ///

            /////////
            if (calculadora.Competencia == "naranjax" && calculadora.TipoPago == "credito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var costofinanciero = 0.0m;
                var costoAnticipo = 0.0m;
                if (cuota == 1)
                {
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 3)
                {
                    costofinanciero = monto * 0.071027m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 6)
                {
                    costofinanciero = monto * 0.135036m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 9)
                {
                    costofinanciero = monto * 0.581647m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 12)
                {
                    costofinanciero = monto * 0.828971m;
                    //costoAnticipo = monto * 0.0653m;
                }
                var arancel = monto * 0.0579m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                var percepcionIBB = arancel * 0.035m;
                var percepcionIva = arancel * 0.03m;

                //var retencionesIva = (monto - arancel - ivaSobreArancel - percepcionIBB - percepcionIva) * 0.03m;
                //var retencionesGcias = (monto - arancel - ivaSobreArancel - percepcionIBB - percepcionIva) * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.012m;
                var costoanticipoiva = 0.0m;
                var costofinancieroiva = 0.0m;

                var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                var totalADepositar = monto - totalDeducciones;
                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0.8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
                        new { Nombre = "COSTO FINANCIERO", Monto = formatMonto(costofinanciero), Porcentaje = "-" },
                                               new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costofinancieroiva), Porcentaje = "-" },


    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipo), Porcentaje = "7,11%" },
             new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoanticipoiva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,97768%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%" }
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                decimal costoAnticipoZoco = 0.0m;
                decimal costofinancierozoco = 0.0m;
                decimal costoAnticipoZocoIva = 0.0m;
                decimal costoFinancieroZocoIva = 0.0m;

                // Determinar arancelZoco
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 3.834710744m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0499m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 4.479338843m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 3.834710744m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si calculadora.Zoco no es 1, 2 o 3
                    }
                }

                // Determinar costoAnticipoZoco y costofinancierozoco
                if (calculadora.Zoco == 1)
                {
                    if (cuota != 1)
                    {
                        // Porcentaje base ya con IVA incluido
                        decimal porcentajeCalculo = costoVisaCreditoDecimal / 100;

                        // Separar el porcentaje en sin IVA y solo IVA
                        decimal porcentajeBaseSinIva = porcentajeCalculo / 1.21m; // Divides por 1.21 para excluir el IVA
                        decimal porcentajeIva = porcentajeCalculo - porcentajeBaseSinIva; // Calculas la parte del IVA

                        // Calcular el costo financiero sin IVA (reutilizando la variable existente)
                        costofinancierozoco = montoZoco * porcentajeBaseSinIva;

                        // Calcular la parte correspondiente al IVA (reutilizando la variable existente)
                        costoFinancieroZocoIva = montoZoco * porcentajeIva;


                        costoAnticipoZoco = montoZoco * 4.72m / 100;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;
                    }

                    if (cuota == 1)
                    {
                        //  costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0319m; 2,7104
                        costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0224m;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;

                    }
                }
                else if (calculadora.Zoco == 2)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 3.03m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 12.53m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 18.22m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 23.47m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 28.32m / 100;
                    }
                }
                else if (calculadora.Zoco == 3)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 2.87m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 11.87m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 17.27m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 22.24m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 26.83m / 100;
                    }
                }

                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.035m;
                //var retencionesIvaZoco = arancelZoco * 0.03m;
                //var retencionesGciasZoco = arancelZoco * 0.01m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco + costoAnticipoZoco + costofinancierozoco + costoFinancieroZocoIva + costoAnticipoZocoIva;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;
                var zoco = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "4,99%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "1,0479%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                  new { Nombre = "COSTO FINANCIERO", Monto =  formatMonto(costofinancierozoco), Porcentaje = "-" },
                       new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoFinancieroZocoIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZoco), Porcentaje = "12,24%" },
         new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZocoIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = "-", Porcentaje = "-" },

    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,17465%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,1497%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0499%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 0 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }
            ////////////////////////////////////////////////////////////////////////////

            if (calculadora.Competencia == "getnet" && calculadora.TipoPago == "credito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var costofinanciero = 0.0m;
                var costoAnticipo = 0.0m;
                if (cuota == 1)
                {
                    costoAnticipo = monto * 0.047432m;
                }
                else if (cuota == 3)
                {
                    costofinanciero = monto * 0.071027m;
                    costoAnticipo = monto * 0.07319m;
                }
                else if (cuota == 6)
                {
                    costofinanciero = monto * 0.135036m;
                    costoAnticipo = monto * 0.07319m;
                }
                else if (cuota == 9)
                {
                    costofinanciero = monto * 0.36905m;
                    costoAnticipo = monto * 0.047432m;
                }
                else if (cuota == 12)
                {
                    costofinanciero = monto * 0.450725m;
                    costoAnticipo = monto * 0.047432m;
                }
                var arancel = monto * 0.02m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.03m;
                //var retencionesGcias = monto * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;
                // var costoAnticipo =  monto * 0.052795m;
                var percepcionIva = arancel * 0.00m;
                var costoanticipoiva = 0.0m;
                var costofinancieroiva = 0.0m;

                var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                var totalADepositar = monto - totalDeducciones;
                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0.8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
                        new { Nombre = "COSTO FINANCIERO", Monto = formatMonto(costofinanciero), Porcentaje = "-" },
                            new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costofinancieroiva), Porcentaje = "-" },

                                                   
    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipo), Porcentaje = "7,11%" },
     new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoanticipoiva), Porcentaje = "-" },
    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,97768%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%" }
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                decimal costoAnticipoZoco = 0.0m;
                decimal costofinancierozoco = 0.0m;
                decimal costoAnticipoZocoIva = 0.0m;
                decimal costoFinancieroZocoIva = 0.0m;

                // Determinar arancelZoco
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 3.834710744m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0499m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 4.479338843m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 3.834710744m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si calculadora.Zoco no es 1, 2 o 3
                    }
                }

                // Determinar costoAnticipoZoco y costofinancierozoco
                if (calculadora.Zoco == 1)
                {
                    if (cuota != 1)
                    {
                        // Porcentaje base ya con IVA incluido
                        decimal porcentajeCalculo = costoVisaCreditoDecimal / 100;

                        // Separar el porcentaje en sin IVA y solo IVA
                        decimal porcentajeBaseSinIva = porcentajeCalculo / 1.21m; // Divides por 1.21 para excluir el IVA
                        decimal porcentajeIva = porcentajeCalculo - porcentajeBaseSinIva; // Calculas la parte del IVA

                        // Calcular el costo financiero sin IVA (reutilizando la variable existente)
                        costofinancierozoco = montoZoco * porcentajeBaseSinIva;

                        // Calcular la parte correspondiente al IVA (reutilizando la variable existente)
                        costoFinancieroZocoIva = montoZoco * porcentajeIva;


                        costoAnticipoZoco = montoZoco * 4.72m / 100;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;
                    }

                    if (cuota == 1)
                    {
                        //  costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0319m; 2,7104
                        costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0224m;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;

                    }
                }
                else if (calculadora.Zoco == 2)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 3.03m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 12.53m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 18.22m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 23.47m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 28.32m / 100;
                    }
                }
                else if (calculadora.Zoco == 3)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 2.87m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 11.87m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 17.27m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 22.24m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 26.83m / 100;
                    }
                }

                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.035m;
                //var retencionesIvaZoco = arancelZoco * 0.03m;
                //var retencionesGciasZoco = arancelZoco * 0.01m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco + costoAnticipoZoco + costofinancierozoco + costoFinancieroZocoIva + costoAnticipoZocoIva;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;
                var zoco = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "4,99%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "1,0479%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                  new { Nombre = "COSTO FINANCIERO", Monto =  formatMonto(costofinancierozoco), Porcentaje = "-" },
                       new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoFinancieroZocoIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZoco), Porcentaje = "12,24%" },
         new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZocoIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = "-", Porcentaje = "-" },

    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,17465%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,1497%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0499%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 0 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }

            ////////////////////////////////////////////////////////////////////////////
            if (calculadora.Competencia == "viumi" && calculadora.TipoPago == "credito")
            {
                var monto = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                var costofinanciero = 0.0m;
                var costoAnticipo = 0.0m;
                if (cuota == 1)
                {
                    costoAnticipo = monto * 0.0m; // No hay costo de anticipo para cuota 1
                }
                else if (cuota == 3)
                {
                    costofinanciero = monto * 0.071027m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 6)
                {
                    costofinanciero = monto * 0.135036m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 9)
                {
                    costofinanciero = monto * 0.3751m;
                    //costoAnticipo = monto * 0.0653m;
                }
                else if (cuota == 12)
                {
                    costofinanciero = monto * 0.4598m;
                }
                    var arancel = monto * 0.0519m;
                var ivaSobreArancel = arancel * 0.21m;
                var retencionesIibb = monto * 0.05m;
                //var retencionesIva = monto * 0.03m;
                //var retencionesGcias = monto * 0.01m;
                var retencionesIva = 0m;
                var retencionesGcias = 0m;
                var impuestodtocrto = monto * 0.006m;

                var percepcionIva = arancel * 0.00m;
                var costoanticipoiva = 0.0m;
                var costofinancieroiva = 0.0m;

                var totalDeducciones = arancel + ivaSobreArancel + percepcionIva + retencionesIibb + retencionesIva + retencionesGcias + costoAnticipo + impuestodtocrto + costofinanciero;
                var totalADepositar = monto - totalDeducciones;
                var payway = new[]
  {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(monto), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancel), Porcentaje = "0.8%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancel), Porcentaje = "0,168%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrto), Porcentaje = "0,6%" },
                        new { Nombre = "COSTO FINANCIERO", Monto = formatMonto(costofinanciero), Porcentaje = "-" },
                                                new { Nombre = "IVA COSTO FINANCIERO", Monto = formatMonto(costofinancieroiva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipo), Porcentaje = "7,11%" },
                                                    new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoanticipoiva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = formatMonto(percepcionIva), Porcentaje = "0,024%" },
    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibb), Porcentaje = "5%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIva), Porcentaje = "0,49504%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGcias), Porcentaje = "0,97768%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeducciones), Porcentaje = monto != 0 ? $"{(totalDeducciones / monto * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositar), Porcentaje = monto != 0 ? $"{(totalADepositar / monto * 100).ToString("N2")}%": "0.00%" }
};
                var montoZoco = decimal.Parse(calculadora.Monto, CultureInfo.InvariantCulture);
                decimal arancelZoco;
                decimal costoAnticipoZoco = 0.0m;
                decimal costofinancierozoco = 0.0m;
                decimal costoAnticipoZocoIva = 0.0m;
                decimal costoFinancieroZocoIva = 0.0m;

                // Determinar arancelZoco
                if (usuario == "11111111116")
                {
                    arancelZoco = montoZoco * 3.834710744m / 100;
                }
                else
                {
                    if (calculadora.Zoco == 1)
                    {
                        arancelZoco = montoZoco * 0.0499m;
                    }
                    else if (calculadora.Zoco == 2)
                    {
                        arancelZoco = montoZoco * 4.479338843m / 100;
                    }
                    else if (calculadora.Zoco == 3)
                    {
                        arancelZoco = montoZoco * 3.834710744m / 100;
                    }
                    else
                    {
                        arancelZoco = montoZoco * 0.0319m; // Valor por defecto si calculadora.Zoco no es 1, 2 o 3
                    }
                }

                // Determinar costoAnticipoZoco y costofinancierozoco
                if (calculadora.Zoco == 1)
                {
                    if (cuota != 1)
                    {
                        // Porcentaje base ya con IVA incluido
                        decimal porcentajeCalculo = costoVisaCreditoDecimal / 100;

                        // Separar el porcentaje en sin IVA y solo IVA
                        decimal porcentajeBaseSinIva = porcentajeCalculo / 1.21m; // Divides por 1.21 para excluir el IVA
                        decimal porcentajeIva = porcentajeCalculo - porcentajeBaseSinIva; // Calculas la parte del IVA

                        // Calcular el costo financiero sin IVA (reutilizando la variable existente)
                        costofinancierozoco = montoZoco * porcentajeBaseSinIva;

                        // Calcular la parte correspondiente al IVA (reutilizando la variable existente)
                        costoFinancieroZocoIva = montoZoco * porcentajeIva;


                        costoAnticipoZoco = montoZoco * 4.72m / 100;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;
                    }

                    if (cuota == 1)
                    {
                        //  costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0319m; 2,7104
                        costoAnticipoZoco = (usuario == "11111111116") ? montoZoco * 0.0286m : montoZoco * 0.0224m;
                        costoAnticipoZocoIva = costoAnticipoZoco * 0.21m;

                    }
                }
                else if (calculadora.Zoco == 2)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 3.03m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 12.53m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 18.22m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 23.47m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 28.32m / 100;
                    }
                }
                else if (calculadora.Zoco == 3)
                {
                    if (cuota == 1)
                    {
                        costoAnticipoZoco = montoZoco * 2.87m / 100;
                    }
                    else if (cuota == 3)
                    {
                        costofinancierozoco = montoZoco * 11.87m / 100;
                    }
                    else if (cuota == 6)
                    {
                        costofinancierozoco = montoZoco * 17.27m / 100;
                    }
                    else if (cuota == 9)
                    {
                        costofinancierozoco = montoZoco * 22.24m / 100;
                    }
                    else if (cuota == 12)
                    {
                        costofinancierozoco = montoZoco * 26.83m / 100;
                    }
                }

                var ivaSobreArancelZoco = arancelZoco * 0.21m;
                var retencionesIibbZoco = arancelZoco * 0.035m;
                //var retencionesIvaZoco = arancelZoco * 0.03m;
                //var retencionesGciasZoco = arancelZoco * 0.01m;
                var retencionesIvaZoco = 0m;
                var retencionesGciasZoco = 0m;
                var impuestodtocrtoZoco = montoZoco * 0.012m;

                var totalDeduccionesZoco = arancelZoco + ivaSobreArancelZoco + retencionesIibbZoco + retencionesIvaZoco + retencionesGciasZoco + impuestodtocrtoZoco + costoAnticipoZoco + costofinancierozoco + costoFinancieroZocoIva + costoAnticipoZocoIva;
                var totalADepositarZoco = montoZoco - totalDeduccionesZoco;
                var zoco = new[]
                {
    new { Nombre = "VENTAS BRUTAS", Monto = formatMonto(montoZoco), Porcentaje = "100%" },
    new { Nombre = "ARANCEL", Monto = formatMonto(arancelZoco), Porcentaje = "4,99%" },
    new { Nombre = "IVA SOBRE ARANCEL", Monto = formatMonto(ivaSobreArancelZoco), Porcentaje = "1,0479%" },
    new { Nombre = "COSTO TRANSC.", Monto = formatMonto(impuestodtocrtoZoco), Porcentaje = "1,5%" },
                  new { Nombre = "COSTO FINANCIERO", Monto =  formatMonto(costofinancierozoco), Porcentaje = "-" },
                       new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoFinancieroZocoIva), Porcentaje = "-" },

    new { Nombre = "COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZoco), Porcentaje = "12,24%" },
         new { Nombre = "IVA COSTO ANTICIPO", Monto = formatMonto(costoAnticipoZocoIva), Porcentaje = "-" },

    new { Nombre = "PERCEPCIONES IVA", Monto = "-", Porcentaje = "-" },

    new { Nombre = "RETENCIONES INGRESOS BRUTOS", Monto = formatMonto(retencionesIibbZoco), Porcentaje = "0,17465%" },
    //new { Nombre = "RETENCIONES IVA", Monto = formatMonto(retencionesIvaZoco), Porcentaje = "0,1497%" },
    //new { Nombre = "RETENCIONES GANANCIAS", Monto = formatMonto(retencionesGciasZoco), Porcentaje = "0,0499%" },

    new { Nombre = "TOTAL DEDUCCIONES", Monto = formatMonto(totalDeduccionesZoco), Porcentaje = montoZoco != 0 ? $"{(totalDeduccionesZoco / montoZoco * 100).ToString("N2")}%": "0.00%" },
    new { Nombre = "TOTAL A DEPOSITAR", Monto = formatMonto(totalADepositarZoco), Porcentaje = montoZoco != 0 ? $"{(totalADepositarZoco / montoZoco * 100).ToString("N2")}%": "0.00%" }
};
                var terminales = double.Parse(calculadora.Terminales, CultureInfo.InvariantCulture);

                if (terminales == 0)
                {
                    terminales = 1;

                }

                var costospayway = 25000 * terminales;
                var poranio = costospayway * 12;
                decimal porcentaje = 0;
                var montito = Convert.ToDecimal(calculadora.Monto);
                if (montito > 0)
                {
                    porcentaje = (((totalADepositarZoco - totalADepositar) / totalADepositarZoco) * 100);

                }


                var pormes = totalADepositarZoco - totalADepositar;
                var ahorro12 = pormes * 12;
                var resultado = new
                {
                    Payway = payway,
                    Zoco = zoco,
                    costopaywey = costospayway,
                    poraniopaywey = poranio,
                    pormes = pormes,
                    porcentaje = porcentaje,
                    poraniozoco = ahorro12,
                };
                return Ok(resultado);
            }




            return BadRequest("Las condiciones no se cumplen para realizar los cálculos.");
        }
        [HttpPost("calculadorausuarios")]
        public async Task<IActionResult> CalcularusuariosAsync([FromBody] VMCalculadoraUsuario calculadorausuarios)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(calculadorausuarios.Token);
            if (esTokenValido == false)
            {
                esTokenValido = await _tokenCajeroService.ValidarTokenAsync(calculadorausuarios.Token);
                if (!esTokenValido)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
                }
            }

            var usuarioResult = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(calculadorausuarios.Token);
            var usuarioCajeroResult = await _tokenCajeroService.ObtenerTokenYUsuarioPorUsuarioIdAsync(calculadorausuarios.Token);
            ///  var usuariocuit = await _usuarioZocoService.ObtenerPorId((int)usuarioCajeroResult.usuario.IdUsuario);
            // Si el primer usuario es null, usar el Cuit del usuarioCajero
            Usuario usuariocajeropadre = null;
            if (usuarioCajeroResult.usuario != null)
            {
                 usuariocajeropadre = await _usuarioZocoService.ObtenerPorId((int)usuarioCajeroResult.usuario.IdUsuario);

            }
            var usuario = usuarioResult.usuario?.Usuario1 ?? usuariocajeropadre.Usuario1;

            if (usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            
            var provinciacompleto = await _baseService.DatoProvincia(usuario);
            var listacuota = await _CalculadoraService.ListaCuota();
            var listaprovincia = await _CalculadoraService.ListaIIBBProvincia();
            var ListaImpostivia = await _CalculadoraService.ListaImpositiva();
            string provincia;

            if (provinciacompleto != null && provinciacompleto.Provincia != null)
            {
                provincia = provinciacompleto.Provincia;
            }
            else
            {
                provincia = "Vacio";
            }
            var alicuota = "0";
            var Ganancia = "0";
            var Iva = "0";
            var Debcred = "0";
            var nar = "0";
            decimal costoTarjeta = 0;
            decimal comisionMasIva =0;
            decimal comision = 0;

            decimal alicuotaFinal = 0;
                decimal gananciaFinal = 0;  
                decimal ivaFinal = 0;
            decimal debcredFinal = 0;
            decimal narFinal =0;
            decimal costoAnticipocredito = 0.0571m;
            decimal costoAnticipo = 0;
            decimal costoAnticipoIVA = 0m;
            decimal costoTarjetaIva = 0m; 
            var provinciaEncontrada = listaprovincia.FirstOrDefault(p => p.Provincia.ToLower() == provincia.ToLower());
            if (provinciaEncontrada != null)
            {
                alicuota = provinciaEncontrada.Alicuota;
            }
       

            if (Convert.ToInt32(calculadorausuarios.Cuota) == 0)
            {
                foreach (var impuesto in ListaImpostivia)
                {
                    if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "ganancia")
                    {
                        Ganancia = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "iva")
                    {
                        Iva = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                    {
                        Debcred = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                    {
                        nar = impuesto.Porcentaje;
                    }
                }

            }
            else if (Convert.ToInt32(calculadorausuarios.Cuota) == 1)
            {
                foreach (var impuesto in ListaImpostivia)
                {
                    if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "ganancia")
                    {
                        Ganancia = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "iva")
                    {
                        Iva = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                    {
                        Debcred = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                    {
                        nar = impuesto.Porcentaje;
                    }
                }
           
            }
            else
            {
                foreach (var impuesto in ListaImpostivia)
                {
                    if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "ganancia")
                    {
                        Ganancia = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "iva")
                    {
                        Iva = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                    {
                        Debcred = impuesto.Porcentaje;
                    }
                    else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                    {
                        nar = impuesto.Porcentaje;
                    }
                }

             
            }
            decimal monto = decimal.Parse(calculadorausuarios.Monto, CultureInfo.InvariantCulture);
            decimal bruto = decimal.Parse(calculadorausuarios.Monto, CultureInfo.InvariantCulture);
            decimal neto = decimal.Parse(calculadorausuarios.Monto, CultureInfo.InvariantCulture);
            decimal montofinal = 0;
            string cuota = "";
            string tipoTarjeta = calculadorausuarios.TipoTarjeta.ToLower();
            if (calculadorausuarios.TipoDebCred == "Debito")
            {
                cuota = "0";
            }
            else
            {
                cuota = calculadorausuarios.Cuota;
            }
            

            var costosTarjeta = GetCostoTarjeta(listacuota, tipoTarjeta, cuota,usuario);

            if (calculadorausuarios.TipoNetoBruto == "Bruto" && costosTarjeta.Count > 0)
            {
                var detalle = costosTarjeta.First(); 
                decimal ConvertPercentageToDecimalWithZeroCheck(string percentage)
                {
                    if (string.IsNullOrWhiteSpace(percentage) || percentage.TrimEnd('%').Equals("0"))
                    {
                        return 0m; 
                    }
                    return decimal.Parse(percentage.TrimEnd('%')) / 100;
                }

                 costoTarjeta = ConvertPercentageToDecimalWithZeroCheck(detalle.CostoTarjeta);
                 comisionMasIva = ConvertPercentageToDecimalWithZeroCheck(detalle.ComisionMasIva);
                comision = ConvertPercentageToDecimalWithZeroCheck(detalle.Comision);

                alicuotaFinal = ConvertPercentageToDecimalWithZeroCheck(alicuota);
                if (DateTime.Now.Date <= new DateTime(2024, 08, 31))
                {
                    // Este código se ejecutará hasta el 31/08/2024 inclusive
                    gananciaFinal = ConvertPercentageToDecimalWithZeroCheck(Ganancia);
                    ivaFinal = ConvertPercentageToDecimalWithZeroCheck(Iva);
                }
                debcredFinal = ConvertPercentageToDecimalWithZeroCheck(Debcred);
               narFinal = 0;
             
                    narFinal = ConvertPercentageToDecimalWithZeroCheck(nar);

                if (calculadorausuarios.TipoTarjetaBanco == "No Bancarizadas")
                {
                    // Aplica el porcentaje fijo del 9.68% para tarjetas no bancarizadas
                    string porcentajeTarjeta = "9,68%";
                    decimal costoTarjetaPorcentaje = ConvertPercentageToDecimalWithZeroCheck(porcentajeTarjeta);

                    costoTarjeta = monto * costoTarjetaPorcentaje;
                }
                else
                {
                    // Usa el valor dinámico de la comisión de tarjeta si no es "noBancarizada"
                    costoTarjeta = monto * costoTarjeta;
                }


                comisionMasIva = monto * comisionMasIva;
                comision = monto * comision;
                alicuotaFinal = comision * alicuotaFinal;
                gananciaFinal = comision * gananciaFinal;
                var cuotafinal = Convert.ToInt32(cuota);
                if(cuotafinal >= 2)
                {
                    debcredFinal = (monto /*- costoTarjeta*/) * debcredFinal;
                    if (calculadorausuarios.TipoTarjeta == "naranja")
                    {
                        costoAnticipocredito = 0.0m;
                    }
                }
                else if (cuotafinal == 1)
                {
                    if(calculadorausuarios.TipoTarjeta == "naranja")
                    {
                        debcredFinal = monto * debcredFinal;
                        costoAnticipocredito = 0.0m;
                        costoTarjeta = 0m;
                    }
                    else
                    {
                        debcredFinal = monto * debcredFinal;
                        costoAnticipocredito = 0.027104m;
                        costoTarjeta = 0m;
                    }
                   
                }
                    else
                {

                    debcredFinal = monto * debcredFinal;
                    costoAnticipocredito = 0m;


                }
                ivaFinal = comision * ivaFinal;

                narFinal = monto * narFinal;
                costoAnticipo = monto * costoAnticipocredito;
                var descuentos = costoTarjeta + comisionMasIva + alicuotaFinal + gananciaFinal + ivaFinal + debcredFinal + narFinal+ costoAnticipo;
                monto -= descuentos;
                bruto = monto;
                montofinal = bruto;

            }
            if (calculadorausuarios.TipoNetoBruto == "Neto" && costosTarjeta.Count > 0)
            {
                var detalle = costosTarjeta.First(); 

                decimal ConvertPercentageToDecimalWithZeroCheck(string percentage)
                {
                    if (string.IsNullOrWhiteSpace(percentage) || percentage.TrimEnd('%').Equals("0"))
                    {
                        return 0m;  
                    }

                    return decimal.Parse(percentage.TrimEnd('%')) / 100;
                }

                costoTarjeta = ConvertPercentageToDecimalWithZeroCheck(detalle.CostoTarjeta);
                comisionMasIva = ConvertPercentageToDecimalWithZeroCheck(detalle.ComisionMasIva);
                if (DateTime.Now.Date <= new DateTime(2024, 08, 31))
                {
                    // Este código se ejecutará hasta el 31/08/2024 inclusive
                    gananciaFinal = ConvertPercentageToDecimalWithZeroCheck(Ganancia);
                    ivaFinal = ConvertPercentageToDecimalWithZeroCheck(Iva);
                }
                debcredFinal = ConvertPercentageToDecimalWithZeroCheck(Debcred);
                narFinal = ConvertPercentageToDecimalWithZeroCheck(nar);
                comision = ConvertPercentageToDecimalWithZeroCheck(detalle.Comision);

                alicuotaFinal = ConvertPercentageToDecimalWithZeroCheck(alicuota);
                var montoNeto = monto;
                if (calculadorausuarios.TipoTarjetaBanco == "No Bancarizadas")
                {
                    // Aplica el porcentaje fijo del 9.68% para tarjetas no bancarizadas
                    string porcentajeTarjeta = "9,68%";
                    decimal costoTarjetaPorcentaje = ConvertPercentageToDecimalWithZeroCheck(porcentajeTarjeta);

                    costoTarjeta = costoTarjetaPorcentaje;
                }
                var alicuotaFinalCalculada = comision * alicuotaFinal;
                var cuotafinal = Convert.ToInt32(cuota);

                if (cuotafinal >= 2)
                {
                    if (calculadorausuarios.TipoTarjeta == "naranja")
                    {
                        costoAnticipocredito = 0.0m;
                    }
                }
                else if (cuotafinal == 1)
                {
                    if (calculadorausuarios.TipoTarjeta == "naranja")
                    {
                        costoTarjeta = 0m;

                        costoAnticipocredito = 0.0m;
                    }
                    else
                    {
                        costoAnticipocredito = 0.027104m;
                        costoTarjeta = 0m;
                    }
                

                }
                else
                {

                    costoAnticipocredito = 0.0m;


                }
                var porcentajeDescuento = Math.Round(costoTarjeta + comisionMasIva + debcredFinal + narFinal+ alicuotaFinalCalculada+ costoAnticipocredito, 2);

                var porcentajeNeto = Math.Round(1 - porcentajeDescuento, 2);
                var montoBruto = Math.Round(montoNeto / porcentajeNeto, 2);
                if (calculadorausuarios.TipoTarjetaBanco == "No Bancarizadas")
                {
                    // Aplica el porcentaje fijo del 9.68% para tarjetas no bancarizadas
                    string porcentajeTarjeta = "9,68%";
                    decimal costoTarjetaPorcentaje = ConvertPercentageToDecimalWithZeroCheck(porcentajeTarjeta);

                    // Calcular y redondear el costo de la tarjeta
                    costoTarjeta = Math.Round(montoBruto * costoTarjetaPorcentaje, 2);
                }
                else
                {
                    // Usa el valor dinámico de la comisión de tarjeta si no es "noBancarizada"
                    costoTarjeta = Math.Round(montoBruto * costoTarjeta, 2);
                }



                comisionMasIva = Math.Round(montoBruto * comisionMasIva, 2);
                comision = Math.Round(montoBruto * comision, 2);
                alicuotaFinal = Math.Round(comision * alicuotaFinal, 2);
                gananciaFinal = Math.Round(comision * gananciaFinal, 2);
                ivaFinal = Math.Round(comision * ivaFinal, 2);

                if (cuotafinal >= 2)
                {
                    debcredFinal = Math.Round((montoBruto /*- costoTarjeta*/) * debcredFinal, 2);
                }
                else if (cuotafinal == 1)
                {
                   debcredFinal = Math.Round((montoBruto /*- costoTarjeta*/ ) * debcredFinal, 2);
                    costoAnticipocredito = 0.027104m;
                    costoTarjeta = 0m;

                }
                else
                {
                    
                        debcredFinal = Math.Round((montoBruto /*- costoTarjeta*/) * debcredFinal, 2);
                        costoAnticipocredito =0.0m;

                    
                }

                narFinal = montoBruto * narFinal;
                costoAnticipo = montoBruto * costoAnticipocredito;
                monto = neto + costoTarjeta + comisionMasIva+ debcredFinal + alicuotaFinal+ costoAnticipo;
             //   monto = montoBruto;
                neto = monto;
                montofinal = neto;
            }
            decimal montoinicial = decimal.Parse(calculadorausuarios.Monto, CultureInfo.InvariantCulture);


            var culture = new CultureInfo("es-ES");

            var resultado = new
            {
                cuota = calculadorausuarios.Cuota,
                costoAnticipo = costoAnticipo.ToString("N2", culture),
                costoTarjeta = costoTarjeta.ToString("N2", culture),
                comisionMasIva = comisionMasIva.ToString("N2", culture),
                alicuotaFinal = alicuotaFinal.ToString("N2", culture),
                gananciaFinal = gananciaFinal.ToString("N2", culture),
                ivaFinal = ivaFinal.ToString("N2", culture),
                debcredFinal = debcredFinal.ToString("N2", culture),
                narFinal = narFinal.ToString("N2", culture),
                neto = neto.ToString("N2", culture), 
                bruto = bruto.ToString("N2", culture), 
                montoinicial = montoinicial.ToString("N2", culture),
                montofinal = montofinal.ToString("N2", culture),
            };



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
                    switch (tipoTarjeta.ToLower())
                    {
                        case "visa":
                            costoSeleccionado = item.CostoVisaCredito;
                            break;
                        case "american express":
                            costoSeleccionado = item.CostoAmericanExpressCredito;
                            break;
                        case "mastercard":
                            costoSeleccionado = item.CostoMastercardCredito;
                            break;
                        case "argencard":
                            costoSeleccionado = item.CostoArgencardCredito;
                            break;
                        case "cabal":
                            costoSeleccionado = item.CostoCabalCredito;
                            break;
                        case "naranja":
                            costoSeleccionado = item.CostoNaranjaCredito;
                            break;
                    }

            string comision = item.Comision;
string iva = item.Iva;
string comisionMasIva = item.ComisionMasIva;

if (usuario == "11111111116")
{
    if (cuota == "0")
    {
        comision = "2,528%";
        iva = "0,672%";
        comisionMasIva = "3,200%"; // Suma manual de 2,528% + 0,672%
    }
    else
    {
        comision = "3,3338%";
        iva = "0,8862%";
        comisionMasIva = "4,2200%"; // Suma manual de 3,3338% + 0,8862%

        switch (cuota)
        {
            case "3":
            case "13":
                if (tipoTarjeta.ToLower() != "naranja")
                {
                    costoSeleccionado = "9,01%";
                }
                break;

            case "6":
            case "16":
                if (tipoTarjeta.ToLower() != "naranja")
                {
                    costoSeleccionado = "14,41%";
                }
                break;

            case "9":
                if (tipoTarjeta.ToLower() != "naranja")
                {
                    costoSeleccionado = "19,38%";
                }
                break;

            case "12":
                if (tipoTarjeta.ToLower() != "naranja")
                {
                    costoSeleccionado = "23,97%";
                }
                break;

            default:
                // Aquí puedes manejar cuotas que no estén especificadas, si es necesario
                break;
        }
    }
}


                    if (costoSeleccionado != null)
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



        [HttpGet("datostarjeta")]
        public async Task<IActionResult> DatosTarjeta()
        {
            var listaCuotas = await _CalculadoraService.ListaCuota();
            var resultados = new Dictionary<string, List<object>>();

            foreach (var cuota in listaCuotas)
            {
                if (int.TryParse(cuota.Cuota, out int numCuota) && numCuota >= 0)
                {
                    ProcessCardCost(resultados, cuota, "Visa", cuota.CostoVisaCredito);
                    ProcessCardCost(resultados, cuota, "American Express", cuota.CostoAmericanExpressCredito);
                    ProcessCardCost(resultados, cuota, "MasterCard", cuota.CostoMastercardCredito);
                    ProcessCardCost(resultados, cuota, "Argencard", cuota.CostoArgencardCredito);
                    ProcessCardCost(resultados, cuota, "Cabal", cuota.CostoCabalCredito);
                    ProcessCardCost(resultados, cuota, "Naranja", cuota.CostoNaranjaCredito);
                }
            }

            return Ok(resultados);
        }

        private void ProcessCardCost(Dictionary<string, List<object>> resultados, ListaCuotum cuota, string cardName, string cost)
        {
            if (!string.IsNullOrWhiteSpace(cost) && !cost.Contains("Revisar") && ConvertCostToPercentage(cost) < 100)
            {
                AddToResultados(resultados, cardName, int.Parse(cuota.Cuota), cost, cuota.CodigoPosnet);
            }
        }

        private decimal ConvertCostToPercentage(string cost)
        {
            cost = cost.TrimEnd('%').Replace(",", ".");
            if (decimal.TryParse(cost, NumberStyles.Any, CultureInfo.InvariantCulture, out decimal result))
            {
                return result;
            }
            return 100; 
        }

        private void AddToResultados(Dictionary<string, List<object>> resultados, string tarjeta, int cuota, string costo, string codigoposnet)
        {
            if (!resultados.ContainsKey(tarjeta))
            {
                resultados[tarjeta] = new List<object>();
            }

            resultados[tarjeta].Add(new
            {
                Cuota = cuota,
                Costo = costo,
                Tarjeta = tarjeta,
                CodigoPosnet = codigoposnet,
            });
            resultados[tarjeta] = resultados[tarjeta]
                .OrderBy(item => ((dynamic)item).Cuota)
                .ToList();
        }





        [HttpPost("plazos")]
        public async Task<IActionResult> CalcularPlazos([FromBody] VMPlazos DatosPlazos)
        {
            string tarjetaDetalles = DatosPlazos.Tarjeta;
            string nuevaFecha = DatosPlazos.Fecha;
            string nuevaFechaNaranja = DatosPlazos.Fecha;
            string nuevaFecha18Dias = DatosPlazos.Fecha;

            string nuevaFecha10Dias = DatosPlazos.Fecha;
            string nuevaFecha5Dias = DatosPlazos.Fecha;
            string nuevaFecha48Hs = DatosPlazos.Fecha;
            string nuevaFecha24Hs = DatosPlazos.Fecha;
            string tarjetaDetallesNaranjaDias = "";
            string tarjetaDetalles18Dias = "";
            string tarjetaDetalles10Dias = "";
            string tarjetaDetalles5Dias = "";
            string tarjetaDetalles48Hs = "";
            string tarjetaDetalles24Hs = "";
            string Detalle24hs = "";
            string Detalle48hs = "";
            string Detalle5dias = "";
            string Detalle10dias = "";
            string Detalle18dias = "";
            string DetalleNaranja = "";


            if (DatosPlazos.Tipo == "Debito")
            {
                if (DatosPlazos.Tarjeta == "Maestro/Electron Visa")
                {
                    tarjetaDetalles24Hs += " (Bancos Nacionales, Provinciales y privados)";
                    if (!string.IsNullOrEmpty(nuevaFecha))
                    {
                        if (DateTime.TryParse(nuevaFecha, out DateTime fechaParsed)) 
                        {
                            nuevaFecha24Hs = AddBusinessDays(fechaParsed, 2).ToString("dd/MM/yyyy");
                            Detalle24hs = "Transcurridas las 24hs habiles";
                        }
                    }
                }
                else if (DatosPlazos.Tarjeta == "MC Debit/Visa Debit")
                {
                    tarjetaDetalles48Hs += " (Tarjetas de Débito de bancos virtuales, Ualá, Brubank, Wilobank, Reba, Banco del Sol, Mercadopago y todas las recargables)";
                    if (!string.IsNullOrEmpty(nuevaFecha))
                    {
                        if (DateTime.TryParse(nuevaFecha, out DateTime fechaParsed))
                        {
                            nuevaFecha48Hs = AddBusinessDays(fechaParsed, 3).ToString("dd/MM/yyyy");
                            Detalle48hs = "Transcurridas las 48hs habiles";

                        }
                    }
                }
            }
            else if (DatosPlazos.Tipo == "Alimentar")
            {
                if (DatosPlazos.Tarjeta == "Banco Nación/Provinciales")
                {
                    if (!string.IsNullOrEmpty(nuevaFecha))
                    {                    tarjetaDetalles48Hs += " (Tarjetas de Débito de bancos virtuales, Ualá, Brubank, Wilobank, Reba, Banco del Sol, Mercadopago y todas las recargables)";

                        if (DateTime.TryParse(nuevaFecha, out DateTime fechaParsed))
                        {
                            tarjetaDetalles48Hs += " (Tarjetas de Débito de bancos virtuales, Ualá, Brubank, Wilobank, Reba, Banco del Sol, Mercadopago y todas las recargables)";

                            nuevaFecha48Hs = AddBusinessDays(fechaParsed, 3).ToString("dd/MM/yyyy");
                            Detalle48hs = "Transcurridas las 48hs habiles";

                        }
                    }
                }
              
            }
            else if (DatosPlazos.Tipo == "Credito1Pago")
            {
                switch (DatosPlazos.Tarjeta)
                {
                    case "Bancarizadas":
                        tarjetaDetalles10Dias = "(Amex - Cabal)";
                        tarjetaDetalles18Dias = "(Cabal)";
                        tarjetaDetalles48Hs = " (Visa - Master-Argencard)";
                        nuevaFecha10Dias = AddBusinessDays(DateTime.Parse(nuevaFecha10Dias), 11).ToString("dd/MM/yyyy");
                        Detalle10dias = "Transcurridas los 10 dias habiles Amex, Transcurridas los 18 dias habiles Cabal";
                        nuevaFecha18Dias = AddBusinessDays(DateTime.Parse(nuevaFecha18Dias), 11).ToString("dd/MM/yyyy");
                        Detalle18dias = "Transcurridas los 18 dias habiles";

                        nuevaFecha48Hs = AddBusinessDays(DateTime.Parse(nuevaFecha48Hs), 3).ToString("dd/MM/yyyy");
                        Detalle48hs = "Transcurridas las 48hs habiles";

                        break;
                    case "No bancarizadas":
                        tarjetaDetalles48Hs = "Naranja Visa, Naranja Master, Cencosud, etc.";
                        nuevaFecha48Hs = AddBusinessDays(DateTime.Parse(nuevaFecha48Hs), 3).ToString("dd/MM/yyyy");
                        Detalle48hs = "Transcurridas las 48hs habiles";

                        break;
                    case "Recargables":
                        tarjetaDetalles48Hs = "Tarjetas de Débito de bancos virtuales, Ualá, Brubank, Wilobank, ReBa, Banco del Sol, Mercadopago y todas las recargables";
                        nuevaFecha48Hs = AddBusinessDays(DateTime.Parse(nuevaFecha48Hs), 3).ToString("dd/MM/yyyy");
                        Detalle48hs = "Transcurridas las 48hs habiles";

                        break;
                }
            }
            else if (DatosPlazos.Tipo == "Credito2Pago")
            {
                switch (DatosPlazos.Tarjeta)
                {
                    case "Bancarizadas":
                        tarjetaDetalles10Dias = "(Amex - Cabal)";
                        tarjetaDetalles18Dias = "(Cabal)";
                        tarjetaDetalles48Hs = "Otras Tarjetas";
                        nuevaFecha10Dias = AddBusinessDays(DateTime.Parse(nuevaFecha10Dias), 11).ToString("dd/MM/yyyy");
                        Detalle10dias = "Transcurridas los 10 dias habiles Amex, Transcurridas los 18 dias habiles Cabal";
                        nuevaFecha18Dias = AddBusinessDays(DateTime.Parse(nuevaFecha18Dias), 11).ToString("dd/MM/yyyy");
                        Detalle18dias = "Transcurridas los 18 dias habiles";

                        nuevaFecha48Hs = AddBusinessDays(DateTime.Parse(nuevaFecha48Hs), 3).ToString("dd/MM/yyyy");
                        Detalle48hs = "Transcurridas las 48hs habiles";


                        break;
                    case "No bancarizadas":
                        tarjetaDetalles5Dias = "(Naranja Visa, Naranja Master, Cencosud)";
                        nuevaFecha5Dias = AddBusinessDays(DateTime.Parse(nuevaFecha5Dias), 6).ToString("dd/MM/yyyy");
                        Detalle5dias = "Transcurridas los 5 dias habiles";

                        break;

                }
            }
            else if (DatosPlazos.Tipo == "CreditoCuotaSimple")
            {
                switch (DatosPlazos.Tarjeta)
                {
                    case "Bancarizadas":
                        tarjetaDetalles10Dias = " (Amex)";
                        tarjetaDetalles48Hs = "(Bancos Nacionales, Provinciales y Privados)";
                        nuevaFecha10Dias = AddBusinessDays(DateTime.Parse(nuevaFecha10Dias), 11).ToString("dd/MM/yyyy");
                        Detalle10dias = "Transcurridas los 10 dias habiles";

                        nuevaFecha48Hs = AddBusinessDays(DateTime.Parse(nuevaFecha48Hs), 3).ToString("dd/MM/yyyy");
                        Detalle48hs = "Transcurridas las 48hs habiles";


                        break;
                }
            }
            else if (DatosPlazos.Tipo == "Naranja")
            {
                tarjetaDetallesNaranjaDias = "Cierre: 24 cada mes - Pago 14";
                int mesActual = DateTime.Now.Month;
                int añoActual = DateTime.Now.Year;

                int mesProximo = mesActual + 1;
                int añoProximo = añoActual;
                if (mesProximo > 12)
                {
                    mesProximo = 1;
                    añoProximo++;
                }

                DateTime fechaProximoMes = new DateTime(añoProximo, mesProximo, 14);

                while (fechaProximoMes.DayOfWeek == DayOfWeek.Saturday || fechaProximoMes.DayOfWeek == DayOfWeek.Sunday)
                {
                    fechaProximoMes = fechaProximoMes.AddDays(1);
                }


                nuevaFechaNaranja = fechaProximoMes.ToString("dd/MM/yyyy");
                DetalleNaranja = "Se acredita el 14 del mes siguiente en caso de ser un día hábil.";
            }

            bool tieneDetallesNaranja = !string.IsNullOrEmpty(tarjetaDetallesNaranjaDias);
            bool tieneDetalles10Dias = !string.IsNullOrEmpty(tarjetaDetalles10Dias);
            bool tieneDetalles5Dias = !string.IsNullOrEmpty(tarjetaDetalles5Dias);
            bool tieneDetalles48Hs = !string.IsNullOrEmpty(tarjetaDetalles48Hs);
            bool tieneDetalles24Hs = !string.IsNullOrEmpty(tarjetaDetalles24Hs);

            var tarjeta = DatosPlazos.Tipo;

            var resultado = new
            {
                Tarjeta = tarjeta,
                Detalle24Hs = Detalle24hs,
             Detalle48Hs = Detalle48hs,
            Detalle5Dias =Detalle5dias,
             Detalle10Dias =Detalle10dias,
             DetalleNaranja =DetalleNaranja,
                TarjetaDetalles18Dias=tarjetaDetalles18Dias,
                NuevaFecha18Dias = nuevaFecha18Dias,
                Detalle18dias = Detalle18dias,
            DetallesNaranjaDias = tarjetaDetallesNaranjaDias,
                NuevaFechaNaranja = tieneDetallesNaranja ? nuevaFechaNaranja : null,
                Detalles10Dias = tarjetaDetalles10Dias,
                NuevaFecha10Dias = tieneDetalles10Dias ? nuevaFecha10Dias : null,
                Detalles5Dias = tarjetaDetalles5Dias,
                NuevaFecha5Dias = tieneDetalles5Dias ? nuevaFecha5Dias : null,
                Detalles48Hs = tarjetaDetalles48Hs,
                NuevaFecha48Hs = tieneDetalles48Hs ? nuevaFecha48Hs : null,
                Detalles24Hs = tarjetaDetalles24Hs,
                NuevaFecha24Hs = tieneDetalles24Hs ? nuevaFecha24Hs : null,
                TieneDetallesNaranja = tieneDetallesNaranja,
                TieneDetalles10Dias = tieneDetalles10Dias,
                TieneDetalles5Dias = tieneDetalles5Dias,
                TieneDetalles48Hs = tieneDetalles48Hs,
                TieneDetalles24Hs = tieneDetalles24Hs
            };
            return Ok(new { resultado });
        }

        private DateTime AddBusinessDays(DateTime date, int days)
        {
            if (days < 0)
            {
                throw new ArgumentException("days no puede ser menor a cero", nameof(days));
            }

            while (days > 0)
            {
                date = date.AddDays(1);
                if (date.DayOfWeek != DayOfWeek.Saturday && date.DayOfWeek != DayOfWeek.Sunday)
                {
                    days--;
                }
            }
            return date;
        }
        //[HttpPost("calculadoraliquidaciones")]
        //public async Task<IActionResult> CalculadoraLiquidaciones([FromBody] List<VMCalculadoraUsuario> calculadoraUsuarios)
        //{
        //    if (calculadoraUsuarios == null || !calculadoraUsuarios.Any())
        //    {
        //        return BadRequest("El array de usuarios no puede estar vacío.");
        //    }

        //    // Recorrer el array para asegurarnos de procesar los datos (aunque no hagas nada aún)
        //    foreach (var usuario in calculadoraUsuarios)
        //    {
        //        // Aquí puedes agregar lógica más adelante si la necesitas
        //    }

        //    return Ok("Datos recibidos y procesados correctamente.");
        //} 
        [HttpPost("calculadoraliquidaciones")]
        public async Task<IActionResult> CalculadoraLiquidaciones([FromBody] List<VMCalculadoraUsuario> calculadoraUsuarios)
        {
            if (calculadoraUsuarios == null || !calculadoraUsuarios.Any())
            {
                return BadRequest("El array de usuarios no puede estar vacío.");
            }

            // Crear una lista para almacenar los resultados
            var resultados = new List<object>();

            // Agrupar los usuarios por TipoDebCred, Cuota, TipoTarjeta, Tarjeta, y TipoTarjetaBanco
            var grupos = calculadoraUsuarios
                .GroupBy(u => new { u.TipoDebCred, u.Cuota, u.TipoTarjeta, u.Tarjeta, u.TipoTarjetaBanco })
                .ToList();

            foreach (var grupo in grupos)
            {
                decimal sumCostoTarjeta = 0;
                decimal sumComisionMasIva = 0;
                decimal sumAlicuotaFinal = 0;
                decimal sumGananciaFinal = 0;
                decimal sumIvaFinal = 0;
                decimal sumDebcredFinal = 0;
                decimal sumNarFinal = 0;
                decimal sumCostoAnticipo = 0; // Nuevo
                decimal sumBruto = 0;
                decimal sumNeto = 0;
                decimal sumMontoinicial = 0;
                decimal sumMontofinal = 0;
                decimal sumComision = 0; decimal sumIvaComision = 0;

                foreach (var usuario in grupo)
                {
                    // Validar el token del usuario
                    bool esTokenValido = await _tokenService.ValidarTokenAsync(usuario.Token);
                    if (!esTokenValido)
                    {
                        esTokenValido = await _tokenCajeroService.ValidarTokenAsync(usuario.Token);
                        if (!esTokenValido)
                        {
                            return StatusCode(StatusCodes.Status401Unauthorized, $"Token inválido para el usuario con ID: {usuario.Token}");
                        }
                    }
                    if(usuario.TipoDebCred == "Debito")
                    {
                        usuario.Cuota = "0";
                    }
                    var usuarioResult = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(usuario.Token);
                    var usuarioCajeroResult = await _tokenCajeroService.ObtenerTokenYUsuarioPorUsuarioIdAsync(usuario.Token);

                    Usuario usuariocajeropadre = null;
                    if (usuarioCajeroResult.usuario != null)
                    {
                        usuariocajeropadre = await _usuarioZocoService.ObtenerPorId((int)usuarioCajeroResult.usuario.IdUsuario);
                    }

                    var usuarioFinal = usuarioResult.usuario?.Usuario1 ?? usuariocajeropadre?.Usuario1;

                    if (usuarioFinal == null)
                    {
                        return NotFound($"Usuario no encontrado para el token: {usuario.Token}");
                    }

                    // Obtener datos relacionados del usuario
                    var provinciacompleto = await _baseService.DatoProvincia(usuarioFinal);
                    var listacuota = await _CalculadoraService.ListaCuota();
                    var listaprovincia = await _CalculadoraService.ListaIIBBProvincia();
                    var ListaImpositiva = await _CalculadoraService.ListaImpositiva();

                    // Determinar provincia
                    string provincia = provinciacompleto?.Provincia ?? "Vacio";

                    // Inicializar valores para cálculos
                    string alicuota = "0", ganancia = "0", iva = "0", debcred = "0", nar = "0";
                    decimal costoTarjeta = 0, comisionMasIva = 0, comision = 0;
                    decimal alicuotaFinal = 0, gananciaFinal = 0, ivaFinal = 0, debcredFinal = 0, narFinal = 0;
                    decimal costoAnticipoCredito = 0.0571m; // Nuevo
                    decimal costoAnticipo = 0; // Nuevo
                    var provinciaEncontrada = listaprovincia.FirstOrDefault(p => p.Provincia.ToLower() == provincia.ToLower());
                    if (provinciaEncontrada != null)
                    {
                        alicuota = provinciaEncontrada.Alicuota;
                    }

                    // Determinar impuestos según la cuota
                    if (Convert.ToInt32(usuario.Cuota) == 0)
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "ganancia")
                            {
                                ganancia = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "debito" && impuesto.Retecion.ToLower() == "iva")
                            {
                                iva = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                            {
                                debcred = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                            {
                                nar = impuesto.Porcentaje;
                            }
                        }
                    }
                    else if (Convert.ToInt32(usuario.Cuota) == 1)
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "ganancia")
                            {
                                ganancia = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "1 pago" && impuesto.Retecion.ToLower() == "iva")
                            {
                                iva = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                            {
                                debcred = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                            {
                                nar = impuesto.Porcentaje;
                            }
                        }
                    }
                    else
                    {
                        foreach (var impuesto in ListaImpositiva)
                        {
                            if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "ganancia")
                            {
                                ganancia = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "credito" && impuesto.Retecion.ToLower() == "iva")
                            {
                                iva = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto debito credito")
                            {
                                debcred = impuesto.Porcentaje;
                            }
                            else if (impuesto.Tipo.ToLower() == "impuesto municipal naranja")
                            {
                                nar = impuesto.Porcentaje;
                            }
                        }
                    }

                    // Calcular montos iniciales
                    decimal monto = decimal.Parse(usuario.Monto, CultureInfo.InvariantCulture);
                    decimal bruto = monto;
                    decimal neto = monto;
                    decimal montofinal = 0;

                    string tipoTarjeta = usuario.TipoTarjeta.ToLower();
                    string cuota = usuario.Cuota;

                    // Obtener costos relacionados a la tarjeta
                    var costosTarjeta = GetCostoTarjeta(listacuota, tipoTarjeta, cuota, usuarioFinal);

                    if (usuario.TipoNetoBruto == "Bruto" && costosTarjeta.Count > 0)
                    {
                        var detalle = costosTarjeta.First();
                        decimal ConvertPercentageToDecimalWithZeroCheck(string percentage)
                        {
                            if (string.IsNullOrWhiteSpace(percentage) || percentage.TrimEnd('%').Equals("0"))
                            {
                                return 0m;
                            }
                            return decimal.Parse(percentage.TrimEnd('%')) / 100;
                        }

                        costoTarjeta = ConvertPercentageToDecimalWithZeroCheck(detalle.CostoTarjeta);
                        comisionMasIva = ConvertPercentageToDecimalWithZeroCheck(detalle.ComisionMasIva);
                        comision = ConvertPercentageToDecimalWithZeroCheck(detalle.Comision);

                        alicuotaFinal = ConvertPercentageToDecimalWithZeroCheck(alicuota);
                        if (DateTime.Now.Date <= new DateTime(2024, 08, 31))
                        {
                            gananciaFinal = ConvertPercentageToDecimalWithZeroCheck(ganancia);
                            ivaFinal = ConvertPercentageToDecimalWithZeroCheck(iva);
                        }
                        debcredFinal = ConvertPercentageToDecimalWithZeroCheck(debcred);
                        narFinal = ConvertPercentageToDecimalWithZeroCheck(nar);

                        if (usuario.TipoTarjetaBanco == "No Bancarizadas")
                        {
                            string porcentajeTarjeta = "9,68%";
                            decimal costoTarjetaPorcentaje = ConvertPercentageToDecimalWithZeroCheck(porcentajeTarjeta);

                            costoTarjeta = monto * costoTarjetaPorcentaje;
                        }
                        else
                        {
                            costoTarjeta = monto * costoTarjeta;
                        }

                        comisionMasIva = monto * comisionMasIva;
                        comision = monto * comision;
                        alicuotaFinal = comision * alicuotaFinal;
                        gananciaFinal = comision * gananciaFinal;
                        ivaFinal = comision * ivaFinal;

                        if (Convert.ToInt32(cuota) >= 2)
                        {
                            debcredFinal = (monto /*- costoTarjeta*/) * debcredFinal;
                            if (usuario.TipoTarjeta == "naranja")
                            {
                                costoAnticipoCredito = 0.0m;
                            }
                        }
                        else if (Convert.ToInt32(cuota) == 1)
                        {
                            debcredFinal = monto * debcredFinal;
                            if (usuario.TipoTarjeta == "naranja")
                            {
                                costoAnticipoCredito = 0.0m;
                                costoTarjeta = 0m;
                            }
                            else
                            {
                                costoAnticipoCredito = 0.027104m;
                                costoTarjeta = 0m;

                            }
                          
                        }
                        else
                        {
                            debcredFinal = monto * debcredFinal;
                            costoAnticipoCredito = 0m;
                        }
                        costoAnticipo = monto * costoAnticipoCredito; // Nuevo

                        narFinal = monto * narFinal;

                        var descuentos = costoTarjeta + comisionMasIva + alicuotaFinal + gananciaFinal + ivaFinal + debcredFinal + narFinal + costoAnticipo; // Actualizado
                        monto -= descuentos;
                        bruto = monto;
                        montofinal = bruto;
                    }

                    // Acumular los valores calculados en las variables de suma
                    sumCostoTarjeta += costoTarjeta;
                    sumComisionMasIva += comisionMasIva;
                    decimal porcentajeIVA = 0.21m;

                    // Separar la comisión y el IVA
                     sumComision = comisionMasIva / (1 + porcentajeIVA); // Calcular la comisión
                     sumIvaComision = comisionMasIva - sumComision;     // Calcular el IVA
                    sumAlicuotaFinal += alicuotaFinal;
                    sumGananciaFinal += gananciaFinal;
                    sumIvaFinal += ivaFinal;
                    sumDebcredFinal += debcredFinal;
                    sumNarFinal += narFinal;
                    sumCostoAnticipo += costoAnticipo; // Nuevo
                    sumBruto += bruto;
                    sumNeto += neto;
                    sumMontoinicial += decimal.Parse(usuario.Monto, CultureInfo.InvariantCulture);
                    sumMontofinal += montofinal;
                }

                // Crear el objeto consolidado para este grupo
                var culture = new CultureInfo("es-ES");
                var resultadoGrupo = new
                {
                    TipoDebCred = grupo.Key.TipoDebCred,
                    Cuota = grupo.Key.Cuota,
                    TipoTarjeta = grupo.Key.TipoTarjeta,
                    Tarjeta = grupo.Key.Tarjeta,
                    TipoTarjetaBanco = grupo.Key.TipoTarjetaBanco,
                    costoTarjeta = sumCostoTarjeta.ToString("N2", culture),

                    sumComision = sumComision.ToString("N2", culture),

                    sumIvaComision = sumIvaComision.ToString("N2", culture),
                    comisionMasIva = sumComisionMasIva.ToString("N2", culture),
                    alicuotaFinal = sumAlicuotaFinal.ToString("N2", culture),
                    gananciaFinal = sumGananciaFinal.ToString("N2", culture),
                    ivaFinal = sumIvaFinal.ToString("N2", culture),
                    debcredFinal = sumDebcredFinal.ToString("N2", culture),
                    narFinal = sumNarFinal.ToString("N2", culture),
                    costoAnticipo = sumCostoAnticipo.ToString("N2", culture), // Nuevo
                    neto = sumNeto.ToString("N2", culture),
                    bruto = sumBruto.ToString("N2", culture),
                    montoinicial = sumMontoinicial.ToString("N2", culture),
                    montofinal = sumMontofinal.ToString("N2", culture)
                };

                // Agregar el resultado consolidado a la lista
                resultados.Add(resultadoGrupo);
            }

            return Ok(resultados);
        }

        [HttpPost("calculadoraliquidacionespayway")]
        public async Task<IActionResult> calculadoraliquidacionespayway([FromBody] List<VMCalculadoraUsuario> calculadoraUsuarios)
        {
            if (calculadoraUsuarios == null || !calculadoraUsuarios.Any())
            {
                return BadRequest("El array de usuarios no puede estar vacío.");
            }

            // Crear una lista para almacenar los resultados
            var resultados = new List<object>();

            // Agrupar los usuarios por TipoDebCred, Cuota, TipoTarjeta, Tarjeta, y TipoTarjetaBanco
            var grupos = calculadoraUsuarios
                .GroupBy(u => new { u.TipoDebCred, u.Cuota, u.TipoTarjeta, u.Tarjeta, u.TipoTarjetaBanco })
                .ToList();

            foreach (var grupo in grupos)
            {
                // Inicializar variables de suma para este grupo
                decimal sumCostoTarjeta = 0;
                decimal sumComisionMasIva = 0;
                decimal sumAlicuotaFinal = 0;
                decimal sumGananciaFinal = 0;
                decimal sumIvaFinal = 0;
                decimal sumDebcredFinal = 0;
                decimal sumNarFinal = 0;
                decimal sumCostoAnticipo = 0;
                decimal sumBruto = 0;
                decimal sumNeto = 0;
                decimal sumMontoinicial = 0;
                decimal sumMontofinal = 0;
                decimal sumComision = 0;
                decimal sumIvaComision = 0;

                foreach (var usuario in grupo)
                {
                    // Validar el token del usuario
                    bool esTokenValido = await _tokenService.ValidarTokenAsync(usuario.Token);
                    if (!esTokenValido)
                    {
                        esTokenValido = await _tokenCajeroService.ValidarTokenAsync(usuario.Token);
                        if (!esTokenValido)
                        {
                            return StatusCode(StatusCodes.Status401Unauthorized, $"Token inválido para el usuario con ID: {usuario.Token}");
                        }
                    }

                    if (usuario.TipoDebCred == "Debito")
                    {
                        usuario.Cuota = "0";
                    }

                    decimal monto = decimal.Parse(usuario.Monto, CultureInfo.InvariantCulture);
                    decimal bruto = monto;
                    decimal neto = monto;
                    decimal montofinal = 0;

                    // Calcular arancel, IVA sobre arancel, etc., comunes para débito y crédito
                    var arancel = monto * 0.008m; // 0.8%
                    var ivaSobreArancel = arancel * 0.21m; // 21% de IVA sobre arancel
                    var percepcionesIva = arancel * 0.03m; // 3% percepciones IVA
                    var retencionesIibb = monto * 0.05m; // 5% retenciones ingresos brutos
                    var impuestodtocrto = monto * 0.006m; // 0.6% impuesto débito/crédito

                    decimal costoAnticipo = 0m;
                    decimal costoAnticipoIva = 0m;
                    decimal costoFinanciero = 0m;
                    decimal costoFinancieroIva = 0m;

                    if (usuario.TipoDebCred.ToLower() == "credito")
                    {
                        // Calcular costos para crédito según la cuota
                        if (usuario.Cuota == "1")
                        {
                            costoAnticipo = monto * 0.0441m; // 4.41%
                            costoAnticipoIva = costoAnticipo * 0.21m; // 21% de IVA
                        }
                        else if (usuario.Cuota == "3")
                        {
                            costoFinanciero = monto * 0.0488m; // 4.88%
                            costoFinancieroIva = costoFinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m; // 5.04%
                            costoAnticipoIva = costoAnticipo * 0.21m;
                        }
                        else if (usuario.Cuota == "6")
                        {
                            costoFinanciero = monto * 0.0934m; // 9.34%
                            costoFinancieroIva = costoFinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m; // 5.04%
                            costoAnticipoIva = costoAnticipo * 0.21m;
                        }
                        else if (usuario.Cuota == "9")
                        {
                            costoFinanciero = monto * 0.1352m; // 13.52%
                            costoFinancieroIva = costoFinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m; // 5.04%
                            costoAnticipoIva = costoAnticipo * 0.21m;
                        }
                        else if (usuario.Cuota == "12")
                        {
                            costoFinanciero = monto * 0.1743m; // 17.43%
                            costoFinancieroIva = costoFinanciero * 0.21m;
                            costoAnticipo = monto * 0.0504m; // 5.04%
                            costoAnticipoIva = costoAnticipo * 0.21m;
                        }
                    }

                    // Sumar todas las deducciones
                    var totalDeducciones = arancel + ivaSobreArancel + percepcionesIva + retencionesIibb + impuestodtocrto + costoAnticipo + costoAnticipoIva + costoFinanciero + costoFinancieroIva;
                    var totalADepositar = monto - totalDeducciones;

                    // Actualizar variables de suma
                    sumCostoTarjeta += arancel;
                    sumComisionMasIva += arancel + ivaSobreArancel;
                    sumComision += arancel;
                    sumIvaComision += ivaSobreArancel;
                    sumBruto += monto;
                    sumNeto += totalADepositar;
                    sumMontoinicial += monto;
                    sumMontofinal += totalADepositar;
                    sumCostoAnticipo += costoAnticipo + costoAnticipoIva;

                    // Ejemplo de métricas adicionales
                    sumAlicuotaFinal += 0; // Se puede agregar si es necesario
                    sumGananciaFinal += 0;
                    sumIvaFinal += 0;
                    sumDebcredFinal += 0;
                    sumNarFinal += 0;
                }

                // Crear el objeto consolidado para este grupo
                var culture = new CultureInfo("es-ES");
                var resultadoGrupo = new
                {
                    TipoDebCred = grupo.Key.TipoDebCred,
                    Cuota = grupo.Key.Cuota,
                    TipoTarjeta = grupo.Key.TipoTarjeta,
                    Tarjeta = grupo.Key.Tarjeta,
                    TipoTarjetaBanco = grupo.Key.TipoTarjetaBanco,
                    costoTarjeta = sumCostoTarjeta.ToString("N2", culture),
                    sumComision = sumComision.ToString("N2", culture),
                    sumIvaComision = sumIvaComision.ToString("N2", culture),
                    comisionMasIva = sumComisionMasIva.ToString("N2", culture),
                    alicuotaFinal = sumAlicuotaFinal.ToString("N2", culture),
                    gananciaFinal = sumGananciaFinal.ToString("N2", culture),
                    ivaFinal = sumIvaFinal.ToString("N2", culture),
                    debcredFinal = sumDebcredFinal.ToString("N2", culture),
                    narFinal = sumNarFinal.ToString("N2", culture),
                    costoAnticipo = sumCostoAnticipo.ToString("N2", culture),
                    neto = sumNeto.ToString("N2", culture),
                    bruto = sumBruto.ToString("N2", culture),
                    montoinicial = sumMontoinicial.ToString("N2", culture),
                    montofinal = sumMontofinal.ToString("N2", culture)
                };

                // Agregar el resultado consolidado a la lista
                resultados.Add(resultadoGrupo);
            }

            return Ok(resultados);
        }



    }

}


    
