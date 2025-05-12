using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IDestinoService
    {
        Task<DestinoTerminal> ObtenerPorId(int IdUsuario);
        Task<List<DestinoTerminal>> Lista();
        Task<DestinoTerminal> CrearDestino(DestinoTerminal destino);

    }
}
