using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Pregunta
    {
        public Pregunta()
        {
            Respuesta = new HashSet<Respuesta>();
            RespuestasUsuarios = new HashSet<RespuestasUsuario>();
        }

        public int Id { get; set; }
        public string? TextoPregunta { get; set; }
        public string? TipoRespuesta { get; set; }
        public decimal? TiempoRespuesta { get; set; }
        public int IdCuestionario { get; set; }

        [JsonIgnore]
        public virtual Cuestionario IdCuestionarioNavigation { get; set; } = null!;
        [JsonIgnore]

        public virtual ICollection<Respuesta> Respuesta { get; set; }
        [JsonIgnore]

        public virtual ICollection<RespuestasUsuario> RespuestasUsuarios { get; set; }
    }
}

