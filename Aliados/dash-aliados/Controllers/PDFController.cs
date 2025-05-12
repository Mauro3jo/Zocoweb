using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using iTextSharp.text;
using iTextSharp.text.pdf;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PDFController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IMapper _mapper;
        private readonly IComentarioService _ComentarioService;
        private readonly IPDFService _pfService;
        private readonly IMemoryCache _memoryCache;

        public PDFController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok,
            IUsuarioZocoService usuarioZoco, IComentarioService comentarioService, IPDFService pfService, IMemoryCache memoryCache)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _ComentarioService = comentarioService;
            _pfService = pfService;
         _memoryCache = memoryCache;
        }
        [HttpPost("pdf")]
        public async Task<IActionResult> DownloadPdf([FromBody] VMPDF request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);
                var primerDiaMes = new DateTime((int)request.Year, (int)request.Month, 1);
                var ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);
                if (request.comercio.ToLower() == "todos")
                {
                    DateTime fechaMaximaPermitida = ultimoDiaMes;

                    var datosFiltrados = sas.Where(dato => dato.FechaDePago?.Date >= primerDiaMes && dato.FechaDePago?.Date <= fechaMaximaPermitida)
                                            .OrderByDescending(dato => dato.FechaDePago)
                                       .Select(dato => new
                                       {
                                           Terminal = dato.NroDeComercio?.ToString() ?? "",
                                           NroOperacion = dato.NroDeAutorizacion?.ToString() ?? "",
                                           FechaOperacion = dato.FechaOperacion?.ToString("dd/MM/yyyy") ?? "N/A",
                                           FechaPago = dato.FechaDePago?.ToString("dd/MM/yyyy") ?? "N/A",
                                           NroCupon = dato.NroDeCupon?.ToString() ?? "",
                                           NroTarjeta = dato.NroDeTarjeta?.ToString() ?? "",
                                           Tarjeta = dato.Tarjeta ?? "N/A",
                                           Cuotas = dato.Cuotas?.ToString() ?? "N/A",
                                           Bruto = dato.TotalBruto?.ToString("N2") ?? "0.00",
                                           CostoFinancieroEn = dato.CostoFinancieroEn?.ToString("N2") ?? "0.00",
                                           CostoPorAnticipo = dato.CostoPorAnticipo?.ToString("N2") ?? "0.00",
                                           Arancel = dato.Arancel?.ToString("N2") ?? "0.00",
                                           IvaArancel = dato.Iva21?.ToString("N2") ?? "0.00",
                                           ImpDebitoCredito = dato.ImpuestoDebitoCredito?.ToString("N2") ?? "0.00",
                                           RetencionIIBB = dato.RetencionProvincial?.ToString("N2") ?? "0.00",
                                           RetencionGanancia = dato.RetencionGanacia?.ToString("N2") ?? "0.00",
                                           RetencionIVA = dato.RetencionIva?.ToString("N2") ?? "0.00",
                                           TotalOP = dato.TotalConDescuentos?.ToString("N2") ?? "0.00"
                                       })
                                            .ToList();
                    var sumas = datosFiltrados.Aggregate(new
                    {
                        Bruto = "0.00",
                        CostoFinancieroEn = "0.00",
                        CostoPorAnticipo = "0.00",
                        Arancel = "0.00",
                        IvaArancel = "0.00",
                        ImpDebitoCredito = "0.00",
                        RetencionIIBB = "0.00",
                        RetencionGanancia = "0.00",
                        RetencionIVA = "0.00",
                        TotalOP = "0.00"
                    }, (acc, item) => new
                    {
                        Bruto = (Convert.ToDecimal(acc.Bruto) + Convert.ToDecimal(item.Bruto)).ToString("N2"),
                        CostoFinancieroEn = (Convert.ToDecimal(acc.CostoFinancieroEn) + Convert.ToDecimal(item.CostoFinancieroEn)).ToString("N2"),
                        CostoPorAnticipo = (Convert.ToDecimal(acc.CostoPorAnticipo) + Convert.ToDecimal(item.CostoPorAnticipo)).ToString("N2"),
                        Arancel = (Convert.ToDecimal(acc.Arancel) + Convert.ToDecimal(item.Arancel)).ToString("N2"),
                        IvaArancel = (Convert.ToDecimal(acc.IvaArancel) + Convert.ToDecimal(item.IvaArancel)).ToString("N2"),
                        ImpDebitoCredito = (Convert.ToDecimal(acc.ImpDebitoCredito) + Convert.ToDecimal(item.ImpDebitoCredito)).ToString("N2"),
                        RetencionIIBB = (Convert.ToDecimal(acc.RetencionIIBB) + Convert.ToDecimal(item.RetencionIIBB)).ToString("N2"),
                        RetencionGanancia = (Convert.ToDecimal(acc.RetencionGanancia) + Convert.ToDecimal(item.RetencionGanancia)).ToString("N2"),
                        RetencionIVA = (Convert.ToDecimal(acc.RetencionIVA) + Convert.ToDecimal(item.RetencionIVA)).ToString("N2"),
                        TotalOP = (Convert.ToDecimal(acc.TotalOP) + Convert.ToDecimal(item.TotalOP)).ToString("N2")
                    });
                    var respuesta = new
                    {
                        Datos = datosFiltrados,
                        Sumas = sumas,
                        cuit = usuarioEncontrado.usuario.Usuario1
                    };
                    return Ok(respuesta);
                }
                else
                {
                    sas = sas.Where(s => s.NombreComercio != null &&
                   s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();
                    DateTime fechaMaximaPermitida = ultimoDiaMes;

                    var datosFiltrados = sas.Where(dato => dato.FechaDePago?.Date >= primerDiaMes && dato.FechaDePago?.Date <= fechaMaximaPermitida)
                                            .OrderByDescending(dato => dato.FechaDePago)
                                       .Select(dato => new
                                       {
                                           Terminal = dato.NroDeComercio?.ToString() ?? "",
                                           NroOperacion = dato.NroDeAutorizacion?.ToString() ?? "",
                                           FechaOperacion = dato.FechaOperacion?.ToString("dd/MM/yyyy") ?? "N/A",
                                           FechaPago = dato.FechaDePago?.ToString("dd/MM/yyyy") ?? "N/A",
                                           NroCupon = dato.NroDeCupon?.ToString() ?? "",
                                           NroTarjeta = dato.NroDeTarjeta?.ToString() ?? "",
                                           Tarjeta = dato.Tarjeta ?? "N/A",
                                           Cuotas = dato.Cuotas?.ToString() ?? "N/A",
                                           Bruto = dato.TotalBruto?.ToString("N2") ?? "0.00",
                                           CostoFinancieroEn = dato.CostoFinancieroEn?.ToString("N2") ?? "0.00",
                                           CostoPorAnticipo = dato.CostoPorAnticipo?.ToString("N2") ?? "0.00",
                                           Arancel = dato.Arancel?.ToString("N2") ?? "0.00",
                                           IvaArancel = dato.Iva21?.ToString("N2") ?? "0.00",
                                           ImpDebitoCredito = dato.ImpuestoDebitoCredito?.ToString("N2") ?? "0.00",
                                           RetencionIIBB = dato.RetencionProvincial?.ToString("N2") ?? "0.00",
                                           RetencionGanancia = dato.RetencionGanacia?.ToString("N2") ?? "0.00",
                                           RetencionIVA = dato.RetencionIva?.ToString("N2") ?? "0.00",
                                           TotalOP = dato.TotalConDescuentos?.ToString("N2") ?? "0.00"
                                       })
                                            .ToList();
                    var sumas = datosFiltrados.Aggregate(new
                    {
                        Bruto = "0.00",
                        CostoFinancieroEn = "0.00",
                        CostoPorAnticipo = "0.00",
                        Arancel = "0.00",
                        IvaArancel = "0.00",
                        ImpDebitoCredito = "0.00",
                        RetencionIIBB = "0.00",
                        RetencionGanancia = "0.00",
                        RetencionIVA = "0.00",
                        TotalOP = "0.00"
                    }, (acc, item) => new
                    {
                        Bruto = (Convert.ToDecimal(acc.Bruto) + Convert.ToDecimal(item.Bruto)).ToString("N2"),
                        CostoFinancieroEn = (Convert.ToDecimal(acc.CostoFinancieroEn) + Convert.ToDecimal(item.CostoFinancieroEn)).ToString("N2"),
                        CostoPorAnticipo = (Convert.ToDecimal(acc.CostoPorAnticipo) + Convert.ToDecimal(item.CostoPorAnticipo)).ToString("N2"),
                        Arancel = (Convert.ToDecimal(acc.Arancel) + Convert.ToDecimal(item.Arancel)).ToString("N2"),
                        IvaArancel = (Convert.ToDecimal(acc.IvaArancel) + Convert.ToDecimal(item.IvaArancel)).ToString("N2"),
                        ImpDebitoCredito = (Convert.ToDecimal(acc.ImpDebitoCredito) + Convert.ToDecimal(item.ImpDebitoCredito)).ToString("N2"),
                        RetencionIIBB = (Convert.ToDecimal(acc.RetencionIIBB) + Convert.ToDecimal(item.RetencionIIBB)).ToString("N2"),
                        RetencionGanancia = (Convert.ToDecimal(acc.RetencionGanancia) + Convert.ToDecimal(item.RetencionGanancia)).ToString("N2"),
                        RetencionIVA = (Convert.ToDecimal(acc.RetencionIVA) + Convert.ToDecimal(item.RetencionIVA)).ToString("N2"),
                        TotalOP = (Convert.ToDecimal(acc.TotalOP) + Convert.ToDecimal(item.TotalOP)).ToString("N2")
                    });
                    var respuesta = new
                    {
                        Datos = datosFiltrados,
                        Sumas = sumas,
                        cuit = usuarioEncontrado.usuario.Usuario1

                    };
                    return Ok(respuesta);
                }

            }
            else
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

        }
        [HttpPost("pdfordenpago")]
        public async Task<IActionResult> OrdenPago([FromBody] VMPDF request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);
                var FechaPago = DateTime.ParseExact(request.FechaPago, "dd-MM-yyyy", CultureInfo.InvariantCulture);

                    var datosFiltrados = sas.Where(dato => dato.FechaDePago?.Date >= FechaPago && dato.FechaDePago?.Date <= FechaPago)
                                            .OrderByDescending(dato => dato.FechaDePago)
                                       .Select(dato => new
                                       {
                                           Terminal = dato.NroDeComercio?.ToString() ?? "",
                                           NroOperacion = dato.NroDeAutorizacion?.ToString() ?? "",
                                           FechaOperacion = dato.FechaOperacion?.ToString("dd/MM/yyyy") ?? "N/A",
                                           FechaPago = dato.FechaDePago?.ToString("dd/MM/yyyy") ?? "N/A",
                                           NroCupon = dato.NroDeCupon?.ToString() ?? "",
                                           NroTarjeta = dato.NroDeTarjeta?.ToString() ?? "",
                                           Tarjeta = dato.Tarjeta ?? "N/A",
                                           Cuotas = dato.Cuotas?.ToString() ?? "N/A",
                                           Bruto = dato.TotalBruto?.ToString("N2") ?? "0.00",
                                           CostoFinanciero = dato.CostoFinanciero?.ToString("N2") ?? "0.00",
                                           CostoPorAnticipo = dato.CostoPorAnticipo?.ToString("N2") ?? "0.00",
                                           Arancel = dato.Arancel?.ToString("N2") ?? "0.00",
                                           IvaArancel = dato.Iva21?.ToString("N2") ?? "0.00",
                                           ImpDebitoCredito = dato.ImpuestoDebitoCredito?.ToString("N2") ?? "0.00",
                                           RetencionIIBB = dato.RetencionProvincial?.ToString("N2") ?? "0.00",
                                           RetencionGanancia = dato.RetencionGanacia?.ToString("N2") ?? "0.00",
                                           RetencionIVA = dato.RetencionIva?.ToString("N2") ?? "0.00",
                                           TotalOP = dato.TotalConDescuentos?.ToString("N2") ?? "0.00"
                                       })
                                            .ToList();
                    var sumas = datosFiltrados.Aggregate(new
                    {
                        Bruto = "0.00",
                        CostoFinanciero = "0.00",
                        CostoPorAnticipo = "0.00",
                        Arancel = "0.00",
                        IvaArancel = "0.00",
                        ImpDebitoCredito = "0.00",
                        RetencionIIBB = "0.00",
                        RetencionGanancia = "0.00",
                        RetencionIVA = "0.00",
                        TotalOP = "0.00"
                    }, (acc, item) => new
                    {
                        Bruto = (Convert.ToDecimal(acc.Bruto) + Convert.ToDecimal(item.Bruto)).ToString("N2"),
                        CostoFinanciero = (Convert.ToDecimal(acc.CostoFinanciero) + Convert.ToDecimal(item.CostoFinanciero)).ToString("N2"),
                        CostoPorAnticipo = (Convert.ToDecimal(acc.CostoPorAnticipo) + Convert.ToDecimal(item.CostoPorAnticipo)).ToString("N2"),
                        Arancel = (Convert.ToDecimal(acc.Arancel) + Convert.ToDecimal(item.Arancel)).ToString("N2"),
                        IvaArancel = (Convert.ToDecimal(acc.IvaArancel) + Convert.ToDecimal(item.IvaArancel)).ToString("N2"),
                        ImpDebitoCredito = (Convert.ToDecimal(acc.ImpDebitoCredito) + Convert.ToDecimal(item.ImpDebitoCredito)).ToString("N2"),
                        RetencionIIBB = (Convert.ToDecimal(acc.RetencionIIBB) + Convert.ToDecimal(item.RetencionIIBB)).ToString("N2"),
                        RetencionGanancia = (Convert.ToDecimal(acc.RetencionGanancia) + Convert.ToDecimal(item.RetencionGanancia)).ToString("N2"),
                        RetencionIVA = (Convert.ToDecimal(acc.RetencionIVA) + Convert.ToDecimal(item.RetencionIVA)).ToString("N2"),
                        TotalOP = (Convert.ToDecimal(acc.TotalOP) + Convert.ToDecimal(item.TotalOP)).ToString("N2")
                    });
                var primerDiaDelMes = new DateTime(FechaPago.Year, FechaPago.Month, 1);

                var datosDelMes = sas.Where(dato => dato.FechaDePago?.Date >= primerDiaDelMes && dato.FechaDePago?.Date <= FechaPago).ToList();

                decimal acumuladoDebito = 0m, acumuladoCredito = 0m; 
                foreach (var dato in datosDelMes)
                {
                    if (dato.TipoDeCredito == "Debito")
                    {
                        acumuladoDebito += dato.TotalConDescuentos ?? 0;
                    }
                    else
                    {
                        acumuladoCredito += dato.TotalConDescuentos ?? 0;
                    }
                }

                var acumulado = datosDelMes.Sum(dato => dato.TotalConDescuentos ?? 0);

                var datos = sas.Where(dato => dato.FechaDePago?.Date == FechaPago.Date).ToList(); 

                var hoySeAcredita = datos.Sum(dato => dato.TotalConDescuentos ?? 0);
                var RetencionGanancias = datosDelMes.Sum(dato => dato.RetencionGanacia ?? 0);
                var RetencionIva = datosDelMes.Sum(dato => dato.RetencionIva ?? 0);

                var RetencionIbb = datosDelMes.Sum(dato => dato.RetencionProvincial ?? 0);

                var listaNueva = new
                {
                    HoySeAcredita = hoySeAcredita.ToString("N2"),
                    Acumulado = acumulado.ToString("N2"),
                    AcumuladoDebito = acumuladoDebito.ToString("N2"),
                    AcumuladoCredito = acumuladoCredito.ToString("N2"),
                    RetencionGanancias = RetencionGanancias.ToString("N2"),
                    RetencionIva = RetencionIva.ToString("N2"),
                    RetencionIbb = RetencionIbb.ToString("N2")
                };
                var respuesta = new
                    {
                        Datos = datosFiltrados,
                        Sumas = sumas,
                        lista= listaNueva,
                        cuit = usuarioEncontrado.usuario.Usuario1,
                    };
                    return Ok(respuesta);
                
            }
            else
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
        }
            [HttpPost("pdfchatasesor")]
        public async Task<IActionResult> DownloadPdfChatAsesor([FromBody] VMPDFAsesor request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                return Ok();
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");


        }
        [HttpPost("pdfcheksasesor")]
        public async Task<IActionResult> DownloadPdfCheckAsesor([FromBody] VMPDFAsesor request)
        {
            return Ok();
        }
        [HttpPost("pdfchekimagenaudiosasesor")]
        public async Task<IActionResult> DownloadPdfCheckImagenAudioAsesor([FromBody] VMPDFAsesor request)
        {
            return Ok();
        }
        [HttpPost("listaordenespago")]
        public async Task<IActionResult> listaordenpago([FromBody] VMToken request)
         {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);

            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            DateTime fecha;

            // Validar y convertir la fecha
            if (string.IsNullOrEmpty(request.Fecha) || !DateTime.TryParse(request.Fecha, out fecha))
            {
                fecha = DateTime.Now; // Fecha actual si no se proporciona una válida
            }

            // Crear una clave única para el caché
            string cacheKey = $"ListaOrdenPago_{fecha:yyyyMMdd}";

            // Verificar si los datos ya están en el caché
            if (!_memoryCache.TryGetValue(cacheKey, out List<DocumentosUsuario> cachedData))
            {
                try
                {
                    // Obtener datos del servicio
                    var listaDocumentos = await _pfService.ObtenerListaPdf(fecha);

                    // Configurar opciones del caché
                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(10)); // Expira en 10 minutos

                    // Guardar datos en caché
                    _memoryCache.Set(cacheKey, listaDocumentos, cacheEntryOptions);

                    cachedData = listaDocumentos;
                }
                catch (Exception ex)
                {
                    return StatusCode(500, $"Error al obtener la lista de documentos: {ex.Message}");
                }
            }

            // Devolver datos (desde el caché o el servicio)
            return Ok(cachedData);
        }

        [HttpPost("descargarordenpago")]
        public async Task<IActionResult> descargarordenpago([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);

            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            DateTime fecha;
            if (string.IsNullOrEmpty(request.Fecha) || !DateTime.TryParse(request.Fecha, out fecha))
            {
                fecha = DateTime.Now;
            }

            try
            {
                // Realizar consulta al método
                var documentos = await _pfService.ObtenerListaPdfPorCuit(fecha, request.Cuit, request.Id);

                if (documentos == null || !documentos.Any())
                {
                    return NotFound("No se encontraron documentos para los parámetros proporcionados.");
                }

                // Convertir datos para la respuesta
                var resultado = documentos.Select(doc => new
                {
                    DocumentoId = doc.DocumentoId,
                    NombreDocumento = doc.NombreDocumento,
                    Cuit = doc.Cuit,
                    FechaSubida = doc.FechaSubida?.ToString("yyyy-MM-dd"),
                    DocumentoPdf = doc.DocumentoPdf != null
    ? Convert.ToBase64String(doc.DocumentoPdf) // Convertir a Base64
    : null

                }).ToList();

                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al procesar la solicitud: {ex.Message}");
            }
        }

    }
}
