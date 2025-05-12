using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Presentation;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PuestoController : ControllerBase
    {
        private readonly IPuestoService _puestoService;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        private readonly IPostulantePuestoService _postulantePuestoService;
        private readonly ITokenPostulanteService _tokenPostulanteService;
        private readonly IPostulantesService _postulantesService;
        private readonly ICuestionarioPostulane _cuestionariopostulanteService;
        private readonly ICuestionariosService _cuestionariosService;
        private readonly IPreguntasService _preguntasService;
        private readonly IRespuestasService _respuestaService;
        private readonly IRespuestasUsuariosService _respuestasUsuariosService;
        public PuestoController(IPuestoService puestoservice, ITokenService tokenService, IMapper mapper, IPostulantePuestoService postulantePuestoService, 
            ITokenPostulanteService tokenPostulanteService, IPostulantesService postulantesService,ICuestionarioPostulane cuestionariopostulanteService, ICuestionariosService cuestionariosService,
            IPreguntasService preguntasService,IRespuestasService respuestasService, IRespuestasUsuariosService respuestasUsuariosService)
        {
            _puestoService = puestoservice;
            _tokenService = tokenService;
            _mapper = mapper;
            _postulantePuestoService = postulantePuestoService;
            _tokenPostulanteService = tokenPostulanteService;
            _postulantesService = postulantesService;
            _cuestionariopostulanteService = cuestionariopostulanteService;
            _cuestionariosService = cuestionariosService;
            _preguntasService = preguntasService;
            _respuestaService = respuestasService;
            _respuestasUsuariosService = respuestasUsuariosService;
        }
        [HttpPost("Crear")]
        public async Task<IActionResult> CrearPuesto([FromBody] VMPuesto Puesto)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(Puesto.Token);
            if (esTokenValido)
            {
                byte[] fotoBytes = null;
                if (!string.IsNullOrEmpty(Puesto.Foto))
                {
                    try
                    {
                        
                        var base64Data = Puesto.Foto.Split(',')[1];
                        fotoBytes = Convert.FromBase64String(base64Data);
                    }
                    catch (FormatException)
                    {
                        return BadRequest("El formato de la foto no es válido.");
                    }
                }

                var nuevoPuesto = new Puesto
                {
                    Nombre = Puesto.Nombre,
                    Requisitos = Puesto.Requisitos,
                    PrincipalesTareas = Puesto.PrincipalesTareas,
                    Ofrecemos = Puesto.Ofrecemos,
                    Foto = fotoBytes,
                    FechaCreacion = DateTime.UtcNow.AddHours(-3), // Ajusta la hora a UTC-3
                    EstaActivo = true,
                    Provincia = Puesto.Provincia,
                    Localidad = Puesto.Localidad,   
                    Jornada  = Puesto.Jornada,
                    Duracion = Puesto.Duracion,
                    Modalidad = Puesto.Modalidad,
                };


                await _puestoService.CrearBusquedaAsync(nuevoPuesto);
                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("editar")]
        public async Task<IActionResult> EditarPuesto([FromBody] VMPuesto Puesto)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(Puesto.Token);
            if (esTokenValido)
            {
                byte[] fotoBytes = null;
                if (!string.IsNullOrEmpty(Puesto.Foto))
                {
                    try
                    {
                        
                        var base64Data = Puesto.Foto.Split(',')[1];
                        fotoBytes = Convert.FromBase64String(base64Data);
                    }
                    catch (FormatException)
                    {
                        return BadRequest("El formato de la foto no es válido.");
                    }
                }
                var nuevoPuesto = new Puesto
                {
                    Id = (int)Puesto.Id,
                    Nombre = Puesto.Nombre,
                    Requisitos = Puesto.Requisitos,
                    PrincipalesTareas = Puesto.PrincipalesTareas,
                    Ofrecemos = Puesto.Ofrecemos,

                    Foto = fotoBytes,
                    EstaActivo = true,
                    Provincia = Puesto.Provincia,
                    Localidad = Puesto.Localidad,
                    Jornada = Puesto.Jornada,
                    Duracion = Puesto.Duracion,
                    Modalidad = Puesto.Modalidad,
                };

                await _puestoService.EditarBusquedaAsync(nuevoPuesto);
                return StatusCode(200);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpGet("Listar")]
        public async Task<IActionResult> ListarPuestos()
        {
            var Puesto = await _puestoService.ListarBusquedasAsync();


            return Ok(Puesto);
        }
        [HttpPost("Listapuestospostulantes")]
        public async Task<IActionResult> ListarPuestosPostulantes([FromBody] VMPuesto Puest)
        {
            bool esTokenValido = await _tokenPostulanteService.ValidarTokenAsync(Puest.Token);

            bool estaLogueado = esTokenValido;
            int? postulanteId = null;
            List<int> postulacionesIds = new List<int>();

            if (esTokenValido)
            {
                // Obtener el usuario relacionado con el token
                var usuarioEncontrado = await _tokenPostulanteService.ObtenerTokenYUsuarioPorUsuarioIdAsync(Puest.Token);

                if (usuarioEncontrado.usuario != null)
                {
                    postulanteId = usuarioEncontrado.usuario.Id;

                    // Obtener la lista de postulaciones del usuario autenticado
                    var postulaciones = await _postulantePuestoService.ObtenerPostulacionesPorPostulanteIdAsync(postulanteId.Value);
                    postulacionesIds = postulaciones.Select(p => p.IdPuesto).ToList();
                }
            }

            // Obtener la lista de todos los puestos
            var puestos = await _puestoService.ListarBusquedasAsync();

            // Crear la lista de respuesta con la información completa de los puestos y el estado de postulación
            var resultado = puestos.Select(puesto => new
            {
                Id = puesto.Id,
                Nombre = puesto.Nombre,
                Requisitos = puesto.Requisitos,
                PrincipalesTareas = puesto.PrincipalesTareas,
                Ofrecemos = puesto.Ofrecemos,
                Provincia = puesto.Provincia,
                Localidad = puesto.Localidad,
                Jornada = puesto.Jornada,
                Duracion = puesto.Duracion,
                Modalidad = puesto.Modalidad,
                HaPostulado = estaLogueado && postulacionesIds.Contains(puesto.Id), // Si está logueado, verifica; si no, es false
                EstaLogueado = estaLogueado
            }).ToList();

            return Ok(resultado);

        }

        [HttpPost("resultadospostulantes")]
        public async Task<IActionResult> ResultadosPostulantes([FromBody] VMPuesto Puest)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(Puest.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token no es válido.");
            }

            // Obtener el puesto
            var puesto = await _puestoService.ObtenerPorId((int)Puest.Id);
            if (puesto == null)
            {
                return NotFound("Puesto no encontrado.");
            }

            // Obtener postulaciones al puesto
            var postulaciones = await _postulantePuestoService.ObtenerPostulacionesPorPuestoIdAsync(puesto.Id);

            List<PostulanteDto> listaPostulantes = new List<PostulanteDto>();

            foreach (var postulacion in postulaciones)
            {
                var postulante = await _postulantesService.ObtenerPorId(postulacion.IdPostulante);
                if (postulante == null) continue;

                // Obtener cuestionarios en los que el postulante ha participado
                var cuestionariosPostulante = await _cuestionariopostulanteService.ObtenerPostulacionesPorPostulanteIdAsync(postulante.Id);

                // Si el postulante no tiene cuestionarios, no lo agregamos a la lista
                if (cuestionariosPostulante == null || !cuestionariosPostulante.Any()) continue;

                // Obtener datos de la entidad PostulanteCuestionario
                var postulanteCuestionarios = await _cuestionariopostulanteService.ObtenerPostulacionesPorPostulanteIdAsync(postulante.Id);

                var postulanteDto = new PostulanteDto
                {
                    Id = postulante.Id,
                    Nombre = postulante.Nombre,
                    Correo = postulante.Correo,
                    Telefono = postulante.Telefono,
                    Direccion = postulante.Direccion,
                    Dni = postulante.Dni,
                    Estado = postulante.Estado,
                    TipoUsuario = postulante.TipoUsuario,
                    Localidad = postulante.Localidad,
                    Provincia = postulante.Provincia,
                    FechaCreacion = postulante.FechaCreacion,
                    Cuestionarios = new List<CuestionarioDto>(),
                    PostulanteCuestionarios = postulanteCuestionarios.Select(pc => new PostulanteCuestionarioDto
                    {
                        Id = pc.Id,
                        IdPostulante = pc.IdPostulante,
                        IdCuestionario = pc.IdCuestionario,
                        FechaCreacion = pc.FechaCreacion,
                        Resultado = pc.Resultado
                    }).ToList()
                };

                foreach (var cuestionarioPostulante in cuestionariosPostulante)
                {
                    var cuestionario = await _cuestionariosService.ObtenerPorId(cuestionarioPostulante.IdCuestionario);
                    if (cuestionario == null) continue;
                    if (cuestionario.IdPuesto != puesto.Id) continue;
                    var preguntas = await _preguntasService.ObtenerPorIdCuestionarioId(cuestionario.Id);
                    var cuestionarioDto = new CuestionarioDto
                    {
                        Id = cuestionario.Id,
                        Nombre = cuestionario.Nombre,
                        FechaCreacion = cuestionario.FechaCreacion,
                        NotaAprobacion = cuestionario.NotaAprobacion,
                        MaxPreguntas = cuestionario.MaxPreguntas,
                        Preguntas = new List<PreguntaDto>()
                    };

                    foreach (var pregunta in preguntas)
                    {
                        var respuestas = await _respuestaService.ObtenerPorIdPreguntaId(pregunta.Id);
                        var respuestasUsuario = await _respuestasUsuariosService.Obtenerporcuestionarioyusuarioid(cuestionario.Id, postulante.Id);

                        var preguntaDto = new PreguntaDto
                        {
                            Id = pregunta.Id,
                            TextoPregunta = pregunta.TextoPregunta,
                            TipoRespuesta = pregunta.TipoRespuesta,
                            TiempoRespuesta = pregunta.TiempoRespuesta,
                            Respuestas = respuestas.Select(r => new RespuestaDto
                            {
                                Id = r.Id,
                                RespuestaTexto = r.RespuestaTexto,
                                EsCorrecta = r.EsCorrecta
                            }).ToList(),
                            RespuestasUsuario = respuestasUsuario.Select(ru => new RespuestaUsuarioDto
                            {
                                Id = ru.Id,
                                IdRespuesta = ru.IdRespuesta,
                                FechaRespuesta = ru.FechaRespuesta
                            }).ToList()
                        };

                        cuestionarioDto.Preguntas.Add(preguntaDto);
                    }

                    postulanteDto.Cuestionarios.Add(cuestionarioDto);
                }

                listaPostulantes.Add(postulanteDto);
            }

            return Ok(listaPostulantes);
        }



        public class PostulanteDto
        {
            public int Id { get; set; }
            public string Nombre { get; set; }
            public string Correo { get; set; }
            public string? Telefono { get; set; }
            public string? Direccion { get; set; }
            public string? Dni { get; set; }
            public bool? Estado { get; set; }
            public int? TipoUsuario { get; set; }
            public string? Localidad { get; set; }
            public string? Provincia { get; set; }
            public DateTime? FechaCreacion { get; set; }
            public List<CuestionarioDto> Cuestionarios { get; set; } = new List<CuestionarioDto>();
            public List<PostulanteCuestionarioDto> PostulanteCuestionarios { get; set; } = new List<PostulanteCuestionarioDto>();
        }

        public class PostulanteCuestionarioDto
        {
            public int Id { get; set; }
            public int IdPostulante { get; set; }
            public int IdCuestionario { get; set; }
            public DateTime? FechaCreacion { get; set; }
            public decimal? Resultado { get; set; }
        }

        public class CuestionarioDto
        {
            public int Id { get; set; }
            public string? Nombre { get; set; }
            public DateTime FechaCreacion { get; set; }
            public int? MaxPreguntas { get; set; }
            public string? NotaAprobacion { get; set; }
            public List<PreguntaDto> Preguntas { get; set; } = new List<PreguntaDto>();
        }

        public class PreguntaDto
        {
            public int Id { get; set; }
            public string? TextoPregunta { get; set; }
            public string? TipoRespuesta { get; set; }
            public decimal? TiempoRespuesta { get; set; }
            public List<RespuestaDto> Respuestas { get; set; } = new List<RespuestaDto>();
            public List<RespuestaUsuarioDto> RespuestasUsuario { get; set; } = new List<RespuestaUsuarioDto>();
        }

        public class RespuestaDto
        {
            public int Id { get; set; }
            public string? RespuestaTexto { get; set; }
            public bool? EsCorrecta { get; set; }
        }

        public class RespuestaUsuarioDto
        {
            public int Id { get; set; }
            public int IdRespuesta { get; set; }
            public DateTime FechaRespuesta { get; set; }
        }


    }
}
