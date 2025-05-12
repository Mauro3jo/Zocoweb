using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPuestoService
    {
        Task<Puesto> CrearBusquedaAsync(Puesto busqueda);
        Task<Puesto> EditarBusquedaAsync(Puesto busqueda);
        Task<bool> EliminarBusquedaAsync(int id);
        Task<IEnumerable<Puesto>> ListarBusquedasAsync();
        Task<IEnumerable<Puesto>> ListarBusquedasPorMesAsync(int mes);
        Task<Puesto> ObtenerPorId(int PuestoId);
        Task<List<Postulante>> Obtener();

    }
}
