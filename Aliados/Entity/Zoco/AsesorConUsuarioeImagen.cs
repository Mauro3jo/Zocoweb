using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.Zoco
{
    public class AsesorConUsuarioeImagen
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Usuario { get; set; }
        public string? Latitud { get; set; }
        public string? Longitud { get; set; }
        public DateTime? FechaHora { get; set; }
        public string? Tipo { get; set; }
        public string? ImagenBase64 { get; set; } 
        public string? AudioBase64 { get; set; } 
        public string? Local { get; set; }
        public string? Observacion { get; set; }
        public string? CantidadRollos { get; set; }

        public bool? Calificacion { get; set; }
        public string? ObservacionAdmin { get; set; }
        public string? ImagenTerminal { get; set; }
    }
}
