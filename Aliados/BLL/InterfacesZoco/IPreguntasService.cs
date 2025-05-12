using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IPreguntasService
    {

        Task<Pregunta> Crear(Pregunta nuevaPregunta);


        Task<Pregunta> Editar(Pregunta preguntaEditada);

     
        Task<bool> Eliminar(int preguntaId);

      
        Task<List<Pregunta>> Obtener();


        Task<Pregunta> ObtenerPorId(int preguntaId);
        Task<List<Pregunta>> ObtenerPorIdCuestionarioId(int cuestionarioId);

    }
}
