using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICuestionarioPostulane
    {
        Task<PostulanteCuestionario> Crear(PostulanteCuestionario nuevaPostulanteCuestionario);


        Task<PostulanteCuestionario> Editar(PostulanteCuestionario PostulanteCuestionarioEditada);


        Task<bool> Eliminar(int PostulanteCuestionarioId);


        Task<List<PostulanteCuestionario>> Obtener();


        Task<PostulanteCuestionario> ObtenerPorId(int PostulanteCuestionarioId);
        Task<PostulanteCuestionario> ObtenerPorIdcuestionario(int PostulanteCuestionarioId);

        Task<List<PostulanteCuestionario>> ObtenerPostulacionesPorPostulanteIdAsync(int postulanteId);
        //Task<List<PostulanteCuestionario>> ObtenerPostulacionesPorPostulanteIdYPuestoIdAsync(int postulanteId,int IdCuestionarios);


    }
}
