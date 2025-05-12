using AutoMapper;
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
    public class LiquidacionesController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;

        private readonly IMapper _mapper;
        private readonly IInflacionService _inflacionService;
        private readonly ITokenService _tokenservice;
        public LiquidacionesController(IBaseDashboardService sasService, ITokenService tok, IMapper mapper, IUsuarioZocoService usuarioZoco, IInflacionService inflacionService)
        {
            _baseService = sasService;

            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _inflacionService = inflacionService;
            _tokenservice = tok;
        }
        [HttpPost("listausuarios")]
        public async Task<ActionResult> listausuarios([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var sasLista = await _usuarioZocoService.Lista();

                if (sasLista == null || sasLista.Count == 0)
                {
                    return NotFound("No hay datos de usuarios");
                }

                var sasListaVM = sasLista.Select(s => _mapper.Map<VMUsuariosZoco>(s)).ToList();
                return Ok(sasListaVM);
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        [HttpPost("crearusuario")]
        public async Task<ActionResult> crearusuario([FromBody] VMUsuariosZoco request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Usuario>(request);

             
                var usuariocreado = await _usuarioZocoService.Crear(entidad);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("editarusuario")]
        public async Task<ActionResult> editarusuario([FromBody] VMUsuariosZoco request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Usuario>(request);

                var usuarioeditado = await _usuarioZocoService.Editar(entidad);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("restaurarclave")]
        public async Task<ActionResult> restaurarclave([FromBody] VMUsuariosZoco request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Usuario>(request);


               
                  var usuarioclaverestaurada = await _usuarioZocoService.RestablecerClaveliquidaciones(entidad.Id);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

    }
}
