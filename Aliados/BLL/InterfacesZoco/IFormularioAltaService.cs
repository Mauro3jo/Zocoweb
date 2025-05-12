using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFormularioAltaService
    {
        Task<FormularioAlta> CrearFormularioAltaAsync(FormularioAlta formularioAlta);
        Task<FormularioAlta> EditarFormularioAltaAsync(FormularioAlta formularioAlta);
        Task<List<FormularioAlta>> ListarFormulariosAltasAsync();

        Task<FormularioAlta> ListarFormulariosAltaAsyncId(int id);

        Task<FormularioAlta> EditarFueUtilizado(int id);
    }
}
