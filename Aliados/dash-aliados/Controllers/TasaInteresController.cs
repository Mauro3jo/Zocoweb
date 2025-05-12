using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TasaInteresController : ControllerBase
    {
        private readonly ITasaInteresService _repotasainteres;
        private readonly IMapper _mapper;
        public TasaInteresController(ITasaInteresService tasainteres, IMapper mapper)
        {
            _repotasainteres = tasainteres;
            _mapper = mapper;
        }
        [HttpGet("tasainteres")]
        public async Task<ActionResult<List<TasaIntere>>> Lista()
        {
            var hoy = DateTime.Now;
            var mesActual = hoy.Month;
            var añoActual = hoy.Year;

            var sasLista = await _repotasainteres.Lista();

            if (sasLista == null || sasLista.Count == 0)
            {
                return NotFound("No hay datos disponibles");
            }

            var sasListaFiltrada = sasLista.Where(tasa =>
         tasa.Fechavencimiento != null &&
         (tasa.Fechavencimiento.Value.Month == mesActual && tasa.Fechavencimiento.Value.Year == añoActual))
         .ToList();

            
            if (sasListaFiltrada.Count == 0)
            {
                mesActual = mesActual == 1 ? 12 : mesActual - 1; 
                añoActual = mesActual == 12 ? añoActual - 1 : añoActual;

                sasListaFiltrada = sasLista.Where(tasa =>
                    tasa.Fechavencimiento?.Month == mesActual && tasa.Fechavencimiento?.Year == añoActual).ToList();

                if (sasListaFiltrada.Count == 0)
                {
                    return NotFound("No hay datos para el mes actual ni para el mes anterior");
                }
            }

            sasListaFiltrada = sasListaFiltrada.OrderBy(tasa => tasa.Fechavencimiento).ToList();

            var sasListaVM = sasListaFiltrada.Select(s => _mapper.Map<TasaIntere>(s)).ToList();

            return Ok(sasListaVM);
        }


    }
}
