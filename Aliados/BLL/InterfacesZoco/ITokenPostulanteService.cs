using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ITokenPostulanteService
    {
        Task<TokenPostulante> ObtenerTokenPorUsuarioIdAsync(int usuarioId);
        Task<bool> ValidarTokenAsync(string token);
        Task<bool> EliminarTokenAsync(int usuarioId);
        Task<TokenPostulante> GenerarActualizarTokenAsync(int usuarioId, string nuevoToken, string cuit, DateTime fechaCreacion, DateTime fechaExpiracion);
        Task<(TokenPostulante token, Postulante usuario)> ObtenerTokenYUsuarioPorUsuarioIdAsync(string valorToken);
    }
}
