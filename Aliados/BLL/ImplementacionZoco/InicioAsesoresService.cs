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
    public class InicioAsesoresService : IInicioAsesoresService
    {
        private readonly IGenericRepository<InicioAsesore> _repoAsesores;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IGenericRepository<Comentario> _comentario;    

        public InicioAsesoresService(IGenericRepository<InicioAsesore> repoasesores, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<Comentario> comentario)
        {
            _repoAsesores = repoasesores;
            _repoUsuario = repoUsuarios;
            _comentario = comentario;
        }
        public async Task<List<InicioAsesore>> DatosInicioAsesores(string CuitAsesores)
        {
            IQueryable<InicioAsesore> tbUsuario = await _repoAsesores.Consultar(u => u.CuitCuil == Convert.ToDouble(CuitAsesores));

      
            return tbUsuario.ToList();
        }

        public async Task<List<InicioAsesore>> ListaAsesores()
        {
            IQueryable<InicioAsesore> query = await _repoAsesores.Consultar();
            return query.ToList();
        }
    }
}
