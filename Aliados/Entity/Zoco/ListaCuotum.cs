using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class ListaCuotum
    {
        public int Id { get; set; }
        public string? Cuota { get; set; }
        public string? CodigoPosnet { get; set; }
        public string? CostoVisaCredito { get; set; }
        public string? CostoAmericanExpressCredito { get; set; }
        public string? CostoMastercardCredito { get; set; }
        public string? CostoArgencardCredito { get; set; }
        public string? CostoCabalCredito { get; set; }
        public string? CostoNaranjaCredito { get; set; }
        public string? Comision { get; set; }
        public string? Iva { get; set; }
        public string? ComisionMasIva { get; set; }
    }
}
