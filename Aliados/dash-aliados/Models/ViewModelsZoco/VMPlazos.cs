using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMPlazos
    {
        public  string? Fecha {  get; set; }
        public string? Tipo { get; set; } 
        public string? Tarjeta { get; set; } 
        public int? Cuotas { get; set; }  // esto menos 

    }
}
