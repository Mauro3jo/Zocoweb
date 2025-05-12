using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class TicketsClover
    {
        public int Id { get; set; }
        public DateTime? FechaDePago { get; set; }
        public string? MedioDePago { get; set; }
        public string? MarcaDeLaTarjeta { get; set; }
        public string? NumeroDeLaTarjeta { get; set; }
        public string? Importe { get; set; }
        public string? NombreDelCliente { get; set; }
        public string? NumeroCuotas { get; set; }
        public string? IdTerminal { get; set; }
        public string? NrLote { get; set; }
        public string? NrRecibo { get; set; }
        public string? Rersultado { get; set; }
    }
}
