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
    public class FidelizacionService : IFidelizacionService
    {
        private readonly IGenericRepository<Fidelizacion> _repoFidelizacion;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public FidelizacionService(IGenericRepository<Fidelizacion> repoaFidelicacion, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoFidelizacion = repoaFidelicacion;
            _repoUsuario = repoUsuarios;

        }

        public async Task<Fidelizacion> AgregarObservacion(Fidelizacion fidelizacion)
        {
            if (fidelizacion == null)
            {
                throw new ArgumentNullException(nameof(fidelizacion));
            }

            var fidelizacionencontrada = await _repoFidelizacion.Obtener(a => a.Id == fidelizacion.Id);
            if (fidelizacionencontrada == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            fidelizacionencontrada.Observacion = fidelizacion.Observacion;

            await _repoFidelizacion.Editar(fidelizacionencontrada);
            return fidelizacionencontrada;
        }

        public async Task<Fidelizacion> Crear(Fidelizacion fidelizacion)
        {
            try
            {
                return await _repoFidelizacion.Crear(fidelizacion);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el seguimiento", ex);
            }
        }

        public async Task<List<Fidelizacion>> ObtenerListaFidelizacion()
        {
            try
            {
                var fidelizacion = await _repoFidelizacion.Consultar();

                return await fidelizacion.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todas los seguimientos", ex);
            }
        }

        public async Task<Fidelizacion> ObtenerPorId(int Id)
        {
            IQueryable<Fidelizacion> query = await _repoFidelizacion.Consultar(u => u.Id == Id);

            Fidelizacion resultado = query.FirstOrDefault();

            return resultado;
        }

        public async Task<Fidelizacion> TerminarSeguimiento(Fidelizacion fidelizacion)
        {
            if (fidelizacion == null)
            {
                throw new ArgumentNullException(nameof(fidelizacion));
            }

            var fidelizacionencontrada = await _repoFidelizacion.Obtener(a => a.Id == fidelizacion.Id);
            if (fidelizacionencontrada == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            fidelizacionencontrada.Baja = false;
        
            await _repoFidelizacion.Editar(fidelizacionencontrada);
            return fidelizacionencontrada;
        }
    }
}
