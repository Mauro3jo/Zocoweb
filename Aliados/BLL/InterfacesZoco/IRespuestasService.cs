using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IRespuestasService
    {
        Task<Respuesta> Crear(Respuesta nuevaRespuesta);


        Task<Respuesta> Editar(Respuesta RespuestaEditada);


        Task<bool> Eliminar(int RespuestaId);

        Task<bool> EliminarPorPreguntaId(int PreguntaIdId);

        Task<List<Respuesta>> Obtener();


        Task<Respuesta> ObtenerPorId(int RespuestaId);
        Task<List<Respuesta>> ObtenerPorIdPreguntaId(int preguntaid);

    }
}
