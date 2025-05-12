using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2010.CustomUI;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComandaController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariosService;
        private readonly IUsuarioCajeroService _usuariosCajeroService;
        private readonly ITokenService _tokenService;
        private readonly ITokenCajeroService _tokenCajeroService;
        private readonly IComandaService _comandaService;
        private readonly IPanelControlInterno _panecontrolinterno;

        public ComandaController(IUsuarioZocoService usuariosService, ITokenService tokenService, IComandaService comandaService, IUsuarioCajeroService usuariosCajeroService, ITokenCajeroService tokenCajeroService,IPanelControlInterno panelcontrolinterno)
        {
            _usuariosService = usuariosService;
            _tokenService = tokenService;
            _comandaService = comandaService;
            _usuariosCajeroService = usuariosCajeroService;
            _tokenCajeroService = tokenCajeroService;
            _panecontrolinterno = panelcontrolinterno;
        }
        [HttpPost("CrearComanada")]
        public async Task<IActionResult> CrearComanda([FromBody] VMComanda vmcomanda)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmcomanda.token);
            if (!esTokenValido)
            {
                esTokenValido = await _tokenCajeroService.ValidarTokenAsync(vmcomanda.token);
                if (!esTokenValido)
                {
                    return Unauthorized("El token o el ID de la sesión no son válidos");

                }
            }

            // Declarar la variable como una tupla, no como una tarea
            (TokenCajero token, UsuarioCajero usuario) usuarioCajeroencontrado = (null, null);

            // Asignar el resultado de la función asincrónica directamente
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmcomanda.token);

            if (usuarioEncontrado.usuario == null)
            {
                usuarioCajeroencontrado = await _tokenCajeroService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmcomanda.token);
                if (usuarioCajeroencontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }
            }

            if (string.IsNullOrEmpty(vmcomanda.Direccion) || string.IsNullOrEmpty(vmcomanda.Motivo) ||
                string.IsNullOrEmpty(vmcomanda.Estado) /*|| string.IsNullOrEmpty(vmcomanda.Telefono)*/ ||
                string.IsNullOrEmpty(vmcomanda.Provincia))
            {
                return Ok("Todos los campos deben estar completos para crear la comanda.");
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

            string Cuit, Email;
            int Iduser;

            if (usuarioCajeroencontrado.usuario != null)
            {
                var usuario = await _usuariosService.ObtenerPorId((int)usuarioCajeroencontrado.usuario.IdUsuario);
                Cuit = usuario.Usuario1;
                Iduser = usuario.Id;
                Email = usuario.Correo;
            }
            else
            {
                Cuit = usuarioEncontrado.usuario.Usuario1;
                Iduser = usuarioEncontrado.usuario.Id;
                Email = usuarioEncontrado.usuario.Correo;
            }

            // Continúa con el resto de tu lógica

            await _comandaService.CrearComandaAsync(new Actividade
            {
                Iduser = Iduser,
                FechaApertura = fechaApertura,
                Cuit = Cuit, 
                Direccion = vmcomanda.Direccion,
                Motivo = vmcomanda.Motivo,
                Estado = vmcomanda.Estado,
                NumeroTelefono = vmcomanda.Telefono,
                Provincia = vmcomanda.Provincia,
                ObservacionAliado = vmcomanda.Observacion,
                Email = Email,
            });

            return Ok("Comanda creada con éxito");
        }
        [HttpPost("CrearComanada2")]
        public async Task<IActionResult> CrearComanda2([FromBody] VMCrearComanda vmComanda)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmComanda.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmComanda.token);

            if (string.IsNullOrEmpty(vmComanda.Direccion) || string.IsNullOrEmpty(vmComanda.Motivo) ||
                string.IsNullOrEmpty(vmComanda.estado) /*|| string.IsNullOrEmpty(vmComanda.Telefono)*/ ||
                string.IsNullOrEmpty(vmComanda.Provincia))
            {
                return Ok("Todos los campos deben estar completos para crear la comanda.");
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

            Usuario aliado = null;

            // Verificar si Cuit es un número entero y obtener el usuario
            if (!string.IsNullOrEmpty(vmComanda.Cuit) && double.TryParse(vmComanda.Cuit, out double cuitDouble) && cuitDouble % 1 == 0)
            {
                var cuitString = cuitDouble.ToString("F0"); // Convertir a string sin decimales
                aliado = await _usuariosService.ObtenerPorCuit(cuitString);
            }

            await _comandaService.CrearComandaAsync(new Actividade
            {
                Motivo = vmComanda.Motivo,
                Iduser = vmComanda.Iduser,
                Idgestor = vmComanda.Idgestor,
                FechaApertura = fechaApertura,
                Finalizado = vmComanda.Finalizado,
                Direccion = vmComanda.Direccion,
                ObservacionAdministracion = vmComanda.Observacion,
                ObservacionGestor = vmComanda.ObservacionGestor,
                Estado = vmComanda.estado,
                NombredelComercio = vmComanda.Comercio,
                Cuit = vmComanda.Cuit,
                Provincia = vmComanda.Provincia,
                NumeroTerminal = vmComanda.Terminal,
                NumeroTelefono = vmComanda.Telefono,
                Email = vmComanda.Email,
            });

            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = "Comanda",
                Tipo = "Comanda",
                Aliado = vmComanda.Comercio,
                Motivo = vmComanda.Motivo,
                Estado = "Cerrada",
                FechaCarga = fechaApertura,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = vmComanda.Observacion,
                IdAliado = aliado?.Id, // Asigna null si aliado es null
                NroTerminal = vmComanda.Terminal?.ToString() // Convertir Terminal a string si tiene valor, o null si no tiene
            };

            await _panecontrolinterno.Crear(panelcontrolinterno);
            return Ok("Comanda creada con éxito");
        }


        [HttpPut("EditarComanda")]
        public async Task<IActionResult> EditarComanda([FromBody] VMComanda vmComanda)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmComanda.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
            var comandaExistente = await _comandaService.ListarComandaAsync((int)vmComanda.Id);
            if (comandaExistente == null)
            {
                return NotFound("Comanda no encontrada.");
            }
            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            if (vmComanda.Estado == "completado")
            {

               

                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmComanda.token);
                vmComanda.FechaCierre = fechaCierreArg.ToString();
                vmComanda.Idcierregestion = usuarioEncontrado.usuario.Id;


            }
            comandaExistente.Motivo = !string.IsNullOrEmpty(vmComanda.Motivo) ? vmComanda.Motivo : comandaExistente.Motivo;
            comandaExistente.Iduser = vmComanda.Iduser ?? comandaExistente.Iduser;
            comandaExistente.Idgestor = vmComanda.Idgestor ?? comandaExistente.Idgestor;
            comandaExistente.FechaApertura = !string.IsNullOrEmpty(vmComanda.FechaApertura) ? DateTime.Parse(vmComanda.FechaApertura) : comandaExistente.FechaApertura;
            comandaExistente.FechaCierre = !string.IsNullOrEmpty(vmComanda.FechaCierre) ? DateTime.Parse(vmComanda.FechaCierre) : comandaExistente.FechaCierre;
            comandaExistente.Finalizado = vmComanda.Finalizado.HasValue ? vmComanda.Finalizado.Value : comandaExistente.Finalizado;
            comandaExistente.Direccion = !string.IsNullOrEmpty(vmComanda.Direccion) ? vmComanda.Direccion : comandaExistente.Direccion;
            comandaExistente.ObservacionAdministracion = !string.IsNullOrEmpty(vmComanda.Observacion) ? vmComanda.Observacion : comandaExistente.ObservacionAdministracion;
            comandaExistente.ObservacionGestor = !string.IsNullOrEmpty(vmComanda.ObservacionGestor) ? vmComanda.ObservacionGestor : comandaExistente.ObservacionGestor;
            comandaExistente.Estado = !string.IsNullOrEmpty(vmComanda.Estado) ? vmComanda.Estado : comandaExistente.Estado;
            comandaExistente.NombredelComercio = !string.IsNullOrEmpty(vmComanda.Comercio) ? vmComanda.Comercio : comandaExistente.NombredelComercio;
            comandaExistente.Cuit = !string.IsNullOrEmpty(vmComanda.Cuit) ? vmComanda.Cuit : comandaExistente.Cuit;
            comandaExistente.Provincia = !string.IsNullOrEmpty(vmComanda.Provincia) ? vmComanda.Provincia : comandaExistente.Provincia;
            comandaExistente.NumeroTerminal = vmComanda.Terminal ?? comandaExistente.NumeroTerminal;
            comandaExistente.NumeroTelefono = !string.IsNullOrEmpty(vmComanda.Telefono) ? vmComanda.Telefono : comandaExistente.NumeroTelefono;
            comandaExistente.Email = !string.IsNullOrEmpty(vmComanda.Email) ? vmComanda.Email : comandaExistente.Email;
            comandaExistente.Idcierregestion = vmComanda.Idcierregestion ?? comandaExistente.Idcierregestion;
            await _comandaService.EditarComandaAsync(comandaExistente);

            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = "Comanda",
                Tipo = "Comanda",
                Aliado = vmComanda.Comercio,
                Motivo = vmComanda.Motivo,
                Estado = "Cerrada",
                FechaCarga = fechaCierreArg,
                IdUser = comandaExistente.Idcierregestion,
                Observaciones = vmComanda.Observacion
            };
            await _panecontrolinterno.Crear(panelcontrolinterno);
            return Ok("Comanda actualizada con éxito.");
        }
        [HttpPut("FinalizarComanda")]
        public async Task<IActionResult> FinalizarComanda([FromBody] VMCierreComanda vmComanda)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmComanda.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var comandaExistente = await _comandaService.ListarComandaAsync((int)vmComanda.id);
            if (comandaExistente == null)
            {
                return NotFound("Comanda no encontrada.");
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

            comandaExistente.FechaCierre = fechaCierreArg;
            comandaExistente.ObservacionGestor = !string.IsNullOrEmpty(vmComanda.observaciones) ? vmComanda.observaciones : comandaExistente.ObservacionGestor;
            comandaExistente.Estado = "completado";

            if (vmComanda.pasos != null && vmComanda.pasos.Any())
            {
                string pasosConcatenados = String.Join(", ", vmComanda.pasos);
                comandaExistente.Pasos = pasosConcatenados; 
            }

            await _comandaService.EditarComandaAsync(comandaExistente);

            return Ok("Comanda actualizada con éxito.");
        }

        [HttpPost("ListarComandasPorUsuario")]
        public async Task<IActionResult> ListarComandasPorUsuario([FromBody] VMComandaConsulta vmConsulta)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmConsulta.token);
            if (!esTokenValido)
            {
                esTokenValido = await _tokenCajeroService.ValidarTokenAsync(vmConsulta.token);
                if (!esTokenValido)
                {
                    return Unauthorized("El token o el ID de la sesión no son válidos");

                }
            }



            // Declarar la variable como una tupla, no como una tarea
            (TokenCajero token, UsuarioCajero usuario) usuarioCajeroencontrado = (null, null);

            // Asignar el resultado de la función asincrónica directamente
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmConsulta.token);

            if (usuarioEncontrado.usuario == null)
            {
                usuarioCajeroencontrado = await _tokenCajeroService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmConsulta.token);
                if (usuarioCajeroencontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");

                }
            }

            var comandas = await _comandaService.ListarComandasPorUsuarioAsync((int)(usuarioEncontrado.usuario?.Id ?? usuarioCajeroencontrado.usuario.IdUsuario));
            if (comandas == null || !comandas.Any())
            {
                return NotFound("No se encontraron comandas para el usuario especificado.");
            }

            return Ok(comandas);
        }
        [HttpPost("ListarComandasPorGestor")]
        public async Task<IActionResult> ListarComandasPorGestor([FromBody] VMComandaConsulta vmConsulta)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmConsulta.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

         
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmConsulta.token);
            if (usuarioEncontrado.usuario == null)
            {
                return Ok("Usuario no encontrado.");
            }
            var comandas = await _comandaService.ListarComandasPorGestorAsync(usuarioEncontrado.usuario.Id);
            if (comandas == null || !comandas.Any())
            {
                return Ok("No se encontraron comandas para el gestor especificado.");
            }

            return Ok(comandas);
        }
        //[HttpGet("ListarTodasComandas")]
        //public async Task<IActionResult> ListarTodasComandas()
        //{
        //    var comandas = await _comandaService.ListarComandasAsync();
        //    var comandasConNombres = new List<object>(); 

        //    foreach (var com in comandas)
        //    {
        //        string? nombreGestor = null;
        //        string? nombreUsuario = null;

        //        if (com.Idgestor != null)
        //        {
        //            var gestor = await _usuariosService.ObtenerPorId((int)com.Idgestor);
        //            nombreGestor = gestor.Nombre;
        //        }
        //        if (com.Iduser != null)
        //        {
        //            var usuario = await _usuariosService.ObtenerPorId((int)com.Iduser);
        //            nombreUsuario = usuario.Nombre;
        //        }

        //        comandasConNombres.Add(new
        //        {
        //            com.Id,
        //            com.Motivo,
        //            com.Iduser,
        //            com.Idgestor,
        //            FechaApertura = com.FechaApertura?.ToString("dd-MM-yyyy"), 
        //            FechaCierre = com.FechaCierre?.ToString("dd-MM-yyyy"), 
        //            com.Finalizado,
        //            com.Direccion,
        //            com.ObservacionAliado,
        //            com.ObservacionAdministracion,
        //            com.ObservacionGestor,
        //            com.Estado,
        //            com.NombredelComercio,
        //            com.Cuit,
        //            com.Provincia,
        //            com.NumeroTerminal,
        //            com.NumeroTelefono,
        //            com.Email,
        //            NombreGestor = nombreGestor, 
        //            NombreUsuario = nombreUsuario 
        //        });
        //    }

        //    return Ok(comandasConNombres);
        //}
        [HttpPost("ListarTodasComandas")]
        public async Task<IActionResult> ListarTodasComandasPorFecha([FromBody] VMToken request)
        {
            DateTime fecha;

            if (string.IsNullOrEmpty(request.Fecha))
            {
                fecha = DateTime.Today;
            }
            else
            {
                if (!DateTime.TryParse(request.Fecha, out fecha))
                {
                    return BadRequest("Formato de fecha no válido");
                }
            }

            var comandas = await _comandaService.ListarTodasComandasAsync(fecha);
            var comandasConNombres = new List<object>();

            foreach (var com in comandas)
            {
                string? nombreGestor = null;
                string? nombreUsuario = null;

                if (com.Idgestor != null)
                {
                    var gestor = await _usuariosService.ObtenerPorId((int)com.Idgestor);
                    nombreGestor = gestor.Nombre;
                }
                if (com.Iduser != null)
                {
                    var usuario = await _usuariosService.ObtenerPorId((int)com.Iduser);
                    nombreUsuario = usuario.Nombre;
                }

                comandasConNombres.Add(new
                {
                    com.Id,
                    com.Motivo,
                    com.Iduser,
                    com.Idgestor,
                    FechaApertura = com.FechaApertura?.ToString("dd-MM-yyyy"),
                    FechaCierre = com.FechaCierre?.ToString("dd-MM-yyyy"),
                    com.Finalizado,
                    com.Direccion,
                    com.ObservacionAliado,
                    com.ObservacionAdministracion,
                    com.ObservacionGestor,
                    com.Estado,
                    com.NombredelComercio,
                    com.Cuit,
                    com.Provincia,
                    com.NumeroTerminal,
                    com.NumeroTelefono,
                    com.Email,
                    NombreGestor = nombreGestor,
                    NombreUsuario = nombreUsuario
                });
            }

            return Ok(comandasConNombres);
        }
        [HttpPost("listaconsulta")]
        public async Task<IActionResult> Listaconsulta([FromBody] VMComandaConsulta vmConsulta)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(vmConsulta.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var comanda = await _comandaService.ListarComandaAsync((int)vmConsulta.Id);
            if (comanda == null)
            {
                return NotFound("No se encontraron comandas para el gestor especificado.");
            }

            string? nombreGestor = null;
            string? nombreUsuario = null;

            if (comanda.Idgestor != null)
            {
                var gestor = await _usuariosService.ObtenerPorId((int)comanda.Idgestor);
                nombreGestor = gestor?.Nombre;
            }
            if (comanda.Iduser != null)
            {
                var usuario = await _usuariosService.ObtenerPorId((int)comanda.Iduser);
                nombreUsuario = usuario?.Nombre;
            }

            var comandaConNombres = new
            {
                comanda.Id,
                comanda.Motivo,
                comanda.Iduser,
                comanda.Idgestor,
                comanda.FechaApertura,
                comanda.FechaCierre,
                comanda.Finalizado,
                comanda.Direccion,
                comanda.ObservacionAliado,
                comanda.ObservacionAdministracion,
                comanda.ObservacionGestor,
                comanda.Estado,
                comanda.NombredelComercio,
                comanda.Cuit,
                comanda.Provincia,
                comanda.NumeroTerminal,
                comanda.NumeroTelefono,
                comanda.Email,
                NombreGestor = nombreGestor,
                NombreUsuario = nombreUsuario
            };

            return Ok(comandaConNombres);
        }

    }
}
