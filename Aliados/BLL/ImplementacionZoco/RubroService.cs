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
    public class RubroService : IRubroService
    {
        private readonly IGenericRepository<Rubro> _repoRubro;
        private readonly IMemoryCache _memoryCache;

        public RubroService(IGenericRepository<Rubro> repoRubro, IMemoryCache memoryCache)
        {
            _repoRubro = repoRubro;
            _memoryCache = memoryCache;
        }
        public async Task<List<Rubro>> Lista()
        {
            var rubroQueryable = await _repoRubro.Consultar();
            return await rubroQueryable.ToListAsync();
        }
    }
}
