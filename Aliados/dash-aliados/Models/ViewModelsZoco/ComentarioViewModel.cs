namespace dash_aliados.Models.ViewModelsZoco
{
    public class ComentarioViewModel
    {
        public int? Id { get; set; }
        public int? IdUsuario { get; set; }
        public string? Cuit { get; set; } 
        public string? Comentario1 { get; set; }
        public int? IdComentarioPadre { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public bool EsDelUsuario { get; set; } 
        public int? IdUsuarioRespuesta { get; set; }
        public string? ImagenBase64 { get; set; }


    }
}
