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
    public class CuestionarioService : ICuestionariosService
    {
        private readonly IGenericRepository<Cuestionario> _repoCuestionario;

        public CuestionarioService(IGenericRepository<Cuestionario> repoCuestionario)
        {
            _repoCuestionario = repoCuestionario;
        }
        public async Task<Cuestionario> Crear(Cuestionario nuevaCuestionario)
        {
            if (nuevaCuestionario == null)
                throw new ArgumentNullException(nameof(nuevaCuestionario), "La Cuestionario no puede ser nula.");

            return await _repoCuestionario.Crear(nuevaCuestionario);
        }

        public async Task<Cuestionario> Editar(Cuestionario CuestionarioEditada)
        {
            if (CuestionarioEditada == null)
                throw new ArgumentNullException(nameof(CuestionarioEditada), "La respuesta no puede ser nula.");

            var respuestaExistente = await _repoCuestionario.Obtener(r => r.Id == CuestionarioEditada.Id);
            if (respuestaExistente == null)
                throw new KeyNotFoundException("No se encontró la respuesta a editar.");

            await _repoCuestionario.Editar(CuestionarioEditada);
            return CuestionarioEditada;
        }

        public async Task<bool> Eliminar(int CuestionarioId)
        {
            var respuesta = await _repoCuestionario.Obtener(r => r.Id == CuestionarioId);
            if (respuesta == null)
                throw new KeyNotFoundException("No se encontró la respuesta a eliminar.");

            return await _repoCuestionario.Eliminar(respuesta);
        }

        public async Task<List<Cuestionario>> Obtener()
        {
            var consulta = await _repoCuestionario.Consultar();
            return consulta.ToList();
        }

        public async Task<Cuestionario> ObtenerPorId(int CuestionarioId)
        {
            return await _repoCuestionario.Obtener(r => r.Id == CuestionarioId);
        }

        public async Task<List<Cuestionario>> ObtenerPorIdPuesto(int PuestoId)
        {
            var consulta = await _repoCuestionario.ConsultarListaAsync(r => r.IdPuesto == PuestoId);
            return consulta;
        }
    }
}
