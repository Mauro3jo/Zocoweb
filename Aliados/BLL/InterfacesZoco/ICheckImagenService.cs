using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ICheckImagenService
    {
        Task<CheckAsesoresImagen> Crear(CheckAsesoresImagen entidad);
        Task<CheckAsesoresImagen> AgregarObservacionAdmin(int? id, bool calificacion, string ObservacionAdmin);
        Task<List<CheckAsesoresImagen>> Lista();
        Task<List<CheckAsesoresImagen>> Listaimagen(string fecha);
        Task<List<CheckAsesoresImagen>> ListaMesImagen(string fecha);

        Task<List<CheckAsesoresImagen>> ListaAsesor(int AsesorId);
        Task<List<CheckAsesoresImagen>> ListaAsesor2(int AsesorId, DateTime fecha);

        Task<List<CheckAsesoresImagen>> Listahoy(int id);
        Task<(int TotalRegistros, int Desaprobados)> Listames(int id);
        Task<CheckAsesoresImagen> ObtenerCheckImagenPorId(int id);
        Task<(int TotalRegistros, int Desaprobados, int Visitas, int Prospectos, string Promedio)> ProcesarUsuarioPorId(int id, DateTime fecha);

    }
}
