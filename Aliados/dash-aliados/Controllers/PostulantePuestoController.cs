using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Mvc;
using NAudio.SoundFont;

[ApiController]
[Route("api/[controller]")]
public class PostulantePuestoController : ControllerBase
{
    private readonly IPreguntasService _preguntasService;
    private readonly IPostulantePuestoService _postulantePuestoService;
    private readonly IPuestoService _puestoService;
    private readonly IPostulantesService _postulantesService;
    private readonly ITokenPostulanteService _tokenPostulanteService;
    public PostulantePuestoController(IPreguntasService preguntasService, IPostulantePuestoService postulantePuestoService, IPuestoService puestoService, IPostulantesService postulantesService, ITokenPostulanteService tokenPostulanteService)
    {
        _preguntasService = preguntasService;
        _postulantePuestoService = postulantePuestoService;
        _puestoService = puestoService;
        _postulantesService = postulantesService;
        _tokenPostulanteService = tokenPostulanteService;
    }

    // Crear una nueva relación postulante-puesto
    [HttpPost("crearpostulantepuesto")]
    public async Task<IActionResult> CrearPostulantePuesto([FromBody] VMPostulantePuesto request)
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
        var postulaciones = await _postulantePuestoService.ObtenerPostulacionesPorPostulanteIdAsync(postulanteId);

        bool yaSePostulo = postulaciones.Any(p => p.IdPuesto == request.IdPuesto);

        if (yaSePostulo)
        {
            return BadRequest(new { message = "Ya te has postulado a este puesto." });
        }

        try
        {
            PostulantePuesto nuevoPostulantePuesto = new PostulantePuesto
            {
                IdPostulante = postulanteId,
                IdPuesto = (int)request.IdPuesto,
                FechaPostulacion = DateTime.UtcNow.AddHours(-3) // Establece la fecha con horario de Argentina (UTC-3)
            };

            PostulantePuesto creado = await _postulantePuestoService.Crear(nuevoPostulantePuesto);
            return Ok(new { message = "Vínculo postulante-puesto creado con éxito", id = creado.Id });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al crear el vínculo postulante-puesto", error = ex.Message });
        }
    }


    // Editar una relación postulante-puesto
    [HttpPut("editarpostulantepuesto")]
    public async Task<IActionResult> EditarPostulantePuesto([FromBody] VMPostulantePuesto request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID del vínculo postulante-puesto es obligatorio." });

        try
        {
            PostulantePuesto postulantePuestoEditado = new PostulantePuesto
            {
                Id = request.Id.Value,
                IdPostulante = request.IdPostulante ?? 0,
                IdPuesto = request.IdPuesto ?? 0,
                FechaPostulacion = request.FechaPostulacion
            };

            PostulantePuesto actualizado = await _postulantePuestoService.Editar(postulantePuestoEditado);
            return Ok(new { message = "Vínculo postulante-puesto editado con éxito" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al editar el vínculo postulante-puesto", error = ex.Message });
        }
    }

    // Eliminar una relación postulante-puesto (ID en el body)
    [HttpDelete("eliminarpostulantepuesto")]
    public async Task<IActionResult> EliminarPostulantePuesto([FromBody] VMPostulantePuesto request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID del vínculo postulante-puesto es obligatorio." });

        try
        {
            bool eliminado = await _postulantePuestoService.Eliminar(request.Id.Value);
            if (!eliminado)
                return NotFound(new { message = "No se encontró el vínculo postulante-puesto" });

            return Ok(new { message = "Vínculo postulante-puesto eliminado con éxito" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al eliminar el vínculo postulante-puesto", error = ex.Message });
        }
    }

    // Obtener todas las relaciones postulante-puesto
    [HttpGet("obtenerpostulantespuestos")]
    public async Task<IActionResult> ObtenerPostulantesPuestos()
    {
        try
        {
            var postulantesPuestos = await _postulantePuestoService.Obtener();
            return Ok(postulantesPuestos);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener vínculos postulante-puesto", error = ex.Message });
        }
    }

    // Obtener relación postulante-puesto por ID (ID en el body)
    [HttpPost("obtenerpostulantepuesto")]
    public async Task<IActionResult> ObtenerPostulantePuestoPorId([FromBody] VMPostulantePuesto request)
    {
        if (request == null || request.Id == null)
            return BadRequest(new { message = "El ID del vínculo postulante-puesto es obligatorio." });

        try
        {
            var postulantePuesto = await _postulantePuestoService.ObtenerPorId(request.Id.Value);
            if (postulantePuesto == null)
                return NotFound(new { message = "No se encontró el vínculo postulante-puesto" });

            return Ok(postulantePuesto);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = "Error al obtener el vínculo postulante-puesto", error = ex.Message });
        }
    }
}
