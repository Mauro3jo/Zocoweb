using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Features;
using Entity.VM;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FidelizacionController : ControllerBase
    {
        private readonly ITokenService _tokenservice;
        private readonly IUsuarioZocoService _usuarioService;
        private readonly IFidelizacionService _faidelizacionService;
        private readonly IBaseDashboardService _baseDashboardService;
        private readonly IAltaService _altaService;
        public FidelizacionController(ITokenService tok,IUsuarioZocoService usuarioservice, IFidelizacionService fidelizacionService,
            IBaseDashboardService baseDashboardService,IAltaService altaService )
        {
         
            _tokenservice = tok;
            _usuarioService = usuarioservice;
            _faidelizacionService = fidelizacionService;
            _baseDashboardService = baseDashboardService;
            _altaService = altaService;
        }
        [HttpPost("agregarfidelizacion")]
        public async Task<IActionResult> agregarfidelizacion([FromBody] VMFidelizacion request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                DateTime fechaAlta;

                if (!DateTime.TryParse(request.Fecha, out fechaAlta))
                {
                    return BadRequest("FechaAlta tiene un formato inválido.");
                }

               
                var fidelizacion = new Fidelizacion
                    {
                        Nterminal = request.Nterminal,
                        Cuit = request.Cuit,
                        Fecha = fechaAlta,
                        Baja = true,
                        Observacion = request.Observacion,

                };
                var fidelizacioncompleta = await _faidelizacionService.Crear(fidelizacion);
                return Ok();
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }
        [HttpPost("eliminarFidelizacion")]
        public async Task<IActionResult> eliminarFidelizacion([FromBody] VMFidelizacion request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var FidelizacionActual = await _faidelizacionService.ObtenerPorId((int)request.Id);

               var fidelizacionterminada = await _faidelizacionService.TerminarSeguimiento(FidelizacionActual);

                return Ok();
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }
        [HttpPost("agregarobservacion")]
        public async Task<IActionResult> agregarobervaciones([FromBody] VMFidelizacion request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (esTokenValido)
            {
                var FidelizacionActual = await _faidelizacionService.ObtenerPorId((int)request.Id);

                FidelizacionActual.Observacion = request.Observacion;

                var fidelizacionterminada = await _faidelizacionService.AgregarObservacion(FidelizacionActual);

                return Ok();
            }
            return Unauthorized("El token o el ID de la sesión no son válidos");

        }
        [HttpPost("listafidelizacion")]
        public async Task<IActionResult> listafidelizacion([FromBody] VMFidelizacion request)
        {
            // Validar el token
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            // Obtener la fecha inicial desde el request o usar la fecha actual
            DateTime fechaInicio;
            if (string.IsNullOrEmpty(request.Fecha))
            {
                fechaInicio = DateTime.Now;
            }
            else
            {
                try
                {
                    fechaInicio = DateTime.ParseExact(request.Fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture);
                }
                catch (FormatException)
                {
                    return BadRequest("Formato de fecha no válido");
                }
            }

            // Obtener la última fecha desde el servicio
            DateTime? fechaDesdeServicio = await _baseDashboardService.ObtenerUltimaFechaPorMesYAnio(fechaInicio);
            if (!fechaDesdeServicio.HasValue)
            {
                return BadRequest("No se pudo obtener la fecha desde el servicio");
            }

            // Obtener la lista completa de fidelización sin usar los filtros del request
            var listaFidelizacion = await _faidelizacionService.ObtenerListaFidelizacion();

            // Filtrar solo aquellos elementos donde el estado sea 'true'
            var listaFiltrada = listaFidelizacion.Where(f => f.Baja == true).ToList();

            // Preparar la lista para el resultado final
            var resultado = new List<object>();

            foreach (var item in listaFiltrada)
            {
                decimal totalFacturacion = 0;
                List<decimal> facturacionDiaria = new List<decimal>();
                List<string> fechasArray = new List<string>();
                int diasSinFacturarConsecutivos = 0;
                string estadoFacturacion;

                // Ajuste: Usar `item.Fecha` como fecha de inicio y `fechaDesdeServicio` como fecha final
                DateTime fechaInicioItem = item.Fecha ?? DateTime.Now;
                DateTime fechaFinal = fechaDesdeServicio.Value;
                int diasTotales = (fechaFinal - fechaInicioItem).Days + 1;

                // Obtener los datos de facturación diaria usando `item.Fecha` como inicio
                var datosDia = item.Cuit != null && item.Nterminal != null
                    ? await _baseDashboardService.DatosCuitPorFechaDiaria(item.Cuit, item.Nterminal, fechaInicioItem)
                    : new List<KeyValuePair<string, decimal>>();

                // Calcular la facturación diaria y total para el rango de fechas
                for (int i = 0; i < diasTotales; i++)
                {
                    var fechaActual = fechaInicioItem.AddDays(i);
                    var diaClave = fechaActual.ToString("dd/MM/yyyy");
                    fechasArray.Add(fechaActual.ToString("dd/MM/yyyy"));

                    var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
                    decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;

                    facturacionDiaria.Add(facturacionDia);
                    totalFacturacion += facturacionDia;

                    if (facturacionDia == 0)
                    {
                        diasSinFacturarConsecutivos++;
                    }
                    else
                    {
                        diasSinFacturarConsecutivos = 0;
                    }
                }

                // Determinar el estado de facturación
                decimal datosdias = diasTotales * 50000;
                if (diasSinFacturarConsecutivos > 2)
                {
                    estadoFacturacion = $"No factura hace {diasSinFacturarConsecutivos} días";
                }
                else if (totalFacturacion < datosdias)
                {
                    estadoFacturacion = "Baja facturación";
                }
                else if (facturacionDiaria.LastOrDefault() == 0)
                {
                    estadoFacturacion = "Activo (Hoy no facturó)";
                }
                else
                {
                    estadoFacturacion = "Activo";
                }
                var itemalta = await _altaService.ObtenerPorNroTerminal(item.Nterminal);
                // Crear el objeto con los datos finales
                var datosTerminal = new
                {
                    item.Id,
                    item.Nterminal,
                    item.Cuit,
                    item.Observacion,
                    itemalta.NombreDeFantasia,
                    Fecha = item.Fecha?.ToString("dd/MM/yyyy"),
                    item.Baja,
                    TiempoInactiva = estadoFacturacion,
                    Fechas = fechasArray,
                    FacturacionDiaria = facturacionDiaria,
                    FacturacionTotal = totalFacturacion
                };

                resultado.Add(datosTerminal);
            }

            return Ok(resultado);
        }



    }
}
