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
    public class PDFService : IPDFService
    {
        private readonly IGenericRepository<DocumentosUsuario> _repoPDF;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public PDFService(IGenericRepository<DocumentosUsuario> repoPDF, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoPDF = repoPDF;
            _repoUsuario = repoUsuarios;

        }
      
        public async Task<DocumentosUsuario> CrearDocumentoUsuario(DocumentosUsuario documento)
        {
            try
            {
                return await _repoPDF.Crear(documento);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<IEnumerable<DocumentosUsuario>> ObtenerDocumentosPorUsuarioYFecha(int usuarioId, DateTime fecha)
        {
            try
            {
                IQueryable<DocumentosUsuario> query = await _repoPDF.Consultar(d =>
            d.UsuarioId == usuarioId &&
            d.FechaSubida.HasValue &&
            d.FechaSubida.Value.Date == fecha.Date);

                var documentos = await query.ToListAsync();
                return documentos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener documentos por usuario y fecha", ex);
            }
        }
        public async Task<bool> ExisteDocumentoEnFecha(int usuarioId, DateTime? fecha)
        {
            if (fecha == null)
            {
                return false;
            }

            var query = await _repoPDF.Consultar(d =>
                d.UsuarioId == usuarioId &&
                d.FechaSubida.HasValue &&
                d.FechaSubida.Value.Date == fecha.Value.Date);

            var documentos = await query.ToListAsync();

            return documentos.Any();
        }
        public async Task<List<object>> ObtenerResumenDocumentosPorUltimosCincoDiasRegistrados()
        {
            try
            {
                var consultaDocumentos = await _repoPDF.Consultar();

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
        public async Task<List<DocumentosUsuario>> ObtenerListaPdf(DateTime fecha)
        {
            try
            {
                // Esperar el resultado de la consulta
                var query = await _repoPDF.Consultar(d =>
                    d.FechaSubida.HasValue &&
                    d.FechaSubida.Value.Date == fecha.Date);

                // Proyectar los resultados para excluir DocumentoPdf
                var documentos = await query
                    .Select(d => new DocumentosUsuario
                    {
                        DocumentoId = d.DocumentoId,
                        UsuarioId = d.UsuarioId,
                        NombreDocumento = d.NombreDocumento,
                        Cuit = d.Cuit,
                        FechaSubida = d.FechaSubida,
                        Usuario = d.Usuario // Si es necesario incluir la relación
                    })
                    .ToListAsync();

                return documentos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la lista de documentos PDF por fecha", ex);
            }
        }



        public async Task<List<DocumentosUsuario>> ObtenerListaPdfPorCuit(DateTime fecha, string cuit, string id)
        {
            try
            {
                IQueryable<DocumentosUsuario> query;

                if (!string.IsNullOrEmpty(cuit))
                {
                    // Filtrar por CUIT si está presente
                    query = await _repoPDF.Consultar(d =>
                        d.Cuit == cuit &&
                        d.FechaSubida.HasValue &&
                        d.FechaSubida.Value.Date == fecha.Date);
                }
                else
                {
                    // Filtrar por ID si no hay CUIT
                    query = await _repoPDF.Consultar(d =>
                        d.DocumentoId.ToString() == id &&
                        d.FechaSubida.HasValue &&
                        d.FechaSubida.Value.Date == fecha.Date);
                }

                // Convertir la consulta en una lista
                var documentos = await query.ToListAsync();

                return documentos;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener la lista de documentos PDF", ex);
            }
        }

    }
}

    
