using BLL.InterfacesZoco;
using DAL.DBContext;
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
    public class LegajoService : ILegajoService
    {
        private readonly IGenericRepository<Legajo> _repolegajo;
        private readonly IMemoryCache _memoryCache;

        public LegajoService(IGenericRepository<Legajo> repoLegajo, IMemoryCache memoryCache)
        {
            _repolegajo = repoLegajo;
            _memoryCache = memoryCache;
        }

        public async Task<Legajo> CrearLegao(Legajo Legajo)
        {
            try
            {
                return await _repolegajo.Crear(Legajo);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<List<Legajo>> Lista()
        {
            var legajo = await _repolegajo.Consultar();
            return await legajo.ToListAsync();
        }

        public async Task<List<Legajo>> Listausuario(int iduser)
        {
            // Consultar todos los registros de Legajo donde iduser sea igual al proporcionado
            var legajos = await _repolegajo.Consultar(l => l.Iduser == iduser);
            return legajos.ToList(); // Convertir a lista
        }

        public async Task<Legajo> Listaultimo()
        {
            try
            {
                // Obtener todos los legajos usando el método Consultar
                var legajos = await _repolegajo.Consultar();

                // Ordenar los legajos por Id de forma descendente y tomar el primero
                var ultimoLegajo = legajos.OrderByDescending(l => l.Id).FirstOrDefault();

                return ultimoLegajo;
            }
            catch (Exception ex)
            {
                // Manejo del error, podría incluir logging o throw para que sea manejado en un nivel superior
                throw new Exception("Error al obtener el último legajo", ex);
            }
        }

        public async Task<Legajo> ObtenerPorId(int idlegajo)
        {
            IQueryable<Legajo> query = await _repolegajo.Consultar(u => u.Id == idlegajo);

            Legajo resultado = query.FirstOrDefault();

            return resultado;
        }
    }
}
