using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICargosAnteriores
    {
        Task<CargosAnteriore> Crear(CargosAnteriore cargosAnteriore);
      
        Task<List<CargosAnteriore>> ObtenerTodosPor(int PostulanteId); // Nuevo método
    }
}
