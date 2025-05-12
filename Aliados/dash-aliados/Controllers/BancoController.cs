using AutoMapper;
using BLL.InterfacesZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Entity.Zoco;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BancoController : ControllerBase
    {
        private readonly IbancoService _bancoService;

        public BancoController(IbancoService bancoService)
        {
            _bancoService = bancoService;
        }

        [HttpGet("lista")]
        public async Task<ActionResult<List<Banco>>> GetBancos()
        {
            var bancos = await _bancoService.Lista();
            return Ok(bancos);
        }
    }
}
