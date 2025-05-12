using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class BaseCuota
    {
        public double? Cuit { get; set; }
        public int? AñoPago { get; set; }
        public int? MesPago { get; set; }
        public int? SemanaMesPago { get; set; }
        public string? CodigoPosnet { get; set; }
        public string? NombreComercio { get; set; }
        public decimal? TotalBruto { get; set; }
        public double? Cuotas { get; set; }
    }
}
