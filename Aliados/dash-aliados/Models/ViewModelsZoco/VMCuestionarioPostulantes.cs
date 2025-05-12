namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCuestionarioPostulantes
    {
        public int? Id { get; set; }
        public int? IdPostulante { get; set; }
        public int? IdCuestionario { get; set; }
        public DateTime? FechaCreacion { get; set; }
        public decimal? Resultado { get; set; }
        public string? token { get; set; }
    }
}
