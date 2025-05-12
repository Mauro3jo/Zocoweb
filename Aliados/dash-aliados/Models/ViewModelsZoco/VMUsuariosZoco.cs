namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMUsuariosZoco
    {
        public string? Token { get; set; }
        public string? Usuario { get; set; }
        public string? Password { get; set; }
        public string? Nombre { get; set; }
        public int? TipoUsuario { get; set; }
        public int? CambioClave { get; set; }
        public int? Id { get; set; }
        public int? IdUsuario { get; set; }
        public string? UsuarioPadre { get; set; } // Agregado este campo

        public string? Correo { get; set; }
    }
}
