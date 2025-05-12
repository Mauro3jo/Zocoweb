using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Referencia
    {
        public int Id { get; set; }
        public int IdEmpleo { get; set; }
        public string? Nombre { get; set; }
        public string? Cargo { get; set; }
        public string? Telefono { get; set; }
        public string? Mail { get; set; }

        public virtual CargosAnteriore IdEmpleoNavigation { get; set; } = null!;
    }
}
