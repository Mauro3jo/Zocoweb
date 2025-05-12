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
    public class NotificacionService : INotificacionService
    {
        private readonly IGenericRepository<Noticia> _repoNoticia;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public NotificacionService(IGenericRepository<Noticia> repobasedashboard, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoNoticia = repobasedashboard;
            _repoUsuario = repoUsuarios;

        }
        public async Task<Noticia> Crear(Noticia entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            return await _repoNoticia.Crear(entidad);
        }

        public async Task<Noticia> Editar(Noticia entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad));
            }

            var noticiaExistente = await _repoNoticia.Obtener(n => n.Id == entidad.Id);
            if (noticiaExistente == null)
            {
                throw new KeyNotFoundException("No se encontró la noticia con el ID especificado.");
            }

            noticiaExistente.Noticia1 = entidad.Noticia1;

            var resultado = await _repoNoticia.Editar(noticiaExistente);
            if (resultado)
            {
                return noticiaExistente;
            }
            else
            {
                throw new InvalidOperationException("No se pudo editar la noticia.");
            }
        }

       
        public async Task<bool> Eliminar(int IdNoticia)
        {
            var noticia = await _repoNoticia.Obtener(n => n.Id == IdNoticia);
            if (noticia == null)
            {
                throw new InvalidOperationException("Noticia no encontrada.");
            }

            return await _repoNoticia.Eliminar(noticia);
        }


        public async Task<List<Noticia>> Lista()
        {
            IQueryable<Noticia> query = await _repoNoticia.Consultar();
            return query.ToList();
        }
    }
}
