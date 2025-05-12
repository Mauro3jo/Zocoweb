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
    public class ContratadoService : IContratadoService
    {
        private readonly IGenericRepository<Contratado> _repoContratado;
        public ContratadoService(IGenericRepository<Contratado> repocontratado)
        {
            _repoContratado = repocontratado;

        }
        public async Task<Contratado> CrearBusquedaAsync(Contratado busqueda)
        {
            return await _repoContratado.Crear(busqueda);
        }

        public async Task<Contratado> EditarBusquedaAsync(int id, Contratado contratado)
        {
            var existente = await _repoContratado.Obtener(b => b.Id == id);
            if (existente == null) throw new Exception("contratado no encontrada.");


           
            existente.Nombre=contratado.Nombre ?? existente.Nombre;
            existente.Edad=contratado.Edad ?? existente.Edad;
            existente.Dni= contratado.Dni ?? existente.Dni;
            existente.Direccion= contratado.Direccion ?? existente.Direccion;
            existente.Email= contratado.Email ?? existente.Email;
            existente.Foto= contratado .Foto ?? existente.Foto;
            existente.BusquedaId=contratado.BusquedaId ?? existente.BusquedaId;
            existente.Puesto=contratado.Puesto ?? existente.Puesto;
            existente.FechaEntrevista=contratado.FechaEntrevista ?? existente.FechaEntrevista;
            existente.FechaDeContratacion = contratado.FechaDeContratacion ?? existente.FechaDeContratacion;
            existente.TipoDeContratacion=contratado.TipoDeContratacion??existente.TipoDeContratacion;
            existente.Estado= contratado.Estado ?? existente.Estado;
            existente.FechaDeCierre=contratado.FechaDeCierre ?? existente.FechaDeCierre;
            existente.Observacion=contratado.Observacion ?? existente.Observacion;
            await _repoContratado.Editar(existente);
            return existente;
        }

        public async Task<bool> EliminarBusquedaAsync(int id)
        {
            var contatadol = await _repoContratado.Obtener(b => b.Id == id);
            if (contatadol == null) throw new Exception("Contratado no encontrada para eliminar.");

            return await _repoContratado.Eliminar(contatadol);
        }

        public async Task<IEnumerable<Contratado>> ListarBusquedasAsync()
        {
            var contatadol = await _repoContratado.Consultar();
            return contatadol.ToList();
        }

        public async Task<IEnumerable<Contratado>> ListarBusquedasPorMesAsync(int mes)
        {
            var contatadol = await _repoContratado.Consultar(b => b.FechaDeContratacion.HasValue && b.FechaDeContratacion.Value.Month == mes);
            return contatadol.ToList();
        }

        public async Task<Contratado> Obtenercontratados(int? id)
        {
           
                var contratados = await _repoContratado.Obtener(b => b.Id == id.Value);
          


            return contratados;
            
        }
    }
}
