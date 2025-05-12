using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class DestinoTerminal
    {
        public int Id { get; set; }
        public int? OrigenId { get; set; }
        public string? Destino { get; set; }
        public DateTime? Fecha { get; set; }
        public string? Observaciones { get; set; }

        public virtual Origen? Origen { get; set; }
    }
}
