using Entity.Zoco;

namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCargoAnterior
    {
        public string? TipoEmpleo { get; set; }
        public string? Empresa { get; set; }
        public DateTime? FechaInicio { get; set; }
        public DateTime? FechaFin { get; set; }
        public string? Ubicacion { get; set; }
        public string? Descripcion { get; set; }
        public List<VMReferencia>? Referencias { get; set; } // Relación con referencias
    }
}