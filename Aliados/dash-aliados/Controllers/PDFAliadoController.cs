using AutoMapper;
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
    public class PDFAliadoController : ControllerBase
    {
        private readonly IPDFService _pfService;
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;

        public PDFAliadoController(IPDFService pdfservice, IUsuarioZocoService usuarioZoco,ITokenService tokenService)
        {
            _pfService = pdfservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
        }

        [HttpPost("pdfordenes")]
        [RequestSizeLimit(524288000)]
        [RequestFormLimits(MultipartBodyLengthLimit = 524288000)]
        public async Task<IActionResult> OrdenesPdf([FromBody] VMPDFAliado request)
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
                   var  bcuit = "33333333333";
                    usuario = await _usuariozoco.ObtenerPorCuit(bcuit);
                }

                var documentoUsuario = new DocumentosUsuario
                {
                    UsuarioId = usuario.Id,
                    NombreDocumento = nombreDocumento,
                    Cuit = cuit,
                    FechaSubida = fechaSubida,
                    DocumentoPdf = Convert.FromBase64String(file.Content) 
                };

                var PDF = await _pfService.CrearDocumentoUsuario(documentoUsuario);
            }

            return Ok();
        }


        [HttpPost("descargarpdfordenes")]
        public async Task<IActionResult> DownloadPdf([FromBody] VMDescargarPDFAliados request)
        {
            try
            {
                bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
                if (!esTokenValido)
                    return Unauthorized("El token o el ID de la sesión no son válidos");

                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);

                if (!DateTime.TryParse(request.fecha, out var fechaParseada))
                    return BadRequest("Formato de fecha inválido.");

                var documentos = await _pfService.ObtenerDocumentosPorUsuarioYFecha(usuarioEncontrado.usuario.Id, fechaParseada);

                var documentosDto = documentos.Select(doc => new
                {
                    doc.DocumentoId,
                    doc.UsuarioId,
                    doc.NombreDocumento,
                    doc.Cuit,
                    FechaSubida = doc.FechaSubida?.ToString("o"),
                    DocumentoPdfBase64 = doc.DocumentoPdf != null ? Convert.ToBase64String(doc.DocumentoPdf) : null
                }).ToList();

                return Ok(documentosDto);
            }
            catch (Exception ex)
            {
                // Log de error en IIS o consola
                Console.WriteLine($"Error al descargar PDF: {ex.Message}");
                return StatusCode(500, "Error interno al descargar los PDFs.");
            }
        }

        [HttpGet("resumenUltimosCincoDias")]
        public async Task<IActionResult> GetDocumentSummaryLastFiveDays()
        {
            try
            {
                var resumen = await _pfService.ObtenerResumenDocumentosPorUltimosCincoDiasRegistrados();
                return Ok(resumen);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal Server Error: " + ex.Message);
            }
        }
    }
}