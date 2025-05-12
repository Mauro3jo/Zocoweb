using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class FormularioBaja
    {
        public int Id { get; set; }
        public string? NumeroTerminal { get; set; }
        public DateTime? FechaApertura { get; set; }
        public int? IdGestor { get; set; }
        public string? NombreComercio { get; set; }
        public string? Observacion { get; set; }
        public bool? RegistraOperacionesPendientes { get; set; }
        public bool? RegistraOperacionesConTarjetaNaranja { get; set; }
        public bool? AdjuntaCierreLote { get; set; }
        public byte[]? BajaFirmada { get; set; }
        public byte[]? CuponInicializacionTerminal { get; set; }
        public byte[]? CierreLote { get; set; }
        public byte[]? FotoTerminal { get; set; }
        public bool? FueUtilizado { get; set; }

        public virtual Usuario? IdGestorNavigation { get; set; }
    }
}
