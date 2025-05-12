using Entity.Zoco;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICalificoComentarioService
    {
        Task<CalificoCom> Crear(CalificoCom entidad);
        Task<Califico> CrearComentario(Califico entidad);
        Task<bool> Califico(int IdUsuario);
        Task<List<CalificoCom>> ObtenerCalificoAsesores();

    }
}
