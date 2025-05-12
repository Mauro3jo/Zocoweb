using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class PanelCalidadInterno
    {
        public int Id { get; set; }
        public string? Actividad { get; set; }
        public string? Estado { get; set; }
        public string? EstadoAuditoria { get; set; }
        public int? GestorId { get; set; }
        public string? Observaciones { get; set; }
        public DateTime? FechaCarga { get; set; }
        public int? IdUser { get; set; }
        public string? Aliado { get; set; }
        public string? InteresAyudar { get; set; }
        public string? Explicacion { get; set; }
        public string? ContenemosAliado { get; set; }
        public string? InformacionIncorrecta { get; set; }
        public string? Errores { get; set; }
        public string? Plazos { get; set; }
        public string? Facturacion { get; set; }
        public string? OptimisamosTiempos { get; set; }
        public string? Motivo { get; set; }
        public DateTime? Fecha { get; set; }
        [JsonIgnore]

        public virtual Usuario? Gestor { get; set; }
        [JsonIgnore]

        public virtual Usuario? IdUserNavigation { get; set; }
    }
}
