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
    public class EducacionService : IEducacionService
    {
        private readonly IGenericRepository<Educacion> _repoEducacion;

        public EducacionService(IGenericRepository<Educacion> repoEducacion)
        {
            _repoEducacion = repoEducacion;

        }
        public async Task<Educacion> Crear(Educacion documento)
        {
            try
            {
                return await _repoEducacion.Crear(documento);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<List<Educacion>> ObtenerTodosEducacionPorPostulanteId(int PostulanteId)
        {
            try
            {
                var documentos = await _repoEducacion.Consultar(d => d.IdPostulante == PostulanteId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos los documentos de IIBB", ex);
            }
        }
    }
}
