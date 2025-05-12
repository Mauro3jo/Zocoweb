using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
   
        private readonly IComentarioService _ComentarioService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly IMapper _mapper;


        private readonly ITokenService _tokenservice;
        public ChatController(IComentarioService calificocomentario,ITokenService tok, IMapper mapper, IUsuarioZocoService usuarioZoco)
        {
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _ComentarioService = calificocomentario;
        }

        [HttpPost("chatnuevo")]
        public async Task<IActionResult> CrearComentario([FromBody] VMChat vmChat)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(vmChat.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el CUIT no son válidos");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmChat.Token);
          

            try
            {
                var usuarioPorCuit = await _usuarioZocoService.ObtenerPorCuit(vmChat.Cuit.ToString());
                if (usuarioPorCuit == null)
                {
                    return NotFound("Usuario no encontrado con el CUIT proporcionado.");
                }

                var ultimoComentario = await _ComentarioService.ObtenerUltimoComentarioPorUsuarioId(usuarioPorCuit.Id);
                int? idComentarioPadre = ultimoComentario?.Id;

                byte[] imagenBytes = !string.IsNullOrEmpty(vmChat.ImagenBase64)
                                     ? Convert.FromBase64String(vmChat.ImagenBase64.Split(',')[1]) 
                                     : null;

                var comentario = new Comentario
                {
                    IdUsuario = usuarioEncontrado.usuario.Id,
                    Comentario1 = vmChat.ComentarioTexto,
                    IdComentarioPadre = idComentarioPadre,
                    FechaCreacion = DateTime.UtcNow.AddHours(-3),
                    IdUsuarioRespuesta = usuarioPorCuit.Id,
                    Imagen = imagenBytes
                };

                var creado = await _ComentarioService.CrearComentarioAsync(comentario);
                return Ok(creado);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Un error ocurrió al intentar crear el comentario.");
            }
        }
        [HttpPost("chatrespuesta")]
        public async Task<IActionResult> chatrespuesta([FromBody] VMChat vmChat)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(vmChat.Token);
            if (esTokenValido == true)
            {
                if (vmChat == null || string.IsNullOrEmpty(vmChat.ComentarioTexto))
                {
                    return BadRequest("Datos del comentario inválidos.");
                }

                try
                {
                    var comentario = new Comentario
                    {
                       
                        IdUsuario = vmChat.IdUsuario,
                        Comentario1 = vmChat.ComentarioTexto,
                        IdComentarioPadre = vmChat.IdComentarioPadre,
                        FechaCreacion = DateTime.UtcNow.AddHours(-3)
                    };

                    var creado = await _ComentarioService.ResponderAComentarioAsync(vmChat.IdComentarioPadre, comentario);
                    return Ok(creado);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Un error ocurrió al intentar crear el comentario.");
                }

            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpGet("listartodos")]
        public async Task<IActionResult> ListarTodosLosComentarios()
        {
            try
            {
                var comentarios = await _ComentarioService.ListarComentariosAsync();
                return Ok(comentarios); 
            }
            catch (Exception ex) 
            {
              
                return StatusCode(500, new { message = "No se pudieron obtener los comentarios debido a un error interno del servidor." });
            }
        }


        [HttpPost("listarporusuario")]
        public async Task<IActionResult> ListarComentariosPorUsuario([FromBody] VMChat request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            try
            {
                var todosLosComentarios = await _ComentarioService.ListarComentariosAsync();
                var usuarios = await _usuarioZocoService.Lista();
                var idsAdministradores = usuarios.Where(u => u.TipoUsuario == 8).Select(u => u.Id).ToList();

                var todosLosComentariosVM = new List<ComentarioViewModel>();

                foreach (var comentario in todosLosComentarios)
                {
                    var comentarioVM = _mapper.Map<ComentarioViewModel>(comentario);
                    comentarioVM.EsDelUsuario = comentarioVM.IdUsuario == usuarioEncontrado.usuario.Id ||
                                                (usuarioEncontrado.usuario.TipoUsuario == 8 && idsAdministradores.Contains(comentarioVM.IdUsuario ?? 0));

                    int idOtroUsuario = comentarioVM.EsDelUsuario ? comentarioVM.IdUsuarioRespuesta ?? 0 : comentarioVM.IdUsuario ?? 0;
                    var usuarioOtro = await _usuarioZocoService.ObtenerPorId(idOtroUsuario);
                    comentarioVM.Cuit = usuarioOtro != null && idOtroUsuario != usuarioEncontrado.usuario.Id ? usuarioOtro.Usuario1 : "Cuit no disponible";

                    if (comentario.Imagen != null && comentario.Imagen.Length > 0)
                    {
                        comentarioVM.ImagenBase64 = Convert.ToBase64String(comentario.Imagen);
                    }

                    todosLosComentariosVM.Add(comentarioVM);
                }

                return Ok(todosLosComentariosVM);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error al intentar listar los comentarios del usuario: {ex.Message}");
            }
        }


        [HttpPost("listarparausuario")]
        public async Task<IActionResult> ListarComentariosParaUsuario([FromBody] VMChat request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            try
            {
                var todosLosComentarios = await _ComentarioService.ListarComentariosAsync();
                var comentariosRelacionadosConElUsuario = todosLosComentarios
                    .Where(c => c.IdUsuario == usuarioEncontrado.usuario.Id || c.IdUsuarioRespuesta == usuarioEncontrado.usuario.Id)
                    .ToList();
                var comentariosRelacionadosConElUsuarioVM = _mapper.Map<List<ComentarioViewModel>>(comentariosRelacionadosConElUsuario);

                foreach (var comentarioVM in comentariosRelacionadosConElUsuarioVM)
                {
                    comentarioVM.EsDelUsuario = comentarioVM.IdUsuario == usuarioEncontrado.usuario.Id;
                    int idOtroUsuario = comentarioVM.EsDelUsuario ? comentarioVM.IdUsuarioRespuesta ?? 0 : comentarioVM.IdUsuario.Value;

                    var usuarioOtro = await _usuarioZocoService.ObtenerPorId(idOtroUsuario);
                    comentarioVM.Cuit = usuarioOtro != null && idOtroUsuario != usuarioEncontrado.usuario.Id ? usuarioOtro.Usuario1 : "Cuit no disponible";

                    var comentarioOriginal = todosLosComentarios.FirstOrDefault(c => c.Id == comentarioVM.Id);
                    if (comentarioOriginal != null && comentarioOriginal.Imagen != null && comentarioOriginal.Imagen.Length > 0)
                    {
                        comentarioVM.ImagenBase64 = Convert.ToBase64String(comentarioOriginal.Imagen);
                    }
                }

                return Ok(comentariosRelacionadosConElUsuarioVM);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error al intentar listar los comentarios relacionados con el usuario: {ex.Message}");
            }
        }








        [HttpGet("listarrespuestas")]
        public async Task<IActionResult> ListarRespuestasPorComentario(int idComentarioPadre)
        {
            try
            {
                var respuestas = await _ComentarioService.ListarRespuestasPorComentarioAsync(idComentarioPadre);
                return Ok(respuestas);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Ocurrió un error al intentar listar las respuestas al comentario {idComentarioPadre}.");
            }
        }


    }
}
