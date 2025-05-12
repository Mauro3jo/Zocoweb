using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IReferenciaService
    {
        Task<Referencia> Crear(Referencia cargosAnteriore);

        Task<List<Referencia>> ObtenerTodosPor(int PostulanteId); // Nuevo método
    }
}
