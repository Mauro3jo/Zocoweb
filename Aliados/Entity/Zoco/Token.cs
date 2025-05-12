using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Token
    {
        public int TokenId { get; set; }
        public int? UsuarioId { get; set; }
        public string? Token1 { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaExpiracion { get; set; }
        [JsonIgnore]

        public virtual Usuario? Usuario { get; set; }
    }
}
