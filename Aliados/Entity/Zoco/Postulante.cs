
using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Postulante
    {
        public Postulante()
        {
            PostulanteCuestionarios = new HashSet<PostulanteCuestionario>();
            PostulantePuestos = new HashSet<PostulantePuesto>();
            RespuestasUsuarios = new HashSet<RespuestasUsuario>();
            TokenPostulantes = new HashSet<TokenPostulante>();
        }

        public int Id { get; set; }
        public string Nombre { get; set; } = null!;
        public string Correo { get; set; } = null!;
        public string? Telefono { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public byte[]? Cv { get; set; }
        public string? Direccion { get; set; }
        public string? Contraseña { get; set; }
        public string? Dni { get; set; }
        public bool? Estado { get; set; }
        public int? TipoUsuario { get; set; }
        public string? Localidad { get; set; }
        public string? Provincia { get; set; }
        public virtual ICollection<Aptitud> Aptituds { get; set; }
        public virtual ICollection<Educacion> Educacions { get; set; }

        public virtual ICollection<CargosAnteriore> CargosAnteriores { get; set; }
        public virtual ICollection<PostulanteCuestionario> PostulanteCuestionarios { get; set; }
        public virtual ICollection<PostulantePuesto> PostulantePuestos { get; set; }
        public virtual ICollection<RespuestasUsuario> RespuestasUsuarios { get; set; }
        public virtual ICollection<TokenPostulante> TokenPostulantes { get; set; }
    }
}
