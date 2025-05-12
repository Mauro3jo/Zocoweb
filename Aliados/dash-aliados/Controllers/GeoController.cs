using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using DAL.Interfaces;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeoController : ControllerBase
    {
        private readonly IChechAsesores _CheckAsesores;
        private readonly ICheckImagenService _CheckAsesoresImagen;
        private readonly IUsuarioZocoService _UsuarioZocoService;
        private readonly IComandaService _ComandaService;
        private readonly IMapper _mapper;
        private readonly ITokenService _tokenservice;
        private readonly IPanelInternoCalidad _panelInternoCalidad;

        public GeoController(IChechAsesores checkasesores, IMapper mapper, ITokenService tok, ICheckImagenService checkAsesoresImagen,
            IUsuarioZocoService usuarioZocoService, IComandaService comanda, IPanelInternoCalidad panelInternoCalidad)
        {
            _CheckAsesores = checkasesores;
            _mapper = mapper;
            _tokenservice = tok;
            _CheckAsesoresImagen = checkAsesoresImagen;
            _UsuarioZocoService = usuarioZocoService;
            _ComandaService = comanda;
            _panelInternoCalidad = panelInternoCalidad;
        }
        [HttpPost("check")]
        public async Task<IActionResult> CrearCheckAsesore([FromBody] VMCheckAsesores checkAsesoreDTO)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(checkAsesoreDTO.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(checkAsesoreDTO.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                checkAsesoreDTO.IdUser = usuarioEncontrado.usuario.Id;

                // Establecer la fecha y hora actual en la zona horaria de Argentina
                var argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                var fechaHoraActualArgentina = TimeZoneInfo.ConvertTime(DateTime.UtcNow, argentinaTimeZone);
                checkAsesoreDTO.FechaHora = fechaHoraActualArgentina.ToString("dd/MM/yyyy, HH:mm:ss");

                var checkAsesore = _mapper.Map<CheckAsesore>(checkAsesoreDTO);

                var resultado = await _CheckAsesores.Crear(checkAsesore);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }

        [HttpPost("checklista")]
        public async Task<IActionResult> ListaCheckAsesores([FromBody] VMToken vmToken)
        {
            var asesoreschecklista = await _CheckAsesores.Lista();

            if (asesoreschecklista == null || asesoreschecklista.Count == 0)
            {
                return NotFound("No hay datos para la lista de asesores");
            }

            var listaEnriquecida = new List<AsesorConUsuario>();

            foreach (var asesor in asesoreschecklista)
            {
                var usuario = await _UsuarioZocoService.ObtenerPorId(asesor.IdUser);
                if (usuario != null)
                {
                    bool esFechaValida = DateTime.TryParseExact(asesor.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaAsesor);

                    if (esFechaValida)
                    {
                        listaEnriquecida.Add(new AsesorConUsuario
                        {
                            Id = asesor.Id,
                            Nombre = usuario.Nombre,
                            Usuario = usuario.Usuario1,
                            Latitud = asesor.Latitud,
                            Longitud = asesor.Longitud,
                            FechaHora = fechaAsesor,
                            Tipo = asesor.Tipo
                        });
                    }
                }
            }

            bool esFechaTokenValida = DateTime.TryParseExact(vmToken.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaDeHoy);

            if (!esFechaTokenValida)
            {
                return BadRequest("Formato de fecha inválido en el token");
            }

            var registrosDeHoy = listaEnriquecida
      .Where(a => a.FechaHora?.Date == fechaDeHoy.Date)
      .ToList();


            var listaOrdenada = registrosDeHoy.OrderByDescending(x => x.FechaHora).ThenBy(x => x.Nombre).ToList();

            return Ok(listaOrdenada);
        }


        [HttpPost("checklistaimagen")]
        public async Task<IActionResult> listaCheckAsesoreimagen([FromBody] VMToken vmToken)
        {
            var asesoreschecklista = await _CheckAsesoresImagen.Listaimagen(vmToken.Fecha);

            if (asesoreschecklista == null || asesoreschecklista.Count == 0)
            {
                return Ok("No hay datos para la lista de asesores");
            }

            var listaEnriquecida = new List<AsesorConUsuarioeImagen>();

            foreach (var asesor in asesoreschecklista)
            {
                var usuario = await _UsuarioZocoService.ObtenerPorId(asesor.IdUser);
                if (usuario != null)
                {
                    DateTime fechaAsesor;
                    bool esFechaValida = DateTime.TryParseExact(asesor.FechaHora, "dd/MM/yyyy, HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out fechaAsesor);

                    if (esFechaValida)
                    {
                        var asesorConUsuario = new AsesorConUsuarioeImagen
                        {
                            Id = asesor.Id,
                            Nombre = usuario.Nombre,
                            Usuario = usuario.Usuario1,
                            Latitud = asesor.Latitud,
                            Longitud = asesor.Longitud,
                            FechaHora = fechaAsesor,
                            Local = asesor.Local,
                            Tipo = asesor.Tipo,
                            Calificacion = asesor.Calificacion,
                            ObservacionAdmin = asesor.ObservacionAdmin,
                            Observacion = asesor.Observacion,
                            CantidadRollos = asesor.CantidadRollos

                        };

                        listaEnriquecida.Add(asesorConUsuario);
                    }
                }
            }

            bool esFechaTokenValida = DateTime.TryParseExact(vmToken.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime fechaDeHoy);

            if (!esFechaTokenValida)
            {
                return BadRequest("Formato de fecha inválido en el token");
            }

            var registrosDeHoy = listaEnriquecida
                .Where(a => a.FechaHora?.Date == fechaDeHoy.Date)
                .ToList();

            var listaOrdenada = registrosDeHoy.OrderByDescending(x => x.FechaHora).ThenBy(x => x.Nombre).ToList();

            foreach (var item in listaOrdenada)
            {
                var asesorOriginal = asesoreschecklista.FirstOrDefault(a => a.Id == item.Id);
                if (asesorOriginal != null)
                {
                    if (asesorOriginal.Imagen != null)
                    {
                        item.ImagenBase64 = Convert.ToBase64String(asesorOriginal.Imagen);
                    }
                    if (asesorOriginal.ImagenTerminal != null)
                    {
                        item.ImagenTerminal = Convert.ToBase64String(asesorOriginal.ImagenTerminal);
                    }
                 
                }
            }

            return Ok(listaOrdenada);
        }

        [HttpPost("checklistaimagenasesor")]
        public async Task<IActionResult> listaCheckAsesoreimagen2(VMToken token)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(token.Token);
            if (esTokenValido == true)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(token.Token);

                DateTime fecha;
                if (string.IsNullOrEmpty(token.Fecha))
                {
                    fecha = DateTime.Today;
                }
                else
                {
                    fecha = DateTime.ParseExact(token.Fecha, "yyyy-MM-dd", CultureInfo.InvariantCulture);
                }

                var asesoreschecklista = await _CheckAsesoresImagen.ListaAsesor2(usuarioEncontrado.usuario.Id, fecha);

                if (asesoreschecklista == null || asesoreschecklista.Count == 0)
                {
                    return Ok("No hay datos para la lista de asesores");
                }

                var listaEnriquecida = new List<AsesorConUsuarioeImagen>();

                foreach (var asesor in asesoreschecklista)
                {
                    var usuario = await _UsuarioZocoService.ObtenerPorId(asesor.IdUser);
                    if (usuario != null)
                    {
                        DateTime fechaAsesor;
                        bool esFechaValida = DateTime.TryParseExact(asesor.FechaHora, "dd/MM/yyyy, HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out fechaAsesor);

                        if (esFechaValida)
                        {
                            var asesorConUsuario = new AsesorConUsuarioeImagen
                            {
                                Id = asesor.Id,
                                Nombre = usuario.Nombre,
                                Usuario = usuario.Usuario1,
                                Latitud = asesor.Latitud,
                                Longitud = asesor.Longitud,
                                FechaHora = fechaAsesor,
                                Local = asesor.Local,
                                Tipo = asesor.Tipo,
                                Calificacion = asesor.Calificacion,
                                ObservacionAdmin = asesor.ObservacionAdmin,
                                Observacion = asesor.Observacion
                            };


                            listaEnriquecida.Add(asesorConUsuario);
                        }
                    }
                }

                DateTime fechaFiltrado;
                if (!string.IsNullOrEmpty(token.Fecha))
                {
                    var fechaCorrecta = DateTime.ParseExact(token.Fecha, "yyyy-MM-dd", null).ToString("dd/MM/yyyy");

                    if (DateTime.TryParseExact(fechaCorrecta, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime fechaEspecifica))
                    {
                        fechaFiltrado = fechaEspecifica;
                    }
                    else
                    {
                        fechaFiltrado = DateTime.Today;
                    }
                }
                else
                {
                    fechaFiltrado = DateTime.Today;
                }

                var listaFiltradaPorFecha = listaEnriquecida.Where(asesor => asesor.FechaHora?.Date == fechaFiltrado).ToList();

                var listaOrdenada = listaFiltradaPorFecha.OrderByDescending(x => x.FechaHora).ThenBy(x => x.Nombre).ToList();

                return Ok(listaOrdenada);
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }






        //[HttpPost("checkimagenyaudio")]
        //[RequestSizeLimit(157_286_400)]
        //[RequestFormLimits(MultipartBodyLengthLimit = 157_286_400)]

        //public async Task<IActionResult> CrearCheckAsesores([FromForm] VMCheckAsesoresExtended checkAsesoreDTO)
        //{
        //    bool esTokenValido = await _tokenservice.ValidarTokenAsync(checkAsesoreDTO.Token);
        //    if (!esTokenValido)
        //    {
        //        return Unauthorized("El token o el ID de la sesión no son válidos");
        //    }



        //    try
        //    {
        //        var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(checkAsesoreDTO.Token);
        //        if (usuarioEncontrado.usuario == null)
        //        {
        //            return NotFound("Usuario no encontrado.");
        //        }

        //        checkAsesoreDTO.IdUser = usuarioEncontrado.usuario.Id;

        //        var checkAsesore = _mapper.Map<CheckAsesoresImagen>(checkAsesoreDTO);

        //        if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.ImageBase64))
        //        {
        //            var base64Data = checkAsesoreDTO.ImageBase64.Substring(checkAsesoreDTO.ImageBase64.IndexOf(",") + 1);
        //            checkAsesore.Imagen = Convert.FromBase64String(base64Data);
        //        }
        //        if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.ImagenTerminal))
        //        {
        //            var ImagenTerminal = checkAsesoreDTO.ImagenTerminal.Substring(checkAsesoreDTO.ImagenTerminal.IndexOf(",") + 1);
        //            checkAsesore.ImagenTerminal = Convert.FromBase64String(ImagenTerminal);
        //        }
        //        if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.AudioBase64))
        //        {
        //            try
        //            {
        //                checkAsesore.AudioFile = Convert.FromBase64String(checkAsesoreDTO.AudioBase64);
        //            }
        //            catch (FormatException) 
        //            {

        //                checkAsesore.AudioFile = null;
        //            }
        //        }


        //        DateTime utcNow = DateTime.UtcNow;

        //        TimeZoneInfo argTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

        //        DateTime argTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, argTimeZone);

        //        checkAsesore.FechaHora = argTime.ToString("dd/MM/yyyy, HH:mm:ss");



        //        var resultado = await _CheckAsesoresImagen.Crear(checkAsesore);
        //        var comercio = checkAsesoreDTO.Local;
        //        var parts = comercio.Split(' ');
        //        var idString = parts.Last();

        //        // Verificar si el último elemento se puede convertir a entero
        //        if (int.TryParse(idString, out int Id))
        //        {
        //            var numeroTerminal = parts[parts.Length - 2];
        //            var nombredelComercio = string.Join(" ", parts.Take(parts.Length - 2));

        //            // Llamada a CerrarComandaConCheck solo si Id es válido
        //            var cerrarcomanda = await _ComandaService.CerrarComandaConCheck(Id);
        //        }
        //        return Ok();
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
        //    }
        //}
        [HttpPost("checkimagenyaudio")]
        [RequestSizeLimit(157_286_400)]
        [RequestFormLimits(MultipartBodyLengthLimit = 157_286_400)]
        public async Task<IActionResult> CrearCheckAsesores([FromForm] VMCheckAsesoresExtended checkAsesoreDTO, [FromForm] string TiempoAudio)
        {
            if (checkAsesoreDTO.Token == null)
            {
                return BadRequest("Token no puede ser nulo.");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(checkAsesoreDTO.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            try
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(checkAsesoreDTO.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                checkAsesoreDTO.IdUser = usuarioEncontrado.usuario.Id;

                var checkAsesore = _mapper.Map<CheckAsesoresImagen>(checkAsesoreDTO);

                if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.ImageBase64))
                {
                    var base64Data = checkAsesoreDTO.ImageBase64.Substring(checkAsesoreDTO.ImageBase64.IndexOf(",") + 1);
                    checkAsesore.Imagen = Convert.FromBase64String(base64Data);
                }
                if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.ImagenTerminal))
                {
                    var ImagenTerminal = checkAsesoreDTO.ImagenTerminal.Substring(checkAsesoreDTO.ImagenTerminal.IndexOf(",") + 1);
                    checkAsesore.ImagenTerminal = Convert.FromBase64String(ImagenTerminal);
                }
                if (!string.IsNullOrWhiteSpace(checkAsesoreDTO.AudioBase64))
                {
                    try
                    {
                        checkAsesore.AudioFile = Convert.FromBase64String(checkAsesoreDTO.AudioBase64);
                        // Usar la duración del audio enviada desde el cliente
                        checkAsesore.TiempoAudio = TiempoAudio;
                    }
                    catch (FormatException)
                    {
                        checkAsesore.AudioFile = null;
                        checkAsesore.TiempoAudio = "No disponible";
                    }
                }

                DateTime utcNow = DateTime.UtcNow;
                TimeZoneInfo argTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime argTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, argTimeZone);
                checkAsesore.FechaHora = argTime.ToString("dd/MM/yyyy, HH:mm:ss");

                var comercio = checkAsesoreDTO.Local;
                var parts = comercio.Split(' ');

                if (parts.Length >= 2 && int.TryParse(parts.Last(), out int lastPart) && parts.Last().Length >= 4)
                {
                    // Exclude the last element if it can be converted to an int and has 4 or more characters
                    checkAsesore.Local = string.Join(" ", parts.Take(parts.Length - 1));
                }
                else
                {
                    checkAsesore.Local = comercio;
                }
                checkAsesore.CantidadRollos = checkAsesoreDTO.CantidadRollos;
                var resultado = await _CheckAsesoresImagen.Crear(checkAsesore);

                // Lógica para obtener el ID y cerrar la comanda
                var idString = parts.Last();
                if (int.TryParse(idString, out int Id))
                {
                    var cerrarcomanda = await _ComandaService.CerrarComandaConCheck(Id, usuarioEncontrado.usuario.Id);
                }

                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }


        [HttpPost("cofirmarcheck")]
        public async Task<IActionResult> confirmarcheck([FromBody] VMToken checkAsesoreDTO)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(checkAsesoreDTO.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(checkAsesoreDTO.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                bool respuesta = await _CheckAsesores.ConfirmarCheck(usuarioEncontrado.usuario.Id);
                return Ok(respuesta);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }
        [HttpPost("agregarobservacionadmin")]
        public async Task<IActionResult> AgregarObservacionAdmin([FromBody] VMCheckAsesoresExtended checkAsesoreDTO)
        {

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(checkAsesoreDTO.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(checkAsesoreDTO.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            try
            {
               
                var califico = bool.Parse(checkAsesoreDTO.Califico);
                // Obtener la hora actual en UTC
                DateTime utcNow = DateTime.UtcNow;

                // Obtener la zona horaria de Argentina
                TimeZoneInfo argTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                // Convertir la hora UTC a la hora de Argentina
                DateTime argTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, argTimeZone);

                var resultado = await _CheckAsesoresImagen.AgregarObservacionAdmin(checkAsesoreDTO.Id, califico, checkAsesoreDTO.ObservacionAdmin);
                CheckAsesoresImagen usuario_existe = await _CheckAsesoresImagen.ObtenerCheckImagenPorId((int)checkAsesoreDTO.Id);
                var calificacion = "";
                if (checkAsesoreDTO.Califico =="false")
                {
                    calificacion = "Desaprobado";
                }
               else {
                    calificacion = "Aprobado";

                }
                var Panelcalidad = new PanelCalidadInterno
                {
                    Actividad = "Auditoria Visitas",
                    Estado = "Cerrado",
                    FechaCarga = argTime,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = checkAsesoreDTO.ObservacionAdmin,
                    GestorId = usuario_existe.IdUser,
                    EstadoAuditoria = calificacion,
                    Aliado = usuario_existe.Local
                }; await _panelInternoCalidad.Crear(Panelcalidad);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }
        [HttpPost("DescargarAudio")]
        public async Task<IActionResult> DescargarAudio([FromBody] VMCheckAsesoresExtended checkAsesoreDTO)
        {
            try
            {
                var resultado = await _CheckAsesoresImagen.ObtenerCheckImagenPorId((int)checkAsesoreDTO.Id);

               
                    var AudioBase64 = Convert.ToBase64String(resultado.AudioFile);

                    return Ok(AudioBase64);
              
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }

    }
}
