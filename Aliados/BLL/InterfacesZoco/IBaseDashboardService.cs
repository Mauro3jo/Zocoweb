using Entity.Zoco;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BLL.InterfacesZoco
{
    public interface IBaseDashboardService
    {
        Task<List<BaseDashboard>> DatosInicioAliados(string CuitAliado);
        Task<List<KeyValuePair<string, decimal>>> DatosCuitPorFecha(string CuitAliado, string NumeroTerminal, DateTime Fecha);
        Task<List<KeyValuePair<string, decimal>>> DatosCuitPorFechaDiaria(string CuitAliado, string NumeroTerminal, DateTime Fecha);

        Task<List<BaseDashboard>> Lista(DateTime? fecha);
        Task<List<BaseDashboard>> Listahoy(DateTime? fecha);

        Task<bool> ExistenDatosInicioAliados(string CuitAliado);
        Task<BaseDashboard> DatoProvincia(string CuitAliado);
        Task<DateTime?> ObtenerUltimaFechaPorMesYAnio(DateTime fecha);

        Task<(decimal totalBrutoDebito, decimal totalBrutoCredito, decimal totalBruto1Pago, int totalCantidadOperaciones)>
            ObtenerResumenBrutoYOperacionesPorTipoYProvincia(DateTime fecha, string provincia);

        Task<(decimal totalBruto, int totalDebito, int totalCredito, int total1Pago, int totalCantidadOperaciones)>
            ObtenerFacturacionPorTerminal(string CuitAliado, string NumeroTerminal, DateTime Fecha);

        Task<object> ObtenerDatosComparativos(DateTime fechaToken, string provincia);
        Task<List<BaseDashboard>> ObtenerFacturacionPorTerminalRango(string CuitAliado, string NumeroTerminal, DateTime fechaInicio, DateTime fechaFin);

        Task<List<(string Fecha, decimal TotalBruto, decimal TotalBrutoDebito, int CantidadDebito, decimal TotalBrutoCredito, int CantidadCredito, decimal TotalBruto1Pago, int Cantidad1Pago)>>
            DatosCuitPorFechaOperacionDiaria(string CuitAliado, string NumeroTerminal, DateTime Fecha);

        Task<decimal> ObtenerDatoNumericoPorCuitYFechas(string Cuit, DateTime FechaAlta, DateTime FechaBaja);
        Task<decimal> ObtenerDatoNumericoPorCuitYFechasNroTerminal(string Cuit, DateTime FechaAlta, DateTime FechaBaja, string NroTerminal);

        // Nuevo método agregado para obtener datos comparativos por provincia
        Task<object> ObtenerDatosComparativosPorProvincia(DateTime fechaToken);
        Task<List<BaseDashboard>> DatosMesActual(string CuitAliado, DateTime Fecha);
        Task<bool> Verificarultimos5dias(string cuitAliado,DateTime Fechainicial, DateTime Fechafinal, string nroterminal);


        Task<List<BaseDashboard>> BuscarCuponesPorFiltros(string? cuit, string? fecha, string? bruto, string? ultimos4digitos, string? tarjeta, string? cuotas);
        Task<List<BaseDashboard>> BuscarCuponesFechaInicioFIn(string? FechaInicio,string? FechaFin);



    }
}
