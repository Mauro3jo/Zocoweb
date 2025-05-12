using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Prospecto
    {
        public int IdProspecto { get; set; }
        public int? IdAsesor { get; set; }
        public int? DniCuit { get; set; }
        public string? NombrePersona { get; set; }
        public string? NombreFantasia { get; set; }
        public string? Domicilio { get; set; }
        public string? Localidad { get; set; }
        public string? Provincia { get; set; }
        public int? Cp { get; set; }
        public string? Rubro { get; set; }
        public decimal? FacturacionEst { get; set; }
        public int? Sucursales { get; set; }
        public string? PosnetCover { get; set; }
        public DateTime? PrimerContactoFecha { get; set; }
        public TimeSpan? PrimerContactoHora { get; set; }
        public string? PrimerContactoOrigen { get; set; }
        public string? EstadoReunion { get; set; }
    }
}
