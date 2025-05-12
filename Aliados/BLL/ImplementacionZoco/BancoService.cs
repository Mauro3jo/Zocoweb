using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class BancoService : IbancoService
    {
     
        private readonly IGenericRepository<Banco> _repobanco;

        public BancoService(IGenericRepository<Banco> repobanco)
        {
            _repobanco = repobanco;

        }
        public async Task<List<Banco>> Lista()
        {
            var bancosQueryable = await _repobanco.Consultar();
            return await bancosQueryable.ToListAsync();
        }
    }
}
