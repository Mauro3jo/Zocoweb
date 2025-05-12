using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Wordprocessing;
using Entity.Zoco;
using iTextSharp.text;
using iTextSharp.text.pdf.codec.wmf;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Text;
using static ClosedXML.Excel.XLPredefinedFormat;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AltasController : ControllerBase
    {
        private readonly IAltaService _altaservice;
        private readonly IUsuarioZocoService _usuariozoco;
        private readonly ITokenService _tokenService;
        private readonly IFormularioAltaService _formularioAltaService;
        private readonly ICalculadoraService _CalculadoraService;
        private readonly IHistorialCRMService _historialCRMService;
        private readonly IPanelControlInterno _panelControlInterno;

        public AltasController(IAltaService altaservice, IUsuarioZocoService usuarioZoco, ITokenService tokenService, 
            IFormularioAltaService formularioAltaService, ICalculadoraService calculadoraService, IHistorialCRMService historialCRMService, IPanelControlInterno panelControlInterno)
        {
            _altaservice = altaservice;
            _usuariozoco = usuarioZoco;
            _tokenService = tokenService;
            _formularioAltaService = formularioAltaService;
            _CalculadoraService = calculadoraService;
            _historialCRMService = historialCRMService;
            _panelControlInterno = panelControlInterno;
        }
        [HttpPost("agregaralta")]
        public async Task<IActionResult> agregaralta([FromBody] VMFormularioAlta request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);

                var formularioalta = await _formularioAltaService.ListarFormulariosAltaAsyncId((int)request.Id);


                var terminalbaja = await _altaservice.TerminalBaja(formularioalta.NumeroTerminal);
                if(terminalbaja == true)
                {
                    var nombregestro = formularioalta.IdGestor.HasValue
                        ? (await _usuariozoco.ObtenerPorId((int)formularioalta.IdGestor))?.Nombre ?? ""
                        : "";

                    var estadoafip = (bool)formularioalta.AfipResponsableInscripto ? "RESPONSABLE INSCRIPTO" :
                                     (bool)formularioalta.AfipMonotributista ? "MONOTRIBUTISTA" : "";

                    var excento = (bool)formularioalta.AfipExentoGanancia ? "EXENTO GANANCIA" :
                                  (bool)formularioalta.AfipExentoIva ? "EXENTO IVA" : "";

                    var rentas = (bool)formularioalta.RentasIncripto ? "INSCRIPTO" :
                                 (bool)formularioalta.RentasConvenioMultilateral ? "CM" :
                                 (bool)formularioalta.RentasExento ? "EXENTO" : "";

                    string letraCbu;

                    // Intentamos convertir el CBU/CVU a un número
                    bool esNumero = long.TryParse(formularioalta.Cbucvu, out _);
                    letraCbu = esNumero ? "CORRECTO"  : "INCORRECTO";

                    string largoCbu = string.IsNullOrEmpty(formularioalta.Cbucvu) ? "0" : formularioalta.Cbucvu.Length.ToString();

                    var listaprovincia = await _CalculadoraService.ListaIIBBProvincia();
                    var provincia = listaprovincia.FirstOrDefault(p => p.Provincia == formularioalta.Provincia);
                    var alicuotaString = provincia != null ? provincia.Alicuota : "0.00%";

                    double alicuota = double.TryParse(alicuotaString.TrimEnd('%'), out double alicuotaValor) ? alicuotaValor : 0.00;

                    double nDeTerminal = Convert.ToDouble(formularioalta.NumeroTerminal);

                    string comercio = formularioalta.NumeroComercioSolicitado;
                    string[] partes = comercio.Split(' ');
                    double nDeComercio = Convert.ToDouble(partes[0]);

                    double nroLocal = Convert.ToDouble(request.NroLocal);
                    double legajo = Convert.ToDouble(request.Legajo);
                    double codigoPostal = Convert.ToDouble(formularioalta.CodigoPostalComercio);
                    double telefono = Convert.ToDouble(formularioalta.Celular);
                    double cuitCuil = Convert.ToDouble(formularioalta.Cuittitular);
                    double largoCbuDouble = Convert.ToDouble(largoCbu);
                    double cuitRazonSocial = Convert.ToDouble(formularioalta.Cuitbancario);
                    double codActividad = Convert.ToDouble(request.CodActividad);
                    double codActividadRentas = Convert.ToDouble(request.CodActividadRentas);
                    string tipoAltaTexto;

                    if (formularioalta.TipoAlta == "NuevoAliado")
                    {
                        tipoAltaTexto = "ALTA";
                    }
                    else
                    {
                        tipoAltaTexto = "AGREGA";
                    }

                    var terminal = await _altaservice.ObtenerPorNroTerminal(formularioalta.NumeroTerminal);
                    var TipoCbu = "CBU";
                    if (formularioalta.TipoCuenta == "Billetera Virtual")
                    {
                        TipoCbu = "CVU";
                    }
                    var nuevaAlta = new Alta
                    {
                        /* SasMutual = "SAS",
                         NDeTerminal = nDeTerminal,*/
                        Id = terminal.Id,
                        Estado = "ALTA",
                        NDeComercio = nDeComercio,
                        NroLocal = nroLocal,
                        Legajo = legajo,
                        NombreDeFantasia = formularioalta.NombreFantasia,
                        Domicilio = formularioalta.Domicilio,
                        Localidad = formularioalta.LocalidadComercio,
                        CodigoPostal = codigoPostal,
                        Telefono = telefono,
                        LinkDePago = "NO",
                        Rubro = request.Rubro,
                        RubroSecundario = request.RubroSecundario,
                        AltaAhora12 = "SI",
                        FechaDeAlta = formularioalta.FechaApertura,
                        FechaDeBaja = null,
                        /*  TipoDeBaja = " ",
                       ProgramacionBaja = null,
                       DiasParaAlta = " ",*/

                        Provincia = formularioalta.Provincia,
                        NombreDelAsesor = nombregestro,
                        Titular = formularioalta.ApellidoYnombre,
                        CuitCuil = cuitCuil,
                        Banco = formularioalta.Banco,
                        TipoDeCuenta = formularioalta.TipoCuenta,
                        CbuCvu = TipoCbu,
                        NDeCuenta = formularioalta.Cbucvu,
                        LetraCbu = letraCbu,
                        LargoCbu = largoCbuDouble,
                        Alias = formularioalta.Alias,
                        Mail = formularioalta.Correo,
                        RazonSocial = formularioalta.TitularRazonSocial,
                        CuitRazonSocial = cuitRazonSocial,
                        EstadoAfip = estadoafip,
                        CodActividad = codActividad,
                        Actividad = request.Actividad,
                        Exento = excento,
                        EstadoRentas = rentas,
                        Actividad2 = request.Actividad2,
                        DomicilioFiscal = formularioalta.Domicilio,
                         Provincia3 = formularioalta.Provincia,
                        Alicuota = alicuota,
                        CodActividadRentas = codActividadRentas,
                        ActividadRentas = request.ActividadRentas,

                        ///AGREGADOS
                        Altas = tipoAltaTexto
                    };

                    //await _altaservice.NuevaALta(nuevaAlta);
                    await _altaservice.Editar(nuevaAlta);
                    await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, terminal.Id, request.Observaciones);
                    await _formularioAltaService.EditarFueUtilizado(formularioalta.Id);
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status400BadRequest);
                }
              
            }
            return StatusCode(StatusCodes.Status401Unauthorized);
        }
        [HttpPost("CRM")]
        public async Task<IActionResult> ObtenerCRM(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                try
                {
                    var resumen = await _altaservice.ObtenerCRM();

                    var filteredResumen = resumen.Select(alta => new
                    {
        /*de aca azul*/ Id = alta.Id,
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
                        BAJA = alta.Baja,
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
                    }).ToList();

                    //var propiedades = filteredResumen[0].GetType().GetProperties();

                    //var nombresCampos = propiedades.Select(prop => prop.Name).ToArray();

                    //var valoresCampos = filteredResumen
                    //    .Select(alta => propiedades.Select(prop => prop.GetValue(alta)?.ToString()).ToArray())
                    //    .ToArray();


                    //      return Ok(new { nombresCampos, valoresCampos });
                    return Ok(filteredResumen);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, "Internal Server Error: " + ex.Message);
                }
            }
            return Ok();
        }
        [HttpPost("editarcrmalta")]
        public async Task<IActionResult> EditarCRMAlta([FromBody] VMCRM request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                if (usuarioEncontrado.usuario != null)
                {
                    var alta = await _altaservice.ObtenerPorNroTerminal(request.NDeTerminal);
                    if (alta != null)
                    {
                        var observacionesBuilder = new StringBuilder();

                        // Lógica para mapear y actualizar los datos de alta
                        MapearYActualizarAlta(alta, request, observacionesBuilder);
                        // Obtener la hora actual en la zona horaria de Argentina
                        TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                        System.DateTime fechaActualArg = TimeZoneInfo.ConvertTimeFromUtc(System.DateTime.UtcNow, zonaHorariaArg);
                        // Solo realizar el cambio de fechas si el tipo es "alta"
                        if (request.Tipo == "alta")
                        {


                            // Asignar la fecha de alta como la hora actual en Argentina
                            // Intentar convertir request.FechaDeAlta a DateTime
                            if (!string.IsNullOrEmpty(request.FechaDeAlta))
                            {
                                // Intentar convertir con el primer formato "yyyy/MM/dd"
                                if (System.DateTime.TryParseExact(request.FechaDeAlta, "yyyy/MM/dd",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None,
                                    out System.DateTime fechaDeAlta))
                                {
                                    alta.FechaDeAlta = fechaDeAlta; // Si la conversión es exitosa con el primer formato
                                }
                                // Intentar convertir con el segundo formato "yyyy-MM-ddTHH:mm:ss"
                                else if (System.DateTime.TryParseExact(request.FechaDeAlta, "yyyy-MM-ddTHH:mm:ss",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None,
                                    out fechaDeAlta))
                                {
                                    alta.FechaDeAlta = fechaDeAlta; // Si la conversión es exitosa con el segundo formato
                                }
                                else
                                {
                                    // Si la conversión falla en ambos formatos, usar la fecha actual sin la hora
                                    alta.FechaDeAlta = fechaActualArg.Date; // Solo la fecha
                                }
                            }
                            else
                            {
                                // Si request.FechaDeAlta es null o vacío, usar la fecha actual sin la hora
                                alta.FechaDeAlta = fechaActualArg.Date; // Solo la fecha
                            }


                            // Establecer la fecha de baja en null
                            alta.FechaDeBaja = null;
                            alta.Estado = "ALTA";
                            alta.NombreDelAsesor = usuarioEncontrado.usuario.Nombre;
                            alta.TipoDeBaja = null;
                            alta.Baja = null;
                            alta.Alias = request.Alias;
                            await _altaservice.EditarAbm(alta);
                            var observaciones = observacionesBuilder.ToString();
                            Usuario aliado = null;

                            if (alta.CuitCuil.HasValue && alta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                            {
                                var cuitString = alta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                                aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                            }

                            await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, alta.Id, observaciones);

                            var panelcontrolinterno = new PanelGestorInterno
                            {
                                CanalAtencion = "CRM",
                                Tipo = "ALTA",
                                Aliado = request.NombreDeFantasia,
                                Motivo = "ALTA",
                                Estado = "Cerrada",
                                FechaCarga = fechaActualArg,
                                IdUser = usuarioEncontrado.usuario.Id,
                                Observaciones = observaciones,
                                IdAliado = aliado?.Id, // Asigna null si aliado es null
                                NroTerminal = alta.NDeTerminal.ToString(),
                            };

                            await _panelControlInterno.Crear(panelcontrolinterno);


                        }
                        else
                        {
                            alta.Alias = request.Alias;

                            await _altaservice.EditarAbm(alta);
                            var observaciones = observacionesBuilder.ToString();
                            Usuario aliado = null;

                            if (alta.CuitCuil.HasValue && alta.CuitCuil.Value % 1 == 0) // Verificar que no tenga decimales
                            {
                                var cuitString = alta.CuitCuil.Value.ToString("F0"); // Convertir a string sin decimales
                                aliado = await _usuariozoco.ObtenerPorCuit(cuitString);
                            }

                            await _historialCRMService.AgregarHistorialModificacion(usuarioEncontrado.usuario.Id, alta.Id, observaciones);

                            var panelcontrolinterno = new PanelGestorInterno
                            {
                                CanalAtencion = "CRM",
                                Tipo = "MODIFICACION",
                                Aliado = request.NombreDeFantasia,
                                Motivo = "MODIFICACION",
                                Estado = "Cerrada",
                                FechaCarga = fechaActualArg,
                                IdUser = usuarioEncontrado.usuario.Id,
                                Observaciones = observaciones,
                                IdAliado = aliado?.Id, // Asigna null si aliado es null
                                NroTerminal = alta.NDeTerminal?.ToString(), // Convertir NDeTerminal a string si tiene valor, o null si no tiene
                            };

                            await _panelControlInterno.Crear(panelcontrolinterno);


                        }



                    }
                }
            }

            return Ok(request);
        }


        [HttpPost("altacrm")]
        public async Task<IActionResult> altacrm([FromBody] VMCRM request)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.token);
                if (usuarioEncontrado.usuario != null)
                {
                    var alta = await _altaservice.ObtenerPorNroTerminal(request.NDeTerminal);
                    if (alta != null)
                    {
                        var observacionesBuilder = new StringBuilder();
                        MapearYActualizarAlta(alta, request, observacionesBuilder);
                        await _altaservice.EditarAbm(alta);
                        var observaciones = observacionesBuilder.ToString();
                        await _historialCRMService.AgregarHistorialAlta(usuarioEncontrado.usuario.Id, alta.Id, observaciones);
                    }
                }
            }
            return Ok(request);
        }

        private void MapearYActualizarAlta(Alta alta, VMCRM request, StringBuilder observaciones)
        {
            if (!string.IsNullOrEmpty(request.SasMutual) && request.SasMutual != alta.SasMutual)
            {
                observaciones.AppendLine($"SasMutual: {alta.SasMutual} -> {request.SasMutual}");
                alta.SasMutual = request.SasMutual;
            }

            if (!string.IsNullOrEmpty(request.Estado) && request.Estado != alta.Estado)
            {
                observaciones.AppendLine($"Estado: {alta.Estado} -> {request.Estado}");
                alta.Estado = request.Estado;
            }

            if (!string.IsNullOrEmpty(request.NDeTerminal) && request.NDeTerminal != alta.NDeTerminal.ToString())
            {
                observaciones.AppendLine($"NDeTerminal: {alta.NDeTerminal} -> {request.NDeTerminal}");
                alta.NDeTerminal = double.Parse(request.NDeTerminal);
            }

            if (!string.IsNullOrEmpty(request.NDeComercio) && request.NDeComercio != alta.NDeComercio.ToString())
            {
                observaciones.AppendLine($"NDeComercio: {alta.NDeComercio} -> {request.NDeComercio}");
                alta.NDeComercio = double.Parse(request.NDeComercio);
            }

            if (!string.IsNullOrEmpty(request.NroLocal) && request.NroLocal != alta.NroLocal.ToString())
            {
                observaciones.AppendLine($"NroLocal: {alta.NroLocal} -> {request.NroLocal}");
                alta.NroLocal = double.Parse(request.NroLocal);
            }

            if (!string.IsNullOrEmpty(request.Legajo) && request.Legajo != alta.Legajo.ToString())
            {
                observaciones.AppendLine($"Legajo: {alta.Legajo} -> {request.Legajo}");
                alta.Legajo = double.Parse(request.Legajo);
            }

            if (!string.IsNullOrEmpty(request.NombreDeFantasia) && request.NombreDeFantasia != alta.NombreDeFantasia)
            {
                observaciones.AppendLine($"NombreDeFantasia: {alta.NombreDeFantasia} -> {request.NombreDeFantasia}");
                alta.NombreDeFantasia = request.NombreDeFantasia;
            }

            if (!string.IsNullOrEmpty(request.Domicilio) && request.Domicilio != alta.Domicilio)
            {
                observaciones.AppendLine($"Domicilio: {alta.Domicilio} -> {request.Domicilio}");
                alta.Domicilio = request.Domicilio;
            }

            if (!string.IsNullOrEmpty(request.Localidad) && request.Localidad != alta.Localidad)
            {
                observaciones.AppendLine($"Localidad: {alta.Localidad} -> {request.Localidad}");
                alta.Localidad = request.Localidad;
            }

            if (!string.IsNullOrEmpty(request.CodigoPostal) && request.CodigoPostal != alta.CodigoPostal.ToString())
            {
                observaciones.AppendLine($"CodigoPostal: {alta.CodigoPostal} -> {request.CodigoPostal}");
                alta.CodigoPostal = double.Parse(request.CodigoPostal);
            }

            if (!string.IsNullOrEmpty(request.Telefono) && request.Telefono != alta.Telefono.ToString())
            {
                observaciones.AppendLine($"Telefono: {alta.Telefono} -> {request.Telefono}");
                alta.Telefono = double.Parse(request.Telefono);
            }

            if (!string.IsNullOrEmpty(request.LinkDePago) && request.LinkDePago != alta.LinkDePago)
            {
                observaciones.AppendLine($"LinkDePago: {alta.LinkDePago} -> {request.LinkDePago}");
                alta.LinkDePago = request.LinkDePago;
            }

            if (!string.IsNullOrEmpty(request.Rubro) && request.Rubro != alta.Rubro)
            {
                observaciones.AppendLine($"Rubro: {alta.Rubro} -> {request.Rubro}");
                alta.Rubro = request.Rubro;
            }

            if (!string.IsNullOrEmpty(request.RubroSecundario) && request.RubroSecundario != alta.RubroSecundario)
            {
                observaciones.AppendLine($"RubroSecundario: {alta.RubroSecundario} -> {request.RubroSecundario}");
                alta.RubroSecundario = request.RubroSecundario;
            }

            if (!string.IsNullOrEmpty(request.AltaAhora12) && request.AltaAhora12 != alta.AltaAhora12)
            {
                observaciones.AppendLine($"AltaAhora12: {alta.AltaAhora12} -> {request.AltaAhora12}");
                alta.AltaAhora12 = request.AltaAhora12;
            }

            if (!string.IsNullOrEmpty(request.FechaDeAlta) && System.DateTime.TryParse(request.FechaDeAlta, out System.DateTime fechaDeAlta) && fechaDeAlta != alta.FechaDeAlta)
            {
                observaciones.AppendLine($"FechaDeAlta: {alta.FechaDeAlta} -> {fechaDeAlta}");
                alta.FechaDeAlta = fechaDeAlta;
            }

            if (!string.IsNullOrEmpty(request.FechaDeBaja) && System.DateTime.TryParse(request.FechaDeBaja, out System.DateTime fechaDeBaja) && fechaDeBaja != alta.FechaDeBaja)
            {
                observaciones.AppendLine($"FechaDeBaja: {alta.FechaDeBaja} -> {fechaDeBaja}");
                alta.FechaDeBaja = fechaDeBaja;
            }

            if (!string.IsNullOrEmpty(request.TipoDeBaja) && request.TipoDeBaja != alta.TipoDeBaja)
            {
                observaciones.AppendLine($"TipoDeBaja: {alta.TipoDeBaja} -> {request.TipoDeBaja}");
                alta.TipoDeBaja = request.TipoDeBaja;
            }

            if (!string.IsNullOrEmpty(request.ProgramacionBaja) && System.DateTime.TryParse(request.ProgramacionBaja, out System.DateTime programacionBaja) && programacionBaja != alta.ProgramacionBaja)
            {
                observaciones.AppendLine($"ProgramacionBaja: {alta.ProgramacionBaja} -> {programacionBaja}");
                alta.ProgramacionBaja = programacionBaja;
            }

            if (!string.IsNullOrEmpty(request.DiasParaAlta) && request.DiasParaAlta != alta.DiasParaAlta)
            {
                observaciones.AppendLine($"DiasParaAlta: {alta.DiasParaAlta} -> {request.DiasParaAlta}");
                alta.DiasParaAlta = request.DiasParaAlta;
            }

            if (!string.IsNullOrEmpty(request.Provincia) && request.Provincia != alta.Provincia)
            {
                observaciones.AppendLine($"Provincia: {alta.Provincia} -> {request.Provincia}");
                alta.Provincia = request.Provincia;
            }

            if (!string.IsNullOrEmpty(request.NombreDelAsesor) && request.NombreDelAsesor != alta.NombreDelAsesor)
            {
                observaciones.AppendLine($"NombreDelAsesor: {alta.NombreDelAsesor} -> {request.NombreDelAsesor}");
                alta.NombreDelAsesor = request.NombreDelAsesor;
            }

            if (!string.IsNullOrEmpty(request.Titular) && request.Titular != alta.Titular)
            {
                observaciones.AppendLine($"Titular: {alta.Titular} -> {request.Titular}");
                alta.Titular = request.Titular;
            }

            if (!string.IsNullOrEmpty(request.CuitCuil) && request.CuitCuil != alta.CuitCuil.ToString())
            {
                observaciones.AppendLine($"CuitCuil: {alta.CuitCuil} -> {request.CuitCuil}");
                alta.CuitCuil = double.Parse(request.CuitCuil);
            }

            if (!string.IsNullOrEmpty(request.Banco) && request.Banco != alta.Banco)
            {
                observaciones.AppendLine($"Banco: {alta.Banco} -> {request.Banco}");
                alta.Banco = request.Banco;
            }

            if (!string.IsNullOrEmpty(request.TipoDeCuenta) && request.TipoDeCuenta != alta.TipoDeCuenta)
            {
                observaciones.AppendLine($"TipoDeCuenta: {alta.TipoDeCuenta} -> {request.TipoDeCuenta}");
                alta.TipoDeCuenta = request.TipoDeCuenta;
            }

            if (!string.IsNullOrEmpty(request.CbuCvu) && request.CbuCvu != alta.CbuCvu)
            {
                observaciones.AppendLine($"CbuCvu: {alta.CbuCvu} -> {request.CbuCvu}");
                alta.CbuCvu = request.CbuCvu;
            }

            if (!string.IsNullOrEmpty(request.NDeCuenta) && request.NDeCuenta != alta.NDeCuenta)
            {
                observaciones.AppendLine($"NDeCuenta: {alta.NDeCuenta} -> {request.NDeCuenta}");
                alta.NDeCuenta = request.NDeCuenta;
            }

            if (!string.IsNullOrEmpty(request.LetraCbu) && request.LetraCbu != alta.LetraCbu)
            {
                observaciones.AppendLine($"LetraCbu: {alta.LetraCbu} -> {request.LetraCbu}");
                alta.LetraCbu = request.LetraCbu;
            }

            if (!string.IsNullOrEmpty(request.LargoCbu) && request.LargoCbu != alta.LargoCbu.ToString())
            {
                observaciones.AppendLine($"LargoCbu: {alta.LargoCbu} -> {request.LargoCbu}");
                alta.LargoCbu = double.Parse(request.LargoCbu);
            }

            if (!string.IsNullOrEmpty(request.Alias) && request.Alias != alta.Alias)
            {
                observaciones.AppendLine($"Alias: {alta.Alias} -> {request.Alias}");
                alta.Alias = request.Alias;
            }

            if (!string.IsNullOrEmpty(request.Mail) && request.Mail != alta.Mail)
            {
                observaciones.AppendLine($"Mail: {alta.Mail} -> {request.Mail}");
                alta.Mail = request.Mail;
            }

            if (!string.IsNullOrEmpty(request.RazonSocial) && request.RazonSocial != alta.RazonSocial)
            {
                observaciones.AppendLine($"RazonSocial: {alta.RazonSocial} -> {request.RazonSocial}");
                alta.RazonSocial = request.RazonSocial;
            }

            if (!string.IsNullOrEmpty(request.CuitRazonSocial) && request.CuitRazonSocial != alta.CuitRazonSocial.ToString())
            {
                observaciones.AppendLine($"CuitRazonSocial: {alta.CuitRazonSocial} -> {request.CuitRazonSocial}");
                alta.CuitRazonSocial = double.Parse(request.CuitRazonSocial);
            }

            if (!string.IsNullOrEmpty(request.EstadoAfip) && request.EstadoAfip != alta.EstadoAfip)
            {
                observaciones.AppendLine($"EstadoAfip: {alta.EstadoAfip} -> {request.EstadoAfip}");
                alta.EstadoAfip = request.EstadoAfip;
            }

            if (!string.IsNullOrEmpty(request.CodActividad) && request.CodActividad != alta.CodActividad.ToString())
            {
                observaciones.AppendLine($"CodActividad: {alta.CodActividad} -> {request.CodActividad}");
                alta.CodActividad = double.Parse(request.CodActividad);
            }

            if (!string.IsNullOrEmpty(request.Actividad) && request.Actividad != alta.Actividad)
            {
                observaciones.AppendLine($"Actividad: {alta.Actividad} -> {request.Actividad}");
                alta.Actividad = request.Actividad;
            }

            if (!string.IsNullOrEmpty(request.Exento) && request.Exento != alta.Exento)
            {
                observaciones.AppendLine($"Exento: {alta.Exento} -> {request.Exento}");
                alta.Exento = request.Exento;
            }

            if (!string.IsNullOrEmpty(request.EstadoRentas) && request.EstadoRentas != alta.EstadoRentas)
            {
                observaciones.AppendLine($"EstadoRentas: {alta.EstadoRentas} -> {request.EstadoRentas}");
                alta.EstadoRentas = request.EstadoRentas;
            }

            if (!string.IsNullOrEmpty(request.Actividad2) && request.Actividad2 != alta.Actividad2)
            {
                observaciones.AppendLine($"Actividad2: {alta.Actividad2} -> {request.Actividad2}");
                alta.Actividad2 = request.Actividad2;
            }

            if (!string.IsNullOrEmpty(request.DomicilioFiscal) && request.DomicilioFiscal != alta.DomicilioFiscal)
            {
                observaciones.AppendLine($"DomicilioFiscal: {alta.DomicilioFiscal} -> {request.DomicilioFiscal}");
                alta.DomicilioFiscal = request.DomicilioFiscal;
            }

            if (!string.IsNullOrEmpty(request.Provincia3) && request.Provincia3 != alta.Provincia3)
            {
                observaciones.AppendLine($"Provincia3: {alta.Provincia3} -> {request.Provincia3}");
                alta.Provincia3 = request.Provincia3;
            }

            if (!string.IsNullOrEmpty(request.Alicuota) && request.Alicuota != alta.Alicuota.ToString())
            {
                observaciones.AppendLine($"Alicuota: {alta.Alicuota} -> {request.Alicuota}");
                alta.Alicuota = double.Parse(request.Alicuota);
            }

            if (!string.IsNullOrEmpty(request.Observacion) && request.Observacion != alta.Observacion)
            {
                observaciones.AppendLine($"Observacion: {alta.Observacion} -> {request.Observacion}");
                alta.Observacion = request.Observacion;
            }

            if (!string.IsNullOrEmpty(request.OrigenDeLaTerminal) && request.OrigenDeLaTerminal != alta.OrigenDeLaTerminal)
            {
                observaciones.AppendLine($"OrigenDeLaTerminal: {alta.OrigenDeLaTerminal} -> {request.OrigenDeLaTerminal}");
                alta.OrigenDeLaTerminal = request.OrigenDeLaTerminal;
            }

            if (!string.IsNullOrEmpty(request.DestinoDeLaTerminal) && request.DestinoDeLaTerminal != alta.DestinoDeLaTerminal)
            {
                observaciones.AppendLine($"DestinoDeLaTerminal: {alta.DestinoDeLaTerminal} -> {request.DestinoDeLaTerminal}");
                alta.DestinoDeLaTerminal = request.DestinoDeLaTerminal;
            }

            if (!string.IsNullOrEmpty(request.ReUbicacion) && request.ReUbicacion != alta.ReUbicacion)
            {
                observaciones.AppendLine($"ReUbicacion: {alta.ReUbicacion} -> {request.ReUbicacion}");
                alta.ReUbicacion = request.ReUbicacion;
            }

            if (!string.IsNullOrEmpty(request.DiasSinAltaDeTerminal) && request.DiasSinAltaDeTerminal != alta.DiasSinAltaDeTerminal)
            {
                observaciones.AppendLine($"DiasSinAltaDeTerminal: {alta.DiasSinAltaDeTerminal} -> {request.DiasSinAltaDeTerminal}");
                alta.DiasSinAltaDeTerminal = request.DiasSinAltaDeTerminal;
            }

            if (!string.IsNullOrEmpty(request.AutorizadoPorTitular) && request.AutorizadoPorTitular != alta.AutorizadoPorTitular)
            {
                observaciones.AppendLine($"AutorizadoPorTitular: {alta.AutorizadoPorTitular} -> {request.AutorizadoPorTitular}");
                alta.AutorizadoPorTitular = request.AutorizadoPorTitular;
            }

            if (!string.IsNullOrEmpty(request.FechaDeCargaAbm) && System.DateTime.TryParse(request.FechaDeCargaAbm, out System.DateTime fechaDeCargaAbm) && fechaDeCargaAbm != alta.FechaDeCargaAbm)
            {
                observaciones.AppendLine($"FechaDeCargaAbm: {alta.FechaDeCargaAbm} -> {fechaDeCargaAbm}");
                alta.FechaDeCargaAbm = fechaDeCargaAbm;
            }

            if (!string.IsNullOrEmpty(request.FechaDeModificacion) && System.DateTime.TryParse(request.FechaDeModificacion, out System.DateTime fechaDeModificacion) && fechaDeModificacion != alta.FechaDeModificacion)
            {
                observaciones.AppendLine($"FechaDeModificacion: {alta.FechaDeModificacion} -> {fechaDeModificacion}");
                alta.FechaDeModificacion = fechaDeModificacion;
            }

            if (!string.IsNullOrEmpty(request.AbmObservacionesDeCarga) && request.AbmObservacionesDeCarga != alta.AbmObservacionesDeCarga)
            {
                observaciones.AppendLine($"AbmObservacionesDeCarga: {alta.AbmObservacionesDeCarga} -> {request.AbmObservacionesDeCarga}");
                alta.AbmObservacionesDeCarga = request.AbmObservacionesDeCarga;
            }

            if (!string.IsNullOrEmpty(request.ParaInforme) && request.ParaInforme != alta.ParaInforme)
            {
                observaciones.AppendLine($"ParaInforme: {alta.ParaInforme} -> {request.ParaInforme}");
                alta.ParaInforme = request.ParaInforme;
            }

            if (!string.IsNullOrEmpty(request.EnPausa) && request.EnPausa != alta.EnPausa)
            {
                observaciones.AppendLine($"EnPausa: {alta.EnPausa} -> {request.EnPausa}");
                alta.EnPausa = request.EnPausa;
            }

            if (!string.IsNullOrEmpty(request.Backup) && request.Backup != alta.Backup)
            {
                observaciones.AppendLine($"Backup: {alta.Backup} -> {request.Backup}");
                alta.Backup = request.Backup;
            }

            if (!string.IsNullOrEmpty(request.Altas) && request.Altas != alta.Altas)
            {
                observaciones.AppendLine($"Altas: {alta.Altas} -> {request.Altas}");
                alta.Altas = request.Altas;
            }

            if (!string.IsNullOrEmpty(request.Baja) && request.Baja != alta.Baja)
            {
                observaciones.AppendLine($"Baja: {alta.Baja} -> {request.Baja}");
                alta.Baja = request.Baja;
            }

            if (!string.IsNullOrEmpty(request.IngresoASstt) && System.DateTime.TryParse(request.IngresoASstt, out System.DateTime ingresoASstt) && ingresoASstt != alta.IngresoASstt)
            {
                observaciones.AppendLine($"IngresoASstt: {alta.IngresoASstt} -> {ingresoASstt}");
                alta.IngresoASstt = ingresoASstt;
            }

            if (!string.IsNullOrEmpty(request.EgresoDeSstt) && request.EgresoDeSstt != alta.EgresoDeSstt.ToString())
            {
                observaciones.AppendLine($"EgresoDeSstt: {alta.EgresoDeSstt} -> {request.EgresoDeSstt}");
                alta.EgresoDeSstt = double.Parse(request.EgresoDeSstt);
            }

            if (!string.IsNullOrEmpty(request.MotivoSstt) && request.MotivoSstt != alta.MotivoSstt)
            {
                observaciones.AppendLine($"MotivoSstt: {alta.MotivoSstt} -> {request.MotivoSstt}");
                alta.MotivoSstt = request.MotivoSstt;
            }

            if (!string.IsNullOrEmpty(request._2MotivoSstt) && request._2MotivoSstt != alta._2MotivoSstt)
            {
                observaciones.AppendLine($"_2MotivoSstt: {alta._2MotivoSstt} -> {request._2MotivoSstt}");
                alta._2MotivoSstt = request._2MotivoSstt;
            }

            if (!string.IsNullOrEmpty(request.FechaSsttMes) && System.DateTime.TryParse(request.FechaSsttMes, out System.DateTime fechaSsttMes) && fechaSsttMes != alta.FechaSsttMes)
            {
                observaciones.AppendLine($"FechaSsttMes: {alta.FechaSsttMes} -> {fechaSsttMes}");
                alta.FechaSsttMes = fechaSsttMes;
            }

            if (!string.IsNullOrEmpty(request.CodActividadRentas) && request.CodActividadRentas != alta.CodActividadRentas.ToString())
            {
                observaciones.AppendLine($"CodActividadRentas: {alta.CodActividadRentas} -> {request.CodActividadRentas}");
                alta.CodActividadRentas = double.Parse(request.CodActividadRentas);
            }

            if (!string.IsNullOrEmpty(request.ActividadRentas) && request.ActividadRentas != alta.ActividadRentas)
            {
                observaciones.AppendLine($"ActividadRentas: {alta.ActividadRentas} -> {request.ActividadRentas}");
                alta.ActividadRentas = request.ActividadRentas;
            }
        }




    }
}
