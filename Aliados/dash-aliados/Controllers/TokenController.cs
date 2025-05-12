using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Threading.Tasks;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenService _tokenservice;
        private readonly ITokenCajeroService _tokencajeroService;
        private readonly IBaseDashboardService _baseService;
        private readonly ITokenPostulanteService _tokenpostulanteService;
        public TokenController(ITokenService tok, IBaseDashboardService baseService, ITokenCajeroService tokencajeroService, ITokenPostulanteService tokenpostulanteService)
        {
            _tokenservice = tok;
            _baseService = baseService;
            _tokencajeroService = tokencajeroService;
            _tokenpostulanteService = tokenpostulanteService;
        }

        [HttpPost("token")]
        public async Task<IActionResult> ValidarToken([FromBody] VMToken request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                esTokenValido = await _tokencajeroService.ValidarTokenAsync(request.Token);
                if (!esTokenValido)
                {
                    esTokenValido = await _tokenpostulanteService.ValidarTokenAsync(request.Token);
                    if (!esTokenValido)
                    {
                        return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");

                    }
                }
                
            }

            if (esTokenValido)
            {
                // Decodificar el token para obtener el role (que representa el tipoUsuario)
                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(request.Token);

                // Obtener el valor de "role" desde los claims del token
                var roleClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "role");
                int role = roleClaim != null ? int.Parse(roleClaim.Value) : -1;

                // Si el role es 7, devolverlo directamente
                if (role == 7)
                {
                    return StatusCode(StatusCodes.Status200OK, role);
                }
                if (role == 9)
                {
                    return StatusCode(StatusCodes.Status200OK, role);
                }
                // Continuar con la lógica original si role no es 7
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario != null)
                {
                    var rol = usuarioEncontrado.usuario.TipoUsuario;
                    var id = usuarioEncontrado.usuario.Id;
                    return StatusCode(StatusCodes.Status200OK, rol);
                }
                else
                {
                    var usuariocajero = await _tokencajeroService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                    var rol = Convert.ToInt32(usuariocajero.usuario.TipoUsuario);
                    return StatusCode(StatusCodes.Status200OK, rol);
                }
            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }
        [HttpPost("obtenerid")]
        public async Task<IActionResult> ObtenerId([FromBody] VMToken request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
               
                    return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
               
            }

            if (esTokenValido)
            { // Continuar con la lógica original si role no es 7
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario != null)
                {
                    var id = usuarioEncontrado.usuario.Id;
                    return StatusCode(StatusCodes.Status200OK, id);
                }
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");

            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }

        [HttpPost("nohaydatos")]
        public async Task<IActionResult> NoHayDatos([FromBody] VMToken request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var sas = await _baseService.ExistenDatosInicioAliados(usuarioEncontrado.usuario.Usuario1);

                return StatusCode(StatusCodes.Status200OK, sas);
            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }
        [HttpPost("demo")]
        public async Task<IActionResult> Demo([FromBody] VMToken request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                 if(usuarioEncontrado.usuario.Usuario1 == "33333333333")
                {
                    return StatusCode(StatusCodes.Status200OK);

                }
                else
                {
                    return StatusCode(StatusCodes.Status404NotFound);

                }
            }
            else
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }
        }
    }
}
