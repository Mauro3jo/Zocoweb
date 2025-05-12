using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IFormularioBajaService
    {
        Task<FormularioBaja> CrearFormularioBajaAsync(FormularioBaja formularioBaja);
        Task<FormularioBaja> EditarFormularioBajaAsync(FormularioBaja formularioBaja);
        Task<List<FormularioBaja>> ListarFormulariosBajaAsync();

        Task<FormularioBaja> ListarFormulariosBajaAsyncporId(int id); 
        Task<FormularioBaja> EditarFueUtilizado(int id);


    }
}
