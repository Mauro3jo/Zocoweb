using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class ZocoConect
    {
        public ZocoConect()
        {
            Referidos = new HashSet<Referido>();
        }

        public int Id { get; set; }
        public int IdUser { get; set; }
        public string? Cbu { get; set; }
        public string? Alias { get; set; }
        public string? Banco { get; set; }
        public string? ClaveZocoConect { get; set; }

        public virtual Usuario IdUserNavigation { get; set; } = null!;
        public virtual ICollection<Referido> Referidos { get; set; }
    }
}
