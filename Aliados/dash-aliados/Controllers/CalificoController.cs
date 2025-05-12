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
    public class CalificoController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly ICalificoComentarioService _ComentarioService;
        private readonly IUsuarioZocoService _usuarioZocoService;
      
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenservice;
        public CalificoController(ICalificoComentarioService calificocomentario,IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _ComentarioService = calificocomentario;
        }
        [HttpPost("calificocom")]
        public async Task<ActionResult> calificocom([FromBody] VMCalificoCom request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var entidad = _mapper.Map<CalificoCom>(request);

                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);

                entidad.UsuarioId = usuarioEncontrado.usuario.Id;
                var califico = await _ComentarioService.Crear(entidad);
                return StatusCode(StatusCodes.Status200OK);
          
           
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("califico")]
        public async Task<ActionResult> califico([FromBody] VMCalifico request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var entidad = _mapper.Map<Califico>(request);
                entidad.UsuarioId = usuarioEncontrado.usuario.Id;
                var califico = await _ComentarioService.CrearComentario(entidad);
                return StatusCode(StatusCodes.Status200OK);
               

            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("calificomes")]
        public async Task<ActionResult> calificomes([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
              
                var califico = await _ComentarioService.Califico(usuarioEncontrado.usuario.Id);
                return StatusCode(StatusCodes.Status200OK,califico);
            
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpGet("listacalificacion")]
        public async Task<ActionResult<List<CalificoAsesor>>> Lista()
        {
            var ListaCalifico = await _ComentarioService.ObtenerCalificoAsesores();
            List<CalificoAsesor> listaEnriquecida = new List<CalificoAsesor>();

            foreach (var califico in ListaCalifico)
            {
                var usuairoid = (int)califico.UsuarioId;
                var usuarioInfo = await _usuarioZocoService.ObtenerPorId(usuairoid);
                var listaDatosBase = await _baseService.DatosInicioAliados(usuarioInfo.Usuario1);

                var datoMasReciente = listaDatosBase.OrderByDescending(x => x.FechaDePago).FirstOrDefault();

                if (datoMasReciente != null)
                {
                    CalificoAsesor calificoAsesor = new CalificoAsesor
                    {
                        RazonSocial = datoMasReciente.RazonSocial,
                        AsesorAbm = datoMasReciente.AsesorAbm,
                        NumCalifico = califico.NumCalifico,
                        Descripcion = califico.Descripcion,
                        Fecha = califico.Fecha
                    };

                    listaEnriquecida.Add(calificoAsesor);
                }
            }

            var listaOrdenada = listaEnriquecida.OrderByDescending(c => c.Fecha).ToList();

            return Ok(listaOrdenada);
        }



    }
}
