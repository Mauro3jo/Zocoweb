using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class RespuestaUsuarioService : IRespuestasUsuariosService
    {
        private readonly IGenericRepository<RespuestasUsuario> _repoRespuestaUsuario;

        public RespuestaUsuarioService(IGenericRepository<RespuestasUsuario> repoRespuestaUsuario)
        {
            _repoRespuestaUsuario = repoRespuestaUsuario;
        }
        public async Task<RespuestasUsuario> Crear(RespuestasUsuario nuevaRespuestasUsuario)
        {
            if (nuevaRespuestasUsuario == null)
                throw new ArgumentNullException(nameof(nuevaRespuestasUsuario), "La respuesta no puede ser nula.");

            return await _repoRespuestaUsuario.Crear(nuevaRespuestasUsuario);
        }

        public Task<RespuestasUsuario> Editar(RespuestasUsuario preguntaRespuestasUsuario)
        {
            throw new NotImplementedException();
        }

        public Task<bool> Eliminar(int RespuestasUsuarioId)
        {
            throw new NotImplementedException();
        }

        public Task<List<RespuestasUsuario>> Obtener()
        {
            throw new NotImplementedException();
        }

        public async Task<List<RespuestasUsuario>> Obtenerporcuestionarioyusuarioid(int postulanteid, int cuestionarioid)
        {
            return await _repoRespuestaUsuario.ConsultarListaAsync(r =>
                r.IdPostulante == postulanteid && r.IdPreguntaNavigation.IdCuestionario == cuestionarioid);
        }


        public Task<RespuestasUsuario> ObtenerPorId(int RespuestasUsuarioId)
        {
            throw new NotImplementedException();
        }
    }
}
