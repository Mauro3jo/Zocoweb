using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class UsuarioCajero
    {
        public UsuarioCajero()
        {
            TokenCajeros = new HashSet<TokenCajero>();
        }

        public string Cuit { get; set; } = null!;
        public string? Password { get; set; }
        public string? Nombre { get; set; }
        public string? TipoUsuario { get; set; }
        public string? Correo { get; set; }
        public int Id { get; set; }
        public int? IdUsuario { get; set; }
        public bool? Estado { get; set; }

        public virtual Usuario? IdUsuarioNavigation { get; set; }
        public virtual ICollection<TokenCajero> TokenCajeros { get; set; }
    }
}
