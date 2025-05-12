using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Inflacion
    {
        public int Id { get; set; }
        public double? Inflacion1 { get; set; }
        public string? Rubro { get; set; }
        public DateTime? Fecha { get; set; }
    }
}
