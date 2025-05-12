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
    public class AptitudService : IAptitudService
    {
        private readonly IGenericRepository<Aptitud> _repoAptitud;

        public AptitudService(IGenericRepository<Aptitud> repoAptitud)
        {
            _repoAptitud = repoAptitud;

        }

        public async Task<Aptitud> Crear(Aptitud documento)
        {
            try
            {
                return await _repoAptitud.Crear(documento);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<List<Aptitud>> ObtenerTodosAptitudPorEducacion(int EducacionId)
        {
            try
            {
                var documentos = await _repoAptitud.Consultar(d => d.IdEducacion == EducacionId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de IIBB", ex);
            }
        }

        public async Task<List<Aptitud>> ObtenerTodosAptitudPorPostulanteId(int PostulanteId)
        {
            try
            {
                var documentos = await _repoAptitud.Consultar(d => d.IdPostulante == PostulanteId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de IIBB", ex);
            }
        }
    }
}
