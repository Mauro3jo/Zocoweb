using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class TokenPostulante
    {
        public int PostulanteId { get; set; }
        public string? Token { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaExpiracion { get; set; }
        public int TokenId { get; set; }

        public virtual Postulante Postulante { get; set; } = null!;
    }
}
