using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Reunione
    {
        public int IdReunion { get; set; }
        public int? IdProspecto { get; set; }
        public int? IdAsesor { get; set; }
        public DateTime? Fecha { get; set; }
        public TimeSpan? Hora { get; set; }
        public string? Comentarios { get; set; }
        public string? Estado { get; set; }
    }
}
