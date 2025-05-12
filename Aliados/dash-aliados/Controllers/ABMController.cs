using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ABMController : ControllerBase
    {
        private readonly IAltaService _altaservice;
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IHistorialCRMService _historialCRMService;
        private readonly IBajaService _bajaService;
        private readonly ICloverService _cloverService;
        private readonly IPanelControlInterno _panelControlInterno;

        public ABMController(IAltaService altaservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService,
            IHistorialCRMService historialCRMService, IBajaService bajaservice, ICloverService cloverService, IPanelControlInterno panelControlInterno)
        {
            _altaservice = altaservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _bajaService = bajaservice;
            _historialCRMService = historialCRMService;
            _cloverService = cloverService;
            _panelControlInterno = panelControlInterno;
        }
        [HttpPost("baja")]
        public async Task<IActionResult> baja([FromBody] VMCambioTerminal request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if(terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
                    // Conversiones y asignaciones
                    var sasMutual = TerminalAlta.SasMutual;
                    var estado = "BAJA";
                    var nDeTerminal = Convert.ToString(TerminalAlta.NDeTerminal);
                    var nDeComercio = TerminalAlta.NDeComercio;
                    var nroLocal = TerminalAlta.NroLocal;
                    var legajo = TerminalAlta.Legajo;
                    var nombreDeFantasia = TerminalAlta.NombreDeFantasia;
                    var domicilio = TerminalAlta.Domicilio;
                    var localidad = TerminalAlta.Localidad;
                    var codigoPostal = TerminalAlta.CodigoPostal?.ToString();
                    var telefono = TerminalAlta.Telefono;
                    var linkDePago = TerminalAlta.LinkDePago;
                    var rubro = TerminalAlta.Rubro;
                    var rubroSecundario = TerminalAlta.RubroSecundario;
                    var altaAhora12 = TerminalAlta.AltaAhora12;
                    var fechaDeAlta = TerminalAlta.FechaDeAlta;
                    // Suponiendo que request.FechaBaja es un string en formato "YYYY/MM/DD"
                    var fechaDeBajaString = request.FechaBaja;

                    if (!DateTime.TryParseExact(fechaDeBajaString, "yyyy/MM/dd",
                                                System.Globalization.CultureInfo.InvariantCulture,
                                                System.Globalization.DateTimeStyles.None,
                                                out DateTime fechaDeBaja))
                    {
                        // Si la conversión falla, se usa la fecha actual sin la hora
                        fechaDeBaja = fechaCierreArg.Date; // Asignar solo la fecha, sin la hora
                    }

                    // Aquí puedes usar 'fechaDeBaja' como un objeto DateTime
                    var tipoDeBaja = TerminalAlta.TipoDeBaja;
                    var programacionBaja = TerminalAlta.ProgramacionBaja;
                    double? diasParaAlta = null;
                    if (!string.IsNullOrEmpty(TerminalAlta.DiasParaAlta) && double.TryParse(TerminalAlta.DiasParaAlta, out double result))
                    {
                        diasParaAlta = result;
                    }
                    var provincia = TerminalAlta.Provincia;
                    var nombreDelAsesor = TerminalAlta.NombreDelAsesor;
                    var titular = TerminalAlta.Titular;
                    var cuitCuil = TerminalAlta.CuitCuil;
                    var banco = TerminalAlta.Banco;
                    var tipoDeCuenta = TerminalAlta.TipoDeCuenta;
                    var cbuCvu = TerminalAlta.CbuCvu;
                    var nDeCuenta = TerminalAlta.NDeCuenta;
                    var letraCbu = TerminalAlta.LetraCbu;
                    var largoCbu = TerminalAlta.LargoCbu;
                    var alias = TerminalAlta.Alias;
                    var mail = TerminalAlta.Mail;
                    var razonSocial = TerminalAlta.RazonSocial;
                    var cuitRazonSocial = TerminalAlta.CuitRazonSocial?.ToString();
                    var estadoAfip = TerminalAlta.EstadoAfip;
                    var codActividad = TerminalAlta.CodActividad?.ToString();
                    var actividad = TerminalAlta.Actividad;
                    var exento = TerminalAlta.Exento;
                    var estadoRentas = TerminalAlta.EstadoRentas;
                    var actividad2 = TerminalAlta.Actividad2;
                    var domicilioFiscal = TerminalAlta.DomicilioFiscal;
                    var provincia3 = TerminalAlta.Provincia3;
                    var alicuota = TerminalAlta.Alicuota;
                    var observacion = request.Observacion;
                    var origenDeLaTerminal = TerminalAlta.OrigenDeLaTerminal;
                    var destinoDeLaTerminal = TerminalAlta.DestinoDeLaTerminal;
                    var reUbicacion = TerminalAlta.ReUbicacion;
                    var diasSinAltaDeTerminal = TerminalAlta.DiasSinAltaDeTerminal;
                    var autorizadoPorTitular = TerminalAlta.AutorizadoPorTitular;
                    var fechaDeCargaAbm = TerminalAlta.FechaDeCargaAbm?.ToString();
                    var fechaDeModificacion = TerminalAlta.FechaDeModificacion?.ToString();
                    var abmObservacionesDeCarga = TerminalAlta.AbmObservacionesDeCarga;
                    var paraInforme = TerminalAlta.ParaInforme;
                    var enPausa = TerminalAlta.EnPausa;
                    var fechaDeInicioDePausa = TerminalAlta.FechaDeInicioDePausa;
                    var fechaDeFinalizacionDePausa = TerminalAlta.FechaDeFinalizacionDePausa;
                    var backup = TerminalAlta.Backup;
                    var altas = TerminalAlta.Altas;
                    var baja1 = string.IsNullOrEmpty(request.Motivo) ? "BAJA" : request.Motivo;
                    var ingresoASstt = TerminalAlta.IngresoASstt?.ToString();
                    var egresoDeSstt = TerminalAlta.EgresoDeSstt?.ToString();
                    var motivoSstt = TerminalAlta.MotivoSstt;
                    var _2IngresoASstt = TerminalAlta._2IngresoASstt;
                    var _2EgresoDeSstt = TerminalAlta._2EgresoDeSstt;
                    var _2MotivoSstt = TerminalAlta._2MotivoSstt;
                    var fechaSsttMes = TerminalAlta.FechaSsttMes?.ToString();
                    var codActividadRentas = TerminalAlta.CodActividadRentas?.ToString();
                    var actividadRentas = TerminalAlta.ActividadRentas;

                    // Actualiza el estado de `Alta` a "BAJA"
                    bool RES = await _altaservice.EditarSimple(TerminalAlta.Id, fechaDeBaja);
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

                    Usuario aliado = null;

                    if (baja.CuitCuil.HasValue && baja.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = baja.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    var bajaid = await _bajaService.NuevaALta(baja);

                    await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion, bajaid.Id);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM BAJA",
                        Aliado = baja.NombreDeFantasia,
                        Motivo = "BAJA TERMINAL",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = baja.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);
                    return Ok();


                }
                else
                {
                    return Ok("la terminal no esta dada de alta");
                }

            }
            return Unauthorized();

        }
        [HttpPost("sstt")]
        public async Task<IActionResult> sstt([FromBody] VMCambioTerminal request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    var estado = "SERVICIO.TECNICO";


                    //var Terminaladaralta = await _altaservice.TerminalBaja(request.NumeroTerminalAlta);
                    //if (terminalestaalta = true)
                    //{
                    //    var TerminalAlta2 = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalAlta);
                    //    if (TerminalAlta2 == null)
                    //    {

                    //        return BadRequest("Alta no encontrada.");
                    //    }
                    //    else
                    //    {
                    //        await _altaservice.EditarparaAlta(TerminalAlta2, TerminalAlta.Id);
                    //        await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta2.Id, request.Observacion);
                    //    }
                    Usuario aliado = null;

                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    TerminalAlta.Estado = estado;

                    await _altaservice.EditarAbm(TerminalAlta);
                    await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM SSTT",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "SSTT",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);
                    return Ok();


                }
                else
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    var estado = "SERVICIO.TECNICO";


                    //var Terminaladaralta = await _altaservice.TerminalBaja(request.NumeroTerminalAlta);
                    //if (terminalestaalta = true)
                    //{
                    //    var TerminalAlta2 = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalAlta);
                    //    if (TerminalAlta2 == null)
                    //    {

                    //        return BadRequest("Alta no encontrada.");
                    //    }
                    //    else
                    //    {
                    //        await _altaservice.EditarparaAlta(TerminalAlta2, TerminalAlta.Id);
                    //        await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta2.Id, request.Observacion);
                    //    }
                    Usuario aliado = null;

                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    TerminalAlta.Estado = estado;

                    await _altaservice.EditarAbm(TerminalAlta);
                    await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM SSTT",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "SSTT",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                }


            }
            return Unauthorized();
        }
        [HttpPost("ssttcambio")]
        public async Task<IActionResult> ssttcambio([FromBody] VMCambioTerminal request)
        {

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                  

                    var Terminaladaralta = await _altaservice.TerminalBaja(request.NumeroTerminalAlta);
                    if (Terminaladaralta == true)
                    {
                        var TerminalAlta2 = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalAlta);
                        if (TerminalAlta2 == null)
                        {

                            return BadRequest("Alta no encontrada.");
                        }
                        else
                        {
                            TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                            DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                            //TerminalAlta2.FechaDeAlta = fechaActualArgentina;
                            ////await _altaservice.EditarparaAlta(TerminalAlta2, TerminalAlta.Id);
                            ////await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta2.Id, request.Observacion);
                            //var sasMutual = TerminalAlta.SasMutual;
                            //var estado = "SERVICIO.TECNICO";
                            //var nDeTerminal = $"{TerminalAlta.Legajo}-{Convert.ToString(TerminalAlta.NDeTerminal)}";
                            //var nDeComercio = TerminalAlta.NDeComercio;
                            //var nroLocal = TerminalAlta.NroLocal;
                            //var legajo = TerminalAlta.Legajo;
                            //var nombreDeFantasia = TerminalAlta.NombreDeFantasia;
                            //var domiciliobaja = TerminalAlta.Domicilio;
                            //var localidad = TerminalAlta.Localidad;
                            //var codigoPostalbaja = TerminalAlta.CodigoPostal?.ToString();
                            //var telefono = TerminalAlta.Telefono;
                            //var linkDePago = TerminalAlta.LinkDePago;
                            //var rubro = TerminalAlta.Rubro;
                            //var rubroSecundario = TerminalAlta.RubroSecundario;
                            //var altaAhora12 = TerminalAlta.AltaAhora12;
                            //var fechaDeAlta = TerminalAlta.FechaDeAlta;
                            //var fechaDeBaja = TerminalAlta.FechaDeBaja;
                            //var tipoDeBaja = TerminalAlta.TipoDeBaja;
                            //var programacionBaja = TerminalAlta.ProgramacionBaja;
                            //double? diasParaAlta = null;
                            //if (!string.IsNullOrEmpty(TerminalAlta.DiasParaAlta) && double.TryParse(TerminalAlta.DiasParaAlta, out double result))
                            //{
                            //    diasParaAlta = result;
                            //}
                            //var provinciabaja = TerminalAlta.Provincia;
                            //var nombreDelAsesor = TerminalAlta.NombreDelAsesor;
                            //var titular = TerminalAlta.Titular;
                            //var cuitCuil = TerminalAlta.CuitCuil;
                            //var bancobaja = TerminalAlta.Banco;
                            //var tipoDeCuenta = TerminalAlta.TipoDeCuenta;
                            //var cbuCvu = TerminalAlta.CbuCvu;
                            //var nDeCuenta = Convert.ToDouble(TerminalAlta.NDeCuenta);
                            //var letraCbu = TerminalAlta.LetraCbu;
                            //var largoCbu = TerminalAlta.LargoCbu;
                            //var aliasbaja = TerminalAlta.Alias;
                            //var mail = TerminalAlta.Mail;
                            //var razonSocial = TerminalAlta.RazonSocial;
                            //var cuitRazonSocial = TerminalAlta.CuitRazonSocial?.ToString();
                            //var estadoAfip = TerminalAlta.EstadoAfip;
                            //var codActividad = TerminalAlta.CodActividad?.ToString();
                            //var actividad = TerminalAlta.Actividad;
                            //var exento = TerminalAlta.Exento;
                            //var estadoRentas = TerminalAlta.EstadoRentas;
                            //var actividad2 = TerminalAlta.Actividad2;
                            //var domicilioFiscal = TerminalAlta.DomicilioFiscal;
                            //var provincia3 = TerminalAlta.Provincia3;
                            //var alicuota = TerminalAlta.Alicuota;
                            //var observacion = TerminalAlta.Observacion;
                            //var origenDeLaTerminal = TerminalAlta.OrigenDeLaTerminal;
                            //var destinoDeLaTerminal = TerminalAlta.DestinoDeLaTerminal;
                            //var reUbicacion = TerminalAlta.ReUbicacion;
                            //var diasSinAltaDeTerminal = TerminalAlta.DiasSinAltaDeTerminal;
                            //var autorizadoPorTitular = TerminalAlta.AutorizadoPorTitular;
                            //var fechaDeCargaAbm = TerminalAlta.FechaDeCargaAbm?.ToString();
                            //var fechaDeModificacion = TerminalAlta.FechaDeModificacion?.ToString();
                            //var abmObservacionesDeCarga = TerminalAlta.AbmObservacionesDeCarga;
                            //var paraInforme = TerminalAlta.ParaInforme;
                            //var enPausa = TerminalAlta.EnPausa;
                            //var fechaDeInicioDePausa = TerminalAlta.FechaDeInicioDePausa;
                            //var fechaDeFinalizacionDePausa = TerminalAlta.FechaDeFinalizacionDePausa;
                            //var backup = TerminalAlta.Backup;
                            //var altas = TerminalAlta.Altas;
                            //var baja1 = "BAJA SSTT";
                            //var ingresoASstt = TerminalAlta.IngresoASstt?.ToString();
                            //var egresoDeSstt = TerminalAlta.EgresoDeSstt?.ToString();
                            //var motivoSstt = TerminalAlta.MotivoSstt;
                            //var _2IngresoASstt = TerminalAlta._2IngresoASstt;
                            //var _2EgresoDeSstt = TerminalAlta._2EgresoDeSstt;
                            //var _2MotivoSstt = TerminalAlta._2MotivoSstt;
                            //var fechaSsttMes = TerminalAlta.FechaSsttMes?.ToString();
                            //var codActividadRentas = TerminalAlta.CodActividadRentas?.ToString();
                            //var actividadRentas = TerminalAlta.ActividadRentas;
                            //var baja = new Baja
                            //{
                            //    SasMutual = sasMutual,
                            //    Estado = estado,
                            //    NDeTerminal = nDeTerminal,
                            //    NDeComercio = nDeComercio,
                            //    NroLocal = nroLocal,
                            //    Legajo = legajo,
                            //    NombreDeFantasia = nombreDeFantasia,
                            //    Domicilio = domiciliobaja,
                            //    Localidad = localidad,
                            //    CodigoPostal = codigoPostalbaja,
                            //    Telefono = telefono,
                            //    LinkDePago = linkDePago,
                            //    Rubro = rubro,
                            //    RubroSecundario = rubroSecundario,
                            //    AltaAhora12 = altaAhora12,
                            //    FechaDeAlta = fechaDeAlta,
                            //    FechaDeBaja = fechaDeBaja,
                            //    TipoDeBaja = tipoDeBaja,
                            //    ProgramacionBaja = programacionBaja,
                            //    DiasParaAlta = diasParaAlta,
                            //    Provincia = provinciabaja,
                            //    NombreDelAsesor = nombreDelAsesor,
                            //    Titular = titular,
                            //    CuitCuil = cuitCuil,
                            //    Banco = bancobaja,
                            //    TipoDeCuenta = tipoDeCuenta,
                            //    CbuCvu = cbuCvu,
                            //    NDeCuenta = nDeCuenta,
                            //    LetraCbu = letraCbu,
                            //    LargoCbu = largoCbu,
                            //    Alias = aliasbaja,
                            //    Mail = mail,
                            //    RazonSocial = razonSocial,
                            //    CuitRazonSocial = cuitRazonSocial,
                            //    EstadoAfip = estadoAfip,
                            //    CodActividad = codActividad,
                            //    Actividad = actividad,
                            //    Exento = exento,
                            //    EstadoRentas = estadoRentas,
                            //    Actividad2 = actividad2,
                            //    DomicilioFiscal = domicilioFiscal,
                            //    Provincia3 = provincia3,
                            //    Alicuota = alicuota,
                            //    Observacion = observacion,
                            //    OrigenDeLaTerminal = origenDeLaTerminal,
                            //    DestinoDeLaTerminal = destinoDeLaTerminal,
                            //    ReUbicacion = reUbicacion,
                            //    DiasSinAltaDeTerminal = diasSinAltaDeTerminal,
                            //    AutorizadoPorTitular = autorizadoPorTitular,
                            //    FechaDeCargaAbm = fechaDeCargaAbm,
                            //    FechaDeModificacion = fechaDeModificacion,
                            //    AbmObservacionesDeCarga = abmObservacionesDeCarga,
                            //    ParaInforme = paraInforme,
                            //    EnPausa = enPausa,
                            //    FechaDeInicioDePausa = fechaDeInicioDePausa,
                            //    FechaDeFinalizacionDePausa = fechaDeFinalizacionDePausa,
                            //    Backup = backup,
                            //    Altas = altas,
                            //    Baja1 = baja1,
                            //    IngresoASstt = ingresoASstt,
                            //    EgresoDeSstt = egresoDeSstt,
                            //    MotivoSstt = motivoSstt,
                            //    _2IngresoASstt = _2IngresoASstt,
                            //    _2EgresoDeSstt = _2EgresoDeSstt,
                            //    _2MotivoSstt = _2MotivoSstt,
                            //    FechaSsttMes = fechaSsttMes,
                            //    CodActividadRentas = codActividadRentas,
                            //    ActividadRentas = actividadRentas
                            //}; 
                            TerminalAlta2.Altas = "ALTA SSTT";
                            TerminalAlta2.Baja = null;
                            TerminalAlta2.FechaDeAlta = DateTime.Today;
                            TerminalAlta2.FechaDeBaja = null;
                            TerminalAlta2.Provincia = TerminalAlta.Provincia;
                            TerminalAlta2.Provincia3 = TerminalAlta.Provincia3;
                            TerminalAlta2.Alicuota = TerminalAlta.Alicuota;
                            await _altaservice.EditarparaAlta(TerminalAlta2, TerminalAlta.Id);
                           // await _bajaService.NuevaALta(baja);
                            await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta2.Id, request.Observacion);
                            var estado2 = "SERVICIO.TECNICO";
                            var baja = "BAJA POR SSTT";



                            TerminalAlta.Estado = estado2;
                            TerminalAlta.Baja = baja;

                            await _altaservice.EditarAbm(TerminalAlta);
                            //bool RES = await _altaservice.EditarSimpleServicioTecnico(TerminalAlta.Id);
                            //if (!RES)
                            //{
                            //    return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado de Alta.");
                            //}
                            Usuario aliado1 = null;
                            Usuario aliado2 = null;

                            // Verificar y obtener el usuario por CUIT para TerminalAlta2
                            if (TerminalAlta2.CuitCuil.HasValue && TerminalAlta2.CuitCuil.Value % 1 == 0)
                            {
                                var cuitString = TerminalAlta2.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                                aliado1 = await _usuariozoco.ObtenerPorCuit(cuitString);
                            }

                            // Verificar y obtener el usuario por CUIT para TerminalAlta
                            if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                            {
                                var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                                aliado2 = await _usuariozoco.ObtenerPorCuit(cuitString);
                            }

                            await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                            var panelcontrolinterno = new PanelGestorInterno
                            {
                                CanalAtencion = "CRM",
                                Tipo = "CRM SSTT Y CAMBIO DE TERMINAL",
                                Aliado = TerminalAlta2.NombreDeFantasia,
                                Motivo = "CRM SSTT Y CAMBIO DE TERMINAL",
                                Estado = "Cerrada",
                                FechaCarga = fechaCierreArg,
                                IdUser = usuarioEncontrado.usuario.Id,
                                Observaciones = request.Observacion,
                                IdAliado = aliado1?.Id, // Asigna null si aliado1 es null
                                NroTerminal = TerminalAlta2.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                            };

                            await _panelControlInterno.Crear(panelcontrolinterno);

                            var panelcontrolinterno2 = new PanelGestorInterno
                            {
                                CanalAtencion = "CRM",
                                Tipo = "ALTA",
                                Aliado = TerminalAlta.NombreDeFantasia,
                                Motivo = "ALTA",
                                Estado = "Cerrada",
                                FechaCarga = fechaCierreArg,
                                IdUser = usuarioEncontrado.usuario.Id,
                                Observaciones = request.Observacion,
                                IdAliado = aliado2?.Id, // Asigna null si aliado2 es null
                                NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                            };

                            await _panelControlInterno.Crear(panelcontrolinterno2);

                        }



                    }
                    return Ok();

                }
                else
                {
                    return Ok("la terminal no esta dada de alta");
                }


            }
            return Unauthorized();
        }
        [HttpPost("bajaycambioclover")]
        public async Task<IActionResult> bajaycambioclover([FromBody] VMCambioTerminal request)
        {

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                    // Conversiones y asignaciones
                    var sasMutual = TerminalAlta.SasMutual;
                    var estado = "BAJA";
                    var nDeTerminal = Convert.ToString(TerminalAlta.NDeTerminal);
                    var nDeComercio = TerminalAlta.NDeComercio;
                    var nroLocal = TerminalAlta.NroLocal;
                    var legajo = TerminalAlta.Legajo;
                    var nombreDeFantasia = TerminalAlta.NombreDeFantasia;
                    var domicilio = TerminalAlta.Domicilio;
                    var localidad = TerminalAlta.Localidad;
                    var codigoPostal = TerminalAlta.CodigoPostal?.ToString();
                    var telefono = TerminalAlta.Telefono;
                    var linkDePago = TerminalAlta.LinkDePago;
                    var rubro = TerminalAlta.Rubro;
                    var rubroSecundario = TerminalAlta.RubroSecundario;
                    var altaAhora12 = TerminalAlta.AltaAhora12;
                    var fechaDeAlta = TerminalAlta.FechaDeAlta;
                  //  var fechaDeBaja = fechaActualArgentina;
                    var tipoDeBaja = TerminalAlta.TipoDeBaja;
                    var programacionBaja = TerminalAlta.ProgramacionBaja;
                    double? diasParaAlta = null;
                    if (!string.IsNullOrEmpty(TerminalAlta.DiasParaAlta) && double.TryParse(TerminalAlta.DiasParaAlta, out double result))
                    {
                        diasParaAlta = result;
                    }
                    var provincia = TerminalAlta.Provincia;
                    var nombreDelAsesor = TerminalAlta.NombreDelAsesor;
                    var titular = TerminalAlta.Titular;
                    var cuitCuil = TerminalAlta.CuitCuil;
                    var banco = TerminalAlta.Banco;
                    var tipoDeCuenta = TerminalAlta.TipoDeCuenta;
                    var cbuCvu = TerminalAlta.CbuCvu;
                    var nDeCuenta = TerminalAlta.NDeCuenta;
                    var letraCbu = TerminalAlta.LetraCbu;
                    var largoCbu = TerminalAlta.LargoCbu;
                    var alias = TerminalAlta.Alias;
                    var mail = TerminalAlta.Mail;
                    var razonSocial = TerminalAlta.RazonSocial;
                    var cuitRazonSocial = TerminalAlta.CuitRazonSocial?.ToString();
                    var estadoAfip = TerminalAlta.EstadoAfip;
                    var codActividad = TerminalAlta.CodActividad?.ToString();
                    var actividad = TerminalAlta.Actividad;
                    var exento = TerminalAlta.Exento;
                    var estadoRentas = TerminalAlta.EstadoRentas;
                    var actividad2 = TerminalAlta.Actividad2;
                    var domicilioFiscal = TerminalAlta.DomicilioFiscal;
                    var provincia3 = TerminalAlta.Provincia3;
                    var alicuota = TerminalAlta.Alicuota;
                    var observacion = request.Observacion;
                    var origenDeLaTerminal = TerminalAlta.OrigenDeLaTerminal;
                    var destinoDeLaTerminal = TerminalAlta.DestinoDeLaTerminal;
                    var reUbicacion = TerminalAlta.ReUbicacion;
                    var diasSinAltaDeTerminal = TerminalAlta.DiasSinAltaDeTerminal;
                    var autorizadoPorTitular = TerminalAlta.AutorizadoPorTitular;
                    var fechaDeCargaAbm = TerminalAlta.FechaDeCargaAbm?.ToString();
                    var fechaDeModificacion = TerminalAlta.FechaDeModificacion?.ToString();
                    var abmObservacionesDeCarga = TerminalAlta.AbmObservacionesDeCarga;
                    var paraInforme = TerminalAlta.ParaInforme;
                    var enPausa = TerminalAlta.EnPausa;
                    var fechaDeInicioDePausa = TerminalAlta.FechaDeInicioDePausa;
                    var fechaDeFinalizacionDePausa = TerminalAlta.FechaDeFinalizacionDePausa;
                    var backup = TerminalAlta.Backup;
                    var altas = TerminalAlta.Altas;
                    var baja1 = "BAJA POR POSNET";
                    var ingresoASstt = TerminalAlta.IngresoASstt?.ToString();
                    var egresoDeSstt = TerminalAlta.EgresoDeSstt?.ToString();
                    var motivoSstt = TerminalAlta.MotivoSstt;
                    var _2IngresoASstt = TerminalAlta._2IngresoASstt;
                    var _2EgresoDeSstt = TerminalAlta._2EgresoDeSstt;
                    var _2MotivoSstt = TerminalAlta._2MotivoSstt;
                    var fechaSsttMes = TerminalAlta.FechaSsttMes?.ToString();
                    var codActividadRentas = TerminalAlta.CodActividadRentas?.ToString();
                    var actividadRentas = TerminalAlta.ActividadRentas;

                    // Actualiza el estado de `Alta` a "BAJA"
                  /*  bool RES = await _altaservice.EditarSimple(TerminalAlta.Id);
                    if (!RES)
                    {
                        return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado de Alta.");
                    }*/

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
                        FechaDeBaja = null,
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

                    Usuario aliado = null;

                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    var bajaid = await _bajaService.NuevaALta(baja);

                    var nterminal = Convert.ToDouble(request.NumeroTerminalAlta);
                    await _altaservice.EditarSimpleAltaClover(TerminalAlta.Id, nterminal);
                    await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion, bajaid.Id);
                    await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    var clover = new Clover
                    {
                        IdAlta = TerminalAlta.Id,
                        NroVerifone = request.NumeroTerminalBaja,
                        NroClover = request.NumeroTerminalAlta,
                        Fecha = fechaActualArgentina,
                    };

                    await _cloverService.CrearNuevaClover(clover);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM BAJA Y SE CAMBIO POR CLOVER",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "CRM BAJA Y SE CAMBIO POR CLOVER",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();


                }
                else
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }

                    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);

                    Usuario aliado = null;

                    // Verificar si CuitCuil es un número entero y obtener el usuario
                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    var nterminal = Convert.ToDouble(request.NumeroTerminalAlta);
                    await _altaservice.EditarSimpleAltaClover(TerminalAlta.Id, nterminal);
                    await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    var clover = new Clover
                    {
                        IdAlta = TerminalAlta.Id,
                        NroVerifone = request.NumeroTerminalBaja,
                        NroClover = request.NumeroTerminalAlta,
                        Fecha = fechaActualArgentina,
                    };

                    await _cloverService.CrearNuevaClover(clover);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM BAJA Y SE CAMBIO POR CLOVER",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "CRM BAJA Y SE CAMBIO POR CLOVER",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();

                }

            }
            return Unauthorized();
        }
        [HttpPost("desvinculacion")]
        public async Task<IActionResult> desvinculacion([FromBody] VMCambioTerminal request)
        {

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                    // Conversiones y asignaciones
                    var sasMutual = TerminalAlta.SasMutual;
                    var estado = "BAJA";
                    var nDeTerminal = Convert.ToString(TerminalAlta.NDeTerminal);
                    var nDeComercio = TerminalAlta.NDeComercio;
                    var nroLocal = TerminalAlta.NroLocal;
                    var legajo = TerminalAlta.Legajo;
                    var nombreDeFantasia = TerminalAlta.NombreDeFantasia;
                    var domicilio = TerminalAlta.Domicilio;
                    var localidad = TerminalAlta.Localidad;
                    var codigoPostal = TerminalAlta.CodigoPostal?.ToString();
                    var telefono = TerminalAlta.Telefono;
                    var linkDePago = TerminalAlta.LinkDePago;
                    var rubro = TerminalAlta.Rubro;
                    var rubroSecundario = TerminalAlta.RubroSecundario;
                    var altaAhora12 = TerminalAlta.AltaAhora12;
                    var fechaDeAlta = TerminalAlta.FechaDeAlta;
               //     var fechaDeBaja = fechaActualArgentina;
                    var tipoDeBaja = TerminalAlta.TipoDeBaja;
                    var programacionBaja = TerminalAlta.ProgramacionBaja;
                    double? diasParaAlta = null;
                    if (!string.IsNullOrEmpty(TerminalAlta.DiasParaAlta) && double.TryParse(TerminalAlta.DiasParaAlta, out double result))
                    {
                        diasParaAlta = result;
                    }
                    var provincia = TerminalAlta.Provincia;
                    var nombreDelAsesor = TerminalAlta.NombreDelAsesor;
                    var titular = TerminalAlta.Titular;
                    var cuitCuil = TerminalAlta.CuitCuil;
                    var banco = TerminalAlta.Banco;
                    var tipoDeCuenta = TerminalAlta.TipoDeCuenta;
                    var cbuCvu = TerminalAlta.CbuCvu;
                    var nDeCuenta = TerminalAlta.NDeCuenta;
                    var letraCbu = TerminalAlta.LetraCbu;
                    var largoCbu = TerminalAlta.LargoCbu;
                    var alias = TerminalAlta.Alias;
                    var mail = TerminalAlta.Mail;
                    var razonSocial = TerminalAlta.RazonSocial;
                    var cuitRazonSocial = TerminalAlta.CuitRazonSocial?.ToString();
                    var estadoAfip = TerminalAlta.EstadoAfip;
                    var codActividad = TerminalAlta.CodActividad?.ToString();
                    var actividad = TerminalAlta.Actividad;
                    var exento = TerminalAlta.Exento;
                    var estadoRentas = TerminalAlta.EstadoRentas;
                    var actividad2 = TerminalAlta.Actividad2;
                    var domicilioFiscal = TerminalAlta.DomicilioFiscal;
                    var provincia3 = TerminalAlta.Provincia3;
                    var alicuota = TerminalAlta.Alicuota;
                    var observacion = request.Observacion;
                    var origenDeLaTerminal = TerminalAlta.OrigenDeLaTerminal;
                    var destinoDeLaTerminal = TerminalAlta.DestinoDeLaTerminal;
                    var reUbicacion = TerminalAlta.ReUbicacion;
                    var diasSinAltaDeTerminal = TerminalAlta.DiasSinAltaDeTerminal;
                    var autorizadoPorTitular = TerminalAlta.AutorizadoPorTitular;
                    var fechaDeCargaAbm = TerminalAlta.FechaDeCargaAbm?.ToString();
                    var fechaDeModificacion = TerminalAlta.FechaDeModificacion?.ToString();
                    var abmObservacionesDeCarga = TerminalAlta.AbmObservacionesDeCarga;
                    var paraInforme = TerminalAlta.ParaInforme;
                    var enPausa = TerminalAlta.EnPausa;
                    var fechaDeInicioDePausa = TerminalAlta.FechaDeInicioDePausa;
                    var fechaDeFinalizacionDePausa = TerminalAlta.FechaDeFinalizacionDePausa;
                    var backup = TerminalAlta.Backup;
                    var altas = TerminalAlta.Altas;
                    var baja1 = "BAJA POR POSNET";
                    var ingresoASstt = TerminalAlta.IngresoASstt?.ToString();
                    var egresoDeSstt = TerminalAlta.EgresoDeSstt?.ToString();
                    var motivoSstt = TerminalAlta.MotivoSstt;
                    var _2IngresoASstt = TerminalAlta._2IngresoASstt;
                    var _2EgresoDeSstt = TerminalAlta._2EgresoDeSstt;
                    var _2MotivoSstt = TerminalAlta._2MotivoSstt;
                    var fechaSsttMes = TerminalAlta.FechaSsttMes?.ToString();
                    var codActividadRentas = TerminalAlta.CodActividadRentas?.ToString();
                    var actividadRentas = TerminalAlta.ActividadRentas;

                    // Actualiza el estado de `Alta` a "BAJA"
                    /*  bool RES = await _altaservice.EditarSimple(TerminalAlta.Id);
                      if (!RES)
                      {
                          return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado de Alta.");
                      }*/

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
                        FechaDeBaja = null,
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

                    var bajaid = await _bajaService.NuevaALta(baja);

                    Usuario aliado = null;

                    // Verificar si CuitCuil es un número entero y obtener el usuario
                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    var nterminal = Convert.ToDouble(request.NumeroTerminalAlta);
                    await _altaservice.EditarSimpleAltaClover(TerminalAlta.Id, nterminal);

                    await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion, bajaid.Id);

                    var clover = new Clover
                    {
                        IdAlta = TerminalAlta.Id,
                        NroVerifone = request.NumeroTerminalBaja,
                        NroClover = request.NumeroTerminalAlta,
                        Fecha = fechaActualArgentina,
                    };

                    await _cloverService.CrearNuevaClover(clover);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "DESVINCULACION",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "DESVINCULACION",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();


                }
                else
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }

                    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);

                    Usuario aliado = null;

                    // Verificar si CuitCuil es un número entero y obtener el usuario
                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    var nterminal = Convert.ToDouble(request.NumeroTerminalAlta);
                    await _altaservice.EditarSimpleAltaClover(TerminalAlta.Id, nterminal);

                    var clover = new Clover
                    {
                        IdAlta = TerminalAlta.Id,
                        NroVerifone = request.NumeroTerminalBaja,
                        NroClover = request.NumeroTerminalAlta,
                        Fecha = fechaActualArgentina,
                    };

                    await _cloverService.CrearNuevaClover(clover);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "DESVINCULACION",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "DESVINCULACION",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();

                }

            }
            return Unauthorized();
        }
        [HttpPost("cambiotitularidad")]
        public async Task<IActionResult> cambiotitularidad([FromBody] VMCambioTerminal request)
        {

            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                    // Conversiones y asignaciones
                    var sasMutual = TerminalAlta.SasMutual;
                    var estado = "BAJA";
                    var nDeTerminal = Convert.ToString(TerminalAlta.NDeTerminal);
                    var nDeComercio = TerminalAlta.NDeComercio;
                    var nroLocal = TerminalAlta.NroLocal;
                    var legajo = TerminalAlta.Legajo;
                    var nombreDeFantasia = TerminalAlta.NombreDeFantasia;
                    var domicilio = TerminalAlta.Domicilio;
                    var localidad = TerminalAlta.Localidad;
                    var codigoPostal = TerminalAlta.CodigoPostal?.ToString();
                    var telefono = TerminalAlta.Telefono;
                    var linkDePago = TerminalAlta.LinkDePago;
                    var rubro = TerminalAlta.Rubro;
                    var rubroSecundario = TerminalAlta.RubroSecundario;
                    var altaAhora12 = TerminalAlta.AltaAhora12;
                    var fechaDeAlta = TerminalAlta.FechaDeAlta;
                    DateTime fechaDeBaja;
                    bool fechaValida = DateTime.TryParseExact(request.FechaBaja, "yyyy/MM/dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaDeBaja);

                    if (!fechaValida)
                    {
                        fechaDeBaja = fechaActualArgentina;
                    }
                    var tipoDeBaja = TerminalAlta.TipoDeBaja;
                    var programacionBaja = TerminalAlta.ProgramacionBaja;
                    double? diasParaAlta = null;
                    if (!string.IsNullOrEmpty(TerminalAlta.DiasParaAlta) && double.TryParse(TerminalAlta.DiasParaAlta, out double result))
                    {
                        diasParaAlta = result;
                    }
                    var provincia = TerminalAlta.Provincia;
                    var nombreDelAsesor = TerminalAlta.NombreDelAsesor;
                    var titular = TerminalAlta.Titular;
                    var cuitCuil = TerminalAlta.CuitCuil;
                    var banco = TerminalAlta.Banco;
                    var tipoDeCuenta = TerminalAlta.TipoDeCuenta;
                    var cbuCvu = TerminalAlta.CbuCvu;
                    var nDeCuenta = TerminalAlta.NDeCuenta;
                    var letraCbu = TerminalAlta.LetraCbu;
                    var largoCbu = TerminalAlta.LargoCbu;
                    var alias = TerminalAlta.Alias;
                    var mail = TerminalAlta.Mail;
                    var razonSocial = TerminalAlta.RazonSocial;
                    var cuitRazonSocial = TerminalAlta.CuitRazonSocial?.ToString();
                    var estadoAfip = TerminalAlta.EstadoAfip;
                    var codActividad = TerminalAlta.CodActividad?.ToString();
                    var actividad = TerminalAlta.Actividad;
                    var exento = TerminalAlta.Exento;
                    var estadoRentas = TerminalAlta.EstadoRentas;
                    var actividad2 = TerminalAlta.Actividad2;
                    var domicilioFiscal = TerminalAlta.DomicilioFiscal;
                    var provincia3 = TerminalAlta.Provincia3;
                    var alicuota = TerminalAlta.Alicuota;
                    var observacion = request.Observacion;
                    var origenDeLaTerminal = TerminalAlta.OrigenDeLaTerminal;
                    var destinoDeLaTerminal = TerminalAlta.DestinoDeLaTerminal;
                    var reUbicacion = TerminalAlta.ReUbicacion;
                    var diasSinAltaDeTerminal = TerminalAlta.DiasSinAltaDeTerminal;
                    var autorizadoPorTitular = TerminalAlta.AutorizadoPorTitular;
                    var fechaDeCargaAbm = TerminalAlta.FechaDeCargaAbm?.ToString();
                    var fechaDeModificacion = TerminalAlta.FechaDeModificacion?.ToString();
                    var abmObservacionesDeCarga = TerminalAlta.AbmObservacionesDeCarga;
                    var paraInforme = TerminalAlta.ParaInforme;
                    var enPausa = TerminalAlta.EnPausa;
                    var fechaDeInicioDePausa = TerminalAlta.FechaDeInicioDePausa;
                    var fechaDeFinalizacionDePausa = TerminalAlta.FechaDeFinalizacionDePausa;
                    var backup = TerminalAlta.Backup;
                    var altas = TerminalAlta.Altas;
                    var baja1 = "BAJA POR CCTT";
                    var ingresoASstt = TerminalAlta.IngresoASstt?.ToString();
                    var egresoDeSstt = TerminalAlta.EgresoDeSstt?.ToString();
                    var motivoSstt = TerminalAlta.MotivoSstt;
                    var _2IngresoASstt = TerminalAlta._2IngresoASstt;
                    var _2EgresoDeSstt = TerminalAlta._2EgresoDeSstt;
                    var _2MotivoSstt = TerminalAlta._2MotivoSstt;
                    var fechaSsttMes = TerminalAlta.FechaSsttMes?.ToString();
                    var codActividadRentas = TerminalAlta.CodActividadRentas?.ToString();
                    var actividadRentas = TerminalAlta.ActividadRentas;

                    // Actualiza el estado de `Alta` a "BAJA"
                    /*  bool RES = await _altaservice.EditarSimple(TerminalAlta.Id);
                      if (!RES)
                      {
                          return StatusCode(StatusCodes.Status500InternalServerError, "No se pudo actualizar el estado de Alta.");
                      }*/

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

                    var bajaid = await _bajaService.NuevaALta(baja);

                    // Encuentra la zona horaria de Argentina
                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

                    // Convierte la fecha actual en UTC a la hora de Argentina
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    // Obtiene el día siguiente a fechaCierreArg, ajustado a las 00:00
                    DateTime fechaDeAltaPorDefecto = new DateTime(fechaCierreArg.Year, fechaCierreArg.Month, fechaCierreArg.Day).AddDays(1);

                    // Intentar convertir la fecha de baja del request

                    // Si la fecha de baja es válida, se usa como base para la fecha de alta, sumándole un día
                    DateTime fechaDeAltaArg = fechaValida ? fechaDeBaja.AddDays(1) : fechaDeAltaPorDefecto;

                    // Asignaciones con conversiones
                    TerminalAlta.Titular = request.Titular;
                    TerminalAlta.CuitCuil = TryConvertToNullableDouble(request.CuitCuil);
                    TerminalAlta.Banco = request.Banco;
                    TerminalAlta.TipoDeCuenta = request.TipoDeCuenta;
                    TerminalAlta.CbuCvu = request.CbuCvu;
                    TerminalAlta.NDeCuenta = request.NDeCuenta;
                    TerminalAlta.LetraCbu = request.LetraCbu;
                    TerminalAlta.LargoCbu = request.LargoCbu;
                    TerminalAlta.Alias = request.Alias;

                    // Asigna la fecha del día siguiente a FechaDeBaja o al día siguiente de la fecha actual si no es válida
                    TerminalAlta.FechaDeAlta = fechaDeAltaArg;


                    // Otros campos con conversiones
                    TerminalAlta.NDeComercio = TryConvertToNullableDouble(request.NDeComercio);
                    TerminalAlta.Legajo = TryConvertToNullableDouble(request.Legajo);
                    TerminalAlta.NombreDeFantasia = request.NombreDeFantasia;
                    TerminalAlta.Domicilio = request.Domicilio;
                    TerminalAlta.Localidad = request.Localidad;
                    TerminalAlta.CodigoPostal = TryConvertToNullableDouble(request.codigoPostal);
                    TerminalAlta.Telefono = TryConvertToNullableDouble(request.Telefono);
                    TerminalAlta.Rubro = request.Rubro;
                    TerminalAlta.RubroSecundario = request.RubroSecundario;
                    TerminalAlta.Mail = request.Mail;

                    // Los siguientes valores permanecen iguales si no hay cambios en el request
                    TerminalAlta.RazonSocial = TerminalAlta.RazonSocial;
                    TerminalAlta.CuitRazonSocial = TerminalAlta.CuitRazonSocial;
                    TerminalAlta.EstadoAfip = TerminalAlta.EstadoAfip;
                    TerminalAlta.CodActividad = TerminalAlta.CodActividad;
                    TerminalAlta.Exento = TerminalAlta.Exento;
                    TerminalAlta.EstadoRentas = TerminalAlta.EstadoRentas;
                    TerminalAlta.Actividad2 = TerminalAlta.Actividad2;
                    TerminalAlta.DomicilioFiscal = TerminalAlta.DomicilioFiscal;
                    TerminalAlta.Provincia3 = TerminalAlta.Provincia3;
                    TerminalAlta.Alicuota = TerminalAlta.Alicuota;
                    TerminalAlta.CodActividadRentas = TerminalAlta.CodActividadRentas;
                    TerminalAlta.ActividadRentas = TerminalAlta.ActividadRentas;
                    TerminalAlta.Altas = "ALTA CCTT";
                    Usuario aliado = null;

                    // Verificar si CuitCuil es un número entero y obtener el usuario
                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    await _altaservice.EditarAbm(TerminalAlta);

                    await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion, bajaid.Id);

                    await _historialCRMService.AgregarHistorialAltaCCTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CAMBIO TITULARIDAD",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "CAMBIO TITULARIDAD",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();


                }
                else
                {
                    return NotFound("la terminal no está dada de alta");
                }

            }
            return Unauthorized();
        }

        [HttpPost("alta")]
        public async Task<IActionResult> alta([FromBody] VMAlta request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _altaservice.TerminalBaja(request.NDeTerminal);
                if (terminalestaalta)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NDeTerminal);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }

                    TerminalAlta.SasMutual = request.SasMutual;
                    TerminalAlta.Estado = request.Estado;

                    double tempDouble;
                    TerminalAlta.NDeComercio = double.TryParse(request.NDeComercio, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.NroLocal = double.TryParse(request.NroLocal, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.Legajo = double.TryParse(request.Legajo, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.CodigoPostal = double.TryParse(request.CodigoPostal, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.CuitCuil = double.TryParse(request.CuitCuil, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.LargoCbu = double.TryParse(request.LargoCbu, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.CuitRazonSocial = double.TryParse(request.CuitRazonSocial, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.CodActividad = double.TryParse(request.CodActividad, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.Alicuota = double.TryParse(request.Alicuota, out tempDouble) ? tempDouble : (double?)null;
                    TerminalAlta.CodActividadRentas = double.TryParse(request.CodActividadRentas, out tempDouble) ? tempDouble : (double?)null;

                    TerminalAlta.NombreDeFantasia = request.NombreDeFantasia;
                    TerminalAlta.Domicilio = request.Domicilio;
                    TerminalAlta.Localidad = request.Localidad;
                    TerminalAlta.LinkDePago = request.LinkDePago;
                    TerminalAlta.Rubro = request.Rubro;
                    TerminalAlta.RubroSecundario = request.RubroSecundario;
                    TerminalAlta.AltaAhora12 = request.AltaAhora12;

                    DateTime tempDateTime;
                    TerminalAlta.FechaDeAlta = DateTime.TryParse(request.FechaDeAlta, out tempDateTime) ? tempDateTime : (DateTime?)null;
                    TerminalAlta.FechaDeBaja = DateTime.TryParse(request.FechaDeBaja, out tempDateTime) ? tempDateTime : (DateTime?)null;

                    TerminalAlta.TipoDeBaja = request.TipoDeBaja;
                    TerminalAlta.Provincia = request.Provincia;
                    TerminalAlta.NombreDelAsesor = request.NombreDelAsesor;
                    TerminalAlta.Altas = request.Altas;
                    TerminalAlta.Baja = request.Baja;
                    TerminalAlta.Mail = request.Mail;
                    TerminalAlta.Titular = request.Titular;
                    TerminalAlta.Banco = request.Banco;
                    TerminalAlta.TipoDeCuenta = request.TipoDeCuenta;
                    TerminalAlta.CbuCvu = request.CbuCvu;
                    TerminalAlta.NDeCuenta = request.NDeCuenta;
                    TerminalAlta.LetraCbu = request.LetraCbu;
                    TerminalAlta.Alias = request.Alias;
                    TerminalAlta.RazonSocial = request.RazonSocial;
                    TerminalAlta.EstadoAfip = request.EstadoAfip;
                    TerminalAlta.Actividad = request.Actividad;
                    TerminalAlta.Exento = request.Exento;
                    TerminalAlta.EstadoRentas = request.EstadoRentas;
                    TerminalAlta.Actividad2 = request.Actividad2;
                    TerminalAlta.DomicilioFiscal = request.DomicilioFiscal;
                    TerminalAlta.Provincia3 = request.Provincia3;
                    TerminalAlta.ActividadRentas = request.ActividadRentas;

                    Usuario aliado = null;

                    // Verificar si CuitCuil es un número entero y obtener el usuario
                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0)
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    await _altaservice.EditarAbm(TerminalAlta);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "ALTA",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "ALTA",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                    return Ok();

                }


                else
                {
                    return NotFound("la terminal no está dada de alta");
                }

            }
            return Unauthorized();
        }
        [HttpPost("obteneraliados")]
        public async Task<IActionResult> ObtenerAliados([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var aliados = await _altaservice.ObtenerAliadosCRM();
                return Ok(aliados);
            }
            return Unauthorized();
        }
        [HttpPost("obtenercomercios")]
        public async Task<IActionResult> ObtenerComercios([FromBody] VMToken request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var aliados = await _altaservice.ObtenerComerciosCRM();
                return Ok(aliados);
            }
            return Unauthorized();
        }    // Método auxiliar para manejar conversiones a double
             // Método auxiliar para manejar conversiones a double?
        private double? TryConvertToNullableDouble(string input)
        {
            if (double.TryParse(input, out double result))
            {
                return result; // Si se puede convertir, devuelve el valor convertido
            }
            else
            {
                return null; // Si no se puede convertir, devuelve null
            }
        }
        [HttpPost("extraviada")]
        public async Task<IActionResult> extraviada([FromBody] VMCambioTerminal request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario == null)
                {
                    return Unauthorized();
                }
                var terminalestaalta = await _bajaService.TerminalAlta(request.NumeroTerminalBaja);
                if (terminalestaalta == true)
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    var estado = "EXTRAVIADA";


               
                    Usuario aliado = null;

                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    TerminalAlta.Estado = estado;

                    await _altaservice.EditarAbm(TerminalAlta);
                    await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM EXTRAVIADA",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "SSTT",
                        Estado = "EXTRAVIADA",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);
                    return Ok();


                }
                else
                {
                    var TerminalAlta = await _altaservice.ObtenerPorNroTerminal(request.NumeroTerminalBaja);
                    if (TerminalAlta == null)
                    {
                        return BadRequest("Alta no encontrada.");
                    }
                    var estado = "EXTRAVIADA";


              
                    Usuario aliado = null;

                    if (TerminalAlta.CuitCuil.HasValue && TerminalAlta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                    {
                        var cuitString = TerminalAlta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                        aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                    }

                    TerminalAlta.Estado = estado;

                    await _altaservice.EditarAbm(TerminalAlta);
                    await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, TerminalAlta.Id, request.Observacion);

                    TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                    DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                    var panelcontrolinterno = new PanelGestorInterno
                    {
                        CanalAtencion = "CRM",
                        Tipo = "CRM EXTRAVIADA",
                        Aliado = TerminalAlta.NombreDeFantasia,
                        Motivo = "EXTRAVIADA",
                        Estado = "Cerrada",
                        FechaCarga = fechaCierreArg,
                        IdUser = usuarioEncontrado.usuario.Id,
                        Observaciones = request.Observacion,
                        IdAliado = aliado?.Id, // Asigna null si aliado es null
                        NroTerminal = TerminalAlta.NDeTerminal?.ToString() // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                    };

                    await _panelControlInterno.Crear(panelcontrolinterno);

                }


            }
            return Unauthorized();

        }
    }


  }

