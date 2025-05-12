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
    public class ReferenciaService : IReferenciaService
    {
        private readonly IGenericRepository<Referencia> _repoReferencia;

        public ReferenciaService(IGenericRepository<Referencia> repoReferencia)
        {
            _repoReferencia = repoReferencia;

        }
  

     
        public async Task<Referencia> Crear(Referencia cargosAnteriore)
        {
            try
            {
                return await _repoReferencia.Crear(cargosAnteriore);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<List<Referencia>> ObtenerTodosPor(int PostulanteId)
        {
            try
            {
                var documentos = await _repoReferencia.Consultar(d => d.IdEmpleo == PostulanteId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos cargos anteriores", ex);
            }
        }
    }
}
