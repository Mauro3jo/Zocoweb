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
    public class AnalisisService : IAnalisisService
    {
        private readonly IGenericRepository<InicioAsesore> _repoAsesores;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IGenericRepository<Analisi> _repoAnalisi;

        public AnalisisService(IGenericRepository<InicioAsesore> repoasesores, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<Analisi> Analisi)
        {
            _repoAsesores = repoasesores;
            _repoUsuario = repoUsuarios;
            _repoAnalisi = Analisi;

        }

        public async Task<List<Analisi>> DatosInicioAsesores(string NombreAsesor)
        {
            IQueryable<Analisi> tbUsuario = await _repoAnalisi.Consultar(u => u.Asesor == NombreAsesor);


            return tbUsuario.ToList();
        }
    
    }
}
