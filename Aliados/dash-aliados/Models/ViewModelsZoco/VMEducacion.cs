namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMEducacion
    {
        public int? Id { get; set; }
        public string? InstitucionEducativa { get; set; }
        public string? Titulo { get; set; }
        public string? DisciplinaAcademica { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? Descripcion { get; set; }

        // Lista de Aptitudes relacionadas con esta educación
        public List<VMAptitud>? Aptitudes { get; set; }
    }
}
