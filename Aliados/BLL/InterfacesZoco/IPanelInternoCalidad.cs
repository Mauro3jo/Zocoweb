using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPanelInternoCalidad
    {
        Task<PanelCalidadInterno> Crear(PanelCalidadInterno nuevodatopanel);
        Task<IEnumerable<int?>> ListaUsuariosDiferentes(DateTime fecha);
        Task<PanelCalidadInterno> datosmesusuario(DateTime fecha, int usuarioid);
        Task<List<PanelCalidadInterno>> Obtenerdatosusuariopordia(int usuarioId, DateTime fecha);

        // Métodos adicionales para soporte de la funcionalidad de edición
        Task<PanelCalidadInterno> ObtenerPorId(int id); // Obtener un registro por su ID
        Task Actualizar(PanelCalidadInterno panelActualizado); // Método para actualizar un registro
    }
}
