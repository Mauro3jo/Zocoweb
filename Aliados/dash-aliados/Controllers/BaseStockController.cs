using AutoMapper;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BaseStockController : ControllerBase
    {
        private readonly IInicioAsesoresService _InicioAsesores;
        private readonly IBaseStockService _BaseStock;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;

        private readonly IMapper _mapper;

        public BaseStockController(IInicioAsesoresService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco, IBaseStockService basestock)
        {
            _InicioAsesores = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _BaseStock = basestock;
        }
        [HttpPost("basestock")]
        public async Task<ActionResult> BaseStock([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var asesores = await _InicioAsesores.DatosInicioAsesores(usuarioEncontrado.usuario.Usuario1);
                var basestock = await _BaseStock.DatosInicioAsesores(asesores.FirstOrDefault().ApellidoYNombre);

                var sumatoriaPorRubro = basestock
                    .GroupBy(bs => bs.Rubro)
                    .Select(grupo => new
                    {
                        Rubro = grupo.Key,
                        SumatoriaFacturacionMesEnCurso = grupo.Sum(bs => bs.FacturaciónMesEnCurso ?? 0)
                    })
                    .ToList();

                var sumatoriaPorDecicion = basestock
                    .GroupBy(bs => bs.DecisionTomada)
                    .Select(grupo => new
                    {
                        DecisionTomada = grupo.Key,
                        Cantidad = grupo.Count()
                    })
                    .ToList();

               
                var agrupadoPorComercio = basestock
                    .GroupBy(bs => bs.Comercio)
                    .Select(grupo => new
                    {
                        Comercio = grupo.Key,
                        Terminales = grupo.Select(bs => new
                        {
                            bs.Terminal,
                            bs.FacturaciónMesPasado,
                            bs.FacturaciónMesEnCurso,
                            bs.Activacion,
                            bs.TipoDeAlta,
                            bs.DecisionTomada
                        }).ToList()
                    })
                    .ToList();

                var nombreAsesor = asesores.FirstOrDefault()?.ApellidoYNombre;
                var Stock = asesores.FirstOrDefault()?.Stock ?? 0;
                var Alta = asesores.FirstOrDefault()?.Altas ?? 0;
                var Activas = asesores.FirstOrDefault()?.Activaron ?? 0;
                var BajoAnalisis = asesores.FirstOrDefault()?.BajoAnalisis2 ?? 0;
                var Reubicar = asesores.FirstOrDefault()?.Reubicar2 ?? 0;
                var Disponible = asesores.FirstOrDefault()?.Disponibles ?? 0;
                var Baja = asesores.FirstOrDefault()?.Bajas ?? 0;

             
                var resultado = new
                {
                    nombreAsesor = nombreAsesor,
                    Stock = Stock,
                    Alta = Alta,
                    Activas = Activas,
                    BajoAnalisis = BajoAnalisis,
                    Reubicar = Reubicar,
                    Disponible = Disponible,
                    Baja = Baja,
                    SumatoriaPorRubro = sumatoriaPorRubro,
                    SumatoriaPorDecicion = sumatoriaPorDecicion,
                    AgrupadoPorComercio = agrupadoPorComercio 
                };

                return StatusCode(StatusCodes.Status200OK, resultado);
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

    }
}
