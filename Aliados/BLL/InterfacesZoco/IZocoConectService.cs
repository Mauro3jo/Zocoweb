using Entity.Zoco;
using Entity.VM;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IZocoConectService
    {
        Task<VMUsuarioConect> ObtenerPorCredencialesZocoConect(string cuit, string clave);
        Task<ZocoConect> ObtenerPorId(int Id);
        Task<ZocoConect> ObtenerPorIdUser(int Id);

        Task<ZocoConect> Crear(ZocoConect zocoConect);
        Task<List<ZocoConect>> ObtenerTodosZocoConect();

    }
}
