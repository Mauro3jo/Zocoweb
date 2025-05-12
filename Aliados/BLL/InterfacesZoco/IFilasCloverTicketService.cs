using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFilasCloverTicketService
    {
        Task<FilasCloverTicket> Crear(FilasCloverTicket QR);
        Task<List<FilasCloverTicket>> ObtenerListaTicket();
    }
}
