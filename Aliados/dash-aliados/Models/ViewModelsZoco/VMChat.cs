namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMChat
    {
        public string? Token { get; set; }
        public int? Id { get; set; } 
        public int? IdUsuario { get; set; }
        public string? Cuit {  get; set; }
        public string? ComentarioTexto { get; set; } 
        public int? IdComentarioPadre { get; set; }
        public string? ImagenBase64 { get; set; } // Campo nuevo para la imagen en base64

    }
}
