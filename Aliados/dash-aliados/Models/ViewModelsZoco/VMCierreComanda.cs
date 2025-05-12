namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCierreComanda
    {
        public int? id { get; set; }
        public string? token { get; set; }

        public string? observaciones { get; set; }
        public List<string> pasos { get; set; } // Cambiado a List<string>
        public string? Estado {  get; set; }

    }
}
