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
    public class PostulantePuestoService : IPostulantePuestoService
    {
        private readonly IGenericRepository<PostulantePuesto> _repopostulantepuesto;

        public PostulantePuestoService(IGenericRepository<PostulantePuesto> repopostulantepuesto)
        {
            _repopostulantepuesto = repopostulantepuesto;

        }
        public async Task<PostulantePuesto> Crear(PostulantePuesto nuevaPostulantePuesto)
        {
            if (nuevaPostulantePuesto == null)
                throw new ArgumentNullException(nameof(nuevaPostulantePuesto), "La nuevaPostulantePuesto no puede ser nula.");

            return await _repopostulantepuesto.Crear(nuevaPostulantePuesto);
        }

        public async Task<PostulantePuesto> Editar(PostulantePuesto EditarPostulantePuesto)
        {
            if (EditarPostulantePuesto == null)
                throw new ArgumentNullException(nameof(EditarPostulantePuesto), "La ostulantePuesto no puede ser nula.");

            var PostulantePuestoExistente = await _repopostulantepuesto.Obtener(r => r.Id == EditarPostulantePuesto.Id);
            if (PostulantePuestoExistente == null)
                throw new KeyNotFoundException("No se encontró la respuesta a editar.");

            await _repopostulantepuesto.Editar(EditarPostulantePuesto);
            return EditarPostulantePuesto;
        }

        public async Task<bool> Eliminar(int PostulantePuestoId)
        {
            var respuesta = await _repopostulantepuesto.Obtener(r => r.Id == PostulantePuestoId);
            if (respuesta == null)
                throw new KeyNotFoundException("No se encontró la respuesta a eliminar.");

            return await _repopostulantepuesto.Eliminar(respuesta);
        }

        public async Task<List<PostulantePuesto>> Obtener()
        {
            var consulta = await _repopostulantepuesto.Consultar();
            return consulta.ToList();
        }

        public async Task<PostulantePuesto> ObtenerPorId(int PostulantePuestoId)
        {
            return await _repopostulantepuesto.Obtener(r => r.Id == PostulantePuestoId);
        }
        public async Task<List<PostulantePuesto>> ObtenerPostulacionesPorPostulanteIdAsync(int postulanteId)
        {
            var postulaciones = await _repopostulantepuesto.Consultar(p => p.IdPostulante == postulanteId);
            return postulaciones.ToList();
        }

        public async Task<List<PostulantePuesto>> ObtenerPostulacionesPorPuestoIdAsync(int puestoId)
        {
            var postulaciones = await _repopostulantepuesto.Consultar(p => p.IdPuesto == puestoId);
            return postulaciones.ToList();
        }
    }
}
