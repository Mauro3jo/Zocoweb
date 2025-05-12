using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICloverService
    {
        Task<Clover> CrearNuevaClover(Clover Clover);
        Task<List<Clover>> ListarClover();
    }
}
