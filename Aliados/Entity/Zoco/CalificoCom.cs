using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class CalificoCom
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int? NumCalifico { get; set; }
        public string? Descripcion { get; set; }
        public DateTime? Fecha { get; set; }

        public virtual Usuario Usuario { get; set; } = null!;
    }
}
