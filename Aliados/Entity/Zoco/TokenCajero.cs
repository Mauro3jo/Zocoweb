using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class TokenCajero
    {
        public int TokenId { get; set; }
        public int? UsuariocajeroId { get; set; }
        public string? Token { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public DateTime? FechaExpiracion { get; set; }

        public virtual UsuarioCajero? Usuariocajero { get; set; }
    }
}
