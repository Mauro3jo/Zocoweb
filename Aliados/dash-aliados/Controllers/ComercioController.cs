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
    public class ComercioController : ControllerBase
    {
        private readonly IComercioService _ComercioService;
        private readonly INroComercioService _nroComercioService;
        private readonly ITokenService _tokenService;
        private readonly IPanelControlInterno _panelcontrolinterno;
        private readonly ILegajoService _legajoService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        public ComercioController(IComercioService comercioService, INroComercioService nroComercioService,
            ITokenService tokenService,IPanelControlInterno panelcontrolinterno, ILegajoService legajoService, IUsuarioZocoService usuarioZoco)
        {
            _ComercioService = comercioService;
            _nroComercioService = nroComercioService;   
            _tokenService = tokenService;
            _panelcontrolinterno = panelcontrolinterno;
            _legajoService = legajoService;
            _usuarioZocoService = usuarioZoco;
        }

        [HttpGet("lista")]
        public async Task<ActionResult<List<ComercioDto>>> GetComercios()
        {
            var comercios = await _nroComercioService.Lista();


            //      var comercioDtos = comercios
            //.Where(c => !c.Legajos.HasValue && c.NroComercio1.HasValue /*&& c.NroComercio1.Value.ToString().StartsWith("27"))*/) // Filtra los que tienen Legajos como null y NroComercio1 empieza con 27
            //.Select(c => new ComercioDto
            //{
            //    Id = c.Id,
            //    NumComercio = $"{c.NroComercio1?.ToString()} - {c.Categoria}", // Combina NroComercio1 y Categoria
            //        num = Convert.ToString(c.NroComercio1),

            //}).ToList();
            var comercioDtos = comercios
          .Select(c => new ComercioDto
          {
              Id = c.Id,
              NumComercio = $"{c.NroComercio1?.ToString()} - {c.Categoria}", // Combina NroComercio1 y Categoria
              num = Convert.ToString(c.NroComercio1),
          }).ToList();


            return Ok(comercioDtos);
        }
        [HttpGet("listarubros")]
        public async Task<ActionResult<List<string>>> GetRubros()
        {
            var comercios = await _nroComercioService.Lista();

            // Seleccionar solo las categorías distintas
            var categoriasUnicas = comercios
                .Select(c => c.Categoria)
                .Distinct()
                .ToList();

            return Ok(categoriasUnicas);
        }

        [HttpGet("listanrocomercio")]
        public async Task<ActionResult<List<ComercioDto>>> nrcomercio()
        {
            var comercios = await _nroComercioService.Lista();


    

            return Ok(comercios);
        }
        [HttpPost("crearcomercio")]
        public async Task<ActionResult> Obtenerlegajoproiduser([FromBody] ComercioDto request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario != null)
                {
                    var comerciocrear = new NroComercio
                    {
                        NroComercio1 = Convert.ToDouble(request.NroComercio1),
                        NomRubro = request.NomRubro,
                        Categoria = request.Categoria,
                       // Cuotas = request.Cuotas,
                        Legajos = request.Legajos,
                    };
                    var comercio = await _ComercioService.CrearLegao(comerciocrear);
                 var   fechahoy = DateTime.Now;
                    var usuarioaliado = await _legajoService.ObtenerPorId((int)request.Legajos);
                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "NUMERO COMERCIO",
                        Tipo = "NUMERO COMERCIO",
                        Aliado = usuarioaliado.NombreDeFantasia,
                        Motivo = "NUMERO COMERCIO",
                        Estado = "Cerrada",
                        FechaCarga = fechahoy,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = "NUEVO NUMERO COMERCIO",
                        NroTerminal = usuarioaliado.Terminal.ToString(),
                        IdAliado  = usuarioaliado.Iduser,

                    }; await _panelcontrolinterno.Crear(panelcontrolinterno);
                    return Ok(comercio);
                }
            }
            return Unauthorized();
        }
    }
}
