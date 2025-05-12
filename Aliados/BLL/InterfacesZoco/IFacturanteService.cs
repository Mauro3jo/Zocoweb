using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFacturanteService
    {
        Task<Facturante> CrearDocumentoFacturanteUsuario(Facturante documento);
        Task<IEnumerable<Facturante>> ObtenerDocumentosFacturantePorUsuarioYFecha(int usuarioId, DateTime fecha);
        Task<bool> ExisteDocumentoEnFechaFacturante(int usuarioId, DateTime? fecha);
        Task<List<object>> ObtenerResumenDocumentosFacturantePorUltimosCincoDiasRegistrados();
        Task<List<Facturante>> ObtenerTodosLosDocumentosFacturante(); // Nuevo método

        Task<List<Facturante>> ObtenerTodosLosDocumentosPorUsuario(int usuarioId); // Nuevo método


    }
}
