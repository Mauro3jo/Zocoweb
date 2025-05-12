using BLL.InterfacesZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RubroController : ControllerBase
    {
        private readonly IRubroService _RubroService;

        public RubroController(IRubroService RubroService)
        {
            _RubroService = RubroService;
        }

        [HttpGet("lista")]
        public async Task<ActionResult<List<Rubro>>> GetBancos()
        {
            var rubro = await _RubroService.Lista();
            return Ok(rubro);
        }
    }
}
