using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using static BLL.ImplementacionZoco.PanelGestorInternoService;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CalidadController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IChechAsesores _CheckAsesores;
        private readonly ICheckImagenService _CheckAsesoresImagen;
        private readonly IComandaService _comandaService;
        private readonly IPanelControlInterno _panelControlInterno;
        private readonly IAltaService _altaService;
        private readonly INotificacionResumenService _internoResumenService;
        public CalidadController(IUsuarioZocoService usuarioZocoService, ITokenService tokenService, IChechAsesores checkasesores,
            ICheckImagenService checasesoresimagen, IComandaService comandaService, IPanelControlInterno panelControlInterno,IAltaService altaService, INotificacionResumenService internoResumenService)
        {
            _usuariozoco = usuarioZocoService;
            _tokenService = tokenService;
            _CheckAsesores = checkasesores;
            _CheckAsesoresImagen    = checasesoresimagen;
            _comandaService = comandaService;
            _panelControlInterno = panelControlInterno;
            _altaService = altaService;
            _internoResumenService = internoResumenService;
  
        }
        [HttpPost("panelinternogestores")]
        public async Task<IActionResult> PanelInternoGestores([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            DateTime fecha;
            if (string.IsNullOrEmpty(request.Fecha) || !DateTime.TryParse(request.Fecha, out fecha))
            {
                // Usar el primer día del mes actual si la fecha no se proporciona o es inválida
                var today = DateTime.Today;
                fecha = new DateTime(today.Year, today.Month, 1);
            }

            // Ahora 'fecha' contiene un valor DateTime válido, ya sea la fecha proporcionada o el primer día del mes actual

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Obtener la lista de gestores y asesores
            var usuarios = await _usuariozoco.ListaGestoresyAsesores();

            // Lista para almacenar los datos individuales
            var listaDatosIndividuales = new List<DatosIndividuales>();

            // Recorrer la lista de usuarios y procesar cada ID y Fecha
            foreach (var usuario in usuarios)
            {
                // Llamada al método para procesar cada usuario con la fecha
                var datosusuarioscheck = await _CheckAsesores.ProcesarUsuarioPorId(usuario.Id, fecha);
                var datosusuariocheckimagen = await _CheckAsesoresImagen.ProcesarUsuarioPorId(usuario.Id, fecha);
                var pendientes = await _comandaService.ListaComandasPorGestorPendientes(usuario.Id);

                // Crear un objeto DatosIndividuales con los datos obtenidos
                var datosIndividuales = new DatosIndividuales
                {
                    UsuarioId = usuario.Id,
                    NombreUsuario = usuario.Nombre,
                    HorasTrabajadas = (int)datosusuarioscheck.HorasTrabajadas,
                    DiasTrabajados = datosusuarioscheck.DiasTrabajados,
                    FueraHorario = datosusuarioscheck.FueraHorario,
                    TotalRegistros = datosusuariocheckimagen.TotalRegistros,
                    Desaprobados = datosusuariocheckimagen.Desaprobados,
                    Visitas = datosusuariocheckimagen.Visitas,
                    Prospectos = datosusuariocheckimagen.Prospectos,
                    Pendientes = pendientes.Count(),
                    Promedio = datosusuariocheckimagen.Promedio
                };

                // Agregar los datos individuales a la lista
                listaDatosIndividuales.Add(datosIndividuales);
            }

            // Devuelve una respuesta con los datos individuales de todos los usuarios procesados
            return Ok(listaDatosIndividuales);
        }
        [HttpPost("panelinternomes")]
        public async Task<IActionResult> PanelGestorInternoMes([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            DateTime fecha;
            if (string.IsNullOrEmpty(request.Fecha) || !DateTime.TryParse(request.Fecha, out fecha))
            {
                // Usar el primer día del mes actual si la fecha no se proporciona o es inválida
                var today = DateTime.Today;
                fecha = new DateTime(today.Year, today.Month, 1);
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            var usuarios = await _panelControlInterno.ListaUsuariosDiferentes(fecha);
            var resultados = new List<UsuarioResultado>();

            foreach (var usuario in usuarios)
            {
                var usuariocomanda = await _usuariozoco.ObtenerPorId((int)usuario);
                var resultadousuario = await _panelControlInterno.datosmesusuario(fecha, (int)usuario);

                // Ordenar los estados según el orden solicitado
                var estadosOrdenados = new Dictionary<string, int>
        {
            { "transferencia", resultadousuario.EstadoConteo.ContainsKey("transferencia") ? resultadousuario.EstadoConteo["transferencia"] : 0 },
            { "pendiente", resultadousuario.EstadoConteo.ContainsKey("pendiente") ? resultadousuario.EstadoConteo["pendiente"] : 0 },
            { "en espera de respuesta", resultadousuario.EstadoConteo.ContainsKey("en espera de respuesta") ? resultadousuario.EstadoConteo["en espera de respuesta"] : 0 },
            { "otros", resultadousuario.EstadoConteo.ContainsKey("otros") ? resultadousuario.EstadoConteo["otros"] : 0 },
            { "cerrado", resultadousuario.EstadoConteo.ContainsKey("cerrado") ? resultadousuario.EstadoConteo["cerrado"] : 0 }
        };

                // Crear el objeto de resultado manteniendo la estructura original, pero colocando CantidadTotal al final
                var resultado = new UsuarioResultado
                {
                    NombreUsuario = usuariocomanda.Nombre,
                    DatosMesUsuario = new DatosMesUsuarioResultado
                    {
                        // Primero el EstadoConteo y CanalAtencionConteo
                        CanalAtencionConteo = resultadousuario.CanalAtencionConteo,
                        EstadoConteo = estadosOrdenados,

                        // CantidadTotal al final
                        CantidadTotal = resultadousuario.CantidadTotal
                    }
                };

                resultados.Add(resultado);
            }

            return Ok(resultados);
        }






        [HttpPost("crearnuevodatopanel")]
        public async Task<IActionResult> CrearNuevoDatoPanel([FromBody] VMPanelGestoInterno request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Separar el nombre del aliado y el número de terminal, si corresponde
            string nombreAliado;
            string nroTerminal = null;

            string[] aliadoParts = request.Aliado.Split(' ');
            if (aliadoParts.Length > 1)
            {
                nombreAliado = string.Join(" ", aliadoParts.Take(aliadoParts.Length - 1)); // Todo excepto el último elemento
                nroTerminal = aliadoParts.Last(); // El último elemento es el número de terminal
            }
            else
            {
                nombreAliado = request.Aliado; // Si solo es un dato, asumimos que es el nombre del aliado
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var terminal = !string.IsNullOrEmpty(nroTerminal) ? await _altaService.ObtenerPorNroTerminal(nroTerminal) : null;

            // Verificar si terminal.CuitCuil no es null ni vacío
            int? idAliado = null;
            if (!string.IsNullOrEmpty(terminal?.CuitCuil.ToString()))
            {
                var usuario = await _usuariozoco.ObtenerPorCuit(terminal.CuitCuil.ToString());
                idAliado = usuario?.Id;
            }

            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = request.CanalAtencion,
                Tipo = request.Tipo,
                Aliado = nombreAliado, // Solo el nombre del aliado sin el número de terminal
                Motivo = request.Motivo,
                Estado = request.Estado,
                FechaCarga = fechaApertura,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = request.Observaciones,
                NroTerminal = nroTerminal, // Guardar el número de terminal en esta variable separada o null si no existe
                IdAliado = idAliado // Asignar el valor calculado o null
            };

            await _panelControlInterno.Crear(panelcontrolinterno);

            return Ok();
        }

        [HttpPost("editarpanel")]
        public async Task<IActionResult> editarpanel([FromBody] VMPanelGestoInterno request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Separar el nombre del aliado y el número de terminal, si corresponde
            string nombreAliado;
            string nroTerminal = null;

            string[] aliadoParts = request.Aliado.Split(' ');
            if (aliadoParts.Length > 1)
            {
                nombreAliado = string.Join(" ", aliadoParts.Take(aliadoParts.Length - 1)); // Todo excepto el último elemento
                nroTerminal = aliadoParts.Last(); // El último elemento es el número de terminal
            }
            else
            {
                nombreAliado = request.Aliado; // Si solo es un dato, asumimos que es el nombre del aliado
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var terminal = !string.IsNullOrEmpty(nroTerminal) ? await _altaService.ObtenerPorNroTerminal(nroTerminal) : null;

            // Verificar si terminal.CuitCuil no es null ni vacío
            int? idAliado = null;
            if (!string.IsNullOrEmpty(terminal?.CuitCuil.ToString()))
            {
                var usuario = await _usuariozoco.ObtenerPorCuit(terminal.CuitCuil.ToString());
                idAliado = usuario?.Id;
            }

            var panelcontrolinterno = new PanelGestorInterno
            {
                Id = (int)request.Id,
                CanalAtencion = request.CanalAtencion,
                Tipo = request.Tipo,
                Aliado = nombreAliado, // Solo el nombre del aliado sin el número de terminal
                Motivo = request.Motivo,
                Estado = request.Estado,
                FechaCarga = fechaApertura,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = request.Observaciones,
                NroTerminal = nroTerminal, // Guardar el número de terminal en esta variable separada o null si no existe
                IdAliado = idAliado // Asignar el valor calculado o null
            };

            await _panelControlInterno.Editar(panelcontrolinterno);

             return Ok();
        }

        [HttpPost("listadias")]
        public async Task<IActionResult> listadias([FromBody] VMToken request)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            // Obtener el usuario asociado al token
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            // Validar las fechas proporcionadas
            if (!DateTime.TryParse(request.Fecha, out DateTime fechaInicio) || !DateTime.TryParse(request.FechaFin, out DateTime fechaFin))
            {
                return BadRequest("El formato de una o ambas fechas proporcionadas no es válido.");
            }

            // Validar que FechaFin no sea anterior a FechaInicio
            if (fechaFin < fechaInicio)
            {
                return BadRequest("La fecha de fin no puede ser anterior a la fecha de inicio.");
            }

            // Crear una nueva lista para almacenar los datos acumulados
            var datosConNombreUsuario = new List<object>();

            // Iterar sobre el rango de fechas
            for (DateTime fechaActual = fechaInicio; fechaActual <= fechaFin; fechaActual = fechaActual.AddDays(1))
            {
                // Obtener los datos del usuario para la fecha actual
                var listadatos = await _panelControlInterno.Obtenerdatosusuariopordia(usuarioEncontrado.usuario.Id, fechaActual);

                // Procesar cada dato
                foreach (var dato in listadatos)
                {
                    // Si IdUser es null, ignorar el mapeo y continuar con el siguiente dato
                    if (dato.IdUser == null)
                    {
                        continue;
                    }

                    // Obtener el usuario por ID
                    var usuario = await _usuariozoco.ObtenerPorId((int)dato.IdUser);

                    // Verificar si el usuario fue encontrado
                    if (usuario == null)
                    {
                        continue;
                    }

                    // Crear un nuevo objeto que combine los datos originales con el nombre de usuario
                    var datoConNombreUsuario = new
                    {
                        dato.Id,                // Id del registro
                        dato.CanalAtencion,     // Canal de Atención
                        dato.Tipo,              // Tipo de consulta
                        dato.Aliado,            // Aliado (cliente)
                        dato.Motivo,            // Motivo
                        dato.Estado,            // Estado actual
                        dato.Observaciones,     // Observaciones
                        dato.FechaCarga,        // Fecha de carga
                        dato.IdUser,    
                        dato.NroTerminal,// Id del usuario
                        NombreUsuario = usuario.Nombre // Nombre del usuario
                    };

                    // Agregar el nuevo objeto a la lista
                    datosConNombreUsuario.Add(datoConNombreUsuario);
                }
            }

            // Devolver la lista con el nombre del usuario agregado a cada elemento
            return Ok(datosConNombreUsuario);

        }

        [HttpPost("modalcuit")]
        public async Task<IActionResult> ModalCuit([FromBody] VMToken request)
        {
            // Validación del token recibido
            if (request == null || string.IsNullOrEmpty(request.Cuit))
            {
                return BadRequest("El token o el CUIT no son válidos.");
            }

            // Obtener información del aliado
            var aliado = await _usuariozoco.ObtenerPorCuit(request.Cuit);
            if (aliado == null)
            {
                return NotFound("No se encontró un aliado con el CUIT proporcionado.");
            }

            // Obtener la fecha del request o usar la fecha actual
            DateTime fechaReferencia;
            if (!DateTime.TryParse(request.Fecha, out fechaReferencia))
            {
                fechaReferencia = DateTime.Now; // Usar fecha actual si no se envió una válida
            }

            // Obtener lista de aliados asociados filtrada por el mes anterior a la fecha
            var listaAliado = await _panelControlInterno.ObtenerPorIdAliado(aliado.Id, fechaReferencia);
            if (listaAliado == null || !listaAliado.Any())
            {
                return NotFound("No se encontraron registros para el aliado proporcionado.");
            }

            // Lista predefinida de motivos
            var motivosValidos = new List<string>
    {
        "ZOCO CHEEK",
        "ZOCO MEET",
        "ZOCO SEGUROS",
        "ZOCO AUDITORIA",
        "ZOCO AYUDA",
        "ZOCO STOP",
        "ZOCO CONET",
        "ZOCO REWARDS",
        "ZOCO ENVIOS",
        //"ZOCO FACTURACION",
        "ROBO TERMINAL",
        "ENVIO ROLLOS",
        "SERVICIO TECNICO",
        "INCORPORACION DE TARJETAS"
    };

            // Filtrar registros con motivos válidos
            var motivosDelMesAnterior = listaAliado
                .Where(p => motivosValidos.Contains(p.Motivo)) // Filtrar por motivos válidos
                .GroupBy(p => p.Motivo)
                .Select(g => new
                {
                    Mes = fechaReferencia.AddMonths(-1).ToString("MMMM"), // Nombre del mes anterior
                    Motivo = g.Key,
                    Conteo = g.Count()
                })
                .ToList();

            // Validar si se encontraron datos
            if (!motivosDelMesAnterior.Any())
            {
                return NotFound("No se encontraron registros para el mes anterior.");
            }

            // Devolver resultado
            return Ok(motivosDelMesAnterior);
        }

        [HttpPost("zocoresumen")]
        public async Task<IActionResult> calificomes([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            var fueNotificado = await _internoResumenService.FueNotificado(usuarioEncontrado.usuario.Id);

            if (!fueNotificado)
            {
                // Si no ha sido notificado, ejecutar la lógica de ModalCuit
                var aliado = await _usuariozoco.ObtenerPorCuit(usuarioEncontrado.usuario.Usuario1);
                if (aliado == null)
                {
                    return NotFound("No se encontró un aliado con el CUIT proporcionado.");
                }

                DateTime fechaReferencia = DateTime.Now;
                var listaAliado = await _panelControlInterno.ObtenerPorIdAliado(aliado.Id, fechaReferencia);

                if (listaAliado == null || !listaAliado.Any())
                {
                    return NotFound("No se encontraron registros para el aliado proporcionado.");
                }

                var motivosValidos = new List<string>
        {
            "ZOCO CHECK",
            "ZOCO MEET",
            "ZOCO SEGUROS",
            "ZOCO AUDITORIA",
            "ZOCO AYUDA",
            "ZOCO STOP",
            "ZOCO CONET",
            "ZOCO REWARDS",
            "ZOCO ENVIOS",
            "ROBO TERMINAL",
            "ENVIO ROLLOS",
            "SERVICIO TECNICO",
            "INCORPORACION DE TARJETAS"
        };

                var motivosDelMesAnterior = listaAliado
     .Where(p => motivosValidos.Contains(p.Motivo))
     .GroupBy(p => p.Motivo)
     .Select(g => new
     {
         Mes = fechaReferencia.AddMonths(-1).ToString("MMMM"),
         Motivo = g.Key == "INCORPORACION DE TARJETAS" ? "INC DE TARJETAS" : g.Key, // Transformación del motivo
         Conteo = g.Count()
     })
     .ToList();


                if (!motivosDelMesAnterior.Any())
                {
                    return NotFound("No se encontraron registros para el mes anterior.");
                }

                return Ok(motivosDelMesAnterior);
            }

            return NotFound("No se encontraron registros para el mes anterior.");
        }




    }

    internal class DatosIndividuales
    {
        public int UsuarioId { get; set; }
        public string NombreUsuario { get; set; }
        public int HorasTrabajadas { get; set; }
        public int DiasTrabajados { get; set; }
        public int FueraHorario { get; set; }
        public int TotalRegistros { get; set; }
        public int Desaprobados { get; set; }
        public int Visitas { get; set; }
        public int Prospectos { get; set; }
        public int Pendientes { get; set; }

        public string Promedio { get; set; }
    }
    public class UsuarioResultado
    {
        public string NombreUsuario { get; set; }
        public DatosMesUsuarioResultado DatosMesUsuario { get; set; }
    }



}
