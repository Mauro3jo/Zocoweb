using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Wordprocessing;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ModificacionController : ControllerBase
    {
        private readonly IAltaService _altaservice;
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IFormularioAltaService _formularioAltaService;
        private readonly IFormularioModificacionService _formularioModificacionService;
        private readonly ICalculadoraService _CalculadoraService;
        private readonly IHistorialCRMService _historialCRMService;
        private readonly IBajaService _bajaService;
        private readonly ICloverService _cloverService;

        public ModificacionController(IAltaService altaservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService, 
            IFormularioAltaService formularioAltaService, ICalculadoraService calculadoraService,
            IHistorialCRMService historialCRMService, IFormularioModificacionService formularioModificacionService, 
            IBajaService bajaService, ICloverService cloverService)
        {
            _altaservice = altaservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _formularioAltaService = formularioAltaService;
            _CalculadoraService = calculadoraService;
            _historialCRMService = historialCRMService;
            _formularioModificacionService = formularioModificacionService;
            _bajaService = bajaService;
            _cloverService = cloverService;
        }
        [HttpPost("agregamodificacion")]
        public async Task<IActionResult> AgregarModificacion([FromBody] VMFormularioModificar request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                var formularioModificar = await _formularioModificacionService.ListarFormulariosModificacionAsyncId((int)request.Id);

                if (formularioModificar == null)
                {
                    return StatusCode(StatusCodes.Status404NotFound, "Formulario no encontrado.");
                }
                var numeroterminal = "";
                if(formularioModificar.BajaServicioTecnico == true)
                {
                    numeroterminal = formularioModificar.NumeroTerminalBaja;
                }
                else
                {
                    numeroterminal = formularioModificar.NumeroTerminalAltaL;
                }
                var terminalbaja = await _bajaService.TerminalAlta(numeroterminal);
                if (terminalbaja)
                {
                    var alta1 = await _altaservice.ObtenerPorNroTerminal(numeroterminal);

                    if (alta1 == null)
                    {
                        return StatusCode(StatusCodes.Status404NotFound, "Alta no encontrada.");
                    }

                    var nombrafantasia = !string.IsNullOrEmpty(formularioModificar.NombreFantasia) ? formularioModificar.NombreFantasia : alta1.NombreDeFantasia;
                    var numerocomercio = !string.IsNullOrEmpty(formularioModificar.NumeroComercio) ? formularioModificar.NumeroComercio : alta1.NDeComercio.ToString();
                    double? ncomercio = !string.IsNullOrEmpty(numerocomercio) ? Convert.ToDouble(numerocomercio) : (double?)alta1.NDeComercio;

                    var domicilio = !string.IsNullOrEmpty(formularioModificar.Domicilio) ? formularioModificar.Domicilio : alta1.Domicilio;
                    var provincia = !string.IsNullOrEmpty(formularioModificar.Provincia) ? formularioModificar.Provincia : alta1.Provincia;
                    var ciudad = !string.IsNullOrEmpty(formularioModificar.Ciudad) ? formularioModificar.Ciudad : alta1.Localidad;
                    var codigopostal = !string.IsNullOrEmpty(formularioModificar.CodigoPostal) ? formularioModificar.CodigoPostal : alta1.CodigoPostal.ToString();
                    double? codigoPostal = !string.IsNullOrEmpty(codigopostal) ? Convert.ToDouble(codigopostal) : (double?)alta1.CodigoPostal;

                    var banco = !string.IsNullOrEmpty(formularioModificar.Banco) ? formularioModificar.Banco : alta1.Banco;
                    var cbucvu = !string.IsNullOrEmpty(formularioModificar.Cbucvu) ? formularioModificar.Cbucvu : alta1.CbuCvu;
                    var alias = !string.IsNullOrEmpty(formularioModificar.Alias) ? formularioModificar.Alias : alta1.Alias;
                    var email = !string.IsNullOrEmpty(formularioModificar.Email) ? formularioModificar.Email : alta1.Mail;

                    var estadoafip = formularioModificar.AfipResponsableInscripto == true ? "RESPONSABLE INSCRIPTO" :
                                     formularioModificar.AfipMonotributista == true ? "MONOTRIBUTISTA" : alta1.EstadoAfip;

                    var excento = formularioModificar.AfipExentoGanancia == true ? "EXENTO GANANCIA" :
                                  formularioModificar.AfipExentoIva == true ? "EXENTO IVA" : alta1.Exento;

                    var rentas = formularioModificar.RentasIncripto == true ? "INSCRIPTO" :
                                 formularioModificar.RentasConvenioMultilateral == true ? "CM" :
                                 formularioModificar.RentasExento == true ? "EXENTO" : alta1.EstadoRentas;

                    var alta2 = new Alta
                    {
                        Id = alta1.Id,
                        NombreDeFantasia = nombrafantasia,
                        NDeComercio = ncomercio,
                        Domicilio = domicilio,
                        Provincia = provincia,
                        Localidad = ciudad,
                        CodigoPostal = codigoPostal,
                        Banco = banco,
                        CbuCvu = cbucvu,
                        Alias = alias,
                        Mail = email,
                        EstadoAfip = estadoafip,
                        Exento = excento,
                        EstadoRentas = rentas
                    };

                     await _altaservice.EditarAltaModificar(alta2);
                    await _historialCRMService.AgregarHistorialModificacion(usuarioEncontrado.usuario.Id, alta2.Id, formularioModificar.Observacion);

                    if (formularioModificar.BajaServicioTecnico == true)
                    { 
                        if(formularioModificar.Secambiaporclover == true)
                        {
                            var alta4 = await _altaservice.ObtenerPorNroTerminal(formularioModificar.NumeroTerminalBaja);
                            TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                            DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                            alta4.FechaDeBaja = fechaActualArgentina;
                      
                            var sasMutual = alta4.SasMutual;
                            var estado = "BAJA";
                            var nDeTerminal = $"{alta4.Legajo}-{Convert.ToString(alta4.NDeTerminal)}";
                            var nDeComercio = alta4.NDeComercio;
                            var nroLocal = alta4.NroLocal;
                            var legajo = alta4.Legajo;
                            var nombreDeFantasia = alta4.NombreDeFantasia;
                            var domiciliobaja = alta4.Domicilio;
                            var localidad = alta4.Localidad;
                            var codigoPostalbaja = alta4.CodigoPostal?.ToString();
                            var telefono = alta4.Telefono;
                            var linkDePago = alta4.LinkDePago;
                            var rubro = alta4.Rubro;
                            var rubroSecundario = alta4.RubroSecundario;
                            var altaAhora12 = alta4.AltaAhora12;
                            var fechaDeAlta = alta4.FechaDeAlta;
                          
                            var tipoDeBaja = alta4.TipoDeBaja;
                            var programacionBaja = alta4.ProgramacionBaja;
                            double? diasParaAlta = null;
                            if (!string.IsNullOrEmpty(alta4.DiasParaAlta) && double.TryParse(alta4.DiasParaAlta, out double result))
                            {
                                diasParaAlta = result;
                            }
                            var provinciabaja = alta4.Provincia;
                            var nombreDelAsesor = alta4.NombreDelAsesor;
                            var titular = alta4.Titular;
                            var cuitCuil = alta4.CuitCuil;
                            var bancobaja = alta4.Banco;
                            var tipoDeCuenta = alta4.TipoDeCuenta;
                            var cbuCvu = alta4.CbuCvu;
                            var nDeCuenta = alta4.NDeCuenta;
                            var letraCbu = alta4.LetraCbu;
                            var largoCbu = alta4.LargoCbu;
                            var aliasbaja = alta4.Alias;
                            var mail = alta4.Mail;
                            var razonSocial = alta4.RazonSocial;
                            var cuitRazonSocial = alta4.CuitRazonSocial?.ToString();
                            var estadoAfip = alta4.EstadoAfip;
                            var codActividad = alta4.CodActividad?.ToString();
                            var actividad = alta4.Actividad;
                            var exento = alta4.Exento;
                            var estadoRentas = alta4.EstadoRentas;
                            var actividad2 = alta4.Actividad2;
                            var domicilioFiscal = alta4.DomicilioFiscal;
                            var provincia3 = alta4.Provincia3;
                            var alicuota = alta4.Alicuota;
                            var observacion = alta4.Observacion;
                            var origenDeLaTerminal = alta4.OrigenDeLaTerminal;
                            var destinoDeLaTerminal = alta4.DestinoDeLaTerminal;
                            var reUbicacion = alta4.ReUbicacion;
                            var diasSinAltaDeTerminal = alta4.DiasSinAltaDeTerminal;
                            var autorizadoPorTitular = alta4.AutorizadoPorTitular;
                            var fechaDeCargaAbm = alta4.FechaDeCargaAbm?.ToString();
                            var fechaDeModificacion = alta4.FechaDeModificacion?.ToString();
                            var abmObservacionesDeCarga = alta4.AbmObservacionesDeCarga;
                            var paraInforme = alta4.ParaInforme;
                            var enPausa = alta4.EnPausa;
                            var fechaDeInicioDePausa = alta4.FechaDeInicioDePausa;
                            var fechaDeFinalizacionDePausa = alta4.FechaDeFinalizacionDePausa;
                            var backup = alta4.Backup;
                            var altas = alta4.Altas;
                            var baja1 = "BAJA POR POSNET";
                            var ingresoASstt = alta4.IngresoASstt?.ToString();
                            var egresoDeSstt = alta4.EgresoDeSstt?.ToString();
                            var motivoSstt = alta4.MotivoSstt;
                            var _2IngresoASstt = alta4._2IngresoASstt;
                            var _2EgresoDeSstt = alta4._2EgresoDeSstt;
                            var _2MotivoSstt = alta4._2MotivoSstt;
                            var fechaSsttMes = alta4.FechaSsttMes?.ToString();
                            var codActividadRentas = alta4.CodActividadRentas?.ToString();
                            var actividadRentas = alta4.ActividadRentas;
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
                                CodigoPostal = codigoPostalbaja,
                                Telefono = telefono,
                                LinkDePago = linkDePago,
                                Rubro = rubro,
                                RubroSecundario = rubroSecundario,
                                AltaAhora12 = altaAhora12,
                                FechaDeAlta = fechaDeAlta,
                         
                                TipoDeBaja = tipoDeBaja,
                                ProgramacionBaja = programacionBaja,
                                DiasParaAlta = diasParaAlta,
                                Provincia = provinciabaja,
                                NombreDelAsesor = nombreDelAsesor,
                                Titular = titular,
                                CuitCuil = cuitCuil,
                                Banco = bancobaja,
                                TipoDeCuenta = tipoDeCuenta,
                                CbuCvu = cbuCvu,
                                NDeCuenta = nDeCuenta,
                                LetraCbu = letraCbu,
                                LargoCbu = largoCbu,
                                Alias = aliasbaja,
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
                            var nterminal = Convert.ToDouble(formularioModificar.NumeroTerminalAltaL);
                         var bajaid =   await _bajaService.NuevaALta(baja);
                            await _altaservice.EditarSimpleAltaClover(alta4.Id, nterminal);
                            await _historialCRMService.AgregarHistorialBaja(usuarioEncontrado.usuario.Id, alta4.Id, formularioModificar.Observacion,bajaid.Id);
                            await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, alta4.Id, formularioModificar.Observacion);

                            await _formularioModificacionService.EditarFueUtilizado(formularioModificar.Id);

                            var clover = new Clover
                            {
                                IdAlta = alta4.Id,
                                NroVerifone = formularioModificar.NumeroTerminalBaja,
                                NroClover = formularioModificar.NumeroTerminalAltaL,
                                Fecha = fechaActualArgentina,

                            };
                            await _cloverService.CrearNuevaClover(clover);

                        }
                        else
                        {
                            if(formularioModificar.VuelveAlComercio == true)
                            {
                                var alta4 = await _altaservice.ObtenerPorNroTerminal(formularioModificar.NumeroTerminalBaja);
                                var estado = "SERVICIO.TECNICO";

                                alta4.Estado = estado;

                                await _altaservice.EditarAbm(alta4);
                                await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, alta4.Id, formularioModificar.Observacion);
                                await _formularioModificacionService.EditarFueUtilizado(formularioModificar.Id);


                            }
                            else
                            {
                                var alta3 = await _altaservice.ObtenerPorNroTerminal(formularioModificar.NumeroTerminalAltaL);
                                var alta4 = await _altaservice.ObtenerPorNroTerminal(formularioModificar.NumeroTerminalBaja);

                                TimeZoneInfo argentinaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                                DateTime fechaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, argentinaTimeZone);
                                alta4.FechaDeAlta = fechaActualArgentina;
                                //await _altaservice.EditarparaAlta(alta4, alta3.Id);
                                //await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, alta3.Id, formularioModificar.Observacion);
                                //var sasMutual = alta4.SasMutual;
                                //var estado = "SERVICIO.TECNICO";
                                //var nDeTerminal = $"{alta4.Legajo}-{Convert.ToString(alta4.NDeTerminal)}";
                                //var nDeComercio = alta4.NDeComercio;
                                //var nroLocal = alta4.NroLocal;
                                //var legajo = alta4.Legajo;
                                //var nombreDeFantasia = alta4.NombreDeFantasia;
                                //var domiciliobaja = alta4.Domicilio;
                                //var localidad = alta4.Localidad;
                                //var codigoPostalbaja = alta4.CodigoPostal?.ToString();
                                //var telefono = alta4.Telefono;
                                //var linkDePago = alta4.LinkDePago;
                                //var rubro = alta4.Rubro;
                                //var rubroSecundario = alta4.RubroSecundario;
                                //var altaAhora12 = alta4.AltaAhora12;
                                //var fechaDeAlta = alta4.FechaDeAlta;
                                //var fechaDeBaja = alta4.FechaDeBaja;
                                //var tipoDeBaja = alta4.TipoDeBaja;
                                //var programacionBaja = alta4.ProgramacionBaja;
                                //double? diasParaAlta = null;
                                //if (!string.IsNullOrEmpty(alta4.DiasParaAlta) && double.TryParse(alta4.DiasParaAlta, out double result))
                                //{
                                //    diasParaAlta = result;
                                //}
                                //var provinciabaja = alta4.Provincia;
                                //var nombreDelAsesor = alta4.NombreDelAsesor;
                                //var titular = alta4.Titular;
                                //var cuitCuil = alta4.CuitCuil;
                                //var bancobaja = alta4.Banco;
                                //var tipoDeCuenta = alta4.TipoDeCuenta;
                                //var cbuCvu = alta4.CbuCvu;
                                //var nDeCuenta = Convert.ToDouble(alta4.NDeCuenta);
                                //var letraCbu = alta4.LetraCbu;
                                //var largoCbu = alta4.LargoCbu;
                                //var aliasbaja = alta4.Alias;
                                //var mail = alta4.Mail;
                                //var razonSocial = alta4.RazonSocial;
                                //var cuitRazonSocial = alta4.CuitRazonSocial?.ToString();
                                //var estadoAfip = alta4.EstadoAfip;
                                //var codActividad = alta4.CodActividad?.ToString();
                                //var actividad = alta4.Actividad;
                                //var exento = alta4.Exento;
                                //var estadoRentas = alta4.EstadoRentas;
                                //var actividad2 = alta4.Actividad2;
                                //var domicilioFiscal = alta4.DomicilioFiscal;
                                //var provincia3 = alta4.Provincia3;
                                //var alicuota = alta4.Alicuota;
                                //var observacion = alta4.Observacion;
                                //var origenDeLaTerminal = alta4.OrigenDeLaTerminal;
                                //var destinoDeLaTerminal = alta4.DestinoDeLaTerminal;
                                //var reUbicacion = alta4.ReUbicacion;
                                //var diasSinAltaDeTerminal = alta4.DiasSinAltaDeTerminal;
                                //var autorizadoPorTitular = alta4.AutorizadoPorTitular;
                                //var fechaDeCargaAbm = alta4.FechaDeCargaAbm?.ToString();
                                //var fechaDeModificacion = alta4.FechaDeModificacion?.ToString();
                                //var abmObservacionesDeCarga = alta4.AbmObservacionesDeCarga;
                                //var paraInforme = alta4.ParaInforme;
                                //var enPausa = alta4.EnPausa;
                                //var fechaDeInicioDePausa = alta4.FechaDeInicioDePausa;
                                //var fechaDeFinalizacionDePausa = alta4.FechaDeFinalizacionDePausa;
                                //var backup = alta4.Backup;
                                //var altas = alta4.Altas;
                                //var baja1 = "BAJA SSTT";
                                //var ingresoASstt = alta4.IngresoASstt?.ToString();
                                //var egresoDeSstt = alta4.EgresoDeSstt?.ToString();
                                //var motivoSstt = alta4.MotivoSstt;
                                //var _2IngresoASstt = alta4._2IngresoASstt;
                                //var _2EgresoDeSstt = alta4._2EgresoDeSstt;
                                //var _2MotivoSstt = alta4._2MotivoSstt;
                                //var fechaSsttMes = alta4.FechaSsttMes?.ToString();
                                //var codActividadRentas = alta4.CodActividadRentas?.ToString();
                                //var actividadRentas = alta4.ActividadRentas;
                                //var baja = new Baja
                                //{
                                //    SasMutual = sasMutual,
                                //    Estado = estado,
                                //    NDeTerminal = nDeTerminal,
                                //    NDeComercio = nDeComercio,
                                //    NroLocal = nroLocal,
                                //    Legajo = legajo,
                                //    NombreDeFantasia = nombreDeFantasia,
                                //    Domicilio = domicilio,
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
                                //await _bajaService.NuevaALta(baja);
                          
                                await _altaservice.EditarparaAlta(alta3, alta4.Id);
                                await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, alta3.Id, formularioModificar.Observacion);
                                var estado = "SERVICIO.TECNICO";

                                alta4.Estado = estado;

                                await _altaservice.EditarAbm(alta4);
                                //  await _altaservice.EditarSimpleServicioTecnico(alta4.Id);
                                await _historialCRMService.AgregarHistorialSSTT(usuarioEncontrado.usuario.Id, alta4.Id, formularioModificar.Observacion);
                                await _formularioModificacionService.EditarFueUtilizado(formularioModificar.Id);

                                return Ok();
                            }
                            
                        }
                     
                    }
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest, "Terminal no encontrada o inválida.");
                }
            }

            return StatusCode(StatusCodes.Status401Unauthorized, "Token no válido.");
        }


    }
}
