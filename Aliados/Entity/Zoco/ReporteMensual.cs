using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class ReporteMensual
    {
        public double? NroDeComercio { get; set; }
        public string? NombreComercio { get; set; }
        public DateTime? FechaDePago { get; set; }
        public double? TotalBruto { get; set; }
        public double? TotalDebito { get; set; }
        public double? _1Pago { get; set; }
        public double? CreditoCuotas { get; set; }
        public double? TotalNeto { get; set; }
        public double? TotalCostoFinanciero { get; set; }
        public double? CostoPorAnticipoTotal { get; set; }
        public double? Arancel { get; set; }
        public double? ImpuestoAlDebitoYCredito { get; set; }
        public double? RetencionProvincial { get; set; }
        public double? RetencionGanancia { get; set; }
        public double? RetencionIva { get; set; }
        public double? RetencionMunicipal { get; set; }
        public double? RetencionImpositiva { get; set; }
        public string? CbuCvu { get; set; }
        public string? Banco { get; set; }
        public string? TipoDeCuenta { get; set; }
        public string? NroDeCuenta { get; set; }
        public string? Alias { get; set; }
        public string? Retencion { get; set; }
        public string? AsesorAbm { get; set; }
        public string? Rubro { get; set; }
        public double? FechaAltaComercio { get; set; }
        public string? ProvinciaAbm { get; set; }
        public string? RazonSocial { get; set; }
        public double? Legajo { get; set; }
        public double? CodActividad { get; set; }
        public int? AñoPago { get; set; }
        public int? MesPago { get; set; }
        public int Id { get; set; }
        public DateTime? FechaOperacion { get; set; }
    }
}
