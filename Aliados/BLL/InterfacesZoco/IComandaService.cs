using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IComandaService
    {
        Task<Actividade> CrearComandaAsync(Actividade comanda);
        Task<Actividade> EditarComandaAsync(Actividade comanda);
        Task<Actividade> CerrarComandaConCheck(int id, int user);

        Task<bool> EliminarComandaAsync(int? id);
        Task<List<Actividade>> ListarComandasAsync();
        Task<IEnumerable<Actividade>> ListarComandasPorUsuarioAsync(int idUser);
        Task<IEnumerable<Actividade>> ListarComandasPorGestorAsync(int idGestor);
        Task <Actividade> ListarComandaAsync(int id);
        Task<IEnumerable<Actividade>> ListaComandasPorGestorPendientes(int idGestor);

        Task<IEnumerable<Actividade>> ListarTodasComandasAsync(DateTime fecha);
        Task<IEnumerable<Actividade>> ListarComandasPorMes(DateTime fecha);

    }

}
