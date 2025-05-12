using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.VM
{
    public class VMFidelizacion
    {
        public string? token { get; set; }
        public int? Id { get; set; }
        public string? Nterminal { get; set; } = null!;
        public string? Cuit { get; set; } = null!;
        public string? Fecha { get; set; }
        public string? Baja { get; set; }
        public string? Observacion { get; set; }

    }
}
