using AutoMapper;
using BLL.ImplementacionZoco;
using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProvinciaController : ControllerBase
    {
        private readonly ICalculadoraService _CalculadoraService;
        private readonly ITokenService _tokenService;
        private readonly IUsuarioZocoService _usuarioZocoService;

        private readonly IMapper _mapper;

        public ProvinciaController(IUsuarioZocoService usuarioZocoService, ICalculadoraService calculadoraService,
            ITokenService tokenService, IMapper mapper)
        {
            _CalculadoraService = calculadoraService;
            _usuarioZocoService = usuarioZocoService;
            _tokenService = tokenService;
            _mapper = mapper;
        }
        [HttpGet("listaprovincia")]
        public async Task<IActionResult> listaprovincia()
        {
            var listaprovincia = await _CalculadoraService.ListaIIBBProvincia();

            foreach (var provincia in listaprovincia)
            {
                if (decimal.TryParse(provincia.Alicuota.Replace("%", ""), NumberStyles.Any, new CultureInfo("es-AR"), out decimal alicuotaDecimal))
                {
                    provincia.Alicuota = (alicuotaDecimal / 100).ToString("0.###").Replace(".", ",");
                }
            }

            return Ok(listaprovincia);
        }


    }
}
