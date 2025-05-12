using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Califico
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public int? NumCalifico { get; set; }
        public bool? Califico1 { get; set; }
        public DateTime? Fecha { get; set; }
    }
}
