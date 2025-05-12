using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Legajo
    {
        public Legajo()
        {
            NroComercios = new HashSet<NroComercio>();
        }

        public int Id { get; set; }
        public int? NroLegajo { get; set; }
        public double? Terminal { get; set; }
        public string? NombreDeFantasia { get; set; }
        public string? Provincia { get; set; }
        public DateTime? FechaDeCarga { get; set; }
        public string? Asesor { get; set; }
        public int? Iduser { get; set; }

        public virtual Usuario? IduserNavigation { get; set; }
        public virtual ICollection<NroComercio> NroComercios { get; set; }
    }
}
