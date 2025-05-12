using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpleadoController : ControllerBase
    {
        private readonly IUsuarioCajeroService _usuarioCajeroService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public EmpleadoController(IUsuarioCajeroService usuarioCajeroService, ITokenService tokenService, IMapper mapper, IUsuarioZocoService usuarioZocoService)
        {
            _usuarioCajeroService = usuarioCajeroService;
            _tokenService = tokenService;
            _mapper = mapper;
            _usuarioZocoService = usuarioZocoService;

        }
        [HttpPost("listausuarios")]
        public async Task<ActionResult> listausuarios([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var sasLista = await _usuarioCajeroService.Lista();

                if (sasLista == null || sasLista.Count == 0)
                {
                    return NotFound("No hay datos de usuarios");
                }

                var sasListaVM = new List<VMUsuariosZoco>();

                foreach (var usuarioCajero in sasLista)
                {
                    var usuario = await _usuarioZocoService.ObtenerPorId(usuarioCajero.IdUsuario ?? 0);

                    var usuarioVM = _mapper.Map<VMUsuariosZoco>(usuarioCajero);

                    if (usuario != null)
                    {
                        usuarioVM.UsuarioPadre = $"{usuario.Usuario1} {usuario.Nombre}";
                    }

                    sasListaVM.Add(usuarioVM);
                }

                return Ok(sasListaVM);
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }


        [HttpPost("crearusuario")]
        public async Task<ActionResult> CrearUsuario([FromBody] VMUsuariosZoco request)
        {
           
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<UsuarioCajero>(request);

                entidad.IdUsuario = request.IdUsuario;
                var usuariocreado = await _usuarioCajeroService.Crear(entidad);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("editarusuario")]
        public async Task<ActionResult> editarusuario([FromBody] VMUsuariosZoco request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<UsuarioCajero>(request);

                var usuarioeditado = await _usuarioCajeroService.Editar(entidad);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("restaurarclave")]
        public async Task<ActionResult> restaurarclave([FromBody] VMUsuariosZoco request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<UsuarioCajero>(request);



                var usuarioclaverestaurada = await _usuarioCajeroService.RestablecerClaveliquidaciones(entidad.Id);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
    }
}
