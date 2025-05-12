using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class CheckAsesore
    {
        public int Id { get; set; }
        public int IdUser { get; set; }
        public string? Latitud { get; set; }
        public string? Longitud { get; set; }
        public string? FechaHora { get; set; }
        public string? Tipo { get; set; }
        [JsonIgnore]

        public virtual Usuario IdUserNavigation { get; set; } = null!;
    }
}
