using System.IO;
using System.Text;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Entity.Zoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CloverController : ControllerBase
    {
        private readonly IAltaService _altaservice;
        private readonly ITicketCloverService _ticketcloverService;
        private readonly IFilasCloverQrService _filasCloverQrService;
        private readonly IFilasCloverTicketService _filasCloverTicketService;
        private readonly IAltaService _altaService;
        private readonly IBajaService _bajaService;
        public CloverController(ITicketCloverService ticketcloverService, IFilasCloverQrService filasCloverQrService, IFilasCloverTicketService filasCloverTicketService, IAltaService altaService, IBajaService bajaService)
        {
            _ticketcloverService = ticketcloverService;
            _filasCloverQrService = filasCloverQrService;
            _filasCloverTicketService = filasCloverTicketService;
            _altaService = altaService;
            _bajaService = bajaService;
        }
        // Variable para almacenar los datos procesados
        private static List<string[]> _csvData = new();
   

        [HttpPost("subirdatosclover")]
        public async Task<IActionResult> SubirDatosClover([FromForm] List<IFormFile> files, [FromForm] string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token no proporcionado.");
            }

            if (files == null || files.Count == 0)
            {
                return BadRequest("No se proporcionaron archivos.");
            }

            // Obtener la configuración de las columnas desde los servicios
            var listaticket = await _filasCloverTicketService.ObtenerListaTicket();
            var listaQR = await _filasCloverQrService.ObtenerListaQR();

            if (listaticket == null || !listaticket.Any() || listaQR == null || listaQR.Count < 3)
            {
                return BadRequest("No se pudo obtener la configuración de columnas.");
            }

            // Seleccionar columnas de forma genérica
            var selectedColumns = new
            {
                FechaDePago = listaticket.First().FechaDePago,
                MedioDePago = listaticket.First().MedioDePago,
                MarcaDeLaTarjeta = listaticket.First().MarcaDeLaTarjeta,
                NumeroDeLaTarjeta = listaticket.First().NumeroDeLaTarjeta,
                Importe = listaticket.First().Importe,
                NombreDelCliente = listaticket.First().NombreDelCliente,
                NumeroCuotas = listaticket.First().NumeroCuotas,
                IdTerminal = listaticket.First().IdTerminal,
                NumeroLote = listaticket.First().NumeroLote,
                NumeroRecibo = listaticket.First().NumeroRecibo,
                Resultado = listaticket.First().Resultado
            };

            var processedFiles = new List<object>();
            var skippedRows = new List<object>();

            try
            {
                foreach (var file in files)
                {
                    if (file.FileName.EndsWith(".csv"))
                    {
                        // Procesar archivo CSV
                        using var stream = new StreamReader(file.OpenReadStream(), Encoding.UTF8);

                        // Leer la primera línea (encabezados)
                        var firstLine = await stream.ReadLineAsync();
                        if (string.IsNullOrEmpty(firstLine))
                        {
                            return BadRequest("El archivo está vacío o mal formateado.");
                        }

                        // Detectar delimitador
                        var delimiter = firstLine.Contains(";") ? ";" : ",";

                        // Leer datos del archivo
                        while (!stream.EndOfStream)
                        {
                            var line = await stream.ReadLineAsync();
                            if (!string.IsNullOrEmpty(line))
                            {
                                var values = line.Split(delimiter);

                                // Buscar dinámicamente "SUCCESS" o "FAIL" en todas las columnas
                                int? columnaResultado = null;
                                for (int i = 0; i < values.Length; i++)
                                {
                                    if (values[i] == "SUCCESS" || values[i] == "FAIL")
                                    {
                                        columnaResultado = i; // Guardar el índice de la columna
                                        break;
                                    }
                                }

                                // Obtener datos relevantes
                                var column2 = values.ElementAtOrDefault(2);
                                var column13 = values.ElementAtOrDefault(13);
                                var column14 = values.ElementAtOrDefault(14);
                                var column15 = values.ElementAtOrDefault(15);

                                bool datosProcesados = false;

                                if (!string.IsNullOrWhiteSpace(column2))
                                {
                                    if (column13 == "QR PosNet" && !datosProcesados)
                                    {
                                        selectedColumns = new
                                        {
                                            FechaDePago = listaQR[0].FechaDePago,
                                            MedioDePago = listaQR[0].MedioDePago,
                                            MarcaDeLaTarjeta = listaQR[0].MarcaDeLaTarjeta,
                                            NumeroDeLaTarjeta = listaQR[0].NumeroDeLaTarjeta,
                                            Importe = listaQR[0].Importe,
                                            NombreDelCliente = listaQR[0].NombreDelCliente,
                                            NumeroCuotas = listaQR[0].NumeroCuotas,
                                            IdTerminal = listaQR[0].IdTerminal,
                                            NumeroLote = listaQR[0].NumeroLote,
                                            NumeroRecibo = listaQR[0].NumeroRecibo,
                                            Resultado = columnaResultado ?? listaQR[0].Resultado
                                        };
                                        datosProcesados = true;
                                    }
                                    else if (column14 == "QR PosNet" && !datosProcesados)
                                    {
                                        selectedColumns = new
                                        {
                                            FechaDePago = listaQR[1].FechaDePago,
                                            MedioDePago = listaQR[1].MedioDePago,
                                            MarcaDeLaTarjeta = listaQR[1].MarcaDeLaTarjeta,
                                            NumeroDeLaTarjeta = listaQR[1].NumeroDeLaTarjeta,
                                            Importe = listaQR[1].Importe,
                                            NombreDelCliente = listaQR[1].NombreDelCliente,
                                            NumeroCuotas = listaQR[1].NumeroCuotas,
                                            IdTerminal = listaQR[1].IdTerminal,
                                            NumeroLote = listaQR[1].NumeroLote,
                                            NumeroRecibo = listaQR[1].NumeroRecibo,
                                            Resultado = columnaResultado ?? listaQR[1].Resultado
                                        };
                                        datosProcesados = true;
                                    }
                                    else if (column15 == "QR PosNet" && !datosProcesados)
                                    {
                                        selectedColumns = new
                                        {
                                            FechaDePago = listaQR[2].FechaDePago,
                                            MedioDePago = listaQR[2].MedioDePago,
                                            MarcaDeLaTarjeta = listaQR[2].MarcaDeLaTarjeta,
                                            NumeroDeLaTarjeta = listaQR[2].NumeroDeLaTarjeta,
                                            Importe = listaQR[2].Importe,
                                            NombreDelCliente = listaQR[2].NombreDelCliente,
                                            NumeroCuotas = listaQR[2].NumeroCuotas,
                                            IdTerminal = listaQR[2].IdTerminal,
                                            NumeroLote = listaQR[2].NumeroLote,
                                            NumeroRecibo = listaQR[2].NumeroRecibo,
                                            Resultado = columnaResultado ?? listaQR[2].Resultado
                                        };
                                        datosProcesados = true;
                                    }
                                }

                                if (!datosProcesados)
                                {
                                    selectedColumns = new
                                    {
                                        FechaDePago = listaticket.First().FechaDePago,
                                        MedioDePago = listaticket.First().MedioDePago,
                                        MarcaDeLaTarjeta = listaticket.First().MarcaDeLaTarjeta,
                                        NumeroDeLaTarjeta = listaticket.First().NumeroDeLaTarjeta,
                                        Importe = listaticket.First().Importe,
                                        NombreDelCliente = listaticket.First().NombreDelCliente,
                                        NumeroCuotas = listaticket.First().NumeroCuotas,
                                        IdTerminal = listaticket.First().IdTerminal,
                                        NumeroLote = listaticket.First().NumeroLote,
                                        NumeroRecibo = listaticket.First().NumeroRecibo,
                                        Resultado = columnaResultado ?? listaticket.First().Resultado
                                    };
                                }
                                var isQrPosNet = column13 == "QR PosNet" || column14 == "QR PosNet" || column15 == "QR PosNet";

                                var ticketClover = new TicketsClover
                                {
                                    FechaDePago = DateTime.TryParseExact(
                                        values.ElementAtOrDefault(selectedColumns.FechaDePago ?? 0),
                                        "dd-MMM-yyyy hh:mm tt 'ART'",
                                        System.Globalization.CultureInfo.InvariantCulture,
                                        System.Globalization.DateTimeStyles.None,
                                        out var fecha) ? fecha : null,

                                    MedioDePago = values.ElementAtOrDefault(selectedColumns.MedioDePago ?? 0),
                                    MarcaDeLaTarjeta = values.ElementAtOrDefault(selectedColumns.MarcaDeLaTarjeta ?? 0),
                                    NumeroDeLaTarjeta = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroDeLaTarjeta ?? 0),
                                    Importe = values.ElementAtOrDefault(selectedColumns.Importe ?? 0),
                                    NombreDelCliente = values.ElementAtOrDefault(selectedColumns.NombreDelCliente ?? 0),
                                    NumeroCuotas = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroCuotas ?? 0),

                                    // IdTerminal: Limpieza y truncado a máximo 8 caracteres
                                    IdTerminal = isQrPosNet
                                        ? values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?
                                            .Replace("$", "").Replace(",", "").Replace(".", "").Trim().Substring(0, 8) // Solo 8 caracteres si es QR
                                        : values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?
                                            .Replace("$", "").Replace(",", "").Replace(".", "").Trim()
                                            .Substring(0, Math.Min(8, values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?.Replace("$", "").Replace(",", "").Replace(".", "").Trim().Length ?? 0)),

                                    // NrLote: Texto puro, ignora todo después de la coma
                                    NrLote = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroLote ?? 0)?.Replace("$", "").Replace(".", "").Split(',')[0].Trim(),

                                    // NrRecibo: Texto puro, ignora todo después de la coma
                                    NrRecibo = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroRecibo ?? 0)?.Replace("$", "").Replace(".", "").Split(',')[0].Trim(),

                                    Rersultado = values.ElementAtOrDefault(columnaResultado ?? 0)
                                };

                                await _ticketcloverService.Crear(ticketClover);
                            }
                        }
                    }
                    else if (file.FileName.EndsWith(".xlsx") || file.FileName.EndsWith(".xls"))
                    {
                        using var stream = file.OpenReadStream();
                        ExcelPackage.LicenseContext = LicenseContext.NonCommercial; // Configuración de licencia
                        using var package = new OfficeOpenXml.ExcelPackage(stream);
                        var worksheet = package.Workbook.Worksheets[0];

                        for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                        {
                            var values = new string[worksheet.Dimension.End.Column];
                            for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                            {
                                values[col - 1] = worksheet.Cells[row, col].Text;
                            }

                            int? columnaResultado = null;
                            for (int i = 0; i < values.Length; i++)
                            {
                                if (values[i] == "SUCCESS" || values[i] == "FAIL")
                                {
                                    columnaResultado = i;
                                    break;
                                }
                            }

                            var column2 = values.ElementAtOrDefault(2);
                            var column13 = values.ElementAtOrDefault(13);
                            var column14 = values.ElementAtOrDefault(14);
                            var column15 = values.ElementAtOrDefault(15);

                            bool datosProcesados = false;

                            if (!string.IsNullOrWhiteSpace(column2))
                            {
                                if (column13 == "QR PosNet" && !datosProcesados)
                                {
                                    selectedColumns = new
                                    {
                                        FechaDePago = listaQR[0].FechaDePago,
                                        MedioDePago = listaQR[0].MedioDePago,
                                        MarcaDeLaTarjeta = listaQR[0].MarcaDeLaTarjeta,
                                        NumeroDeLaTarjeta = listaQR[0].NumeroDeLaTarjeta,
                                        Importe = listaQR[0].Importe,
                                        NombreDelCliente = listaQR[0].NombreDelCliente,
                                        NumeroCuotas = listaQR[0].NumeroCuotas,
                                        IdTerminal = listaQR[0].IdTerminal,
                                        NumeroLote = listaQR[0].NumeroLote,
                                        NumeroRecibo = listaQR[0].NumeroRecibo,
                                        Resultado = columnaResultado ?? listaQR[0].Resultado
                                    };
                                    datosProcesados = true;
                                }
                                else if (column14 == "QR PosNet" && !datosProcesados)
                                {
                                    selectedColumns = new
                                    {
                                        FechaDePago = listaQR[1].FechaDePago,
                                        MedioDePago = listaQR[1].MedioDePago,
                                        MarcaDeLaTarjeta = listaQR[1].MarcaDeLaTarjeta,
                                        NumeroDeLaTarjeta = listaQR[1].NumeroDeLaTarjeta,
                                        Importe = listaQR[1].Importe,
                                        NombreDelCliente = listaQR[1].NombreDelCliente,
                                        NumeroCuotas = listaQR[1].NumeroCuotas,
                                        IdTerminal = listaQR[1].IdTerminal,
                                        NumeroLote = listaQR[1].NumeroLote,
                                        NumeroRecibo = listaQR[1].NumeroRecibo,
                                        Resultado = columnaResultado ?? listaQR[1].Resultado
                                    };
                                    datosProcesados = true;
                                }
                                else if (column15 == "QR PosNet" && !datosProcesados)
                                {
                                    selectedColumns = new
                                    {
                                        FechaDePago = listaQR[2].FechaDePago,
                                        MedioDePago = listaQR[2].MedioDePago,
                                        MarcaDeLaTarjeta = listaQR[2].MarcaDeLaTarjeta,
                                        NumeroDeLaTarjeta = listaQR[2].NumeroDeLaTarjeta,
                                        Importe = listaQR[2].Importe,
                                        NombreDelCliente = listaQR[2].NombreDelCliente,
                                        NumeroCuotas = listaQR[2].NumeroCuotas,
                                        IdTerminal = listaQR[2].IdTerminal,
                                        NumeroLote = listaQR[2].NumeroLote,
                                        NumeroRecibo = listaQR[2].NumeroRecibo,
                                        Resultado = columnaResultado ?? listaQR[2].Resultado
                                    };
                                    datosProcesados = true;
                                }
                            }

                            if (!datosProcesados)
                            {
                                selectedColumns = new
                                {
                                    FechaDePago = listaticket.First().FechaDePago,
                                    MedioDePago = listaticket.First().MedioDePago,
                                    MarcaDeLaTarjeta = listaticket.First().MarcaDeLaTarjeta,
                                    NumeroDeLaTarjeta = listaticket.First().NumeroDeLaTarjeta,
                                    Importe = listaticket.First().Importe,
                                    NombreDelCliente = listaticket.First().NombreDelCliente,
                                    NumeroCuotas = listaticket.First().NumeroCuotas,
                                    IdTerminal = listaticket.First().IdTerminal,
                                    NumeroLote = listaticket.First().NumeroLote,
                                    NumeroRecibo = listaticket.First().NumeroRecibo,
                                    Resultado = columnaResultado ?? listaticket.First().Resultado
                                };
                            }


                            var isQrPosNet = column13 == "QR PosNet" || column14 == "QR PosNet" || column15 == "QR PosNet";

                            var ticketClover = new TicketsClover
                            {
                                FechaDePago = DateTime.TryParseExact(
                                    values.ElementAtOrDefault(selectedColumns.FechaDePago ?? 0),
                                    "dd-MMM-yyyy hh:mm tt 'ART'",
                                    System.Globalization.CultureInfo.InvariantCulture,
                                    System.Globalization.DateTimeStyles.None,
                                    out var fecha) ? fecha : null,

                                MedioDePago = values.ElementAtOrDefault(selectedColumns.MedioDePago ?? 0),
                                MarcaDeLaTarjeta = values.ElementAtOrDefault(selectedColumns.MarcaDeLaTarjeta ?? 0),
                                NumeroDeLaTarjeta = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroDeLaTarjeta ?? 0),
                                Importe = values.ElementAtOrDefault(selectedColumns.Importe ?? 0),
                                NombreDelCliente = values.ElementAtOrDefault(selectedColumns.NombreDelCliente ?? 0),
                                NumeroCuotas = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroCuotas ?? 0),

                                // IdTerminal: Limpieza y truncado a máximo 8 caracteres
                                IdTerminal = isQrPosNet
                                    ? values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?
                                        .Replace("$", "").Replace(",", "").Replace(".", "").Trim().Substring(0, 8) // Solo 8 caracteres si es QR
                                    : values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?
                                        .Replace("$", "").Replace(",", "").Replace(".", "").Trim()
                                        .Substring(0, Math.Min(8, values.ElementAtOrDefault(selectedColumns.IdTerminal ?? 0)?.Replace("$", "").Replace(",", "").Replace(".", "").Trim().Length ?? 0)),

                                // NrLote: Texto puro, ignora todo después de la coma
                                NrLote = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroLote ?? 0)?.Replace("$", "").Replace(".", "").Split(',')[0].Trim(),

                                // NrRecibo: Texto puro, ignora todo después de la coma
                                NrRecibo = isQrPosNet ? null : values.ElementAtOrDefault(selectedColumns.NumeroRecibo ?? 0)?.Replace("$", "").Replace(".", "").Split(',')[0].Trim(),

                                Rersultado = values.ElementAtOrDefault(columnaResultado ?? 0)
                            };


                            await _ticketcloverService.Crear(ticketClover);

                       

                        }
                    }
                    else
                    {
                        return BadRequest("Formato de archivo no soportado.");
                    }
                }

                return Ok(new
                {
                    Message = "Archivos procesados correctamente.",
                    FilesCount = files.Count,
                    SkippedRows = skippedRows
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error procesando los archivos: {ex.Message}");
            }
        }



        // Función para limpiar y obtener los primeros 8 caracteres del número
        private string CleanIdTerminal(string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null; // Si está vacío, retorna null

            // Elimina las comas y espacios
            value = value.Replace(",", "").Trim();

            // Retorna los primeros 8 caracteres
            return value.Length > 8 ? value.Substring(0, 8) : value;
        }



        // Método para verificar los datos almacenados (opcional)
        [HttpPost("obtenerdatos")]
        public async Task<IActionResult> ObtenerDatos([FromBody] VMToken request)
        {
            // Validación inicial del request
            if (request == null)
            {
                return BadRequest(new { Message = "La solicitud no puede estar vacía." });
            }

            try
            {
                // Obtener las listas de los servicios
                var listaClover = await _ticketcloverService.ObtenerListaQR();
                var altas = await _altaService.ObtenerCRM();
                var bajas = await _bajaService.ObtenerCRMBaja();

                // Verificar si listaClover está vacía o nula
                if (listaClover == null || !listaClover.Any())
                {
                    return NotFound(new { Message = "No se encontraron datos en Clover." });
                }

                // Procesar listaClover con altas y bajas
                var resultado = listaClover.Select(ticket =>
                {
                    // Buscar en altas primero
                    var alta = altas.FirstOrDefault(a =>
                        a.NDeTerminal.ToString() == ticket.IdTerminal &&
                        ticket.FechaDePago >= a.FechaDeAlta &&
                        (a.FechaDeBaja == null || ticket.FechaDePago <= a.FechaDeBaja));

                    if (alta != null)
                    {
                        ticket.NombreDelCliente = alta.NombreDeFantasia; // Agregar el nombre de fantasía
                                                                         // Limpiar y convertir el importe a número entero
                        ticket.Importe = ConvertirImporte(ticket.Importe); // Convertir a string limpio
                        return ticket;
                    }

                    // Si no se encuentra en altas, buscar en bajas
                    var baja = bajas.FirstOrDefault(b =>
                        b.NDeTerminal == ticket.IdTerminal &&
                        ticket.FechaDePago >= b.FechaDeAlta &&
                        (b.FechaDeBaja == null || ticket.FechaDePago <= b.FechaDeBaja));

                    if (baja != null)
                    {
                        ticket.NombreDelCliente = baja.NombreDeFantasia; // Agregar el nombre de fantasía
                    }

                    // Limpiar y convertir el importe a número entero
                    ticket.Importe = ConvertirImporte(ticket.Importe); // Convertir a string limpio
                    return ticket; // Retornar el ticket actualizado
                }).ToList();

                // Retornar el resultado final
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                // Manejo de excepciones
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Ocurrió un error al procesar la solicitud. Por favor, intenta nuevamente más tarde.",
                    ErrorDetails = ex.Message // Opcional: solo habilitar en desarrollo
                });
            }
        }

        // Método para convertir el importe
        private string ConvertirImporte(string importe)
        {
            if (string.IsNullOrEmpty(importe))
            {
                return "0"; // En caso de que el importe esté vacío o sea null
            }

            // Eliminar el símbolo "$"
            var cleanImporte = importe.Replace("$", "").Trim();

            // Eliminar los puntos (separadores de miles)
            cleanImporte = cleanImporte.Replace(".", "");

            // Eliminar la coma (separador decimal) y todo lo que venga después
            var parts = cleanImporte.Split(',');

            // Tomamos solo la parte entera antes de la coma (si existe una coma)
            var result = parts[0]; // Solo la parte antes de la coma

            return result; // Retorna la parte entera como string
        }


        [HttpPost("obtenerresumendiario")]
        public async Task<IActionResult> ObtenerResumenDiario([FromBody] VMToken request)
        {
            // Validar la solicitud
            if (request == null || string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { Message = "La solicitud no es válida." });
            }

            try
            {
                // Obtener las listas necesarias desde los servicios
                var ticketsClover = await _ticketcloverService.ObtenerListaQR();
                var altas = await _altaService.ObtenerCRM();

                if (ticketsClover == null || !ticketsClover.Any() || altas == null || !altas.Any())
                {
                    return NotFound(new { Message = "No se encontraron datos." });
                }

                // Determinar la fecha base: usar la fecha proporcionada o la fecha de hoy
                var fechaBase = DateTime.TryParse(request.Fecha, out var fechaProporcionada)
                    ? fechaProporcionada
                    : DateTime.UtcNow;

                // Calcular el rango del mes actual
                var fechaInicioMes = new DateTime(fechaBase.Year, fechaBase.Month, 1); // Primer día del mes
                var fechaFinMes = fechaInicioMes.AddMonths(1).AddDays(-1); // Último día del mes

                // Procesar los datos
                var resumen = ticketsClover
                    .Where(ticket => ticket.FechaDePago.HasValue &&
                                     ticket.FechaDePago.Value.Date >= fechaInicioMes &&
                                     ticket.FechaDePago.Value.Date <= fechaFinMes) // Filtrar por el mes actual
                    .GroupBy(ticket => ticket.IdTerminal) // Agrupar por terminal
                    .Select(grupo => new
                    {
                        NumeroDeTerminal = grupo.Key,
                        Provincia = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key)?.Provincia ?? "Sin Provincia",
                        NombreDeFantasia = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key)?.NombreDeFantasia ?? "Sin Nombre",
                        FechaAlta = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key)?.FechaDeAlta?.ToString("yyyy-MM-dd") ?? "Sin Fecha",
                        Fechas = grupo
                            .GroupBy(t => t.FechaDePago.Value.Date) // Agrupar por día dentro de la terminal
                            .Select(dia => dia.Key.ToString("yyyy-MM-dd")) // Array de fechas
                            .ToArray(),
                        MontosPorDia = grupo
                            .GroupBy(t => t.FechaDePago.Value.Date) // Agrupar por día dentro de la terminal
                            .Select(dia => dia.Sum(t =>
                                decimal.TryParse(t.Importe, out var importe) ? importe : 0m)) // Sumar montos por día
                            .ToArray()
                    })
                    .OrderBy(r => r.NombreDeFantasia)
                    .ToList();

                // Retornar el resumen
                return Ok(resumen);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Ocurrió un error al procesar la solicitud.",
                    ErrorDetails = ex.Message // Detalles opcionales
                });
            }
        }

        [HttpPost("obtenerresumenmensual")]
        public async Task<IActionResult> ObtenerResumenmensual([FromBody] VMToken request)
        {
            // Validar la solicitud
            if (request == null || string.IsNullOrEmpty(request.Token))
            {
                return BadRequest(new { Message = "La solicitud no es válida." });
            }

            try
            {
                // Obtener las listas necesarias desde los servicios
                var ticketsClover = await _ticketcloverService.ObtenerListaQR();
                var altas = await _altaService.ObtenerCRM();

                if (ticketsClover == null || !ticketsClover.Any() || altas == null || !altas.Any())
                {
                    return NotFound(new { Message = "No se encontraron datos." });
                }

                // Calcular la fecha límite (3 meses atrás desde el inicio del mes actual)
                var fechaLimite = DateTime.UtcNow.AddMonths(-3).Date;

                // Procesar los datos
                var resumen = ticketsClover
                    .Where(ticket => ticket.FechaDePago.HasValue && ticket.FechaDePago.Value.Date >= fechaLimite) // Filtrar fechas dentro de los últimos 3 meses
                    .GroupBy(ticket => new { ticket.IdTerminal, Mes = new DateTime(ticket.FechaDePago.Value.Year, ticket.FechaDePago.Value.Month, 1) }) // Agrupar por terminal y mes
                    .Select(grupo => new
                    {
                        NumeroDeTerminal = grupo.Key.IdTerminal,
                        Mes = grupo.Key.Mes.ToString("yyyy-MM"),
                        Provincia = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key.IdTerminal)?.Provincia ?? "Sin Provincia",
                        NombreDeFantasia = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key.IdTerminal)?.NombreDeFantasia ?? "Sin Nombre",
                        FechaAlta = altas.FirstOrDefault(a => a.NDeTerminal.ToString() == grupo.Key.IdTerminal)?.FechaDeAlta?.ToString("yyyy-MM-dd") ?? "Sin Fecha",
                        TotalMontos = grupo.Sum(t => decimal.TryParse(t.Importe, out var importe) ? importe : 0m), // Total de montos en el mes
                        DiasOperativos = grupo
                            .Select(t => t.FechaDePago.Value.Date) // Obtener solo fechas
                            .Distinct() // Fechas únicas
                            .Count() // Contar días operativos
                    })
                    .OrderBy(r => r.NombreDeFantasia)
                    .ToList();

                // Retornar el resumen
                return Ok(resumen);
            }
            catch (Exception ex)
            {
                // Manejo de errores
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    Message = "Ocurrió un error al procesar la solicitud.",
                    ErrorDetails = ex.Message // Detalles opcionales
                });
            }
        }


        public class ResumenDiarioViewModel
        {
            public string NombreDeFantasia { get; set; }
            public DateTime Fecha { get; set; }
            public decimal Total { get; set; }
            public int NumeroDeTerminales { get; set; }
        }

    }
}