using System.ComponentModel.DataAnnotations;

namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMReporteMensual
    {
        public string? NroDeComercio { get; set; }
        public string? NombreComercio { get; set; }
        public string? FechaDePago { get; set; }
        public string? TotalBruto { get; set; }
        public string? TotalDebito { get; set; }
        public string? _1Pago { get; set; }
        public string? CreditoCuotas { get; set; }
        public string? TotalNeto { get; set; }
        public string? TotalCostoFinanciero { get; set; }
        public string? CostoPorAnticipoTotal { get; set; }
        public string? Arancel { get; set; }
        public string? ImpuestoAlDebitoYCredito { get; set; }
        public string? RetencionProvincial { get; set; }
        public string? RetencionGanancia { get; set; }
        public string? RetencionIva { get; set; }
        public string? RetencionMunicipal { get; set; }
        public string? RetencionImpositiva { get; set; }
        public string? CbuCvu { get; set; }
        public string? Banco { get; set; }
        public string? TipoDeCuenta { get; set; }
        public string? NroDeCuenta { get; set; }
        public string? Alias { get; set; }
        public string? Retencion { get; set; }
        public string? AsesorAbm { get; set; }
        public string? Rubro { get; set; }
        public string? FechaAltaComercio { get; set; }
        public string? ProvinciaAbm { get; set; }
        public string? RazonSocial { get; set; }
        public string? Legajo { get; set; }
        public string? CodActividad { get; set; }
        public int? AñoPago { get; set; }
        public int? MesPago { get; set; }
        public int Id { get; set; }
    }
}
