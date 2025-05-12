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
    public class ComentarioService : IComentarioService
    {
        private readonly IGenericRepository<Comentario> _repoComentario;

        public ComentarioService(IGenericRepository<Comentario> repocomentario)
        {
            _repoComentario = repocomentario;

        }

        public async Task<Comentario> CrearComentarioAsync(Comentario comentario)
        {
            if (comentario == null)
                throw new ArgumentNullException(nameof(comentario));

            try
            {
                Comentario nuevoComentario = await _repoComentario.Crear(comentario);
                return nuevoComentario;
            }
            catch (Exception ex)
            {
               
                throw new Exception("Ocurrió un error al crear el comentario", ex);
            }
        }
        public async Task<Comentario> ResponderAComentarioAsync(int? idComentarioPadre, Comentario respuesta)
        {
            if (respuesta == null)
                throw new ArgumentNullException(nameof(respuesta));

            try
            {
                Comentario comentarioPadre = await _repoComentario.Obtener(c => c.Id == idComentarioPadre);
                if (comentarioPadre == null)
                    throw new KeyNotFoundException("Comentario padre no encontrado con el ID proporcionado.");

                respuesta.IdComentarioPadre = idComentarioPadre;

                Comentario nuevoComentario = await _repoComentario.Crear(respuesta);

                return nuevoComentario;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al responder al comentario", ex);
            }
        }

        public async Task<Comentario> EditarComentarioAsync(int id, Comentario comentarioActualizado)
        {
            if (comentarioActualizado == null)
                throw new ArgumentNullException(nameof(comentarioActualizado));

            try
            {
                
                Comentario comentarioExistente = await _repoComentario.Obtener(c => c.Id == id);
                if (comentarioExistente == null)
                    throw new KeyNotFoundException("Comentario no encontrado con el ID proporcionado.");

                
                comentarioExistente.Comentario1 = comentarioActualizado.Comentario1;
                

               
                await _repoComentario.Editar(comentarioExistente);

                return comentarioExistente;
            }
            catch (Exception ex)
            {
                
                throw new Exception("Ocurrió un error al editar el comentario", ex);
            }
        }


        public async Task<List<Comentario>> ListarComentariosAsync()
        {
            try
            {
               
                var comentarios = await _repoComentario.Consultar();
                return comentarios.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al listar los comentarios", ex);
            }
        }


        public async Task<IEnumerable<Comentario>> ListarComentariosPorUsuarioAsync(int idUsuario)
        {
            try
            {
                var comentarios = await _repoComentario.Consultar(c => c.IdUsuario == idUsuario);
                return comentarios.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocurrió un error al listar los comentarios del usuario {idUsuario}", ex);
            }
        }


        public async Task<IEnumerable<Comentario>> ListarRespuestasPorComentarioAsync(int idComentarioPadre)
        {
            try
            {
                var respuestas = await _repoComentario.Consultar(c => c.IdComentarioPadre == idComentarioPadre);
                return respuestas.ToList();
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocurrió un error al listar las respuestas al comentario {idComentarioPadre}", ex);
            }
        }

        public async Task<Comentario> ObtenerComentarioPorIdAsync(int id)
        {
            try
            {
                var comentario = await _repoComentario.Obtener(c => c.Id == id);
                if (comentario == null)
                    throw new KeyNotFoundException($"Comentario no encontrado con el ID {id}.");

                return comentario;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocurrió un error al obtener el comentario con ID {id}", ex);
            }
        }
        public async Task<Comentario> ObtenerUltimoComentarioPorUsuarioId(int usuarioId)
        {
            try
            {
              
                var comentariosQuery = await _repoComentario.Consultar(c => c.IdUsuario == usuarioId);

          
                var ultimoComentario = comentariosQuery.OrderByDescending(c => c.Id).FirstOrDefault();

                return ultimoComentario;
            }
            catch (Exception ex)
            {
                throw new Exception($"Ocurrió un error al obtener el comentario para el usuario con ID {usuarioId}", ex);
            }
        }



    }
}
