using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class TokenCajeroService : ITokenCajeroService
    {
        private readonly IGenericRepository<TokenCajero> _repoToken;
        private readonly IGenericRepository<UsuarioCajero> _repoUsuario;

        public TokenCajeroService(IGenericRepository<TokenCajero> token, IGenericRepository<UsuarioCajero> repoUsuarios)
        {
            _repoToken = token;
            _repoUsuario = repoUsuarios;
        }
        public Task<bool> EliminarTokenAsync(int usuarioId)
        {
            throw new NotImplementedException();
        }

        public async Task<TokenCajero> GenerarActualizarTokenAsync(int usuarioId, string cuit, string nuevoToken,  DateTime fechaCreacion, DateTime fechaExpiracion)
        {
            var tokenActual = await _repoToken.Obtener(t => t.UsuariocajeroId == usuarioId);

            if ((cuit == "33333333333" || cuit == "44444444444" || cuit == "88888888888" || cuit == "20277403472") && tokenActual != null && tokenActual.FechaExpiracion >= DateTime.UtcNow)
            {
                var nuevoTokenObj = new TokenCajero
                {
                    UsuariocajeroId = usuarioId,
                    Token = nuevoToken,
                    FechaCreacion = fechaCreacion,
                    FechaExpiracion = fechaExpiracion
                };
                await _repoToken.Crear(nuevoTokenObj);
                return nuevoTokenObj;
            }
            else if (tokenActual != null)
            {
                if (tokenActual.Token != nuevoToken || tokenActual.FechaExpiracion < DateTime.UtcNow)
                {
                    tokenActual.Token = nuevoToken;
                    tokenActual.FechaCreacion = fechaCreacion;
                    tokenActual.FechaExpiracion = fechaExpiracion;
                    await _repoToken.Editar(tokenActual);
                }
            }
            else
            {
                tokenActual = new TokenCajero
                {
                    UsuariocajeroId = usuarioId,
                    Token = nuevoToken,
                    FechaCreacion = fechaCreacion,
                    FechaExpiracion = fechaExpiracion
                };
                await _repoToken.Crear(tokenActual);
            }

            return tokenActual;
        }

        public Task<TokenCajero> ObtenerTokenPorUsuarioIdAsync(int usuarioId)
        {
            throw new NotImplementedException();
        }

        public async Task<(TokenCajero token, UsuarioCajero usuario)> ObtenerTokenYUsuarioPorUsuarioIdAsync(string valorToken)
        {
            var token = await _repoToken.Obtener(t => t.Token == valorToken);

            UsuarioCajero usuario = null;
            if (token != null && token.UsuariocajeroId.HasValue)
            {
                usuario = await _repoUsuario.Obtener(u => u.Id == token.UsuariocajeroId.Value);
            }

            return (token, usuario);
        }

        public async Task<bool> ValidarTokenAsync(string token)
        {

            var tokenEncontrado = await _repoToken.Obtener(t => t.Token == token);
            if (tokenEncontrado == null || tokenEncontrado.FechaExpiracion < DateTime.UtcNow)
            {
                return false;
            }

            return true;
        }
    }
}
