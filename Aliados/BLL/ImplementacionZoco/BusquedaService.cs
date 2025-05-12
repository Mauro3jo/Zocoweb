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
    public class BusquedaService : IBusquedaService
    {
        private readonly IGenericRepository<Busqueda> _repoBusqueda;

        public BusquedaService(IGenericRepository<Busqueda> repobusqueda)
        {
            _repoBusqueda = repobusqueda;

        }

        public async Task<Busqueda> CrearBusquedaAsync(Busqueda busqueda)
        {
            return await _repoBusqueda.Crear(busqueda);
        }
        public async Task<Busqueda> EditarBusquedaAsync(int id, Busqueda busqueda)
        {

            var existente = await _repoBusqueda.Obtener(b => b.Id == id);
            if (existente == null) throw new Exception("Busqueda no encontrada.");


            existente.Nombre = busqueda.Nombre ?? existente.Nombre;
            existente.FechaPuesto = busqueda.FechaPuesto ?? existente.FechaPuesto;
            existente.Provincia = busqueda.Provincia ?? existente.Provincia;
            existente.Cantidad = busqueda.Cantidad ?? existente.Cantidad;
            existente.FechaCierre = busqueda.FechaCierre ?? existente.FechaCierre;
            existente.Estado = busqueda.Estado ?? existente.Estado;
            existente.CantidadDeSolicitantes = busqueda.CantidadDeSolicitantes ?? existente.CantidadDeSolicitantes;
            existente.Seleccionados = busqueda.Seleccionados ?? existente.Seleccionados;
            existente.Finalistas = busqueda.Finalistas ?? existente.Finalistas;
            existente.Contratados = busqueda.Contratados ?? existente.Contratados;
            existente.Rechazados = busqueda.Rechazados ?? existente.Rechazados;
            existente.Observaciones = busqueda.Observaciones ?? existente.Observaciones;


            await _repoBusqueda.Editar(existente);
            return existente;
        }

        public Task EditarBusquedaAsync(Busqueda busqueda)
        {
            throw new NotImplementedException();
        }

        public async Task<bool> EliminarBusquedaAsync(int id)
        {
            var busqueda = await _repoBusqueda.Obtener(b => b.Id == id);
            if (busqueda == null) throw new Exception("Busqueda no encontrada para eliminar.");

            return await _repoBusqueda.Eliminar(busqueda);
        }

        public Task<bool> EliminarBusquedaAsync(int? id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Busqueda>> ListarBusquedasAsync()
        {
            var busquedas = await _repoBusqueda.Consultar();
            return busquedas.ToList();
        }

        public async Task<IEnumerable<Busqueda>> ListarBusquedasPorMesAsync(int mes)
        {
            var busquedas = await _repoBusqueda.Consultar(b => b.FechaPuesto.HasValue && b.FechaPuesto.Value.Month == mes);
            return busquedas.ToList();
        }

        public async Task<Busqueda> ObtenerBusqueda(int? id)
        {
            var busqueda = await _repoBusqueda.Obtener(b => b.Id == id.Value);
            return busqueda;
        }

        public async Task<object> ObtenerSumatoriaORegistroEspecifico(int? id)
        {
            if (id == null)
            {
                var busquedas = await _repoBusqueda.Consultar();
                var sumatoria = busquedas.Select(b => new
                {
                    CantidadDeSolicitantes = ConvertToInt(b.CantidadDeSolicitantes),
                    Seleccionados = ConvertToInt(b.Seleccionados),
                    Finalistas = ConvertToInt(b.Finalistas),
                    Contratados = ConvertToInt(b.Contratados),
                    Rechazados = ConvertToInt(b.Rechazados),
                }).Aggregate((acc, x) => new
                {
                    CantidadDeSolicitantes = acc.CantidadDeSolicitantes + x.CantidadDeSolicitantes,
                    Seleccionados = acc.Seleccionados + x.Seleccionados,
                    Finalistas = acc.Finalistas + x.Finalistas,
                    Contratados = acc.Contratados + x.Contratados,
                    Rechazados = acc.Rechazados + x.Rechazados,
                });

                return new
                {
                    Nombre = "Todos",
                    Sumatoria = sumatoria
                };
            }
            else
            {
                var busqueda = await _repoBusqueda.Obtener(b => b.Id == id.Value);
                if (busqueda == null)
                {
                    throw new Exception("Busqueda no encontrada.");
                }
                return new
                {
                    busqueda.Id,
                    busqueda.Nombre,
                    busqueda.CantidadDeSolicitantes,
                    busqueda.Seleccionados,
                    busqueda.Finalistas,
                    busqueda.Contratados,
                    busqueda.Rechazados,
                    busqueda.Observaciones
                };
            }
        }

        private int ConvertToInt(string value)
        {
            try
            {
                return int.Parse(value ?? "0");
            }
            catch
            {
                return 0; 
            }
        }

        async Task<Busqueda> IBusquedaService.EditarBusquedaAsync(Busqueda busqueda)
        {
            var existente = await _repoBusqueda.Obtener(b => b.Id == busqueda.Id);
            if (existente == null) throw new Exception("Busqueda no encontrada.");


            existente.Nombre = busqueda.Nombre ?? existente.Nombre;
            existente.FechaPuesto = busqueda.FechaPuesto ?? existente.FechaPuesto;
            existente.Provincia = busqueda.Provincia ?? existente.Provincia;
            existente.Cantidad = busqueda.Cantidad ?? existente.Cantidad;
            existente.FechaCierre = busqueda.FechaCierre ?? existente.FechaCierre;
            existente.Estado = busqueda.Estado ?? existente.Estado;
            existente.CantidadDeSolicitantes = busqueda.CantidadDeSolicitantes ?? existente.CantidadDeSolicitantes;
            existente.Seleccionados = busqueda.Seleccionados ?? existente.Seleccionados;
            existente.Finalistas = busqueda.Finalistas ?? existente.Finalistas;
            existente.Contratados = busqueda.Contratados ?? existente.Contratados;
            existente.Rechazados = busqueda.Rechazados ?? existente.Rechazados;
            existente.Observaciones = busqueda.Observaciones ?? existente.Observaciones;


            await _repoBusqueda.Editar(existente);
            return existente;
        }
    }

}

