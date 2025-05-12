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
    public class OrigenService : IOrigenService
    {
        private readonly IGenericRepository<Origen> _repoorigen;

        public OrigenService(IGenericRepository<Origen> repoorigen)
        {
            _repoorigen = repoorigen;
        }

        public async Task<Origen> CrearOrigen(Origen origen)
        {
            try
            {
                return await _repoorigen.Crear(origen);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el origen", ex);
            }
        }

        public async Task<List<Origen>> Lista()
        {
            IQueryable<Origen> query = await _repoorigen.Consultar();
            return query.ToList();
        }
      
        public async Task<Origen> ObtenerPorId(int IdUsuario)
        {
            IQueryable<Origen> query = await _repoorigen.Consultar(u => u.Id == IdUsuario);

            Origen resultado = query.FirstOrDefault();

            return resultado;
        }
    }
}
