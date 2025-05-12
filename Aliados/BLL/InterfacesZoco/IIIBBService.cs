using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IIIBBService
    {
        Task<Iibb> CrearDocumentoAFIPUsuario(Iibb documento);
        Task<IEnumerable<Iibb>> ObtenerDocumentosAFIPPorUsuarioYFecha(int usuarioId, DateTime fecha);
        Task<bool> ExisteDocumentoEnFechaAFIP(int usuarioId, DateTime? fecha);
        Task<List<object>> ObtenerResumenDocumentosAFIPPorUltimosCincoDiasRegistrados();
        Task<List<Iibb>> ObtenerTodosLosDocumentosAFIP(); // Nuevo método
        Task<List<Iibb>> ObtenerTodosLosDocumentosPorUsuario(int usuarioId); // Nuevo método


    }
}
