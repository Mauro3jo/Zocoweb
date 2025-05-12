using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2010.Excel;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BajasController : ControllerBase
    {
        private readonly IAltaService _altaservice;
        private readonly IBajaService _bajaservice;

        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IFormularioAltaService _formularioAltaService;
        private readonly ICalculadoraService _CalculadoraService;
        private readonly IHistorialCRMService _historialCRMService;
        private readonly IFormularioBajaService _formulariobajaservice;
        private readonly IPanelControlInterno _panelcontrolinterno;
        public BajasController(IAltaService altaservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService,
            IFormularioAltaService formularioAltaService, ICalculadoraService calculadoraService,
            IHistorialCRMService historialCRMService, IBajaService bajaservice, IFormularioBajaService formulariobajaservice,
            IPanelControlInterno panelcontrolinterno)
        {
            _altaservice = altaservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _formularioAltaService = formularioAltaService;
            _CalculadoraService = calculadoraService;
            _historialCRMService = historialCRMService;
            _bajaservice = bajaservice;
            _formulariobajaservice = formulariobajaservice;
            _panelcontrolinterno = panelcontrolinterno;
        }
        [HttpPost("agregabaja")]
        public async Task<IActionResult> agregarbaja([FromBody] VMFormularioBaja request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                var formularioalta = await _formulariobajaservice.ListarFormulariosBajaAsyncporId((int)request.Id);
                var terminalAlta = await _bajaservice.TerminalAlta(formularioalta.NumeroTerminal);

                if (terminalAlta)
                {
                    var alta = await _altaservice.ObtenerPorNroTerminal(formularioalta.NumeroTerminal);
                    if (alta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
                    // Conversiones y asignaciones
                    var sasMutual = alta.SasMutual;
                    var estado = "DISPONIBLE";
                    var nDeTerminal = $"{alta.Legajo}-{Convert.ToString(alta.NDeTerminal)}"; 
                    var nDeComercio = alta.NDeComercio;
                    var nroLocal = alta.NroLocal;
                    var legajo = alta.Legajo;
                    var nombreDeFantasia = alta.NombreDeFantasia;
                    var domicilio = alta.Domicilio;
                    var localidad = alta.Localidad;
                    var codigoPostal = alta.CodigoPostal?.ToString();
                    var telefono = alta.Telefono;
                    var linkDePago = alta.LinkDePago;
                    var rubro = alta.Rubro;
                    var rubroSecundario = alta.RubroSecundario;
                    var altaAhora12 = alta.AltaAhora12;
                    var fechaDeAlta = alta.FechaDeAlta;
                    var fechaDeBaja = fechaCierreArg;
                    var tipoDeBaja = alta.TipoDeBaja;
                    var programacionBaja = alta.ProgramacionBaja;
                    double? diasParaAlta = null;
                    if (!string.IsNullOrEmpty(alta.DiasParaAlta) && double.TryParse(alta.DiasParaAlta, out double result))
                    {
                        diasParaAlta = result;
                    }
                    var provincia = alta.Provincia;
                    var nombreDelAsesor = alta.NombreDelAsesor;
                    var titular = alta.Titular;
                    var cuitCuil = alta.CuitCuil;
                    var banco = alta.Banco;
                    var tipoDeCuenta = alta.TipoDeCuenta;
                    var cbuCvu = alta.CbuCvu;
                    var nDeCuenta = alta.NDeCuenta;
                    var letraCbu = alta.LetraCbu;
                    var largoCbu = alta.LargoCbu;
                    var alias = alta.Alias;
                    var mail = alta.Mail;
                    var razonSocial = alta.RazonSocial;
                    var cuitRazonSocial = alta.CuitRazonSocial?.ToString();
                    var estadoAfip = alta.EstadoAfip;
                    var codActividad = alta.CodActividad?.ToString();
                    var actividad = alta.Actividad;
                    var exento = alta.Exento;
                    var estadoRentas = alta.EstadoRentas;
                    var actividad2 = alta.Actividad2;
                    var domicilioFiscal = alta.DomicilioFiscal;
                    var provincia3 = alta.Provincia3;
                    var alicuota = alta.Alicuota;
                    var observacion = alta.Observacion;
                    var origenDeLaTerminal = alta.OrigenDeLaTerminal;
                    var destinoDeLaTerminal = alta.DestinoDeLaTerminal;
                    var reUbicacion = alta.ReUbicacion;
                    var diasSinAltaDeTerminal = alta.DiasSinAltaDeTerminal;
                    var autorizadoPorTitular = alta.AutorizadoPorTitular;
                    var fechaDeCargaAbm = alta.FechaDeCargaAbm?.ToString();
                    var fechaDeModificacion = alta.FechaDeModificacion?.ToString();
                    var abmObservacionesDeCarga = alta.AbmObservacionesDeCarga;
                    var paraInforme = alta.ParaInforme;
                    var enPausa = alta.EnPausa;
                    var fechaDeInicioDePausa = alta.FechaDeInicioDePausa;
                    var fechaDeFinalizacionDePausa = alta.FechaDeFinalizacionDePausa;
                    var backup = alta.Backup;
                    var altas = alta.Altas;
                    var baja1 = alta.Baja;
                    var ingresoASstt = alta.IngresoASstt?.ToString();
                    var egresoDeSstt = alta.EgresoDeSstt?.ToString();
                    var motivoSstt = alta.MotivoSstt;
                    var _2IngresoASstt = alta._2IngresoASstt;
                    var _2EgresoDeSstt = alta._2EgresoDeSstt;
                    var _2MotivoSstt = alta._2MotivoSstt;
                    var fechaSsttMes = alta.FechaSsttMes?.ToString();
                    var codActividadRentas = alta.CodActividadRentas?.ToString();
                    var actividadRentas = alta.ActividadRentas;

                    // Actualiza el estado de `Alta` a "BAJA"
                    bool RES = await _altaservice.EditarSimple(alta.Id, fechaCierreArg);
                    if (!RES)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado de Alta.");
                    }

                    // Mapeo de la entidad `Alta` a `Baja`
                    var baja = new Baja
                    {
                        SasMutual = sasMutual,
                        Estado = estado,
                        NDeTerminal = nDeTerminal,
                        NDeComercio = nDeComercio,
                        NroLocal = nroLocal,
                        Legajo = legajo,
                        NombreDeFantasia = nombreDeFantasia,
                        Domicilio = domicilio,
                        Localidad = localidad,
                        CodigoPostal = codigoPostal,
                        Telefono = telefono,
                        LinkDePago = linkDePago,
                        Rubro = rubro,
                        RubroSecundario = rubroSecundario,
                        AltaAhora12 = altaAhora12,
                        FechaDeAlta = fechaDeAlta,
                        FechaDeBaja = fechaDeBaja,
                        TipoDeBaja = tipoDeBaja,
                        ProgramacionBaja = programacionBaja,
                        DiasParaAlta = diasParaAlta,
                        Provincia = provincia,
                        NombreDelAsesor = nombreDelAsesor,
                        Titular = titular,
                        CuitCuil = cuitCuil,
                        Banco = banco,
                        TipoDeCuenta = tipoDeCuenta,
                        CbuCvu = cbuCvu,
                        NDeCuenta = nDeCuenta,
                        LetraCbu = letraCbu,
                        LargoCbu = largoCbu,
                        Alias = alias,
                        Mail = mail,
                        RazonSocial = razonSocial,
                        CuitRazonSocial = cuitRazonSocial,
                        EstadoAfip = estadoAfip,
                        CodActividad = codActividad,
                        Actividad = actividad,
                        Exento = exento,
                        EstadoRentas = estadoRentas,
                        Actividad2 = actividad2,
                        DomicilioFiscal = domicilioFiscal,
                        Provincia3 = provincia3,
                        Alicuota = alicuota,
                        Observacion = observacion,
                        OrigenDeLaTerminal = origenDeLaTerminal,
                        DestinoDeLaTerminal = destinoDeLaTerminal,
                        ReUbicacion = reUbicacion,
                        DiasSinAltaDeTerminal = diasSinAltaDeTerminal,
                        AutorizadoPorTitular = autorizadoPorTitular,
                        FechaDeCargaAbm = fechaDeCargaAbm,
                        FechaDeModificacion = fechaDeModificacion,
                        AbmObservacionesDeCarga = abmObservacionesDeCarga,
                        ParaInforme = paraInforme,
                        EnPausa = enPausa,
                        FechaDeInicioDePausa = fechaDeInicioDePausa,
                        FechaDeFinalizacionDePausa = fechaDeFinalizacionDePausa,
                        Backup = backup,
                        Altas = altas,
                        Baja1 = baja1,
                        IngresoASstt = ingresoASstt,
                        EgresoDeSstt = egresoDeSstt,
                        MotivoSstt = motivoSstt,
                        _2IngresoASstt = _2IngresoASstt,
                        _2EgresoDeSstt = _2EgresoDeSstt,
                        _2MotivoSstt = _2MotivoSstt,
                        FechaSsttMes = fechaSsttMes,
                        CodActividadRentas = codActividadRentas,
                        ActividadRentas = actividadRentas
                    };

                 var bajaid =   await _bajaservice.NuevaALta(baja);
                    await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, alta.Id, formularioalta.Observacion, bajaid.Id);
                    await _formulariobajaservice.EditarFueUtilizado(formularioalta.Id);

                    return Ok();
            }
            else
            {
                return BadRequest("La terminal no está en estado ALTA.");
            }
        }
            return Unauthorized();
        }

        [HttpPost("CRM")]
        public async Task<IActionResult> ObtenerCRM(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                try
                {
                    var resumen = await _bajaservice.ObtenerCRMBaja();

                    var filteredResumen = resumen.Select(alta => new
                    {
                        /*de aca azul*/
                        Id = alta.Id,
                        SASMUTUAL = alta.SasMutual,
                        ESTADO = alta.Estado,
                        NDETERMINAL = alta.NDeTerminal, // Ejemplo de cambio de nombre
                        NDECOMERCIO = alta.NDeComercio,
                        NroLocal = alta.NroLocal,
                        LEGAJO = alta.Legajo,
                        NOMBREDEFANTASIA = alta.NombreDeFantasia,
                        DOMICILIO = alta.Domicilio,
                        Localidad = alta.Localidad,
                        CodigoPostal = alta.CodigoPostal,
                        TELEFONO = alta.Telefono,
                        LINKDEPAGO = alta.LinkDePago,
                        RUBRO = alta.Rubro,
                        RUBROSECUNDARIO = alta.RubroSecundario,
                        ALTAAHORA12 = alta.AltaAhora12,
                        FECHADEALTA = alta.FechaDeAlta,
                        FECHADEBAJA = alta.FechaDeBaja,
                        TIPODEBAJA = alta.TipoDeBaja,
                        PROVINCIA = alta.Provincia,
                        NOMBREDELASESOR = alta.NombreDelAsesor,
                        ALTA = alta.Altas,
                        BAJA = alta.Baja1,
                        MAIL = alta.Mail,/*hasta aca azul*/
                        /* de aca violeta*/
                        TITULAR = alta.Titular,
                        CUITCUIL = alta.CuitCuil,
                        BANCO = alta.Banco,
                        TIPODECUENTA = alta.TipoDeCuenta,
                        CBUCVU = alta.CbuCvu,
                        NDECUENTA = alta.NDeCuenta,
                        LETRACBU = alta.LetraCbu,
                        LARGOCBU = alta.LargoCbu,
                        ALIAS = alta.Alias, /* hasta aca violeta */
                        /* de aca amarillo*/
                        RAZONSOCIAL = alta.RazonSocial,
                        CUITRAZONSOCIAL = alta.CuitRazonSocial,
                        ESTADOAFIP = alta.EstadoAfip,
                        CODACTIVIDAD = alta.CodActividad,
                        ACTIVIDAD = alta.Actividad,
                        EXENTO = alta.Exento,
                        ESTADORENTAS = alta.EstadoRentas,
                        ACTIVIDAD2 = alta.Actividad2,
                        DOMICILIOFISCAL = alta.DomicilioFiscal,
                        PROVINCIA3 = alta.Provincia3,
                        ALICUOTA = alta.Alicuota.ToString().Replace(".", ","), // Ajuste en ALICUOTA para reemplazar '.' por ','
                        CODACTIVIDADRENTAS = alta.CodActividadRentas,
                        ACTIVIDADRENTAS = alta.ActividadRentas,
                        /* hasta aca el amarillo*/
                    })
                    .OrderByDescending(alta => alta.Id)
                    //.Take(100)
                    .ToList();

                    return Ok(filteredResumen);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal Server Error: " + ex.Message);
                }
            }
            return Ok();
        }

        [HttpPost("editarcrmbajas")]
        public async Task<IActionResult> EditarCRMBajas([FromBody] VMCRM request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                if (usuarioEncontrado.usuario != null)
                {
                    var baja = await _bajaservice.ObtenerPorid(request.Id); // Nota el 'await' aquí
                    if (baja != null)
                    {
                        var observacionesBuilder = new StringBuilder();

                        MapearYActualizarBaja(baja, request, observacionesBuilder);
                        await _bajaservice.EditarAbm(baja); // Asumiendo que hay un método para actualizar baja
                        var observaciones = observacionesBuilder.ToString();
                        await _historialCRMService.AgregarHistorialModificacionBaja(usuarioEncontrado.usuario.Id, baja.Id, observaciones);

                        TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                        DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                        Usuario aliado = null;

                        if (baja.CuitCuil.HasValue && baja.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                        {
                            var cuitString = baja.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                            aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                        }

                        var panelcontrolinterno = new PanelGestorInterno
                        {
                            CanalAtencion = "CRM",
                            Tipo = "MODIFICACION BAJA",
                            Aliado = request.NombreDeFantasia,
                            Motivo = "MODIFICACION BAJA",
                            Estado = "Cerrada",
                            FechaCarga = fechaCierreArg,
                            IdUser = usuarioEncontrado.usuario.Id,
                            Observaciones = observaciones,
                            IdAliado = aliado?.Id, // Asigna null si aliado es null
                            NroTerminal = baja.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                        };

                        await _panelcontrolinterno.Crear(panelcontrolinterno);
                    }

                }
            }

            return Ok();
        }

        private void MapearYActualizarBaja(Baja baja, VMCRM request, StringBuilder observaciones)
        {
            if (!string.IsNullOrEmpty(request.SasMutual) && request.SasMutual != baja.SasMutual)
            {
                observaciones.AppendLine($"SasMutual: {baja.SasMutual} -> {request.SasMutual}");

                baja.SasMutual = request.SasMutual;

            }

            if (!string.IsNullOrEmpty(request.Estado) && request.Estado != baja.Estado)
            {
                observaciones.AppendLine($"Estado: {baja.Estado} -> {request.Estado}");

                baja.Estado = request.Estado;

            }

            if (!string.IsNullOrEmpty(request.NDeTerminal) && request.NDeTerminal != baja.NDeTerminal)
            {
                observaciones.AppendLine($"NDeTerminalv: {baja.NDeTerminal} -> {request.NDeTerminal}");

                baja.NDeTerminal = request.NDeTerminal;
            }

            if (!string.IsNullOrEmpty(request.NDeComercio) &&
         double.TryParse(request.NDeComercio, out double nDeComercio) &&
         nDeComercio != baja.NDeComercio)
            {
                observaciones.AppendLine($"NDeComercio: {baja.NDeComercio} -> {request.NDeComercio}");
                baja.NDeComercio = nDeComercio;
            }

            if (!string.IsNullOrEmpty(request.NroLocal) &&
                double.TryParse(request.NroLocal, out double nroLocal) &&
                nroLocal != baja.NroLocal)
            {
                observaciones.AppendLine($"NroLocal: {baja.NroLocal} -> {request.NroLocal}");
                baja.NroLocal = nroLocal;
            }

            if (!string.IsNullOrEmpty(request.Legajo) &&
                double.TryParse(request.Legajo, out double legajo) &&
                legajo != baja.Legajo)
            {
                observaciones.AppendLine($"Legajo: {baja.Legajo} -> {request.Legajo}");
                baja.Legajo = legajo;
            }

            if (!string.IsNullOrEmpty(request.NombreDeFantasia) && request.NombreDeFantasia != baja.NombreDeFantasia)
            {
                observaciones.AppendLine($"NombreDeFantasia: {baja.NombreDeFantasia} -> {request.NombreDeFantasia}");

                baja.NombreDeFantasia = request.NombreDeFantasia;

            }

            if (!string.IsNullOrEmpty(request.Domicilio) && request.Domicilio != baja.Domicilio)
            {
                observaciones.AppendLine($"Domicilio: {baja.Domicilio} -> {request.Domicilio}");

                baja.Domicilio = request.Domicilio;

            }

            if (!string.IsNullOrEmpty(request.Localidad) && request.Localidad != baja.Localidad)
            {
                observaciones.AppendLine($"Localidad: {baja.Localidad} -> {request.Localidad}");

                baja.Localidad = request.Localidad;

            }

            if (!string.IsNullOrEmpty(request.CodigoPostal) && request.CodigoPostal != baja.CodigoPostal)
            {
                observaciones.AppendLine($"CodigoPostal: {baja.CodigoPostal} -> {request.CodigoPostal}");
                baja.CodigoPostal = request.CodigoPostal;
            }

            if (!string.IsNullOrEmpty(request.Telefono) &&
          double.TryParse(request.Telefono, out double telefono) &&
          telefono != baja.Telefono)
            {
                observaciones.AppendLine($"Telefono: {baja.Telefono} -> {request.Telefono}");
                baja.Telefono = telefono;
            }

            if (!string.IsNullOrEmpty(request.LinkDePago) && request.LinkDePago != baja.LinkDePago)
            {
                observaciones.AppendLine($"LinkDePago: {baja.LinkDePago} -> {request.LinkDePago}");

                baja.LinkDePago = request.LinkDePago;

            }

            if (!string.IsNullOrEmpty(request.Rubro) && request.Rubro != baja.Rubro)
            {
                observaciones.AppendLine($"Rubro: {baja.Rubro} -> {request.Rubro}");

                baja.Rubro = request.Rubro;
            }

            if (!string.IsNullOrEmpty(request.RubroSecundario) && request.RubroSecundario != baja.RubroSecundario)

            {
                observaciones.AppendLine($"RubroSecundario: {baja.RubroSecundario} -> {request.RubroSecundario}");

                baja.RubroSecundario = request.RubroSecundario;

            }

            if (!string.IsNullOrEmpty(request.AltaAhora12) && request.AltaAhora12 != baja.AltaAhora12)
            {
                observaciones.AppendLine($"AltaAhora12: {baja.AltaAhora12} -> {request.AltaAhora12}");

                baja.AltaAhora12 = request.AltaAhora12;
            }

            if (!string.IsNullOrEmpty(request.FechaDeAlta) && DateTime.TryParse(request.FechaDeAlta, out DateTime fechaDeAlta) && fechaDeAlta != baja.FechaDeAlta)
            {
                observaciones.AppendLine($"FechaDeAlta: {baja.FechaDeAlta} -> {request.FechaDeAlta}");

                baja.FechaDeAlta = fechaDeAlta;

            }

            if (!string.IsNullOrEmpty(request.FechaDeBaja) && DateTime.TryParse(request.FechaDeBaja, out DateTime fechaDeBaja) && fechaDeBaja != baja.FechaDeBaja)
            {
                observaciones.AppendLine($"FechaDeBaja: {baja.FechaDeBaja} -> {request.FechaDeBaja}");

                baja.FechaDeBaja = fechaDeBaja;

            }

            if (!string.IsNullOrEmpty(request.TipoDeBaja) && request.TipoDeBaja != baja.TipoDeBaja)
            {
                observaciones.AppendLine($"TipoDeBaja: {baja.TipoDeBaja} -> {request.TipoDeBaja}");

                baja.TipoDeBaja = request.TipoDeBaja;
            }

            if (!string.IsNullOrEmpty(request.ProgramacionBaja) && DateTime.TryParse(request.ProgramacionBaja, out DateTime programacionBaja) && programacionBaja != baja.ProgramacionBaja)
            {
                observaciones.AppendLine($"ProgramacionBaja: {baja.ProgramacionBaja} -> {request.ProgramacionBaja}");

                baja.ProgramacionBaja = programacionBaja;
            }

            //if (!string.IsNullOrEmpty(request.DiasParaAlta) && request.DiasParaAlta != baja.DiasParaAlta)
            //    baja.DiasParaAlta = request.DiasParaAlta;

            if (!string.IsNullOrEmpty(request.Provincia) && request.Provincia != baja.Provincia)
            {
                observaciones.AppendLine($"Provincia: {baja.Provincia} -> {request.Provincia}");
                baja.Provincia = request.Provincia;
            }

            if (!string.IsNullOrEmpty(request.NombreDelAsesor) && request.NombreDelAsesor != baja.NombreDelAsesor)
            {
                observaciones.AppendLine($"NombreDelAsesor: {baja.NombreDelAsesor} -> {request.NombreDelAsesor}");

                baja.NombreDelAsesor = request.NombreDelAsesor;
            }

            if (!string.IsNullOrEmpty(request.Titular) && request.Titular != baja.Titular)
            {
                observaciones.AppendLine($"Titular: {baja.Titular} -> {request.Titular}");
                baja.Titular = request.Titular;

            }

            if (!string.IsNullOrEmpty(request.CuitCuil) &&
       double.TryParse(request.CuitCuil, out double cuitCuil) &&
       cuitCuil != baja.CuitCuil)
            {
                observaciones.AppendLine($"CuitCuil: {baja.CuitCuil} -> {request.CuitCuil}");
                baja.CuitCuil = cuitCuil;
            }

            if (!string.IsNullOrEmpty(request.Banco) && request.Banco != baja.Banco)
            {
                observaciones.AppendLine($"Banco: {baja.Banco} -> {request.Banco}");

                baja.Banco = request.Banco;
            }

            if (!string.IsNullOrEmpty(request.TipoDeCuenta) && request.TipoDeCuenta != baja.TipoDeCuenta)
            {
                observaciones.AppendLine($"TipoDeCuenta: {baja.TipoDeCuenta} -> {request.TipoDeCuenta}");

                baja.TipoDeCuenta = request.TipoDeCuenta;
            }

            if (!string.IsNullOrEmpty(request.CbuCvu) && request.CbuCvu != baja.CbuCvu)
            {
                observaciones.AppendLine($"CbuCvu: {baja.CbuCvu} -> {request.CbuCvu}");

                baja.CbuCvu = request.CbuCvu;

            }

            if (!string.IsNullOrEmpty(request.NDeCuenta) && request.NDeCuenta != baja.NDeCuenta)
            {
                observaciones.AppendLine($"NDeCuenta: {baja.NDeCuenta} -> {request.NDeCuenta}");
                baja.NDeCuenta = request.NDeCuenta;
            }

            if (!string.IsNullOrEmpty(request.LetraCbu) && request.LetraCbu != baja.LetraCbu)
            {
                observaciones.AppendLine($"LetraCbu: {baja.LetraCbu} -> {request.LetraCbu}");

                baja.LetraCbu = request.LetraCbu;
            }

            if (!string.IsNullOrEmpty(request.LargoCbu) &&
                double.TryParse(request.LargoCbu, out double largoCbu) &&
                largoCbu != baja.LargoCbu)
            {
                observaciones.AppendLine($"LargoCbu: {baja.LargoCbu} -> {request.LargoCbu}");
                baja.LargoCbu = largoCbu;
            }

            if (!string.IsNullOrEmpty(request.Alias) && request.Alias != baja.Alias)
            {
                observaciones.AppendLine($"Alias: {baja.Alias} -> {request.Alias}");

                baja.Alias = request.Alias;
            }

            if (!string.IsNullOrEmpty(request.Mail) && request.Mail != baja.Mail)
            {
                observaciones.AppendLine($"Mail: {baja.Mail} -> {request.Mail}");

                baja.Mail = request.Mail;
            } 

            if (!string.IsNullOrEmpty(request.RazonSocial) && request.RazonSocial != baja.RazonSocial)
            {
                observaciones.AppendLine($"RazonSocial: {baja.RazonSocial} -> {request.RazonSocial}");

                baja.RazonSocial = request.RazonSocial;

            }

            if (!string.IsNullOrEmpty(request.CuitRazonSocial) && request.CuitRazonSocial != baja.CuitRazonSocial)
            {
                observaciones.AppendLine($"CuitRazonSocial: {baja.CuitRazonSocial} -> {request.CuitRazonSocial}");
                baja.CuitRazonSocial = request.CuitRazonSocial;
            }

            if (!string.IsNullOrEmpty(request.EstadoAfip) && request.EstadoAfip != baja.EstadoAfip)
            {
                observaciones.AppendLine($"EstadoAfip: {baja.EstadoAfip} -> {request.EstadoAfip}");

                baja.EstadoAfip = request.EstadoAfip;

            }

            if (!string.IsNullOrEmpty(request.CodActividad) && request.CodActividad != baja.CodActividad)
            {
                observaciones.AppendLine($"CodActividad: {baja.CodActividad} -> {request.CodActividad}");
                baja.CodActividad = request.CodActividad;
            }

            if (!string.IsNullOrEmpty(request.Actividad) && request.Actividad != baja.Actividad)
            {
                observaciones.AppendLine($"Actividad: {baja.Actividad} -> {request.Actividad}");

                baja.Actividad = request.Actividad;
            }

            if (!string.IsNullOrEmpty(request.Exento) && request.Exento != baja.Exento)
            {
                observaciones.AppendLine($"Exento: {baja.Exento} -> {request.Exento}");

                baja.Exento = request.Exento;
            }

            if (!string.IsNullOrEmpty(request.EstadoRentas) && request.EstadoRentas != baja.EstadoRentas)
            {
                observaciones.AppendLine($"EstadoRentas: {baja.EstadoRentas} -> {request.EstadoRentas}");

                baja.EstadoRentas = request.EstadoRentas;
            }

            if (!string.IsNullOrEmpty(request.Actividad2) && request.Actividad2 != baja.Actividad2)
            {
                observaciones.AppendLine($"Actividad2: {baja.Actividad2} -> {request.Actividad2}");

                baja.Actividad2 = request.Actividad2;
            }

            if (!string.IsNullOrEmpty(request.DomicilioFiscal) && request.DomicilioFiscal != baja.DomicilioFiscal)
            {
                observaciones.AppendLine($"DomicilioFiscal: {baja.DomicilioFiscal} -> {request.DomicilioFiscal}");

                baja.DomicilioFiscal = request.DomicilioFiscal;
            }

            if (!string.IsNullOrEmpty(request.Provincia3) && request.Provincia3 != baja.Provincia3)
            {
                observaciones.AppendLine($"Provincia3: {baja.Provincia3} -> {request.Provincia3}");

                baja.Provincia3 = request.Provincia3;
            }

            if (!string.IsNullOrEmpty(request.Alicuota) &&
      double.TryParse(request.Alicuota, out double alicuota) &&
      alicuota != baja.Alicuota)
            {
                observaciones.AppendLine($"Alicuota: {baja.Alicuota} -> {request.Alicuota}");
                baja.Alicuota = alicuota;
            }

            if (!string.IsNullOrEmpty(request.Observacion) && request.Observacion != baja.Observacion)
            {
                observaciones.AppendLine($"Observacion: {baja.Observacion} -> {request.Observacion}");

                baja.Observacion = request.Observacion;
            }

            if (!string.IsNullOrEmpty(request.OrigenDeLaTerminal) && request.OrigenDeLaTerminal != baja.OrigenDeLaTerminal)
            {
                observaciones.AppendLine($"OrigenDeLaTerminal: {baja.OrigenDeLaTerminal} -> {request.OrigenDeLaTerminal}");

                baja.OrigenDeLaTerminal = request.OrigenDeLaTerminal;
            }

            if (!string.IsNullOrEmpty(request.DestinoDeLaTerminal) && request.DestinoDeLaTerminal != baja.DestinoDeLaTerminal)
            {
                observaciones.AppendLine($"DestinoDeLaTerminal: {baja.DestinoDeLaTerminal} -> {request.DestinoDeLaTerminal}");

                baja.DestinoDeLaTerminal = request.DestinoDeLaTerminal;
            }

            if (!string.IsNullOrEmpty(request.ReUbicacion) && request.ReUbicacion != baja.ReUbicacion)
            {
                observaciones.AppendLine($"ReUbicacion: {baja.ReUbicacion} -> {request.ReUbicacion}");

                baja.ReUbicacion = request.ReUbicacion;

            }

            if (!string.IsNullOrEmpty(request.DiasSinAltaDeTerminal) && request.DiasSinAltaDeTerminal != baja.DiasSinAltaDeTerminal)
            {

                observaciones.AppendLine($"DiasSinAltaDeTerminal: {baja.DiasSinAltaDeTerminal} -> {request.DiasSinAltaDeTerminal}");
                baja.DiasSinAltaDeTerminal = request.DiasSinAltaDeTerminal;
            }

            if (!string.IsNullOrEmpty(request.AutorizadoPorTitular) && request.AutorizadoPorTitular != baja.AutorizadoPorTitular)
            {

                observaciones.AppendLine($"AutorizadoPorTitular: {baja.AutorizadoPorTitular} -> {request.AutorizadoPorTitular}");

                baja.AutorizadoPorTitular = request.AutorizadoPorTitular;
            }

            //if (!string.IsNullOrEmpty(request.FechaDeCargaAbm) && DateTime.TryParse(request.FechaDeCargaAbm, out DateTime fechaDeCargaAbm) && fechaDeCargaAbm != baja.FechaDeCargaAbm)
            //    baja.FechaDeCargaAbm = fechaDeCargaAbm;

            //if (!string.IsNullOrEmpty(request.FechaDeModificacion) && DateTime.TryParse(request.FechaDeModificacion, out DateTime fechaDeModificacion) && fechaDeModificacion != baja.FechaDeModificacion)
            //    baja.FechaDeModificacion = fechaDeModificacion;

            if (!string.IsNullOrEmpty(request.AbmObservacionesDeCarga) && request.AbmObservacionesDeCarga != baja.AbmObservacionesDeCarga)
            {
                observaciones.AppendLine($"AbmObservacionesDeCarga: {baja.AbmObservacionesDeCarga} -> {request.AbmObservacionesDeCarga}");

                baja.AbmObservacionesDeCarga = request.AbmObservacionesDeCarga;
            }

            if (!string.IsNullOrEmpty(request.ParaInforme) && request.ParaInforme != baja.ParaInforme)
            {
                observaciones.AppendLine($"ParaInforme: {baja.ParaInforme} -> {request.ParaInforme}");

                baja.ParaInforme = request.ParaInforme;
            }

            if (!string.IsNullOrEmpty(request.EnPausa) && request.EnPausa != baja.EnPausa)
            {
                observaciones.AppendLine($"EnPausa: {baja.EnPausa} -> {request.EnPausa}");

                baja.EnPausa = request.EnPausa;
            } 

            //if (!string.IsNullOrEmpty(request.FechaDeInicioDePausa) && DateTime.TryParse(request.FechaDeInicioDePausa, out DateTime fechaDeInicioDePausa) && fechaDeInicioDePausa != baja.FechaDeInicioDePausa)
            //    baja.FechaDeInicioDePausa = fechaDeInicioDePausa;

            //if (!string.IsNullOrEmpty(request.FechaDeFinalizacionDePausa) && DateTime.TryParse(request.FechaDeFinalizacionDePausa, out DateTime fechaDeFinalizacionDePausa) && fechaDeFinalizacionDePausa != baja.FechaDeFinalizacionDePausa)
            //    baja.FechaDeFinalizacionDePausa = fechaDeFinalizacionDePausa;

            if (!string.IsNullOrEmpty(request.Backup) && request.Backup != baja.Backup)
            {
                observaciones.AppendLine($"Backup: {baja.Backup} -> {request.Backup}");

                baja.Backup = request.Backup;

            }

            if (!string.IsNullOrEmpty(request.Altas) && request.Altas != baja.Altas)
            {
                observaciones.AppendLine($"Altas: {baja.Altas} -> {request.Altas}");

                baja.Altas = request.Altas;

            }

            if (!string.IsNullOrEmpty(request.Baja) && request.Baja != baja.Baja1)
            {
                observaciones.AppendLine($"Baja1: {baja.Baja1} -> {request.Baja}");

                baja.Baja1 = request.Baja;

            }

            //if (!string.IsNullOrEmpty(request.IngresoASstt) && DateTime.TryParse(request.IngresoASstt, out DateTime ingresoASstt) && ingresoASstt != baja.IngresoASstt)
            //    baja.IngresoASstt = ingresoASstt;

            //if (!string.IsNullOrEmpty(request.EgresoDeSstt) && request.EgresoDeSstt != baja.EgresoDeSstt.ToString())
            //    baja.EgresoDeSstt = double.Parse(request.EgresoDeSstt);

            //if (!string.IsNullOrEmpty(request.MotivoSstt) && request.MotivoSstt != baja.MotivoSstt)
            //    baja.MotivoSstt = request.MotivoSstt;

            //if (!string.IsNullOrEmpty(request._2IngresoASstt) && DateTime.TryParse(request._2IngresoASstt, out DateTime _2ingresoASstt) && _2ingresoASstt != baja._2IngresoASstt)
            //    baja._2IngresoASstt = _2ingresoASstt;

            //if (!string.IsNullOrEmpty(request._2EgresoDeSstt) && request._2EgresoDeSstt != baja._2EgresoDeSstt.ToString())
            //    baja._2EgresoDeSstt = double.Parse(request._2EgresoDeSstt);

            if (!string.IsNullOrEmpty(request._2MotivoSstt) && request._2MotivoSstt != baja._2MotivoSstt)
            {
                observaciones.AppendLine($"_2MotivoSstt: {baja._2MotivoSstt} -> {request._2MotivoSstt}");

                baja._2MotivoSstt = request._2MotivoSstt;

            }

            //if (!string.IsNullOrEmpty(request.FechaSsttMes) && DateTime.TryParse(request.FechaSsttMes, out DateTime fechaSsttMes) && fechaSsttMes != baja.FechaSsttMes)
            //    baja.FechaSsttMes = fechaSsttMes;
            // Conversión de CodActividadRentas
            if (!string.IsNullOrEmpty(request.CodActividadRentas) && request.CodActividadRentas != baja.CodActividadRentas)
            {
                observaciones.AppendLine($"CodActividadRentas: {baja.CodActividadRentas} -> {request.CodActividadRentas}");
                baja.CodActividadRentas = request.CodActividadRentas;
            }


            if (!string.IsNullOrEmpty(request.ActividadRentas) && request.ActividadRentas != baja.ActividadRentas)
            {
                observaciones.AppendLine($"ActividadRentas: {baja.ActividadRentas} -> {request.ActividadRentas}");
                baja.ActividadRentas = request.ActividadRentas;

            }
        }

    }
}
