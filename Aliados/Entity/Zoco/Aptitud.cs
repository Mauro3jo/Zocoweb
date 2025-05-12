using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Aptitud
    {
        public int Id { get; set; }
        public int IdPostulante { get; set; }
        public string? Aptitud1 { get; set; }
        public int? IdEducacion { get; set; }

        public virtual Educacion? IdEducacionNavigation { get; set; }
        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
    }
}
