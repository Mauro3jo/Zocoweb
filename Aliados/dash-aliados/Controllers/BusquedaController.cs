using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusquedaController : ControllerBase
    {
        private readonly IBusquedaService _busquedaService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public BusquedaController(IBusquedaService busquedaservice, ITokenService tokenService, IMapper mapper)
        {
            _busquedaService = busquedaservice;
            _tokenService = tokenService;
            _mapper = mapper;

        }
        [HttpPost("Crear")]
        public async Task<IActionResult> CrearBusqueda([FromBody] VMBusqueda busquedaDto)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(busquedaDto.Token);
            if (esTokenValido)
            {
                var nuevaBusqueda = new Busqueda
                {
                    Nombre = busquedaDto.Nombre,

                    FechaPuesto = string.IsNullOrEmpty(busquedaDto.FechaPuesto) ? null : DateTime.Parse(busquedaDto.FechaPuesto),

                    Provincia = busquedaDto.Provincia,
                    Cantidad = busquedaDto.Cantidad,
                    FechaCierre = string.IsNullOrEmpty(busquedaDto.FechaCierre) ? null : DateTime.Parse(busquedaDto.FechaCierre),
                    Estado = busquedaDto.Estado,
                    CantidadDeSolicitantes = busquedaDto.CantidadDeSolicitantes,
                    Seleccionados = busquedaDto.Seleccionados,
                    Finalistas = busquedaDto.Finalistas,
                    Contratados = busquedaDto.Contratados,
                    Rechazados = busquedaDto.Rechazados,
                    Observaciones = busquedaDto.Observaciones,
                    Puesto = busquedaDto.Puesto
                };

                await _busquedaService.CrearBusquedaAsync(nuevaBusqueda);
                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }


        [HttpPost("Editar")]
        public async Task<IActionResult> EditarBusqueda([FromBody] VMBusqueda busquedaDto)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(busquedaDto.Token);
            if (esTokenValido == true)
            {
                var nuevaBusqueda = new Busqueda
                {
                    Id = (int)busquedaDto.Id,
                    Nombre = busquedaDto.Nombre,

                    FechaPuesto = string.IsNullOrEmpty(busquedaDto.FechaPuesto) ? null : DateTime.Parse(busquedaDto.FechaPuesto),

                    Provincia = busquedaDto.Provincia,
                    Cantidad = busquedaDto.Cantidad,
                    FechaCierre = string.IsNullOrEmpty(busquedaDto.FechaCierre) ? null : DateTime.Parse(busquedaDto.FechaCierre),
                    Estado = busquedaDto.Estado,
                    CantidadDeSolicitantes = busquedaDto.CantidadDeSolicitantes,
                    Seleccionados = busquedaDto.Seleccionados,
                    Finalistas = busquedaDto.Finalistas,
                    Contratados = busquedaDto.Contratados,
                    Rechazados = busquedaDto.Rechazados,
                    Observaciones = busquedaDto.Observaciones,
                    Puesto = busquedaDto.Puesto
                };
                var busquedaEditada = await _busquedaService.EditarBusquedaAsync(nuevaBusqueda);

                if (busquedaEditada == null)
                {
                    return NotFound();
                }

                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        [HttpPost("Eliminar")]
        public async Task<IActionResult> EliminarBusqueda([FromBody] VMBusqueda busquedaDto)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(busquedaDto.Token);
            if (esTokenValido == true)
            {
                var resultado = await _busquedaService.EliminarBusquedaAsync(busquedaDto.Id);
                if (!resultado)
                {
                    return NotFound();
                }

                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarBusquedas()
        {
            var busquedas = await _busquedaService.ListarBusquedasAsync();

            return Ok(busquedas);
        }

        [HttpGet("panelrecultamiento")]
        public async Task<IActionResult> Listaarriba()
        {
            var busquedas = await _busquedaService.ListarBusquedasAsync();

            int totalSolicitantes = 0;
            int totalSeleccionados = 0;
            int totalFinalistas = 0;
            int totalContratados = 0;
            int totalRechazados = 0;

            foreach (var busqueda in busquedas)
            {
                totalSolicitantes += string.IsNullOrEmpty(busqueda.CantidadDeSolicitantes) ? 0 : Convert.ToInt32(busqueda.CantidadDeSolicitantes);
                totalSeleccionados += string.IsNullOrEmpty(busqueda.Seleccionados) ? 0 : Convert.ToInt32(busqueda.Seleccionados);
                totalFinalistas += string.IsNullOrEmpty(busqueda.Finalistas) ? 0 : Convert.ToInt32(busqueda.Finalistas);
                totalContratados += string.IsNullOrEmpty(busqueda.Contratados) ? 0 : Convert.ToInt32(busqueda.Contratados);
                totalRechazados += string.IsNullOrEmpty(busqueda.Rechazados) ? 0 : Convert.ToInt32(busqueda.Rechazados);
            }

            var result = new
            {
                TotalSolicitantes = totalSolicitantes,
                TotalSeleccionados = totalSeleccionados,
                TotalFinalistas = totalFinalistas,
                TotalContratados = totalContratados,
                TotalRechazados = totalRechazados
            };

            return Ok(result);
        }


        [HttpPost("grafica")]
        public async Task<IActionResult> grafica([FromBody] VMBusqueda busquedaDto)

        {
            if(busquedaDto.Id == null)
            {
                var busquedas = await _busquedaService.ObtenerSumatoriaORegistroEspecifico(busquedaDto.Id);

                return Ok(busquedas);
            }
            else
            {
                var busquedas = await _busquedaService.ObtenerSumatoriaORegistroEspecifico(busquedaDto.Id);

                return Ok(busquedas);

            }
        }

        [HttpPost("ListarPorMes")]
        public async Task<IActionResult> ListarBusquedasPorMes(int mes)
        {
            var busquedas = await _busquedaService.ListarBusquedasPorMesAsync(mes);
            var busquedasDto = _mapper.Map<IEnumerable<VMBusqueda>>(busquedas);

            return Ok(busquedasDto);
        }
    }
}
