using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class DestinoService : IDestinoService
    {
        // Cambiamos de DestinoService a DestinoTerminal en el repositorio genérico
        private readonly IGenericRepository<DestinoTerminal> _repodestino;

        public DestinoService(IGenericRepository<DestinoTerminal> repodestino)
        {
            _repodestino = repodestino;
        }

        public async Task<DestinoTerminal> CrearDestino(DestinoTerminal destino)
        {
            try
            {
                return await _repodestino.Crear(destino);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el destino", ex);
            }
        }

        public async Task<List<DestinoTerminal>> Lista()
        {
            IQueryable<DestinoTerminal> query = await _repodestino.Consultar();
            return query.ToList();
        }

        public async Task<DestinoTerminal> ObtenerPorId(int IdUsuario)
        {
            IQueryable<DestinoTerminal> query = await _repodestino.Consultar(u => u.Id == IdUsuario);
            DestinoTerminal resultado = query.FirstOrDefault();
            return resultado;
        }
    }
}
