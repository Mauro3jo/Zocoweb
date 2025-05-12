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
    public class TicketCloverService : ITicketCloverService
    {
      
        private readonly IGenericRepository<TicketsClover> _ticketsClover;

        public TicketCloverService(IGenericRepository<TicketsClover> ticketsClover)
        {
          _ticketsClover = ticketsClover;

        }
        public async Task<TicketsClover> Crear(TicketsClover ticketsClover)
        {
            try
            {
                return await _ticketsClover.Crear(ticketsClover);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el ticketsClover", ex);
            }
        }

        public async Task<List<TicketsClover>> ObtenerListaQR()
        {
            try
            {
                var documentos = await _ticketsClover.Consultar();
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }
    }
}
