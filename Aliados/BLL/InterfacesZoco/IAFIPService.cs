using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IAFIPService
    {
        Task<Afip> CrearDocumentoAFIPUsuario(Afip documento);
        Task<IEnumerable<Afip>> ObtenerDocumentosAFIPPorUsuarioYFecha(int usuarioId, DateTime fecha);
        Task<bool> ExisteDocumentoEnFechaAFIP(int usuarioId, DateTime? fecha);
        Task<List<object>> ObtenerResumenDocumentosAFIPPorUltimosCincoDiasRegistrados();
        Task<List<Afip>> ObtenerTodosLosDocumentosAFIP();
        Task<List<Afip>> ObtenerTodosLosDocumentosPorUsuario(int usuarioId); // Nuevo método

    }
}
