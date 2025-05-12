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
    public class PuestoService : IPuestoService
    {
        private readonly IGenericRepository<Puesto> _repoPuesto;

        public PuestoService(IGenericRepository<Puesto> repopuesto)
        {
            _repoPuesto = repopuesto;

        }

        public async Task<Puesto> CrearBusquedaAsync(Puesto puesto)
        {
            return await _repoPuesto.Crear(puesto);
        }
        public async Task<Puesto> EditarBusquedaAsync( Puesto Puesto)
        {

            var existente = await _repoPuesto.Obtener(b => b.Id == Puesto.Id);
            if (existente == null) throw new Exception("puestos no encontrada.");
            {
                existente.Nombre = Puesto.Nombre ?? existente.Nombre;
                existente.Requisitos = Puesto.Requisitos ?? existente.Requisitos;
                existente.PrincipalesTareas = Puesto.PrincipalesTareas ?? existente.PrincipalesTareas;
                existente.Ofrecemos = Puesto.Ofrecemos ?? existente.Ofrecemos;
                existente.Foto = Puesto.Foto ?? existente.Foto;
                await _repoPuesto.Editar(existente);

                return existente;
            }
        }


        public async Task<bool> EliminarBusquedaAsync(int id)
        {
            var puesto = await _repoPuesto.Obtener(b => b.Id == id);
            if (puesto == null) throw new Exception("puestos no encontrada para eliminar.");

            return await _repoPuesto.Eliminar(puesto);
        }

        public async Task<IEnumerable<Puesto>> ListarBusquedasAsync()
        {
            var puesto = await _repoPuesto.Consultar(p => (bool)p.EstaActivo);
            return puesto.ToList();

        }

        public Task<IEnumerable<Puesto>> ListarBusquedasPorMesAsync(int mes)
        {
            throw new NotImplementedException();
        }

        public Task<List<Postulante>> Obtener()
        {
            throw new NotImplementedException();
        }

        public async Task<Puesto> ObtenerPorId(int PuestoId)
        {
            return await _repoPuesto.Obtener(p => p.Id == PuestoId);
        }
    }
}
