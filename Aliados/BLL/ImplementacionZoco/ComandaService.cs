using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class ComandaService : IComandaService
    {
        private readonly IGenericRepository<Actividade> _repoComanda;
        private readonly IGenericRepository<Usuario> _repoUsuario;

        public ComandaService(IGenericRepository<Actividade> repocomanda, IGenericRepository<Usuario> repoUsuarios)
        {
            _repoComanda = repocomanda;
            _repoUsuario = repoUsuarios;

        }
        public async Task<Actividade> CrearComandaAsync(Actividade busqueda)
        {
            if (busqueda == null)
                throw new ArgumentNullException(nameof(busqueda));

            return await _repoComanda.Crear(busqueda);
        }


        public async Task<Actividade> EditarComandaAsync(Actividade comandaActualizada)
        {
            if (comandaActualizada == null)
            {
                throw new ArgumentNullException(nameof(comandaActualizada));
            }

            var comandaExistente = await _repoComanda.Obtener(a => a.Id == comandaActualizada.Id);
            if (comandaExistente == null)
            {
                throw new KeyNotFoundException("La actividad no fue encontrada.");
            }

            comandaExistente.Motivo = comandaActualizada.Motivo ?? comandaExistente.Motivo;
            comandaExistente.Iduser = comandaActualizada.Iduser ?? comandaExistente.Iduser;
            comandaExistente.Idgestor = comandaActualizada.Idgestor ?? comandaExistente.Idgestor;
            comandaExistente.FechaApertura = comandaActualizada.FechaApertura ?? comandaExistente.FechaApertura;
            comandaExistente.FechaCierre = comandaActualizada.FechaCierre ?? comandaExistente.FechaCierre;
            comandaExistente.Finalizado = comandaActualizada.Finalizado ?? comandaExistente.Finalizado;
            comandaExistente.Direccion = comandaActualizada.Direccion ?? comandaExistente.Direccion;
            comandaExistente.ObservacionAliado = comandaActualizada.ObservacionAliado ?? comandaExistente.ObservacionAliado;
            comandaExistente.ObservacionAdministracion = comandaActualizada.ObservacionAdministracion ?? comandaExistente.ObservacionAdministracion;
            comandaExistente.ObservacionGestor = comandaActualizada.ObservacionGestor ?? comandaExistente.ObservacionGestor;
            comandaExistente.Estado = comandaActualizada.Estado ?? comandaExistente.Estado;
            comandaExistente.NombredelComercio = comandaActualizada.NombredelComercio ?? comandaExistente.NombredelComercio;
            comandaExistente.Cuit = comandaActualizada.Cuit ?? comandaExistente.Cuit;
            comandaExistente.Provincia = comandaActualizada.Provincia ?? comandaExistente.Provincia;
            comandaExistente.NumeroTerminal = comandaActualizada.NumeroTerminal ?? comandaExistente.NumeroTerminal;
            comandaExistente.NumeroTelefono = comandaActualizada.NumeroTelefono ?? comandaExistente.NumeroTelefono;

            await _repoComanda.Editar(comandaExistente);
            return comandaExistente;
        }


       

        public Task<IEnumerable<Actividade>> ListarBusquedasAsync()
        {
            throw new NotImplementedException();
        }
        public async Task<IEnumerable<Actividade>> ListarComandasAsync()
        {
            return await _repoComanda.Consultar();
        }

        public async Task<IEnumerable<Actividade>> ListarComandasPorUsuarioAsync(int idUser)
        {
            return await _repoComanda.Consultar(a => a.Iduser == idUser);
        }
        public async Task<IEnumerable<Actividade>> ListarComandasPorGestorAsync(int idGestor)
        {
            DateTime today = DateTime.Today; 
            return await _repoComanda.Consultar(a =>
                a.Idgestor == idGestor &&
                (
                    (a.Estado == "completado" && a.FechaCierre.HasValue && a.FechaCierre.Value.Date == today) ||
                    (a.Estado == "pendiente")
                )
            );
        }





        public Task<bool> EliminarComandaAsync(int? id)
        {
            throw new NotImplementedException();
        }

        public async Task<Actividade> ListarComandaAsync(int id)
        {
            var contratados = await _repoComanda.Obtener(b => b.Id == id);



            return contratados;

        }
       

       async Task<List<Actividade>> IComandaService.ListarComandasAsync()
        {
            IQueryable<Actividade> query = await _repoComanda.Consultar();
            return query.ToList();
        }
        //public async Task<List<Actividade>> ListarTodasComandasAsync(DateTime fecha)
        //{
        //    IQueryable<Actividade> query = await _repoComanda.Consultar();

        //    // Filtrar las comandas por la fecha de apertura
        //    query = query.Where(com => com.FechaApertura.HasValue && com.FechaApertura.Value.Date == fecha.Date);

        //    return query.ToList();
        //}

        public Task<Actividade> ListarComandaHoy(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Actividade>> ListaComandasPorGestorPendientes(int idGestor)
        {
            DateTime today = DateTime.Today;
            var query = await _repoComanda.Consultar(a =>
                a.Idgestor == idGestor &&
                (a.Estado == "pendiente")
            );

            var resultList = query.ToList();

            return resultList.Count > 0 ? resultList : new List<Actividade>(); // Devuelve una lista vacía si no encuentra resultados
        }

        async Task<IEnumerable<Actividade>> IComandaService.ListarTodasComandasAsync(DateTime fecha)
        {
            // Obtener el primer día del mes de la fecha proporcionada
            DateTime primerDiaMes = new DateTime(fecha.Year, fecha.Month, 1);

            IQueryable<Actividade> query = await _repoComanda.Consultar();

            // Filtrar las comandas desde el primer día del mes hasta la fecha proporcionada o que estén pendientes
            query = query.Where(com =>
                (com.FechaApertura.HasValue && com.FechaApertura.Value.Date >= primerDiaMes && com.FechaApertura.Value.Date <= fecha.Date)
                || com.Estado == "pendiente");

            return query.ToList();
        }


        public Task<IEnumerable<object>> ListarTodasComandasAsync(DateTime fecha)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Actividade>> ListarComandasPorMes(DateTime fecha)
        {
            // Obtener el primer día del mes de la fecha proporcionada
            DateTime primerDiaMes = new DateTime(fecha.Year, fecha.Month, 1);

            // Filtrar las comandas desde el primer día del mes hasta la fecha proporcionada
            var query = await _repoComanda.Consultar(com => com.FechaApertura.HasValue
                && com.FechaApertura.Value.Date >= primerDiaMes
                && com.FechaApertura.Value.Date <= fecha.Date);

            return query.ToList();
        }


        public async Task<Actividade> CerrarComandaConCheck(int id, int user)
        {
            var comanda = await _repoComanda.Obtener(c => c.Id == id);

            if (comanda == null)
            {
                throw new Exception($"Comanda with ID {id} not found.");
            }

            comanda.Estado = "completado";
            comanda.Idcierregestion = user;
            // Set FechaCierre to the current date and time in Argentina
            DateTime utcNow = DateTime.UtcNow;
            TimeZoneInfo argTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");
            DateTime argTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, argTimeZone);
            comanda.FechaCierre = argTime;

            var result = await _repoComanda.Editar(comanda);

            if (!result)
            {
                throw new Exception("Failed to update comanda.");
            }

            return comanda;
        }

       
    }
}
