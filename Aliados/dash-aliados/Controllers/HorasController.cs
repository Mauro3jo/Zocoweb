using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HorasController : ControllerBase
    {
        private readonly IInicioAsesoresService _InicioAsesores;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IChechAsesores _chechAsesores;
        private readonly ICheckImagenService _checkimagenService; 
        private readonly IComandaService _comandaService;
        private readonly IMapper _mapper;

        public HorasController(IInicioAsesoresService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco, IChechAsesores chechAsesores, ICheckImagenService checkImagenService, IComandaService comandaService)
        {
            _InicioAsesores = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _chechAsesores = chechAsesores;
            _checkimagenService= checkImagenService;
            _comandaService = comandaService;
        }
        [HttpPost("horas")]
        public async Task<ActionResult> Horas([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }
            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            if (usuarioEncontrado.usuario == null)
            {
                return NotFound("Usuario no encontrado.");
            }
            var registros = await _chechAsesores.Listahoy(usuarioEncontrado.usuario.Id);
            var pendientes = await _comandaService.ListaComandasPorGestorPendientes(usuarioEncontrado.usuario.Id);
            var (totalRegistros, desaprobados) = await _checkimagenService.Listames(usuarioEncontrado.usuario.Id);

            List<Tuple<DateTime, DateTime?>> paresCheckInOut = new List<Tuple<DateTime, DateTime?>>();
            DateTime? ultimoCheckIn = null;

            foreach (var registro in registros)
            {
                if (registro.Tipo.Trim().ToLower() == "checkin")
                {
                    if (ultimoCheckIn == null)
                    {
                        ultimoCheckIn = DateTime.Parse(registro.FechaHora);
                    }
                }
                else if (registro.Tipo.Trim().ToLower() == "checkout")
                {
                    if (ultimoCheckIn != null)
                    {
                        paresCheckInOut.Add(new Tuple<DateTime, DateTime?>(ultimoCheckIn.Value, DateTime.Parse(registro.FechaHora)));
                        ultimoCheckIn = null;
                    }
                }
            }

            if (ultimoCheckIn != null)
            {
                var horaActualArgentina = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time"));
                paresCheckInOut.Add(new Tuple<DateTime, DateTime?>(ultimoCheckIn.Value, horaActualArgentina));
            }

            var horas = 0;
            foreach (var par in paresCheckInOut)
            {
                if (par.Item2.HasValue)
                {
                    horas += (int)(par.Item2.Value - par.Item1).TotalHours;
                }
            }

            var panel = new
            {
                horas,
                peticiones = pendientes?.Count() ?? 0,
                Completadas = totalRegistros,
                Desaprobados = desaprobados,
            };

            return Ok(panel);
        }




    }
}
