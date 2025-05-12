namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMRespuestaUsuario
    {
        public int? Id { get; set; }
        public int? IdPostulante { get; set; }
        public int? IdPregunta { get; set; }
        public int? IdRespuesta { get; set; }
        public byte[]? ArchivoRespuesta { get; set; }
        public string? token { get; set; }
        public string? Tipo { get; set; }
        public string? textorespuesta { get; set; }
    }
}
