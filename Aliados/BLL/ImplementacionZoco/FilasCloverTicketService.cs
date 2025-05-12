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
    public class FilasCloverTicketService : IFilasCloverTicketService
    {
        private readonly IGenericRepository<FilasCloverTicket> _repoFilasCloverTicketService;

        public FilasCloverTicketService(IGenericRepository<FilasCloverTicket> repoFilasCloverTicketService)
        {
            _repoFilasCloverTicketService = repoFilasCloverTicketService;

        }
        public async Task<FilasCloverTicket> Crear(FilasCloverTicket QR)
        {
            try
            {
                return await _repoFilasCloverTicketService.Crear(QR);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el QR", ex);
            }
        }

        public async Task<List<FilasCloverTicket>> ObtenerListaTicket()
        {
            try
            {
                var documentos = await _repoFilasCloverTicketService.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los QR", ex);
            }
        }
    }
}
