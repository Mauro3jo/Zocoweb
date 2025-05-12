using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IAptitudService
    {
        Task<Aptitud> Crear(Aptitud documento);

        Task<List<Aptitud>> ObtenerTodosAptitudPorPostulanteId(int PostulanteId); // Nuevo método
        Task<List<Aptitud>> ObtenerTodosAptitudPorEducacion(int EducacionId); // Nuevo método

    }
}
