using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using Microsoft.EntityFrameworkCore;

namespace BLL.ImplementacionZoco
{
    public class CalificoService : ICalificoComentarioService
    {
        private readonly IGenericRepository<CalificoCom> _repoCalificoCom;
        private readonly IGenericRepository<Califico> _repoCalifico;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IGenericRepository<BaseDashboard> _repoBaseDashBoard;


        public CalificoService(IGenericRepository<CalificoCom> calificocom, IGenericRepository<Califico> califico, IGenericRepository<Usuario> repoUsuarios, IGenericRepository<BaseDashboard> repoBaseDashBoard)
        {
            _repoCalificoCom = calificocom;
            _repoUsuario = repoUsuarios;
            _repoCalifico = califico;
            _repoBaseDashBoard = repoBaseDashBoard;
        }

        public async Task<bool> Califico(int IdUsuario)
        {

            Usuario usuario_existe = await _repoUsuario.Obtener(u => u.Id == IdUsuario);
            if (usuario_existe == null)
                throw new TaskCanceledException("No existe el usuario: " + usuario_existe.Nombre);

            
            var calificaciones = await _repoCalifico.Consultar(c => c.UsuarioId == IdUsuario);

          
            if (DateTime.Now.Day >= 10)
            {
              
                bool hayCalificacionesEsteMes = calificaciones.Any(c => c.Fecha.HasValue &&
                                                                        c.Fecha.Value.Month == DateTime.Now.Month &&
                                                                        c.Fecha.Value.Year == DateTime.Now.Year);

              
                if (!hayCalificacionesEsteMes)
                {
                    return false;
                }
            }

          
            var fechaMasReciente = calificaciones.Max(c => c.Fecha);

          
            if (fechaMasReciente.HasValue)
            {
               
                if (fechaMasReciente.Value.Month == DateTime.Now.Month &&
                    fechaMasReciente.Value.Year == DateTime.Now.Year)
                {
                    return true;
                }
            }

       
            return false;
        }


        public async Task<CalificoCom> Crear(CalificoCom entidad)
        {
            Usuario usuario_existe = await _repoUsuario.Obtener(u => u.Id == entidad.UsuarioId);

            if (usuario_existe == null)
                throw new TaskCanceledException("No existe el usuario: " + usuario_existe.Nombre);
            var nuevoCalifico = new CalificoCom
            {
                UsuarioId = entidad.UsuarioId,
                NumCalifico=entidad.NumCalifico,
                Descripcion=entidad.Descripcion,
                Fecha=entidad.Fecha,
      

    };
            CalificoCom Comentario = await _repoCalificoCom.Crear(nuevoCalifico);
           
          return Comentario;
        }

        public async Task<Califico> CrearComentario(Califico entidad)
        {
         
            Usuario usuario_existe = await _repoUsuario.Obtener(u => u.Id == entidad.UsuarioId);

            if (usuario_existe == null)
            {
                throw new TaskCanceledException("No existe el usuario con ID: " + entidad.UsuarioId);
            }

      
            var nuevoCalifico = new Califico
            {
                UsuarioId = entidad.UsuarioId,
                NumCalifico = entidad.NumCalifico,
                Califico1 = true, 
                Fecha = entidad.Fecha
            };

     
            Califico comentarioCreado = await _repoCalifico.Crear(nuevoCalifico);

            return comentarioCreado;
        }
        public async Task<List<CalificoCom>> ObtenerCalificoAsesores()
        {

            IQueryable<CalificoCom> query = await _repoCalificoCom.Consultar();
            return query.ToList();
        }



    }
}
