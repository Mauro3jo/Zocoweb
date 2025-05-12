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
    public class FacturanteService : IFacturanteService
    {
        private readonly IGenericRepository<Facturante> _repoFacturante;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public FacturanteService(IGenericRepository<Facturante> repofacturante, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoFacturante = repofacturante;
            _repoUsuario = repoUsuarios;

        }

        public async Task<Facturante> CrearDocumentoFacturanteUsuario(Facturante documento)
        {
            try
            {
                return await _repoFacturante.Crear(documento);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<bool> ExisteDocumentoEnFechaFacturante(int usuarioId, DateTime? fecha)
        {
            if (fecha == null)
            {
                return false;
            }

            var query = await _repoFacturante.Consultar(d =>
                d.UsuarioId == usuarioId &&
                d.FechaSubida.HasValue &&
                d.FechaSubida.Value.Date == fecha.Value.Date);

            var documentos = await query.ToListAsync();

            return documentos.Any();
        }

        public async Task<IEnumerable<Facturante>> ObtenerDocumentosFacturantePorUsuarioYFecha(int usuarioId, DateTime fecha)
        {
            try
            {
                IQueryable<Facturante> query = await _repoFacturante.Consultar(d =>
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

        public async Task<List<object>> ObtenerResumenDocumentosFacturantePorUltimosCincoDiasRegistrados()
        {
            try
            {
                var consultaDocumentos = await _repoFacturante.Consultar();

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
        public async Task<List<Facturante>> ObtenerTodosLosDocumentosFacturante()
        {
            try
            {
                var documentos = await _repoFacturante.Consultar();
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de Facturante", ex);
            }
        }
        public async Task<List<Facturante>> ObtenerTodosLosDocumentosPorUsuario(int usuarioId)
        {
            try
            {
                var documentos = await _repoFacturante.Consultar(d => d.UsuarioId == usuarioId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de Facturante", ex);
            }
        }
    }
}
