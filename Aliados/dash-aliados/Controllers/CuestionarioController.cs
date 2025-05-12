using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NAudio.SoundFont;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuestionarioController : ControllerBase
    {
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly ITokenService _tokenService;
        private readonly ICuestionariosService _cuestariosService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ICuestionarioPostulane _cuestionarioPostulane;
        private readonly IPuestoService _puestosService;
        public CuestionarioController(ITokenService tokenService, IMapper mapper, IUsuarioZocoService usuarioZocoService, ITokenPostulanteService tokenPostulanteService,
            ICuestionariosService cuestariosService, ICuestionarioPostulane cuestionarioPostulane, IPuestoService puestosService)
        {
            _tokenPostulanteService = tokenPostulanteService;
            _tokenService = tokenService;
            _cuestariosService = cuestariosService;
            _cuestionarioPostulane = cuestionarioPostulane;
            _puestosService = puestosService;
        }
        [HttpPost("Crear")]
        public async Task<IActionResult> CrearCuestionario([FromBody] VMCuestionario cuestionario)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(cuestionario.token);
            if (esTokenValido)
            {
               

                var nuevocuestionario = new Cuestionario
                {
                    Nombre = cuestionario.Nombre,
                    FechaCreacion = DateTime.Now,
                    MaxPreguntas = cuestionario.MaxPreguntas,
                    IdPuesto = (int)cuestionario.IdPuesto,
                };

                await _cuestariosService.Crear(nuevocuestionario);
                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpGet("obtenercuestionarios")]
        public async Task<IActionResult> ObtenerCuestionarios()
        {
            try
            {
                var cuestionarios = await _cuestariosService.Obtener();
                return Ok(cuestionarios);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener cuestionarios", error = ex.Message });
            }
        }
        [HttpPost("obtenercuestionariosporpuestoid")]
        public async Task<IActionResult> ObtenerCuestionarios([FromBody] VMCuestionario cuestionario)
        {
            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(cuestionario.token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");

            // Obtener el usuario relacionado con el token
            var usuarioEncontrado = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(cuestionario.token);
            if (usuarioEncontrado.usuario == null)
                return Unauthorized("Usuario no encontrado.");
            var puesto = await _puestosService.ObtenerPorId((int)cuestionario.IdPuesto);
            try
            {
                // 1️⃣ Obtener los cuestionarios del puesto
                var cuestionarios = await _cuestariosService.ObtenerPorIdPuesto((int)cuestionario.IdPuesto);

                // 2️⃣ Obtener los cuestionarios que el postulante ya ha respondido
                var cuestionariosPostulante = await _cuestionarioPostulane.ObtenerPostulacionesPorPostulanteIdAsync(usuarioEncontrado.usuario.Id);

                // 3️⃣ Crear un HashSet para verificar rápidamente si un cuestionario ya fue respondido
                var idsCuestionariosRespondidos = cuestionariosPostulante.Select(q => q.IdCuestionario).ToHashSet();

                // 4️⃣ Generar la respuesta incluyendo `YaContestado` y `Nota` (si aplica)
                var cuestionariosConEstado = cuestionarios.Select(c =>
                {
                    var yaContestado = idsCuestionariosRespondidos.Contains(c.Id);
                    var cuestionarioRespondido = yaContestado
                        ? cuestionariosPostulante.FirstOrDefault(q => q.IdCuestionario == c.Id)
                        : null;

                    return new
                    {
                        c.Id,
                        c.Nombre,
                        c.FechaCreacion,
                        c.MaxPreguntas,
                        puesto = puesto.Nombre,
                        YaContestado = yaContestado,
                        Nota = cuestionarioRespondido?.Resultado // puede ser null si no fue respondido
                    };
                }).ToList();

                return Ok(cuestionariosConEstado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener cuestionarios", error = ex.Message });
            }

        }
        [HttpPost("obtenerpostulantescuestionarios")]
        public async Task<IActionResult> Obtenerpoustulantescuestionaris([FromBody] VMCuestionario cuestionario)
        {
            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(cuestionario.token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");

            // Obtener el usuario relacionado con el token
            var usuarioEncontrado = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(cuestionario.token);
            if (usuarioEncontrado.usuario == null)
                return Unauthorized("Usuario no encontrado.");

            try
            {
                // 1️⃣ Obtener los cuestionarios del puesto
                var cuestionarios = await _cuestariosService.ObtenerPorIdPuesto((int)cuestionario.IdPuesto);

                // 2️⃣ Obtener los cuestionarios que el postulante ya ha respondido
                var cuestionariosPostulante = await _cuestionarioPostulane.ObtenerPostulacionesPorPostulanteIdAsync(usuarioEncontrado.usuario.Id);
                var idsCuestionariosRespondidos = cuestionariosPostulante.Select(q => q.IdCuestionario).ToHashSet(); // Convertir a HashSet para búsqueda rápida

                // 3️⃣ Generar respuesta con el flag `YaContestado`
                var cuestionariosConEstado = cuestionarios.Select(c => new
                {
                    c.Id,
                    c.Nombre,
                    c.FechaCreacion,
                    c.MaxPreguntas,
                    YaContestado = idsCuestionariosRespondidos.Contains(c.Id) // Si el ID del cuestionario está en las respuestas, ya fue contestado
                }).ToList();

                return Ok(cuestionariosConEstado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener cuestionarios", error = ex.Message });
            }
        }
       


    }
}
