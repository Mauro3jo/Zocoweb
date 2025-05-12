using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IUsuarioCajeroService
    {
        Task<List<UsuarioCajero>> Lista();
        Task<UsuarioCajero> Crear(UsuarioCajero entidad);
        Task<UsuarioCajero> Editar(UsuarioCajero entidad);
        Task<UsuarioCajero> ObtenerPorCredenciales(string correo, string clave);
        Task<UsuarioCajero> ObtenerPorId(int IdUsuario); 
        Task<bool> CambiarClave(int IdUsuario, string ClaveActual, string ClaveNueva);
        Task<bool> RestablecerClaveliquidaciones(int IdUsuario);
        Task<bool> RestablecerClave(string Correo, string UrlPlantillaCorreo);
        Task<UsuarioCajero> ObtenerPorCuit(string cuit); //ObtenerPorCuitGestor
    }
}
