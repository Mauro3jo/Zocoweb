using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IBajaService
    {
        Task<Baja> NuevaALta(Baja Baja);
        Task<Baja> ObtenerPorNroTerminal(string? NumeroTerminal);

        Task<Baja> ObtenerPorid(int? id);

        Task<List<Baja>> ObtenerCRMBaja();
        Task<bool> TerminalAlta(string? NumeroTerminal); 
        Task EditarAbm(Baja entidad);


    }
}
