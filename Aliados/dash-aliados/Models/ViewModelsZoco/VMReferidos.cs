namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMReferidos
    {
        public string? token { get; set; }
        public int? Id { get; set; }
        public int? IdZocoConect { get; set; }
        public int? IdUser { get; set; }
        public string? FechaAlta { get; set; }
        public string? FechaBaja { get; set; }
        public string? Comprobante { get; set; }

        public string? FechaCierre { get; set; }
        public double? MontoComision { get; set; }
        public string? SePagon { get; set; }
        public string? FechaPago { get; set; }
        public string? NroComercio { get; set; }
        public string? NroTerminal { get; set; }

    }
}
