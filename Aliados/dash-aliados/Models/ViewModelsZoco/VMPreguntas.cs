namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMPreguntas
    {
        public int? Id { get; set; }
        public int? IdCuestionario { get; set; }
        public string? token { get; set; }
        public string? TextoPregunta { get; set; }
        public string? TipoRespuesta { get; set; }
        public decimal? TiempoRespuesta { get; set; }
    }
}
