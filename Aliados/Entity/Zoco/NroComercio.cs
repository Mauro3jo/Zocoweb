using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class NroComercio
    {
        public int Id { get; set; }
        public double? NroComercio1 { get; set; }
        public string? NomRubro { get; set; }
        public string? Categoria { get; set; }
        public int? Cuotas { get; set; }
        public int? Legajos { get; set; }

        public virtual Legajo? LegajosNavigation { get; set; }
    }
}
