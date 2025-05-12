using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPostulantePuestoService
    {
        Task<PostulantePuesto> Crear(PostulantePuesto nuevaPostulantePuesto);


        Task<PostulantePuesto> Editar(PostulantePuesto EditarPostulantePuesto);


        Task<bool> Eliminar(int PostulantePuestoId);


        Task<List<PostulantePuesto>> Obtener();


        Task<PostulantePuesto> ObtenerPorId(int PostulantePuestoId);
        Task<List<PostulantePuesto>> ObtenerPostulacionesPorPostulanteIdAsync(int postulanteId);
        Task<List<PostulantePuesto>> ObtenerPostulacionesPorPuestoIdAsync(int puestoId);


    }
}
