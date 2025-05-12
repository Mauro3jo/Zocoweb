using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListaAFIPController : ControllerBase
    {
        private readonly IIIBBService _iibbService;
        private readonly IAFIPService _afipService;
        private readonly IFacturanteService _facturanteService;

        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;

        public ListaAFIPController(IIIBBService iibbservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService, IAFIPService afipService, IFacturanteService facturanteService)
        {
            _iibbService = iibbservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _afipService = afipService;
            _facturanteService = facturanteService;
        }

        [HttpPost("listaafip")]
        public async Task<IActionResult> GetResumenUltimosCincoDias([FromBody] VMDescargarPDFAliados request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return Unauthorized();
            }

            var usuario = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuario.usuario == null)
            {
                return NotFound("Usuario no encontrado");
            }

            int usuarioId = usuario.usuario.Id;

            var afipDocs = await _afipService.ObtenerTodosLosDocumentosPorUsuario(usuarioId);
            var facturanteDocs = await _facturanteService.ObtenerTodosLosDocumentosPorUsuario(usuarioId);
            var iibbDocs = await _iibbService.ObtenerTodosLosDocumentosPorUsuario(usuarioId);

            var afipFechas = afipDocs.Any() ? afipDocs.Select(d => d.FechaSubida.Value).ToArray() : Array.Empty<DateTime>();
            var facturanteFechas = facturanteDocs.Any() ? facturanteDocs.Select(d => d.FechaSubida.Value).ToArray() : Array.Empty<DateTime>();
            var iibbFechas = iibbDocs.Any() ? iibbDocs.Select(d => d.FechaSubida.Value).ToArray() : Array.Empty<DateTime>();

            var fechasDisponibles = afipFechas
                .Concat(facturanteFechas)
                .Concat(iibbFechas)
                .Distinct()
                .OrderBy(d => d)
                .ToArray();

            var result = new
            {
                Afip = new
                {
                    TieneDatos = afipDocs.Any(),
                    FechaSubida = afipDocs.Any() ? afipDocs.Max(d => d.FechaSubida.Value).ToString("MMMM/yyyy") : "No tiene datos",
                    Fechaparamandar = afipDocs.Any() ? afipDocs.Max(d => d.FechaSubida.Value).ToString("dd/MM/yyyy") : "No tiene datos"
                },
                Facturante = new
                {
                    TieneDatos = facturanteDocs.Any(),
                    FechaSubida = facturanteDocs.Any() ? facturanteDocs.Max(d => d.FechaSubida.Value).ToString("MMMM/yyyy") : "No tiene datos",
                    Fechaparamandar = facturanteDocs.Any() ? facturanteDocs.Max(d => d.FechaSubida.Value).ToString("dd/MM/yyyy") : "No tiene datos"
                },
                Iibb = new
                {
                    TieneDatos = iibbDocs.Any(),
                    FechaSubida = iibbDocs.Any() ? iibbDocs.Max(d => d.FechaSubida.Value).ToString("MMMM/yyyy") : "No tiene datos",
                    Fechaparamandar = iibbDocs.Any() ? iibbDocs.Max(d => d.FechaSubida.Value).ToString("dd/MM/yyyy") : "No tiene datos"
                },
                FechasDisponibles = fechasDisponibles.Any()
                    ? fechasDisponibles.Select(d => new
                    {
                        Mes = d.ToString("MMMM/yyyy"),
                        TieneAfip = afipDocs.Any(a => a.FechaSubida.Value == d),
                        TieneFacturante = facturanteDocs.Any(f => f.FechaSubida.Value == d),
                        TieneIibb = iibbDocs.Any(i => i.FechaSubida.Value == d)
                    }).ToArray()
                    : new object[] { new { Mes = "No tiene datos", TieneAfip = false, TieneFacturante = false, TieneIibb = false } }
            };

            return Ok(result);
        }


    }
}
