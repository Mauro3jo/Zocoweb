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
    public class TokenPostulanteService: ITokenPostulanteService
    {
        private readonly IGenericRepository<TokenPostulante> _repoToken;
        private readonly IGenericRepository<Postulante> _repoUsuario;

        public TokenPostulanteService(IGenericRepository<TokenPostulante> token, IGenericRepository<Postulante> repoUsuarios)
        {
            _repoToken = token;
            _repoUsuario = repoUsuarios;
        }

        public async Task<bool> EliminarTokenAsync(int usuarioId)
        {
            var token = await _repoToken.Obtener(t => t.PostulanteId == usuarioId);
            if (token != null)
            {
                token.Token = string.Empty;
                token.FechaExpiracion = DateTime.UtcNow;
                return await _repoToken.Editar(token);
            }

            return false;
        }

        public async Task<TokenPostulante> GenerarActualizarTokenAsync(int usuarioId, string nuevoToken, string cuit, DateTime fechaCreacion, DateTime fechaExpiracion)
        {
            var tokenActual = await _repoToken.Obtener(t => t.PostulanteId == usuarioId);

            if ((cuit == "33333333333" || cuit == "44444444444" || cuit == "88888888888" || cuit == "20277403472" || cuit == "11111111111" || cuit == "99999999999") && tokenActual != null && tokenActual.FechaExpiracion >= DateTime.UtcNow)
            {
                var nuevoTokenObj = new TokenPostulante
                {
                    PostulanteId  = usuarioId,
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
                tokenActual = new TokenPostulante
                {
                    PostulanteId = usuarioId,
                    Token = nuevoToken,
                    FechaCreacion = fechaCreacion,
                    FechaExpiracion = fechaExpiracion
                };
                await _repoToken.Crear(tokenActual);
            }

            return tokenActual;
        }

        public async Task<TokenPostulante> ObtenerTokenPorUsuarioIdAsync(int usuarioId)
        {
            return await _repoToken.Obtener(t => t.PostulanteId == usuarioId);
        }

        public async Task<(TokenPostulante token, Postulante usuario)> ObtenerTokenYUsuarioPorUsuarioIdAsync(string valorToken)
        {
            var token = await _repoToken.Obtener(t => t.Token == valorToken);

            Postulante usuario = null;
            if (token != null)
            {
                usuario = await _repoUsuario.Obtener(u => u.Id == token.PostulanteId);
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
