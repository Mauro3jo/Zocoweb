using AutoMapper;
using BLL.InterfacesZoco;
using ClosedXML.Excel;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnalisisAsesoresController : ControllerBase
    {
        private readonly IInicioAsesoresService _InicioAsesores;
        private readonly IBaseStockService _BaseStock;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IAnalisisService _analisisService;
        private readonly IMapper _mapper;

        public AnalisisAsesoresController(IInicioAsesoresService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco, IBaseStockService basestock, IAnalisisService analisisService)
        {
            _InicioAsesores = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _BaseStock = basestock;
            _analisisService = analisisService;
        }
        [HttpPost("analisisasesores")]
        public async Task<ActionResult> AnalisiAsesores([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var asesores = await _InicioAsesores.DatosInicioAsesores(usuarioEncontrado.usuario.Usuario1);
                var basestock = await _BaseStock.DatosInicioAsesores(asesores.FirstOrDefault().ApellidoYNombre);
                var analisis = await _analisisService.DatosInicioAsesores(asesores.First().ApellidoYNombre);
                var sumatoriaPorRubro = basestock
       .GroupBy(bs => bs.Rubro)
       .Select(grupo => new
       {
           Rubro = grupo.Key,
           SumatoriaFacturacionMesEnCurso = grupo.Sum(bs => bs.FacturaciónMesEnCurso ?? 0)
       })
       .ToList();
                var nombreAsesor = asesores.FirstOrDefault()?.ApellidoYNombre;
                var Stock = asesores.FirstOrDefault()?.Stock ?? 0;
                var Alta = asesores.FirstOrDefault()?.Altas ?? 0;
                var Activas = asesores.FirstOrDefault()?.Activaron ?? 0;
                var BajoAnalisis = asesores.FirstOrDefault()?.BajoAnalisis2 ?? 0;
                var Reubicar = asesores.FirstOrDefault()?.Reubicar2 ?? 0;
                var Disponible = asesores.FirstOrDefault()?.Disponibles ?? 0;
                var Baja = asesores.FirstOrDefault()?.Bajas ?? 0;

                var TotalBruto = asesores.FirstOrDefault()?.Bruto ?? 0;
                var TotalComision = asesores.FirstOrDefault()?.Total ?? 0;
                var TotalComision2 = asesores.FirstOrDefault()?.Total2 ?? 0;

                var DescuentoFiserv = asesores.FirstOrDefault()?.DescuentoFiserv ?? 0;
                var DescuentoPorVisita = asesores.FirstOrDefault()?.DescuentoPorVisitas ?? 0;
                var DescuentoGerencial = asesores.FirstOrDefault()?.DescuentoGerencial ?? 0;
                var DescuentoPorVisitaGerencialYCoordinador = asesores.FirstOrDefault()?.DescuentoPorVisitaGerencialYCoordinador ?? 0;
                var DescuentoPendiente = asesores.FirstOrDefault()?.DescuentoPendiente ?? "0";
                var DescuentoPendiente2 = Convert.ToDouble(DescuentoPendiente, CultureInfo.InvariantCulture);

                var descuentoporgestiones = asesores.FirstOrDefault()?.DescuentoPorGestiones ?? 0;

                var Descuento = DescuentoFiserv + DescuentoGerencial + DescuentoPorVisita + DescuentoPorVisitaGerencialYCoordinador + DescuentoPendiente2 +   descuentoporgestiones;
                var TotalPorCobrar = asesores.FirstOrDefault()?.TotalFinalOk;
                var TotalPorCobrar2 = asesores.FirstOrDefault()?.TotalFinalOk2;

                var Activacion = asesores.FirstOrDefault()?.N3PorActivacion;
                var Facturacion = asesores.FirstOrDefault()?.N3PorFacturacion;

                var nivelactivacion = asesores.FirstOrDefault()?.NivelDeActivacion ??0;
                var comisiondebito = asesores.FirstOrDefault()?.ComisionDebito ?? 0;
                var comision1pago = asesores.FirstOrDefault()?.Comision1Pago?? 0;
                var comisioncredito = asesores.FirstOrDefault()?.ComisionCredito ?? 0;
                var comisionporactivacion = asesores.FirstOrDefault()?.ComisionPorActivacion ?? 0;
                var ajustepositivo = asesores.FirstOrDefault()?.AjustesPositivos?? "0";

                var descuento = Convert.ToString(Descuento);

                var comisiondebito2 = asesores.FirstOrDefault()?.ComisionDebito2 ?? 0;
                var Comision1pago2 = asesores.FirstOrDefault()?.Comision1Pago3 ?? 0;
                var comisioncredito2 = asesores.FirstOrDefault()?.ComisionCredito4 ?? 0;
                var nivel2 = asesores.FirstOrDefault()?.Nivel ?? 0;


                var resultado = new
                {

                    comisiondebito2= comisiondebito2,
                    Comision1pago2=Comision1pago2,
                    comisioncredito2=comisioncredito2,
                    nivel2=nivel2,
                    nombreAsesor = nombreAsesor,
                    Stock = Stock,
                    Alta = Alta,
                    Activas = Activas,
                    BajoAnalisis = BajoAnalisis,
                    Reubicar = Reubicar,
                    Disponible = Disponible,
                    Baja = Baja,
                    TotalBruto = TotalBruto,
                    TotalComision = TotalComision,
                    Descuento = descuento,
                    TotalPorCobrar = TotalPorCobrar,
                    Activacion = Activacion,
                    Facturacion = Facturacion,
                    nivelactivacion = nivelactivacion,
                    comisiondebito = comisiondebito,
                    comision1pago = comision1pago,
                    comisioncredito = comisioncredito,
                    comisionporactivacion = comisionporactivacion,
                    ajustepositivo = ajustepositivo,
                    Analisi = analisis,

                    descuentofiserv = DescuentoFiserv,
                    descuentoPorVisita = DescuentoPorVisita,
                    descuentoGerencial = DescuentoGerencial,
                    descuentoPorVisitaGerencialYCoordinador = DescuentoPorVisitaGerencialYCoordinador,
                    descuentoPendiente = DescuentoPendiente,
                    descuentoPendiente2 = DescuentoPendiente2,
                    descuentoporgestiones = descuentoporgestiones,
                    TotalComision2 = TotalComision2,
                    TotalPorCobrar2 = TotalPorCobrar2,
                };
                return StatusCode(StatusCodes.Status200OK, resultado);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("excelasesores")]
        public async Task<IActionResult> GenerateExcel([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            var asesores = await _InicioAsesores.DatosInicioAsesores(usuarioEncontrado.usuario.Usuario1);
            var analisis = await _analisisService.DatosInicioAsesores(asesores.First().ApellidoYNombre);

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Analisis");

                worksheet.Cell("A1").Value = "Asesor";
                worksheet.Cell("B1").Value = "NombreComercio";
                worksheet.Cell("C1").Value = "Terminal";
                worksheet.Cell("D1").Value = "Credito";
                worksheet.Cell("E1").Value = "Debito";
                worksheet.Cell("F1").Value = "1 Pago";
                worksheet.Cell("G1").Value = "Total";
                worksheet.Cell("H1").Value = "Terminal1";
                worksheet.Cell("I1").Value = "Falta Visita";
               

                int currentRow = 2; 

                foreach (var item in analisis)
                {
                    worksheet.Cell(currentRow, 1).Value = item.Asesor;
                    worksheet.Cell(currentRow, 2).Value = item.NombreComercio;
                    worksheet.Cell(currentRow, 3).Value = item.Terminal;
                    worksheet.Cell(currentRow, 4).Value = item.Credito;
                    worksheet.Cell(currentRow, 5).Value = item.Debito;
                    worksheet.Cell(currentRow, 6).Value = item._1pago;
                    worksheet.Cell(currentRow, 7).Value = item.Total;
                    worksheet.Cell(currentRow, 8).Value = item.Terminal1;
                    worksheet.Cell(currentRow, 9).Value = item.FaltaVisita;
                 
                    currentRow++;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"AnalisisAsesores_{DateTime.Now:yyyyMMddHHmmss}.xlsx");
                }
            }
        }
    }
}
    
