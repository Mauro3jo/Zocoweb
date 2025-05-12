namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMPostulante
    {
        public int? Id { get; set; }
        public string? Nombre { get; set; } = null!;
        public string? Correo { get; set; } = null!;
        public string? Telefono { get; set; }
        public string? FechaCreacion { get; set; }
        public string? Cv { get; set; }
        public string? Direccion { get; set; }
        public string? Contraseña { get; set; }
        public string? Dni { get; set; }
        public string? Estado { get; set; }
        public int? TipoUsuario { get; set; }
        public string? Localidad { get; set; }
        public string? Provincia { get; set; }
        public string? Genero { get; set; }
        public string? Linkedin { get; set; }
        // Relación con Cargos Anteriores
        public List<VMCargoAnterior>? CargosAnteriores { get; set; }

        // Relación con Aptitudes (directas, sin educación)
        public List<VMAptitud>? Aptitudes { get; set; }

        // Relación con Educación
        public List<VMEducacion>? Educaciones { get; set; }
    }
}
