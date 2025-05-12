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
    public class HistorialCRMService : IHistorialCRMService
    {
        private readonly IGenericRepository<HistorialCrm> _repoHistorialCrm;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public HistorialCRMService(IGenericRepository<HistorialCrm> repohistorialcrm, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoHistorialCrm = repohistorialcrm;
            _repoUsuario = repoUsuarios;

        }

        public async Task<HistorialCrm> AgregarHistorialAlta(int IdUsuario, int IdAlta, string? observaciones)
        {
            var fecha = DateTime.Now;
            var Tipo = "ALTA";

            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                AltaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones = observaciones

            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }
        public async Task<HistorialCrm> AgregarHistorialSSTT(int IdUsuario, int IdAlta, string? observaciones)
        {
            var fecha = DateTime.Now;
            var Tipo = "INGRESO SSTT";

            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                AltaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones = observaciones
            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }


        public async Task<HistorialCrm> AgregarHistorialBaja(int IdUsuario, int IdAlta, string? observaciones, int IdBaja)
        {
            var fecha = DateTime.Now;
            var Tipo = "BAJA";
            
            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                AltaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones= observaciones,
                BajaId = IdBaja
            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }

        public async Task<HistorialCrm> AgregarHistorialModificacion(int IdUsuario, int IdAlta, string? observaciones)
        {
            var fecha = DateTime.Now;
            var Tipo = "MODIFICACION";

            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                AltaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones = observaciones
            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }

        public async Task<HistorialCrm> AgregarHistorialModificacionBaja(int IdUsuario, int IdAlta, string? observaciones)
        {
            var fecha = DateTime.Now;
            var Tipo = "MODIFICACION BAJA";

            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                BajaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones = observaciones
            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }

        public async Task<List<HistorialCrm>> ObtenerHistorialCRM()
        {
            try
            {
                var documentos = await _repoHistorialCrm.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los historiales", ex);
            }
        }

        public async Task<List<HistorialCrm>> ObtenerHistorialPorTerminal(int IdTerminal)
        {
            try
            {
                // Filtrar los registros que tienen AltaId en NULL
                var documentos = await _repoHistorialCrm.Consultar(Historial => Historial.AltaId != null && Historial.AltaId == IdTerminal);

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los historiales por terminal", ex);
            }
        }

        public async Task<HistorialCrm> Crear(HistorialCrm historialcrm)
        {
            try
            {
                return await _repoHistorialCrm.Crear(historialcrm);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<HistorialCrm> AgregarHistorialAltaCCTT(int IdUsuario, int IdAlta, string? observaciones)
        {
            var fecha = DateTime.Now;
            var Tipo = "ALTA CCTT";

            var historial = new HistorialCrm
            {
                UsuarioId = IdUsuario,
                AltaId = IdAlta,
                FechaSubida = fecha,
                Tipo = Tipo,
                Observaciones = observaciones

            };

            await _repoHistorialCrm.Crear(historial);

            return historial;
        }
    }
}
