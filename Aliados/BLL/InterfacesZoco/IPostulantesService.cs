using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPostulantesService
    {
        Task<Postulante> Crear(Postulante documento);
     
        Task<List<Postulante>> Obtener();
        Task<Postulante> ObtenerPorCredenciales(string correo, string clave);
        Task<Postulante> ObtenerPorId(int Id);

    }
}
