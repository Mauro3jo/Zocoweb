using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Iibb
    {
        public int IibbId { get; set; }
        public int UsuarioId { get; set; }
        public string? NombreDocumento { get; set; }
        public string? Cuit { get; set; }
        public DateTime? FechaSubida { get; set; }
        public byte[]? DocumentoPdf { get; set; }

        public virtual Usuario Usuario { get; set; } = null!;
    }
}
