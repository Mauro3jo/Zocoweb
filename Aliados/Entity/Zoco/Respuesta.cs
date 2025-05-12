using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Respuesta
    {
        public Respuesta()
        {
            RespuestasUsuarios = new HashSet<RespuestasUsuario>();
        }

        public int Id { get; set; }
        public int IdPregunta { get; set; }
        public string? RespuestaTexto { get; set; }
        public bool? EsCorrecta { get; set; }

        public virtual Pregunta IdPreguntaNavigation { get; set; } = null!;
        public virtual ICollection<RespuestasUsuario> RespuestasUsuarios { get; set; }
    }
}
