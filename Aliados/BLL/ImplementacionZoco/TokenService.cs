using BLL.InterfacesZoco;
using DAL.Interfaces;

using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class TokenService : ITokenService
    {
        private readonly IGenericRepository<Token> _repoToken;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public TokenService(IGenericRepository<Token> token,IGenericRepository<Usuario> repoUsuarios)
        {
            _repoToken = token;
            _repoUsuario = repoUsuarios;
        }
        public async Task<bool> EliminarTokenAsync(int usuarioId)
        {
            var token = await _repoToken.Obtener(t => t.UsuarioId == usuarioId);
            if (token != null)
            {
                token.Token1 = string.Empty; 
                token.FechaExpiracion = DateTime.UtcNow; 
                return await _repoToken.Editar(token);
            }

            return false;
        }

        public async Task<Token> GenerarActualizarTokenAsync(int usuarioId, string cuit, string nuevoToken, DateTime fechaCreacion, DateTime fechaExpiracion)
        {
            var tokenActual = await _repoToken.Obtener(t => t.UsuarioId == usuarioId);

            if ((cuit == "33333333333" || cuit == "44444444444" || cuit == "88888888888" || cuit == "20277403472" || cuit == "11111111111" || cuit == "99999999999") && tokenActual != null && tokenActual.FechaExpiracion >= DateTime.UtcNow)
            {
                var nuevoTokenObj = new Token
                {
                    UsuarioId = usuarioId,
                    Token1 = nuevoToken,
                    FechaCreacion = fechaCreacion,
                    FechaExpiracion = fechaExpiracion
                };
                await _repoToken.Crear(nuevoTokenObj);
                return nuevoTokenObj;
            }
            else if (tokenActual != null)
            {
                if (tokenActual.Token1 != nuevoToken || tokenActual.FechaExpiracion < DateTime.UtcNow)
                {
                    tokenActual.Token1 = nuevoToken;
                    tokenActual.FechaCreacion = fechaCreacion;
                    tokenActual.FechaExpiracion = fechaExpiracion;
                    await _repoToken.Editar(tokenActual);
                }
            }
            else
            {
                tokenActual = new Token
                {
                    UsuarioId = usuarioId,
                    Token1 = nuevoToken,
                    FechaCreacion = fechaCreacion,
                    FechaExpiracion = fechaExpiracion
                };
                await _repoToken.Crear(tokenActual);
            }

            return tokenActual;
        }




        public async Task<Token> ObtenerTokenPorUsuarioIdAsync(int usuarioId)
        {
            return await _repoToken.Obtener(t => t.UsuarioId == usuarioId);
        }


        public async Task<bool> ValidarTokenAsync(string token)
        {

            var tokenEncontrado = await _repoToken.Obtener(t => t.Token1 == token);
            if (tokenEncontrado == null || tokenEncontrado.FechaExpiracion < DateTime.UtcNow)
            {
                return false;
            }

            return true;
        }
      
        public async Task<(Token token, Usuario usuario)> ObtenerTokenYUsuarioPorUsuarioIdAsync(string valorToken)
        {
            var token = await _repoToken.Obtener(t => t.Token1 == valorToken);

            Usuario usuario = null;
            if (token != null && token.UsuarioId.HasValue)
            {
                usuario = await _repoUsuario.Obtener(u => u.Id == token.UsuarioId.Value);
            }

            return (token, usuario);
        }
    }
}
