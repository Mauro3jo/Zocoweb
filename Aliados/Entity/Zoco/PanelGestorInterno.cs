using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class PanelGestorInterno
    {
        public int Id { get; set; }
        public string? CanalAtencion { get; set; }
        public string? Tipo { get; set; }
        public string? Aliado { get; set; }
        public string? Motivo { get; set; }
        public string? Estado { get; set; }
        public string? Observaciones { get; set; }
        public DateTime? FechaCarga { get; set; }
        public int? IdUser { get; set; }
        public int? IdAliado { get; set; }
        public string? NroTerminal { get; set; }
        [JsonIgnore]

        public virtual Usuario? IdAliadoNavigation { get; set; }
        [JsonIgnore]

        public virtual Usuario? IdUserNavigation { get; set; }
       
    }
}
