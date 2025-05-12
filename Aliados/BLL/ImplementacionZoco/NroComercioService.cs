using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class NroComercioService : INroComercioService
    {
        private readonly IGenericRepository<NroComercio> _repoComercio;
        private readonly IMemoryCache _memoryCache;

        public NroComercioService(IGenericRepository<NroComercio> repoComercio, IMemoryCache memoryCache)
        {
            _repoComercio = repoComercio;
            _memoryCache = memoryCache;
        }

        public async Task<List<NroComercio>> Lista()
        {
            var comercioqueryable = await _repoComercio.Consultar();
            return await comercioqueryable.ToListAsync();
        }
    }
}
