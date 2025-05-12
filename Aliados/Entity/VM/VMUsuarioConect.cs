using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.VM
{

    public class VMUsuarioConect
    {
        public string? token { get; set; }
        public int? Id { get; set; }
        public string? Usuario1 { get; set; }

        public int IdUser { get; set; }
        public string? Nombre { get; set; }
        public string? Cbu { get; set; }
        public string? Alias { get; set; }
        public string? Banco { get; set; }
        public string? ClaveZocoConect { get; set; }
        public int? TipoUsuario { get; set; }
        public string? Correo { get; set; }
        public bool? Estado { get; set; }
    }
}
