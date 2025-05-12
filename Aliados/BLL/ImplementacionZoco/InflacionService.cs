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
    public class InflacionService : IInflacionService
    {
        private readonly IGenericRepository<BaseDashboard> _repoBaseDashBoard;
        private readonly IGenericRepository<Inflacion> _repoInflacion;
      

        public InflacionService( IGenericRepository<Inflacion> reposInflacion ,IGenericRepository<BaseDashboard> repobasedashboard)
        {
            _repoBaseDashBoard = repobasedashboard;
            _repoInflacion = reposInflacion;

        }

        public async Task<Inflacion> Crear(Inflacion entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            return await _repoInflacion.Crear(entidad);
        }

        public async Task<Inflacion> Editar(Inflacion entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var resultado = await _repoInflacion.Editar(entidad);
            if (resultado)
            {
                return entidad;
            }
            else
            {
                throw new InvalidOperationException("No se pudo editar la inflación.");
            }
        }

        public async Task<bool> Eliminar(int IdInflacion)
        {
            var inflacion = await _repoInflacion.Obtener(i => i.Id == IdInflacion);
            if (inflacion == null)
            {
                throw new InvalidOperationException("Inflación no encontrada.");
            }

            return await _repoInflacion.Eliminar(inflacion);
        }






     
        public async Task<List<Inflacion>> ObtenerPorRubro(string CuitAliado)
        {
            IQueryable<BaseDashboard> tbrubro = await _repoBaseDashBoard.Consultar(u => u.Cuit == Convert.ToDouble(CuitAliado));

            var rubrosUnicos = tbrubro.Select(r => r.Rubro).Distinct().ToList();

            var inflacionesCoincidentes = await _repoInflacion.Consultar(i => rubrosUnicos.Contains(i.Rubro) || i.Rubro == "Total");

            var inflacionesFiltradas = inflacionesCoincidentes
                .OrderByDescending(i => i.Fecha)
                .Select(i => new Inflacion
                {
                    Rubro = i.Rubro,
                    Fecha = i.Fecha,
                    Inflacion1 = i.Inflacion1,
                })
                .ToList();

            return inflacionesFiltradas;
        }





        async Task<List<Inflacion>> IInflacionService.Lista()
        {
            IQueryable<Inflacion> query = await _repoInflacion.Consultar();
            return query.ToList();
        }
    }
}
