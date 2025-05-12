using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Origen
    {
        public Origen()
        {
            DestinoTerminals = new HashSet<DestinoTerminal>();
        }

        public int Id { get; set; }
        public int? AltaId { get; set; }
        public string? Origen1 { get; set; }
        public DateTime? Fecha { get; set; }
        public string? Observaciones { get; set; }
        public virtual Alta? Alta { get; set; }
        public virtual ICollection<DestinoTerminal> DestinoTerminals { get; set; }
    }
}
