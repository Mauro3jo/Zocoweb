using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class BaseStockService : IBaseStockService
    {
        private readonly IGenericRepository<InicioAsesore> _repoAsesores;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IGenericRepository<BaseStock> _repoBaseStock;

        public BaseStockService(IGenericRepository<InicioAsesore> repoasesores, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<BaseStock> repoBaseStock)
        {
            _repoAsesores = repoasesores;
            _repoUsuario = repoUsuarios;
            _repoBaseStock = repoBaseStock;

        }

        public async Task<List<BaseStock>> DatosInicioAsesores(string NombreAsesor)
        {
            IQueryable<BaseStock> tbUsuario = await _repoBaseStock.Consultar(u => u.Asesor == NombreAsesor);


            return tbUsuario.ToList();
        }
    }
}
