using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ILegajoService
    {
        Task<List<Legajo>> Lista();
        Task<Legajo> Listaultimo();
        Task<Legajo> CrearLegao(Legajo Legajo);
        Task<List<Legajo>> Listausuario(int iduser);

        Task<Legajo> ObtenerPorId(int idlegajo);


    }
}
