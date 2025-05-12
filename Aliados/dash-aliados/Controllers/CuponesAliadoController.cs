using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuponesAliadoController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;

        private readonly IMapper _mapper;
        private readonly IInflacionService _inflacionService;
        private readonly ITokenService _tokenservice;
        public CuponesAliadoController(IBaseDashboardService sasService, ITokenService tok, IMapper mapper, IUsuarioZocoService usuarioZoco, IInflacionService inflacionService)
        {
            _baseService = sasService;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _inflacionService = inflacionService;
            _tokenservice = tok;
        }
        [HttpPost("cuponesaliado")]
        public async Task<ActionResult> CuponesAliado([FromBody] VMCuponesAliado request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return BadRequest();
            }

            // Obtener la fecha del token, o usar el día de hoy si no se especifica
            DateTime fechaToken;
            if (string.IsNullOrEmpty(request.fecha))
            {
                fechaToken = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaToken = DateTime.ParseExact(request.fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    fechaToken = DateTime.Now;
                }
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("Usuario no encontrado.");
            }

            // Buscar cupones por los filtros dados, usando Usuario1 como CUIT
            var cuponesaliado = await _baseService.BuscarCuponesPorFiltros(
                usuarioEncontrado.usuario.Usuario1, // CUIT
                request.fecha,
                request.bruto,
                request.ultimos4digitos,
                request.tarjeta,
                request.cuotas
            );

            return Ok(cuponesaliado);
        }
    }
}
