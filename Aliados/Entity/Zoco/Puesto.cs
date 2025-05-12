using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Puesto
    {
        public Puesto()
        {
            Cuestionarios = new HashSet<Cuestionario>();
            PostulantePuestos = new HashSet<PostulantePuesto>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string? Requisitos { get; set; }
        public string? PrincipalesTareas { get; set; }
        public string? Ofrecemos { get; set; }
        public byte[]? Foto { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public bool? EstaActivo { get; set; }
        public string? Provincia { get; set; }
        public string? Localidad { get; set; }
        public string? Duracion { get; set; }
        public string? Jornada { get; set; }
        public string? Modalidad { get; set; }
        [JsonIgnore]
        public virtual ICollection<Cuestionario> Cuestionarios { get; set; }
        [JsonIgnore]

        public virtual ICollection<PostulantePuesto> PostulantePuestos { get; set; }
    }
}
