using BLL.InterfacesZoco;
using DAL.Interfaces;
using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL.ImplementacionZoco
{
    public class CheckAsesoresImagenService : ICheckImagenService
    {
        private readonly IGenericRepository<BaseDashboard> _repoBaseDashBoard;
        private readonly IGenericRepository<CheckAsesoresImagen> _repoCheck;
        private readonly IMemoryCache _memoryCache;

        public CheckAsesoresImagenService(IGenericRepository<CheckAsesoresImagen> reposCheck, IMemoryCache memoryCache)
        {
            _repoCheck = reposCheck;
            _memoryCache = memoryCache;
        }


        public async Task<CheckAsesoresImagen> AgregarObservacionAdmin(int? id, bool calificacion, string ObservacionAdmin)
        {
            CheckAsesoresImagen usuario_existe = await _repoCheck.Obtener(u => u.Id == id);

            if (usuario_existe == null)
            {
                throw new Exception("Usuario no encontrado");
            }

            usuario_existe.Calificacion = calificacion;
            usuario_existe.ObservacionAdmin = ObservacionAdmin;

            // Obtener la hora actual en UTC
            DateTime utcNow = DateTime.UtcNow;

            // Obtener la zona horaria de Argentina
            TimeZoneInfo argTimeZone = TimeZoneInfo.FindSystemTimeZoneById("Argentina Standard Time");

            // Convertir la hora UTC a la hora de Argentina
            DateTime argTime = TimeZoneInfo.ConvertTimeFromUtc(utcNow, argTimeZone);

            usuario_existe.FechaDevolucion = argTime;

            await _repoCheck.Editar(usuario_existe);

            return usuario_existe;
        }


        public async Task<CheckAsesoresImagen> Crear(CheckAsesoresImagen entidad)
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
        public async Task<List<CheckAsesoresImagen>> Lista()
        {
            IQueryable<CheckAsesoresImagen> query = await _repoCheck.Consultar();
            return query.ToList();
        }

        public async Task<List<CheckAsesoresImagen>> Listaimagen(string fecha)
        {
            try
            {
                if (DateTime.TryParseExact(fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out var fechaFiltro))
                {
                    string fechaTexto = fechaFiltro.ToString("dd/MM/yyyy");
                    var cacheKey = $"CheckAsesoresImagen_{fechaTexto}";

                    // Intentar obtener la lista del caché
                    if (!_memoryCache.TryGetValue(cacheKey, out List<CheckAsesoresImagen> cachedData))
                    {
                        // Si no está en el caché, consultar los datos
                        IQueryable<CheckAsesoresImagen> query = await _repoCheck.Consultar(x => x.FechaHora != null && x.FechaHora.StartsWith(fechaTexto));
                        cachedData = query.ToList();

                        // Guardar en el caché por 10 minutos
                        var cacheEntryOptions = new MemoryCacheEntryOptions()
                            .SetSlidingExpiration(TimeSpan.FromMinutes(1));

                        _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
                    }

                    return cachedData;
                }
                else
                {
                    throw new ArgumentException("Formato de fecha no válido.");
                }
            }
            catch (Exception ex)
            {
                throw new Exception($"Error al listar los registros: {ex.Message}", ex);
            }
        }



        public async Task<List<CheckAsesoresImagen>> ListaAsesor(int AsesorId)
        {
            var cacheKey = $"ListaAsesor_{AsesorId}";

            if (!_memoryCache.TryGetValue(cacheKey, out List<CheckAsesoresImagen> cachedData))
            {
                IQueryable<CheckAsesoresImagen> checksUsuarioQuery = await _repoCheck.Consultar(c => c.IdUser == AsesorId);
                cachedData = checksUsuarioQuery.ToList();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }

        public async Task<List<CheckAsesoresImagen>> Listahoy(int id)
        {
            var fechaHoy = DateTime.Now.Date;
            var fechaHoyString = fechaHoy.ToString("dd/MM/yyyy");

            IQueryable<CheckAsesoresImagen> query = await _repoCheck.Consultar(c => c.IdUser == id && c.FechaHora.StartsWith(fechaHoyString));
            return query.ToList();
        }
        public async Task<(int TotalRegistros, int Desaprobados)> Listames(int id)
        {
            var cacheKey = $"Listames_{id}";

            if (!_memoryCache.TryGetValue(cacheKey, out (int TotalRegistros, int Desaprobados) cachedData))
            {
                var fechaHoy = DateTime.Now.Date;
                var primerDiaMes = new DateTime(fechaHoy.Year, fechaHoy.Month, 1);

                // Convertir la fecha al formato usado en la base de datos
                string primerDiaMesString = primerDiaMes.ToString("yyyyMMdd");

                // Obtener la consulta y aplicar el filtro
                var query = await _repoCheck.Consultar(c =>
                    c.IdUser == id &&
                    string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), primerDiaMesString) >= 0);

                int totalRegistros = 0;
                int desaprobados = 0;

                if (query != null)
                {
                    totalRegistros = await query.CountAsync();
                    desaprobados = await query.CountAsync(item => item.Calificacion.HasValue && !item.Calificacion.Value);
                }

                cachedData = (totalRegistros, desaprobados);

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); 

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }


        public async Task<CheckAsesoresImagen> ObtenerCheckImagenPorId(int id)
        {
            var cacheKey = $"ObtenerCheckImagenPorId_{id}";

            if (!_memoryCache.TryGetValue(cacheKey, out CheckAsesoresImagen cachedData))
            {
                CheckAsesoresImagen obtener = await _repoCheck.Obtener(u => u.Id == id);

                if (obtener != null)
                {
                    cachedData = obtener;

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                    _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
                }
                else
                {
                    return null;
                }
            }

            return cachedData;
        }

        public async Task<List<CheckAsesoresImagen>> ListaMesImagen(string fecha)
        {
            // Parse the input date
            DateTime fechaFin = DateTime.ParseExact(fecha, "dd/MM/yyyy", null);

            // Get the first day of the month of the input date
            DateTime fechaInicio = new DateTime(fechaFin.Year, fechaFin.Month, 1);

            // Convert dates to string format
            string fechaInicioString = fechaInicio.ToString("yyyyMMdd");
            string fechaFinString = fechaFin.ToString("yyyyMMdd");

            // Query the database for records within the date range
            var query = await _repoCheck.Consultar(c =>
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaInicioString) >= 0 &&
                string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), fechaFinString) <= 0);

            return query.ToList();
        }

        public async Task<List<CheckAsesoresImagen>> ListaAsesor2(int AsesorId, DateTime fecha)
        {
            string fechaTexto = fecha.ToString("dd/MM/yyyy");
            var cacheKey = $"ListaAsesor_{AsesorId}_{fechaTexto}";

            if (!_memoryCache.TryGetValue(cacheKey, out List<CheckAsesoresImagen> cachedData))
            {
                IQueryable<CheckAsesoresImagen> checksUsuarioQuery = await _repoCheck.Consultar(c => c.IdUser == AsesorId && c.FechaHora != null && c.FechaHora.StartsWith(fechaTexto));
                cachedData = checksUsuarioQuery.ToList();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }

       
            public async Task<(int TotalRegistros, int Desaprobados, int Visitas, int Prospectos, string Promedio)> ProcesarUsuarioPorId(int id, DateTime fecha)
            {
                var cacheKey = $"ProcesarUsuarioPorId_{id}_{fecha:yyyyMM}";

                if (!_memoryCache.TryGetValue(cacheKey, out (int TotalRegistros, int Desaprobados, int Visitas, int Prospectos, string Promedio) cachedData))
                {
                    // Determinar el primer y último día del mes de la fecha proporcionada
                    DateTime primerDiaMes = new DateTime(fecha.Year, fecha.Month, 1);
                    DateTime ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                    // Convertir las fechas al formato utilizado en la base de datos
                    string primerDiaMesString = primerDiaMes.ToString("yyyyMMdd");
                    string ultimoDiaMesString = ultimoDiaMes.ToString("yyyyMMdd");

                    // Obtener la consulta y aplicar el filtro basado en el rango de fechas
                    var query = await _repoCheck.Consultar(c =>
                        c.IdUser == id &&
                        string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), primerDiaMesString) >= 0 &&
                        string.Compare(c.FechaHora.Substring(6, 4) + c.FechaHora.Substring(3, 2) + c.FechaHora.Substring(0, 2), ultimoDiaMesString) <= 0);

                    int totalRegistros = 0;
                    int desaprobados = 0;
                    int visitas = 0;
                    int prospectos = 0;
                    List<TimeSpan> tiemposAudio = new List<TimeSpan>();

                    if (query != null)
                    {
                        totalRegistros = await query.CountAsync();
                        desaprobados = await query.CountAsync(item => item.Calificacion.HasValue && !item.Calificacion.Value);
                        prospectos = await query.CountAsync(item => item.Tipo == "Prospecto");
                        visitas = totalRegistros - prospectos;

                        // Filtrar y procesar los tiempos de audio válidos
                        foreach (var item in query)
                        {
                            if (TimeSpan.TryParse(item.TiempoAudio, out TimeSpan tiempo))
                            {
                                tiemposAudio.Add(tiempo);
                            }
                        }
                    }

                    // Calcular el promedio de tiempos de audio, si hay datos válidos
                    string promedio = tiemposAudio.Any() ?
                        new TimeSpan((long)tiemposAudio.Average(t => t.Ticks)).ToString(@"hh\:mm\:ss") :
                        "00:00:00";

                    cachedData = (totalRegistros, desaprobados, visitas, prospectos, promedio);

                    var cacheEntryOptions = new MemoryCacheEntryOptions()
                        .SetSlidingExpiration(TimeSpan.FromMinutes(1));

                    _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
                }

                return cachedData;
            }
        }



    }
