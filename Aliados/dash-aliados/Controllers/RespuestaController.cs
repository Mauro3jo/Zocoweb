using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class RespuestasController : ControllerBase
{
    private readonly IRespuestasService _respuestasService;
    private readonly ITokenService _tokenService;
    public RespuestasController(IRespuestasService respuestasService, ITokenService tokenService)
    {
        _respuestasService = respuestasService;
        _tokenService = tokenService;
    }

    // Crear respuesta
    [HttpPost("crearrespuesta")]
    public async Task<IActionResult> CrearRespuesta([FromBody] VMRespuesta request)
    {
        if (request == null)
            return BadRequest(new { message = "Datos inválidos" });
        bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
        if (esTokenValido)
        {
            try
        {
            Respuesta nuevaRespuesta = new Respuesta
            {
                IdPregunta = request.IdPregunta ?? 0,
                RespuestaTexto = request.RespuestaTexto,
                EsCorrecta = request.EsCorrecta
            };

            Respuesta respuestaCreada = await _respuestasService.Crear(nuevaRespuesta);
            return Ok(new { message = "Respuesta creada con éxito", respuestaId = respuestaCreada.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al crear la respuesta", error = ex.Message });
            }
        }
        return Unauthorized("El token o el ID de la sesión no son válidos");
    }

    // Editar respuesta
    [HttpPut("editarrespuesta")]
    public async Task<IActionResult> EditarRespuesta([FromBody] VMRespuesta request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID de la respuesta es obligatorio." });

        bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
        if (!esTokenValido)
            return Unauthorized("El token o el ID de la sesión no son válidos");

        try
        {
            // Obtener la respuesta existente para evitar modificar el ID
            var respuestaExistente = await _respuestasService.ObtenerPorId(request.Id.Value);
            if (respuestaExistente == null)
                return NotFound(new { message = "No se encontró la respuesta a editar." });

            // Mantiene el ID original y actualiza solo los demás campos
            respuestaExistente.IdPregunta = request.IdPregunta ?? respuestaExistente.IdPregunta;
            respuestaExistente.RespuestaTexto = request.RespuestaTexto ?? respuestaExistente.RespuestaTexto;
            respuestaExistente.EsCorrecta = request.EsCorrecta ?? respuestaExistente.EsCorrecta;

            // Editar la respuesta sin modificar el ID
            await _respuestasService.Editar(respuestaExistente);

            return Ok(new { message = "Respuesta editada con éxito" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al editar la respuesta", error = ex.Message });
        }
    }

    // Eliminar respuesta (ID en el body)
    [HttpDelete("eliminarrespuesta")]
    public async Task<IActionResult> EliminarRespuesta([FromBody] VMRespuesta request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID de la respuesta es obligatorio." });
        bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
        if (esTokenValido)
        {
            try
        {
            bool eliminada = await _respuestasService.Eliminar(request.Id.Value);
            if (!eliminada)
                return NotFound(new { message = "No se encontró la respuesta" });

            return Ok(new { message = "Respuesta eliminada con éxito" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al eliminar la respuesta", error = ex.Message });
            }
        }
        return Unauthorized("El token o el ID de la sesión no son válidos");
    }

    // Obtener todas las respuestas
    [HttpGet("obtenerrespuestas")]
    public async Task<IActionResult> ObtenerRespuestas()
    {
        try
        {
            var respuestas = await _respuestasService.Obtener();
            return Ok(respuestas);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener respuestas", error = ex.Message });
        }
    }

    // Obtener respuesta por ID (ID en el body)
    [HttpPost("obtenerrespuesta")]
    public async Task<IActionResult> ObtenerRespuestaPorId([FromBody] VMRespuesta request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID de la respuesta es obligatorio." });

        try
        {
            var respuesta = await _respuestasService.ObtenerPorId(request.Id.Value);
            if (respuesta == null)
                return NotFound(new { message = "No se encontró la respuesta" });

            return Ok(respuesta);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener la respuesta", error = ex.Message });
        }
    }
    [HttpPost("obtenerrespuestasporpreguntaid")]
    public async Task<IActionResult> obtenerpreguntaporcuestionarioid([FromBody] VMRespuesta request)
    {
        if (request == null || request.IdPregunta == null)
            return BadRequest(new { message = "El ID de la  pregunta es obligatorio." });
        bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
        if (esTokenValido)
        {
            try
            {
                var pregunta = await _respuestasService.ObtenerPorIdPreguntaId((int)request.IdPregunta);
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
}
