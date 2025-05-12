using BLL.ImplementacionZoco;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.VM;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZocoConectController : ControllerBase
    {
        private readonly ITokenService _tokenservice;
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuariozoco;
       private readonly IZocoConectService _conectService;
        private readonly IReferidosService _referidosService;
        private readonly IAltaService _altaService;
        private readonly IBajaService _bajaService;
        public ZocoConectController(ITokenService tok, IBaseDashboardService baseService, 
            IUsuarioZocoService usuariozoco,IZocoConectService zocoConectService,IReferidosService referidosService
            , IAltaService altaService, IBajaService bajaService)
        {

            _tokenservice = tok;
            _baseService = baseService;
            _usuariozoco = usuariozoco;
            _conectService = zocoConectService;
            _referidosService = referidosService;
            _altaService = altaService;
            _bajaService = bajaService;
        }
        [HttpPost("obtenerzococonect")]
        public async Task<IActionResult> BuscarUsuario([FromBody] VMUsuario request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.token == null || usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario o token no encontrado");
            }

            var usuarioZocoConect = await _conectService.ObtenerPorId(usuarioEncontrado.usuario.Id);
            if (usuarioZocoConect == null)
            {
                return NotFound("Usuario ZocoConect no encontrado");
            }

            var aliadosZocoConect = await _referidosService.ObtenerReferidos(usuarioZocoConect.Id);
            if (aliadosZocoConect == null || !aliadosZocoConect.Any())
            {
                return NotFound("Aliados ZocoConect no encontrados");
            }

            // Obtener listas de altas y bajas para determinar el nombreFantasia
            var altas = await _altaService.ObtenerCRM();
            var bajas = await _bajaService.ObtenerCRMBaja();

            // Lista para almacenar los resultados
            var resultadosPorMes = new List<object>();

            foreach (var aliado in aliadosZocoConect)
            {
                var aliadozc = await _usuariozoco.ObtenerPorId(aliado.IdUser);
                DateTime fechaActual = aliado.FechaAlta;
                DateTime fechaHoy = DateTime.Today;

                string nombreFantasia = "";

                // Convertimos Cuit y NroTerminal a los tipos correctos
                if (double.TryParse(aliadozc.Usuario1, out double cuit) && double.TryParse(aliado.NroTerminal, out double nroTerminal))
                {
                    // Búsqueda en la tabla Alta
                    var alta = altas.FirstOrDefault(a =>
                        a.CuitCuil.HasValue && a.CuitCuil.Value == cuit &&
                        a.NDeTerminal.HasValue && a.NDeTerminal.Value == nroTerminal &&
                        a.FechaDeAlta <= aliado.FechaAlta &&
                        (a.FechaDeBaja == null || a.FechaDeBaja >= aliado.FechaBaja));

                    if (alta != null)
                    {
                        nombreFantasia = alta.NombreDeFantasia;
                    }
                    else
                    {
                        // Búsqueda en la tabla Baja
                        var baja = bajas.FirstOrDefault(b =>
                            b.CuitCuil.HasValue && b.CuitCuil.Value == cuit &&
                            double.TryParse(b.NDeTerminal, out double nroTerminalBaja) && nroTerminalBaja == nroTerminal &&
                            b.FechaDeAlta <= aliado.FechaAlta &&
                            (b.FechaDeBaja == null || b.FechaDeBaja >= aliado.FechaBaja));

                        if (baja != null)
                        {
                            nombreFantasia = baja.NombreDeFantasia;
                        }
                    }
                }

                while (fechaActual <= aliado.FechaBaja)
                {
                    DateTime inicioMes = new DateTime(fechaActual.Year, fechaActual.Month, 1);
                    DateTime finMes = inicioMes.AddMonths(1).AddDays(-1);

                    // Verificar si es el mes actual
                    bool esMesActual = (inicioMes.Month == fechaHoy.Month && inicioMes.Year == fechaHoy.Year);

                    // Si es el mes actual, finMes es el día de hoy, si no, se mantiene el fin de mes
                    DateTime finMesAjustado = esMesActual ? fechaHoy : finMes;

                    // Si es el mes actual, tomar fechaHoy - 5 días, si no, tomar finMes - 5 días
                    DateTime fechaInicioEstado = finMesAjustado.AddDays(-5);

                    // Determinar la cantidad de días a considerar
                    int diasDelMes = DateTime.DaysInMonth(inicioMes.Year, inicioMes.Month);
                    int diasContables = (fechaHoy > finMes) ? diasDelMes : fechaHoy.Day;

                    // Obtener el total bruto para el mes
                    decimal totalBruto = await _baseService.ObtenerDatoNumericoPorCuitYFechasNroTerminal(aliadozc.Usuario1, inicioMes, finMes, aliado.NroTerminal);
                    decimal totalBrutoPorDia = diasContables > 0 ? totalBruto / diasContables : 0;
                    var comision = 0;

                    // Determinar el porcentaje y el nivel
                    int porcentaje = Math.Min(100, (int)(totalBrutoPorDia / 1000));
                    int nivel = 0;
                    if (totalBrutoPorDia > 50000) nivel = 1;
                    if (totalBrutoPorDia > 65000) nivel = 2;
                    if (totalBrutoPorDia > 80000) nivel = 3;
                    if (nivel == 1)
                    {
                        comision = 150000;
                    }
                    else if (nivel == 2)
                    {
                        comision = 300000;
                    }
                    else if (nivel == 3)
                    {
                        comision = 450000;
                    }

                    // Aplicar la nueva lógica para verificar los últimos 5 días
                    var estado = await _baseService.Verificarultimos5dias(aliadozc.Usuario1, fechaInicioEstado, finMesAjustado, aliado.NroTerminal);

                    // Agregar a la lista de resultados con el nombreFantasia
                    resultadosPorMes.Add(new
                    {
                        Cuit = aliadozc.Usuario1,
                        Nombre = nombreFantasia,  // Aquí agregamos el nombre de fantasía en lugar del nombre del usuario
                        Mes = inicioMes.ToString("MMMM", new System.Globalization.CultureInfo("es-ES")),
                        TotalBruto = totalBruto,
                        Comision = comision,
                        Nivel = nivel,
                        Porcentaje = porcentaje,
                        Estado = estado,
                        Nivel0 = 0,
                        Nivel1 = 1500000,
                        Nivel2 = 2500000,
                        nivel3=  3500000,
                        ComisionNivel1 = 150000,
                        comisionNivel2 = 300000,
                        ComisionNivel3 = 450000,
                        NroTerminal = aliado.NroTerminal,
                        ComisionMesActual= 500000,
                        AcumuladoComision = 1500000
                    }) ;

                    // Moverse al siguiente mes
                    fechaActual = fechaActual.AddMonths(1);
                }
            }

            return StatusCode(StatusCodes.Status200OK, resultadosPorMes);
        }



        [HttpPost("registrarzococonectaliado")]
        public async Task<ActionResult> RegistrarZocoConectAliado([FromBody] VMUsuarioConect request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido == true)
            {
                var usuario = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
        // public int IdUser { get; set; }
        //public string? Cbu { get; set; }
        //public string? Alias { get; set; }
        //public string? Banco { get; set; }
        //public string? ClaveZocoConect { get; set; }
        var usuariozoco = new ZocoConect{
            IdUser = usuario.usuario.Id,
            Cbu = request.Cbu,
            Alias = request.Alias,  
            Banco = request.Banco,
            ClaveZocoConect = request.ClaveZocoConect
                };
                var usuariocreado = await _conectService.Crear(usuariozoco);
                return StatusCode(StatusCodes.Status200OK);


            }
             
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("registrarzococonectnuevo")]
        public async Task<ActionResult> RegistrarZocoConectNuevo([FromBody] VMUsuarioConect request)
        {
            var cuitexiste = await _usuariozoco.ObtenerPorCuit(request.Usuario1);
        
            if(cuitexiste == null)
            {
                var usuario = new Usuario
                {
                    Usuario1 = request.Usuario1,
                    Password = request.ClaveZocoConect,
                    Nombre = request.Nombre,
                    TipoUsuario = 7,
                    Correo = request.Correo,
                    Estado = true
     
                };
                var usuariocreado = await _usuariozoco.CrearZocoConect(usuario);

                var usuariozoco = new ZocoConect
                {
                    IdUser = usuariocreado.Id,
                    Cbu = request.Cbu,
                    Alias = request.Alias,
                    Banco = request.Banco,
                    ClaveZocoConect = request.ClaveZocoConect
                };
                var usuariocreadozoco = await _conectService.Crear(usuariozoco);
                return StatusCode(StatusCodes.Status200OK);
            }

            return Unauthorized("el cuit ya existe");

        }

        [HttpPost("agregarreferidos")]
        public async Task<ActionResult> AgregarReferidos([FromBody] VMReferidos request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido == true)
            {
                DateTime fechaAlta;
                DateTime? fechaBaja = null;

                // Validar y convertir FechaAlta
                if (!DateTime.TryParse(request.FechaAlta, out fechaAlta))
                {
                    return BadRequest("FechaAlta tiene un formato inválido.");
                }

                // Calcular FechaBaja si no se proporciona en el request
                if (string.IsNullOrEmpty(request.FechaBaja))
                {
                    fechaBaja = fechaAlta.AddMonths(2); // Sumar 3 meses a la FechaAlta
                }
                else
                {
                    // Validar y convertir FechaBaja si se proporciona
                    DateTime tempFechaBaja;
                    if (DateTime.TryParse(request.FechaBaja, out tempFechaBaja))
                    {
                        fechaBaja = tempFechaBaja;
                    }
                    else
                    {
                        return BadRequest("FechaBaja tiene un formato inválido.");
                    }
                }

                // Crear objeto Referido
                
                
                var referido = new Referido
                {
                    IdZocoConect = (int)request.IdZocoConect,
                    IdUser = (int)request.IdUser,
                    FechaAlta = fechaAlta,
                    FechaBaja = fechaBaja,
                    NroTerminal = request.NroTerminal
                };

                // Llamar al servicio para crear el referido
                var nuevoreferido = await _referidosService.Crear(referido);

                return Ok(nuevoreferido);
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }

        [HttpPost("calcularcomision")]
        public async Task<ActionResult> CalcularComision([FromBody] VMReferidos request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido == true)
            {
              var FechaCierre = DateTime.Now;
                var montocomision = 100;
                var referido = new Referido
                {
                    Id = (int)request.Id,
                    FechaCierre = FechaCierre,
                    MontoComision = montocomision,
                  
                };
                /*var nuevoreferido =*/ await _referidosService.EditarParaCierre(referido);
                return Ok();
            }

            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("agregarcomprobante")]
        [RequestSizeLimit(157_286_400)]
        [RequestFormLimits(MultipartBodyLengthLimit = 157_286_400)]
        public async Task<IActionResult> CrearCheckAsesores([FromForm] VMReferidos referdos)
        {
            if (referdos.token == null)
            {
                return BadRequest("Token no puede ser nulo.");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(referdos.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            try
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(referdos.token);
                if (usuarioEncontrado.usuario == null)
                {
                    return NotFound("Usuario no encontrado.");
                }

                var referidobasse = new Referido();
                if (!string.IsNullOrWhiteSpace(referdos.Comprobante))
                {
                    var base64Data = referdos.Comprobante.Contains(",")
                        ? referdos.Comprobante.Substring(referdos.Comprobante.IndexOf(",") + 1)
                        : referdos.Comprobante;

                    try
                    {
                        referidobasse.Comprobante = Convert.FromBase64String(base64Data);
                    }
                    catch (FormatException)
                    {
                        throw new Exception("El comprobante proporcionado no es válido en formato Base64.");
                    }
                }

                referidobasse.Id = (int)referdos.Id;
                referidobasse.FechaPago = DateTime.Now;
                referidobasse.SePagon = true;
                await _referidosService.SubirComprobante(referidobasse);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }
        [HttpPost("listausuarioszococonect")]
        public async Task<IActionResult> listausuarioszococonect([FromBody] VMUsuario request)
        {
            if (string.IsNullOrEmpty(request.Token))
            {
                return BadRequest("El token no puede estar vacío");
            }

            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return StatusCode(StatusCodes.Status401Unauthorized, "Token inválido");
            }

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.token == null || usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario o token no encontrado");
            }

            var usuariosZocoConect = await _conectService.ObtenerTodosZocoConect();
            if (usuariosZocoConect == null || !usuariosZocoConect.Any())
            {
                return NotFound("Usuarios ZocoConect no encontrados");
            }

            // Crear un diccionario para agrupar resultados por CuitAliado
            var resultadosAgrupados = new Dictionary<string, object>();

            foreach (var usuarioZocoConect in usuariosZocoConect)
            {
                var aliadosZocoConect = await _referidosService.ObtenerReferidos(usuarioZocoConect.Id);
                if (aliadosZocoConect == null || !aliadosZocoConect.Any())
                {
                    continue;
                }

                foreach (var aliado in aliadosZocoConect)
                {
                    var aliadozc = await _usuariozoco.ObtenerPorId(aliado.IdUser);
                    var zoco = await _conectService.ObtenerPorIdUser(aliado.IdZocoConect);
                    var aliadoreferido = await _usuariozoco.ObtenerPorId(zoco.IdUser);
                    DateTime fechaActual = aliado.FechaAlta;
                    var altas = await _altaService.ObtenerCRM();
                    var bajas = await _bajaService.ObtenerCRMBaja();
                    var comprobante = "";
                 
                    var nombreFantasia = "";

                    // Si ya declaraste nombreFantasia antes, solo asigna el valor
                    nombreFantasia = "";

                    // Convertimos Cuit y NroTerminal a los tipos correctos
                    if (double.TryParse(aliadozc.Usuario1, out double cuit) && double.TryParse(aliado.NroTerminal, out double nroTerminal))
                    {
                        // Búsqueda en la tabla Alta
                        var alta = altas.FirstOrDefault(a =>
                            a.CuitCuil.HasValue && a.CuitCuil.Value == cuit &&
                            a.NDeTerminal.HasValue && a.NDeTerminal.Value == nroTerminal &&
                            a.FechaDeAlta <= aliado.FechaAlta &&
                            (a.FechaDeBaja == null || a.FechaDeBaja >= aliado.FechaBaja));

                        if (alta != null)
                        {
                            nombreFantasia = alta.NombreDeFantasia;
                        }
                        else
                        {
                            // Búsqueda en la tabla Baja
                            var baja = bajas.FirstOrDefault(b =>
                                b.CuitCuil.HasValue && b.CuitCuil.Value == cuit &&
                                double.TryParse(b.NDeTerminal, out double nroTerminalBaja) && nroTerminalBaja == nroTerminal &&
                                b.FechaDeAlta <= aliado.FechaAlta &&
                                (b.FechaDeBaja == null || b.FechaDeBaja >= aliado.FechaBaja));

                            if (baja != null)
                            {
                                nombreFantasia = baja.NombreDeFantasia;
                            }
                        }
                    }



                    // Ahora nombreFantasia contiene el valor correcto

                    while (fechaActual <= (aliado.FechaBaja ?? DateTime.UtcNow))
                    {
                        DateTime inicioMes = new DateTime(fechaActual.Year, fechaActual.Month, 1);
                        DateTime finMes = inicioMes.AddMonths(1).AddDays(-1);

                        // decimal totalBruto = await _baseService.ObtenerDatoNumericoPorCuitYFechas(aliadozc.Usuario1, inicioMes, finMes);
                        decimal totalBruto = await _baseService.ObtenerDatoNumericoPorCuitYFechasNroTerminal(aliadozc.Usuario1, inicioMes, finMes, aliado.NroTerminal);

                        var claveUnica = $"{aliadozc.Usuario1}-{aliado.IdZocoConect}";

                        if (resultadosAgrupados.TryGetValue(claveUnica, out var registroExistente))
                        {
                            var registro = (dynamic)registroExistente;
                            registro.MesesYTotales.Add(new
                            {
                                Mes = inicioMes.ToString("MMMM", new System.Globalization.CultureInfo("es-ES")),
                                TotalBruto = totalBruto
                            });
                        }
                        else
                        {
                            if (aliado.Comprobante == null)
                            {
                                comprobante = "No";
                            }
                            else
                            {
                                comprobante = "Si";
                            }
                            resultadosAgrupados[claveUnica] = new
                            {
                                Id = aliado.Id,
                                CuitZocoConect = aliadoreferido.Usuario1,
                                NombreZocoConect = aliadoreferido.Nombre,
                                CuitAliado = aliadozc.Usuario1,
                                NombreAliado = nombreFantasia,
                                Comision = aliado.MontoComision,
                                comprobantepdf = comprobante,
                                MesesYTotales = new List<object>
        {
            new
            {
                Mes = inicioMes.ToString("MMMM", new System.Globalization.CultureInfo("es-ES")),
                TotalBruto = totalBruto
            }
        }
                            };
                        }


                        fechaActual = fechaActual.AddMonths(1);
                    }
                }
            }

            // Convertir el diccionario en una lista para la respuesta
            var resultadosPorMes = resultadosAgrupados.Values.ToList();

            return StatusCode(StatusCodes.Status200OK, resultadosPorMes);
        }
        [HttpPost("descargarcomprobante")]
        public async Task<IActionResult> DescargarAudio([FromBody] VMReferidos Referidos)
        {
            try
            {
                var resultado = await _referidosService.ObtenerPorId((int)Referidos.Id);


                var AudioBase64 = Convert.ToBase64String(resultado.Comprobante);

                return Ok(AudioBase64);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { mensaje = ex.Message });
            }
        }

    }
}
