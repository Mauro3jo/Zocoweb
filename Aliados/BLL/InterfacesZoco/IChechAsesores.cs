using BLL.ImplementacionZoco;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static BLL.ImplementacionZoco.CheckAsesoresService;

namespace BLL.InterfacesZoco
{
    public interface IChechAsesores
    {
        Task<bool> ConfirmarCheck(int id);
        Task<CheckAsesore> Crear(CheckAsesore entidad);
        Task<List<CheckAsesore>> Lista();
        Task<List<CheckAsesore>> Listahoy(int id);

        Task<List<CheckAsesore>> Listames(string mes);
        public Task<ResultadoProcesamiento> ProcesarUsuarioPorId(int id, DateTime fecha);
    }
}
