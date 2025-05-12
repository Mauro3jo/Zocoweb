namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMRespuesta
    {
        public int? Id { get; set; }
        public int? IdPregunta { get; set; }
        public string? RespuestaTexto { get; set; }
        public bool? EsCorrecta { get; set; }
        public string? token {  get; set; }
    }
}
