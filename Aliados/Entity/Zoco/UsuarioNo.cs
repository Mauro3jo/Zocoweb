using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class UsuarioNo
    {
        public int IdUsuario { get; set; }
        public string? Nombre { get; set; }
        public string? Correo { get; set; }
        public string? Telefono { get; set; }
        public int? IdRol { get; set; }
        public string? Clave { get; set; }
        public bool? EsActivo { get; set; }
        public int? Puntaje { get; set; }
        public int? CambioClave { get; set; }

        public virtual Rol? IdRolNavigation { get; set; }
    }
}
