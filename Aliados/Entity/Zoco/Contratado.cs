using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Contratado
    {
        public int Id { get; set; }
        public string? Nombre { get; set; }
        public string? Edad { get; set; }
        public string? Dni { get; set; }
        public string? Direccion { get; set; }
        public string? Email { get; set; }
        public byte[]? Foto { get; set; }
        public int? BusquedaId { get; set; }
        public string? Puesto { get; set; }
        public DateTime? FechaEntrevista { get; set; }
        public DateTime? FechaDeContratacion { get; set; }
        public string? TipoDeContratacion { get; set; }
        public string? Estado { get; set; }
        public DateTime? FechaDeCierre { get; set; }
        public string? Observacion { get; set; }
        public string? Cv { get; set; }

        public virtual Busqueda? Busqueda { get; set; }
    }
}
