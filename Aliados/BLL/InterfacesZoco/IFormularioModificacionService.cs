using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFormularioModificacionService
    {
        Task<FormularioModificacione> CrearFormularioModificacionesAsync(FormularioModificacione formularioModificacione);
        Task<FormularioModificacione> EditarFormularioModificacionesAsync(FormularioModificacione formularioModificacione);
        Task<List<FormularioModificacione>> ListarFormulariosModificacionesAsync();

        Task<FormularioModificacione> ListarFormulariosAModificacionesAsyncPordId(int id);
        Task<FormularioModificacione> ListarFormulariosModificacionAsyncId(int id);
        Task<FormularioModificacione> EditarFueUtilizado(int id);

    }
}
