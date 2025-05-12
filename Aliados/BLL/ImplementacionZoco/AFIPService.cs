using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class AFIPService : IAFIPService
    {
        private readonly IGenericRepository<Afip> _repoAfip;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public AFIPService(IGenericRepository<Afip> repoafip, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoAfip = repoafip;
            _repoUsuario = repoUsuarios;

        }

        public async Task<Afip> CrearDocumentoAFIPUsuario(Afip documento)
        {
            try
            {
                return await _repoAfip.Crear(documento);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<bool> ExisteDocumentoEnFechaAFIP(int usuarioId, DateTime? fecha)
        {
            if (fecha == null)
            {
                return false;
            }

            var query = await _repoAfip.Consultar(d =>
                d.UsuarioId == usuarioId &&
                d.FechaSubida.HasValue &&
                d.FechaSubida.Value.Date == fecha.Value.Date);

            var documentos = await query.ToListAsync();

            return documentos.Any();
        }

        public async Task<IEnumerable<Afip>> ObtenerDocumentosAFIPPorUsuarioYFecha(int usuarioId, DateTime fecha)
        {
            try
            {
                IQueryable<Afip> query = await _repoAfip.Consultar(d =>
                    d.UsuarioId == usuarioId &&
                    d.FechaSubida.HasValue &&
                    d.FechaSubida.Value.Month == fecha.Month &&
                    d.FechaSubida.Value.Year == fecha.Year);

                var documentos = await query.ToListAsync();
                return documentos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener documentos por usuario y fecha", ex);
            }

        }

        public async Task<List<object>> ObtenerResumenDocumentosAFIPPorUltimosCincoDiasRegistrados()
        {
            try
            {
                var consultaDocumentos = await _repoAfip.Consultar();

                var ultimaFechaSubida = await consultaDocumentos
                    .Where(d => d.FechaSubida.HasValue)
                    .OrderByDescending(d => d.FechaSubida)
                    .Select(d => d.FechaSubida.Value.Date)
                    .FirstOrDefaultAsync();

                if (ultimaFechaSubida == default)
                {
                    return new List<object>();
                }

                var fechaCorte = ultimaFechaSubida.AddDays(-1);

                var documentos = await consultaDocumentos
                    .Where(d =>
                        d.FechaSubida.HasValue &&
                        d.FechaSubida.Value.Date >= fechaCorte &&
                        d.FechaSubida.Value.Date <= ultimaFechaSubida)
                    .ToListAsync();

                var documentosPorDia = documentos
                    .GroupBy(d => d.FechaSubida.Value.Date)
                    .ToDictionary(g => g.Key, g => g.Count());

                var resumenPorDia = new List<object>();

                for (int i = 0; i <= 1; i++)
                {
                    var fecha = ultimaFechaSubida.AddDays(-i);
                    resumenPorDia.Add(new
                    {
                        Numero = i + 1,
                        Fecha = fecha.ToString("dd/MM/yyyy"),
                        Cantidad = documentosPorDia.ContainsKey(fecha) ? documentosPorDia[fecha] : 0
                    });
                }

                return resumenPorDia;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el resumen de documentos por los últimos cinco días desde la última fecha registrada", ex);
            }
        }
        public async Task<List<Afip>> ObtenerTodosLosDocumentosAFIP()
        {
            try
            {
                var documentos = await _repoAfip.Consultar();

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }
        public async Task<List<Afip>> ObtenerTodosLosDocumentosPorUsuario(int usuarioId)
        {
            try
            {
                var documentos = await _repoAfip.Consultar(d => d.UsuarioId == usuarioId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de AFIP", ex);
            }
        }
    }
}
