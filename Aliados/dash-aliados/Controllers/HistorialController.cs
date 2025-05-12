using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HistorialController : ControllerBase
    {

        private readonly IHistorialCRMService _Historialcrmservice;

        private readonly ITokenService _tokenservice;
        private readonly IUsuarioZocoService _usuarioZocoservice;
        private readonly IAltaService _altaService;
        private readonly IBajaService _bajaService;
        public HistorialController(ITokenService tok, IHistorialCRMService historialCRMService,
            IUsuarioZocoService usuarioZocoservice, IAltaService altaService, IBajaService bajaService)
        {

            _tokenservice = tok;
            _Historialcrmservice = historialCRMService;
            _usuarioZocoservice = usuarioZocoservice;
            _altaService = altaService;
            _bajaService = bajaService;
        }

        [HttpGet("lista")]
        public async Task<ActionResult<List<HistorialCrm>>> ListaHistorialcrm()
        {
            var historial = await _Historialcrmservice.ObtenerHistorialCRM();
            return Ok(historial);
        }
        [HttpPost("listahistorialcrmporid")]
        public async Task<ActionResult<List<HistorialCrmResponse>>> historialcrmporIdterminal(VMHistorialcrm vMHistorialcrm)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(vMHistorialcrm.token);
            if (esTokenValido)
            {
                int IdTerminal = Convert.ToInt32(vMHistorialcrm.Id);
                var historialList = await _Historialcrmservice.ObtenerHistorialPorTerminal(IdTerminal);

                // Creamos una lista para almacenar las respuestas
                var historialResponseList = new List<HistorialCrmResponse>();

                // Iteramos sobre cada elemento del historial para obtener usuario, alta y baja
                foreach (var historial in historialList)
                {
                    Usuario usuario = null;
                    if(historial.UsuarioId != null)
                    {
                         usuario = await _usuarioZocoservice.ObtenerPorId((int)historial.UsuarioId);

                    }
                      var alta = historial.AltaId.HasValue ? await _altaService.ObtenerPorId(historial.AltaId.Value) : null;
                    var baja = historial.BajaId.HasValue ? await _bajaService.ObtenerPorid(historial.BajaId.Value) : null;

                    var nombreusuario = usuario != null && !string.IsNullOrEmpty(usuario.Nombre) ? usuario.Nombre : "";
                    // Mapeo de los datos a un nuevo modelo de respuesta
                    var nombrecomercio="";
                    var nroterminal = "";
                    if (baja == null)
                    {
                        nombrecomercio = alta.NombreDeFantasia;
                        nroterminal = alta?.NDeTerminal?.ToString();

                    }
                    else
                    {
                        nombrecomercio = baja.NombreDeFantasia;
                        nroterminal = baja?.NDeTerminal?.ToString();
                    }
                    var historialResponse = new HistorialCrmResponse
                    {
                        Id = historial.Id,
                        UsuarioNombre = nombreusuario,               // Nombre del usuario
                    //    AltaId = historial.AltaId,                     // Número de alta
                      //  BajaId = historial.BajaId,                     // Número de baja
                       //    AltaNroTerminal = alta?.NDeTerminal?.ToString(), // Número de terminal en Alta (como string)
                        Nombrecomercio = nombrecomercio, // Número de terminal en Baja (como string)
                        BajaNroTerminal = nroterminal,
                        FechaSubida = historial.FechaSubida,
                        Tipo = historial.Tipo,
                        Observaciones = historial.Observaciones
                    };

                    // Añadimos el historial mapeado a la lista de respuestas
                    historialResponseList.Add(historialResponse);
                }

                // Devolvemos la lista de respuestas
                return Ok(historialResponseList);
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }


        [HttpPost("nuevohistorial")]
        public async Task<ActionResult<List<HistorialCrmResponse>>> nuevohistorial(VMHistorialcrm vMHistorialcrm)
        {        // Devolvemos la lista de respuestas

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(vMHistorialcrm.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMHistorialcrm.token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
                var historial = new HistorialCrm
                {
                    UsuarioId = usuarioEncontrado.usuario.Id,
                    AltaId = vMHistorialcrm.AltaId,
                    FechaSubida = fechaCierreArg,
                    Tipo = vMHistorialcrm.Tipo,
                    Observaciones = vMHistorialcrm.Observaciones ,
                    BajaId = null
                };
                await _Historialcrmservice.Crear(historial);
                return Ok();
            }
                return Unauthorized("El token o el ID de la sesión no son válidos");
    }
    public class HistorialCrmResponse
        {
            public int Id { get; set; }
            public string? UsuarioNombre { get; set; }
            public int? AltaId { get; set; }
            public int? BajaId { get; set; }
            public string? AltaNroTerminal { get; set; }   // Número de terminal en Alta
            public string? BajaNroTerminal { get; set; }   // Número de terminal en Baja
            public string? Nombrecomercio { get; set; }
            public DateTime? FechaSubida { get; set; }
            public string? Tipo { get; set; }
            public string? Observaciones { get; set; }
        }


    }
}
