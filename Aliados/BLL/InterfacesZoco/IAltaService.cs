using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IAltaService
    {
        Task<Alta> NuevaALta(Alta Alta);
        Task<Alta> ObtenerPorNroTerminal(string? NumeroTerminal);
        
        Task<List<Alta>> ObtenerCRM();
        Task<List<string>> ObtenerAliadosCRM();
        Task<List<string>> ObtenerComerciosCRM();

        Task<bool> TerminalBaja(string? NumeroTerminal);
        Task<Alta> Editar(Alta entidad);
        Task<Alta> EditarNull(int alta);
        Task<bool> EditarSimple(int altaId, DateTime FechaBaja); // Nuevo método agregado EditarparaAlta EditarSimpleServicioTecnico
        Task<bool> EditarSimpleServicioTecnico(int altaId);
        Task<bool> EditarSimpleAltaClover(int altaId, double numeroterminal );

        Task<Alta> EditarAltaModificar(Alta entidad);
        Task<Alta> EditarparaAlta(Alta entidad, int Id);
        Task EditarAbm(Alta entidad);
        Task<Alta> ObtenerPorId(int Idalta);
        Task<bool> EditarDestinoUOrigen(string Tipo, string Provincia, int altaid);

        Task<List<Alta>> ObtenerTerminalesPorCuit(string Cuit); // Nuevo método


    }
}
