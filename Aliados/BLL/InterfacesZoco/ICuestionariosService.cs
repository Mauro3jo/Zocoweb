using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICuestionariosService
    {
        Task<Cuestionario> Crear(Cuestionario nuevaCuestionario);


        Task<Cuestionario> Editar(Cuestionario CuestionarioEditada);


        Task<bool> Eliminar(int CuestionarioId);


        Task<List<Cuestionario>> Obtener();


        Task<Cuestionario> ObtenerPorId(int CuestionarioId);
        Task<List<Cuestionario>> ObtenerPorIdPuesto(int PuestoId);
    }
}
