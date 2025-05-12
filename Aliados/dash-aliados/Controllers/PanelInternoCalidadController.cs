using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PanelInternoCalidadController : ControllerBase
    {
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IChechAsesores _CheckAsesores;
        private readonly ICheckImagenService _CheckAsesoresImagen;
        private readonly IComandaService _comandaService;
        private readonly IPanelControlInterno _panelControlInterno;
        private readonly IPanelInternoCalidad _panelInternoCalidad;
        public PanelInternoCalidadController(IUsuarioZocoService usuarioZocoService, ITokenService tokenService, IChechAsesores checkasesores,
            ICheckImagenService checasesoresimagen, IComandaService comandaService, IPanelControlInterno panelControlInterno, IPanelInternoCalidad panelInternoClidad)
        {
            _usuariozoco = usuarioZocoService;
            _tokenService = tokenService;
            _CheckAsesores = checkasesores;
            _CheckAsesoresImagen = checasesoresimagen;
            _comandaService = comandaService;
            _panelControlInterno = panelControlInterno;
            _panelInternoCalidad = panelInternoClidad;


        }
        [HttpPost("crearnuevodatopanel")]
        public async Task<IActionResult> CrearNuevoDatoPanel([FromBody] VMPanelInternoCalidad request)
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

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            int GestorId = 0;

            // Intentamos convertir el valor de request.Empleado
            if (!string.IsNullOrEmpty(request.Empleado) && int.TryParse(request.Empleado, out int empleadoId))
            {
                GestorId = empleadoId; // Si la conversión de request.Empleado es exitosa, se asigna
            }
            else if (!string.IsNullOrEmpty(request.Gestora) && int.TryParse(request.Gestora, out int gestoraId))
            {
                GestorId = gestoraId; // Si la conversión de request.Gestora es exitosa, se asigna
            }

            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

            // Conversión de request.Fecha (string) a DateTime
            DateTime fecha;
            if (!DateTime.TryParse(request.Fecha, out fecha))
            {
                fecha = fechaApertura; // Si la conversión falla, se asigna la fecha de hoy
            }

            var panelcontrolinterno = new PanelCalidadInterno
            {
                Actividad = request.Actividad,
                Estado = request.Estado,
                EstadoAuditoria = request.EstadoAuditoria,
                GestorId = GestorId,
                FechaCarga = fechaApertura,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = request.Observaciones,
                Aliado = request.Aliado,
                InteresAyudar = request.InteresAyudar,
                Explicacion = request.Explicacion,
                ContenemosAliado = request.ContenemosAliado,
                InformacionIncorrecta = request.InformacionIncorrecta,
                Errores = request.Errores,
                Plazos = request.Plazos,
                Facturacion = request.Facturacion,
                OptimisamosTiempos = request.OptimizamosTiempo,
                Motivo = request.Motivo,
                Fecha = fecha, // Asignamos la fecha, ya sea la convertida o la de hoy
            };

            await _panelInternoCalidad.Crear(panelcontrolinterno);

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

            // Intentar convertir la fecha de string a DateTime
            if (!DateTime.TryParse(request.Fecha, out DateTime fechaConvertida))
            {
                return BadRequest("El formato de fecha proporcionado no es válido.");
            }

            // Obtener los datos del usuario en la fecha especificada
            var listadatos = await _panelInternoCalidad.Obtenerdatosusuariopordia(usuarioEncontrado.usuario.Id, fechaConvertida);

            // Crear una nueva lista que incluirá todos los campos y el nombre del usuario
            var datosConNombreUsuario = new List<object>();

            // Recorrer los datos de la lista y agregar el nombre del usuario a cada elemento
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
                // Obtener el nombre del Gestor y del Usuario de forma asíncrona
                var usuarioEmpleado = await _usuariozoco.ObtenerPorId(dato.GestorId ?? 0);  // Si GestorId es null, se pasa 0
                var usuarioUsuario = await _usuariozoco.ObtenerPorId(dato.IdUser ?? 0);     // Si IdUser es null, se pasa 0

                var datoConNombreUsuario = new
                {
                    dato.Id,                      // Id del registro
                    dato.Actividad,               // Canal de Atención
                    dato.Estado,                  // Estado actual
                    dato.EstadoAuditoria,         // Tipo de consulta
                    dato.Observaciones,           // Observaciones
                    dato.FechaCarga,              // Fecha de carga
                    dato.Aliado,                  // Aliado
                    dato.InteresAyudar,           // Interés en ayudar
                    dato.Explicacion,             // Explicación simple
                    dato.ContenemosAliado,        // Si contienen al Aliado
                    dato.InformacionIncorrecta,   // Información incorrecta/incompleta
                    dato.Errores,                 // Errores
                    dato.Plazos,                  // Plazos
                    dato.Facturacion,             // Facturación
                    dato.Motivo,                  // Motivo
                    dato.OptimisamosTiempos,      // Optimización de Tiempos
                    dato.Fecha,
                    NombreGestor = usuarioEmpleado?.Nombre ?? "N/A",  // Nombre del Gestor
                    NombreUsuario = usuarioUsuario?.Nombre ?? "N/A"   // Nombre del Usuario
                };




                // Agregar el nuevo objeto a la lista
                datosConNombreUsuario.Add(datoConNombreUsuario);
            }

            // Devolver la lista con el nombre del usuario agregado a cada elemento
            return Ok(datosConNombreUsuario);
        }
        [HttpPost("editardatopanel")]
        public async Task<IActionResult> EditarDatoPanel( [FromBody] VMPanelInternoCalidad request)
        {
            // Validar el token
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            // Buscar el panel interno existente por ID
            var panelExistente = await _panelInternoCalidad.ObtenerPorId((int)request.Id);
            if (panelExistente == null)
            {
                return NotFound("El registro no fue encontrado.");
            }

            // Obtener el usuario asociado al token
            var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
            if (usuarioEncontrado.usuario == null)
            {
                return Unauthorized("El usuario no fue encontrado.");
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            int GestorId = 0;

            // Intentamos convertir el valor de request.Empleado
            if (!string.IsNullOrEmpty(request.Empleado) && int.TryParse(request.Empleado, out int empleadoId))
            {
                GestorId = empleadoId; // Si la conversión de request.Empleado es exitosa, se asigna
            }
            else if (!string.IsNullOrEmpty(request.Gestora) && int.TryParse(request.Gestora, out int gestoraId))
            {
                GestorId = gestoraId; // Si la conversión de request.Gestora es exitosa, se asigna
            }

            // Actualizar los campos del panel existente con los nuevos valores del request
            panelExistente.Actividad = request.Actividad ?? panelExistente.Actividad;
            panelExistente.Estado = request.Estado ?? panelExistente.Estado;
            panelExistente.EstadoAuditoria = request.EstadoAuditoria ?? panelExistente.EstadoAuditoria;
            panelExistente.GestorId = GestorId != 0 ? GestorId : panelExistente.GestorId;
            panelExistente.Observaciones = request.Observaciones ?? panelExistente.Observaciones;
            panelExistente.Aliado = request.Aliado ?? panelExistente.Aliado;
            panelExistente.InteresAyudar = request.InteresAyudar ?? panelExistente.InteresAyudar;
            panelExistente.Explicacion = request.Explicacion ?? panelExistente.Explicacion;
            panelExistente.ContenemosAliado = request.ContenemosAliado ?? panelExistente.ContenemosAliado;
            panelExistente.InformacionIncorrecta = request.InformacionIncorrecta ?? panelExistente.InformacionIncorrecta;
            panelExistente.Errores = request.Errores ?? panelExistente.Errores;
            panelExistente.Plazos = request.Plazos ?? panelExistente.Plazos;
            panelExistente.Facturacion = request.Facturacion ?? panelExistente.Facturacion;
            panelExistente.OptimisamosTiempos = request.OptimizamosTiempo ?? panelExistente.OptimisamosTiempos;
            panelExistente.Motivo = request.Motivo ?? panelExistente.Motivo;

            //// Convertir y actualizar la fecha si es proporcionada
            //if (!string.IsNullOrEmpty(request.Fecha) && DateTime.TryParseExact(request.Fecha, "dd/MM/yyyy", null, System.Globalization.DateTimeStyles.None, out DateTime fechaConvertida))
            //{
            //    panelExistente.Fecha = fechaConvertida.ToString("dd/MM/yyyy");
            //}

            // Guardar los cambios
            await _panelInternoCalidad.Actualizar(panelExistente);

            return Ok("El registro ha sido actualizado correctamente.");
        }

    }
}
