using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class FormularioModificacione
    {
        public int Id { get; set; }
        public DateTime? FechaApertura { get; set; }
        public int? IdGestor { get; set; }
        public string? NombreComercio { get; set; }
        public bool? BajaServicioTecnico { get; set; }
        public string? NumeroTerminalBaja { get; set; }
        public string? Observacion { get; set; }
        public bool? RegistraOperacionesPendientes { get; set; }
        public bool? RegistraOperacionesConTarjetaNaranja { get; set; }
        public bool? AdjuntaCierreLote { get; set; }
        public string? NumeroTerminalAltaL { get; set; }
        public string? NombreFantasia { get; set; }
        public string? NumeroComercio { get; set; }
        public string? Domicilio { get; set; }
        public string? Provincia { get; set; }
        public string? Ciudad { get; set; }
        public string? CodigoPostal { get; set; }
        public string? Banco { get; set; }
        public string? TipoCuenta { get; set; }
        public string? Cbucvu { get; set; }
        public string? Alias { get; set; }
        public string? Cuitbancario { get; set; }
        public string? Email { get; set; }
        public bool? AfipMonotributista { get; set; }
        public bool? AfipResponsableInscripto { get; set; }
        public bool? AfipExentoGanancia { get; set; }
        public bool? AfipExentoIva { get; set; }
        public bool? RentasIncripto { get; set; }
        public bool? RentasConvenioMultilateral { get; set; }
        public bool? RentasExento { get; set; }
        public byte[]? AltaFirmada { get; set; }
        public byte[]? CuponInicializacionTerminal1 { get; set; }
        public byte[]? ConstanciaCbucvu { get; set; }
        public byte[]? ContanciaCbuCvu { get; set; }
        public byte[]? Dni { get; set; }
        public byte[]? CuponInicializacionTerminal2 { get; set; }
        public byte[]? ConstanciaRentas { get; set; }
        public byte[]? TitularRazonSocial { get; set; }
        public byte[]? Dnidorso { get; set; }
        public bool? FueUtilizado { get; set; }
        public bool? Secambiaporclover { get; set; }
        public string? TipoModificacion { get; set; }
        public bool? VuelveAlComercio { get; set; }

        public virtual Usuario? IdGestorNavigation { get; set; }
    }
}
