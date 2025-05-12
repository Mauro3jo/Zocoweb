using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFidelizacionService
    {
        Task<Fidelizacion> Crear(Fidelizacion fidelizacion);
        Task<Fidelizacion> TerminarSeguimiento(Fidelizacion fidelizacion);
        Task<Fidelizacion> AgregarObservacion(Fidelizacion fidelizacion);

        Task<List<Fidelizacion>> ObtenerListaFidelizacion();
        Task<Fidelizacion> ObtenerPorId(int Id);

    }
}
