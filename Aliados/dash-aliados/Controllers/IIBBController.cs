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
    public class IIBBController : ControllerBase
    {
        private readonly IIIBBService _iibbService;

        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;

        public IIBBController(IIIBBService iibbservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService)
        {
            _iibbService = iibbservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
        }
        [HttpPost("pdfiibb")]
        [RequestSizeLimit(524288000)]
        [RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
        public async Task<IActionResult> OrdenesPdf([FromBody] VMAfip request)
        {
            foreach (var file in request.Files)
            {
                var nombreArchivo = file.Name; 
                var match = Regex.Match(nombreArchivo, @"(\d{11}) (\d{8})$");
                if (!match.Success)
                {
                    return BadRequest("El nombre del archivo no tiene el formato esperado con CUIT y fecha al final.");
                }

                string cuit = match.Groups[1].Value;

                string fechaStr = match.Groups[2].Value;

                DateTime fechaSubida;
                if (!DateTime.TryParseExact(fechaStr, "ddMMyyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaSubida))
                {
                    return BadRequest("Formato de fecha inválido.");
                }

                string nombreDocumento = nombreArchivo.Substring(0, match.Index).Trim();

                var usuario = await _usuariozoco.ObtenerPorCuit(cuit);
                if (usuario == null)
                {
                    var bcuit = "33333333333";
                    usuario = await _usuariozoco.ObtenerPorCuit(bcuit);
                }

                var documentoUsuario = new Iibb
                {
                    UsuarioId = usuario.Id,
                    NombreDocumento = nombreDocumento,
                    Cuit = cuit,
                    FechaSubida = fechaSubida,
                    DocumentoPdf = Convert.FromBase64String(file.Content) 
                };

                var PDF = await _iibbService.CrearDocumentoAFIPUsuario(documentoUsuario);
            }

            return Ok();
        }
        [HttpPost("descargarpdfiibb")]
        public async Task<IActionResult> DownloadPdf([FromBody] VMDescargarPDFAliados request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                var documentos = await _iibbService.ObtenerDocumentosAFIPPorUsuarioYFecha(usuarioEncontrado.usuario.Id, DateTime.Parse(request.fecha));

                var documentosDto = documentos.Select(doc => new
                {
                    doc.IibbId,
                    doc.UsuarioId,
                    doc.NombreDocumento,
                    doc.Cuit,
                    FechaSubida = doc.FechaSubida?.ToString("o"), 
                    DocumentoPdfBase64 = doc.DocumentoPdf != null ? Convert.ToBase64String(doc.DocumentoPdf) : null
                }).ToList();

                return Ok(documentosDto);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }
        [HttpGet("resumenUltimosCincoDias")]
        public async Task<IActionResult> GetDocumentSummaryLastFiveDays()
        {
            try
            {
                var resumen = await _iibbService.ObtenerResumenDocumentosAFIPPorUltimosCincoDiasRegistrados();
                return Ok(resumen);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }
    }
}
