using System;
using System.Collections.Generic;
using Entity.Zoco;

namespace Entity.Zoco
{
    public partial class CargosAnteriore
    {
        public CargosAnteriore()
        {
            Referencia = new HashSet<Referencia>();
        }

        public int Id { get; set; }
        public string? TipoEmpleo { get; set; }
        public string? Empresa { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? Ubicacion { get; set; }
        public string? Descripcion { get; set; }
        public int IdPostulante { get; set; }

        public virtual Postulante IdPostulanteNavigation { get; set; } = null!;
        public virtual ICollection<Referencia> Referencia { get; set; }
    }
}
