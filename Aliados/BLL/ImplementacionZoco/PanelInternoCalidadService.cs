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
    public class PanelInternoCalidadService : IPanelInternoCalidad
    {
        private readonly IGenericRepository<PanelCalidadInterno> _repoPanelGestorInterno;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public PanelInternoCalidadService(IGenericRepository<PanelCalidadInterno> repopanelinterno, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoPanelGestorInterno = repopanelinterno;
            _repoUsuario = repoUsuarios;

        }

        public async Task<PanelCalidadInterno> Crear(PanelCalidadInterno nuevodatopanel)
        {
            try
            {
                return await _repoPanelGestorInterno.Crear(nuevodatopanel);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public Task<PanelCalidadInterno> datosmesusuario(DateTime fecha, int usuarioid)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<int?>> ListaUsuariosDiferentes(DateTime fecha)
        {
            var month = fecha.Month;
            var year = fecha.Year;

            // Espera a que la tarea de consultar se complete y obtén el IQueryable resultante
            var query = await _repoPanelGestorInterno.Consultar(p => p.IdUser.HasValue && p.FechaCarga.HasValue && p.FechaCarga.Value.Month == month && p.FechaCarga.Value.Year == year);

            // Aplica las operaciones de consulta sobre el IQueryable resultante
            var distinctUserIds = query
                .Select(p => p.IdUser)
                .Distinct();

            return await distinctUserIds.ToListAsync();
        }

        public async Task<List<PanelCalidadInterno>> Obtenerdatosusuariopordia(int usuarioId, DateTime fecha)
        {
            // Definir el inicio y fin del día
            DateTime inicioDelDia = fecha.Date; // Esto te da la fecha con la hora 00:00:00
            DateTime finDelDia = fecha.Date.AddDays(1).AddTicks(-1); // Esto te da la fecha con la hora 23:59:59

            // Consultar los datos dentro del rango del día, ignorando la hora
            var query = await _repoPanelGestorInterno.Consultar(p =>
                p.FechaCarga >= inicioDelDia &&
                p.FechaCarga <= finDelDia);

            // Ordenar los resultados por la hora de forma descendente para que el más reciente esté primero
            var resultadosOrdenados = query.OrderByDescending(p => p.FechaCarga).ToList();

            return resultadosOrdenados;
        }

        // Obtener un registro por ID
        public async Task<PanelCalidadInterno> ObtenerPorId(int id)
        {
            try
            {
                return await _repoPanelGestorInterno.Obtener(p => p.Id == id);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el registro por ID", ex);
            }
        }

        // Actualizar un registro existente
        public async Task Actualizar(PanelCalidadInterno panelActualizado)
        {
            try
            {
                bool result = await _repoPanelGestorInterno.Editar(panelActualizado);
                if (!result)
                {
                    throw new Exception("Error al actualizar el registro");
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error al actualizar el documento", ex);
            }
        }
    }
}
