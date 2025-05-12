using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IReferidosService
    {
        Task<List<Referido>> ObtenerReferidos(int usuarioId); // Nuevo método
        Task<Referido> Crear(Referido referidos);
        Task EditarParaCierre(Referido referido);
        Task SubirComprobante(Referido referido);
        Task<Referido> ObtenerPorId(int Id);
    }
}
