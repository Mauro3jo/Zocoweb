using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Irony.Parsing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LegajoController : ControllerBase
    {
        private readonly ILegajoService _legajoService;
        private readonly INroComercioService _nroComercioService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenService;
        private readonly IPanelControlInterno _panelcontrolinterno;

        public LegajoController(ILegajoService comercioService, IUsuarioZocoService usuariozocoservice, ITokenService tokenService, IPanelControlInterno panelcontrolinterno, INroComercioService nroComercioService)
        {
            _legajoService = comercioService;
            _usuarioZocoService = usuariozocoservice;
            _tokenService = tokenService;
            _panelcontrolinterno = panelcontrolinterno;
            _nroComercioService = nroComercioService;
        }

        [HttpGet("lista")]
        public async Task<ActionResult<List<VMLegajo>>> GetLegajos()
        {
            var legajos = await _legajoService.Lista();
            var usuarios = await _usuarioZocoService.Lista();
            var nrocomericio = await _nroComercioService.Lista();
            // Mapear cada Legajo a VMLegajo
            var vmLegajos = legajos.Select(l => new VMLegajo
            {
                Id = l.Id,
                NroLegajo = l.NroLegajo,
                usuario = l.Iduser.HasValue
                            ? usuarios.FirstOrDefault(u => u.Id == l.Iduser)?.Nombre
                            : null,
                cuit = l.Iduser.HasValue
                            ? usuarios.FirstOrDefault(u => u.Id == l.Iduser)?.Usuario1
                            : null,
                NroComercio1 = nrocomericio.FirstOrDefault(u => u.Legajos == l.Id)?.NroComercio1?.ToString() ?? string.Empty,
                NombreDeFantasia = l.NombreDeFantasia



            }).ToList();

            return Ok(vmLegajos);
        }
        [HttpGet("listacompleto")]
        public async Task<ActionResult<List<VMLegajo>>> GetLegajoscompletos()
        {
            var legajos = await _legajoService.Lista();
            var usuarios = await _usuarioZocoService.Lista();

            var vmLegajos = legajos.Select(l => new VMLegajo
            {
                Id = l.Id,
                NroLegajo = l.NroLegajo,
                Terminal = Convert.ToString(l.Terminal),
                NombreDeFantasia = l.NombreDeFantasia,
                Provincia = l.Provincia,
                FechaDeCarga = l.FechaDeCarga?.ToString("dd/MM/yyyy"),
                Asesor = l.Asesor,
                Iduser = l.Iduser,
                usuario = l.Iduser.HasValue
                            ? usuarios.FirstOrDefault(u => u.Id == l.Iduser)?.Nombre
                            : null,
                cuit = l.Iduser.HasValue
                            ? usuarios.FirstOrDefault(u => u.Id == l.Iduser)?.Usuario1
                            : null
            })
            .OrderBy(l => l.NroLegajo) // Ordena por el número de legajo de mayor a menor
            .ToList();

            return Ok(vmLegajos);
        }
        [HttpPost("crearlegajo")]
        public async Task<ActionResult> Crearlegajo([FromBody] VMLegajo request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            var fechahoy = DateTime.Now;

            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                if (usuarioEncontrado.usuario != null)
                {
                    // Obtener todos los legajos en una lista
                    var legajos = await _legajoService.Lista();

                    // Validar si el número de legajo ya existe
                    if (legajos.Any(l => l.NroLegajo == request.NroLegajo))
                    {
                        return Conflict(new { message = "El número de legajo ya existe." });
                    }

                    // Crear el nuevo legajo
                    var legajo = new Legajo
                    {
                        NroLegajo = request.NroLegajo, // Se cambia la variable a lo enviado por el request
                        Terminal = Convert.ToDouble(request.Terminal),
                        NombreDeFantasia = request.NombreDeFantasia,
                        Provincia = request.Provincia,
                        FechaDeCarga = fechahoy,
                        Asesor = request.Asesor,
                        Iduser = request.Iduser,
                    };
                    await _legajoService.CrearLegao(legajo);

                    // Crear en PanelGestorInterno
                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "LEGAJO",
                        Tipo = "LEGAJO",
                        Aliado = request.NombreDeFantasia,
                        Motivo = "LEGAJO",
                        Estado = "Cerrada",
                        FechaCarga = fechahoy,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = "NUEVO LEGAJO",
                        IdAliado = request.Iduser,
                        NroTerminal = request.Terminal
                    };
                    await _panelcontrolinterno.Crear(panelcontrolinterno);

                    return Ok();
                }
            }
            return Unauthorized();
        }

        [HttpPost("obtenerlegajoporiduser")]
        public async Task<ActionResult> Obtenerlegajoproiduser([FromBody] VMLegajo request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var legajos = await _legajoService.Listausuario((int)request.Iduser);
                return Ok(legajos);
            }
            return Unauthorized();
        }
    }
 }

