using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Comentario
    {
        public Comentario()
        {
            InverseIdComentarioPadreNavigation = new HashSet<Comentario>();
        }

        public int Id { get; set; }
        public int? IdUsuario { get; set; }
        public string? Comentario1 { get; set; }
        public int? IdComentarioPadre { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public int? IdUsuarioRespuesta { get; set; }
        public byte[]? Imagen { get; set; }

        public virtual Comentario? IdComentarioPadreNavigation { get; set; }
        public virtual Usuario? IdUsuarioNavigation { get; set; }
        public virtual Usuario? IdUsuarioRespuestaNavigation { get; set; }
        public virtual ICollection<Comentario> InverseIdComentarioPadreNavigation { get; set; }
    }
}
