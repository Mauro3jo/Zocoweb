using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IContratadoService
    {
        Task<Contratado> CrearBusquedaAsync(Contratado busqueda);
        Task<Contratado> EditarBusquedaAsync(int id, Contratado busqueda);
        Task<bool> EliminarBusquedaAsync(int id);
        Task<IEnumerable<Contratado>> ListarBusquedasAsync();
        Task<IEnumerable<Contratado>> ListarBusquedasPorMesAsync(int mes);
        Task<Contratado> Obtenercontratados(int? id);

    }
}
