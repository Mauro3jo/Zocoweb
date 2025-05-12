using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DatosInicioAsesoresController : ControllerBase
    {
        private readonly IInicioAsesoresService _InicioAsesores;
        private readonly IBaseStockService _BaseStock;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IComentarioService _comentarioService;

        private readonly IMapper _mapper;

        public DatosInicioAsesoresController(IInicioAsesoresService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco,IBaseStockService basestock, IComentarioService comentarioService)
        {
            _InicioAsesores = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _BaseStock = basestock;
            _comentarioService = comentarioService;
        }
        [HttpPost("inicioasesores")]
        public async Task<ActionResult> Inicio([FromBody] VMToken request)
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
       .OrderByDescending(x => x.SumatoriaFacturacionMesEnCurso) 
       .ToList();

                var sumatoriaTotalFacturacionMesEnCurso = basestock.Sum(bs => bs.FacturaciónMesEnCurso ?? 0);
                var sumatoriaTotalFacturacionMesPasado = basestock.Sum(bs => bs.FacturaciónMesPasado ?? 0);
                var nombreAsesor = asesores.FirstOrDefault()?.ApellidoYNombre;
                var Alta = asesores.FirstOrDefault()?.Altas ?? 0;
                var Baja = asesores.FirstOrDefault()?.Bajas ?? 0;
                var Activas = asesores.FirstOrDefault()?.Activaron ?? 0;
                var BajoAnalisis = asesores.FirstOrDefault()?.BajoAnalisis2 ?? 0;
                var Reubicar = asesores.FirstOrDefault()?.Reubicar2 ?? 0;
                var Disponible = asesores.FirstOrDefault()?.Disponibles ?? 0;
                var TotalComision = asesores.FirstOrDefault()?.Total ?? 0;
                var TotalComision2 = asesores.FirstOrDefault()?.Total2 ?? 0;

                var DescuentoFiserv = asesores.FirstOrDefault()?.DescuentoFiserv ?? 0;
                var DescuentoPorVisita = asesores.FirstOrDefault()?.DescuentoPorVisitas ?? 0;
                var DescuentoGerencial = asesores.FirstOrDefault()?.DescuentoGerencial ?? 0;
                var DescuentoPorVisitaGerencialYCoordinador = asesores.FirstOrDefault()?.DescuentoPorVisitaGerencialYCoordinador ?? 0;
                var DescuentoPendiente = asesores.FirstOrDefault()?.DescuentoPendiente ?? "0";
                var DescuentoPendiente2 = Convert.ToDouble(DescuentoPendiente, CultureInfo.InvariantCulture);

                var Stock = asesores.FirstOrDefault()?.Stock ?? 0;
                var descuentoporgestiones = asesores.FirstOrDefault()?.DescuentoPorGestiones ?? 0;

                var Descuento = DescuentoFiserv + DescuentoGerencial + DescuentoPorVisita + DescuentoPorVisitaGerencialYCoordinador + DescuentoPendiente2 + descuentoporgestiones;
                var TotalPorCobrar = asesores.FirstOrDefault()?.TotalFinalOk;
                var TotalPorCobrar2 = asesores.FirstOrDefault()?.TotalFinalOk2;

                var comisionMesPasado = asesores.FirstOrDefault()?.ComisionMesPasado;
                var ventasmesactual = asesores.FirstOrDefault().VentasMesActual;
                var ventasmespasado = asesores.FirstOrDefault()?.VentasMesPasado;
                var Credito = asesores.FirstOrDefault()?.Credito;
                var pago1 = asesores.FirstOrDefault()?._1Pago;
                var debito = asesores.FirstOrDefault()?.Debito;

                var Activacion = asesores.FirstOrDefault()?.N3PorActivacion;
                var Facturacion = asesores.FirstOrDefault()?.N3PorFacturacion;

                var resultado = new
                {
                    nombreAsesor = nombreAsesor,
                    Alta = Alta,
                    Baja = Baja,
                    Activas = Activas,
                    BajoAnalisis = BajoAnalisis,
                    Reubicar = Reubicar,
                    Disponible = Disponible,
                    TotalComision = TotalComision,
                    Descuento = Descuento,
                    Stock = Stock,
                    TotalPorCobrar = TotalPorCobrar,
                    SumaPorRubro = sumatoriaPorRubro,
                    SumatoriaTotalMesActual = sumatoriaTotalFacturacionMesEnCurso,
                    SumatoriaTotalMesPasado = sumatoriaTotalFacturacionMesPasado,
                    ComisionMesPasado = comisionMesPasado,
                    VentaMesActual = ventasmesactual,
                    ventasmespasado = ventasmespasado,
                    Credito = Credito,
                    pago1 = pago1,  
                    debito = debito,
                    Facturacion= Facturacion,   
                    Activacion= Activacion,
                    TotalComision2= TotalComision2,
                    TotalPorCobrar2= TotalPorCobrar2,
                

                };
                return StatusCode(StatusCodes.Status200OK, resultado);


            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpGet("listarAsesores")]
        public async Task<IActionResult> ListarTodosLosAsesores()
        {
            try
            {
                var asesores = await _InicioAsesores.ListaAsesores();
                var usuarios = await _usuarioZocoService.Lista();
                var comentarios = await _comentarioService.ListarComentariosAsync();

                var resultado = asesores.Select(asesor =>
                {
                    var usuario = usuarios.FirstOrDefault(u => Convert.ToString(u.Usuario1) == Convert.ToString(asesor.CuitCuil));
                    if (usuario != null)
                    {
                        var comentariosDelUsuario = comentarios
                            .Where(c => c.IdUsuarioRespuesta == usuario.Id)
                            .OrderByDescending(c => c.FechaCreacion)
                            .ToList();

                        int sumatoriaComentarios = 0;
                        foreach (var comentario in comentariosDelUsuario)
                        {
                            if (comentario.IdUsuarioRespuesta == usuario.Id)
                            {
                                sumatoriaComentarios++;
                            }
                            else
                            {
                                break;
                            }
                        }

                        return new
                        {
                            ApellidoYNombre = asesor.ApellidoYNombre,
                            CuitCuil = Convert.ToString(asesor.CuitCuil),
                            SumatoriaComentarios = sumatoriaComentarios
                        };
                    }
                    else
                    {
                        return new
                        {
                            ApellidoYNombre = asesor.ApellidoYNombre,
                            CuitCuil = Convert.ToString(asesor.CuitCuil),
                            SumatoriaComentarios = 0
                        };
                    }
                }).ToList();


                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "No se pudieron obtener los Asesores debido a un error interno del servidor." });
            }
        }
        private int SumarComentariosRelacionados(IEnumerable<Comentario> comentarios, int idUsuario)
        {
            int sumatoria = 0;
            bool usuarioEncontradoComoRespuesta = false;

            var comentariosFiltrados = comentarios;

            foreach (var comentario in comentariosFiltrados)
            {

               
                if (comentario.IdUsuarioRespuesta == idUsuario)
                {
                    sumatoria++;
                    usuarioEncontradoComoRespuesta = false;
                }
                else 
                {
                    usuarioEncontradoComoRespuesta = true;

                }

            }

            return sumatoria;
        }

    }
}
