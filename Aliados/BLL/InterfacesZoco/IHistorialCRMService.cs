using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IHistorialCRMService
    {
        Task<HistorialCrm> AgregarHistorialAlta(int IdUsuario,int IdAlta, string? observaciones);
        Task<HistorialCrm> AgregarHistorialAltaCCTT(int IdUsuario, int IdAlta, string? observaciones);

        Task<HistorialCrm> AgregarHistorialBaja(int IdUsuario, int IdAlta, string? observaciones, int IdBaja);

        Task<HistorialCrm> AgregarHistorialModificacion(int IdUsuario, int IdAlta, string? observaciones);
        Task<HistorialCrm> AgregarHistorialModificacionBaja(int IdUsuario, int IdAlta, string? observaciones);

        Task<HistorialCrm> AgregarHistorialSSTT(int IdUsuario, int IdAlta, string? observaciones);
        Task<List<HistorialCrm>> ObtenerHistorialCRM();
        Task<List<HistorialCrm>> ObtenerHistorialPorTerminal(int IdTerminal);
        Task<HistorialCrm> Crear(HistorialCrm historialcrm);


    }
}
