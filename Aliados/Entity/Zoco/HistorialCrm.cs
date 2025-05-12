using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class HistorialCrm
    {
        public int Id { get; set; }
        public int? UsuarioId { get; set; }
        public DateTime? FechaSubida { get; set; }
        public string? Tipo { get; set; }
        public int? AltaId { get; set; }
        public string? Observaciones { get; set; }
        public int? BajaId { get; set; }

        public virtual Alta? Alta { get; set; }
        public virtual Baja? Baja { get; set; }
        public virtual Usuario? Usuario { get; set; }
    }
}
