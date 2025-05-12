using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TerminalController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariosService;
        private readonly IUsuarioCajeroService _usuariosCajeroService;
        private readonly ITokenService _tokenService;
        private readonly ITokenCajeroService _tokenCajeroService;
        private readonly IComandaService _comandaService;

        public TerminalController(IUsuarioZocoService usuariosService, ITokenService tokenService, IComandaService comandaService, IUsuarioCajeroService usuariosCajeroService, ITokenCajeroService tokenCajeroService)
        {
            _usuariosService = usuariosService;
            _tokenService = tokenService;
            _comandaService = comandaService;
            _usuariosCajeroService = usuariosCajeroService;
            _tokenCajeroService = tokenCajeroService;
        }
        [HttpPost("obtenerterminales")]
        public async Task<ActionResult> Inicio([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            var pendientes = await _comandaService.ListaComandasPorGestorPendientes(usuarioEncontrado.usuario.Id);

            var result = pendientes.Select(p => $"{p.NombredelComercio} {p.NumeroTerminal} {p.Id}")
                                   .Concat(new[] { "otro - especificar en observaciones" })
                                   .ToArray();

            return Ok(result);
        }

    }
}
