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
    public class ContratadoController : ControllerBase
    {
        private readonly IContratadoService _contratadoservice;
        private readonly IBusquedaService _busquedaService;

        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public ContratadoController(IContratadoService contratadoservice, ITokenService tokenService, IMapper mapper, IBusquedaService busquedaService)
        {
            _contratadoservice = contratadoservice;
            _tokenService = tokenService;
            _mapper = mapper;
            _busquedaService = busquedaService;
        }
        [HttpPost("Crear")]
        public async Task<IActionResult> CrearBusqueda([FromBody] VMContratado vmcontratado)
        {
            byte[] fotoBytes = null;
            if (!string.IsNullOrEmpty(vmcontratado.Foto))
            {
                try
                {
                    
                    var base64Data = vmcontratado.Foto.Split(',')[1];
                    fotoBytes = Convert.FromBase64String(base64Data);
                }
                catch (FormatException)
                {
                    return BadRequest("El formato de la foto no es válido.");
                }
            }
            var contratado = new Entity.Zoco.Contratado
            {
                Nombre = vmcontratado.Nombre,
                Edad = vmcontratado.Edad,
                Dni = vmcontratado.Dni,
                Direccion = vmcontratado.Direccion,
                Email = vmcontratado.Email,
                Foto = fotoBytes,
                BusquedaId = vmcontratado.BusquedaId,
                Puesto = vmcontratado.Puesto,
                FechaEntrevista = !string.IsNullOrEmpty(vmcontratado.FechaEntrevista) ? DateTime.Parse(vmcontratado.FechaEntrevista) : (DateTime?)null,
                FechaDeContratacion = !string.IsNullOrEmpty(vmcontratado.FechaDeContratacion) ? DateTime.Parse(vmcontratado.FechaDeContratacion) : (DateTime?)null,
                TipoDeContratacion = vmcontratado.TipoDeContratacion,
                Estado = vmcontratado.Estado,
                FechaDeCierre = !string.IsNullOrEmpty(vmcontratado.FechaDeCierre) ? DateTime.Parse(vmcontratado.FechaDeCierre) : (DateTime?)null,
                Observacion = vmcontratado.Observacion,
                Cv = vmcontratado.Cv
            };

            var nuevaContratado = await _contratadoservice.CrearBusquedaAsync(contratado);

            return StatusCode(200);
        }

        [HttpPost("Editar")]
        public async Task<IActionResult> EditarBusqueda([FromBody] VMContratado vMContratado)
        { 
            byte[] fotoBytes = null;
            if (!string.IsNullOrEmpty(vMContratado.Foto))
            {
                try
                {
                  
                    var base64Data = vMContratado.Foto.Split(',')[1];
                    fotoBytes = Convert.FromBase64String(base64Data);
                }
                catch (FormatException)
                {
                    return BadRequest("El formato de la foto no es válido.");
                }
            }
            var contratado = new Entity.Zoco.Contratado
            {
                Id = vMContratado.Id.HasValue ? vMContratado.Id.Value : 0,
               Nombre = vMContratado.Nombre,
                Edad = vMContratado.Edad,
                Dni = vMContratado.Dni,
                Direccion = vMContratado.Direccion,
                Email = vMContratado.Email,
                  Foto = fotoBytes,
                BusquedaId = vMContratado.BusquedaId,
                Puesto = vMContratado.Puesto,
                FechaEntrevista = !string.IsNullOrEmpty(vMContratado.FechaEntrevista) ? DateTime.Parse(vMContratado.FechaEntrevista) : (DateTime?)null,
                FechaDeContratacion = !string.IsNullOrEmpty(vMContratado.FechaDeContratacion) ? DateTime.Parse(vMContratado.FechaDeContratacion) : (DateTime?)null,
                TipoDeContratacion = vMContratado.TipoDeContratacion,
                Estado = vMContratado.Estado,
                FechaDeCierre = !string.IsNullOrEmpty(vMContratado.FechaDeCierre) ? DateTime.Parse(vMContratado.FechaDeCierre) : (DateTime?)null,
                Observacion = vMContratado.Observacion,
                Cv = vMContratado.Cv
            };

            var busquedaEditada = await _contratadoservice.EditarBusquedaAsync(contratado.Id, contratado);

            if (busquedaEditada == null)
            {
                return NotFound();
            }

            return StatusCode(200);
        }


        [HttpPost("Eliminar")]
        public async Task<IActionResult> EliminarBusqueda([FromBody] VMContratado vMContratado)
        {
            var resultado = await _contratadoservice.EliminarBusquedaAsync((int)vMContratado.Id);
            if (!resultado)
            {
                return NotFound();
            }

            return StatusCode(200);
        }

        [HttpGet("Listar")]
        public async Task<IActionResult> ListarBusquedas()
        {
            var contratados = await _contratadoservice.ListarBusquedasAsync();

            var vMContratadosList = new List<dash_aliados.Models.ViewModelsZoco.VMContratado>();

            foreach (var contratado in contratados)
            {
                string? busquedaNombre = null;
                if (contratado.BusquedaId.HasValue)
                {
                    var busqueda = await _busquedaService.ObtenerBusqueda(contratado.BusquedaId.Value);
                    busquedaNombre = busqueda?.Nombre;
                }

                var vmContratado = new dash_aliados.Models.ViewModelsZoco.VMContratado
                {
                    Id = contratado.Id,
                    Nombre = contratado.Nombre,
                    Edad = contratado.Edad,
                    Dni = contratado.Dni,
                    Direccion = contratado.Direccion,
                    Email = contratado.Email,
                    Foto = contratado.Foto != null ? Convert.ToBase64String(contratado.Foto) : null,
                    BusquedaId = contratado.BusquedaId,
                    BusquedaNombre = busquedaNombre,
                    Puesto = contratado.Puesto,
                    FechaEntrevista = contratado.FechaEntrevista?.ToString("dd/MM/yyyy"),
                    FechaDeContratacion = contratado.FechaDeContratacion?.ToString("dd/MM/yyyy"),
                    TipoDeContratacion = contratado.TipoDeContratacion,
                    Estado = contratado.Estado,
                    FechaDeCierre = contratado.FechaDeCierre?.ToString("dd/MM/yyyy"),
                    Observacion = contratado.Observacion,
                    Cv = contratado.Cv
                };

                vMContratadosList.Add(vmContratado);
            }

            return Ok(vMContratadosList);
        }

        [HttpPost("contratados")]
        public async Task<IActionResult> Contratados([FromBody] VMContratado vMContratado)
        {
            var resultado = await _contratadoservice.Obtenercontratados((int)vMContratado.Id);
            if (resultado == null)
            {
                return NotFound();
            }

            var busqueda = resultado.BusquedaId.HasValue ?
                            await _busquedaService.ObtenerBusqueda(resultado.BusquedaId.Value) :
                            null;

            var vmResultado = new dash_aliados.Models.ViewModelsZoco.VMContratado
            {
                Id = resultado.Id,
                Nombre = resultado.Nombre,
                Edad = resultado.Edad,
                Dni = resultado.Dni,
                Direccion = resultado.Direccion,
                Email = resultado.Email,
                Foto = resultado.Foto != null ? Convert.ToBase64String(resultado.Foto) : null,
                BusquedaId = resultado.BusquedaId,
                BusquedaNombre = busqueda?.Nombre, 
                Puesto = resultado.Puesto,
                FechaEntrevista = resultado.FechaEntrevista?.ToString("dd/MM/yyyy"),
                FechaDeContratacion = resultado.FechaDeContratacion?.ToString("dd/MM/yyyy"),
                TipoDeContratacion = resultado.TipoDeContratacion,
                Estado = resultado.Estado,
                FechaDeCierre = resultado.FechaDeCierre?.ToString("dd/MM/yyyy"),
                Observacion = resultado.Observacion,
                Cv = resultado.Cv
            };

            return Ok(vmResultado);
        }



        [HttpPost("ListarPorMes")]
        public async Task<IActionResult> ListarBusquedasPorMes(int mes)
        {
            var contratados = await _contratadoservice.ListarBusquedasPorMesAsync(mes);
            var vmcontratados = _mapper.Map<IEnumerable<VMBusqueda>>(contratados);

            return Ok(vmcontratados);
        }
    }
}
