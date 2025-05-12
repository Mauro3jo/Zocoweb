//using Entity.Entity;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IUsuarioZocoService
    {

        Task<List<Usuario>> Lista();
        Task<List<Usuario>> ListaGestoresyAsesores();

        Task<Usuario> Crear(Usuario entidad);
        Task<Usuario> CrearZocoConect(Usuario entidad);

        Task<Usuario> Editar(Usuario entidad);
        Task<bool> Eliminar(int IdUsuario);
        Task<bool> Guardarcalificacion(int IdUsuario);
        Task<Usuario> ObtenerPorCredenciales(string correo, string clave);
        Task<Usuario> ObtenerPorId(int IdUsuario);
        Task<bool> GuardarPefil(Usuario entidad);
        Task<bool> CambiarClave(int IdUsuario, string ClaveActual, string ClaveNueva);
        Task<bool> RestablecerClaveliquidaciones(int IdUsuario);
        Task<bool> RestablecerClave(string Correo, string UrlPlantillaCorreo);
        Task<Usuario> ObtenerPorCuit(string cuit); //ObtenerPorCuitGestor
        Task<List<Usuario>> ObtenerPorCuitGestorYAsesor();
        Task<List<Usuario>> ObtenerUsuarios();

        Task<Usuario> ObtenerPorCuitGestor(string cuit);
        
    }
}
