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
    public class RespuestaUsuarioController : ControllerBase
    {
        private readonly IRespuestasService _respuestasService;
        private readonly ITokenService _tokenService;
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly IRespuestasUsuariosService _respuestausuarioService;  
        private readonly IPostulantesService _postulantesService;
        public RespuestaUsuarioController(IRespuestasService respuestasService, ITokenService tokenService, ITokenPostulanteService tokenPostulanteService,
            IRespuestasUsuariosService respuestausuarioService, IPostulantesService postulantesService)
        {
            _respuestasService = respuestasService;
            _tokenService = tokenService;
            _tokenPostulanteService = tokenPostulanteService;
            _respuestausuarioService = respuestausuarioService;
            _postulantesService = postulantesService;
        }
        [HttpPost("guardarrespuestapostulante")]
        public async Task<IActionResult> GuardarRespuesta([FromBody] VMRespuestaUsuario request)
        {
            if (request == null || !request.IdPregunta.HasValue)
                return BadRequest(new { message = "Datos inválidos" });

            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");
            var IdRespuesta = request.IdRespuesta;
            if (request.Tipo == "Texto")
            {
                Respuesta nuevaRespuesta = new Respuesta
                {
                    IdPregunta = request.IdPregunta ?? 0,
                    RespuestaTexto = request.textorespuesta,
                    EsCorrecta = false
                };
                Respuesta respuestaCreada = await _respuestasService.Crear(nuevaRespuesta);
                IdRespuesta = respuestaCreada.Id;
            }
            // Obtener usuario y su IdPostulante
            var usuario = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuario.usuario == null)
                return Unauthorized(new { message = "Usuario no encontrado" });

            try
            {
                // Obtener la hora actual en Argentina (UTC-3)
                TimeZoneInfo zonaArgentina = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime fechaArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaArgentina);

                // Crear objeto de respuesta
                var nuevaRespuesta = new RespuestasUsuario
                {
                    IdPostulante = usuario.usuario.Id, // Se obtiene del usuario autenticado
                    IdPregunta = request.IdPregunta.Value,
                    IdRespuesta = (int)IdRespuesta,
                    FechaRespuesta = fechaArgentina, // Se usa la hora de Argentina
                };

                // Guardar en la base de datos
                var respuestaCreada = await _respuestausuarioService.Crear(nuevaRespuesta);

                return Ok(new { message = "Respuesta guardada con éxito", respuestaId = respuestaCreada.Id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error al guardar la respuesta", error = ex.Message });
            }

        }


    }
}
