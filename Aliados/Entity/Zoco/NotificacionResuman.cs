using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class NotificacionResuman
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public bool? Califico { get; set; }
        public DateTime? Fecha { get; set; }
    }
}
