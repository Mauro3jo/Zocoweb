using Entity.Zoco;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IComentarioService
    {
        Task<Comentario> CrearComentarioAsync(Comentario comentario);

        Task<Comentario> EditarComentarioAsync(int id, Comentario comentarioActualizado);

        Task<Comentario> ObtenerComentarioPorIdAsync(int id);

        Task<Comentario> ObtenerUltimoComentarioPorUsuarioId(int id);
        Task<Comentario> ResponderAComentarioAsync(int? idComentarioPadre, Comentario respuesta);
        Task<List<Comentario>> ListarComentariosAsync();

        
        Task<IEnumerable<Comentario>> ListarComentariosPorUsuarioAsync(int idUsuario);

        Task<IEnumerable<Comentario>> ListarRespuestasPorComentarioAsync(int idComentarioPadre);
       
    }
}
