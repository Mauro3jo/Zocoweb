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
    public class RespuestasService : IRespuestasService
    {
        private readonly IGenericRepository<Respuesta> _repoRespuesta;

        public RespuestasService(IGenericRepository<Respuesta> repoRespuesta)
        {
            _repoRespuesta = repoRespuesta;
        }

        // Crear respuesta
        public async Task<Respuesta> Crear(Respuesta nuevaRespuesta)
        {
            if (nuevaRespuesta == null)
                throw new ArgumentNullException(nameof(nuevaRespuesta), "La respuesta no puede ser nula.");

            return await _repoRespuesta.Crear(nuevaRespuesta);
        }

        // Editar respuesta
        public async Task<Respuesta> Editar(Respuesta respuestaEditada)
        {
            if (respuestaEditada == null)
                throw new ArgumentNullException(nameof(respuestaEditada), "La respuesta no puede ser nula.");

            var respuestaExistente = await _repoRespuesta.Obtener(r => r.Id == respuestaEditada.Id);
            if (respuestaExistente == null)
                throw new KeyNotFoundException("No se encontró la respuesta a editar.");

            await _repoRespuesta.Editar(respuestaEditada);
            return respuestaEditada;
        }

        // Eliminar respuesta
        public async Task<bool> Eliminar(int respuestaId)
        {
            var respuesta = await _repoRespuesta.Obtener(r => r.Id == respuestaId);
            if (respuesta == null)
                throw new KeyNotFoundException("No se encontró la respuesta a eliminar.");

            return await _repoRespuesta.Eliminar(respuesta);
        }

        public async Task<bool> EliminarPorPreguntaId(int preguntaId)
        {
            var respuestas = await _repoRespuesta.ConsultarListaAsync(r => r.IdPregunta == preguntaId); // 🔹 Ahora funciona sin errores

            if (respuestas == null || !respuestas.Any())
                return false; // No hay respuestas, retorna false sin error

            await _repoRespuesta.EliminarRango(respuestas); // 🔹 Eliminamos todas las respuestas en un solo paso
            return true;
        }




        // Obtener todas las respuestas
        public async Task<List<Respuesta>> Obtener()
        {
            var consulta = await _repoRespuesta.Consultar();
            return consulta.ToList();
        }

        // Obtener respuesta por ID
        public async Task<Respuesta> ObtenerPorId(int respuestaId)
        {
            return await _repoRespuesta.Obtener(r => r.Id == respuestaId);
        }

        public async Task<List<Respuesta>> ObtenerPorIdPreguntaId(int preguntaid)
        {
            var consulta = await _repoRespuesta.Consultar(p => p.IdPregunta == preguntaid);
            return consulta.ToList();
        }
    }

}
