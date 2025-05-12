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
    public class InflacionController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariosService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IInflacionService _inflacionService;

        public InflacionController(IUsuarioZocoService usuariosService, ITokenService tokenService, IMapper mapper, IConfiguration config, IInflacionService inflacionService)
        {
            _usuariosService = usuariosService;
            _tokenService = tokenService;
            _mapper = mapper;
            _inflacionService = inflacionService;

        }

        [HttpPost("CrearInflacion")]

   
        public async Task<ActionResult> crearusuario([FromBody] VMInflacion request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Inflacion>(request);


                var usuariocreado = await _inflacionService.Crear(entidad);
                return StatusCode(StatusCodes.Status200OK);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }



    }
}
