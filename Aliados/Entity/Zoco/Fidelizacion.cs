using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Fidelizacion
    {
        public int Id { get; set; }
        public string? Nterminal { get; set; }
        public string? Cuit { get; set; }
        public DateTime? Fecha { get; set; }
        public bool? Baja { get; set; }
        public string? Observacion { get; set; }

    }
}
