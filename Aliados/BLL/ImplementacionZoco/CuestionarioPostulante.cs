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
    public class CuestionarioPostulante : ICuestionarioPostulane
    {
        private readonly IGenericRepository<PostulanteCuestionario> _repoPostulanteCuestionario;

        public CuestionarioPostulante(IGenericRepository<PostulanteCuestionario> repoPostulanteCuestionario)
        {
            _repoPostulanteCuestionario = repoPostulanteCuestionario;
        }
        public async Task<PostulanteCuestionario> Crear(PostulanteCuestionario nuevaPostulanteCuestionario)
        {
            if (nuevaPostulanteCuestionario == null)
                throw new ArgumentNullException(nameof(nuevaPostulanteCuestionario), "La respuesta no puede ser nula.");

            return await _repoPostulanteCuestionario.Crear(nuevaPostulanteCuestionario);
        }

        public async Task<PostulanteCuestionario> Editar(PostulanteCuestionario PostulanteCuestionarioEditada)
        {
            if (PostulanteCuestionarioEditada == null)
                throw new ArgumentNullException(nameof(PostulanteCuestionarioEditada), "La respuesta no puede ser nula.");

            var PostulanteCuestionarioExistente = await _repoPostulanteCuestionario.Obtener(r => r.Id == PostulanteCuestionarioEditada.Id);
            if (PostulanteCuestionarioExistente == null)
                throw new KeyNotFoundException("No se encontró la respuesta a editar.");

            await _repoPostulanteCuestionario.Editar(PostulanteCuestionarioEditada);
            return PostulanteCuestionarioExistente;
        }

        public async Task<bool> Eliminar(int PostulanteCuestionarioId)
        {
            var PostulanteCuestionario = await _repoPostulanteCuestionario.Obtener(r => r.Id == PostulanteCuestionarioId);
            if (PostulanteCuestionario == null)
                throw new KeyNotFoundException("No se encontró la respuesta a eliminar.");

            return await _repoPostulanteCuestionario.Eliminar(PostulanteCuestionario);
        }

        public async Task<List<PostulanteCuestionario>> Obtener()
        {
            var PostulanteCuestionario = await _repoPostulanteCuestionario.Consultar();
            return PostulanteCuestionario.ToList();
        }

        public async Task<PostulanteCuestionario> ObtenerPorId(int PostulanteCuestionarioId)
        {
            return await _repoPostulanteCuestionario.Obtener(r => r.Id == PostulanteCuestionarioId);
        }

        public async Task<PostulanteCuestionario> ObtenerPorIdcuestionario(int PostulanteCuestionarioId)
        {
            return await _repoPostulanteCuestionario.Obtener(r => r.IdCuestionario == PostulanteCuestionarioId);
        }

        public async Task<List<PostulanteCuestionario>> ObtenerPostulacionesPorPostulanteIdAsync(int postulanteId)
        {
            var postulaciones = await _repoPostulanteCuestionario.Consultar(p => p.IdPostulante == postulanteId);
            return postulaciones.ToList();
        }

        //public async Task<List<PostulanteCuestionario>> ObtenerPostulacionesPorPostulanteIdYPuestoIdAsync(int postulanteId, int IdCuestionarios)
        //{
        //    var postulaciones = await _repoPostulanteCuestionario.Consultar(p => p.IdPostulante == postulanteId & p.);
        //    return postulaciones.ToList();
        //}
    }
}
