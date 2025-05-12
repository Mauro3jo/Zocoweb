using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public  interface IRespuestasUsuariosService
    {
        Task<RespuestasUsuario> Crear(RespuestasUsuario nuevaRespuestasUsuario);


        Task<RespuestasUsuario> Editar(RespuestasUsuario preguntaRespuestasUsuario);


        Task<bool> Eliminar(int RespuestasUsuarioId);


        Task<List<RespuestasUsuario>> Obtener();
        Task<List<RespuestasUsuario>> Obtenerporcuestionarioyusuarioid(int postulanteid, int cuestionarioid);


        Task<RespuestasUsuario> ObtenerPorId(int RespuestasUsuarioId);
    }
}
