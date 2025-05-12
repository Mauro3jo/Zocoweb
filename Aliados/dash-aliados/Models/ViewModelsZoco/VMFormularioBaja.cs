namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMFormularioBaja
    {
        public int? Id { get; set; }
        public string? token { get; set; }
        public string? TerminalN { get; set; }
        public string? FechaApertura { get; set; }
        public int? IdGestor { get; set; }
        public string? NombreComercio { get; set; }
        public string? Observacion { get; set; }
        public string? RegistraOperacionesPendientes { get; set; }
        public string? RegistraOperacionesConTarjetaNaranja { get; set; }
        public string? AdjuntaCierreLote { get; set; }
        public string? BajaFirmada { get; set; }
        public string? CuponInicializacionTerminal { get; set; }
        public string? CierreLote { get; set; }
        public string? FotoTerminal { get; set; }
    }
}
