using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using dash_aliados.Models.ViewModelsZoco;
using BLL.InterfacesZoco;
using Entity.Zoco;
using BLL.ImplementacionZoco;

namespace dash_aliados.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PreguntasController : ControllerBase
    {
        private readonly IPreguntasService _preguntasService;
        private readonly ITokenService _tokenService;
        private readonly IRespuestasService _respuestasService;
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly ICuestionariosService _cuestionariosService;
        public PreguntasController(IPreguntasService preguntasService, ITokenService tokenService, IRespuestasService respuestasService, ITokenPostulanteService tokenPostulanteService, ICuestionariosService cuestionariosService)
        {
            _preguntasService = preguntasService;
            _tokenService = tokenService;
            _respuestasService = respuestasService;
            _tokenPostulanteService = tokenPostulanteService;
            _cuestionariosService = cuestionariosService;
        }

        // Crear pregunta
        [HttpPost("crearpregunta")]
        public async Task<IActionResult> CrearPregunta([FromBody] VMPreguntas request)
        {
            if (request == null)
                return BadRequest(new { message = "Datos inválidos" });
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                try
                {
                    Pregunta nuevaPregunta = new Pregunta
                    {
                        IdCuestionario = request.IdCuestionario ?? 0,
                        TextoPregunta = request.TextoPregunta,
                        TipoRespuesta = request.TipoRespuesta,
                        TiempoRespuesta = request.TiempoRespuesta
                    };

                    Pregunta preguntaCreada = await _preguntasService.Crear(nuevaPregunta);
                    return Ok(new { message = "Pregunta creada con éxito", preguntaId = preguntaCreada.Id });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error al crear la pregunta", error = ex.Message });
                }
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }

        // Editar pregunta
        [HttpPut("editarpregunta")]
        public async Task<IActionResult> EditarPregunta([FromBody] VMPreguntas request)
        {
            if (request == null || request.Id == null)
                return BadRequest(new { message = "El ID de la pregunta es obligatorio." });

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                try
                {
                    var preguntaExistente = await _preguntasService.ObtenerPorId(request.Id.Value);
                    if (preguntaExistente == null)
                        return NotFound(new { message = "No se encontró la pregunta a editar." });

                    preguntaExistente.IdCuestionario = request.IdCuestionario ?? preguntaExistente.IdCuestionario;
                    preguntaExistente.TextoPregunta = request.TextoPregunta ?? preguntaExistente.TextoPregunta;
                    preguntaExistente.TipoRespuesta = request.TipoRespuesta ?? preguntaExistente.TipoRespuesta;
                    preguntaExistente.TiempoRespuesta = request.TiempoRespuesta ?? preguntaExistente.TiempoRespuesta;

                    Pregunta preguntaActualizada = await _preguntasService.Editar(preguntaExistente);
                    return Ok(new { message = "Pregunta editada con éxito" });
                }
                catch (KeyNotFoundException ex)
                {
                    return NotFound(new { message = ex.Message });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error al editar la pregunta", error = ex.Message });
                }
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }


        // Eliminar pregunta (ID en el body)
        [HttpDelete("eliminarpregunta")]
        public async Task<IActionResult> EliminarPregunta([FromBody] VMPreguntas request)
        {
            if (request == null || request.Id == null)
                return BadRequest(new { message = "El ID de la pregunta es obligatorio." });

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");

            try
            {
                // Primero eliminamos las respuestas asociadas a la pregunta
                bool respuestasEliminadas = await _respuestasService.EliminarPorPreguntaId(request.Id.Value);
                //if (!respuestasEliminadas)
                //    return StatusCode(500, new { message = "Error al eliminar las respuestas de la pregunta" });

                // Ahora eliminamos la pregunta
                bool preguntaEliminada = await _preguntasService.Eliminar(request.Id.Value);
                if (!preguntaEliminada)
                    return NotFound(new { message = "No se encontró la pregunta" });

                return Ok(new { message = "Pregunta y respuestas eliminadas con éxito" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al eliminar la pregunta", error = ex.Message });
            }
        }


        // Obtener todas las preguntas
        [HttpGet("obtenerpreguntas")]
        public async Task<IActionResult> ObtenerPreguntas()
        {
            try
            {
                var preguntas = await _preguntasService.Obtener();
                return Ok(preguntas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener preguntas", error = ex.Message });
            }
        }

        // Obtener pregunta por ID (ID en el body)
        [HttpPost("obtenerpreguntaporid")]
        public async Task<IActionResult> ObtenerPreguntaPorId([FromBody] VMPreguntas request)
        {
            if (request == null || request.Id == null)
                return BadRequest(new { message = "El ID de la pregunta es obligatorio." });

            try
            {
                var pregunta = await _preguntasService.ObtenerPorId(request.Id.Value);
                if (pregunta == null)
                    return NotFound(new { message = "No se encontró la pregunta" });

                return Ok(pregunta);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener la pregunta", error = ex.Message });
            }
        }
        [HttpPost("obtenerpreguntaporcuestionarioid")]
        public async Task<IActionResult> obtenerpreguntaporcuestionarioid([FromBody] VMPreguntas request)
        {
            if (request == null || request.IdCuestionario == null)
                return BadRequest(new { message = "El ID del cuestionario es obligatorio." });
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                try
                {
                    var pregunta = await _preguntasService.ObtenerPorIdCuestionarioId((int)request.IdCuestionario);
                    if (pregunta == null)
                        return NotFound(new { message = "No se encontró la pregunta" });

                    return Ok(pregunta);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "Error al obtener la pregunta", error = ex.Message });
                }
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }
        [HttpPost("obtenerpreguntaporcuestionarioidpostulante")]
        public async Task<IActionResult> ObtenerPreguntaPorCuestionarioIdPostulante([FromBody] VMPreguntas request)
        {
            if (request == null || request.IdCuestionario == null)
                return BadRequest(new { message = "El ID del cuestionario es obligatorio." });

            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");

            try
            {
                // 1️⃣ Obtener todas las preguntas del cuestionario
                var preguntas = await _preguntasService.ObtenerPorIdCuestionarioId((int)request.IdCuestionario);

                // 2️⃣ Obtener el cuestionario para verificar `MaxPreguntas`
                var cuestionario = await _cuestionariosService.ObtenerPorId((int)request.IdCuestionario);
                if (cuestionario == null)
                    return NotFound(new { message = "No se encontró el cuestionario" });

                if (preguntas == null || !preguntas.Any())
                    return NotFound(new { message = "No se encontraron preguntas para este cuestionario" });

                // 3️⃣ Determinar cuántas preguntas devolver
                int maxPreguntas = cuestionario.MaxPreguntas ?? preguntas.Count;

                // 4️⃣ Seleccionar preguntas de manera aleatoria
                Random rnd = new Random();
                var preguntasSeleccionadas = preguntas
                    .OrderBy(p => rnd.Next()) // Ordenar aleatoriamente
                    .Take(maxPreguntas) // Tomar solo `maxPreguntas`
                    .ToList();

                // 5️⃣ Crear una lista de objetos personalizados con respuestas separadas
                var resultado = new List<Dictionary<string, object>>();

                foreach (var pregunta in preguntasSeleccionadas)
                {
                    var respuestas = await _respuestasService.ObtenerPorIdPreguntaId(pregunta.Id);

                    // Construir el objeto con respuestas separadas
                    var objetoPregunta = new Dictionary<string, object>
            {
                { "IdPregunta", pregunta.Id },
                { "TextoPregunta", pregunta.TextoPregunta },
                { "TipoRespuesta", pregunta.TipoRespuesta },
                { "TiempoRespuesta", pregunta.TiempoRespuesta },
                { "IdCuestionario", pregunta.IdCuestionario },
                 {"MaxPreguntas",cuestionario.MaxPreguntas }
            };

                    // Agregar respuestas como propiedades separadas (Respuesta1, IdRespuesta1, EsCorrecta1, etc.)
                    int index = 1;
                    foreach (var respuesta in respuestas)
                    {
                        objetoPregunta[$"Respuesta{index}"] = respuesta.RespuestaTexto;
                        objetoPregunta[$"IdRespuesta{index}"] = respuesta.Id;
                        objetoPregunta[$"EsCorrecta{index}"] = respuesta.EsCorrecta;
                        index++;
                    }

                    resultado.Add(objetoPregunta);
                }

                // 6️⃣ Devolver el resultado final
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al obtener las preguntas", error = ex.Message });
            }
        }



    }

}
