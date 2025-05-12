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
    public class ComercioService : IComercioService
    {
        private readonly IGenericRepository<Comercio> _repoComercio;
        private readonly IGenericRepository<NroComercio> _repoNroComercio;

        private readonly IMemoryCache _memoryCache;

        public ComercioService(IGenericRepository<Comercio> repoComercio, IMemoryCache memoryCache, IGenericRepository<NroComercio> repoNroComercio)
        {
            _repoComercio = repoComercio;
            _memoryCache = memoryCache;
            _repoNroComercio = repoNroComercio;
        }

        public async Task<NroComercio> CrearLegao(NroComercio comercio)
        {
            try
            {
                return await _repoNroComercio.Crear(comercio);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el comercio", ex);
            }
        }

     
        public async Task<List<Comercio>> Lista()
        {
            var comercioqueryable = await _repoComercio.Consultar();
            return await comercioqueryable.ToListAsync();
        }
    }
}
