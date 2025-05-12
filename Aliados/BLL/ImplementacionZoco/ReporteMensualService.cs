using BLL.InterfacesZoco;
using DAL.DBContext;
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
    public class ReporteMensualService : IReporteMensualService
    {
        private readonly IGenericRepository<ReporteMensual> _reporeporte;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly zocowebContext _context;

        public ReporteMensualService(IGenericRepository<ReporteMensual> reporeporte, IGenericRepository<Usuario> repoUsuarios, zocowebContext context)
        {
            _reporeporte = reporeporte;
            _repoUsuario = repoUsuarios;
            _context = context;
        }

        public async Task<bool> ExisteReporteFecha(DateTime? fecha)
        {
            if (fecha == null)
            {
                return false;
            }

            var query = await _reporeporte.Consultar(r => r.FechaDePago == fecha.Value);
            bool existe = await query.AnyAsync();
            return existe;
        }


        public async Task<ReporteMensual> NuevoReporte(ReporteMensual reporteMensual)
        {
            if (reporteMensual == null)
                throw new ArgumentNullException(nameof(reporteMensual));

            return await _reporeporte.Crear(reporteMensual);
        }

        public async Task<List<ReporteMensual>> ObtenerListaReporte()
        {
            try
            {
                var documentos = await _reporeporte.Consultar();
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los Reportes", ex);
            }
        }

        public async Task<List<ReporteMensual>> ObtenerListaReporteMes(DateTime? fechames)
        {
            try
            {
                var documentos = await _reporeporte.Consultar();

                if (fechames.HasValue)
                {
                    var fecha = fechames.Value;
                    documentos = documentos.Where(d => d.FechaDePago == fecha.Date);
                }

                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los Reportes del mes", ex);
            }
        }

    }
}
