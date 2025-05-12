namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCrearComanda
    {
        public int? Id { get; set; }
        public string? token { get; set; }
        public string? Motivo { get; set; }
        public int? Iduser { get; set; }
        public int? Idgestor { get; set; }
        public string? FechaApertura { get; set; }
        public string? FechaCierre { get; set; }
        public bool? Finalizado { get; set; }
        public string? Direccion { get; set; }
        public string? Observacion { get; set; }
        public string? ObservacionAdministracion { get; set; }
        public string? ObservacionGestor { get; set; }
        public string? estado { get; set; }
        public string? Comercio { get; set; }
        public string? Cuit { get; set; }
        public string? Provincia { get; set; }
        public int? Terminal { get; set; }
        public string? Telefono { get; set; }
        public string? Email { get; set; }
    }
}
