using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IComercioService
    {
        Task<List<Comercio>> Lista();
        Task<NroComercio> CrearLegao(NroComercio comercio);

    }
}
