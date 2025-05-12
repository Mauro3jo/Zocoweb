using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class CompMensual
    {
        public double? Cuit { get; set; }
        public int? AñoPago { get; set; }
        public string? NombreComercio { get; set; }
        public string? Mes { get; set; }
        public decimal? TotalBruto { get; set; }
        public string? Dia { get; set; }
    }
}
