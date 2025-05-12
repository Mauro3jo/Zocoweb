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
    public class CargosAnterioresService : ICargosAnteriores
    {
     
        private readonly IGenericRepository<CargosAnteriore> _repoCargosAnteriores;

        public CargosAnterioresService(IGenericRepository<CargosAnteriore> repocargosanteriores)
        {
          _repoCargosAnteriores = repocargosanteriores;

        }
        public async Task<CargosAnteriore> Crear(CargosAnteriore cargosAnteriore)
        {
            try
            {
                return await _repoCargosAnteriores.Crear(cargosAnteriore);
            }
            catch (Exception ex)
            {
                throw new Exception("Error al crear el documento", ex);
            }
        }

        public async Task<List<CargosAnteriore>> ObtenerTodosPor(int PostulanteId)
        {
            try
            {
                var documentos = await _repoCargosAnteriores.Consultar(d => d.IdPostulante == PostulanteId);
                return await documentos.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener todos cargos anteriores", ex);
            }
        }
    }
}
