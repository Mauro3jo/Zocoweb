using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly ITokenService _tokenservice;
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService  _usuariozoco;
        private readonly IAltaService _altaService;

        public UsuariosController(ITokenService tok, IBaseDashboardService baseService, IUsuarioZocoService usuariozoco, IAltaService altaService)
        {

            _tokenservice = tok;
            _baseService = baseService;
            _usuariozoco = usuariozoco;
            _altaService = altaService;
        }
        [HttpPost("buscarusuario")]
        public async Task<IActionResult> BuscarUsuario([FromBody] VMUsuario request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _usuariozoco.ObtenerPorCuit(request.Usuario);
                return StatusCode(StatusCodes.Status200OK, usuarioEncontrado);
            }
            else
            {

                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }
        [HttpPost("buscargestor")]
        public async Task<IActionResult> BuscarGestor([FromBody] VMUsuario request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _usuariozoco.ObtenerPorCuitGestor(request.Usuario);
                return StatusCode(StatusCodes.Status200OK, usuarioEncontrado);
            }
            else
            {

                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }
        [HttpGet("obtenergestoresyasesores")]
        public async Task<ActionResult<List<string>>> ObtenerGestoresYAsesores()
        {
            // Obtener todos los usuarios con TipoUsuario igual a 6 o 1
            var usuarios = await _usuariozoco.ObtenerPorCuitGestorYAsesor();

            // Seleccionar solo los nombres de los usuarios
            var nombresUsuarios = usuarios.Select(u => u.Nombre).ToList();

            return Ok(nombresUsuarios);
        }
        [HttpGet("obtenerusuarios")]
        public async Task<ActionResult<List<Usuario>>> ObtenerUsuarios()
        {
            // Obtener todos los usuarios con TipoUsuario igual a 6 o 1
            var usuarios = await _usuariozoco.ObtenerUsuarios();

            // Seleccionar solo los nombres de los usuarios
         //   var nombresUsuarios = usuarios.Select(u => u.Nombre).ToList();

            return Ok(usuarios);
        }
        [HttpGet("obtenerusuariosconterminales")]
        public async Task<ActionResult<List<Usuario>>> ObtenerUsuariosConTerminales()
        {
            // Obtener todos los usuarios con TipoUsuario igual a 6 o 1
            var usuarios = await _usuariozoco.ObtenerUsuarios();

            // Seleccionar solo los nombres de los usuarios
            //   var nombresUsuarios = usuarios.Select(u => u.Nombre).ToList();
           // var terminales = await _altaService
            return Ok(usuarios);
        }



    }
}
