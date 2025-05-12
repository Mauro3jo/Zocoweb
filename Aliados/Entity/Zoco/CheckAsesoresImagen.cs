using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class CheckAsesoresImagen
    {
        public int Id { get; set; }
        public int IdUser { get; set; }
        public string? Latitud { get; set; }
        public string? Longitud { get; set; }
        public string? FechaHora { get; set; }
        public string? Tipo { get; set; }
        public byte[]? Imagen { get; set; }
        public byte[]? AudioFile { get; set; }
        public string? Local { get; set; }
        public string? Observacion { get; set; }
        public bool? Calificacion { get; set; }
        public string? ObservacionAdmin { get; set; }
        public byte[]? ImagenTerminal { get; set; }
        public string? TiempoAudio { get; set; }
        public DateTime? FechaDevolucion { get; set; }
        public string? CantidadRollos { get; set; }

        public virtual Usuario IdUserNavigation { get; set; } = null!;
    }
}
