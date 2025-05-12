using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPDFService
    {
        Task<DocumentosUsuario> CrearDocumentoUsuario(DocumentosUsuario documento);
        Task<IEnumerable<DocumentosUsuario>> ObtenerDocumentosPorUsuarioYFecha(int usuarioId, DateTime fecha);
        Task<bool> ExisteDocumentoEnFecha(int usuarioId, DateTime? fecha);
        Task<List<object>> ObtenerResumenDocumentosPorUltimosCincoDiasRegistrados();
        Task<List<DocumentosUsuario>> ObtenerListaPdf(DateTime fecha);
        Task<List<DocumentosUsuario>> ObtenerListaPdfPorCuit(DateTime fecha,string cuit, string Id);

    }
}
