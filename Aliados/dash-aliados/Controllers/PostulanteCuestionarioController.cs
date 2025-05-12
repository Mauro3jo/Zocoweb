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
    public class PostulanteCuestionarioController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly IPostulantesService _postulantesService;
        private readonly ICuestionarioPostulane _cuestionarioPostulane;
        private readonly IPreguntasService _preguntaservice;
        private readonly IRespuestasService _respuestasService;
        private readonly IRespuestasUsuariosService _respuestasUsuariosService;
        private readonly ICuestionariosService _cuestionariosService;
        public PostulanteCuestionarioController( ITokenService tokenService, ITokenPostulanteService postulanteService, IPostulantesService postulantesService, 
            ICuestionarioPostulane cuestionarioPostulane, IPreguntasService preguntaservice,IRespuestasService respuestasService,IRespuestasUsuariosService respuestasUsuariosService,
            ICuestionariosService cuestionarioservice)
        {
            _tokenService = tokenService;
            _tokenPostulanteService = postulanteService;
            _postulantesService = postulantesService;
            _cuestionarioPostulane = cuestionarioPostulane;
            _preguntaservice = preguntaservice;
            _respuestasService = respuestasService;
            _respuestasUsuariosService = respuestasUsuariosService;
            _cuestionariosService = cuestionarioservice;
        }
        [HttpPost("crearcuestionariopostulante")]
        public async Task<IActionResult> CrearPostulantePuesto([FromBody] VMCuestionarioPostulantes request)
        {
            if (request == null)
                return BadRequest(new { message = "Datos inválidos" });

            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(request.token);

            if (!esTokenValido)
            {
                return Unauthorized("El token no es válido.");
            }

            // Obtener el usuario relacionado con el token
            var usuarioEncontrado = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);

            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("Usuario no encontrado.");
            }

            int postulanteId = usuarioEncontrado.usuario.Id; // ID del postulante autenticado

            // Verificar si el postulante ya aplicó a este puesto
            var cuestionarioaspuestulaciones = await _cuestionarioPostulane.ObtenerPostulacionesPorPostulanteIdAsync(postulanteId);

            bool yaSePostulo = cuestionarioaspuestulaciones.Any(p => p.IdCuestionario == request.IdCuestionario);

            if (yaSePostulo)
            {
                return BadRequest(new { message = "Ya te has postulado a este puesto." });
            }

            try
            {
                PostulanteCuestionario nuevoPostulantePuesto = new PostulanteCuestionario
                {
                    IdPostulante = postulanteId,
                    IdCuestionario = (int)request.IdCuestionario,
                    FechaCreacion = DateTime.UtcNow.AddHours(-3), // Establece la fecha con horario de Argentina (UTC-3)
                    Resultado = 0,
                
                 };

                PostulanteCuestionario creado = await _cuestionarioPostulane.Crear(nuevoPostulantePuesto);
                return Ok(new { message = "Vínculo postulante-Cuestionario creado con éxito", id = creado.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al crear el vínculo postulante-puesto", error = ex.Message });
            }
        }
        [HttpPost("finalizarcuestionario")]
        public async Task<IActionResult> FinalizarCuestionario([FromBody] VMCuestionarioPostulantes request)
        {
            if (request == null)
                return BadRequest(new { message = "Datos inválidos" });

            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
                return Unauthorized("El token no es válido.");

            // Obtener el usuario relacionado con el token
            var usuarioEncontrado = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuarioEncontrado.usuario == null)
                return Unauthorized("Usuario no encontrado.");

            // Obtener cuestionario y preguntas
            var cuestionario = await _cuestionariosService.ObtenerPorId((int)request.IdCuestionario);
            var preguntas = await _preguntaservice.ObtenerPorIdCuestionarioId(cuestionario.Id);

            if (preguntas == null || preguntas.Count == 0)
                return BadRequest(new { message = "El cuestionario no tiene preguntas." });

            var listaRespuestas = new List<Respuesta>(); // Lista de respuestas del cuestionario

            foreach (var pregunta in preguntas)
            {
                var respuestas = await _respuestasService.ObtenerPorIdPreguntaId(pregunta.Id);
                listaRespuestas.AddRange(respuestas); // Agregar todas las respuestas posibles
            }

            // Obtener respuestas del usuario en este cuestionario
            var respuestasUsuarios = await _respuestasUsuariosService.Obtenerporcuestionarioyusuarioid(usuarioEncontrado.usuario.Id, cuestionario.Id);

            if (respuestasUsuarios == null || respuestasUsuarios.Count == 0)
                return BadRequest(new { message = "No se encontraron respuestas del usuario para este cuestionario." });

            // Calcular puntaje
            int maxPreguntas = cuestionario.MaxPreguntas ?? preguntas.Count;
            decimal puntosPorPregunta = 10m / maxPreguntas;
            decimal puntajeTotal = 0m;

            foreach (var respuestaUsuario in respuestasUsuarios)
            {
                // Buscar la respuesta en la lista de respuestas del cuestionario
                var respuestaCorrecta = listaRespuestas.FirstOrDefault(r => r.IdPregunta == respuestaUsuario.IdPregunta && r.EsCorrecta == true);

                if (respuestaCorrecta != null && respuestaUsuario.IdRespuesta == respuestaCorrecta.Id)
                {
                    puntajeTotal += puntosPorPregunta;
                }
            }

            // Obtener el registro del postulante en este cuestionario
            var postulanteCuestionario = await _cuestionarioPostulane.ObtenerPorIdcuestionario(cuestionario.Id);

            if (postulanteCuestionario == null)
                return BadRequest(new { message = "No se encontró el registro del postulante para este cuestionario." });

            // Actualizar puntaje
            postulanteCuestionario.Resultado = puntajeTotal;

            // Guardar cambios en la base de datos
            await _cuestionarioPostulane.Editar(postulanteCuestionario);

            return Ok(new { message = "Cuestionario finalizado con éxito.", puntajeTotal });
        }

    }
}
