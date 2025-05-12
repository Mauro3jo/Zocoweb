using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Office2016.Excel;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Net.WebSockets;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormularioController : ControllerBase
    {
        private readonly IFormularioAltaService _FormularioAlta;
        private readonly IFormularioBajaService _formularioBajaService;
        private readonly IFormularioModificacionService _FormularioModificacionService;
        private readonly IUsuarioZocoService _UsuarioZocoService;
        private readonly ITokenService _TokenService;
        private readonly IPanelControlInterno _panelControlInterno;

        public FormularioController(IFormularioAltaService formularioAltaService, IFormularioBajaService formularioBaja, IFormularioModificacionService formularioModificacionService, 
            IUsuarioZocoService usuarioZocoService, ITokenService tokenService, IPanelControlInterno panelControlInterno)
        {
            _FormularioAlta = formularioAltaService;
            _FormularioModificacionService = formularioModificacionService;
            _TokenService = tokenService;
            _formularioBajaService = formularioBaja;
            _UsuarioZocoService = usuarioZocoService;
            _panelControlInterno = panelControlInterno;
        }
        public static byte[] ConvertBase64String(string base64String)
        {
            if (string.IsNullOrEmpty(base64String))
            {
                return null;
            }

            if (base64String.Contains(","))
            {
                base64String = base64String.Split(',')[1];
            }

            return Convert.FromBase64String(base64String);
        }
        [HttpPost("formularioaltacrear")]
        public async Task<IActionResult> FormularioAltaCrear([FromBody] VMFormularioAlta vmformularioalta)
        {
           

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmformularioalta.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }



            var condicion = vmformularioalta.condicionAFIP.ToLower();
            var AfipMonotributista = false;
            var AfipResponsableInscripto = false;
            if (condicion == "monotributista")
            {
                AfipMonotributista = true;

            }
            else
            {
                 AfipResponsableInscripto = true;

            }
           
            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var TipoPersona = vmformularioalta.TipoPersona;
            var FechaApertura = fechaApertura;
            var NumeroTerminal = vmformularioalta.TerminalN;
            var ApellidoYnombre = vmformularioalta.ApellidoYnombre;
            var Cuittitular = vmformularioalta.Cuittitular;
            var ActividadLaboralProfesional = vmformularioalta.ActividadLaboralProfesional;
            var Calle = vmformularioalta.Calle;
            var NumeroCalle = vmformularioalta.NumeroCalle;
            var LocalidadTitular = vmformularioalta.LocalidadTitular;
            var Provincia = vmformularioalta.Provincia;
            var Pais = vmformularioalta.Pais;
            var CodigoPostalTitular = vmformularioalta.CodigoPostalTitular;
            var Nacionalidad = vmformularioalta.Nacionalidad;
            DateTime? FechaNacimiento = string.IsNullOrEmpty(vmformularioalta.FechaNacimiento)
                ? (DateTime?)null
                : DateTime.Parse(vmformularioalta.FechaNacimiento);

            var Celular = vmformularioalta.Celular;
            var TelFijo = vmformularioalta.TelFijo;
            var Correo = vmformularioalta.Correo;
            var Apoderado = vmformularioalta.Apoderado;
            var NombreFantasia = vmformularioalta.NombreFantasia;
            var Domicilio = vmformularioalta.Domicilio;
            var LocalidadComercio = vmformularioalta.LocalidadComercio;
            var CodigoPostalComercio = vmformularioalta.CodigoPostalComercio;
           /* var AfipMonotributista = !string.IsNullOrEmpty(vmformularioalta.AfipMonotributista);
            var AfipResponsableInscripto = !string.IsNullOrEmpty(vmformularioalta.AfipResponsableInscripto);*/
            var AfipExentoGanancia = !string.IsNullOrEmpty(vmformularioalta.AfipExentoGanancia);
            var AfipExentoIva = !string.IsNullOrEmpty(vmformularioalta.AfipExentoIva);
            var RentasIncripto = !string.IsNullOrEmpty(vmformularioalta.RentasIncripto);
            var RentasConvenioMultilateral = !string.IsNullOrEmpty(vmformularioalta.RentasConvenioMultilateral);
            var RentasExento = !string.IsNullOrEmpty(vmformularioalta.RentasExento);
            var Banco = vmformularioalta.Banco;
            var TipoCuenta = vmformularioalta.TipoCuenta;
             var IdGestor = usuarioEncontrado.usuario.Id;
            var Cbucvu = vmformularioalta.Cbucvu;
            var Alias = vmformularioalta.Alias;
            var Cuitbancario = vmformularioalta.Cuitbancario;
            var TitularRazonSocial = vmformularioalta.TitularRazonSocial;
            var NumeroComericoActual = vmformularioalta.NumeroComericoActual;
            var NumeroComercioSolicitado = vmformularioalta.NumeroComercioSolicitado;
            var TipoAlta = vmformularioalta.TipoAlta;
            var NuevoPanel = !string.IsNullOrEmpty(vmformularioalta.NuevoPanel);
            var base64Data = vmformularioalta.AltaFirmada;
           


            // Uso del método genérico
            var AltaFirmada = ConvertBase64String(vmformularioalta.AltaFirmada);
            var CuponInicializacionTerminal = ConvertBase64String(vmformularioalta.CuponInicializacionTerminal);
            var ConstanciaAfip = ConvertBase64String(vmformularioalta.ConstanciaAfip);
            var CostanciaCbu = ConvertBase64String(vmformularioalta.ContanciaCbuCvu);
            var DNIfrente = ConvertBase64String(vmformularioalta.Dnifrente);
            var CopiaContratoSocialOactoConstitutivo = ConvertBase64String(vmformularioalta.CopiaContratoSocialOactoConstitutivo);
            var FichaAutorizacion = ConvertBase64String(vmformularioalta.FichaAutorizacion);
            var CierredeLote = ConvertBase64String(vmformularioalta.CierredeLote);
            var ConstanciaRentas = ConvertBase64String(vmformularioalta.ConstanciaRentas);
            var Dnidorso = ConvertBase64String(vmformularioalta.Dnidorso);
            await _FormularioAlta.CrearFormularioAltaAsync(new FormularioAlta


            {
                TipoPersona = TipoPersona,
                FechaApertura = FechaApertura,
                NumeroTerminal = NumeroTerminal,
                ApellidoYnombre = ApellidoYnombre,
                Cuittitular = Cuittitular,
                ActividadLaboralProfesional = ActividadLaboralProfesional,
                Calle = Calle,
                NumeroCalle = NumeroCalle,
                LocalidadTitular = LocalidadTitular,
                Provincia = Provincia,
                Pais = Pais,
                CodigoPostalTitular = CodigoPostalTitular,
                Nacionalidad = Nacionalidad,
                FechaNacimiento = FechaNacimiento,
                Celular = Celular,
                TelFijo = TelFijo,
                Correo = Correo,
                Apoderado = Apoderado,
                NombreFantasia = NombreFantasia,
                Domicilio = Domicilio,
                LocalidadComercio = LocalidadComercio,
                CodigoPostalComercio = CodigoPostalComercio,
                AfipMonotributista = AfipMonotributista,
                AfipResponsableInscripto = AfipResponsableInscripto,
                AfipExentoGanancia = AfipExentoGanancia,
                AfipExentoIva =AfipExentoIva,
                RentasIncripto = RentasIncripto,
                RentasConvenioMultilateral = RentasConvenioMultilateral,
                RentasExento = RentasExento,

                Banco = Banco,
                TipoCuenta = TipoCuenta,
                Cbucvu = Cbucvu,
                Alias = Alias,
                Cuitbancario = Cuitbancario,
                TitularRazonSocial = TitularRazonSocial,
                IdGestor = IdGestor,
                NumeroComericoActual = NumeroComericoActual,
                NumeroComercioSolicitado = NumeroComercioSolicitado,
                TipoAlta = TipoAlta,
                NuevoPanel = NuevoPanel,
                AltaFirmada = AltaFirmada,
                 CuponInicializacionTerminal = CuponInicializacionTerminal,
              ConstanciaAfip = ConstanciaAfip,
               ContanciaCbuCvu = CostanciaCbu,
               Dnifrente = DNIfrente,
             CopiaContratoSocialOactoConstitutivo = CopiaContratoSocialOactoConstitutivo,
              FichaAutorizacion = FichaAutorizacion,
               CierredeLote = CierredeLote,
              ConstanciaRentas = ConstanciaRentas,
              Dnidorso = Dnidorso,


            });
            if (usuarioEncontrado.usuario.TipoUsuario == 8)
            {
                var panelcontrolinterno = new PanelGestorInterno
                {
                    CanalAtencion = "FORMULARIO",
                    Tipo = "FORMULARIO ALTA",
                    Aliado = NombreFantasia,
                    Motivo = "FORMULARIO ALTA",
                    Estado = "Cerrada",
                    FechaCarga = fechaApertura,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = "se creo un formulario para alta"
                };
                await _panelControlInterno.Crear(panelcontrolinterno);
            }
           
            return Ok("Comanda creada con éxito");
        }
        [HttpPost("ListarFormulariasAltaporId")]
        public async Task<IActionResult> ListarFormulariasAltaporId([FromBody] VMFormularioAlta vmformularioAlta)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vmformularioAlta.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmformularioAlta.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            var FormularioAltas = await _FormularioAlta.ListarFormulariosAltaAsyncId((int)vmformularioAlta.Id);
            if (FormularioAltas == null)
            {
                return NotFound("No se encontraron FormularioAltas con ese ID.");
            }

            return Ok(FormularioAltas);
        }

        [HttpGet("ListarTodosFormulariosAlta")]
        public async Task<IActionResult> ListarTodosFormulariosAltas()
        {
            var formularioAltas = await _FormularioAlta.ListarFormulariosAltasAsync();
            var fomularioAltasConNombre = new List<object>(); 

            foreach (var form in formularioAltas)
            {
                string? nombreGestor = null;

                if (form.IdGestor != null)
                {
                    var gestor = await _UsuarioZocoService.ObtenerPorId((int)form.IdGestor);
                    nombreGestor = gestor.Nombre;
                }

                fomularioAltasConNombre.Add(new
                {
                    Id = form.Id,
                    TipoPersona = form.TipoPersona,
                    FechaApertura = form.FechaApertura,
                    NumeroTerminal = form.NumeroTerminal,
                    ApellidoYnombre = form.ApellidoYnombre,
                    Cuittitular = form.Cuittitular,
                    ActividadLaboralProfesional = form.ActividadLaboralProfesional,
                    Calle = form.Calle,
                    NumeroCalle = form.NumeroCalle,
                    LocalidadTitular = form.LocalidadTitular,
                    Provincia = form.Provincia,
                    Pais = form.Pais,
                    CodigoPostalTitular = form.CodigoPostalTitular,
                    Nacionalidad = form.Nacionalidad,
                    FechaNacimiento = form.FechaNacimiento,
                    Celular = form.Celular,
                    TelFijo = form.TelFijo,
                    Correo = form.Correo,
                    Apoderado = form.Apoderado,
                    NombreFantasia = form.NombreFantasia,
                    Domicilio = form.Domicilio,
                    LocalidadComercio = form.LocalidadComercio,
                    CodigoPostalComercio = form.CodigoPostalComercio,
                    AfipMonotributista = form.AfipMonotributista,
                    AfipResponsableInscripto = form.AfipResponsableInscripto,
                    AfipExentoGanancia = form.AfipExentoGanancia,
                    AfipExentoIva = form.AfipExentoIva,
                    RentasIncripto = form.RentasIncripto,
                    RentasConvenioMultilateral = form.RentasConvenioMultilateral,
                    RentasExento = form.RentasExento,
                    Banco = form.Banco,
                    TipoCuenta = form.TipoCuenta,
                    Cbucvu = form.Cbucvu,
                    Alias = form.Alias,
                    Cuitbancario = form.Cuitbancario,
                    TitularRazonSocial = form.TitularRazonSocial,
                    IdGestor = form.IdGestor,
                    NumeroComericoActual = form.NumeroComericoActual,
                    NumeroComercioSolicitado = form.NumeroComercioSolicitado,
                    TipoAlta = form.TipoAlta,
                    NuevoPanel = form.NuevoPanel,
                    NombreGestor = nombreGestor
                });

            }

            return Ok(fomularioAltasConNombre);
        }
        [HttpPost("EditarFomularioAlta")]
        public async Task<IActionResult> EditarFomularioAlta([FromBody] VMFormularioAlta vMFormularioAlta)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioAlta.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var formularioAlta = await _FormularioAlta.ListarFormulariosAltaAsyncId((int)vMFormularioAlta.Id);
            if (formularioAlta == null)
            {
                return NotFound("Comanda no encontrada.");
            }

            var c = vMFormularioAlta.condicionAFIP ?? "";
            string condicion = "";
            if (c != "")
            {
                condicion = c.ToLower();
            }
            var AfipMonotributista = false;
            var AfipResponsableInscripto = false;
            if (condicion == "monotributista")
            {
                AfipMonotributista = true;
            }
            else if (condicion != "")
            {
                AfipResponsableInscripto = true;
            }

            formularioAlta.TipoPersona = vMFormularioAlta.TipoPersona;
            formularioAlta.FechaApertura = !string.IsNullOrEmpty(vMFormularioAlta.FechaApertura) ? DateTime.Parse(vMFormularioAlta.FechaApertura) : null;
            formularioAlta.NumeroTerminal = vMFormularioAlta.TerminalN ?? formularioAlta.NumeroTerminal;
            formularioAlta.ApellidoYnombre = vMFormularioAlta.ApellidoYnombre ?? formularioAlta.ApellidoYnombre;
            formularioAlta.Cuittitular = vMFormularioAlta.Cuittitular ?? formularioAlta.Cuittitular;
            formularioAlta.ActividadLaboralProfesional = vMFormularioAlta.ActividadLaboralProfesional ?? formularioAlta.ActividadLaboralProfesional;
            formularioAlta.Calle = vMFormularioAlta.Calle ?? formularioAlta.Calle;
            formularioAlta.NumeroCalle = vMFormularioAlta.NumeroCalle ?? formularioAlta.NumeroCalle;
            formularioAlta.LocalidadTitular = vMFormularioAlta.LocalidadTitular ?? formularioAlta.LocalidadTitular;
            formularioAlta.Provincia = vMFormularioAlta.Provincia ?? formularioAlta.Provincia;
            formularioAlta.Pais = vMFormularioAlta.Pais ?? formularioAlta.Pais;
            formularioAlta.CodigoPostalTitular = vMFormularioAlta.CodigoPostalTitular ?? formularioAlta.CodigoPostalTitular;
            formularioAlta.Nacionalidad = vMFormularioAlta.Nacionalidad ?? formularioAlta.Nacionalidad;
            formularioAlta.FechaNacimiento = !string.IsNullOrEmpty(vMFormularioAlta.FechaNacimiento) ? DateTime.Parse(vMFormularioAlta.FechaNacimiento) : formularioAlta.FechaNacimiento;
            formularioAlta.Celular = vMFormularioAlta.Celular ?? formularioAlta.Celular;
            formularioAlta.TelFijo = vMFormularioAlta.TelFijo ?? formularioAlta.TelFijo;
            formularioAlta.Correo = vMFormularioAlta.Correo ?? formularioAlta.Correo;
            formularioAlta.Apoderado = vMFormularioAlta.Apoderado ?? formularioAlta.Apoderado;
            formularioAlta.NombreFantasia = vMFormularioAlta.NombreFantasia ?? formularioAlta.NombreFantasia;
            formularioAlta.Domicilio = vMFormularioAlta.Domicilio ?? formularioAlta.Domicilio;
            formularioAlta.LocalidadComercio = vMFormularioAlta.LocalidadComercio ?? formularioAlta.LocalidadComercio;
            formularioAlta.CodigoPostalComercio = vMFormularioAlta.CodigoPostalComercio ?? formularioAlta.CodigoPostalComercio;
            formularioAlta.AfipMonotributista = AfipMonotributista;
            formularioAlta.AfipResponsableInscripto = AfipResponsableInscripto;
            formularioAlta.AfipExentoGanancia = vMFormularioAlta.AfipExentoGanancia != null ?
                string.Equals(vMFormularioAlta.AfipExentoGanancia, "true", StringComparison.OrdinalIgnoreCase) : formularioAlta.AfipExentoGanancia;
            formularioAlta.AfipExentoIva = vMFormularioAlta.AfipExentoIva != null ?
                string.Equals(vMFormularioAlta.AfipExentoIva, "true", StringComparison.OrdinalIgnoreCase) : formularioAlta.AfipExentoIva;
            formularioAlta.RentasIncripto = vMFormularioAlta.RentasIncripto != null ?
                string.Equals(vMFormularioAlta.RentasIncripto, "true", StringComparison.OrdinalIgnoreCase) : formularioAlta.RentasIncripto;
            formularioAlta.RentasConvenioMultilateral = vMFormularioAlta.RentasConvenioMultilateral != null ?
                string.Equals(vMFormularioAlta.RentasConvenioMultilateral, "true", StringComparison.OrdinalIgnoreCase) : formularioAlta.RentasConvenioMultilateral;
            formularioAlta.RentasExento = vMFormularioAlta.RentasExento != null ?
                string.Equals(vMFormularioAlta.RentasExento, "true", StringComparison.OrdinalIgnoreCase) : formularioAlta.RentasExento;
            formularioAlta.Banco = vMFormularioAlta.Banco ?? formularioAlta.Banco;
            formularioAlta.TipoCuenta = vMFormularioAlta.TipoCuenta ?? formularioAlta.TipoCuenta;
            formularioAlta.Cbucvu = vMFormularioAlta.Cbucvufront ?? formularioAlta.Cbucvu;
            formularioAlta.Alias = vMFormularioAlta.Alias ?? formularioAlta.Alias;
            formularioAlta.Cuitbancario = vMFormularioAlta.Cuitbancario ?? formularioAlta.Cuitbancario;
            formularioAlta.TitularRazonSocial = vMFormularioAlta.TitularRazonSocial ?? formularioAlta.TitularRazonSocial;
            formularioAlta.IdGestor = vMFormularioAlta.IdGestor ?? formularioAlta.IdGestor;
            formularioAlta.NumeroComericoActual = vMFormularioAlta.NumeroComericoActual ?? formularioAlta.NumeroComericoActual;
            formularioAlta.NumeroComercioSolicitado = vMFormularioAlta.NumeroComercioSolicitado ?? formularioAlta.NumeroComercioSolicitado;
            formularioAlta.TipoAlta = vMFormularioAlta.TipoAlta ?? formularioAlta.TipoAlta;

       //     await _FormularioAltaService.EditarFormularioAltaAsync(formularioAlta);

            //formularioAlta.NuevoPanel = bool.TryParse(vMFormularioAlta.NuevoPanel, out bool nuevopanelEx) ? nuevopanelEx : null;
            //formularioAlta.AltaFirmada = !string.IsNullOrEmpty(vMFormularioAlta.AltaFirmada) ? Convert.FromBase64String(vMFormularioAlta.AltaFirmada) : null;
            //formularioAlta.CuponInicializacionTerminal = !string.IsNullOrEmpty(vMFormularioAlta.CuponInicializacionTerminal) ? Convert.FromBase64String(vMFormularioAlta.CuponInicializacionTerminal) : null;
            //formularioAlta.ConstanciaAfip = !string.IsNullOrEmpty(vMFormularioAlta.ConstanciaAfip) ? Convert.FromBase64String(vMFormularioAlta.ConstanciaAfip) : null;
            //formularioAlta.ContanciaCbuCvu = !string.IsNullOrEmpty(vMFormularioAlta.ContanciaCbuCvu) ? Convert.FromBase64String(vMFormularioAlta.ContanciaCbuCvu) : null;
            //formularioAlta.Dnifrente = !string.IsNullOrEmpty(vMFormularioAlta.Dnifrente) ? Convert.FromBase64String(vMFormularioAlta.Dnifrente) : null;
            //formularioAlta.CopiaContratoSocialOactoConstitutivo = !string.IsNullOrEmpty(vMFormularioAlta.CopiaContratoSocialOactoConstitutivo) ? Convert.FromBase64String(vMFormularioAlta.CopiaContratoSocialOactoConstitutivo) : null;
            //formularioAlta.FichaAutorizacion = !string.IsNullOrEmpty(vMFormularioAlta.FichaAutorizacion) ? Convert.FromBase64String(vMFormularioAlta.FichaAutorizacion) : null;
            //formularioAlta.CierredeLote = !string.IsNullOrEmpty(vMFormularioAlta.CierredeLote) ? Convert.FromBase64String(vMFormularioAlta.CierredeLote) : null;
            //formularioAlta.ConstanciaRentas = !string.IsNullOrEmpty(vMFormularioAlta.ConstanciaRentas) ? Convert.FromBase64String(vMFormularioAlta.ConstanciaRentas) : null;
            //formularioAlta.Dnidorso = !string.IsNullOrEmpty(vMFormularioAlta.Dnidorso) ? Convert.FromBase64String(vMFormularioAlta.Dnidorso) : null;

            await _FormularioAlta.EditarFormularioAltaAsync(formularioAlta);
            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMFormularioAlta.token);

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = "FORMULARIO",
                Tipo = "FORMULARIO ALTA",
                Aliado = formularioAlta.NombreFantasia,
                Motivo = "FORMULARIO ALTA EDITAR",
                Estado = "Cerrada",
                FechaCarga = fechaCierreArg,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = "se edito el formulario de alta"
            };
            await _panelControlInterno.Crear(panelcontrolinterno);
            return Ok("Comanda actualizada con éxito.");
        }
        [HttpPost("descargarformularioalta")]
        public async Task<IActionResult> DescargarFormularioAlta([FromBody] VMFormularioAlta vmformularioAlta)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vmformularioAlta.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmformularioAlta.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            var formularioAlta = await _FormularioAlta.ListarFormulariosAltaAsyncId((int)vmformularioAlta.Id);
            if (formularioAlta == null)
            {
                return NotFound("No se encontraron formularios de alta con ese ID.");
            }

            var vmFormulario = new VMFormularioAlta
            {
                AltaFirmada = formularioAlta.AltaFirmada != null ? Convert.ToBase64String(formularioAlta.AltaFirmada) : null,
                CuponInicializacionTerminal = formularioAlta.CuponInicializacionTerminal != null ? Convert.ToBase64String(formularioAlta.CuponInicializacionTerminal) : null,
                ConstanciaAfip = formularioAlta.ConstanciaAfip != null ? Convert.ToBase64String(formularioAlta.ConstanciaAfip) : null,
                ContanciaCbuCvu = formularioAlta.ContanciaCbuCvu != null ? Convert.ToBase64String(formularioAlta.ContanciaCbuCvu) : null,
                Dnifrente = formularioAlta.Dnifrente != null ? Convert.ToBase64String(formularioAlta.Dnifrente) : null,
                CopiaContratoSocialOactoConstitutivo = formularioAlta.CopiaContratoSocialOactoConstitutivo != null ? Convert.ToBase64String(formularioAlta.CopiaContratoSocialOactoConstitutivo) : null,
                FichaAutorizacion = formularioAlta.FichaAutorizacion != null ? Convert.ToBase64String(formularioAlta.FichaAutorizacion) : null,
                CierredeLote = formularioAlta.CierredeLote != null ? Convert.ToBase64String(formularioAlta.CierredeLote) : null,
                ConstanciaRentas = formularioAlta.ConstanciaRentas != null ? Convert.ToBase64String(formularioAlta.ConstanciaRentas) : null,
                Dnidorso = formularioAlta.Dnidorso != null ? Convert.ToBase64String(formularioAlta.Dnidorso) : null
            };

            return Ok(vmFormulario);
        }




        [HttpPost("formulariomodificarcrear")]
        public async Task<IActionResult> FormularioModificarCrear([FromBody] VMFormularioModificar vMFormularioModificar)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioModificar.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMFormularioModificar.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }



            var condicion = vMFormularioModificar.condicionAFIP?.ToLower() ?? string.Empty;
            var AfipMonotributista = false;
            var AfipResponsableInscripto = false;
            if (condicion == "monotributista")
            {
                AfipMonotributista = true;

            }
            else
            {
                AfipResponsableInscripto = true;

            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var NombreComercio = vMFormularioModificar.NombreComercio;
            var BajaServicioTecnico = !string.IsNullOrEmpty(vMFormularioModificar.BajaServicioTecnico);
            var Observacion = vMFormularioModificar.Observacion;
            var RegistraOperacionesPendientes = !string.IsNullOrEmpty(vMFormularioModificar.RegistraOperacionesPendientes);
            var RegistraOperacionesConTarjetaNaranja = !string.IsNullOrEmpty(vMFormularioModificar.RegistraOperacionesPendientes);
            var AdjuntaCierreLote = !string.IsNullOrEmpty(vMFormularioModificar.AdjuntaCierreLote);
            var NumeroTerminalAltaL = vMFormularioModificar.NumeroTerminalAltaL ?? "";
            var TipoModificacion = vMFormularioModificar.TipoModificacion ?? "";
            var NombreFantasia = vMFormularioModificar.NombreFantasia;
            var NumeroComercio = vMFormularioModificar.NumeroComercio ?? "";
            var NumeroTerminalBaja = vMFormularioModificar.NumeroTerminalBaja ?? "";
            var Domicilio = vMFormularioModificar.Domicilio;
            var Provincia = vMFormularioModificar.Provincia;
            var Ciudad = vMFormularioModificar.Ciudad;
            var CodigoPostal = vMFormularioModificar.CodigoPostal ?? "";
            var Banco = vMFormularioModificar.Banco;
            var TipoCuenta = vMFormularioModificar.TipoCuenta;
            var Cbucvu = vMFormularioModificar.Cbucvu ?? "";
            var Alias = vMFormularioModificar.Alias;
            var Cuitbancario = vMFormularioModificar.Cuitbancario;
            var Email = vMFormularioModificar.Email;


            var AfipExentoGanancia = !string.IsNullOrEmpty(vMFormularioModificar.AfipExentoGanancia);

            var AfipExentoIva = !string.IsNullOrEmpty(vMFormularioModificar.AfipExentoGanancia);
            var RentasIncripto = !string.IsNullOrEmpty(vMFormularioModificar.RentasIncripto);
            var RentasConvenioMultilateral = !string.IsNullOrEmpty(vMFormularioModificar.RentasConvenioMultilateral);
            var RentasExento = !string.IsNullOrEmpty(vMFormularioModificar.RentasExento);

            var AltaFirmada = vMFormularioModificar.AltaFirmada != null ? ConvertBase64String(vMFormularioModificar.AltaFirmada) : null;
            var CuponInicializacionTerminal1 = vMFormularioModificar.CuponInicializacionTerminal1 != null ? ConvertBase64String(vMFormularioModificar.CuponInicializacionTerminal1) : null;
            var ConstanciaCbucvu = vMFormularioModificar.ConstanciaCbucvu != null ? ConvertBase64String(vMFormularioModificar.ConstanciaCbucvu) : null;
            var Dni = vMFormularioModificar.Dni != null ? ConvertBase64String(vMFormularioModificar.Dni) : null;
            var DniDorso = vMFormularioModificar.DniDorso != null ? ConvertBase64String(vMFormularioModificar.DniDorso) : null;
            var CuponInicializacionTerminal2 = vMFormularioModificar.CuponInicializacionTerminal2 != null ? ConvertBase64String(vMFormularioModificar.CuponInicializacionTerminal2) : null;
            var ConstanciaRentas = vMFormularioModificar.ConstanciaRentas != null ? ConvertBase64String(vMFormularioModificar.ConstanciaRentas) : null;
            var titularrzonsocial = vMFormularioModificar.TitularRazonSocial != null ? ConvertBase64String(vMFormularioModificar.TitularRazonSocial) : null;


            await _FormularioModificacionService.CrearFormularioModificacionesAsync(new FormularioModificacione
            {
                FechaApertura = fechaApertura,
                IdGestor = usuarioEncontrado.usuario.Id,
                NombreComercio = NombreComercio,

                BajaServicioTecnico = BajaServicioTecnico,
                NumeroTerminalBaja = NumeroTerminalBaja,
                Observacion = Observacion,
                RegistraOperacionesPendientes = RegistraOperacionesPendientes,
                RegistraOperacionesConTarjetaNaranja = RegistraOperacionesConTarjetaNaranja,
                AdjuntaCierreLote = AdjuntaCierreLote,
                NumeroTerminalAltaL = NumeroTerminalAltaL,
                NombreFantasia = NombreFantasia,
                NumeroComercio = NumeroComercio,
                Domicilio = Domicilio,
                Provincia = Provincia,
                Ciudad = Ciudad,
                CodigoPostal = CodigoPostal,
                Banco = Banco,
                TipoCuenta = TipoCuenta,
                Cbucvu = Cbucvu,
                Alias = Alias,
                Cuitbancario = Cuitbancario,
                Email = Email,
                AfipMonotributista = AfipMonotributista,
                AfipResponsableInscripto = AfipResponsableInscripto,
                AfipExentoGanancia = AfipExentoGanancia,
                AfipExentoIva = AfipExentoIva,
                RentasIncripto = RentasIncripto,
                RentasConvenioMultilateral = RentasConvenioMultilateral,
                RentasExento = RentasExento,
                AltaFirmada = AltaFirmada,
                CuponInicializacionTerminal1 = CuponInicializacionTerminal1,
                ConstanciaCbucvu = ConstanciaCbucvu,
                Dni = Dni,
                Dnidorso = DniDorso,
                CuponInicializacionTerminal2 = CuponInicializacionTerminal2,
                ConstanciaRentas = ConstanciaRentas,
                TitularRazonSocial = titularrzonsocial,
                TipoModificacion = TipoModificacion,

            });

            if (usuarioEncontrado.usuario.TipoUsuario == 8)
            {
                var panelcontrolinterno = new PanelGestorInterno
                {
                    CanalAtencion = "FORMULARIO",
                    Tipo = "FORMULARIO MODIFICACION",
                    Aliado = vMFormularioModificar.NombreFantasia,
                    Motivo = "FORMULARIO MODIFICAR",
                    Estado = "Cerrada",
                    FechaCarga = fechaApertura,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = "se creo un formulario modificacion"
                };
                await _panelControlInterno.Crear(panelcontrolinterno);
            }


            return Ok("Comanda creada con éxito");
        }

        [HttpPost("EditarFomularioModificaciones")]
        public async Task<IActionResult> EditarFomularioModificaciones([FromBody] VMFormularioModificar VMFormularioEditar)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(VMFormularioEditar.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var formularioModificaciones = await _FormularioModificacionService.ListarFormulariosAModificacionesAsyncPordId((int)VMFormularioEditar.Id);
            if (formularioModificaciones == null)
            {
                return NotFound("Comanda no encontrada.");
            }

            formularioModificaciones.NombreComercio = VMFormularioEditar.NombreComercio ?? formularioModificaciones.NombreComercio;
            formularioModificaciones.BajaServicioTecnico = VMFormularioEditar.BajaServicioTecnico != null ?
                string.Equals(VMFormularioEditar.BajaServicioTecnico, "true", StringComparison.OrdinalIgnoreCase) : formularioModificaciones.BajaServicioTecnico;
            formularioModificaciones.NumeroTerminalBaja = VMFormularioEditar.NumeroTerminalBaja ?? formularioModificaciones.NumeroTerminalBaja;
            formularioModificaciones.Observacion = VMFormularioEditar.Observacion ?? formularioModificaciones.Observacion;
            formularioModificaciones.RegistraOperacionesPendientes = VMFormularioEditar.RegistraOperacionesPendientes != null ?
    string.Equals(VMFormularioEditar.RegistraOperacionesPendientes, "Si", StringComparison.OrdinalIgnoreCase) : formularioModificaciones.RegistraOperacionesPendientes;

            formularioModificaciones.RegistraOperacionesConTarjetaNaranja = VMFormularioEditar.RegistraOperacionesConTarjetaNaranja != null ?
                string.Equals(VMFormularioEditar.RegistraOperacionesConTarjetaNaranja, "Si", StringComparison.OrdinalIgnoreCase) : formularioModificaciones.RegistraOperacionesConTarjetaNaranja;
            formularioModificaciones.AdjuntaCierreLote = VMFormularioEditar.AdjuntaCierreLote != null ?
                string.Equals(VMFormularioEditar.AdjuntaCierreLote, "Si", StringComparison.OrdinalIgnoreCase) : formularioModificaciones.AdjuntaCierreLote;
            formularioModificaciones.NumeroTerminalAltaL = VMFormularioEditar.NumeroTerminalAltaL ?? formularioModificaciones.NumeroTerminalAltaL;
            formularioModificaciones.NombreFantasia = VMFormularioEditar.NombreFantasia ?? formularioModificaciones.NombreFantasia;
            formularioModificaciones.NumeroComercio = VMFormularioEditar.NumeroComercio ?? formularioModificaciones.NumeroComercio;
            formularioModificaciones.Domicilio = VMFormularioEditar.Domicilio ?? formularioModificaciones.Domicilio;
            formularioModificaciones.Provincia = VMFormularioEditar.Provincia ?? formularioModificaciones.Provincia;
            formularioModificaciones.Ciudad = VMFormularioEditar.Ciudad ?? formularioModificaciones.Ciudad;
            formularioModificaciones.CodigoPostal = VMFormularioEditar.CodigoPostal ?? formularioModificaciones.CodigoPostal;
            formularioModificaciones.Banco = VMFormularioEditar.Banco ?? formularioModificaciones.Banco;
            formularioModificaciones.TipoCuenta = VMFormularioEditar.TipoCuenta ?? formularioModificaciones.TipoCuenta;
            formularioModificaciones.Cbucvu = VMFormularioEditar.Cbucvu ?? formularioModificaciones.Cbucvu;
            formularioModificaciones.Alias = VMFormularioEditar.Alias ?? formularioModificaciones.Alias;
            formularioModificaciones.Cuitbancario = VMFormularioEditar.Cuitbancario ?? formularioModificaciones.Cuitbancario;
            formularioModificaciones.Email = VMFormularioEditar.Email ?? formularioModificaciones.Email;
            formularioModificaciones.TipoModificacion = VMFormularioEditar.TipoModificacion ?? formularioModificaciones.TipoModificacion;

            formularioModificaciones.AfipMonotributista = VMFormularioEditar.condicionAFIP != null &&
     string.Equals(VMFormularioEditar.condicionAFIP, "Monotributista", StringComparison.OrdinalIgnoreCase);

            formularioModificaciones.AfipResponsableInscripto = VMFormularioEditar.condicionAFIP != null &&
                string.Equals(VMFormularioEditar.condicionAFIP, "Responsable Inscripto", StringComparison.OrdinalIgnoreCase);

            // Campos adicionales de AFIP se ajustan según corresponda
            formularioModificaciones.AfipExentoGanancia = !string.IsNullOrEmpty(VMFormularioEditar.AfipExentoGanancia) &&
                string.Equals(VMFormularioEditar.AfipExentoGanancia, "AfipExentoGanancia", StringComparison.OrdinalIgnoreCase);

            formularioModificaciones.AfipExentoIva = !string.IsNullOrEmpty(VMFormularioEditar.AfipExentoIva) &&
                string.Equals(VMFormularioEditar.AfipExentoIva, "AfipExentoIva", StringComparison.OrdinalIgnoreCase);

            // Asignación de campos de Rentas
            formularioModificaciones.RentasIncripto = VMFormularioEditar.RentasIncripto != null &&
                string.Equals(VMFormularioEditar.RentasIncripto, "RentasIncripto", StringComparison.OrdinalIgnoreCase);

            formularioModificaciones.RentasConvenioMultilateral = !string.IsNullOrEmpty(VMFormularioEditar.RentasConvenioMultilateral) &&
                string.Equals(VMFormularioEditar.RentasConvenioMultilateral, "RentasConvenioMultilateral", StringComparison.OrdinalIgnoreCase);

            formularioModificaciones.RentasExento = !string.IsNullOrEmpty(VMFormularioEditar.RentasExento) &&
                string.Equals(VMFormularioEditar.RentasExento, "RentasExento", StringComparison.OrdinalIgnoreCase);
            formularioModificaciones.Secambiaporclover = VMFormularioEditar.Secambiaporclover ?? formularioModificaciones.Secambiaporclover;

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(VMFormularioEditar.token);

            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = "FORMULARIO",
                Tipo = "FORMULARIO MODIFICAR",
                Aliado = VMFormularioEditar.NombreFantasia,
                Motivo = "FORMULARIO MODIFICAR EDITAR",
                Estado = "Cerrada",
                FechaCarga = fechaCierreArg,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = "se edito un formulario de modificacion"
            };
            await _panelControlInterno.Crear(panelcontrolinterno);
            await _FormularioModificacionService.EditarFormularioModificacionesAsync(formularioModificaciones);

            return Ok("Comanda actualizada con éxito.");
        }

        [HttpPost("ListarFormulariasModificacionesporId")]
        public async Task<IActionResult> ListarFormulariasModificacionesporId([FromBody] VMFormularioModificar vMFormularioModificar)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioModificar.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

         
            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMFormularioModificar.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            var FormularioAltas = await _FormularioModificacionService.ListarFormulariosAModificacionesAsyncPordId((int)vMFormularioModificar.Id);
            if (FormularioAltas == null)
            {
                return NotFound("No se encontraron Formulario Modificaciones con ese ID.");
            }

            return Ok(FormularioAltas);
        }
        [HttpGet("ListarTodosFormulariosModificaciones")]
        public async Task<IActionResult> ListarTodosFormulariosModificaciones()
        {
            var formularioModificacion = await _FormularioModificacionService.ListarFormulariosModificacionesAsync();
            var fomularioModificacionConNombre = new List<object>();

            foreach (var form in formularioModificacion)
            {
                string? nombreGestor = null;

                if (form.IdGestor != null)
                {
                    var gestor = await _UsuarioZocoService.ObtenerPorId((int)form.IdGestor);
                    nombreGestor = gestor.Nombre;
                }

                fomularioModificacionConNombre.Add(new
                {
                    Id = form.Id,
                    FechaApertura = form.FechaApertura,
                    IdGestor = form.IdGestor,
                    NombreComercio = form.NombreComercio,
                    BajaServicioTecnico = form.BajaServicioTecnico,
                    NumeroTerminalBaja = form.NumeroTerminalBaja,
                    Observacion = form.Observacion,
                    RegistraOperacionesPendientes = form.RegistraOperacionesPendientes,
                    RegistraOperacionesConTarjetaNaranja = form.RegistraOperacionesConTarjetaNaranja,
                    AdjuntaCierreLote = form.AdjuntaCierreLote,
                    NumeroTerminalAltaL = form.NumeroTerminalAltaL,
                    NombreFantasia = form.NombreFantasia,
                    NumeroComercio = form.NumeroComercio,
                    Domicilio = form.Domicilio,
                    Provincia = form.Provincia,
                    Ciudad = form.Ciudad,
                    CodigoPostal = form.CodigoPostal,
                    Banco = form.Banco,
                    TipoCuenta = form.TipoCuenta,
                    Cbucvu = form.Cbucvu,
                    Alias = form.Alias,
                    Cuitbancario = form.Cuitbancario,
                    Email = form.Email,
                    AfipMonotributista = form.AfipMonotributista,
                    AfipResponsableInscripto = form.AfipResponsableInscripto,
                    AfipExentoGanancia = form.AfipExentoGanancia,
                    AfipExentoIva = form.AfipExentoIva,
                    RentasIncripto = form.RentasIncripto,
                    RentasConvenioMultilateral = form.RentasConvenioMultilateral,
                    RentasExento = form.RentasExento,
                    NombreGestor = nombreGestor,
                    TipoModificacion = form.TipoModificacion,
                });
            }

            return Ok(fomularioModificacionConNombre);
        }
        [HttpPost("descargarformulariomodificar")]
        public async Task<IActionResult> DescargarFormularioModificar([FromBody] VMFormularioModificar vmformularioModificar)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vmformularioModificar.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmformularioModificar.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            var formularioModificacion = await _FormularioModificacionService.ListarFormulariosModificacionAsyncId((int)vmformularioModificar.Id);
            if (formularioModificacion == null)
            {
                return NotFound("No se encontraron formularios de modificación con ese ID.");
            }

            vmformularioModificar.AltaFirmada = formularioModificacion.AltaFirmada != null ? Convert.ToBase64String(formularioModificacion.AltaFirmada) : null;
            vmformularioModificar.CuponInicializacionTerminal1 = formularioModificacion.CuponInicializacionTerminal1 != null ? Convert.ToBase64String(formularioModificacion.CuponInicializacionTerminal1) : null;
            vmformularioModificar.ConstanciaCbucvu = formularioModificacion.ConstanciaCbucvu != null ? Convert.ToBase64String(formularioModificacion.ConstanciaCbucvu) : null;
            vmformularioModificar.ContanciaCbuCvu = formularioModificacion.ContanciaCbuCvu != null ? Convert.ToBase64String(formularioModificacion.ContanciaCbuCvu) : null;
            vmformularioModificar.Dni = formularioModificacion.Dni != null ? Convert.ToBase64String(formularioModificacion.Dni) : null;
            vmformularioModificar.DniDorso = formularioModificacion.Dnidorso != null ? Convert.ToBase64String(formularioModificacion.Dnidorso) : null;
            vmformularioModificar.CuponInicializacionTerminal2 = formularioModificacion.CuponInicializacionTerminal2 != null ? Convert.ToBase64String(formularioModificacion.CuponInicializacionTerminal2) : null;
            vmformularioModificar.ConstanciaRentas = formularioModificacion.ConstanciaRentas != null ? Convert.ToBase64String(formularioModificacion.ConstanciaRentas) : null;
            vmformularioModificar.TitularRazonSocial = formularioModificacion.TitularRazonSocial !=null ? Convert.ToBase64String(formularioModificacion.TitularRazonSocial) : null;
            return Ok(vmformularioModificar);
        }


        [HttpPost("formulariobajacrear")]
        public async Task<IActionResult> FormularioBajaCrear([FromBody] VMFormularioBaja vMFormularioBaja)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioBaja.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMFormularioBaja.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

          
            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            var fechaApertura = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);
            var NumeroTerminal = vMFormularioBaja.TerminalN;
            var NombreComercio = vMFormularioBaja.NombreComercio;

            var Observacion = vMFormularioBaja.Observacion;
            var RegistraOperacionesPendientes = !string.IsNullOrEmpty(vMFormularioBaja.RegistraOperacionesPendientes);
            var RegistraOperacionesConTarjetaNaranja = !string.IsNullOrEmpty(vMFormularioBaja.RegistraOperacionesConTarjetaNaranja);

            var AdjuntaCierreLote = !string.IsNullOrEmpty(vMFormularioBaja.AdjuntaCierreLote);

            var BajaFirmada = ConvertBase64String(vMFormularioBaja.BajaFirmada);
            var CuponInicializacionTerminal = ConvertBase64String(vMFormularioBaja.CuponInicializacionTerminal);
            var CierreLote = ConvertBase64String(vMFormularioBaja.CierreLote);
            var FotoTerminal = ConvertBase64String(vMFormularioBaja.FotoTerminal);
            var IdGestor = usuarioEncontrado.usuario.Id;

            var nuevoFormularioBaja = new FormularioBaja
            {
                NumeroTerminal = NumeroTerminal,
                FechaApertura = fechaApertura,
                IdGestor = IdGestor,
                NombreComercio = NombreComercio,
                Observacion = Observacion,
                RegistraOperacionesPendientes = RegistraOperacionesPendientes,
                RegistraOperacionesConTarjetaNaranja = RegistraOperacionesConTarjetaNaranja,
                AdjuntaCierreLote = AdjuntaCierreLote,
                BajaFirmada = BajaFirmada,
                CuponInicializacionTerminal = CuponInicializacionTerminal,
                CierreLote = CierreLote,
                FotoTerminal = FotoTerminal
            };

            await _formularioBajaService.CrearFormularioBajaAsync(nuevoFormularioBaja);


            if (usuarioEncontrado.usuario.TipoUsuario == 8)
            {
                var panelcontrolinterno = new PanelGestorInterno
                {
                    CanalAtencion = "FORMULARIO",
                    Tipo = "FORMULARIO BAJA",
                    Aliado = vMFormularioBaja.NombreComercio,
                    Motivo = "FORMULARIO BAJA",
                    Estado = "Cerrada",
                    FechaCarga = fechaApertura,
                    IdUser = usuarioEncontrado.usuario.Id,
                    Observaciones = "se creo un formulario de baja"
                };
                await _panelControlInterno.Crear(panelcontrolinterno);
            }

          
            return Ok("Comanda creada con éxito");
        }
        [HttpPost("EditarFomularioBaja")]
        public async Task<IActionResult> EditarFomularioBaja([FromBody] VMFormularioBaja vMFormularioBaja)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioBaja.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var formularioBaja = await _formularioBajaService.ListarFormulariosBajaAsyncporId((int)vMFormularioBaja.Id);
            if (formularioBaja == null)
            {
                return NotFound("Comanda no encontrada.");
            }

            if (vMFormularioBaja.TerminalN !=null)
                formularioBaja.NumeroTerminal = vMFormularioBaja.TerminalN;

            if (vMFormularioBaja.IdGestor.HasValue)
                formularioBaja.IdGestor = vMFormularioBaja.IdGestor;

            if (!string.IsNullOrEmpty(vMFormularioBaja.NombreComercio))
                formularioBaja.NombreComercio = vMFormularioBaja.NombreComercio;

            if (!string.IsNullOrEmpty(vMFormularioBaja.Observacion))
                formularioBaja.Observacion = vMFormularioBaja.Observacion;

            if (!string.IsNullOrEmpty(vMFormularioBaja.RegistraOperacionesPendientes))
                formularioBaja.RegistraOperacionesPendientes = vMFormularioBaja.RegistraOperacionesPendientes == "Sí";

            if (!string.IsNullOrEmpty(vMFormularioBaja.RegistraOperacionesConTarjetaNaranja))
                formularioBaja.RegistraOperacionesConTarjetaNaranja = vMFormularioBaja.RegistraOperacionesConTarjetaNaranja == "Sí";

            if (!string.IsNullOrEmpty(vMFormularioBaja.AdjuntaCierreLote))
                formularioBaja.AdjuntaCierreLote = vMFormularioBaja.AdjuntaCierreLote == "Sí";

            if (!string.IsNullOrEmpty(vMFormularioBaja.BajaFirmada))
                formularioBaja.BajaFirmada = Convert.FromBase64String(vMFormularioBaja.BajaFirmada);

            if (!string.IsNullOrEmpty(vMFormularioBaja.CuponInicializacionTerminal))
                formularioBaja.CuponInicializacionTerminal = Convert.FromBase64String(vMFormularioBaja.CuponInicializacionTerminal);

            if (!string.IsNullOrEmpty(vMFormularioBaja.CierreLote))
                formularioBaja.CierreLote = Convert.FromBase64String(vMFormularioBaja.CierreLote);

            if (!string.IsNullOrEmpty(vMFormularioBaja.FotoTerminal))
                formularioBaja.FotoTerminal = Convert.FromBase64String(vMFormularioBaja.FotoTerminal);

            await _formularioBajaService.EditarFormularioBajaAsync(formularioBaja);

            return Ok("Comanda actualizada con éxito.");
        }
        [HttpPost("ListarFormulariasBajaporId")]
        public async Task<IActionResult> ListarFormulariasBajaporId([FromBody] VMFormularioBaja vMFormularioBaja)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vMFormularioBaja.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

          
            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vMFormularioBaja.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            var FormularioBaja = await _formularioBajaService.ListarFormulariosBajaAsyncporId((int)vMFormularioBaja.Id);
            if (FormularioBaja == null)
            {
                return NotFound("No se encontraron FormularioAltas con ese ID.");
            }

            TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            DateTime fechaCierreArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

            var panelcontrolinterno = new PanelGestorInterno
            {
                CanalAtencion = "FORMULARIO",
                Tipo = "FORMULARIO BAJA",
                Aliado = vMFormularioBaja.NombreComercio,
                Motivo = "FORMULARIO BAJA EDITAR",
                Estado = "Cerrada",
                FechaCarga = fechaCierreArg,
                IdUser = usuarioEncontrado.usuario.Id,
                Observaciones = "se edito un formulario de baja"
            };
            await _panelControlInterno.Crear(panelcontrolinterno);
            return Ok(FormularioBaja);
        }
        [HttpGet("ListarTodosFormulariosBaja")]
        public async Task<IActionResult> ListarTodosFormulariosBaja()
        {
            var formularioBaja = await _formularioBajaService.ListarFormulariosBajaAsync();
            var fomularioBajaConNombre = new List<object>();

            foreach (var form in formularioBaja)
            {
                string? nombreGestor = null;

                if (form.IdGestor != null)
                {
                    var gestor = await _UsuarioZocoService.ObtenerPorId((int)form.IdGestor);
                    nombreGestor = gestor.Nombre;
                }

                fomularioBajaConNombre.Add(new
                {
                    Id = form.Id,
                    NumeroTerminal = form.NumeroTerminal,
                    FechaApertura = form.FechaApertura,
                    IdGestor = form.IdGestor,
                    NombreComercio = form.NombreComercio,
                    Observacion = form.Observacion,
                    RegistraOperacionesPendientes = form.RegistraOperacionesPendientes,
                    RegistraOperacionesConTarjetaNaranja = form.RegistraOperacionesConTarjetaNaranja,
                    AdjuntaCierreLote = form.AdjuntaCierreLote,
                    NombreGestor = nombreGestor
                });
            }

            return Ok(fomularioBajaConNombre);
        }
        [HttpPost("descargarformulariobaja")]
        public async Task<IActionResult> DescargarFormularioBaja([FromBody] VMFormularioBaja vmformulariobaja)
        {
            bool esTokenValido = await _TokenService.ValidarTokenAsync(vmformulariobaja.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var usuarioEncontrado = await _TokenService.ObtenerTokenYUsuarioPorUsuarioIdAsync(vmformulariobaja.token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }

            var formularioBaja = await _formularioBajaService.ListarFormulariosBajaAsyncporId((int)vmformulariobaja.Id);
            if (formularioBaja == null)
            {
                return NotFound("No se encontraron formularios de baja con ese ID.");
            }

            vmformulariobaja.BajaFirmada = formularioBaja.BajaFirmada != null ? Convert.ToBase64String(formularioBaja.BajaFirmada) : null;
            vmformulariobaja.CuponInicializacionTerminal = formularioBaja.CuponInicializacionTerminal != null ? Convert.ToBase64String(formularioBaja.CuponInicializacionTerminal) : null;
            vmformulariobaja.CierreLote = formularioBaja.CierreLote != null ? Convert.ToBase64String(formularioBaja.CierreLote) : null;
            vmformulariobaja.FotoTerminal = formularioBaja.FotoTerminal != null ? Convert.ToBase64String(formularioBaja.FotoTerminal) : null;

            return Ok(vmformulariobaja);
        }

    }
}
