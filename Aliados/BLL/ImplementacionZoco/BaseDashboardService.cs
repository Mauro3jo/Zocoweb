using BLL.InterfacesZoco;
using DAL.Interfaces;

using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace BLL.ImplementacionZoco
{
    public class BaseDashboardService : IBaseDashboardService
    {
        private readonly IGenericRepository<BaseDashboard> _repoBaseDashBoard;
        private readonly IGenericRepository<Usuario> _repoUsuario;
        private readonly IMemoryCache _memoryCache;
        private readonly IInflacionService _InflacionService;
        public BaseDashboardService(IGenericRepository<BaseDashboard> repobasedashboard, IGenericRepository<Usuario> repoUsuarios,
            IMemoryCache memoryCache, IInflacionService inflacionService)
        {
            _repoBaseDashBoard = repobasedashboard;
            _repoUsuario = repoUsuarios;
            _memoryCache = memoryCache;
            _InflacionService = inflacionService;
        }
        // Implementar el nuevo método en la clase BaseDashboardService
        public async Task<List<(string Fecha, decimal TotalBruto, decimal TotalBrutoDebito, int CantidadDebito, decimal TotalBrutoCredito, int CantidadCredito, decimal TotalBruto1Pago, int Cantidad1Pago)>> DatosCuitPorFechaOperacionDiaria(string CuitAliado, string NumeroTerminal, DateTime Fecha)
        {
            // Validación inicial
            if (string.IsNullOrEmpty(CuitAliado) || string.IsNullOrEmpty(NumeroTerminal))
            {
                throw new ArgumentException("El CUIT o el Número de Terminal no pueden ser nulos o vacíos.");
            }

            if (Fecha == default(DateTime))
            {
                throw new ArgumentException("La fecha proporcionada no es válida.");
            }

            double cuitAliadoConvertido;
            double numeroTerminalConvertido;

            // Validar que el CUIT y Número de Terminal sean válidos
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido))
            {
                throw new FormatException("El formato del CUIT no es válido.");
            }

            if (!double.TryParse(NumeroTerminal, out numeroTerminalConvertido))
            {
                throw new FormatException("El formato del Número de Terminal no es válido.");
            }

            // Generar clave de caché única
            string cacheKey = $"FacturacionOperacionDiaria_{CuitAliado}_{NumeroTerminal}_{Fecha.ToString("ddMMyyyy")}";

            // Revisar si los datos ya están en la caché
            if (!_memoryCache.TryGetValue(cacheKey, out List<(string Fecha, decimal TotalBruto, decimal TotalBrutoDebito, int CantidadDebito, decimal TotalBrutoCredito, int CantidadCredito, decimal TotalBruto1Pago, int Cantidad1Pago)> sumaBrutoPorDia))
            {
                // Ejecutar la consulta si no está en caché
                var registrosFiltrados = (await _repoBaseDashBoard.Consultar(
                    r => r.Cuit == cuitAliadoConvertido
                         && r.NroDeComercio == numeroTerminalConvertido
                         && r.FechaOperacion >= Fecha
                         && r.PagoReal == "Si Paga")).ToList();

                // Si no se encontraron registros, devolver lista vacía
                if (registrosFiltrados == null || registrosFiltrados.Count == 0)
                {
                    return new List<(string, decimal, decimal, int, decimal, int, decimal, int)>();
                }

                // Agrupar por FechaOperacion y calcular totales
                sumaBrutoPorDia = registrosFiltrados
                    .Where(r => r.FechaOperacion.HasValue)
                    .GroupBy(r => r.FechaOperacion.Value.ToString("dd/MM/yyyy"))
                    .Select(g =>
                    {
                        decimal totalBruto = g.Sum(r => r.TotalBruto ?? 0); // Total bruto general para la fecha
                        decimal totalBrutoDebito = g.Where(r => r.TipoDeCredito == "Debito").Sum(r => r.TotalBruto ?? 0);
                        int cantidadDebito = g.Count(r => r.TipoDeCredito == "Debito");

                        decimal totalBrutoCredito = g.Where(r => r.TipoDeCredito == "Credito").Sum(r => r.TotalBruto ?? 0);
                        int cantidadCredito = g.Count(r => r.TipoDeCredito == "Credito");

                        decimal totalBruto1Pago = g.Where(r => r.TipoDeCredito == "1 Pago").Sum(r => r.TotalBruto ?? 0);
                        int cantidad1Pago = g.Count(r => r.TipoDeCredito == "1 Pago");

                        return (Fecha: g.Key,
                                TotalBruto: totalBruto, // Total general para todas las transacciones
                                TotalBrutoDebito: totalBrutoDebito, CantidadDebito: cantidadDebito,
                                TotalBrutoCredito: totalBrutoCredito, CantidadCredito: cantidadCredito,
                                TotalBruto1Pago: totalBruto1Pago, Cantidad1Pago: cantidad1Pago);
                    })
                    .OrderBy(result => result.Fecha)
                    .ToList();

                // Almacenar en caché por 10 minutos
                _memoryCache.Set(cacheKey, sumaBrutoPorDia, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(10)
                });
            }

            return sumaBrutoPorDia;
        }




        public async Task<BaseDashboard> DatoProvincia(string CuitAliado)
        {
            try
            {
                double? cuit = double.Parse(CuitAliado);
                string cacheKey = $"DatoProvincia_{cuit}";

                if (!_memoryCache.TryGetValue(cacheKey, out BaseDashboard cachedData))
                {
                    Expression<Func<BaseDashboard, bool>> filtro = x => x.Cuit == cuit;

                    BaseDashboard dato = await _repoBaseDashBoard.Obtener(filtro);

                    if (dato != null)
                    {
                        cachedData = dato;
                        var cacheEntryOptions = new MemoryCacheEntryOptions()
                            .SetSlidingExpiration(TimeSpan.FromMinutes(10)); // 10 minutos de expiración

                        _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
                    }
                    else
                    {
                        return null;
                    }
                }

                return cachedData;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener el dato de provincia", ex);
            }
        }

        public async Task<List<KeyValuePair<string, decimal>>> DatosCuitPorFecha(string CuitAliado, string NumeroTerminal, DateTime Fecha)
        {
            // Validación inicial: verificar si los parámetros de entrada son válidos
            if (string.IsNullOrEmpty(CuitAliado) || string.IsNullOrEmpty(NumeroTerminal))
            {
                throw new ArgumentException("El CUIT o el Número de Terminal no pueden ser nulos o vacíos.");
            }

            if (Fecha == default(DateTime))
            {
                throw new ArgumentException("La fecha proporcionada no es válida.");
            }

            double cuitAliadoConvertido;
            double numeroTerminalConvertido;

            // Validar que el CUIT sea convertible a un número
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido))
            {
                throw new FormatException("El formato del CUIT no es válido.");
            }

            // Validar que el Número de Terminal sea convertible a un número
            if (!double.TryParse(NumeroTerminal, out numeroTerminalConvertido))
            {
                throw new FormatException("El formato del Número de Terminal no es válido.");
            }

            // Generar una clave de caché única para esta combinación de CUIT, terminal y fecha
            string cacheKey = $"Facturacion_{CuitAliado}_{NumeroTerminal}_{Fecha:yyyyMM}";

            // Revisar si los datos ya están en la caché
            if (!_memoryCache.TryGetValue(cacheKey, out List<KeyValuePair<string, decimal>> sumaBrutoPorMes))
            {
                // Si no están en caché, ejecutar la consulta
                var registrosFiltrados = (await _repoBaseDashBoard.Consultar(
         r => r.Cuit == cuitAliadoConvertido
              && r.NroDeComercio == numeroTerminalConvertido
              && r.FechaDePago >= Fecha
              && (r.PagoReal == "Si Paga" || r.PagoReal == null))) // Incluir la validación de PagoReal para permitir nulos
         .ToList();


                // Si no se encontraron registros, devolver una lista vacía
                if (registrosFiltrados == null || registrosFiltrados.Count == 0)
                {
                    return new List<KeyValuePair<string, decimal>>();
                }

                // Agrupar y sumar los TotalBruto por mes/año
                sumaBrutoPorMes = registrosFiltrados
                    .Where(r => r.FechaDePago.HasValue) // Asegurarse de que FechaDePago no sea null
                    .GroupBy(r => $"{r.FechaDePago.Value.Month.ToString("D2")}/{r.FechaDePago.Value.Year}") // Agrupar por MM/YYYY
                    .Select(g => new KeyValuePair<string, decimal>(
                        g.Key, // Llave: MM/YYYY
                        g.Sum(r => r.TotalBruto ?? 0) // Sumar TotalBruto, manejando valores nulos
                    ))
                    .OrderBy(pair => pair.Key) // Ordenar por fecha (MM/YYYY)
                    .ToList();

                // Almacenar los resultados en caché por 10 minutos
                _memoryCache.Set(cacheKey, sumaBrutoPorMes, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(10)
                });
            }

            // Devolver los datos, ya sea desde caché o desde la consulta
            return sumaBrutoPorMes;
        }

        public async Task<List<KeyValuePair<string, decimal>>> DatosCuitPorFechaDiaria(string CuitAliado, string NumeroTerminal, DateTime Fecha)
        {
            // Validación inicial: verificar si los parámetros de entrada son válidos
            if (string.IsNullOrEmpty(CuitAliado) || string.IsNullOrEmpty(NumeroTerminal))
            {
                throw new ArgumentException("El CUIT o el Número de Terminal no pueden ser nulos o vacíos.");
            }

            if (Fecha == default(DateTime))
            {
                throw new ArgumentException("La fecha proporcionada no es válida.");
            }

            double cuitAliadoConvertido;
            double numeroTerminalConvertido;

            // Validar que el CUIT sea convertible a un número
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido))
            {
                throw new FormatException("El formato del CUIT no es válido.");
            }

            // Validar que el Número de Terminal sea convertible a un número
            if (!double.TryParse(NumeroTerminal, out numeroTerminalConvertido))
            {
                throw new FormatException("El formato del Número de Terminal no es válido.");
            }

            // Generar una clave de caché única para esta combinación de CUIT, terminal y fecha
            string cacheKey = $"FacturacionDiaria_{CuitAliado}_{NumeroTerminal}_{Fecha.ToString("ddMMyyyy")}";

            // Revisar si los datos ya están en la caché
            if (!_memoryCache.TryGetValue(cacheKey, out List<KeyValuePair<string, decimal>> sumaBrutoPorDia))
            {
                // Si no están en caché, ejecutar la consulta
                var registrosFiltrados = (await _repoBaseDashBoard.Consultar(
        r => r.Cuit == cuitAliadoConvertido
             && r.NroDeComercio == numeroTerminalConvertido
             && r.FechaDePago >= Fecha
             && (r.PagoReal == "Si Paga" || r.PagoReal == null))) // Incluir la validación de PagoReal para permitir nulos
        .ToList();


                // Si no se encontraron registros, devolver una lista vacía
                if (registrosFiltrados == null || registrosFiltrados.Count == 0)
                {
                    return new List<KeyValuePair<string, decimal>>();
                }

                // Agrupar y sumar los TotalBruto por día
                sumaBrutoPorDia = registrosFiltrados
                    .Where(r => r.FechaDePago.HasValue) // Asegurarse de que FechaDePago no sea null
                    .GroupBy(r => r.FechaDePago.Value.ToString("dd/MM/yyyy")) // Agrupar por DD/MM/YYYY
                    .Select(g => new KeyValuePair<string, decimal>(
                        g.Key, // Llave: DD/MM/YYYY
                        g.Sum(r => r.TotalBruto ?? 0) // Sumar TotalBruto, manejando valores nulos
                    ))
                    .OrderBy(pair => pair.Key) // Ordenar por fecha (DD/MM/YYYY)
                    .ToList();

                // Almacenar los resultados en caché por 10 minutos
                _memoryCache.Set(cacheKey, sumaBrutoPorDia, new MemoryCacheEntryOptions
                {
                    SlidingExpiration = TimeSpan.FromMinutes(10)
                });
            }

            // Devolver los datos, ya sea desde caché o desde la consulta
            return sumaBrutoPorDia;
        }



        public async Task<List<BaseDashboard>> DatosInicioAliados(string CuitAliado)
        {
            var cacheKey = $"DatosInicioAliados_{CuitAliado}";

            if (!_memoryCache.TryGetValue(cacheKey, out List<BaseDashboard> cachedData))
            {
                // Filtrar por CUIT y PagoReal sea "Si Paga" o null
                IQueryable<BaseDashboard> tbUsuario = await _repoBaseDashBoard
                    .Consultar(u => u.Cuit == Convert.ToDouble(CuitAliado) && (u.PagoReal == "Si Paga" || u.PagoReal == null));

                cachedData = tbUsuario.ToList();

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 1 minuto de expiración

                _memoryCache.Set(cacheKey, cachedData, cacheEntryOptions);
            }

            return cachedData;
        }


        public async Task<bool> ExistenDatosInicioAliados(string CuitAliado)
        {
            var cacheKey = $"ExistenDatosInicioAliados_{CuitAliado}";

            if (!_memoryCache.TryGetValue(cacheKey, out bool exists))
            {
                var cuitDouble = Convert.ToDouble(CuitAliado);
                var consulta = await _repoBaseDashBoard.Consultar(u => u.Cuit == cuitDouble);
                var cantidad = await consulta.CountAsync();
                exists = cantidad > 0;

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromMinutes(1)); // 10 minutos de expiración

                _memoryCache.Set(cacheKey, exists, cacheEntryOptions);
            }

            return exists;
        }


        public async Task<List<BaseDashboard>> Lista()
        {
            IQueryable<BaseDashboard> query = await _repoBaseDashBoard.Consultar();

            return await query.ToListAsync();
        }

        public async Task<List<BaseDashboard>> Lista(DateTime? fecha = null)
        {
            DateTime fechaFiltro;

            if (fecha.HasValue)
            {
                fechaFiltro = fecha.Value;
            }
            else
            {
                fechaFiltro = DateTime.Now;
            }

            // Definir el filtro inicial basado en la fecha
            Expression<Func<BaseDashboard, bool>> filtro = x => x.FechaOperacion.HasValue &&
                                                        x.FechaOperacion.Value.Year == fechaFiltro.Year &&
                                                        x.FechaOperacion.Value.Month == fechaFiltro.Month &&
                                                        (x.PagoReal == "Si Paga" || x.PagoReal == null); // Agregar filtro para permitir nulos


            // Consultar el repositorio con el filtro
            var queryable = await _repoBaseDashBoard.Consultar(filtro);

            return await queryable.ToListAsync();
        }


        public async Task<List<BaseDashboard>> Listahoy(DateTime? fecha)
        {
            DateTime fechaFiltro;

            if (fecha.HasValue)
            {
                fechaFiltro = fecha.Value;
            }
            else
            {
                fechaFiltro = DateTime.Now;

            }

            Expression<Func<BaseDashboard, bool>> filtro = x => x.FechaDePago == fechaFiltro;

            var queryable = await _repoBaseDashBoard.Consultar(filtro);

            return await queryable.ToListAsync();
        }
        public async Task<DateTime?> ObtenerUltimaFechaPorMesYAnio(DateTime fecha)
        {
            // Consultar los registros filtrados por mes, año y PagoReal = "Si Paga" o null
            var registros = await _repoBaseDashBoard.Consultar(
                x => x.FechaDePago.HasValue &&
                     x.FechaDePago.Value.Month == fecha.Month && // Filtrar por mes
                     x.FechaDePago.Value.Year == fecha.Year &&   // Filtrar por año
                     (x.PagoReal == "Si Paga" || x.PagoReal == null) // PagoReal sea "Si Paga" o null
            );

            // Ahora que tenemos los registros, podemos aplicar OrderByDescending
            var ultimaFecha = registros
                .OrderByDescending(x => x.FechaDePago) // Ordenar por fecha descendente
                .Select(x => x.FechaDePago.Value) // Seleccionar solo la fecha de pago
                .FirstOrDefault(); // Obtener la primera (última en términos de fecha)

            return ultimaFecha;
        }
        public async Task<(decimal totalBrutoDebito, decimal totalBrutoCredito, decimal totalBruto1Pago, int totalCantidadOperaciones)>
    ObtenerResumenBrutoYOperacionesPorTipoYProvincia(DateTime fecha, string provincia)
        {
            // Obtener el mes y año de la fecha proporcionada
            int mes = fecha.Month;
            int año = fecha.Year;

            // Si no se proporciona la provincia, traer todos los registros, si se proporciona, filtrar por la provincia
            var registros = (await _repoBaseDashBoard.Consultar(
                x => x.FechaDePago.HasValue &&
                     x.FechaDePago.Value.Month == mes &&
                     x.FechaDePago.Value.Year == año &&
                     (x.PagoReal == "Si Paga" || x.PagoReal == null) &&
                     (string.IsNullOrEmpty(provincia) || x.Provincia == provincia)
            )).ToList(); // Ejecuta la consulta y materializa los datos en una lista

            // Filtrar en memoria para excluir registros donde Cuit es null o tiene los primeros 9 dígitos idénticos
            var registrosFiltrados = registros.Where(r =>
            {
                if (!r.Cuit.HasValue)
                {
                    return false; // Excluye registros donde Cuit es null
                }

                // Convertir el CUIT a un string de al menos 11 caracteres, agregando ceros a la izquierda si es necesario
                string cuitStr = r.Cuit.Value.ToString("00000000000");

                // Verificar si los primeros 9 dígitos son iguales
                return !(cuitStr.Substring(0, 9) == new string(cuitStr[0], 9));
            }).ToList();



            // Inicializar las variables para los totales
            decimal totalBrutoDebito = 0;
            decimal totalBrutoCredito = 0;
            decimal totalBruto1Pago = 0;
            int totalCantidadOperaciones = 0;

            // Calcular los totales por cada tipo de crédito
            foreach (var registro in registrosFiltrados)
            {
                if (registro.TipoDeCredito == "Debito")
                {
                    totalBrutoDebito += registro.TotalBruto ?? 0;
                }
                else if (registro.TipoDeCredito == "Credito")
                {
                    totalBrutoCredito += registro.TotalBruto ?? 0;
                }
                else if (registro.TipoDeCredito == "1 Pago")
                {
                    totalBruto1Pago += registro.TotalBruto ?? 0;
                }

                // Sumar una operación por cada registro
                totalCantidadOperaciones++;
            }

            // Devolver los totales
            return (totalBrutoDebito, totalBrutoCredito, totalBruto1Pago, totalCantidadOperaciones);
        }


        public async Task<(decimal totalBruto, int totalDebito, int totalCredito, int total1Pago, int totalCantidadOperaciones)>
     ObtenerFacturacionPorTerminal(string CuitAliado, string NumeroTerminal, DateTime Fecha)
        {
            // Si el CUIT o el Número de Terminal son nulos o vacíos, devolver todo como 0
            if (string.IsNullOrEmpty(CuitAliado) || string.IsNullOrEmpty(NumeroTerminal))
            {
                return (0, 0, 0, 0, 0); // No hay datos de facturación para este terminal
            }

            if (Fecha == default(DateTime))
            {
                throw new ArgumentException("La fecha proporcionada no es válida.");
            }

            double cuitAliadoConvertido;
            double numeroTerminalConvertido;

            // Validar que el CUIT y Número de Terminal sean válidos
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido))
            {
                throw new FormatException("El formato del CUIT no es válido.");
            }

            if (!double.TryParse(NumeroTerminal, out numeroTerminalConvertido))
            {
                throw new FormatException("El formato del Número de Terminal no es válido.");
            }

            // Generar una clave de caché única
            string cacheKey = $"FacturacionTerminal_{CuitAliado}_{NumeroTerminal}_{Fecha.ToString("ddMMyyyy")}";

            try
            {
                // Revisar si los datos ya están en la caché
                if (!_memoryCache.TryGetValue(cacheKey, out (decimal totalBruto, int totalDebito, int totalCredito, int total1Pago, int totalCantidadOperaciones) resultado))
                {
                    // Ejecutar la consulta si no está en la caché
                    var registrosFiltrados = (await _repoBaseDashBoard.Consultar(
             r => r.Cuit == cuitAliadoConvertido
                  && r.NroDeComercio == numeroTerminalConvertido
                  && r.FechaDePago >= Fecha
                  && (r.PagoReal == "Si Paga" || r.PagoReal == null))) // Agregar filtro para incluir nulos en PagoReal
             .ToList();


                    // Si no se encontraron registros
                    if (registrosFiltrados == null || registrosFiltrados.Count == 0)
                    {
                        return (0, 0, 0, 0, 0);
                    }

                    // Inicializar variables para sumar los totales
                    decimal totalBruto = 0;
                    int totalDebito = 0;
                    int totalCredito = 0;
                    int total1Pago = 0;
                    int totalCantidadOperaciones = 0;

                    // Calcular los totales
                    foreach (var registro in registrosFiltrados)
                    {
                        totalBruto += registro.TotalBruto ?? 0;

                        if (registro.TipoDeCredito == "Debito")
                        {
                            totalDebito++;
                        }
                        else if (registro.TipoDeCredito == "Credito")
                        {
                            totalCredito++;
                        }
                        else if (registro.TipoDeCredito == "1 Pago")
                        {
                            total1Pago++;
                        }

                        totalCantidadOperaciones++;
                    }

                    // Almacenar en caché
                    resultado = (totalBruto, totalDebito, totalCredito, total1Pago, totalCantidadOperaciones);
                    _memoryCache.Set(cacheKey, resultado, new MemoryCacheEntryOptions
                    {
                        SlidingExpiration = TimeSpan.FromMinutes(10)
                    });
                }

                return resultado;
            }
            catch (Exception ex)
            {
                // Registrar el error para ver los detalles en los logs
                Console.WriteLine($"Error en ObtenerFacturacionPorTerminal: {ex.Message} - {ex.StackTrace}");

                // Volver a lanzar la excepción para que se vea en el API
                throw new Exception($"Error procesando la facturación de la terminal {NumeroTerminal} del CUIT {CuitAliado}. Error: {ex.Message}");
            }
        }
        public async Task<object> ObtenerDatosComparativos(DateTime fechaToken, string provincia)
        {
            // Inicializar listas para almacenar los resultados
            var totalBrutoPorMes = new List<decimal>();
            var nombresMeses = new List<string>();
            var brutoMenosInflacionPorMes = new List<decimal>();
            var inflacionPorMes = new List<decimal>();

            // Obtener la lista de inflación
            var inflacion = await _InflacionService.Lista();

            // Recorrer los últimos 4 meses
            for (int i = 0; i < 12; i++)
            {
                // Calcular la fecha del mes actual menos `i` meses
                DateTime fechaMes = fechaToken.AddMonths(-i);

                // Consulta utilizando el repositorio genérico y filtrando por fecha, provincia y PagoReal (sea "Si Paga" o null)
                var registros = (await _repoBaseDashBoard.Consultar(
                    x => x.FechaDePago.HasValue &&
                         x.FechaDePago.Value.Month == fechaMes.Month &&
                         x.FechaDePago.Value.Year == fechaMes.Year &&
                         (x.PagoReal == "Si Paga" || x.PagoReal == null) &&
                         (string.IsNullOrEmpty(provincia) || x.Provincia == provincia)
                )).ToList();

                // Filtrar en memoria para excluir Cuit con el mismo dígito repetido más de 8 veces
                var registrosFiltrados = registros.Where(r =>
                {
                    if (!r.Cuit.HasValue) return false;

                    // Convertir el CUIT a un string de al menos 11 caracteres, agregando ceros a la izquierda si es necesario
                    string cuitStr = r.Cuit.Value.ToString("00000000000");

                    // Verificar si los primeros 9 dígitos son iguales
                    return !(cuitStr.Substring(0, 9) == new string(cuitStr[0], 9));
                }).ToList();

                // Sumar los valores brutos del mes
                decimal totalBrutoMes = registrosFiltrados.Sum(r => r.TotalBruto ?? 0);
                totalBrutoPorMes.Add(totalBrutoMes);

                // Obtener la inflación para el mes actual
                var inflacionMes = inflacion.FirstOrDefault(x =>
                    x.Fecha.HasValue &&
                    x.Fecha.Value.Month == fechaMes.Month &&
                    x.Fecha.Value.Year == fechaMes.Year &&
                    x.Rubro == "Total"
                );

                // Calcular la inflación del mes y el ajuste por inflación
                decimal porcentajeInflacion = inflacionMes?.Inflacion1.HasValue == true
                    ? (decimal)inflacionMes.Inflacion1.Value / 100
                    : 0;

                // Calcular el total bruto ajustado por inflación
                decimal brutoAjustadoPorInflacion = totalBrutoMes * (1 - porcentajeInflacion);

                // Si no hay datos de inflación, devolver 0 tanto en bruto ajustado como en inflación
                brutoMenosInflacionPorMes.Add(porcentajeInflacion > 0 ? brutoAjustadoPorInflacion : 0);
                inflacionPorMes.Add(porcentajeInflacion > 0 ? (decimal)inflacionMes.Inflacion1.Value : 0);

                // Agregar el nombre del mes en formato "Mes Año"
                nombresMeses.Add(fechaMes.ToString("MMMM yyyy", new CultureInfo("es-ES")));
            }

            // Devolver el resultado con la nueva variable agregada
            return new
            {
                TotalesBruto = totalBrutoPorMes,
                NombresMeses = nombresMeses,
                BrutoMenosInflacion = brutoMenosInflacionPorMes,
                InflacionPorMes = inflacionPorMes
            };
        }

        public Task<object> ObtenerDatosComparativosPorProvincia(DateTime fechaToken)
        {
            // Inicializar un diccionario para almacenar los resultados por provincia
            var resultadoPorProvincia = new Dictionary<string, dynamic>();

            // Obtener la lista de inflación de manera asíncrona
            var inflacionTask = _InflacionService.Lista();

            // Obtener la lista de provincias distintas desde la tabla BaseDashboard
            var provinciasTask = _repoBaseDashBoard.Consultar(x => x.Provincia != null);

            // Esperar a que ambas tareas se completen
            var inflacion = inflacionTask.Result;
            var provinciasQuery = provinciasTask.Result;

            var provincias = provinciasQuery
                .Select(x => x.Provincia)
                .Distinct()
                .ToList();

            // Recorrer cada provincia
            foreach (var provincia in provincias)
            {
                if (string.IsNullOrEmpty(provincia)) continue;

                // Inicializar listas para almacenar los resultados por provincia
                var totalBrutoPorMes = new List<decimal>();
                var nombresMeses = new List<string>();
                var brutoMenosInflacionPorMes = new List<decimal>();
                var inflacionPorMes = new List<decimal>();

                // Recorrer los últimos 12 meses
                for (int i = 0; i < 12; i++)
                {
                    DateTime fechaMes = fechaToken.AddMonths(-i);

                    // Consulta optimizada para obtener los registros de la provincia y del mes actual
                    var registrosMesQuery = _repoBaseDashBoard.Consultar(
                        x => x.FechaDePago.HasValue &&
                             x.FechaDePago.Value.Month == fechaMes.Month &&
                             x.FechaDePago.Value.Year == fechaMes.Year &&
                             x.Provincia == provincia &&
                             (x.PagoReal == "Si Paga" || x.PagoReal == null)
                    ).Result;

                    var registrosMes = registrosMesQuery.ToList();

                    // Filtrar en memoria para excluir CUIT con el mismo dígito repetido más de 8 veces
                    var registrosFiltrados = registrosMes.Where(r =>
                    {
                        if (!r.Cuit.HasValue) return false;
                        string cuitStr = r.Cuit.Value.ToString("00000000000");
                        return !(cuitStr.Substring(0, 9) == new string(cuitStr[0], 9));
                    }).ToList();

                    // Calcular el total bruto del mes
                    decimal totalBrutoMes = registrosFiltrados.Sum(r => r.TotalBruto ?? 0);
                    totalBrutoPorMes.Add(totalBrutoMes);

                    // Obtener la inflación para el mes actual
                    var inflacionMes = inflacion.FirstOrDefault(x =>
                        x.Fecha.HasValue &&
                        x.Fecha.Value.Month == fechaMes.Month &&
                        x.Fecha.Value.Year == fechaMes.Year &&
                        x.Rubro == "Total"
                    );

                    // Calcular el ajuste por inflación
                    decimal porcentajeInflacion = inflacionMes?.Inflacion1.HasValue == true
                        ? (decimal)inflacionMes.Inflacion1.Value / 100
                        : 0;

                    decimal brutoAjustadoPorInflacion = totalBrutoMes * (1 - porcentajeInflacion);
                    brutoMenosInflacionPorMes.Add(porcentajeInflacion > 0 ? brutoAjustadoPorInflacion : 0);
                    inflacionPorMes.Add(porcentajeInflacion > 0 ? (decimal)inflacionMes.Inflacion1.Value : 0);

                    // Agregar el nombre del mes
                    nombresMeses.Add(fechaMes.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")));
                }

                // Agregar los resultados de la provincia al diccionario
                resultadoPorProvincia[provincia] = new
                {
                    TotalesBruto = totalBrutoPorMes,
                    NombresMeses = nombresMeses,
                    BrutoMenosInflacion = brutoMenosInflacionPorMes,
                    InflacionPorMes = inflacionPorMes
                };
            }

            // Devolver el resultado agrupado por provincia
            return Task.FromResult((object)resultadoPorProvincia);
        }





        public async Task<List<BaseDashboard>> ObtenerFacturacionPorTerminalRango(string CuitAliado, string NumeroTerminal, DateTime fechaInicio, DateTime fechaFin)
        {
            if (string.IsNullOrEmpty(CuitAliado) || string.IsNullOrEmpty(NumeroTerminal))
            {
                return new List<BaseDashboard>(); // No hay datos de facturación para este terminal
            }

            double cuitAliadoConvertido;
            double numeroTerminalConvertido;

            // Validar que el CUIT y Número de Terminal sean válidos
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido) || !double.TryParse(NumeroTerminal, out numeroTerminalConvertido))
            {
                throw new FormatException("El formato del CUIT o Número de Terminal no es válido.");
            }

            // Aquí debes "await" para obtener el IQueryable antes de llamar a ToListAsync
            var registrosFiltrados = await _repoBaseDashBoard.Consultar(
                r => r.Cuit == cuitAliadoConvertido
                     && r.NroDeComercio == numeroTerminalConvertido
                     && r.FechaDePago >= fechaInicio
                     && r.FechaDePago <= fechaFin
                     && (r.PagoReal == "Si Paga" || r.PagoReal == null)); // Filtro corregido


            var registros = await registrosFiltrados.ToListAsync();
            return registros;
        }

        public async Task<decimal> ObtenerDatoNumericoPorCuitYFechas(string Cuit, DateTime FechaAlta, DateTime FechaBaja)
        {
            if (string.IsNullOrEmpty(Cuit))
            {
                throw new ArgumentException("Se esperaba un CUIT proporcionado.");
            }

            // Intentamos convertir el CUIT de entrada a double
            if (!double.TryParse(Cuit, out double cuitValue))
            {
                throw new ArgumentException("El CUIT proporcionado no es un número válido.");
            }

            // Consulta para sumar el valor `Bruto` donde el CUIT sea igual al proporcionado,
            // la fecha esté entre `FechaAlta` y `FechaBaja`, y `PagoReal` sea "Si Paga".
            var registrosFiltrados = await _repoBaseDashBoard.Consultar(
           r => r.Cuit.HasValue && r.Cuit.Value == cuitValue // Comparación directa con cuitValue
                && r.FechaOperacion >= FechaAlta
                && r.FechaOperacion <= FechaBaja
                && (r.PagoReal == "Si Paga" || r.PagoReal == null) // Incluir nulos en PagoReal
       );


            // Sumamos el campo `Bruto` de los registros filtrados
            return (decimal)registrosFiltrados.Sum(r => r.TotalBruto);


        }

        public async Task<List<BaseDashboard>> DatosMesActual(string CuitAliado, DateTime Fecha)
        {
            // Validación inicial: verificar si los parámetros de entrada son válidos
            if (string.IsNullOrEmpty(CuitAliado))
            {
                throw new ArgumentException("El CUIT no puede ser nulo o vacío.");
            }

            if (Fecha == default(DateTime))
            {
                throw new ArgumentException("La fecha proporcionada no es válida.");
            }

            double cuitAliadoConvertido;

            // Validar que el CUIT sea convertible a un número
            if (!double.TryParse(CuitAliado, out cuitAliadoConvertido))
            {
                throw new FormatException("El formato del CUIT no es válido.");
            }

            // Generar una clave de caché única para esta combinación de CUIT, terminal y fecha
            string cacheKey = $"Facturacion_{CuitAliado}_{Fecha:yyyyMM}";

            // Revisar si los datos ya están en la caché
            if (!_memoryCache.TryGetValue(cacheKey, out List<BaseDashboard> registrosFiltrados))
            {
                // Calcular el rango de fechas para el mes completo
                DateTime inicioMes = new DateTime(Fecha.Year, Fecha.Month, 1);
                DateTime finMes = inicioMes.AddMonths(1).AddDays(-1);

                // Consultar los registros que correspondan al mes de la fecha proporcionada
                registrosFiltrados = (await _repoBaseDashBoard.Consultar(
                    r => r.Cuit == cuitAliadoConvertido &&
                         r.FechaDePago >= inicioMes &&
                         r.FechaDePago <= finMes &&
                         (r.PagoReal == "Si Paga" || r.PagoReal == null) // Incluir la validación de PagoReal para permitir nulos
                )).ToList();

                // Almacenar el resultado en caché
                _memoryCache.Set(cacheKey, registrosFiltrados, TimeSpan.FromHours(1)); // Puedes ajustar el tiempo de expiración
            }

            return registrosFiltrados;
        }

        public async Task<decimal> ObtenerDatoNumericoPorCuitYFechasNroTerminal(string Cuit, DateTime FechaAlta, DateTime FechaBaja, string NroTerminal)
        {
            if (string.IsNullOrEmpty(Cuit))
            {
                throw new ArgumentException("Se esperaba un CUIT proporcionado.");
            }

            // Intentamos convertir el CUIT de entrada a double
            if (!double.TryParse(Cuit, out double cuitValue))
            {
                throw new ArgumentException("El CUIT proporcionado no es un número válido.");
            }

            // Intentamos convertir NroTerminal a double para comparar correctamente con NroDeComercio
            if (!double.TryParse(NroTerminal, out double nroTerminalValue))
            {
                throw new ArgumentException("El número de terminal proporcionado no es un número válido.");
            }

            // Consulta para filtrar registros según CUIT, fechas, PagoReal y NroTerminal
            var registrosFiltrados = await _repoBaseDashBoard.Consultar(
                r => r.Cuit.HasValue && r.Cuit.Value == cuitValue // Comparación de CUIT
                     && r.FechaDePago >= FechaAlta
                     && r.FechaDePago <= FechaBaja
                     && (r.PagoReal == "Si Paga" || r.PagoReal == null) // Incluir nulos en PagoReal
                     && r.NroDeComercio.HasValue // Aseguramos que el campo no sea nulo antes de comparar
                     && r.NroDeComercio.Value == nroTerminalValue // Comparación con NroTerminal convertido a número
            );

            // Sumamos el campo `TotalBruto` de los registros filtrados
            return (decimal)registrosFiltrados.Sum(r => r.TotalBruto);
        }

        public async Task<bool> Verificarultimos5dias(string cuitAliado, DateTime Fechainicial, DateTime Fechafinal, string nroterminal)
        {
            if (string.IsNullOrEmpty(cuitAliado) || string.IsNullOrEmpty(nroterminal))
            {
                throw new ArgumentException("CUIT y Número de Terminal son obligatorios.");
            }

            // Convertimos CUIT y nroterminal a valores numéricos
            if (!double.TryParse(cuitAliado, out double cuitValue))
            {
                throw new ArgumentException("El CUIT proporcionado no es un número válido.");
            }

            if (!double.TryParse(nroterminal, out double nroTerminalValue))
            {
                throw new ArgumentException("El número de terminal proporcionado no es un número válido.");
            }

            // Filtramos los registros desde Fechafinal hacia atrás por 5 días
            var existeRegistro = await _repoBaseDashBoard.Consultar(
                r => r.Cuit.HasValue && r.Cuit.Value == cuitValue // Comparación de CUIT
                     && r.NroDeComercio.HasValue && r.NroDeComercio.Value == nroTerminalValue // Comparación de Terminal
                     && r.FechaDePago >= Fechafinal.AddDays(-5) && r.FechaDePago <= Fechafinal // Últimos 5 días
                     && (r.PagoReal == "Si Paga" || r.PagoReal == null) // Incluir nulos en PagoReal
            );

            // Si hay registros en los últimos 5 días, retorna true; de lo contrario, false
            return existeRegistro.Any();
        }
        public async Task<List<BaseDashboard>> BuscarCuponesPorFiltros(string? cuit, string? fecha, string? bruto, string? ultimos4digitos, string? tarjeta, string? cuotas)
        {
            // Conversión de tipos antes de la consulta
            double? cuitValue = !string.IsNullOrEmpty(cuit) && double.TryParse(cuit, out double tempCuit) ? tempCuit : (double?)null;
            DateTime? fechaValue = !string.IsNullOrEmpty(fecha) && DateTime.TryParseExact(fecha, "dd/MM/yyyy", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempFecha) ? tempFecha : (DateTime?)null;
            decimal? brutoValue = !string.IsNullOrEmpty(bruto) && decimal.TryParse(bruto, out decimal tempBruto) ? tempBruto : (decimal?)null;
            long? ultimos4Value = !string.IsNullOrEmpty(ultimos4digitos) && long.TryParse(ultimos4digitos, out long tempUltimos4) ? tempUltimos4 : (long?)null;
            double? cuotasValue = !string.IsNullOrEmpty(cuotas) && double.TryParse(cuotas, out double tempCuotas) ? tempCuotas : (double?)null;

            Expression<Func<BaseDashboard, bool>> filtro = x =>
                (!cuitValue.HasValue || (x.Cuit.HasValue && x.Cuit == cuitValue)) &&
                (!fechaValue.HasValue || (x.FechaOperacion.HasValue && x.FechaOperacion.Value.Date == fechaValue.Value.Date)) &&
                (!brutoValue.HasValue || (x.TotalBruto.HasValue && x.TotalBruto == brutoValue)) &&
                (!ultimos4Value.HasValue || (x.NroDeTarjeta.HasValue && ((long)x.NroDeTarjeta.Value % 10000 == ultimos4Value.Value))) &&
                (string.IsNullOrEmpty(tarjeta) || (x.Tarjeta != null && x.Tarjeta.Contains(tarjeta))) &&
                (!cuotasValue.HasValue || (x.Cuotas.HasValue && x.Cuotas == cuotasValue));

            return await _repoBaseDashBoard.ConsultarListaAsync(filtro);
        }

        public async Task<List<BaseDashboard>> BuscarCuponesFechaInicioFIn(string? FechaInicio, string? FechaFin)
        {
            // Conversión de fechas
            // Conversión de fechas correctamente con "yyyy-MM-dd"
            DateTime? fechaInicioValue = !string.IsNullOrEmpty(FechaInicio) &&
                                         DateTime.TryParseExact(FechaInicio, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempFechaInicio)
                ? tempFechaInicio
                : (DateTime?)null;

            DateTime? fechaFinValue = !string.IsNullOrEmpty(FechaFin) &&
                                      DateTime.TryParseExact(FechaFin, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out DateTime tempFechaFin)
                ? tempFechaFin
                : (DateTime?)null;


            // Filtro para la consulta
            Expression<Func<BaseDashboard, bool>> filtro = x =>
                (!fechaInicioValue.HasValue || (x.FechaDePago.HasValue && x.FechaDePago.Value.Date >= fechaInicioValue.Value.Date)) &&
                (!fechaFinValue.HasValue || (x.FechaDePago.HasValue && x.FechaDePago.Value.Date <= fechaFinValue.Value.Date));

            return await _repoBaseDashBoard.ConsultarListaAsync(filtro);
        }
    }
}
