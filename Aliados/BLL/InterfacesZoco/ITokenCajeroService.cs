using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface ITokenCajeroService
    {
        Task<TokenCajero> ObtenerTokenPorUsuarioIdAsync(int usuarioId);
        Task<bool> ValidarTokenAsync(string token);
        Task<bool> EliminarTokenAsync(int usuarioId);
        Task<TokenCajero> GenerarActualizarTokenAsync(int usuarioId, string cuit, string nuevoToken,  DateTime fechaCreacion, DateTime fechaExpiracion);
        Task<(TokenCajero token, UsuarioCajero usuario)> ObtenerTokenYUsuarioPorUsuarioIdAsync(string valorToken);

    }
}
