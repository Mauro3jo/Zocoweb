using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IOrigenService
    {
        Task<Origen> ObtenerPorId(int IdUsuario);
        Task<List<Origen>> Lista();
        Task<Origen> CrearOrigen(Origen origen);


    }
}
