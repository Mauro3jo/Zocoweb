namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCuestionario
    {
        public string? token {  get; set; }
        public int? Id { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public int? IdPuesto { get; set; }
        public string? Nombre { get; set; }
        public int? MaxPreguntas { get; set; }
        public string? NotaAprobacion { get; set; }

    }
}
