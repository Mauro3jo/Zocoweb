using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IBusquedaService
    {
        Task<Busqueda> CrearBusquedaAsync(Busqueda busqueda);
        // Task<Busqueda> EditarBusquedaAsync(int id, Busqueda busqueda);
        Task<Busqueda> EditarBusquedaAsync(Busqueda busqueda);
        Task<bool> EliminarBusquedaAsync(int? id);
        Task<IEnumerable<Busqueda>> ListarBusquedasAsync();
        Task<IEnumerable<Busqueda>> ListarBusquedasPorMesAsync(int mes);
        Task<object> ObtenerSumatoriaORegistroEspecifico(int? id);
        Task<Busqueda> ObtenerBusqueda(int? id);
    }
}
