using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class CheckAsesoresService : IChechAsesores
    {
        private readonly IGenericRepository<BaseDashboard> _repoBaseDashBoard;
        private readonly IGenericRepository<CheckAsesore> _repoCheck;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IMemoryCache _memoryCache;

        public CheckAsesoresService(IGenericRepository<CheckAsesore> reposCheck, IGenericRepository<Usuario> repousuarios, IMemoryCache memoryCache)
        {
            _repoCheck = reposCheck;
            _repoUsuario = repousuarios;
            _memoryCache = memoryCache;
        }

        public async Task<CheckAsesore> Crear(CheckAsesore entidad)
        {
            if (entidad == null)
            {
                throw new ArgumentNullException(nameof(entidad), "La entidad CheckAsesore no puede ser null.");
            }

            try
            {
                await _repoCheck.Crear(entidad);


                return entidad;
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al crear el registro de CheckAsesore: {ex.Message}", ex);
            }
        }

        public async Task<List<CheckAsesore>> Lista()
        {
            var cacheKey = "CheckAsesoresList";

            if (!_memoryCache.TryGetValue(cacheKey, out List<CheckAsesore> cachedData))
            {
                IQueryable<CheckAsesore> query = await _repoCheck.Consultar();
                cachedData = query.ToList();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }
        public async Task<bool> ConfirmarCheck(int usuarioid)
        {
            var checksUsuarioQuery = await _repoCheck.Consultar(c => c.IdUser == usuarioid);

            var checksUsuario = await checksUsuarioQuery.ToListAsync();

            if (!checksUsuario.Any())
            {
                return true;
            }

            var ultimoCheck = checksUsuario.OrderByDescending(c => c.FechaHora).FirstOrDefault();

            if (ultimoCheck == null || !ultimoCheck.Tipo?.Equals("checkIn", StringComparison.OrdinalIgnoreCase) == true)
            {
                return false;
            }

            return false;
        }

        public async Task<List<CheckAsesore>> Listahoy(int id)
        {
            var fechaHoy = DateTime.Now.Date;
            var fechaHoyString = fechaHoy.ToString("dd/MM/yyyy");
            var cacheKey = $"Listahoy_{id}_{fechaHoyString}";

            if (!_memoryCache.TryGetValue(cacheKey, out List<CheckAsesore> cachedData))
            {
                IQueryable<CheckAsesore> query = await _repoCheck.Consultar(c => c.IdUser == id && c.FechaHora.StartsWith(fechaHoyString));
                cachedData = query.ToList() ?? new List<CheckAsesore>();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }


        public async Task<List<CheckAsesore>> Listames(string fecha)
        {
            // Parse the input date
            DateTime fechaFin = DateTime.ParseExact(fecha, "dd/MM/yyyy", null);

            // Get the first day of the month of the input date
            DateTime fechaInicio = new DateTime(fechaFin.Year, fechaFin.Month, 1);

            // Convert dates to string format
            string fechaInicioString = fechaInicio.ToString("yyyyMMdd");
            string fechaFinString = fechaFin.ToString("yyyyMMdd");

            // Query the database for records within the date range   27368394926
            var query = await _repoCheck.Consultar(c =>
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaInicioString) >= 0 &&
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaFinString) <= 0);

            return query.ToList();
        }



        public async Task<ResultadoProcesamiento> ProcesarUsuarioPorId(int id, DateTime fecha)
        {
            // Determinar el primer día del mes a partir de la fecha proporcionada
            DateTime fechaInicio = new DateTime(fecha.Year, fecha.Month, 1);

            // Determinar el último día del mes de la fecha proporcionada
            DateTime fechaFin = fechaInicio.AddMonths(1).AddDays(-1);

            // Convertir fechas a string en formato yyyyMMdd para la comparación
            string fechaInicioString = fechaInicio.ToString("yyyyMMdd");
            string fechaFinString = fechaFin.ToString("yyyyMMdd");

            // Obtener los registros del mes para el usuario en el rango de fechas
            var registros = await _repoCheck.Consultar(c =>
                c.IdUser == id &&
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaInicioString) >= 0 &&
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaFinString) <= 0);

            // Lista para almacenar registros válidos
            List<CheckAsesore> registrosValidos = new List<CheckAsesore>();

            // Validar formato de FechaHora y agregar registros válidos a la lista
            foreach (var registro in registros)
            {
                if (DateTime.TryParseExact(registro.FechaHora, "dd/MM/yyyy, HH:mm:ss", null, System.Globalization.DateTimeStyles.None, out _))
                {
                    registrosValidos.Add(registro);
                }
            }

            // Ordenar los registros válidos por fecha y hora
            var registrosOrdenados = registrosValidos
                .OrderBy(r => DateTime.ParseExact(r.FechaHora, "dd/MM/yyyy, HH:mm:ss", null))
                .ToList();

            // Inicializar variables de cálculo
            double totalHorasTrabajadas = 0.0;
            int diasTrabajados = 0;
            int fueraHorario = 0;

            // Agrupar los registros por usuario y día
            var registrosPorUsuarioYDia = registrosOrdenados
                .GroupBy(r => new { r.IdUser, Fecha = DateTime.ParseExact(r.FechaHora, "dd/MM/yyyy, HH:mm:ss", null).Date })
                .ToList();

            foreach (var grupo in registrosPorUsuarioYDia)
            {
                var registrosPorDia = grupo.OrderBy(r => DateTime.ParseExact(r.FechaHora, "dd/MM/yyyy, HH:mm:ss", null)).ToList();
                bool diaContado = false;

                for (int i = 0; i < registrosPorDia.Count; i++)
                {
                    var registroActual = registrosPorDia[i];
                    if (registroActual.Tipo.Trim().Equals("checkin", StringComparison.OrdinalIgnoreCase) &&
                        (i + 1 < registrosPorDia.Count) &&
                        registrosPorDia[i + 1].Tipo.Trim().Equals("checkout", StringComparison.OrdinalIgnoreCase))
                    {
                        var fechaCheckIn = DateTime.ParseExact(registroActual.FechaHora, "dd/MM/yyyy, HH:mm:ss", null);
                        var registroSiguiente = registrosPorDia[i + 1];
                        var fechaCheckOut = DateTime.ParseExact(registroSiguiente.FechaHora, "dd/MM/yyyy, HH:mm:ss", null);

                        var horasTrabajadas = (fechaCheckOut - fechaCheckIn).TotalHours;

                        totalHorasTrabajadas += horasTrabajadas;

                        // Verificar fuera de horario
                        if ((fechaCheckIn.TimeOfDay <= new TimeSpan(12, 0, 0) && fechaCheckIn.TimeOfDay > new TimeSpan(9, 5, 0)) ||
                            (fechaCheckIn.TimeOfDay > new TimeSpan(12, 0, 0) && fechaCheckIn.TimeOfDay > new TimeSpan(17, 5, 0)))
                        {
                            fueraHorario++;
                        }

                        // Incrementar días trabajados solo una vez por día
                        if (!diaContado)
                        {
                            diasTrabajados++;
                            diaContado = true;
                        }

                        i++; // Saltar al siguiente registro después de checkout
                    }
                }
            }

            // Crear y devolver el resultado del procesamiento
            var resultado = new ResultadoProcesamiento
            {
                UsuarioId = id,
                HorasTrabajadas = totalHorasTrabajadas,
                DiasTrabajados = diasTrabajados,
                FueraHorario = fueraHorario,
               
            };

            return resultado;
        }





        // Clase para encapsular el resultado del procesamiento
        public class ResultadoProcesamiento
        {
            public int UsuarioId { get; set; }
            public double HorasTrabajadas { get; set; }
            public int DiasTrabajados { get; set; }
            public int FueraHorario { get; set; }
           
        }
    }
}

