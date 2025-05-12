using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Busqueda
    {
        public Busqueda()
        {
            ContratadosNavigation = new HashSet<Contratado>();
        }

        public int Id { get; set; }
        public string? Nombre { get; set; }
        public DateTime? FechaPuesto { get; set; }
        public string? Provincia { get; set; }
        public string? Cantidad { get; set; }
        public DateTime? FechaCierre { get; set; }
        public string? Estado { get; set; }
        public string? CantidadDeSolicitantes { get; set; }
        public string? Seleccionados { get; set; }
        public string? Finalistas { get; set; }
        public string? Contratados { get; set; }
        public string? Rechazados { get; set; }
        public string? Observaciones { get; set; }
        public string? Puesto { get; set; }

        public virtual ICollection<Contratado> ContratadosNavigation { get; set; }
    }
}
