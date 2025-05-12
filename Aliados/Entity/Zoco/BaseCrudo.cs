using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class BaseCrudo
    {
        public DateTime? FechaOperación { get; set; }
        public string? FechaDePresentación { get; set; }
        public DateTime? FechaDePago { get; set; }
        public double? NroDeCupon { get; set; }
        public double? NroDeComercio { get; set; }
        public double? NroDeTarjeta { get; set; }
        public string? Moneda { get; set; }
        public double? TotalBruto { get; set; }
        public double? TotalDescuento { get; set; }
        public string? TotalNeto { get; set; }
        public string? EntidadPagadora { get; set; }
        public string? CuentaBancaria { get; set; }
        public string? NroLiquidación { get; set; }
        public string? NroDeLote { get; set; }
        public string? TipoDeLiquidacion { get; set; }
        public string? Estado { get; set; }
        public double? Cuotas { get; set; }
        public double? NroDeAutorizacion { get; set; }
        public string? Tarjeta { get; set; }
        public string? TipoDeOperacion { get; set; }
        public string? ComercioParticipante { get; set; }
        public string? PromociónPlan { get; set; }
    }
}
