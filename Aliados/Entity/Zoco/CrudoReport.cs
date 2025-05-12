using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class CrudoReport
    {
        public DateTime? FechaOperacion { get; set; }
        public DateTime? FechaDePresentacion { get; set; }
        public DateTime? FechaDePago { get; set; }
        public int? NroDeCupon { get; set; }
        public int? NroDeComercio { get; set; }
        public int? NroDeTarjeta { get; set; }
        public string? Moneda { get; set; }
        public decimal? TotalBruto { get; set; }
        public decimal? TotalDescuento { get; set; }
        public decimal? TotalNeto { get; set; }
        public string? EntidadPagadora { get; set; }
        public string? CuentaBancaria { get; set; }
        public int? NroLiquidacion { get; set; }
        public int? NroDeLote { get; set; }
        public string? TipoDeLiquidacion { get; set; }
        public string? Estado { get; set; }
        public int? Cuotas { get; set; }
        public int? NroDeAutorizacion { get; set; }
        public string? Tarjeta { get; set; }
        public string? TipoDeOperacion { get; set; }
        public string? ComercioParticipante { get; set; }
        public string? PromocionPlan { get; set; }
    }
}
