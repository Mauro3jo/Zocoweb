using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class RespuestasUsuario
    {
        public int Id { get; set; }
        public int IdPostulante { get; set; }
        public int IdPregunta { get; set; }
        public int IdRespuesta { get; set; }
        public byte[]? ArchivoRespuesta { get; set; }
        public DateTime FechaRespuesta { get; set; }

        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
        public virtual Pregunta IdPreguntaNavigation { get; set; } = null!;
        public virtual Respuesta IdRespuestaNavigation { get; set; } = null!;
    }
}
