using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class FilasCloverTicket
    {
        public int Id { get; set; }
        public int? FechaDePago { get; set; }
        public int? MedioDePago { get; set; }
        public int? MarcaDeLaTarjeta { get; set; }
        public int? NumeroDeLaTarjeta { get; set; }
        public int? Importe { get; set; }
        public int? NombreDelCliente { get; set; }
        public int? NumeroCuotas { get; set; }
        public int? IdTerminal { get; set; }
        public int? NumeroLote { get; set; }
        public int? NumeroRecibo { get; set; }
        public int? Resultado { get; set; }
    }
}
