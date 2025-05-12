using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2016.Excel;
using DocumentFormat.OpenXml.Presentation;
using Entity.Zoco;
using Irony.Parsing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrigenDestinoController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IHistorialCRMService _historialCRMService;

        private readonly IPanelControlInterno _panelControlInterno;
        private readonly IOrigenService _origenService;
        private readonly IDestinoService _destinoService;
        private readonly IAltaService _altaService;
        public OrigenDestinoController( IUsuarioZocoService usuarioZoco, ITokenService tokenService,
            IHistorialCRMService historialCRMService, IPanelControlInterno panelControlInterno, IOrigenService origenService, 
            IDestinoService destinoService, IAltaService altaService)
        {
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _historialCRMService = historialCRMService;
            _panelControlInterno = panelControlInterno;
            _origenService = origenService;
            _destinoService = destinoService;
            _altaService = altaService;
        }
        [HttpGet("obtenerorigenydestino")]
        public async Task<ActionResult<List<DestinoTerminalDTO>>> ObtenerOrigenYDestino()
        {
            // Obtener las listas de orígenes y destinos
            var destinos = await _destinoService.Lista();
            var origenes = await _origenService.Lista();
            // Crear una lista para almacenar los resultados
            List<DestinoTerminalDTO> resultado = new List<DestinoTerminalDTO>();

            // Primero recorremos los orígenes
            foreach (var origen in origenes)
            {
                // Crear un DTO con los valores requeridos del origen
                var origenDTO = new DestinoTerminalDTO
                {
                    Id = origen.Id,
                    IdOrigen = origen.Id,
                    Origen = origen.Origen1 ?? "Sin origen",
                    AltaId = origen.AltaId,
                    Destino = " ", // No tiene destino porque es un origen
                    Fecha = origen.Fecha,
                    Observaciones = origen.Observaciones // Observaciones del origen
                };

                // Agregar el DTO del origen a la lista de resultados
                resultado.Add(origenDTO);

                // Buscar todos los destinos asociados al origen
                var destinosAsociados = destinos.Where(d => d.OrigenId == origen.Id).ToList();

                // Recorrer los destinos asociados al origen y agregarlos después del origen
                foreach (var destino in destinosAsociados)
                {
                    var destinoDTO = new DestinoTerminalDTO
                    {
                        Id = origen.Id,
                        IdOrigen = origen.Id,
                        Origen = origen.Origen1 ?? "Sin origen",
                        AltaId = origen.AltaId,
                        Destino = destino.Destino ?? "Sin destino",
                        Fecha = destino.Fecha,
                        Observaciones = destino.Observaciones ?? origen.Observaciones // Observaciones del destino o del origen
                    };

                    // Agregar el DTO del destino debajo del origen correspondiente
                    resultado.Add(destinoDTO);
                }
            }

            return Ok(resultado);
        }

        [HttpPost("Crearorigen")]
        public async Task<IActionResult> CrearOrigen([FromBody] DestinoTerminalDTO origen)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(origen.Token);
            if (esTokenValido)
            {
                // Obtener el usuario relacionado con el token
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(origen.Token);
                var crm = await _altaService.ObtenerPorId((int)origen.AltaId);

                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }

                // Crear nuevo origen
                var nuevoorigen = new Origen
                {
                    AltaId = origen.AltaId,
                    Origen1 = origen.Origen,
                    Fecha = origen.Fecha,
                    Observaciones = origen.Observaciones
                };

                await _origenService.CrearOrigen(nuevoorigen);

                // Convertir la hora a zona horaria de Argentina
                TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                // Obtener información del alta relacionada con la terminal
                var TerminalAlta = await _altaService.ObtenerPorId((int)origen.AltaId);
                int? idAliado = null;
                if (!string.IsNullOrEmpty(TerminalAlta?.CuitCuil.ToString()))
                {
                    var usuario = await _usuariozoco.ObtenerPorCuit(TerminalAlta.CuitCuil.ToString());
                    idAliado = usuario?.Id;
                }
                // Crear registro en el Panel de Control Interno
                var panelcontrolinterno = new PanelGestorInterno
                {
                    CanalAtencion = "ORIGEN",
                    Tipo = "NUEVO ORIGEN",
                    Aliado = TerminalAlta.NombreDeFantasia,
                    Motivo = "NUEVO ORIGEN",
                    Estado = "Cerrada",
                    FechaCarga = fechaCierreArg,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = origen.Observaciones,
                    IdAliado = idAliado,
                    NroTerminal = TerminalAlta.NDeTerminal.ToString()
                };

                await _panelControlInterno.Crear(panelcontrolinterno);

                // Llamar al servicio para editar destino u origen
                var resultadoEdicion = await _altaService.EditarDestinoUOrigen("Origen", origen.Origen, (int)origen.AltaId);
                if (!resultadoEdicion)
                {
                    return StatusCode(500, "No se pudo editar el destino u origen");
                }

                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        [HttpPost("Creardestino")]
        public async Task<IActionResult> CrearDestino([FromBody] DestinoTerminalDTO destino)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(destino.Token);
            if (esTokenValido)
            {
                // Obtener el usuario relacionado con el token
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(destino.Token);

                // Obtener el origen relacionado con el destino
                var origen = await _origenService.ObtenerPorId((int)destino.IdOrigen);
                var crm = await _altaService.ObtenerPorId((int)origen.AltaId);

                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }

                // Crear nuevo destino
                var destinoTerminal = new DestinoTerminal
                {
                    OrigenId = destino.IdOrigen,
                    Destino = destino.Destino,
                    Fecha = destino.Fecha,
                    Observaciones = destino.Observaciones
                };

                await _destinoService.CrearDestino(destinoTerminal);

                // Convertir la hora a zona horaria de Argentina
                TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                // Obtener información del alta relacionada con el origen
                var origencompleto = await _origenService.ObtenerPorId((int)destino.IdOrigen);
                var TerminalAlta = await _altaService.ObtenerPorId((int)origencompleto.AltaId);
                int? idAliado = null;
                if (!string.IsNullOrEmpty(TerminalAlta?.CuitCuil.ToString()))
                {
                    var usuario = await _usuariozoco.ObtenerPorCuit(TerminalAlta.CuitCuil.ToString());
                    idAliado = usuario?.Id;
                }
                // Crear registro en el Panel de Control Interno
                var panelcontrolinterno = new PanelGestorInterno
                {
                    CanalAtencion = "DESTINO",
                    Tipo = "NUEVO DESTINO",
                    Aliado = TerminalAlta.NombreDeFantasia,
                    Motivo = "NUEVO DESTINO",
                    Estado = "Cerrada",
                    FechaCarga = fechaCierreArg,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = destino.Observaciones,
                    IdAliado = idAliado,
                    NroTerminal = TerminalAlta.NDeTerminal.ToString()
                };

                await _panelControlInterno.Crear(panelcontrolinterno);

                // Llamar al servicio para editar destino u origen
                var resultadoEdicion = await _altaService.EditarDestinoUOrigen("Destino", destino.Destino, (int)origencompleto.AltaId);
                if (!resultadoEdicion)
                {
                    return StatusCode(500, "No se pudo editar el destino u origen");
                }

                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        public class DestinoTerminalDTO
        {
            public string? Token { get; set; }
            public int? Id { get; set; }
            public int? IdOrigen { get; set; }
            public string? Origen { get; set; }
            public int? AltaId { get; set; }
            public string? Destino { get; set; }
            public string? Observaciones { get; set; }
            public DateTime? Fecha { get; set; }
        }


    }
}
