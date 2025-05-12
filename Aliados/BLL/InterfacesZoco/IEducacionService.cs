using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IEducacionService
    {
        Task<Educacion> Crear(Educacion documento);
    
        Task<List<Educacion>> ObtenerTodosEducacionPorPostulanteId(int PostulanteId); // Nuevo método
    }
}
