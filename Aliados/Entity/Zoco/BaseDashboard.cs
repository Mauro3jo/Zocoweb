using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class BaseDashboard
    {
        public DateTime? FechaOperacion { get; set; }
        public string? FechaDePresentacion { get; set; }
        public DateTime? FechaDePago { get; set; }
        public string? NroDeCupon { get; set; }
        public double? NroDeComercio { get; set; }
        public double? NroDeTarjeta { get; set; }
        public string? Moneda { get; set; }
        public decimal? TotalBruto { get; set; }
        public decimal? TotalDescuento { get; set; }
        public decimal? TotalNeto { get; set; }
        public string? EntidadPagadora { get; set; }
        public string? CuentaBancaria { get; set; }
        public string? NroLiquidacion { get; set; }
        public string? NroDeLote { get; set; }
        public string? TipoDeLiquidacion { get; set; }
        public string? Estado { get; set; }
        public double? Cuotas { get; set; }
        public double? NroDeAutorizacion { get; set; }
        public string? Tarjeta { get; set; }
        public string? TipoDeOperacion { get; set; }
        public string? ComercioParticipante { get; set; }
        public string? PromocionPlan { get; set; }
        public string? TarjetaTipo { get; set; }
        public double? CostoFinanciero { get; set; }
        public decimal? CostoFinancieroEn { get; set; }
        public string? TipoDeFinanciacion { get; set; }
        public decimal? CostoPorAnticipo { get; set; }
        public double? ComisionConIva { get; set; }
        public decimal? Arancel { get; set; }
        public decimal? Iva21 { get; set; }
        public decimal? ImpuestoDebitoCredito { get; set; }
        public double? Cuit { get; set; }
        public string? CondicionFiscal { get; set; }
        public string? Provincia { get; set; }
        public decimal? RetencionProvincial { get; set; }
        public decimal? RetencionGanacia { get; set; }
        public decimal? RetencionIva { get; set; }
        public decimal? TotalConDescuentos { get; set; }
        public string? CbuCvu { get; set; }
        public string? Banco { get; set; }
        public string? TipoDeCuenta { get; set; }
        public string? NroDeCuenta { get; set; }
        public string? Alias { get; set; }
        public string? NombreComercio { get; set; }
        public decimal? RetencionMunicipal { get; set; }
        public string? Retencion { get; set; }
        public decimal? RetencionImpositiva { get; set; }
        public string? AsesorAbm { get; set; }
        public string? Rubro { get; set; }
        public double? FechaAltaComercio { get; set; }
        public string? ProvinciaAbm { get; set; }
        public string? RazonSocial { get; set; }
        public double? Legajo { get; set; }
        public double? CodActividad { get; set; }
        public int? AñoOp { get; set; }
        public int? MesOp { get; set; }
        public int? AñoPago { get; set; }
        public int? MesPago { get; set; }
        public int? SemanaMesPago { get; set; }
        public int? SemanaMesOp { get; set; }
        public string? DiaSemana { get; set; }
        public string TipoDeCredito { get; set; } = null!;
        public string? TipoFinanciacion { get; set; }
        public double? CodigoPostal { get; set; }
        public DateTime? FechaOp { get; set; }
        public decimal? ArancelFiserv { get; set; }
        public string? PagoReal { get; set; }
        public int? DiasHabiles { get; set; }
        public decimal? FormulaAnticipo { get; set; }
        public string? TasaPreferencial { get; set; }
        public DateTime? FechaTasaPreferencial { get; set; }
        public DateTime? FechaInicio { get; set; }
        public double? Ganancia { get; set; }
        public DateTime? Fecha { get; set; }
        public string? DebitoCredito { get; set; }
        public double? CodActividadRentas { get; set; }
        public string? Anticipo { get; set; }
        public string? Bonificacion { get; set; }
        public DateTime? Fecha2 { get; set; }
    }
}
