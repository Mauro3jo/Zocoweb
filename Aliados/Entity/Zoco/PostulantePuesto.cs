using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class PostulantePuesto
    {
        public int Id { get; set; }
        public int IdPostulante { get; set; }
        public int IdPuesto { get; set; }
        public DateTime? FechaPostulacion { get; set; }

        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
        public virtual Puesto IdPuestoNavigation { get; set; } = null!;
    }
}
