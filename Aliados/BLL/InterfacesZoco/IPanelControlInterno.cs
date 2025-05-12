using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BLL.ImplementacionZoco.PanelGestorInternoService;

namespace BLL.InterfacesZoco
{
    public interface IPanelControlInterno
    {
        Task<PanelGestorInterno> Crear(PanelGestorInterno nuevodatopanel);
        Task<PanelGestorInterno> Editar(PanelGestorInterno nuevodatopanel);

        Task<IEnumerable<int?>> ListaUsuariosDiferentes(DateTime fecha);
        Task<DatosMesUsuarioResultado> datosmesusuario(DateTime fecha, int usuarioid);
        Task<List<PanelGestorInterno>> Obtenerdatosusuariopordia(int usuarioId,DateTime fecha); // Nuevo método

        Task<List<PanelGestorInterno>> ObtenerPorusuariId(int usuarioid); //ObtenerPorCuitGestor
        Task<List<PanelGestorInterno>> ObtenerPorIdAliado(int IdAliado, DateTime fecha);

    }
}
