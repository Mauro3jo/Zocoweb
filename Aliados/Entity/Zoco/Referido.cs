using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Referido
    {
        public int Id { get; set; }
        public int IdZocoConect { get; set; }
        public int IdUser { get; set; }
        public DateTime FechaAlta { get; set; }
        public DateTime? FechaBaja { get; set; }
        public byte[]? Comprobante { get; set; }
        public DateTime? FechaCierre { get; set; }
        public double? MontoComision { get; set; }
        public bool? SePagon { get; set; }
        public DateTime? FechaPago { get; set; }

        public string? NroTerminal { get; set; }

        public virtual Usuario IdUserNavigation { get; set; } = null!;
        public virtual ZocoConect IdZocoConectNavigation { get; set; } = null!;
    }
}
