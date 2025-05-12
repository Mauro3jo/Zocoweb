using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ITicketCloverService
    {
        Task<TicketsClover> Crear(TicketsClover ticketsClover);
        Task<List<TicketsClover>> ObtenerListaQR();

    }
}
