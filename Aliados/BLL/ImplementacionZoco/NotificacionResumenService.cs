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
    public class NotificacionResumenService : INotificacionResumenService
    {
        private readonly IGenericRepository<NotificacionResuman> _reponotificacionresumen;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public NotificacionResumenService(IGenericRepository<NotificacionResuman> reponotificacionresumen, IGenericRepository<Usuario> repoUsuario)
        {
            _reponotificacionresumen = reponotificacionresumen;
            _repoUsuario = repoUsuario;
        }

        public async Task<NotificacionResuman> CrearNotificacionResumen(NotificacionResuman entidad)
        {
            try
            {
                // Validar si el usuario asociado a la notificación existe
                Usuario usuario_existe = await _repoUsuario.Obtener(u => u.Id == entidad.UsuarioId);
                if (usuario_existe == null)
                {
                    throw new TaskCanceledException("No existe el usuario con ID: " + entidad.UsuarioId);
                }

                // Crear la nueva notificación en la base de datos
                var nuevaNotificacion = await _reponotificacionresumen.Crear(entidad);
                return nuevaNotificacion;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear la notificación: " + ex.Message);
            }
        }

        public async Task<bool> FueNotificado(int IdUsuario)
        {
            // Verificar si el usuario existe
            Usuario usuario_existe = await _repoUsuario.Obtener(u => u.Id == IdUsuario);
            if (usuario_existe == null)
                throw new TaskCanceledException("No existe el usuario con ID: " + IdUsuario);

            // Obtener registros de NotificacionResuman para el UsuarioId especificado
            var notificaciones = await _reponotificacionresumen.Consultar(n => n.UsuarioId == IdUsuario);

            if (!notificaciones.Any())
            {
                // Si no hay registros, crear una nueva notificación
                TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime fechaActualArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                var nuevaNotificacion = new NotificacionResuman
                {
                    UsuarioId = IdUsuario,
                    Califico = true,
                    Fecha = fechaActualArg
                };

                await _reponotificacionresumen.Crear(nuevaNotificacion);

                return false;
            }

            // Filtrar las notificaciones del mes actual
            var notificacionesMesActual = notificaciones.Where(n => n.Fecha.HasValue &&
                                                                     n.Fecha.Value.Month == DateTime.Now.Month &&
                                                                     n.Fecha.Value.Year == DateTime.Now.Year);

            // Verificar si ya tiene una notificación del día de hoy
            if (notificacionesMesActual.Any(n => n.Fecha.HasValue && n.Fecha.Value.Date == DateTime.Now.Date))
            {
                return false;
            }

            // Verificar si hay menos de 3 notificaciones en el mes y crear una nueva si es necesario
            if (notificacionesMesActual.Count() < 2)
            {
                TimeZoneInfo zonaHorariaArg = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
                DateTime fechaActualArg = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, zonaHorariaArg);

                var nuevaNotificacion = new NotificacionResuman
                {
                    UsuarioId = IdUsuario,
                    Califico = true,
                    Fecha = fechaActualArg
                };

                await _reponotificacionresumen.Crear(nuevaNotificacion);

                return false;
            }

            return true;
        }

    }
}
