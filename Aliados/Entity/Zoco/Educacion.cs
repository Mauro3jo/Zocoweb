using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Educacion
    {
        public Educacion()
        {
            Aptituds = new HashSet<Aptitud>();
        }

        public int IdEducacion { get; set; }
        public int IdPostulante { get; set; }
        public int IntitucionEducativa { get; set; }
        public string? Titulo { get; set; }
        public string? DisciplinaAcademica { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? Descripcion { get; set; }

        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
        public virtual ICollection<Aptitud> Aptituds { get; set; }
    }
}
