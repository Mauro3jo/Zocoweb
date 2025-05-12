using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Cuestionario
    {
        public Cuestionario()
        {
            PostulanteCuestionarios = new HashSet<PostulanteCuestionario>();
            Pregunta = new HashSet<Pregunta>();
        }

        public int Id { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int IdPuesto { get; set; }
        public string? Nombre { get; set; }
        public int? MaxPreguntas { get; set; }
        public string? NotaAprobacion { get; set; }
        [JsonIgnore]

        public virtual Puesto IdPuestoNavigation { get; set; } = null!;
        [JsonIgnore]

        public virtual ICollection<PostulanteCuestionario> PostulanteCuestionarios { get; set; }
        [JsonIgnore]

        public virtual ICollection<Pregunta> Pregunta { get; set; }
    }
}
