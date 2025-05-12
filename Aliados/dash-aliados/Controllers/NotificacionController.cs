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
    public class NotificacionController : ControllerBase
    {
        private readonly INotificacionService _notificacionservice;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenService;

        public NotificacionController(INotificacionService sasService, IMapper mapper, IUsuarioZocoService usuarioZoco, ITokenService tokenService)
        {
            _notificacionservice = sasService;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _tokenService = tokenService;
        }
        [HttpGet("noticias")]
        public async Task<ActionResult<List<Noticia>>> Lista()
        {
            var sasLista = await _notificacionservice.Lista();

            if (sasLista == null || sasLista.Count == 0)
            {
                return Ok("No hay datos para la lista de Sas");
            }

            var sasListaVM = sasLista.Select(s => _mapper.Map<Noticia>(s)).ToList();

            sasListaVM.Reverse();

            return Ok(sasListaVM);
        }
 
        [HttpPost("crearnoticia")]
        public async Task<ActionResult> CrearNoticia([FromBody] VMNoticia request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Noticia>(request);
                var noticia = await _notificacionservice.Crear(entidad);
                        return StatusCode(StatusCodes.Status200OK);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("editarnoticia")]
        public async Task<ActionResult> EditarNoticia([FromBody] VMNoticia request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<Noticia>(request);
                var noticia = await _notificacionservice.Editar(entidad);
                return StatusCode(StatusCodes.Status200OK);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("eliminarnoticia")]
        public async Task<ActionResult> ELiminarNoticia([FromBody] VMNoticia request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                bool noticia = await _notificacionservice.Eliminar((int)request.Id);
                if(noticia == true)
                {
                    return StatusCode(StatusCodes.Status200OK);

                }
                else
                {
                    return  BadRequest("mientras vos probas esto le estan detonando el ojete a tu señora");

                }
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

    }
}
