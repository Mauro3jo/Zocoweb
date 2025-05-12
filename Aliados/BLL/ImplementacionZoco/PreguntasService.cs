using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class PreguntasService : IPreguntasService
    {
        private readonly IGenericRepository<Pregunta> _repoPregunta;

        public PreguntasService(IGenericRepository<Pregunta> repoPregunta)
        {
            _repoPregunta = repoPregunta;
        }

       
        public async Task<Pregunta> Crear(Pregunta nuevaPregunta)
        {
            if (nuevaPregunta == null)
                throw new ArgumentNullException(nameof(nuevaPregunta), "La pregunta no puede ser nula.");

            return await _repoPregunta.Crear(nuevaPregunta);
        }


        public async Task<Pregunta> Editar(Pregunta preguntaEditada)
        {
            if (preguntaEditada == null)
                throw new ArgumentNullException(nameof(preguntaEditada), "La pregunta no puede ser nula.");

            var preguntaExistente = await _repoPregunta.Obtener(p => p.Id == preguntaEditada.Id);
            if (preguntaExistente == null)
                throw new KeyNotFoundException("No se encontró la pregunta a editar.");

            // Actualiza solo los campos necesarios
            preguntaExistente.IdCuestionario = preguntaEditada.IdCuestionario;
            preguntaExistente.TextoPregunta = preguntaEditada.TextoPregunta;
            preguntaExistente.TipoRespuesta = preguntaEditada.TipoRespuesta;
            preguntaExistente.TiempoRespuesta = preguntaEditada.TiempoRespuesta;

            await _repoPregunta.Editar(preguntaExistente);
            return preguntaExistente;
        }



        public async Task<bool> Eliminar(int preguntaId)
        {
            var pregunta = await _repoPregunta.Obtener(p => p.Id == preguntaId);
            if (pregunta == null)
                throw new KeyNotFoundException("No se encontró la pregunta a eliminar.");

            return await _repoPregunta.Eliminar(pregunta);
        }


        public async Task<List<Pregunta>> Obtener()
        {
            var consulta = await _repoPregunta.Consultar();
            return consulta.ToList();
        }

        public async Task<Pregunta> ObtenerPorId(int preguntaId)
        {
            return await _repoPregunta.Obtener(p => p.Id == preguntaId);
        }

        public async Task<List<Pregunta>> ObtenerPorIdCuestionarioId(int cuestionarioId)
        {
            var consulta = await _repoPregunta.Consultar(p => p.IdCuestionario == cuestionarioId);
            return consulta.ToList();
        }
    }
}
