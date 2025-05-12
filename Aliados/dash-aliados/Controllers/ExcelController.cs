using AutoMapper;
using BLL.ImplemtacionZoco;
using BLL.InterfacesZoco;
using dash_aliados.Models.ViewModelsZoco;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ClosedXML.Excel;
using DocumentFormat.OpenXml.Drawing.Diagrams;
using DocumentFormat.OpenXml.Spreadsheet;
using System.Globalization;
using BLL.ImplementacionZoco;
using Entity.Zoco;

namespace dash_aliados.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExcelController : ControllerBase
    {
        private readonly IBaseDashboardService _baseService;
        private readonly IUsuarioZocoService _usuarioZocoService;
        private readonly ITokenService _tokenservice;
        private readonly IMapper _mapper;
        private readonly IChechAsesores _checkasesores;
        private readonly ICheckImagenService _checkimagenService;
        private readonly IComandaService _comandaService;
        private readonly IAltaService _altaservice;
        private readonly ITokenService _tokenService;
        private readonly IBajaService _IBajaservice;


        public ExcelController(IBaseDashboardService sasService, IMapper mapper, ITokenService tok, IUsuarioZocoService usuarioZoco, 
            IChechAsesores checkasesores, ICheckImagenService checkimagenService,
            IComandaService comandaService, IAltaService altaservice, ITokenService tokenService, IBajaService iBajaservice)
        {
            _baseService = sasService;
            _tokenservice = tok;
            _mapper = mapper;
            _usuarioZocoService = usuarioZoco;
            _checkasesores = checkasesores;
            _checkimagenService = checkimagenService;
            _comandaService = comandaService;
            _altaservice = altaservice;
            _tokenService = tokenService;
            _IBajaservice = iBajaservice;
        }


        [HttpPost("excel")]
        public async Task<ActionResult> Excel([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido == true)
            {
                var currentDate = DateTime.Today;
                var currentWeek = CultureInfo.InvariantCulture.Calendar.GetWeekOfYear(currentDate, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
                var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
                var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);

                if (request.comercio.ToLower() == "todos")
                {
                    var primerDiaMes = new DateTime((int)request.Year, (int)request.Month, 1);
                    var ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                    DateTime fechaMaximaPermitida = ultimoDiaMes;

                    var datosFiltrados = sas.Where(dato => dato.FechaDePago?.Date >= primerDiaMes && dato.FechaDePago?.Date <= fechaMaximaPermitida)
                                            .OrderByDescending(dato => dato.FechaDePago)
                                            .ToList();
                    using (var workbook = new XLWorkbook())
                    {
                        var worksheet = workbook.Worksheets.Add("Datos");



                        var currentRow = 1;

                        worksheet.Cell(currentRow, 1).Value = "TERMINAL";
                        worksheet.Cell(currentRow, 2).Value = "Comercio";
                        worksheet.Cell(currentRow, 3).Value = "N OP";

                        worksheet.Cell(currentRow, 4).Value = "Fecha OP";
                        worksheet.Cell(currentRow, 5).Value = "Fecha Pago";
                        worksheet.Cell(currentRow, 6).Value = "N Cupòn";
                        worksheet.Cell(currentRow, 7).Value = "N Tarjeta";
                        worksheet.Cell(currentRow, 8).Value = "Tarjeta";
                        worksheet.Cell(currentRow, 9).Value = "Cuotas";
                        worksheet.Cell(currentRow, 10).Value = "Bruto";
                        worksheet.Cell(currentRow, 11).Value = "Costo Fin.";
                        worksheet.Cell(currentRow, 12).Value = "Costo Ant";
                        worksheet.Cell(currentRow, 13).Value = "Arancel";
                        worksheet.Cell(currentRow, 14).Value = "IVA Arancel";
                        worksheet.Cell(currentRow, 15).Value = "Cost. transc.";
                        worksheet.Cell(currentRow, 16).Value = "Reten. IIBB";
                        worksheet.Cell(currentRow, 17).Value = "Ret. Ganancia";
                        worksheet.Cell(currentRow, 18).Value = "Ret. IVA";
                        worksheet.Cell(currentRow, 19).Value = "Total OP";
                        foreach (var dato in datosFiltrados)
                        {

                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = dato.NroDeComercio;
                            worksheet.Cell(currentRow, 2).Value = dato.NombreComercio;
                            worksheet.Cell(currentRow, 3).Value = dato.NroDeAutorizacion;

                            worksheet.Cell(currentRow, 4).Value = dato.FechaOperacion;
                            worksheet.Cell(currentRow, 5).Value = dato.FechaDePago;
                            worksheet.Cell(currentRow, 6).Value = dato.NroDeCupon;
                            worksheet.Cell(currentRow, 7).Value = dato.NroDeTarjeta;
                            worksheet.Cell(currentRow, 8).Value = dato.Tarjeta;
                            worksheet.Cell(currentRow, 9).Value = dato.Cuotas;
                            worksheet.Cell(currentRow, 10).Value = dato.TotalBruto;
                            worksheet.Cell(currentRow, 11).Value = dato.CostoFinancieroEn;
                            worksheet.Cell(currentRow, 12).Value = dato.CostoPorAnticipo;
                            worksheet.Cell(currentRow, 13).Value = dato.Arancel;
                            worksheet.Cell(currentRow, 14).Value = dato.Iva21;
                            worksheet.Cell(currentRow, 15).Value = dato.ImpuestoDebitoCredito;
                            worksheet.Cell(currentRow, 16).Value = dato.RetencionProvincial;
                            worksheet.Cell(currentRow, 17).Value = dato.RetencionGanacia;
                            worksheet.Cell(currentRow, 18).Value = dato.RetencionIva;
                            worksheet.Cell(currentRow, 19).Value = dato.TotalConDescuentos;
                        }

                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();

                            return File(
                                content,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "datos.xlsx"
                            );
                        }
                    }



                }
                else
                {

                    sas = sas.Where(s => s.NombreComercio != null &&
                      s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();
                    var primerDiaMes = new DateTime((int)request.Year, (int)request.Month, 1);
                    var ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                    DateTime fechaMaximaPermitida = ultimoDiaMes;

                    var datosFiltrados = sas.Where(dato => dato.FechaDePago?.Date >= primerDiaMes && dato.FechaDePago?.Date <= fechaMaximaPermitida)
                                            .OrderByDescending(dato => dato.FechaDePago)
                                            .ToList();


                    using (var workbook = new XLWorkbook())
                    {
                        var worksheet = workbook.Worksheets.Add("Datos");



                        var currentRow = 1;

                        worksheet.Cell(currentRow, 1).Value = "TERMINAL";
                        worksheet.Cell(currentRow, 2).Value = "Comercio";
                        worksheet.Cell(currentRow, 3).Value = "N OP";

                        worksheet.Cell(currentRow, 4).Value = "Fecha OP";
                        worksheet.Cell(currentRow, 5).Value = "Fecha Pago";
                        worksheet.Cell(currentRow, 6).Value = "N Cupòn";
                        worksheet.Cell(currentRow, 7).Value = "N Tarjeta";
                        worksheet.Cell(currentRow, 8).Value = "Tarjeta";
                        worksheet.Cell(currentRow, 9).Value = "Cuotas";
                        worksheet.Cell(currentRow, 10).Value = "Bruto";
                        worksheet.Cell(currentRow, 11).Value = "Costo Fin.";
                        worksheet.Cell(currentRow, 12).Value = "Costo Ant";
                        worksheet.Cell(currentRow, 13).Value = "Arancel";
                        worksheet.Cell(currentRow, 14).Value = "IVA Arancel";
                        worksheet.Cell(currentRow, 15).Value = "Cost. transc.";
                        worksheet.Cell(currentRow, 16).Value = "Reten. IIBB";
                        worksheet.Cell(currentRow, 17).Value = "Ret. Ganancia";
                        worksheet.Cell(currentRow, 18).Value = "Ret. IVA";
                        worksheet.Cell(currentRow, 19).Value = "Total OP";
                        foreach (var dato in datosFiltrados)
                        {
                            currentRow++;
                            worksheet.Cell(currentRow, 1).Value = dato.NroDeComercio;
                            worksheet.Cell(currentRow, 2).Value = dato.NombreComercio;
                            worksheet.Cell(currentRow, 3).Value = dato.NroDeAutorizacion;

                            worksheet.Cell(currentRow, 4).Value = dato.FechaOperacion;
                            worksheet.Cell(currentRow, 5).Value = dato.FechaDePago;
                            worksheet.Cell(currentRow, 6).Value = dato.NroDeCupon;
                            worksheet.Cell(currentRow, 7).Value = dato.NroDeTarjeta;
                            worksheet.Cell(currentRow, 8).Value = dato.Tarjeta;
                            worksheet.Cell(currentRow, 9).Value = dato.Cuotas;
                            worksheet.Cell(currentRow, 10).Value = dato.TotalBruto;
                            worksheet.Cell(currentRow, 11).Value = dato.CostoFinancieroEn;
                            worksheet.Cell(currentRow, 12).Value = dato.CostoPorAnticipo;
                            worksheet.Cell(currentRow, 13).Value = dato.Arancel;
                            worksheet.Cell(currentRow, 14).Value = dato.Iva21;
                            worksheet.Cell(currentRow, 15).Value = dato.ImpuestoDebitoCredito;
                            worksheet.Cell(currentRow, 16).Value = dato.RetencionProvincial;
                            worksheet.Cell(currentRow, 17).Value = dato.RetencionGanacia;
                            worksheet.Cell(currentRow, 18).Value = dato.RetencionIva;
                            worksheet.Cell(currentRow, 19).Value = dato.TotalConDescuentos;
                        }

                        using (var stream = new MemoryStream())
                        {
                            workbook.SaveAs(stream);
                            var content = stream.ToArray();

                            return File(
                                content,
                                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                "datos.xlsx"
                            );
                        }
                    }
                }

            }
            return Unauthorized("El token o el ID de la sesión no son válidos");
        }
        [HttpPost("anual")]
        public async Task<ActionResult> ExcelAnual([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
                return Unauthorized("El token o el ID de la sesión no son válidos");

            var usuarioEncontrado = await _tokenservice.ObtenerTokenYUsuarioPorUsuarioIdAsync(request.Token);
            var sas = await _baseService.DatosInicioAliados(usuarioEncontrado.usuario.Usuario1);

            if (request.comercio.ToLower() != "todos")
            {
                sas = sas.Where(s => s.NombreComercio != null &&
                    s.NombreComercio.Replace(" ", "").ToLower() == request.comercio.ToLower()).ToList();
            }

            // Filtrar datos por año completo
            var primerDiaAnio = new DateTime((int)request.Year, 1, 1);
            var ultimoDiaAnio = new DateTime((int)request.Year, 12, 31);

            var datosFiltrados = sas.Where(dato =>
                dato.FechaDePago?.Date >= primerDiaAnio &&
                dato.FechaDePago?.Date <= ultimoDiaAnio)
                .OrderByDescending(dato => dato.FechaDePago)
                .ToList();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Resumen Anual");

                var currentRow = 1;
                // Cabecera
                worksheet.Cell(currentRow, 1).Value = "TERMINAL";
                worksheet.Cell(currentRow, 2).Value = "Comercio";
                worksheet.Cell(currentRow, 3).Value = "N OP";
                worksheet.Cell(currentRow, 4).Value = "Fecha OP";
                worksheet.Cell(currentRow, 5).Value = "Fecha Pago";
                worksheet.Cell(currentRow, 6).Value = "N Cupòn";
                worksheet.Cell(currentRow, 7).Value = "N Tarjeta";
                worksheet.Cell(currentRow, 8).Value = "Tarjeta";
                worksheet.Cell(currentRow, 9).Value = "Cuotas";
                worksheet.Cell(currentRow, 10).Value = "Bruto";
                worksheet.Cell(currentRow, 11).Value = "Costo Fin.";
                worksheet.Cell(currentRow, 12).Value = "Costo Ant";
                worksheet.Cell(currentRow, 13).Value = "Arancel";
                worksheet.Cell(currentRow, 14).Value = "IVA Arancel";
                worksheet.Cell(currentRow, 15).Value = "Cost. transc.";
                worksheet.Cell(currentRow, 16).Value = "Reten. IIBB";
                worksheet.Cell(currentRow, 17).Value = "Ret. Ganancia";
                worksheet.Cell(currentRow, 18).Value = "Ret. IVA";
                worksheet.Cell(currentRow, 19).Value = "Total OP";

                // Filas de datos
                foreach (var dato in datosFiltrados)
                {
                    currentRow++;
                    worksheet.Cell(currentRow, 1).Value = dato.NroDeComercio;
                    worksheet.Cell(currentRow, 2).Value = dato.NombreComercio;
                    worksheet.Cell(currentRow, 3).Value = dato.NroDeAutorizacion;
                    worksheet.Cell(currentRow, 4).Value = dato.FechaOperacion;
                    worksheet.Cell(currentRow, 5).Value = dato.FechaDePago;
                    worksheet.Cell(currentRow, 6).Value = dato.NroDeCupon;
                    worksheet.Cell(currentRow, 7).Value = dato.NroDeTarjeta;
                    worksheet.Cell(currentRow, 8).Value = dato.Tarjeta;
                    worksheet.Cell(currentRow, 9).Value = dato.Cuotas;
                    worksheet.Cell(currentRow, 10).Value = dato.TotalBruto;
                    worksheet.Cell(currentRow, 11).Value = dato.CostoFinancieroEn;
                    worksheet.Cell(currentRow, 12).Value = dato.CostoPorAnticipo;
                    worksheet.Cell(currentRow, 13).Value = dato.Arancel;
                    worksheet.Cell(currentRow, 14).Value = dato.Iva21;
                    worksheet.Cell(currentRow, 15).Value = dato.ImpuestoDebitoCredito;
                    worksheet.Cell(currentRow, 16).Value = dato.RetencionProvincial;
                    worksheet.Cell(currentRow, 17).Value = dato.RetencionGanacia;
                    worksheet.Cell(currentRow, 18).Value = dato.RetencionIva;
                    worksheet.Cell(currentRow, 19).Value = dato.TotalConDescuentos;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        $"reporte_anual_{request.Year}.xlsx"
                    );
                }
            }
        }

        [HttpPost("exceladmin")]
        public async Task<ActionResult> ExcelAdmin([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var checklista = await _checkasesores.Listames(request.Fecha);
            var cheklistaasesores = await _checkimagenService.ListaMesImagen(request.Fecha);
            var listausuarios = await _usuarioZocoService.Lista();
            using (var workbook = new XLWorkbook())
            {
                var worksheet1 = workbook.Worksheets.Add("CheckAsesore");
                worksheet1.Cell("A1").Value = "Id";
                worksheet1.Cell("B1").Value = "IdUser";
                worksheet1.Cell("C1").Value = "CUIT";
                worksheet1.Cell("D1").Value = "Nombre";
                worksheet1.Cell("E1").Value = "Latitud";
                worksheet1.Cell("F1").Value = "Longitud";
                worksheet1.Cell("G1").Value = "Fecha";
                worksheet1.Cell("H1").Value = "Hora";
                worksheet1.Cell("I1").Value = "Tipo";

                int row1 = 2;
                foreach (var item in checklista)
                {
                    var usuario = listausuarios.FirstOrDefault(u => u.Id == item.IdUser);
                    worksheet1.Cell(row1, 1).Value = item.Id;
                    worksheet1.Cell(row1, 2).Value = item.IdUser;
                    worksheet1.Cell(row1, 3).Value = usuario?.Usuario1 ?? "No encontrado";
                    worksheet1.Cell(row1, 4).Value = usuario?.Nombre ?? "No encontrado";
                    worksheet1.Cell(row1, 5).Value = item.Latitud;
                    worksheet1.Cell(row1, 6).Value = item.Longitud;

                    // Separar Fecha y Hora
                    DateTime fechaHora = DateTime.ParseExact(item.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture);
                    worksheet1.Cell(row1, 7).Value = fechaHora.ToString("dd/MM/yyyy");
                    worksheet1.Cell(row1, 8).Value = fechaHora.ToString("HH:mm:ss");

                    worksheet1.Cell(row1, 9).Value = item.Tipo;

                    row1++;
                }

                var registrosValidos = checklista
                    .Select(registro =>
                    {
                        DateTime fechaParsed;
                        bool esValido = DateTime.TryParseExact(registro.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture, DateTimeStyles.None, out fechaParsed);
                        return new { registro, esValido, Fecha = fechaParsed.Date };
                    })
                    .Where(x => x.esValido)
                    .ToList();

                var registrosPorUsuarioYDia = registrosValidos
                    .GroupBy(x => new { x.registro.IdUser, x.Fecha })
                    .Select(g => new
                    {
                        IdUser = g.Key.IdUser,
                        Fecha = g.Key.Fecha,
                        Registros = g.Select(x => x.registro).ToList()
                    })
                    .ToList();

                var registroHoras = new Dictionary<int, Dictionary<string, double>>();

                foreach (var grupo in registrosPorUsuarioYDia)
                {
                    var registrosOrdenados = grupo.Registros.OrderBy(registro => DateTime.ParseExact(registro.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture)).ToList();

                    for (int i = 0; i < registrosOrdenados.Count; i++)
                    {
                        var registroActual = registrosOrdenados[i];
                        if (registroActual.Tipo.Trim().Equals("checkIn", StringComparison.OrdinalIgnoreCase) && (i + 1 < registrosOrdenados.Count) && registrosOrdenados[i + 1].Tipo.Trim().Equals("checkOut", StringComparison.OrdinalIgnoreCase))
                        {
                            var fechaCheckIn = DateTime.ParseExact(registroActual.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture);
                            var registroSiguiente = registrosOrdenados[i + 1];
                            var fechaCheckOut = DateTime.ParseExact(registroSiguiente.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture);

                            var horasTrabajadas = (fechaCheckOut - fechaCheckIn).TotalHours;
                            var fecha = fechaCheckIn.ToString("dd/MM/yyyy");
                            if (!registroHoras.ContainsKey(grupo.IdUser))
                                registroHoras[grupo.IdUser] = new Dictionary<string, double>();
                            if (!registroHoras[grupo.IdUser].ContainsKey(fecha))
                                registroHoras[grupo.IdUser][fecha] = 0;
                            registroHoras[grupo.IdUser][fecha] += horasTrabajadas;

                            i++;
                        }
                    }
                }

                var gestionesPorUsuarioYFecha = cheklistaasesores
                    .GroupBy(item => new
                    {
                        item.IdUser,
                        Fecha = DateTime.ParseExact(item.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture).Date
                    })
                    .Select(group => new
                    {
                        group.Key.IdUser,
                        group.Key.Fecha,
                        Gestiones = group.Count()
                    })
                    .ToList();

                var gestionesDesaprobadas = cheklistaasesores
                    .Where(item => item.Calificacion == false)
                    .GroupBy(item => new
                    {
                        item.IdUser,
                        Fecha = DateTime.ParseExact(item.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture).Date
                    })
                    .Select(group => new
                    {
                        group.Key.IdUser,
                        group.Key.Fecha,
                        Gestiones = group.Count()
                    })
                    .ToList();

                var worksheet2 = workbook.Worksheets.Add("Horas Trabajadas");
                worksheet2.Cell("A1").Value = "IdUser";
                worksheet2.Cell("B1").Value = "Fecha";
                worksheet2.Cell("C1").Value = "Cuit";
                worksheet2.Cell("D1").Value = "Usuario";
                worksheet2.Cell("E1").Value = "Horas Trabajadas";
                worksheet2.Cell("F1").Value = "Gestiones Realizadas";
                worksheet2.Cell("G1").Value = "Gestiones Desaprobas";

                int row2 = 2;
                foreach (var userId in registroHoras.Keys)
                {
                    foreach (var fecha in registroHoras[userId].Keys)
                    {
                        var usuario = listausuarios.FirstOrDefault(u => u.Id == userId);
                        var gestiones = gestionesPorUsuarioYFecha.FirstOrDefault(g => g.IdUser == userId && g.Fecha.ToString("dd/MM/yyyy") == fecha)?.Gestiones ?? 0;
                        var desaprobadas = gestionesDesaprobadas.FirstOrDefault(g => g.IdUser == userId && g.Fecha.ToString("dd/MM/yyyy") == fecha)?.Gestiones ?? 0;

                        worksheet2.Cell(row2, 1).Value = userId;
                        worksheet2.Cell(row2, 2).Value = fecha;
                        worksheet2.Cell(row2, 3).Value = usuario?.Usuario1 ?? "No encontrado";
                        worksheet2.Cell(row2, 4).Value = usuario?.Nombre ?? "No encontrado";
                        worksheet2.Cell(row2, 5).Value = registroHoras[userId][fecha];
                        worksheet2.Cell(row2, 6).Value = gestiones;
                        worksheet2.Cell(row2, 7).Value = desaprobadas;

                        row2++;
                    }
                }

                var worksheet3 = workbook.Worksheets.Add("CheckAsesoresImagen");
                worksheet3.Cell("A1").Value = "Id";
                worksheet3.Cell("B1").Value = "IdUser";
                worksheet3.Cell("C1").Value = "CUIT";
                worksheet3.Cell("D1").Value = "Nombre";
                worksheet3.Cell("E1").Value = "Latitud";
                worksheet3.Cell("F1").Value = "Longitud";
                worksheet3.Cell("G1").Value = "Fecha";
                worksheet3.Cell("H1").Value = "Hora";
                worksheet3.Cell("I1").Value = "Tipo General";
                worksheet3.Cell("J1").Value = "Tipo Prospecto";
                worksheet3.Cell("K1").Value = "Comercio";
                worksheet3.Cell("L1").Value = "Terminal";
                worksheet3.Cell("M1").Value = "Cantidad de Rollos";
                worksheet3.Cell("N1").Value = "Observacion";
                worksheet3.Cell("O1").Value = "Tiempo del Audio";
                worksheet3.Cell("P1").Value = "Calificacion";
                worksheet3.Cell("Q1").Value = "ObservacionAdmin";
                worksheet3.Cell("R1").Value = "Fecha Devolucion";
                worksheet3.Cell("S1").Value = "Hora Devolucion";



                int row3 = 2;
                foreach (var item in cheklistaasesores)
                {
                    var usuario = listausuarios.FirstOrDefault(u => u.Id == item.IdUser);
                    worksheet3.Cell(row3, 1).Value = item.Id;
                    worksheet3.Cell(row3, 2).Value = item.IdUser;
                    worksheet3.Cell(row3, 3).Value = usuario?.Usuario1 ?? "No encontrado";
                    worksheet3.Cell(row3, 4).Value = usuario?.Nombre ?? "No encontrado";
                    worksheet3.Cell(row3, 5).Value = item.Latitud;
                    worksheet3.Cell(row3, 6).Value = item.Longitud;

                    // Separar Fecha y Hora
                    DateTime fechaHora = DateTime.ParseExact(item.FechaHora, "dd/MM/yyyy, HH:mm:ss", CultureInfo.InvariantCulture);
                    worksheet3.Cell(row3, 7).Value = fechaHora.ToString("dd/MM/yyyy");
                    worksheet3.Cell(row3, 8).Value = fechaHora.ToString("HH:mm:ss");
                    if (item.Tipo == "Prospecto")
                    {
                        worksheet3.Cell(row3, 9).Value = string.Empty;       // Columna 9 se deja vacía

                        worksheet3.Cell(row3, 10).Value = item.Tipo; // Columna 10 se llena
                    }
                    else
                    {
                        worksheet3.Cell(row3, 9).Value = item.Tipo;  // Columna 9 se llena
                        worksheet3.Cell(row3, 10).Value = string.Empty;      // Columna 10 se deja vacía
                    }

                    var comercio = item.Local;
                    string nombredelComercio = "";
                    string numeroTerminal = "";
                    var parts = comercio.Split(' ');
                    if (parts.Length >= 2 && int.TryParse(parts.Last(), out int lastPart) && parts.Last().Length > 4)
                    {
                        numeroTerminal = parts.Last();
                        nombredelComercio = string.Join(" ", parts.Take(parts.Length - 1));
                    }
                    else
                    {
                        nombredelComercio = comercio;
                    }

                    worksheet3.Cell(row3, 11).Value = nombredelComercio;
                    worksheet3.Cell(row3, 12).Value = numeroTerminal;
                    worksheet3.Cell(row3, 13).Value = item.CantidadRollos;
                    worksheet3.Cell(row3, 14).Value = item.Observacion;
                    worksheet3.Cell(row3, 15).Value = item.TiempoAudio;
                    worksheet3.Cell(row3, 16).Value = item.Calificacion.HasValue ? (item.Calificacion.Value ? "Sí" : "No") : string.Empty;
                    worksheet3.Cell(row3, 17).Value = item.ObservacionAdmin;
                    worksheet3.Cell(row3, 18).Value = item.FechaDevolucion?.ToString("dd/MM/yyyy") ?? string.Empty;
                    worksheet3.Cell(row3, 19).Value = item.FechaDevolucion?.ToString("HH:mm:ss") ?? string.Empty;




                    row3++;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Reporte.xlsx");
                }
            }
        }


        [HttpPost("excelcomanda")]
        public async Task<ActionResult> Excelcomanda([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);
            if (esTokenValido)
            {
                DateTime fechaComanda;
                bool isFechaValida = DateTime.TryParse(request.Fecha, out fechaComanda);

                if (!isFechaValida)
                {
                    fechaComanda = DateTime.Now;
                }

                var listacomanda = await _comandaService.ListarComandasPorMes(fechaComanda);
                var cuitMapping = new Dictionary<int, string>();

                // Obtener los CUITs para cada comanda
                foreach (var comanda in listacomanda)
                {
                    var usuario = await _usuarioZocoService.ObtenerPorId(comanda.Iduser ?? 0);
                    var cuit = usuario?.Usuario1 ?? "No encontrado";
                    cuitMapping[comanda.Id] = cuit;
                }

                using (var workbook = new XLWorkbook())
                {
                    // Hoja "Comandas"
                    var worksheet = workbook.Worksheets.Add("Comandas");

                    worksheet.Cell(1, 1).Value = "Id";
                    worksheet.Cell(1, 2).Value = "Motivo";
                    worksheet.Cell(1, 3).Value = "Usuario";
                    worksheet.Cell(1, 4).Value = "Gestor";
                    worksheet.Cell(1, 5).Value = "Fecha Apertura";
                    worksheet.Cell(1, 6).Value = "Fecha Cierre";
                    worksheet.Cell(1, 7).Value = "Finalizado";
                    worksheet.Cell(1, 8).Value = "Dirección";
                    worksheet.Cell(1, 9).Value = "Observación Aliado";
                    worksheet.Cell(1, 10).Value = "Observación Administración";
                    worksheet.Cell(1, 11).Value = "Observación Gestor";
                    worksheet.Cell(1, 12).Value = "Estado";
                    worksheet.Cell(1, 13).Value = "Nombre del Comercio";
                    worksheet.Cell(1, 14).Value = "Cuit";
                    worksheet.Cell(1, 15).Value = "Provincia";
                    worksheet.Cell(1, 16).Value = "Número Terminal";
                    worksheet.Cell(1, 17).Value = "Número Teléfono";
                    worksheet.Cell(1, 18).Value = "Email";
                    worksheet.Cell(1, 19).Value = "Pasos";

                    int currentRow = 2;
                    foreach (var comanda in listacomanda)
                    {
                        var usuario = await _usuarioZocoService.ObtenerPorId(comanda.Iduser ?? 0);
                        var gestor = await _usuarioZocoService.ObtenerPorId(comanda.Idgestor ?? 0);
                        var cuit = cuitMapping[comanda.Id];

                        // Rellenar la hoja "Comandas"
                        worksheet.Cell(currentRow, 1).Value = comanda.Id;
                        worksheet.Cell(currentRow, 2).Value = comanda.Motivo;
                        worksheet.Cell(currentRow, 3).Value = usuario?.Nombre ?? "No encontrado";
                        worksheet.Cell(currentRow, 4).Value = gestor?.Nombre ?? "No encontrado";
                        worksheet.Cell(currentRow, 5).Value = comanda.FechaApertura?.ToString("yyyy-MM-dd");
                        worksheet.Cell(currentRow, 6).Value = comanda.FechaCierre?.ToString("yyyy-MM-dd");
                        worksheet.Cell(currentRow, 7).Value = comanda.Finalizado.HasValue ? comanda.Finalizado.Value.ToString() : "No";
                        worksheet.Cell(currentRow, 8).Value = comanda.Direccion;
                        worksheet.Cell(currentRow, 9).Value = comanda.ObservacionAliado;
                        worksheet.Cell(currentRow, 10).Value = comanda.ObservacionAdministracion;
                        worksheet.Cell(currentRow, 11).Value = comanda.ObservacionGestor;
                        worksheet.Cell(currentRow, 12).Value = comanda.Estado;
                        worksheet.Cell(currentRow, 13).Value = comanda.NombredelComercio;
                        worksheet.Cell(currentRow, 14).Value = cuit;
                        worksheet.Cell(currentRow, 15).Value = comanda.Provincia;
                        worksheet.Cell(currentRow, 16).Value = comanda.NumeroTerminal;
                        worksheet.Cell(currentRow, 17).Value = comanda.NumeroTelefono;
                        worksheet.Cell(currentRow, 18).Value = comanda.Email;
                        worksheet.Cell(currentRow, 19).Value = comanda.Pasos;

                        currentRow++;
                    }

                    // Nueva hoja "Detalles por CUIT"
                    var detallesWorksheet = workbook.Worksheets.Add("Detalles por CUIT");

                    detallesWorksheet.Cell(1, 1).Value = "CUIT";
                    detallesWorksheet.Cell(1, 2).Value = "Nombre del Comercio";
                    detallesWorksheet.Cell(1, 3).Value = "Cantidad de Comandas";

                    int detallesRow = 2;

                    var comandasPorCuit = listacomanda
                        .GroupBy(c => cuitMapping[c.Id]) // Usar cuitMapping para obtener el CUIT
                        .Select(g => new
                        {
                            Cuit = g.Key,
                            Comercios = g.GroupBy(c => c.NombredelComercio)
                        });

                    foreach (var cuitGroup in comandasPorCuit)
                    {
                        var cuit = cuitGroup.Cuit;
                        foreach (var comercioGroup in cuitGroup.Comercios)
                        {
                            var nombreComercio = comercioGroup.Key;
                            var cantidadComandas = comercioGroup.Count();

                            detallesWorksheet.Cell(detallesRow, 1).Value = cuit;
                            detallesWorksheet.Cell(detallesRow, 2).Value = nombreComercio;
                            detallesWorksheet.Cell(detallesRow, 3).Value = cantidadComandas;

                            detallesRow++;
                        }
                    }

                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "comandas.xlsx"
                        );
                    }
                }
            }

            return Unauthorized();
        }



        [HttpPost("excelcrm")]
        public async Task<IActionResult> Excelcrm(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                var resumen = await _altaservice.ObtenerCRM();
                var baja = await _IBajaservice.ObtenerCRMBaja();
                using (var workbook = new XLWorkbook())
                {
                    var worksheet1 = workbook.Worksheets.Add("ALTAS");

                    // Headers for worksheet1
                    worksheet1.Cell(1, 1).Value = "SasMutual";
                    worksheet1.Cell(1, 2).Value = "Estado";
                    worksheet1.Cell(1, 3).Value = "NDeTerminal";
                    worksheet1.Cell(1, 4).Value = "NDeComercio";
                    worksheet1.Cell(1, 5).Value = "NroLocal";
                    worksheet1.Cell(1, 6).Value = "Legajo";
                    worksheet1.Cell(1, 7).Value = "NombreDeFantasia";
                    worksheet1.Cell(1, 8).Value = "Domicilio";
                    worksheet1.Cell(1, 9).Value = "Localidad";
                    worksheet1.Cell(1, 10).Value = "CodigoPostal";
                    worksheet1.Cell(1, 11).Value = "Telefono";
                    worksheet1.Cell(1, 12).Value = "LinkDePago";
                    worksheet1.Cell(1, 13).Value = "Rubro";
                    worksheet1.Cell(1, 14).Value = "RubroSecundario";
                    worksheet1.Cell(1, 15).Value = "AltaAhora12";
                    worksheet1.Cell(1, 16).Value = "FechaDeAlta";
                    worksheet1.Cell(1, 17).Value = "FechaDeBaja";
                    worksheet1.Cell(1, 18).Value = "TipoDeBaja";
                    worksheet1.Cell(1, 19).Value = "ProgramacionBaja";
                    worksheet1.Cell(1, 20).Value = "DiasParaAlta";
                    worksheet1.Cell(1, 21).Value = "Provincia";
                    worksheet1.Cell(1, 22).Value = "NombreDelAsesor";
                    worksheet1.Cell(1, 23).Value = "Titular";
                    worksheet1.Cell(1, 24).Value = "CuitCuil";
                    worksheet1.Cell(1, 25).Value = "Banco";
                    worksheet1.Cell(1, 26).Value = "TipoDeCuenta";
                    worksheet1.Cell(1, 27).Value = "CbuCvu";
                    worksheet1.Cell(1, 28).Value = "NDeCuenta";
                    worksheet1.Cell(1, 29).Value = "LetraCbu";
                    worksheet1.Cell(1, 30).Value = "LargoCbu";
                    worksheet1.Cell(1, 31).Value = "Alias";
                    worksheet1.Cell(1, 32).Value = "Mail";
                    worksheet1.Cell(1, 33).Value = "RazonSocial";
                    worksheet1.Cell(1, 34).Value = "CuitRazonSocial";
                    worksheet1.Cell(1, 35).Value = "EstadoAfip";
                    worksheet1.Cell(1, 36).Value = "CodActividad";
                    worksheet1.Cell(1, 37).Value = "Actividad";
                    worksheet1.Cell(1, 38).Value = "Exento";
                    worksheet1.Cell(1, 39).Value = "EstadoRentas";
                    worksheet1.Cell(1, 40).Value = "Actividad2";
                    worksheet1.Cell(1, 41).Value = "DomicilioFiscal";
                    worksheet1.Cell(1, 42).Value = "Provincia3";
                    worksheet1.Cell(1, 43).Value = "Alicuota";
                    worksheet1.Cell(1, 44).Value = "Observacion";
                    worksheet1.Cell(1, 45).Value = "OrigenDeLaTerminal";
                    worksheet1.Cell(1, 46).Value = "DestinoDeLaTerminal";
                    worksheet1.Cell(1, 47).Value = "ReUbicacion";
                    worksheet1.Cell(1, 48).Value = "DiasSinAltaDeTerminal";
                    worksheet1.Cell(1, 49).Value = "AutorizadoPorTitular";
                    worksheet1.Cell(1, 50).Value = "FechaDeCargaAbm";
                    worksheet1.Cell(1, 51).Value = "FechaDeModificacion";
                    worksheet1.Cell(1, 52).Value = "AbmObservacionesDeCarga";
                    worksheet1.Cell(1, 53).Value = "ParaInforme";
                    worksheet1.Cell(1, 54).Value = "EnPausa";
                    worksheet1.Cell(1, 55).Value = "FechaDeInicioDePausa";
                    worksheet1.Cell(1, 56).Value = "FechaDeFinalizacionDePausa";
                    worksheet1.Cell(1, 57).Value = "Backup";
                    worksheet1.Cell(1, 58).Value = "Altas";
                    worksheet1.Cell(1, 59).Value = "Baja";
                    worksheet1.Cell(1, 60).Value = "IngresoASstt";
                    worksheet1.Cell(1, 61).Value = "EgresoDeSstt";
                    worksheet1.Cell(1, 62).Value = "MotivoSstt";
                    worksheet1.Cell(1, 63).Value = "_2IngresoASstt";
                    worksheet1.Cell(1, 64).Value = "_2EgresoDeSstt";
                    worksheet1.Cell(1, 65).Value = "_2MotivoSstt";
                    worksheet1.Cell(1, 66).Value = "FechaSsttMes";
                    worksheet1.Cell(1, 67).Value = "CodActividadRentas";
                    worksheet1.Cell(1, 68).Value = "ActividadRentas";

                    // Data for worksheet1
                    int currentRow = 2;
                    foreach (var alta in resumen)
                    {
                        worksheet1.Cell(currentRow, 1).Value = alta.SasMutual;
                        worksheet1.Cell(currentRow, 2).Value = alta.Estado;
                        worksheet1.Cell(currentRow, 3).Value = alta.NDeTerminal;
                        worksheet1.Cell(currentRow, 4).Value = alta.NDeComercio;
                        worksheet1.Cell(currentRow, 5).Value = alta.NroLocal;
                        worksheet1.Cell(currentRow, 6).Value = alta.Legajo;
                        worksheet1.Cell(currentRow, 7).Value = alta.NombreDeFantasia;
                        worksheet1.Cell(currentRow, 8).Value = alta.Domicilio;
                        worksheet1.Cell(currentRow, 9).Value = alta.Localidad;
                        worksheet1.Cell(currentRow, 10).Value = alta.CodigoPostal;
                        worksheet1.Cell(currentRow, 10).Style.NumberFormat.Format = "0";  // Formato numérico sin decimales
                        worksheet1.Cell(currentRow, 11).Value = alta.Telefono;
                        worksheet1.Cell(currentRow, 11).Style.NumberFormat.Format = "0"; // Formato sin decimales

                        worksheet1.Cell(currentRow, 12).Value = alta.LinkDePago;
                        worksheet1.Cell(currentRow, 13).Value = alta.Rubro;
                        worksheet1.Cell(currentRow, 14).Value = alta.RubroSecundario;
                        worksheet1.Cell(currentRow, 15).Value = alta.AltaAhora12;
                        worksheet1.Cell(currentRow, 16).Value = alta.FechaDeAlta;
                        worksheet1.Cell(currentRow, 17).Value = alta.FechaDeBaja;
                        worksheet1.Cell(currentRow, 18).Value = alta.TipoDeBaja;
                        worksheet1.Cell(currentRow, 19).Value = alta.ProgramacionBaja;
                        worksheet1.Cell(currentRow, 20).Value = alta.DiasParaAlta;
                        worksheet1.Cell(currentRow, 21).Value = alta.Provincia;
                        worksheet1.Cell(currentRow, 22).Value = alta.NombreDelAsesor;
                        worksheet1.Cell(currentRow, 23).Value = alta.Titular;
                        worksheet1.Cell(currentRow, 24).Value = alta.CuitCuil;
                        worksheet1.Cell(currentRow, 25).Value = alta.Banco;
                        worksheet1.Cell(currentRow, 26).Value = alta.TipoDeCuenta;
                        worksheet1.Cell(currentRow, 27).Value = alta.CbuCvu;
                        worksheet1.Cell(currentRow, 28).Value = alta.NDeCuenta;
                        worksheet1.Cell(currentRow, 29).Value = alta.LetraCbu;
                        worksheet1.Cell(currentRow, 30).Value = alta.LargoCbu;
                        worksheet1.Cell(currentRow, 31).Value = alta.Alias;
                        worksheet1.Cell(currentRow, 32).Value = alta.Mail;
                        worksheet1.Cell(currentRow, 33).Value = alta.RazonSocial;
                        worksheet1.Cell(currentRow, 34).Value = alta.CuitRazonSocial;
                        worksheet1.Cell(currentRow, 35).Value = alta.EstadoAfip;
                        worksheet1.Cell(currentRow, 36).Value = alta.CodActividad;
                        worksheet1.Cell(currentRow, 37).Value = alta.Actividad;
                        worksheet1.Cell(currentRow, 38).Value = alta.Exento;
                        worksheet1.Cell(currentRow, 39).Value = alta.EstadoRentas;
                        worksheet1.Cell(currentRow, 40).Value = alta.Actividad2;
                        worksheet1.Cell(currentRow, 41).Value = alta.DomicilioFiscal;
                        worksheet1.Cell(currentRow, 42).Value = alta.Provincia3;
                        worksheet1.Cell(currentRow, 43).Value = alta.Alicuota;
                        worksheet1.Cell(currentRow, 44).Value = alta.Observacion;
                        worksheet1.Cell(currentRow, 45).Value = alta.OrigenDeLaTerminal;
                        worksheet1.Cell(currentRow, 46).Value = alta.DestinoDeLaTerminal;
                        worksheet1.Cell(currentRow, 47).Value = alta.ReUbicacion;
                        worksheet1.Cell(currentRow, 48).Value = alta.DiasSinAltaDeTerminal;
                        worksheet1.Cell(currentRow, 49).Value = alta.AutorizadoPorTitular;
                        worksheet1.Cell(currentRow, 50).Value = alta.FechaDeCargaAbm;
                        worksheet1.Cell(currentRow, 51).Value = alta.FechaDeModificacion;
                        worksheet1.Cell(currentRow, 52).Value = alta.AbmObservacionesDeCarga;
                        worksheet1.Cell(currentRow, 53).Value = alta.ParaInforme;
                        worksheet1.Cell(currentRow, 54).Value = alta.EnPausa;
                        worksheet1.Cell(currentRow, 55).Value = alta.FechaDeInicioDePausa;
                        worksheet1.Cell(currentRow, 56).Value = alta.FechaDeFinalizacionDePausa;
                        worksheet1.Cell(currentRow, 57).Value = alta.Backup;
                        worksheet1.Cell(currentRow, 58).Value = alta.Altas;
                        worksheet1.Cell(currentRow, 59).Value = alta.Baja;
                        worksheet1.Cell(currentRow, 60).Value = alta.IngresoASstt;
                        worksheet1.Cell(currentRow, 61).Value = alta.EgresoDeSstt;
                        worksheet1.Cell(currentRow, 62).Value = alta.MotivoSstt;
                        worksheet1.Cell(currentRow, 63).Value = alta._2IngresoASstt;
                        worksheet1.Cell(currentRow, 64).Value = alta._2EgresoDeSstt;
                        worksheet1.Cell(currentRow, 65).Value = alta._2MotivoSstt;
                        worksheet1.Cell(currentRow, 66).Value = alta.FechaSsttMes;
                        worksheet1.Cell(currentRow, 67).Value = alta.CodActividadRentas;
                        worksheet1.Cell(currentRow, 68).Value = alta.ActividadRentas;

                        currentRow++;
                    }

                    // Adding second sheet
                    var worksheet2 = workbook.Worksheets.Add("BAJAS");

                    // Headers for worksheet2
                    worksheet2.Cell(1, 1).Value = "SasMutual";
                    worksheet2.Cell(1, 2).Value = "Estado";
                    worksheet2.Cell(1, 3).Value = "NDeTerminal";
                    worksheet2.Cell(1, 4).Value = "NDeComercio";
                    worksheet2.Cell(1, 5).Value = "NroLocal";
                    worksheet2.Cell(1, 6).Value = "Legajo";
                    worksheet2.Cell(1, 7).Value = "NombreDeFantasia";
                    worksheet2.Cell(1, 8).Value = "Domicilio";
                    worksheet2.Cell(1, 9).Value = "Localidad";
                    worksheet2.Cell(1, 10).Value = "CodigoPostal";
                    worksheet2.Cell(1, 11).Value = "Telefono";
                    worksheet2.Cell(1, 12).Value = "LinkDePago";
                    worksheet2.Cell(1, 13).Value = "Rubro";
                    worksheet2.Cell(1, 14).Value = "RubroSecundario";
                    worksheet2.Cell(1, 15).Value = "AltaAhora12";
                    worksheet2.Cell(1, 16).Value = "FechaDeAlta";
                    worksheet2.Cell(1, 17).Value = "FechaDeBaja";
                    worksheet2.Cell(1, 18).Value = "TipoDeBaja";
                    worksheet2.Cell(1, 19).Value = "ProgramacionBaja";
                    worksheet2.Cell(1, 20).Value = "DiasParaAlta";
                    worksheet2.Cell(1, 21).Value = "Provincia";
                    worksheet2.Cell(1, 22).Value = "NombreDelAsesor";
                    worksheet2.Cell(1, 23).Value = "Titular";
                    worksheet2.Cell(1, 24).Value = "CuitCuil";
                    worksheet2.Cell(1, 25).Value = "Banco";
                    worksheet2.Cell(1, 26).Value = "TipoDeCuenta";
                    worksheet2.Cell(1, 27).Value = "CbuCvu";
                    worksheet2.Cell(1, 28).Value = "NDeCuenta";
                    worksheet2.Cell(1, 29).Value = "LetraCbu";
                    worksheet2.Cell(1, 30).Value = "LargoCbu";
                    worksheet2.Cell(1, 31).Value = "Alias";
                    worksheet2.Cell(1, 32).Value = "Mail";
                    worksheet2.Cell(1, 33).Value = "RazonSocial";
                    worksheet2.Cell(1, 34).Value = "CuitRazonSocial";
                    worksheet2.Cell(1, 35).Value = "EstadoAfip";
                    worksheet2.Cell(1, 36).Value = "CodActividad";
                    worksheet2.Cell(1, 37).Value = "Actividad";
                    worksheet2.Cell(1, 38).Value = "Exento";
                    worksheet2.Cell(1, 39).Value = "EstadoRentas";
                    worksheet2.Cell(1, 40).Value = "Actividad2";
                    worksheet2.Cell(1, 41).Value = "DomicilioFiscal";
                    worksheet2.Cell(1, 42).Value = "Provincia3";
                    worksheet2.Cell(1, 43).Value = "Alicuota";
                    worksheet2.Cell(1, 44).Value = "Observacion";
                    worksheet2.Cell(1, 45).Value = "OrigenDeLaTerminal";
                    worksheet2.Cell(1, 46).Value = "DestinoDeLaTerminal";
                    worksheet2.Cell(1, 47).Value = "ReUbicacion";
                    worksheet2.Cell(1, 48).Value = "DiasSinAltaDeTerminal";
                    worksheet2.Cell(1, 49).Value = "AutorizadoPorTitular";
                    worksheet2.Cell(1, 50).Value = "FechaDeCargaAbm";
                    worksheet2.Cell(1, 51).Value = "FechaDeModificacion";
                    worksheet2.Cell(1, 52).Value = "AbmObservacionesDeCarga";
                    worksheet2.Cell(1, 53).Value = "ParaInforme";
                    worksheet2.Cell(1, 54).Value = "EnPausa";
                    worksheet2.Cell(1, 55).Value = "FechaDeInicioDePausa";
                    worksheet2.Cell(1, 56).Value = "FechaDeFinalizacionDePausa";
                    worksheet2.Cell(1, 57).Value = "Backup";
                    worksheet2.Cell(1, 58).Value = "Altas";
                    worksheet2.Cell(1, 59).Value = "Baja";
                    worksheet2.Cell(1, 60).Value = "IngresoASstt";
                    worksheet2.Cell(1, 61).Value = "EgresoDeSstt";
                    worksheet2.Cell(1, 62).Value = "MotivoSstt";
                    worksheet2.Cell(1, 63).Value = "_2IngresoASstt";
                    worksheet2.Cell(1, 64).Value = "_2EgresoDeSstt";
                    worksheet2.Cell(1, 65).Value = "_2MotivoSstt";
                    worksheet2.Cell(1, 66).Value = "FechaSsttMes";
                    worksheet2.Cell(1, 67).Value = "CodActividadRentas";
                    worksheet2.Cell(1, 68).Value = "ActividadRentas";

                    // Data for worksheet2
                    currentRow = 2;
                    foreach (var bajaItem in baja)
                    {

                        worksheet2.Cell(currentRow, 1).Value = bajaItem.SasMutual;
                        worksheet2.Cell(currentRow, 2).Value = bajaItem.Estado;
                        worksheet2.Cell(currentRow, 3).Value = $"{bajaItem.Legajo}-{bajaItem.NDeTerminal}"; // Concatenar Legajo y NDeTerminal con un guion
                        worksheet2.Cell(currentRow, 4).Value = bajaItem.NDeComercio;
                        worksheet2.Cell(currentRow, 5).Value = bajaItem.NroLocal;
                        worksheet2.Cell(currentRow, 6).Value = bajaItem.Legajo;
                        worksheet2.Cell(currentRow, 7).Value = bajaItem.NombreDeFantasia;
                        worksheet2.Cell(currentRow, 8).Value = bajaItem.Domicilio;
                        worksheet2.Cell(currentRow, 9).Value = bajaItem.Localidad;
                        worksheet2.Cell(currentRow, 10).Value = bajaItem.CodigoPostal;
                        worksheet2.Cell(currentRow, 11).Value = bajaItem.Telefono;
                        worksheet2.Cell(currentRow, 12).Value = bajaItem.LinkDePago;
                        worksheet2.Cell(currentRow, 13).Value = bajaItem.Rubro;
                        worksheet2.Cell(currentRow, 14).Value = bajaItem.RubroSecundario;
                        worksheet2.Cell(currentRow, 15).Value = bajaItem.AltaAhora12;
                        worksheet2.Cell(currentRow, 16).Value = bajaItem.FechaDeAlta;
                        worksheet2.Cell(currentRow, 17).Value = bajaItem.FechaDeBaja;
                        worksheet2.Cell(currentRow, 18).Value = bajaItem.TipoDeBaja;
                        worksheet2.Cell(currentRow, 19).Value = bajaItem.ProgramacionBaja;
                        worksheet2.Cell(currentRow, 20).Value = bajaItem.DiasParaAlta;
                        worksheet2.Cell(currentRow, 21).Value = bajaItem.Provincia;
                        worksheet2.Cell(currentRow, 22).Value = bajaItem.NombreDelAsesor;
                        worksheet2.Cell(currentRow, 23).Value = bajaItem.Titular;
                        worksheet2.Cell(currentRow, 24).Value = bajaItem.CuitCuil;
                        worksheet2.Cell(currentRow, 25).Value = bajaItem.Banco;
                        worksheet2.Cell(currentRow, 26).Value = bajaItem.TipoDeCuenta;
                        worksheet2.Cell(currentRow, 27).Value = bajaItem.CbuCvu;
                        worksheet2.Cell(currentRow, 28).Value = bajaItem.NDeCuenta;
                        worksheet2.Cell(currentRow, 29).Value = bajaItem.LetraCbu;
                        worksheet2.Cell(currentRow, 30).Value = bajaItem.LargoCbu;
                        worksheet2.Cell(currentRow, 31).Value = bajaItem.Alias;
                        worksheet2.Cell(currentRow, 32).Value = bajaItem.Mail;
                        worksheet2.Cell(currentRow, 33).Value = bajaItem.RazonSocial;
                        worksheet2.Cell(currentRow, 34).Value = bajaItem.CuitRazonSocial;
                        worksheet2.Cell(currentRow, 35).Value = bajaItem.EstadoAfip;
                        worksheet2.Cell(currentRow, 36).Value = bajaItem.CodActividad;
                        worksheet2.Cell(currentRow, 37).Value = bajaItem.Actividad;
                        worksheet2.Cell(currentRow, 38).Value = bajaItem.Exento;
                        worksheet2.Cell(currentRow, 39).Value = bajaItem.EstadoRentas;
                        worksheet2.Cell(currentRow, 40).Value = bajaItem.Actividad2;
                        worksheet2.Cell(currentRow, 41).Value = bajaItem.DomicilioFiscal;
                        worksheet2.Cell(currentRow, 42).Value = bajaItem.Provincia3;
                        worksheet2.Cell(currentRow, 43).Value = bajaItem.Alicuota;
                        worksheet2.Cell(currentRow, 44).Value = bajaItem.Observacion;
                        worksheet2.Cell(currentRow, 45).Value = bajaItem.OrigenDeLaTerminal;
                        worksheet2.Cell(currentRow, 46).Value = bajaItem.DestinoDeLaTerminal;
                        worksheet2.Cell(currentRow, 47).Value = bajaItem.ReUbicacion;
                        worksheet2.Cell(currentRow, 48).Value = bajaItem.DiasSinAltaDeTerminal;
                        worksheet2.Cell(currentRow, 49).Value = bajaItem.AutorizadoPorTitular;
                        worksheet2.Cell(currentRow, 50).Value = bajaItem.FechaDeCargaAbm;
                        worksheet2.Cell(currentRow, 51).Value = bajaItem.FechaDeModificacion;
                        worksheet2.Cell(currentRow, 52).Value = bajaItem.AbmObservacionesDeCarga;
                        worksheet2.Cell(currentRow, 53).Value = bajaItem.ParaInforme;
                        worksheet2.Cell(currentRow, 54).Value = bajaItem.EnPausa;
                        worksheet2.Cell(currentRow, 55).Value = bajaItem.FechaDeInicioDePausa;
                        worksheet2.Cell(currentRow, 56).Value = bajaItem.FechaDeFinalizacionDePausa;
                        worksheet2.Cell(currentRow, 57).Value = bajaItem.Backup;
                        worksheet2.Cell(currentRow, 58).Value = bajaItem.Altas;
                        worksheet2.Cell(currentRow, 59).Value = bajaItem.Baja1;
                        worksheet2.Cell(currentRow, 60).Value = bajaItem.IngresoASstt;
                        worksheet2.Cell(currentRow, 61).Value = bajaItem.EgresoDeSstt;
                        worksheet2.Cell(currentRow, 62).Value = bajaItem.MotivoSstt;
                        worksheet2.Cell(currentRow, 63).Value = bajaItem._2IngresoASstt;
                        worksheet2.Cell(currentRow, 64).Value = bajaItem._2EgresoDeSstt;
                        worksheet2.Cell(currentRow, 65).Value = bajaItem._2MotivoSstt;
                        worksheet2.Cell(currentRow, 66).Value = bajaItem.FechaSsttMes;
                        worksheet2.Cell(currentRow, 67).Value = bajaItem.CodActividadRentas;
                        worksheet2.Cell(currentRow, 68).Value = bajaItem.ActividadRentas;
                    
                        currentRow++;
                    }
                    var worksheet3 = workbook.Worksheets.Add("Resumen ALTAS");
                    // Headers for worksheet3
                    worksheet3.Cell(1, 1).Value = "TERMINAL";
                    worksheet3.Cell(1, 2).Value = "NOMBRE DE FANTASIA";
                    worksheet3.Cell(1, 3).Value = "DOMICILIO";
                    worksheet3.Cell(1, 4).Value = "PROVINCIA";
                    worksheet3.Cell(1, 5).Value = "TELEFONO";
                    worksheet3.Cell(1, 6).Value = "MAIL";
                    worksheet3.Cell(1, 7).Value = "CUIT";

                    // Data for worksheet3
                    int currentRow3 = 2;
                    foreach (var alta in resumen)
                    {
                        worksheet3.Cell(currentRow3, 1).Value = alta.NDeTerminal;
                        worksheet3.Cell(currentRow3, 2).Value = alta.NombreDeFantasia;
                        worksheet3.Cell(currentRow3, 3).Value = alta.Domicilio;
                        worksheet3.Cell(currentRow3, 4).Value = alta.Provincia;
                        worksheet3.Cell(currentRow3, 5).Value = alta.Telefono;
                        worksheet3.Cell(currentRow3, 6).Value = alta.Mail;
                        worksheet3.Cell(currentRow3, 7).Value = alta.CuitCuil;

                        currentRow3++;
                    }

                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "crm.xlsx"
                        );
                    }
                }
            }

            return BadRequest();
        }
        [HttpPost("excelcrmsemanal")]
        public async Task<IActionResult> excelcrmsemanal(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                DateTime fecha;

                if (string.IsNullOrEmpty(token.Fecha))
                {
                    fecha = DateTime.Now; // Si no se proporciona fecha, usar la actual
                }
                else
                {
                    try
                    {
                        fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    }
                    catch (FormatException)
                    {
                        fecha = DateTime.Now; // Si la conversión falla, usar la fecha actual
                    }
                }

                var alta = await _altaservice.ObtenerCRM();
                var baja = await _IBajaservice.ObtenerCRMBaja();

                int mesFecha = fecha.Month;
                int anioFecha = fecha.Year;

                // Crear semanas del mes actual
                var semanas = new List<Tuple<DateTime, DateTime>>();
                var primerDiaMes = new DateTime(anioFecha, mesFecha, 1);
                var ultimoDiaMes = primerDiaMes.AddMonths(1).AddDays(-1);

                DateTime diaInicioSemana = primerDiaMes;
                DateTime diaFinSemana = diaInicioSemana.AddDays(6 - (int)diaInicioSemana.DayOfWeek);

                while (diaInicioSemana <= ultimoDiaMes)
                {
                    if (diaFinSemana > ultimoDiaMes) diaFinSemana = ultimoDiaMes;
                    semanas.Add(new Tuple<DateTime, DateTime>(diaInicioSemana, diaFinSemana));
                    diaInicioSemana = diaFinSemana.AddDays(1);
                    diaFinSemana = diaInicioSemana.AddDays(6);
                }

                // Filtrar las altas y bajas del mes
                var altasDelMes = alta
                    .Where(a => a.FechaDeAlta.HasValue
                                && a.FechaDeAlta.Value.Month == mesFecha
                                && a.FechaDeAlta.Value.Year == anioFecha
                                && (a.Altas == "ALTA NUEVA" || a.Altas == "AGREGA" || a.Altas == "ALTA CCTT")) // Filtrar solo las altas nuevas, agrega y cctt
                    .ToList();
                var bajasDelMes = baja
                    .Where(b => b.FechaDeBaja.HasValue
                                && b.FechaDeBaja.Value.Month == mesFecha
                                && b.FechaDeBaja.Value.Year == anioFecha
                                && (b.Baja1 == "BAJA POR FACTURACION" || b.Baja1 == "BAJA")) // Filtrar solo bajas por facturación y bajas generales
                    .ToList();

                using (var workbook = new XLWorkbook())
                {
                    // ============================================
                    // Hoja 1: Resumen (Altas + Bajas por fecha de alta y fecha de baja)
                    // ============================================
                    var worksheetResumen = workbook.Worksheets.Add("Resumen");
                    int currentRow = 1;

                    // Obtener los tipos de altas únicos
                    var tiposDeAltas = altasDelMes.Select(a => a.Altas).Distinct().ToList();

                    foreach (var semana in semanas)
                    {
                        // Filtrar altas por semana
                        var altasSemana = altasDelMes.Where(a => a.FechaDeAlta.HasValue &&
                                                                 a.FechaDeAlta.Value.Date >= semana.Item1 &&
                                                                 a.FechaDeAlta.Value.Date <= semana.Item2).ToList();

                        // Filtrar bajas por semana (fecha de alta)
                        var bajasSemanaPorFechaDeAlta = bajasDelMes.Where(b => b.FechaDeAlta.HasValue &&
                                                                               b.FechaDeAlta.Value.Date >= semana.Item1 &&
                                                                               b.FechaDeAlta.Value.Date <= semana.Item2).ToList();

                        // Filtrar bajas por semana (fecha de baja)
                        var bajasSemanaPorFechaDeBaja = bajasDelMes.Where(b => b.FechaDeBaja.HasValue &&
                                                                               b.FechaDeBaja.Value.Date >= semana.Item1 &&
                                                                               b.FechaDeBaja.Value.Date <= semana.Item2).ToList();

                        // Escribir el título de la semana
                        worksheetResumen.Cell(currentRow, 1).Value = $"Semana del {semana.Item1:dd/MM/yyyy} al {semana.Item2:dd/MM/yyyy}";
                        currentRow++;

                        // Encabezados de la tabla de Altas
                        worksheetResumen.Cell(currentRow, 1).Value = "Provincia";
                        int col = 2;
                        foreach (var tipo in tiposDeAltas)
                        {
                            worksheetResumen.Cell(currentRow, col).Value = tipo;
                            col++;
                        }
                        worksheetResumen.Cell(currentRow, col).Value = "Total";
                        currentRow++;

                        // Agrupar las altas por provincia
                        var resumenPorProvincia = altasSemana
                            .GroupBy(a => a.Provincia)
                            .Select(g => new
                            {
                                Provincia = g.Key,
                                Tipos = tiposDeAltas.ToDictionary(tipo => tipo, tipo => g.Count(a => a.Altas == tipo))
                            })
                            .ToList();

                        var totalesPorTipo = tiposDeAltas.ToDictionary(tipo => tipo, tipo => 0);
                        int totalGeneralSemana = 0;

                        foreach (var resumen in resumenPorProvincia)
                        {
                            worksheetResumen.Cell(currentRow, 1).Value = resumen.Provincia;
                            col = 2;
                            int totalPorProvincia = 0;

                            foreach (var tipo in tiposDeAltas)
                            {
                                var cantidad = resumen.Tipos.ContainsKey(tipo) ? resumen.Tipos[tipo] : 0;
                                worksheetResumen.Cell(currentRow, col).Value = cantidad;
                                totalPorProvincia += cantidad;
                                totalesPorTipo[tipo] += cantidad;
                                col++;
                            }

                            worksheetResumen.Cell(currentRow, col).Value = totalPorProvincia;
                            totalGeneralSemana += totalPorProvincia;
                            currentRow++;
                        }

                        // Escribir el total de la semana
                        worksheetResumen.Cell(currentRow, 1).Value = "Total Semana:";
                        col = 2;
                        foreach (var tipo in tiposDeAltas)
                        {
                            worksheetResumen.Cell(currentRow, col).Value = totalesPorTipo[tipo];
                            col++;
                        }
                        worksheetResumen.Cell(currentRow, col).Value = totalGeneralSemana;
                        currentRow += 2;

                        // ============================================
                        // Escribir Bajas por Fecha de Baja (Baja Cuit o Baja Terminal)
                        // ============================================
                        worksheetResumen.Cell(currentRow, 1).Value = "Bajas por Fecha de Baja";
                        currentRow++;
                        worksheetResumen.Cell(currentRow, 1).Value = "Provincia";
                        worksheetResumen.Cell(currentRow, 2).Value = "Baja Cuit";
                        worksheetResumen.Cell(currentRow, 3).Value = "Baja Terminal";
                        currentRow++;

                        var bajasPorProvincia = bajasSemanaPorFechaDeBaja
                            .GroupBy(b => b.Provincia)
                            .Select(g => new
                            {
                                Provincia = g.Key,
                                BajaCuit = g.Count(b =>
                                {
                                    var altaRelacionada = alta.FirstOrDefault(a => a.CuitCuil == Convert.ToDouble(b.CuitCuil));
                                    return altaRelacionada == null || altaRelacionada.Estado != "ALTA";
                                }),
                                BajaTerminal = g.Count(b =>
                                {
                                    var altaRelacionada = alta.FirstOrDefault(a => a.CuitCuil == Convert.ToDouble(b.CuitCuil));
                                    return altaRelacionada != null && altaRelacionada.Estado == "ALTA";
                                })
                            })
                            .ToList();

                        int totalBajaCuit = 0;
                        int totalBajaTerminal = 0;

                        foreach (var grupo in bajasPorProvincia)
                        {
                            worksheetResumen.Cell(currentRow, 1).Value = grupo.Provincia;
                            worksheetResumen.Cell(currentRow, 2).Value = grupo.BajaCuit;
                            worksheetResumen.Cell(currentRow, 3).Value = grupo.BajaTerminal;
                            totalBajaCuit += grupo.BajaCuit;
                            totalBajaTerminal += grupo.BajaTerminal;
                            currentRow++;
                        }

                        // Escribir el total de bajas por semana
                        worksheetResumen.Cell(currentRow, 1).Value = "Total Bajas:";
                        worksheetResumen.Cell(currentRow, 2).Value = totalBajaCuit;
                        worksheetResumen.Cell(currentRow, 3).Value = totalBajaTerminal;
                        currentRow += 2;
                    }

                    // ============================================
                    // Hoja 2: Altas y Bajas por Fecha de Alta
                    // ============================================
                    var worksheetAltas = workbook.Worksheets.Add("Altas");

                    currentRow = 1;
                    worksheetAltas.Cell(currentRow, 1).Value = "Estado";
                    worksheetAltas.Cell(currentRow, 2).Value = "NDeTerminal";
                    worksheetAltas.Cell(currentRow, 3).Value = "Nombre de Fantasia";
                    worksheetAltas.Cell(currentRow, 4).Value = "Provincia";
                    worksheetAltas.Cell(currentRow, 5).Value = "FechaDeAlta";
                    worksheetAltas.Cell(currentRow, 6).Value = "Alta";
                    worksheetAltas.Cell(currentRow, 7).Value = "Gestor";
                    worksheetAltas.Cell(currentRow, 8).Value = "Cuit";
                    worksheetAltas.Cell(currentRow, 9).Value = "Facturación"; // Nueva columna
                    currentRow++;

                    foreach (var semana in semanas)
                    {
                        var altasSemana = altasDelMes.Where(a => a.FechaDeAlta.HasValue &&
                                                                 a.FechaDeAlta.Value.Date >= semana.Item1 &&
                                                                 a.FechaDeAlta.Value.Date <= semana.Item2).ToList();

                        if (altasSemana.Any())
                        {
                            worksheetAltas.Cell(currentRow, 1).Value = $"Semana del {semana.Item1:dd/MM/yyyy} al {semana.Item2:dd/MM/yyyy}";
                            currentRow++;

                            foreach (var altaItem in altasSemana)
                            {
                                worksheetAltas.Cell(currentRow, 1).Value = altaItem.Estado;
                                worksheetAltas.Cell(currentRow, 2).Value = altaItem.NDeTerminal ?? 0; // Valor predeterminado para nulos
                                worksheetAltas.Cell(currentRow, 3).Value = altaItem.NombreDeFantasia;
                                worksheetAltas.Cell(currentRow, 4).Value = altaItem.Provincia;
                                worksheetAltas.Cell(currentRow, 5).Value = altaItem.FechaDeAlta?.ToString("dd/MM/yyyy");
                                worksheetAltas.Cell(currentRow, 6).Value = altaItem.Altas;
                                worksheetAltas.Cell(currentRow, 7).Value = altaItem.NombreDelAsesor;
                                worksheetAltas.Cell(currentRow, 8).Value = altaItem.CuitCuil ?? 0; // Valor predeterminado para nulos

                                // Obtener la facturación del mes para esta alta
                                decimal facturacionMensual = 0;
                                try
                                {
                                    if (altaItem.CuitCuil.HasValue && altaItem.NDeTerminal.HasValue)
                                    {
                                        // Obtener el rango del mes basado en FechaDeAlta
                                        DateTime fechaAlta = altaItem.FechaDeAlta.Value;
                                        DateTime inicioMes = new DateTime(fechaAlta.Year, fechaAlta.Month, 1);
                                        DateTime finMes = inicioMes.AddMonths(1).AddDays(-1);

                                        // Llamar a la API para obtener la facturación del rango completo
                                        var datosRango = await _baseService.ObtenerFacturacionPorTerminalRango(altaItem.CuitCuil.Value.ToString(), altaItem.NDeTerminal.Value.ToString(), inicioMes, finMes);

                                        // Sumar los valores de facturación del rango
                                        facturacionMensual = datosRango.Sum(d => d.TotalBruto ?? 0); // TotalBruto es la suma deseada
                                    }
                                    else
                                    {
                                        Console.WriteLine($"Registro omitido por formato incorrecto en CUIT o N° de Terminal. CUIT: {altaItem.CuitCuil}, N° de Terminal: {altaItem.NDeTerminal}");
                                    }
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error al obtener facturación mensual para CUIT: {altaItem.CuitCuil}, Terminal: {altaItem.NDeTerminal}. Detalle: {ex.Message}");
                                }

                                // Escribir la facturación mensual en la nueva columna
                                worksheetAltas.Cell(currentRow, 9).Value = facturacionMensual;

                                currentRow++;
                            }
                        }
                    }


                    // ============================================
                    // Hoja 3: Bajas por Fecha de Baja
                    // ============================================
                    var worksheetBajas = workbook.Worksheets.Add("Bajas");

                    currentRow = 1;
                    worksheetBajas.Cell(currentRow, 1).Value = "Fecha de Baja";
                    worksheetBajas.Cell(currentRow, 2).Value = "NDeTerminal";
                    worksheetBajas.Cell(currentRow, 3).Value = "Nombre de Fantasia";
                    worksheetBajas.Cell(currentRow, 4).Value = "Domicilio";
                    worksheetBajas.Cell(currentRow, 5).Value = "Provincia";
                    worksheetBajas.Cell(currentRow, 6).Value = "Tipo";
                    worksheetBajas.Cell(currentRow, 7).Value = "Motivo";
                    worksheetBajas.Cell(currentRow, 8).Value = "Baja por CUIT/Terminal";  // Nueva columna para indicar si es baja por CUIT o Terminal
                    worksheetBajas.Cell(currentRow, 9).Value = "Facturación";  // Nueva columna para facturación mensual
                    currentRow++;

                    foreach (var semana in semanas)
                    {
                        var bajasSemana = bajasDelMes.Where(b => b.FechaDeBaja.HasValue &&
                                                                 b.FechaDeBaja.Value.Date >= semana.Item1 &&
                                                                 b.FechaDeBaja.Value.Date <= semana.Item2).ToList();

                        if (bajasSemana.Any())
                        {
                            worksheetBajas.Cell(currentRow, 1).Value = $"Semana del {semana.Item1:dd/MM/yyyy} al {semana.Item2:dd/MM/yyyy}";
                            currentRow++;

                            foreach (var bajaItem in bajasSemana)
                            {
                                worksheetBajas.Cell(currentRow, 1).Value = bajaItem.FechaDeBaja?.ToString("dd/MM/yyyy");
                                worksheetBajas.Cell(currentRow, 2).Value = bajaItem.NDeTerminal ?? "Sin terminal"; // Predeterminado si es nulo
                                worksheetBajas.Cell(currentRow, 3).Value = bajaItem.NombreDeFantasia ?? "Sin nombre";
                                worksheetBajas.Cell(currentRow, 4).Value = bajaItem.Domicilio ?? "Sin domicilio";
                                worksheetBajas.Cell(currentRow, 5).Value = bajaItem.Provincia ?? "Sin provincia";
                                worksheetBajas.Cell(currentRow, 6).Value = bajaItem.Baja1 ?? "Sin tipo";
                                worksheetBajas.Cell(currentRow, 7).Value = bajaItem.Observacion ?? "Sin motivo";

                                // Verificar si la baja es por CUIT o Terminal
                                var altaRelacionada = alta.FirstOrDefault(a => a.CuitCuil == Convert.ToDouble(bajaItem.CuitCuil));
                                worksheetBajas.Cell(currentRow, 8).Value = altaRelacionada == null || altaRelacionada.Estado != "ALTA"
                                    ? "Baja por CUIT"
                                    : "Baja por Terminal";

                                // Obtener la facturación del mes para esta baja
                                decimal facturacionMensual = 0;
                                try
                                {
                                    if (double.TryParse(bajaItem.CuitCuil?.ToString(), out double cuit) &&
                                        double.TryParse(bajaItem.NDeTerminal, out double terminal))
                                    {
                                        // Obtener el rango del mes basado en FechaDeBaja
                                        DateTime fechaBaja = bajaItem.FechaDeBaja.Value;
                                        DateTime inicioMes = new DateTime(fechaBaja.Year, fechaBaja.Month, 1);
                                        DateTime finMes = inicioMes.AddMonths(1).AddDays(-1);

                                        // Llamar a la API para obtener la facturación del rango completo
                                        var datosRango = await _baseService.ObtenerFacturacionPorTerminalRango(cuit.ToString(), terminal.ToString(), inicioMes, finMes);

                                        // Sumar los valores de facturación del rango
                                        facturacionMensual = datosRango.Sum(d => d.TotalBruto ?? 0); // TotalBruto es la suma deseada
                                    }
                                    else
                                    {
                                        Console.WriteLine($"Registro omitido por formato incorrecto en CUIT o N° de Terminal. CUIT: {bajaItem.CuitCuil}, N° de Terminal: {bajaItem.NDeTerminal}");
                                    }
                                }
                                catch (Exception ex)
                                {
                                    Console.WriteLine($"Error al obtener facturación mensual para CUIT: {bajaItem.CuitCuil}, Terminal: {bajaItem.NDeTerminal}. Detalle: {ex.Message}");
                                }

                                // Escribir la facturación mensual en la nueva columna
                                worksheetBajas.Cell(currentRow, 9).Value = facturacionMensual;

                                currentRow++;
                            }
                        }
                    }



                    // Guardar y devolver el archivo Excel
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "crm.xlsx"
                        );
                    }
                }
            }

            return BadRequest();
        }

        [HttpPost("excelcrmmensual")]
        public async Task<IActionResult> excelcrmmensual(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                DateTime fecha;

                if (string.IsNullOrEmpty(token.Fecha))
                {
                    fecha = DateTime.Now; // Si no se proporciona fecha, usar la actual
                }
                else
                {
                    try
                    {
                        fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    }
                    catch (FormatException)
                    {
                        fecha = DateTime.Now; // Si la conversión falla, usar la fecha actual
                    }
                }

                var alta = await _altaservice.ObtenerCRM();
                var baja = await _IBajaservice.ObtenerCRMBaja();

                int mesFecha = fecha.Month;
                int anioFecha = fecha.Year;

                // Filtrar las altas y bajas del mes
                var altasDelMes = alta
         .Where(a => a.FechaDeAlta.HasValue
                     && a.FechaDeAlta.Value.Month == mesFecha
                     && a.FechaDeAlta.Value.Year == anioFecha
                     && (a.Altas == "ALTA NUEVA" || a.Altas == "AGREGA" || a.Altas == "ALTA CCTT")) // Filtrar solo las altas nuevas, agrega y cctt
         .ToList();
                var bajasDelMes = baja
                    .Where(b => b.FechaDeBaja.HasValue
                                && b.FechaDeBaja.Value.Month == mesFecha
                                && b.FechaDeBaja.Value.Year == anioFecha
                                && (b.Baja1 == "BAJA POR FACTURACION" || b.Baja1 == "BAJA")) // Filtrar solo bajas por facturación y bajas generales
                    .ToList();

                using (var workbook = new XLWorkbook())
                {
                    // ============================================
                    // Hoja 1: Resumen Mensual
                    // ============================================
                    var worksheetResumen = workbook.Worksheets.Add("Resumen Mensual");
                    int currentRow = 1;

                    // Obtener los tipos de altas únicos
                    var tiposDeAltas = altasDelMes.Select(a => a.Altas).Distinct().ToList();

                    // Encabezados de la tabla de Altas
                    worksheetResumen.Cell(currentRow, 1).Value = "Provincia";
                    int col = 2;
                    foreach (var tipo in tiposDeAltas)
                    {
                        worksheetResumen.Cell(currentRow, col).Value = tipo;
                        col++;
                    }
                    worksheetResumen.Cell(currentRow, col).Value = "Total";
                    currentRow++;

                    // Agrupar las altas por provincia
                    var resumenPorProvincia = altasDelMes
                        .GroupBy(a => a.Provincia)
                        .Select(g => new
                        {
                            Provincia = g.Key,
                            Tipos = tiposDeAltas.ToDictionary(tipo => tipo, tipo => g.Count(a => a.Altas == tipo))
                        })
                        .ToList();

                    var totalesPorTipo = tiposDeAltas.ToDictionary(tipo => tipo, tipo => 0);
                    int totalGeneralMes = 0;

                    foreach (var resumen in resumenPorProvincia)
                    {
                        worksheetResumen.Cell(currentRow, 1).Value = resumen.Provincia;
                        col = 2;
                        int totalPorProvincia = 0;

                        foreach (var tipo in tiposDeAltas)
                        {
                            var cantidad = resumen.Tipos.ContainsKey(tipo) ? resumen.Tipos[tipo] : 0;
                            worksheetResumen.Cell(currentRow, col).Value = cantidad;
                            totalPorProvincia += cantidad;
                            totalesPorTipo[tipo] += cantidad;
                            col++;
                        }

                        worksheetResumen.Cell(currentRow, col).Value = totalPorProvincia;
                        totalGeneralMes += totalPorProvincia;
                        currentRow++;
                    }

                    // Escribir el total del mes
                    worksheetResumen.Cell(currentRow, 1).Value = "Total del Mes:";
                    col = 2;
                    foreach (var tipo in tiposDeAltas)
                    {
                        worksheetResumen.Cell(currentRow, col).Value = totalesPorTipo[tipo];
                        col++;
                    }
                    worksheetResumen.Cell(currentRow, col).Value = totalGeneralMes;
                    currentRow += 2;

                    // ============================================
                    // Hoja 2: CRM Sin Fecha de Baja (Altas + Bajas)
                    // ============================================

                    // Crear la hoja de cálculo "ALTAS"
                    var worksheetSinFechaBaja = workbook.Worksheets.Add("ALTAS");

                    currentRow = 1;

                    // Títulos principales
                    worksheetSinFechaBaja.Cell(currentRow, 1).Value = "ESTADO";
                    worksheetSinFechaBaja.Cell(currentRow, 2).Value = "N° TERMINAL";
                    worksheetSinFechaBaja.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
                    worksheetSinFechaBaja.Cell(currentRow, 4).Value = "PROVINCIA";
                    worksheetSinFechaBaja.Cell(currentRow, 5).Value = "FECHA DE ALTA";
                    worksheetSinFechaBaja.Cell(currentRow, 6).Value = "FECHA DE BAJA";
                    worksheetSinFechaBaja.Cell(currentRow, 7).Value = "TIPO ALTA";
                    worksheetSinFechaBaja.Cell(currentRow, 8).Value = "TIPO BAJA";
                    worksheetSinFechaBaja.Cell(currentRow, 9).Value = "GESTOR";
                    worksheetSinFechaBaja.Cell(currentRow, 10).Value = "CUIT/CUIL";

                    // Obtener los meses para la cabecera dinámica (Desde enero hasta el mes actual)
                    var meses = new List<DateTime>();
                    DateTime fechaDesdeRequest = fecha; // `fecha` viene del método excelcrmmensual
                    DateTime fechaInicio = new DateTime(fechaDesdeRequest.Year, 1, 1); // Desde enero
                    DateTime fechaActual = fechaDesdeRequest; // Hasta el mes actual

                    // Generar la lista de meses desde enero hasta el mes actual
                    for (var date = fechaInicio; date <= fechaActual; date = date.AddMonths(1))
                    {
                        meses.Add(new DateTime(date.Year, date.Month, 1));
                    }

                    // Filtrar y seleccionar las **altas** excluyendo "ALTA SSTT"
                    var listaAltas = alta
                        .Where(a => a.FechaDeAlta.HasValue
                                    && a.FechaDeAlta >= fechaInicio
                                    && a.FechaDeAlta <= fechaActual
                                    && a.Altas != "ALTA SSTT")
                        .Select(a => new RegistroCRM
                        {
                            Estado = a.Estado ?? "",
                            NDeTerminal = a.NDeTerminal,
                            NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                            Provincia = a.Provincia ?? "Sin provincia",
                            FechaDeAlta = a.FechaDeAlta,
                            FechaDeBaja = a.FechaDeBaja,
                            TipoAlta = a.Altas ?? "",
                            TipoBaja = a.Baja ?? "",
                            Gestor = a.NombreDelAsesor ?? "Desconocido",
                            Cuit = a.CuitCuil, // Uso del campo CuitCuil
                            TipoTransaccion = "ALTA"
                        })
                        .ToList();

                    // Filtrar y seleccionar las **bajas** excluyendo "BAJA SSTT"
                    var listaBajas = baja
                        .Where(b => b.FechaDeBaja.HasValue
                                    && b.FechaDeAlta.HasValue
                                    && b.FechaDeBaja >= fechaInicio
                                    && b.FechaDeBaja <= fechaActual
                                    && b.Baja1 != "BAJA SSTT")
                        .Select(b => new RegistroCRM
                        {
                            Estado = b.Estado ?? "",
                            NDeTerminal = double.TryParse(b.NDeTerminal, out double result) ? (double?)result : null,
                            NombreDeFantasia = b.NombreDeFantasia ?? "Sin nombre",
                            Provincia = b.Provincia ?? "Sin provincia",
                            FechaDeAlta = b.FechaDeAlta.HasValue ? b.FechaDeAlta : null,
                            FechaDeBaja = b.FechaDeBaja.HasValue ? b.FechaDeBaja : null,
                            TipoAlta = b.Altas ?? "",
                            TipoBaja = b.Baja1 ?? "",
                            Gestor = b.NombreDelAsesor ?? "Desconocido",
                            Cuit = b.CuitCuil, // Uso del campo CuitCuil
                            TipoTransaccion = "BAJA"
                        })
                        .ToList();

                    // Unir ambas listas de altas y bajas, colocando las bajas relacionadas justo debajo de la alta correspondiente
                    var listaUnificada = new List<RegistroCRM>();

                    foreach (var altaItem in listaAltas.OrderBy(a => a.FechaDeAlta))
                    {
                        // Añadir la alta a la lista unificada
                        listaUnificada.Add(altaItem);

                        // Buscar y añadir las bajas que coincidan con el mismo CUIT/CUIL y Nombre de Fantasía
                        var bajasRelacionadas = listaBajas.Where(b => b.Cuit == altaItem.Cuit && b.NombreDeFantasia == altaItem.NombreDeFantasia).ToList();

                        if (bajasRelacionadas.Any())
                        {
                            listaUnificada.AddRange(bajasRelacionadas);
                            // Eliminar las bajas relacionadas de la lista de bajas para evitar duplicados
                            listaBajas = listaBajas.Except(bajasRelacionadas).ToList();
                        }
                    }

                    // Añadir el resto de las bajas que no tienen coincidencia con altas, ordenadas por fecha de alta
                    listaUnificada.AddRange(listaBajas.OrderBy(b => b.FechaDeAlta));

                    // Añadir los meses a la cabecera
                    int columnaMes = 11;
                    foreach (var mes in meses)
                    {
                        worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = mes.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")).ToUpper();
                        columnaMes++;
                    }

                    currentRow++;

                    // Rellenar la hoja con los datos filtrados de **ALTAS** y **BAJAS**
                    foreach (var item in listaUnificada)
                    {
                        // Validar que Estado, NDeTerminal y NombreDeFantasia no sean nulos o vacíos
                        if (string.IsNullOrEmpty(item.Estado) || string.IsNullOrEmpty(Convert.ToString(item.NDeTerminal)) || string.IsNullOrEmpty(item.NombreDeFantasia))
                        {
                            Console.WriteLine("Registro omitido por valores incompletos en Estado, N° de Terminal o Nombre de Fantasía.");
                            continue;
                        }

                        // Validar que FechaDeAlta y Cuit tengan valor
                        if (!item.FechaDeAlta.HasValue || !item.Cuit.HasValue)
                        {
                            Console.WriteLine("Registro omitido por falta de Fecha de Alta o CUIT.");
                            continue;
                        }
                        //var sumatoriaitem = await _baseService.DatosCuitPorFechaOperacionDiaria(item);
                        // Agregar los datos a la hoja de cálculo
                        worksheetSinFechaBaja.Cell(currentRow, 1).Value = item.Estado;
                        worksheetSinFechaBaja.Cell(currentRow, 2).Value = item.NDeTerminal;
                        worksheetSinFechaBaja.Cell(currentRow, 3).Value = item.NombreDeFantasia;
                        worksheetSinFechaBaja.Cell(currentRow, 4).Value = item.Provincia ?? "Sin provincia";
                        worksheetSinFechaBaja.Cell(currentRow, 5).Value = item.FechaDeAlta?.ToString("dd/MM/yyyy");
                        worksheetSinFechaBaja.Cell(currentRow, 6).Value = item.FechaDeBaja?.ToString("dd/MM/yyyy");
                        worksheetSinFechaBaja.Cell(currentRow, 7).Value = item.TipoAlta ?? "";
                        worksheetSinFechaBaja.Cell(currentRow, 8).Value = item.TipoBaja ?? "";
                        worksheetSinFechaBaja.Cell(currentRow, 9).Value = item.Gestor ?? "Sin gestor";

                        // Convertir el CUIT a texto para evitar problemas de formato
                        worksheetSinFechaBaja.Cell(currentRow, 10).Style.NumberFormat.Format = "@";
                        worksheetSinFechaBaja.Cell(currentRow, 10).Value = item.Cuit.HasValue ? item.Cuit.Value.ToString("F0") : "";

                        try
                        {
                            // Validar los datos antes de la llamada al servicio
                            if (!double.TryParse(Convert.ToString(item.Cuit), out double cuitResult) ||
                                !double.TryParse(Convert.ToString(item.NDeTerminal), out double terminalResult))
                            {
                                Console.WriteLine($"Registro omitido por formato incorrecto en CUIT o N° de Terminal. CUIT: {item.Cuit}, N° de Terminal: {item.NDeTerminal}");
                                continue;
                            }

                            // Obtener los totales brutos para este comercio desde enero hasta el mes actual
                            var datosmes = await _baseService.DatosCuitPorFecha(cuitResult.ToString(), terminalResult.ToString(), fechaInicio);

                            // Insertar los totales brutos debajo de los meses correspondientes
                            columnaMes = 11;
                            foreach (var mes in meses)
                            {
                                var mesClave = mes.ToString("MM/yyyy");
                                var totalBruto = datosmes.FirstOrDefault(d => d.Key == mesClave);
                                worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
                                columnaMes++;
                            }

                            currentRow++; // Mover a la siguiente fila para el siguiente comercio
                        }
                        catch (Exception ex)
                        {
                            Console.WriteLine($"Error al obtener datos para el comercio {item.Cuit}: {ex.Message}");
                            continue;
                        }
                    }

                    // Ajustar el formato de las celdas
                    worksheetSinFechaBaja.Columns().AdjustToContents();


                    // ============================================
                    // Hoja 3: Bajas del Mes (nueva hoja)
                    // ============================================

                    // Crear la hoja de cálculo "Bajas del Mes"
                    var worksheetBajasMes = workbook.Worksheets.Add("Bajas del Mes");

                    currentRow = 1;

                    // Títulos principales
                    worksheetBajasMes.Cell(currentRow, 1).Value = "Fecha de Baja";
                    worksheetBajasMes.Cell(currentRow, 2).Value = "N° TERMINAL";
                    worksheetBajasMes.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
                    worksheetBajasMes.Cell(currentRow, 4).Value = "DOMICILIO";
                    worksheetBajasMes.Cell(currentRow, 5).Value = "PROVINCIA";
                    worksheetBajasMes.Cell(currentRow, 6).Value = "TIPO";
                    worksheetBajasMes.Cell(currentRow, 7).Value = "MOTIVO";
                    worksheetBajasMes.Cell(currentRow, 8).Value = "BAJA POR CUIT/TERMINAL";

                    currentRow++;

                    // Rellenar la hoja con las bajas del mes
                    foreach (var bajaItem in bajasDelMes)
                    {
                        worksheetBajasMes.Cell(currentRow, 1).Value = bajaItem.FechaDeBaja?.ToString("dd/MM/yyyy");
                        worksheetBajasMes.Cell(currentRow, 2).Value = bajaItem.NDeTerminal;
                        worksheetBajasMes.Cell(currentRow, 3).Value = bajaItem.NombreDeFantasia;
                        worksheetBajasMes.Cell(currentRow, 4).Value = bajaItem.Domicilio ?? "Sin domicilio";
                        worksheetBajasMes.Cell(currentRow, 5).Value = bajaItem.Provincia ?? "Sin provincia";
                        worksheetBajasMes.Cell(currentRow, 6).Value = bajaItem.Baja1;
                        worksheetBajasMes.Cell(currentRow, 7).Value = bajaItem.Observacion ?? "Sin motivo";

                        // Verificar si es baja por CUIT o Terminal
                        var altaRelacionada = altasDelMes.FirstOrDefault(a => a.CuitRazonSocial == Convert.ToDouble(bajaItem.CuitRazonSocial));

                        if (altaRelacionada == null || altaRelacionada.Estado != "ALTA")
                        {
                            worksheetBajasMes.Cell(currentRow, 8).Value = "Baja por CUIT";
                        }
                        else
                        {
                            worksheetBajasMes.Cell(currentRow, 8).Value = "Baja por Terminal";
                        }

                        currentRow++;
                    }

                    // Ajustar el formato de las celdas
                    worksheetBajasMes.Columns().AdjustToContents();

                    // Guardar y devolver el archivo Excel
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "crm_mensual.xlsx"
                        );
                    }
                }
            }

            return BadRequest();
        }
        //[HttpPost("excelfacturacion")]
        //public async Task<IActionResult> ExcelFacturacion(VMToken token)
        //{
        //    bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
        //    if (esTokenValido)
        //    {
        //        DateTime fecha;

        //        if (string.IsNullOrEmpty(token.Fecha))
        //        {
        //            fecha = DateTime.Now.AddDays(1); // Usar el día de mañana
        //        }
        //        else
        //        {
        //            try
        //            {
        //                fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
        //            }
        //            catch (FormatException)
        //            {
        //                fecha = DateTime.Now.AddDays(1); // Si la conversión falla, usar el día de mañana
        //            }
        //        }

        //        var alta = await _altaservice.ObtenerCRM();
        //        var baja = await _IBajaservice.ObtenerCRMBaja();

        //        // Obtener los meses para la cabecera dinámica (Desde enero hasta el mes actual)
        //        DateTime fechaInicio = new DateTime(fecha.Year, 1, 1); // Desde enero
        //        DateTime fechaActual = fecha;

        //        var meses = new List<DateTime>();
        //        for (var date = fechaInicio; date <= fechaActual; date = date.AddMonths(1))
        //        {
        //            meses.Add(new DateTime(date.Year, date.Month, 1));
        //        }

        //        // Facturación diaria mínima
        //        decimal facturacionDiariaMinima = 50000;
        //        int diasTranscurridosMes = fecha.Day; // Días transcurridos en el mes actual
        //        decimal facturacionMinimaEsperada = facturacionDiariaMinima * diasTranscurridosMes; // Facturación mínima esperada hasta el día actual

        //        // Filtrar y seleccionar todas las **altas**
        //        var listaAltas = alta
        //            .Select(a => new RegistroCRM
        //            {
        //                Estado = a.Estado ?? "",
        //                NDeTerminal = a.NDeTerminal,
        //                NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
        //                Provincia = a.Provincia ?? "Sin provincia",
        //                FechaDeAlta = a.FechaDeAlta,
        //                FechaDeBaja = a.FechaDeBaja,
        //                TipoAlta = a.Altas ?? "",
        //                TipoBaja = a.Baja ?? "",
        //                Gestor = a.NombreDelAsesor ?? "Desconocido",
        //                Cuit = a.CuitCuil,
        //                RazonSocial = a.RazonSocial ?? "Sin Razón Social",
        //                TipoTransaccion = "ALTA"
        //            })
        //            .ToList();

        //        // Agrupar por CUIT y calcular la facturación del último mes
        //        var listaAgrupadaPorCuit = listaAltas
        //            .GroupBy(a => a.Cuit)
        //            .Select(g => new
        //            {
        //                Cuit = g.Key,
        //                Terminales = g.ToList(),
        //                RazonSocial = g.FirstOrDefault()?.RazonSocial ?? "Sin Razón Social",
        //                FacturacionTotalUltimoMes = g.Sum(a =>
        //                {
        //                    if (a.Cuit.HasValue && a.NDeTerminal.HasValue)
        //                    {
        //                        var datosmes = _baseService.DatosCuitPorFecha(a.Cuit.ToString(), a.NDeTerminal.ToString(), fechaInicio).Result;
        //                        return datosmes.FirstOrDefault(d => d.Key == meses.Last().ToString("MM/yyyy")).Value;
        //                    }
        //                    else
        //                    {
        //                        return 0;
        //                    }
        //                })
        //            })
        //            .OrderByDescending(g => g.FacturacionTotalUltimoMes)
        //            .ToList();

        //        using (var workbook = new XLWorkbook())
        //        {
        //            var worksheetSinFechaBaja = workbook.Worksheets.Add("ALTAS");

        //            int currentRow = 1;

        //            // Títulos principales
        //            worksheetSinFechaBaja.Cell(currentRow, 1).Value = "ESTADO";
        //            worksheetSinFechaBaja.Cell(currentRow, 2).Value = "N° TERMINAL";
        //            worksheetSinFechaBaja.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
        //            worksheetSinFechaBaja.Cell(currentRow, 4).Value = "PROVINCIA";
        //            worksheetSinFechaBaja.Cell(currentRow, 5).Value = "FECHA DE ALTA";
        //            worksheetSinFechaBaja.Cell(currentRow, 6).Value = "FECHA DE BAJA";
        //            worksheetSinFechaBaja.Cell(currentRow, 7).Value = "TIPO ALTA";
        //            worksheetSinFechaBaja.Cell(currentRow, 8).Value = "TIPO BAJA";
        //            worksheetSinFechaBaja.Cell(currentRow, 9).Value = "GESTOR";
        //            worksheetSinFechaBaja.Cell(currentRow, 10).Value = "CUIT/CUIL";

        //            // Añadir los meses a la cabecera
        //            int columnaMes = 11;
        //            foreach (var mes in meses)
        //            {
        //                worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = mes.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")).ToUpper();
        //                columnaMes++;
        //            }

        //            currentRow++;

        //            // Rellenar la hoja con los datos agrupados por CUIT
        //            foreach (var grupo in listaAgrupadaPorCuit)
        //            {
        //                decimal[] totalFacturacionPorMes = new decimal[meses.Count]; // Para sumar la facturación de cada mes

        //                // Calcular la facturación mínima esperada total por CUIT
        //                decimal facturacionMinimaTotalPorCuit = facturacionMinimaEsperada * grupo.Terminales.Count;

        //                // Verificar si el CUIT cumple con la facturación mínima
        //                bool cuitCumple = grupo.FacturacionTotalUltimoMes >= facturacionMinimaTotalPorCuit;

        //                // Añadir los datos de cada terminal
        //                foreach (var terminal in grupo.Terminales)
        //                {
        //                    worksheetSinFechaBaja.Cell(currentRow, 1).Value = terminal.Estado;
        //                    worksheetSinFechaBaja.Cell(currentRow, 2).Value = terminal.NDeTerminal;
        //                    worksheetSinFechaBaja.Cell(currentRow, 3).Value = terminal.NombreDeFantasia;
        //                    worksheetSinFechaBaja.Cell(currentRow, 4).Value = terminal.Provincia ?? "Sin provincia";
        //                    worksheetSinFechaBaja.Cell(currentRow, 5).Value = terminal.FechaDeAlta?.ToString("dd/MM/yyyy");
        //                    worksheetSinFechaBaja.Cell(currentRow, 6).Value = terminal.FechaDeBaja?.ToString("dd/MM/yyyy");
        //                    worksheetSinFechaBaja.Cell(currentRow, 7).Value = terminal.TipoAlta ?? "";
        //                    worksheetSinFechaBaja.Cell(currentRow, 8).Value = terminal.TipoBaja ?? "";
        //                    worksheetSinFechaBaja.Cell(currentRow, 9).Value = terminal.Gestor ?? "Sin gestor";
        //                    worksheetSinFechaBaja.Cell(currentRow, 10).Style.NumberFormat.Format = "@";
        //                    worksheetSinFechaBaja.Cell(currentRow, 10).Value = terminal.Cuit.HasValue ? terminal.Cuit.Value.ToString("F0") : "";

        //                    // Agregar la facturación por mes
        //                    columnaMes = 11;
        //                    var datosmes = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
        //                        ? await _baseService.DatosCuitPorFecha(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicio)
        //                        : new List<KeyValuePair<string, decimal>>();

        //                    decimal facturacionUltimoMes = 0;
        //                    for (int i = 0; i < meses.Count; i++)
        //                    {
        //                        var mesClave = meses[i].ToString("MM/yyyy");
        //                        var totalBruto = datosmes.FirstOrDefault(d => d.Key == mesClave);
        //                        decimal facturacionMes = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
        //                        worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = facturacionMes;
        //                        totalFacturacionPorMes[i] += facturacionMes; // Sumar facturación al total por mes
        //                        if (i == meses.Count - 1)
        //                        {
        //                            facturacionUltimoMes = facturacionMes; // Guardar la facturación del último mes
        //                        }
        //                        columnaMes++;
        //                    }

        //                    // Si el CUIT no cumple la facturación mínima, verificar la terminal
        //                    if (!cuitCumple && facturacionUltimoMes < facturacionMinimaEsperada)
        //                    {
        //                        if (facturacionUltimoMes == 0)
        //                        {
        //                            worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "No Factura";
        //                        }
        //                        else
        //                        {
        //                            worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "Baja Facturación";
        //                        }
        //                    }
        //                    else
        //                    {
        //                        worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "Activa";
        //                    }

        //                    currentRow++;
        //                }

        //                // Fila con Razón Social y sumatoria de la facturación por terminales
        //                worksheetSinFechaBaja.Cell(currentRow, 1).Value = "TOTAL";
        //                worksheetSinFechaBaja.Cell(currentRow, 2).Value = "Todas";
        //                worksheetSinFechaBaja.Cell(currentRow, 3).Value = grupo.RazonSocial;
        //                worksheetSinFechaBaja.Cell(currentRow, 10).Value = grupo.Cuit?.ToString("F0");

        //                // Mostrar la sumatoria de la facturación por mes
        //                columnaMes = 11;
        //                for (int i = 0; i < totalFacturacionPorMes.Length; i++)
        //                {
        //                    worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = totalFacturacionPorMes[i];
        //                    columnaMes++;
        //                }

        //                currentRow++;
        //            }

        //            worksheetSinFechaBaja.Columns().AdjustToContents();

        //            // Segunda hoja con facturación diaria
        //            var worksheetFacturacionDiaria = workbook.Worksheets.Add("FACTURACIÓN DIARIA");

        //            currentRow = 1;

        //            // Títulos principales
        //            worksheetFacturacionDiaria.Cell(currentRow, 1).Value = "ESTADO";
        //            worksheetFacturacionDiaria.Cell(currentRow, 2).Value = "N° TERMINAL";
        //            worksheetFacturacionDiaria.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 4).Value = "PROVINCIA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 5).Value = "FECHA DE ALTA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 6).Value = "FECHA DE BAJA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 7).Value = "TIPO ALTA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 8).Value = "TIPO BAJA";
        //            worksheetFacturacionDiaria.Cell(currentRow, 9).Value = "GESTOR";
        //            worksheetFacturacionDiaria.Cell(currentRow, 10).Value = "CUIT/CUIL";

        //            // Añadir los días del mes a la cabecera
        //            int diasDelMes = DateTime.DaysInMonth(fecha.Year, fecha.Month);
        //            int columnaDia = 11;
        //            for (int dia = 1; dia <= diasDelMes; dia++)
        //            {
        //                worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = dia.ToString("00") + " " + fecha.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")).ToUpper();
        //                columnaDia++;
        //            }

        //            currentRow++;

        //            // Aquí rellenamos la hoja con los datos agrupados por CUIT y facturación diaria
        //            foreach (var grupo in listaAgrupadaPorCuit)
        //            {
        //                decimal[] totalFacturacionPorDia = new decimal[diasDelMes]; // Para sumar la facturación de cada día

        //                // Añadir los datos de cada terminal
        //                foreach (var terminal in grupo.Terminales)
        //                {
        //                    worksheetFacturacionDiaria.Cell(currentRow, 1).Value = terminal.Estado;
        //                    worksheetFacturacionDiaria.Cell(currentRow, 2).Value = terminal.NDeTerminal;
        //                    worksheetFacturacionDiaria.Cell(currentRow, 3).Value = terminal.NombreDeFantasia;
        //                    worksheetFacturacionDiaria.Cell(currentRow, 4).Value = terminal.Provincia ?? "Sin provincia";
        //                    worksheetFacturacionDiaria.Cell(currentRow, 5).Value = terminal.FechaDeAlta?.ToString("dd/MM/yyyy");
        //                    worksheetFacturacionDiaria.Cell(currentRow, 6).Value = terminal.FechaDeBaja?.ToString("dd/MM/yyyy");
        //                    worksheetFacturacionDiaria.Cell(currentRow, 7).Value = terminal.TipoAlta ?? "";
        //                    worksheetFacturacionDiaria.Cell(currentRow, 8).Value = terminal.TipoBaja ?? "";
        //                    worksheetFacturacionDiaria.Cell(currentRow, 9).Value = terminal.Gestor ?? "Sin gestor";
        //                    worksheetFacturacionDiaria.Cell(currentRow, 10).Style.NumberFormat.Format = "@";
        //                    worksheetFacturacionDiaria.Cell(currentRow, 10).Value = terminal.Cuit.HasValue ? terminal.Cuit.Value.ToString("F0") : "";

        //                    // Agregar la facturación por día
        //                    columnaDia = 11;
        //                    var datosDia = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
        //                        ? await _baseService.DatosCuitPorFechaDiaria(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicio)
        //                        : new List<KeyValuePair<string, decimal>>();

        //                    for (int i = 1; i <= diasDelMes; i++)
        //                    {
        //                        var diaClave = new DateTime(fecha.Year, fecha.Month, i).ToString("dd/MM/yyyy");
        //                        var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
        //                        decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
        //                        worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = facturacionDia;
        //                        totalFacturacionPorDia[i - 1] += facturacionDia; // Sumar facturación al total por día
        //                        columnaDia++;
        //                    }

        //                    currentRow++;
        //                }

        //                // Fila con Razón Social y sumatoria de la facturación por terminales
        //                worksheetFacturacionDiaria.Cell(currentRow, 1).Value = "TOTAL";
        //                worksheetFacturacionDiaria.Cell(currentRow, 2).Value = "Todas";
        //                worksheetFacturacionDiaria.Cell(currentRow, 3).Value = grupo.RazonSocial;
        //                worksheetFacturacionDiaria.Cell(currentRow, 10).Value = grupo.Cuit?.ToString("F0");

        //                // Mostrar la sumatoria de la facturación por día
        //                columnaDia = 11;
        //                for (int i = 0; i < totalFacturacionPorDia.Length; i++)
        //                {
        //                    worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = totalFacturacionPorDia[i];
        //                    columnaDia++;
        //                }

        //                currentRow++;
        //            }

        //            worksheetFacturacionDiaria.Columns().AdjustToContents();

        //            // Guardar y devolver el archivo Excel
        //            using (var stream = new MemoryStream())
        //            {
        //                workbook.SaveAs(stream);
        //                var content = stream.ToArray();

        //                return File(
        //                    content,
        //                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //                    "crm_mensual_y_diario.xlsx"
        //                );
        //            }
        //        }
        //    }

        //    return BadRequest();
        //}

        [HttpPost("excelfacturacion")]
        public async Task<IActionResult> ExcelFacturacionAltas(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                DateTime fecha;

                if (string.IsNullOrEmpty(token.Fecha))
                {
                    fecha = DateTime.Now.AddDays(1); // Usar el día de mañana
                }
                else
                {
                    try
                    {
                        fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    }
                    catch (FormatException)
                    {
                        fecha = DateTime.Now.AddDays(1); // Si la conversión falla, usar el día de mañana
                    }
                }

                var alta = await _altaservice.ObtenerCRM();

                // Obtener los meses para la cabecera dinámica (Desde enero hasta el mes actual)
                DateTime fechaInicio = fecha.AddMonths(-3); // Desde enero
                DateTime fechaActual = fecha;

                var meses = new List<DateTime>();
                for (var date = fechaInicio; date <= fechaActual; date = date.AddMonths(1))
                {
                    meses.Add(new DateTime(date.Year, date.Month, 1));
                }

                // Facturación diaria mínima
                decimal facturacionDiariaMinima = 50000;
                int diasTranscurridosMes = fecha.Day; // Días transcurridos en el mes actual
                decimal facturacionMinimaEsperada = facturacionDiariaMinima * diasTranscurridosMes; // Facturación mínima esperada hasta el día actual

                // Filtrar y seleccionar todas las **altas**
                var listaAltas = alta
                    .Select(a => new RegistroCRM
                    {
                        Estado = a.Estado ?? "",
                        NDeTerminal = a.NDeTerminal,
                        NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                        Provincia = a.Provincia ?? "Sin provincia",
                        FechaDeAlta = a.FechaDeAlta,
                        FechaDeBaja = a.FechaDeBaja,
                        TipoAlta = a.Altas ?? "",
                        TipoBaja = a.Baja ?? "",
                        Gestor = a.NombreDelAsesor ?? "Desconocido",
                        Cuit = a.CuitCuil,
                        RazonSocial = a.RazonSocial ?? "Sin Razón Social",
                        TipoTransaccion = "ALTA"
                    })
                    .ToList();

                // Agrupar por CUIT y calcular la facturación del último mes
                var listaAgrupadaPorCuit = listaAltas
                    .GroupBy(a => a.Cuit)
                    .Select(g => new
                    {
                        Cuit = g.Key,
                        Terminales = g.ToList(),
                        RazonSocial = g.FirstOrDefault()?.RazonSocial ?? "Sin Razón Social",
                        FacturacionTotalUltimoMes = g.Sum(a =>
                        {
                            if (a.Cuit.HasValue && a.NDeTerminal.HasValue)
                            {
                                var datosmes = _baseService.DatosCuitPorFecha(a.Cuit.ToString(), a.NDeTerminal.ToString(), fechaInicio).Result;
                                return datosmes.FirstOrDefault(d => d.Key == meses.Last().ToString("MM/yyyy")).Value;
                            }
                            else
                            {
                                return 0;
                            }
                        })
                    })
                    .OrderByDescending(g => g.FacturacionTotalUltimoMes)
                    .ToList();

                using (var workbook = new XLWorkbook())
                {
                    var worksheetSinFechaBaja = workbook.Worksheets.Add("ALTAS");

                    int currentRow = 1;

                    // Títulos principales
                    worksheetSinFechaBaja.Cell(currentRow, 1).Value = "ESTADO";
                    worksheetSinFechaBaja.Cell(currentRow, 2).Value = "N° TERMINAL";
                    worksheetSinFechaBaja.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
                    worksheetSinFechaBaja.Cell(currentRow, 4).Value = "PROVINCIA";
                    worksheetSinFechaBaja.Cell(currentRow, 5).Value = "FECHA DE ALTA";
                    worksheetSinFechaBaja.Cell(currentRow, 6).Value = "FECHA DE BAJA";
                    worksheetSinFechaBaja.Cell(currentRow, 7).Value = "TIPO ALTA";
                    worksheetSinFechaBaja.Cell(currentRow, 8).Value = "TIPO BAJA";
                    worksheetSinFechaBaja.Cell(currentRow, 9).Value = "GESTOR";
                    worksheetSinFechaBaja.Cell(currentRow, 10).Value = "CUIT/CUIL";

                    // Añadir los meses a la cabecera
                    int columnaMes = 11;
                    foreach (var mes in meses)
                    {
                        worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = mes.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")).ToUpper();
                        columnaMes++;
                    }

                    currentRow++;

                    // Rellenar la hoja con los datos agrupados por CUIT
                    foreach (var grupo in listaAgrupadaPorCuit)
                    {
                        decimal[] totalFacturacionPorMes = new decimal[meses.Count]; // Para sumar la facturación de cada mes

                        // Calcular la facturación mínima esperada total por CUIT
                        decimal facturacionMinimaTotalPorCuit = facturacionMinimaEsperada * grupo.Terminales.Count;

                        // Verificar si el CUIT cumple con la facturación mínima
                        bool cuitCumple = grupo.FacturacionTotalUltimoMes >= facturacionMinimaTotalPorCuit;

                        // Añadir los datos de cada terminal
                        foreach (var terminal in grupo.Terminales)
                        {
                            worksheetSinFechaBaja.Cell(currentRow, 1).Value = terminal.Estado;
                            worksheetSinFechaBaja.Cell(currentRow, 2).Value = terminal.NDeTerminal;
                            worksheetSinFechaBaja.Cell(currentRow, 3).Value = terminal.NombreDeFantasia;
                            worksheetSinFechaBaja.Cell(currentRow, 4).Value = terminal.Provincia ?? "Sin provincia";
                            worksheetSinFechaBaja.Cell(currentRow, 5).Value = terminal.FechaDeAlta?.ToString("dd/MM/yyyy");
                            worksheetSinFechaBaja.Cell(currentRow, 6).Value = terminal.FechaDeBaja?.ToString("dd/MM/yyyy");
                            worksheetSinFechaBaja.Cell(currentRow, 7).Value = terminal.TipoAlta ?? "";
                            worksheetSinFechaBaja.Cell(currentRow, 8).Value = terminal.TipoBaja ?? "";
                            worksheetSinFechaBaja.Cell(currentRow, 9).Value = terminal.Gestor ?? "Sin gestor";
                            worksheetSinFechaBaja.Cell(currentRow, 10).Style.NumberFormat.Format = "@";
                            worksheetSinFechaBaja.Cell(currentRow, 10).Value = terminal.Cuit.HasValue ? terminal.Cuit.Value.ToString("F0") : "";

                            // Agregar la facturación por mes
                            columnaMes = 11;
                            var datosmes = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                                ? await _baseService.DatosCuitPorFecha(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicio)
                                : new List<KeyValuePair<string, decimal>>();

                            decimal facturacionUltimoMes = 0;
                            for (int i = 0; i < meses.Count; i++)
                            {
                                var mesClave = meses[i].ToString("MM/yyyy");
                                var totalBruto = datosmes.FirstOrDefault(d => d.Key == mesClave);
                                decimal facturacionMes = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
                                worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = facturacionMes;
                                totalFacturacionPorMes[i] += facturacionMes; // Sumar facturación al total por mes
                                if (i == meses.Count - 1)
                                {
                                    facturacionUltimoMes = facturacionMes; // Guardar la facturación del último mes
                                }
                                columnaMes++;
                            }

                            // Si el CUIT no cumple la facturación mínima, verificar la terminal
                            if (!cuitCumple && facturacionUltimoMes < facturacionMinimaEsperada)
                            {
                                if (facturacionUltimoMes == 0)
                                {
                                    worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "No Factura";
                                }
                                else
                                {
                                    worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "Baja Facturación";
                                }
                            }
                            else
                            {
                                worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = "Activa";
                            }

                            currentRow++;
                        }

                        // Fila con Razón Social y sumatoria de la facturación por terminales
                        worksheetSinFechaBaja.Cell(currentRow, 1).Value = "TOTAL";
                        worksheetSinFechaBaja.Cell(currentRow, 2).Value = "Todas";
                        worksheetSinFechaBaja.Cell(currentRow, 3).Value = grupo.RazonSocial;
                        worksheetSinFechaBaja.Cell(currentRow, 10).Value = grupo.Cuit?.ToString("F0");

                        // Mostrar la sumatoria de la facturación por mes
                        columnaMes = 11;
                        for (int i = 0; i < totalFacturacionPorMes.Length; i++)
                        {
                            worksheetSinFechaBaja.Cell(currentRow, columnaMes).Value = totalFacturacionPorMes[i];
                            columnaMes++;
                        }

                        currentRow++;
                    }

                    worksheetSinFechaBaja.Columns().AdjustToContents();

                    // Guardar y devolver el archivo Excel
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "crm_altas.xlsx"
                        );
                    }
                }
            }

            return BadRequest();
        }

        [HttpPost("excelfacturacionmensualdia")]
        public async Task<IActionResult> ExcelFacturacionDiaria(VMToken token)
        {
            bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
            if (esTokenValido)
            {
                DateTime fecha;

                if (string.IsNullOrEmpty(token.Fecha))
                {
                    fecha = DateTime.Now; // Usar el día de hoy
                }
                else
                {
                    try
                    {
                        fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
                    }
                    catch (FormatException)
                    {
                        fecha = DateTime.Now; // Si la conversión falla, usar el día de hoy
                    }
                }

                // Verificar si hoy es el último día del mes
                bool esUltimoDiaDelMes = fecha.Day == DateTime.DaysInMonth(fecha.Year, fecha.Month);

                // Día de referencia (mañana si no es el último día del mes, hoy si es el último día)
                DateTime diaReferencia = esUltimoDiaDelMes ? fecha : fecha.AddDays(1);

                var alta = await _altaservice.ObtenerCRM();

                // Obtener la fecha de inicio para facturación diaria
                DateTime fechaInicioMes = new DateTime(fecha.Year, fecha.Month, 1); // Primer día del mes

                int diasDelMes = (diaReferencia - fechaInicioMes).Days + 1; // Días desde el inicio del mes hasta diaReferencia

                // Filtrar y seleccionar todas las **altas**
                var listaAltas = alta
                    .Select(a => new RegistroCRM
                    {
                        Estado = a.Estado ?? "",
                        NDeTerminal = a.NDeTerminal,
                        NombreDeFantasia = a.NombreDeFantasia ?? "Sin nombre",
                        Provincia = a.Provincia ?? "Sin provincia",
                        FechaDeAlta = a.FechaDeAlta,
                        FechaDeBaja = a.FechaDeBaja,
                        TipoAlta = a.Altas ?? "",
                        TipoBaja = a.Baja ?? "",
                        Gestor = a.NombreDelAsesor ?? "Desconocido",
                        Cuit = a.CuitCuil,
                        RazonSocial = a.RazonSocial ?? "Sin Razón Social",
                        TipoTransaccion = "ALTA"
                    })
                    .ToList();

                // Agrupar por CUIT
                var listaAgrupadaPorCuit = listaAltas
                    .GroupBy(a => a.Cuit)
                    .Select(g => new
                    {
                        Cuit = g.Key,
                        Terminales = g.ToList(),
                        RazonSocial = g.FirstOrDefault()?.RazonSocial ?? "Sin Razón Social"
                    })
                    .ToList();

                using (var workbook = new XLWorkbook())
                {
                    var worksheetFacturacionDiaria = workbook.Worksheets.Add("FACTURACIÓN DIARIA");

                    int currentRow = 1;

                    // Títulos principales
                    worksheetFacturacionDiaria.Cell(currentRow, 1).Value = "ESTADO";
                    worksheetFacturacionDiaria.Cell(currentRow, 2).Value = "N° TERMINAL";
                    worksheetFacturacionDiaria.Cell(currentRow, 3).Value = "NOMBRE FANTASIA";
                    worksheetFacturacionDiaria.Cell(currentRow, 4).Value = "PROVINCIA";
                    worksheetFacturacionDiaria.Cell(currentRow, 5).Value = "FECHA DE ALTA";
                    worksheetFacturacionDiaria.Cell(currentRow, 6).Value = "FECHA DE BAJA";
                    worksheetFacturacionDiaria.Cell(currentRow, 7).Value = "TIPO ALTA";
                    worksheetFacturacionDiaria.Cell(currentRow, 8).Value = "TIPO BAJA";
                    worksheetFacturacionDiaria.Cell(currentRow, 9).Value = "GESTOR";
                    worksheetFacturacionDiaria.Cell(currentRow, 10).Value = "CUIT/CUIL";
                    worksheetFacturacionDiaria.Cell(currentRow, 11).Value = "TIEMPO INACTIVA";

                    // Añadir los días del mes a la cabecera
                    int columnaDia = 12;
                    for (int dia = 1; dia <= diasDelMes; dia++)
                    {
                        worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = dia.ToString("00") + " " + fecha.ToString("MMMM yyyy", new System.Globalization.CultureInfo("es-ES")).ToUpper();
                        columnaDia++;
                    }

                    currentRow++;

                    // Rellenar la hoja con los datos agrupados por CUIT
                    foreach (var grupo in listaAgrupadaPorCuit)
                    {
                        decimal[] totalFacturacionPorDia = new decimal[diasDelMes]; // Para sumar la facturación de cada día

                        // Añadir los datos de cada terminal
                        foreach (var terminal in grupo.Terminales)
                        {
                            worksheetFacturacionDiaria.Cell(currentRow, 1).Value = terminal.Estado;
                            worksheetFacturacionDiaria.Cell(currentRow, 2).Value = terminal.NDeTerminal;
                            worksheetFacturacionDiaria.Cell(currentRow, 3).Value = terminal.NombreDeFantasia;
                            worksheetFacturacionDiaria.Cell(currentRow, 4).Value = terminal.Provincia ?? "Sin provincia";
                            worksheetFacturacionDiaria.Cell(currentRow, 5).Value = terminal.FechaDeAlta?.ToString("dd/MM/yyyy");
                            worksheetFacturacionDiaria.Cell(currentRow, 6).Value = terminal.FechaDeBaja?.ToString("dd/MM/yyyy");
                            worksheetFacturacionDiaria.Cell(currentRow, 7).Value = terminal.TipoAlta ?? "";
                            worksheetFacturacionDiaria.Cell(currentRow, 8).Value = terminal.TipoBaja ?? "";
                            worksheetFacturacionDiaria.Cell(currentRow, 9).Value = terminal.Gestor ?? "Sin gestor";
                            worksheetFacturacionDiaria.Cell(currentRow, 10).Style.NumberFormat.Format = "@";
                            worksheetFacturacionDiaria.Cell(currentRow, 10).Value = terminal.Cuit.HasValue ? terminal.Cuit.Value.ToString("F0") : "";

                            // Obtener los datos de facturación diaria
                            var datosDia = terminal.Cuit.HasValue && terminal.NDeTerminal.HasValue
                                ? await _baseService.DatosCuitPorFechaDiaria(terminal.Cuit.ToString(), terminal.NDeTerminal.ToString(), fechaInicioMes)
                                : new List<KeyValuePair<string, decimal>>();

                            // Agregar la facturación por día
                            int diasSinFacturar = 0; // Contador de días consecutivos sin facturación
                            int maxDiasSinFacturar = 0; // Máximo número de días consecutivos sin facturación
                            bool esUltimoDiaSinFacturar = false; // Indicar si el último día fue sin facturación
                            int diasSinFacturarTotal = 0; // Contador de días sin facturación total desde el primer día sin facturación

                            columnaDia = 12;
                            for (int i = 1; i <= diasDelMes; i++)
                            {
                                var diaClave = new DateTime(fecha.Year, fecha.Month, i).ToString("dd/MM/yyyy");
                                var totalBruto = datosDia.FirstOrDefault(d => d.Key == diaClave);
                                decimal facturacionDia = totalBruto.Equals(default(KeyValuePair<string, decimal>)) ? 0 : totalBruto.Value;
                                worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = facturacionDia;
                                totalFacturacionPorDia[i - 1] += facturacionDia; // Sumar facturación al total por día

                                // Verificar si el día no tiene facturación
                                if (facturacionDia == 0)
                                {
                                    diasSinFacturar++;
                                    diasSinFacturarTotal++;
                                    esUltimoDiaSinFacturar = true;
                                }
                                else
                                {
                                    if (esUltimoDiaSinFacturar)
                                    {
                                        // Actualizar el máximo de días sin facturación
                                        if (diasSinFacturar > maxDiasSinFacturar)
                                        {
                                            maxDiasSinFacturar = diasSinFacturar;
                                        }
                                        diasSinFacturar = 0; // Reiniciar contador
                                        esUltimoDiaSinFacturar = false;
                                    }
                                    diasSinFacturarTotal = 0; // Reiniciar si hubo facturación
                                }

                                columnaDia++;
                            }

                            // Comprobar si el último día también fue sin facturación
                            if (esUltimoDiaSinFacturar && diasSinFacturar > maxDiasSinFacturar)
                            {
                                maxDiasSinFacturar = diasSinFacturar;
                            }

                            // Mostrar solo si los últimos 3 días consecutivos no tienen facturación
                            if (maxDiasSinFacturar >= 3)
                            {
                                // Si maxDiasSinFacturar es 0, mostrar "Activo", si no, mostrar el número de días.
                                worksheetFacturacionDiaria.Cell(currentRow, 11).Value = diasSinFacturarTotal > 0 ? $"No factura hace {diasSinFacturarTotal} días" : "Activo";
                            }
                            else
                            {
                                worksheetFacturacionDiaria.Cell(currentRow, 11).Value = "Activo";
                            }

                            currentRow++;
                        }

                        // Fila con Razón Social y sumatoria de la facturación por terminales
                        worksheetFacturacionDiaria.Cell(currentRow, 1).Value = "TOTAL";
                        worksheetFacturacionDiaria.Cell(currentRow, 2).Value = "Todas";
                        worksheetFacturacionDiaria.Cell(currentRow, 3).Value = grupo.RazonSocial;
                        worksheetFacturacionDiaria.Cell(currentRow, 10).Value = grupo.Cuit?.ToString("F0");

                        // Mostrar la sumatoria de la facturación por día
                        columnaDia = 12;
                        for (int i = 0; i < totalFacturacionPorDia.Length; i++)
                        {
                            worksheetFacturacionDiaria.Cell(currentRow, columnaDia).Value = totalFacturacionPorDia[i];
                            columnaDia++;
                        }

                        currentRow++;
                    }

                    worksheetFacturacionDiaria.Columns().AdjustToContents();

                    // Guardar y devolver el archivo Excel
                    using (var stream = new MemoryStream())
                    {
                        workbook.SaveAs(stream);
                        var content = stream.ToArray();

                        return File(
                            content,
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                            "facturacion_diaria.xlsx"
                        );
                    }
                }
            }

            return BadRequest();
        }

        [HttpPost("excelreporte")]
        public async Task<ActionResult> ExcelReporte([FromBody] VMExcel request)
        {
            bool esTokenValido = await _tokenservice.ValidarTokenAsync(request.Token);

            if (!esTokenValido)
            {
                return Unauthorized("El token o el ID de la sesión no son válidos");
            }

            var datos = await _baseService.BuscarCuponesFechaInicioFIn(request.FechaInicio, request.FechaFin);

            using (var workbook = new XLWorkbook()) // Crea el archivo Excel
            {
                var worksheet = workbook.Worksheets.Add("Reporte"); // Agrega una hoja llamada "Reporte"

                // =========================
                // ASIGNACIÓN DE HEADERS (FILA 1)
                // =========================
                string[] headers = new string[]
                {
            "Fecha Operación", "Fecha de Presentación", "Fecha de Pago", "Nro# de Cupon", "Nro# de Comercio",
            "Nro# de Tarjeta", "Moneda", "Total Bruto", "Total Descuento", "Total Neto", "Entidad Pagadora",
            "Cuenta Bancaria", "Nro# Liquidación", "Nro# de Lote", "Tipo de Liquidacion", "Estado", "Cuotas",
            "Nro# de Autorizacion", "Tarjeta", "Tipo de Operacion", "Comercio Participante", "Promoción Plan",
            "Tarjeta-Tipo", "Costo Financiero", "Costo Financiero en $", "Tipo de Financiacion",
            "Costo por anticipo", "% Comision con IVA", "Arancel", "IVA 21%", "IMPUESTO DEBITO/CREDITO", "CUIT",
            "Condicion Fiscal", "Provincia", "Retencion Provincial", "Retencion Ganacia", "Retencion IVA",
            "Total Con descuentos", "CBU/CVU", "Banco", "Tipo de cuenta", "Nro de cuenta", "Alias", "Nombre Comercio",
            "Retencion Municipal", "RETENCION", "Retencion impositiva", "Asesor ABM", "Rubro",
            "Fecha Alta comercio", "Provincia ABM", "Razon Social", "Legajo", "Codigo Postal"
                };

                for (int i = 0; i < headers.Length; i++)
                {
                    worksheet.Cell(1, i + 1).Value = headers[i]; // Escribe los encabezados en la fila 1
                }

                // =========================
                // RECORRER DATOS Y LLENAR FILAS
                // =========================
                int currentRow = 2; // Comenzamos en la fila 2 (fila 1 es para headers)

                foreach (var item in datos)
                {
                    worksheet.Cell(currentRow, 1).Value = item.FechaOperacion;
                    worksheet.Cell(currentRow, 2).Value = item.FechaDePresentacion;
                    worksheet.Cell(currentRow, 3).Value = item.FechaDePago;
                    worksheet.Cell(currentRow, 4).Value = item.NroDeCupon;
                    worksheet.Cell(currentRow, 5).Value = item.NroDeComercio;
                    worksheet.Cell(currentRow, 6).Value = item.NroDeTarjeta;
                    worksheet.Cell(currentRow, 7).Value = item.Moneda;
                    worksheet.Cell(currentRow, 8).Value = item.TotalBruto;

                    // =========================
                    // FORMATEO DE "Total Descuento"
                    // =========================
                    if (item.TotalDescuento == null || item.TotalDescuento.ToString() == "NULL")
                    {
                        worksheet.Cell(currentRow, 9).Value = ""; // Si es NULL, dejar vacío
                    }
                    else
                    {
                        string totalDescuentoStr = item.TotalDescuento.ToString();

                        if (decimal.TryParse(totalDescuentoStr, out decimal totalDescuento))
                        {
                            if (totalDescuento == 0)
                            {
                                worksheet.Cell(currentRow, 9).Value = 0; // Si es 0, mostrar 0
                            }
                            else
                            {
                                // Convertir a decimal con la lógica deseada
                                string totalDescuentoFormatted = ConvertToDecimalFormat(totalDescuento);
                                worksheet.Cell(currentRow, 9).Value = totalDescuentoFormatted;
                            }
                        }
                        else
                        {
                            worksheet.Cell(currentRow, 9).Value = "Error"; // Si el dato no es válido
                        }
                    }

                    worksheet.Cell(currentRow, 10).Value = item.TotalNeto;
                    worksheet.Cell(currentRow, 11).Value = item.EntidadPagadora;
                    worksheet.Cell(currentRow, 12).Value = item.CuentaBancaria;
                    worksheet.Cell(currentRow, 13).Value = item.NroLiquidacion;
                    worksheet.Cell(currentRow, 14).Value = item.NroDeLote;
                    worksheet.Cell(currentRow, 15).Value = item.TipoDeLiquidacion;
                    worksheet.Cell(currentRow, 16).Value = item.Estado;
                    worksheet.Cell(currentRow, 17).Value = item.Cuotas;
                    worksheet.Cell(currentRow, 18).Value = item.NroDeAutorizacion;
                    worksheet.Cell(currentRow, 19).Value = item.Tarjeta;
                    worksheet.Cell(currentRow, 20).Value = item.TipoDeOperacion;
                    worksheet.Cell(currentRow, 21).Value = item.ComercioParticipante;
                    worksheet.Cell(currentRow, 22).Value = item.PromocionPlan;
                    worksheet.Cell(currentRow, 23).Value = item.TarjetaTipo;
                    worksheet.Cell(currentRow, 24).Value = item.CostoFinanciero;
                    worksheet.Cell(currentRow, 25).Value = item.CostoFinancieroEn;
                    worksheet.Cell(currentRow, 26).Value = item.TipoDeFinanciacion;
                    worksheet.Cell(currentRow, 27).Value = item.CostoPorAnticipo;
                    worksheet.Cell(currentRow, 28).Value = item.ComisionConIva;
                    worksheet.Cell(currentRow, 29).Value = item.Arancel;
                    worksheet.Cell(currentRow, 30).Value = item.Iva21;
                    worksheet.Cell(currentRow, 31).Value = item.ImpuestoDebitoCredito;
                    worksheet.Cell(currentRow, 32).Value = item.Cuit;
                    worksheet.Cell(currentRow, 33).Value = item.CondicionFiscal;
                    worksheet.Cell(currentRow, 34).Value = item.Provincia;
                    worksheet.Cell(currentRow, 35).Value = item.RetencionProvincial;
                    worksheet.Cell(currentRow, 36).Value = item.RetencionGanacia;
                    worksheet.Cell(currentRow, 37).Value = item.RetencionIva;
                    worksheet.Cell(currentRow, 38).Value = item.TotalConDescuentos;
                    worksheet.Cell(currentRow, 39).Value = item.CbuCvu;
                    worksheet.Cell(currentRow, 40).Value = item.Banco;
                    worksheet.Cell(currentRow, 41).Value = item.TipoDeCuenta;
                    worksheet.Cell(currentRow, 42).Value = item.NroDeCuenta;
                    worksheet.Cell(currentRow, 43).Value = item.Alias;
                    worksheet.Cell(currentRow, 44).Value = item.NombreComercio;
                    worksheet.Cell(currentRow, 45).Value = item.RetencionMunicipal;
                    worksheet.Cell(currentRow, 46).Value = item.Retencion;
                    worksheet.Cell(currentRow, 47).Value = item.RetencionImpositiva;
                    worksheet.Cell(currentRow, 48).Value = item.AsesorAbm;
                    worksheet.Cell(currentRow, 49).Value = item.Rubro;
                    worksheet.Cell(currentRow, 50).Value = item.FechaAltaComercio;
                    worksheet.Cell(currentRow, 51).Value = item.ProvinciaAbm;
                    worksheet.Cell(currentRow, 52).Value = item.RazonSocial;
                    worksheet.Cell(currentRow, 53).Value = item.Legajo;
                    worksheet.Cell(currentRow, 54).Value = item.CodigoPostal;

                    currentRow++; // Avanza a la siguiente fila
                }

                // =========================
                // GUARDAR Y DEVOLVER EL ARCHIVO
                // =========================
                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();

                    return File(
                        content,
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        "Reporte.xlsx"
                    );
                }
            }
        }

        // =========================
        // MÉTODO PARA FORMATEAR NÚMEROS
        // =========================
        private string ConvertToDecimalFormat(decimal number)
        {
            string numberStr = number.ToString("F0"); // Convertir a string sin decimales
            if (numberStr.Length < 2) return numberStr; // Si el número tiene solo 1 dígito, no hay cambios

            string integerPart = numberStr.Substring(0, 1); // Tomar el primer dígito como parte entera
            string decimalPart = numberStr.Substring(1); // El resto como decimales

            return $"{integerPart},{decimalPart}";
        }





        public class RegistroCRM
        {
            public string Estado { get; set; }
            public double? NDeTerminal { get; set; }
            public string NombreDeFantasia { get; set; }
            public string Provincia { get; set; }
            public DateTime? FechaDeAlta { get; set; }  // Nueva propiedad para la Fecha de Alta
            public DateTime? FechaDeBaja { get; set; }  // Nueva propiedad para la Fecha de Baja
            public string TipoAlta { get; set; }  // Nueva propiedad para el Tipo de Alta
            public string TipoBaja { get; set; }  // Nueva propiedad para el Tipo de Baja
            public string Gestor { get; set; }
            public string? RazonSocial { get; set; }

            public double? Cuit { get; set; }
            public string TipoTransaccion { get; set; }  // Mantener la transacción (ALTA o BAJA)
        }




        //[HttpPost("excelcrmmensual")]
        //public async Task<IActionResult> excelcrmmensual(VMToken token)
        //{
        //    bool esTokenValido = await _tokenService.ValidarTokenAsync(token.Token);
        //    if (esTokenValido)
        //    {
        //        DateTime fecha;

        //        if (string.IsNullOrEmpty(token.Fecha))
        //        {
        //            fecha = DateTime.Now; // Si no se proporciona fecha, usar la actual
        //        }
        //        else
        //        {
        //            try
        //            {
        //                fecha = DateTime.ParseExact(token.Fecha, "dd/MM/yyyy", System.Globalization.CultureInfo.InvariantCulture);
        //            }
        //            catch (FormatException)
        //            {
        //                fecha = DateTime.Now; // Si la conversión falla, usar la fecha actual
        //            }
        //        }

        //        // Obtener la lista de CRM
        //        var alta = await _altaservice.ObtenerCRM();

        //        // Filtrar los elementos que no tienen fecha de baja
        //        var listaSinFechaDeBaja = alta.Where(a => a.FechaDeBaja == null).ToList();

        //        // Aquí puedes devolver la lista o procesarla según sea necesario
        //        return Ok(listaSinFechaDeBaja);
        //    }

        //    return BadRequest();
        //}




    }


}