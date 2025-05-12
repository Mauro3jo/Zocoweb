using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class PostulanteCuestionario
    {
        public int Id { get; set; }
        public int IdPostulante { get; set; }
        public int IdCuestionario { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public decimal? Resultado { get; set; }

        public virtual Cuestionario IdCuestionarioNavigation { get; set; } = null!;
        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
    }
}
