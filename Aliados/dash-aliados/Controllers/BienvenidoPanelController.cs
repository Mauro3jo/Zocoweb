using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BienvenidoPanelController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IMapper _mapper;

        public BienvenidoPanelController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
        }
        [HttpPost("bienvenidopanel")]
        public async Task<ActionResult> bienvenidopanel([FromBody] VMBienvenidopanel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                if (usuarioEncontrado.usuario.TipoUsuario != 0)
                {
                    return Ok();

                }
                var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);

               
                var fechaInicio = sas.Min(d => d.FechaDePago);

                
                var fechaFin = sas.Max(d => d.FechaDePago);

                var resultado = new
                {
                    Comercios = sas
                        .Where(d => !string.IsNullOrEmpty(d.NombreComercio))
                        .Select(d => d.NombreComercio)
                        .Distinct()
                        .OrderBy(n => n)
                        .ToList(),
                    FechaInicio = fechaInicio,
                    FechaFin = fechaFin
                };

                resultado.Comercios.Insert(0, "Todos");

                return Ok(resultado);
            }

            return BadRequest("Token es nulo o vacío");
        }


        private int GetWeekOfYear(DateTime date)
        {
            CultureInfo ci = CultureInfo.CurrentCulture;
            int weekNum = ci.Calendar.GetWeekOfYear(date, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Sunday);
            return weekNum;
        }


    }
}
