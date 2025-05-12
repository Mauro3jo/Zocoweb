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
    public class CalculadoraService : ICalculadoraService
    {
        private readonly IGenericRepository<ListaCuotum> _repoListaCuota;
        private readonly IGenericRepository<ListaIibbprovincium> _repoListaIIBBProvincia;
        private readonly IGenericRepository<ListaImpositiva> _repoListaImpositiva;
        private readonly IGenericRepository<ListaTasaPreferecial> _repoListaTasaPreferecial;


        private readonly IGenericRepository<Usuario> _repoUsuario;

        public CalculadoraService(IGenericRepository<ListaCuotum> RepoListaCuota, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<ListaIibbprovincium> repoListaIIBBProvincia, IGenericRepository<ListaImpositiva> repoListaImpositiva, IGenericRepository<ListaTasaPreferecial> repoListaTasaPreferecial)
        {
            _repoListaCuota = RepoListaCuota;
            _repoUsuario = repoUsuarios;
            _repoListaIIBBProvincia = repoListaIIBBProvincia;
            _repoListaImpositiva = repoListaImpositiva;
            _repoListaTasaPreferecial = repoListaTasaPreferecial;
        }
        public async Task<List<ListaCuotum>> ListaCuota()
        {
            IQueryable<ListaCuotum> query = await _repoListaCuota.Consultar();

            return await query.ToListAsync();
        }

        public async Task<List<ListaIibbprovincium>> ListaIIBBProvincia()
        {
            IQueryable<ListaIibbprovincium> query = await _repoListaIIBBProvincia.Consultar();

            return await query.ToListAsync();
        }

        public async Task<List<ListaImpositiva>> ListaImpositiva()
        {
            IQueryable<ListaImpositiva> query = await _repoListaImpositiva.Consultar();

            return await query.ToListAsync();
        }

        public async Task<List<ListaTasaPreferecial>> ListaPreferencial()
        {
            IQueryable<ListaTasaPreferecial> query = await _repoListaTasaPreferecial.Consultar();

            return await query.ToListAsync();
        }

        public async Task<ListaTasaPreferecial> ObtenerPreferencial(int usuarioId)
        {
            var ObtenerUsuario = await _repoListaTasaPreferecial.Obtener(b => b.UserId == usuarioId);
            return ObtenerUsuario;
        }
    }
}
