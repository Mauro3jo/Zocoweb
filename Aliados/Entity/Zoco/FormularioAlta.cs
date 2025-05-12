using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class FormularioAlta
    {
        public int Id { get; set; }
        public string? TipoPersona { get; set; }
        public DateTime? FechaApertura { get; set; }
        public string? NumeroTerminal { get; set; }
        public string? ApellidoYnombre { get; set; }
        public string? Cuittitular { get; set; }
        public string? ActividadLaboralProfesional { get; set; }
        public string? Calle { get; set; }
        public string? NumeroCalle { get; set; }
        public string? LocalidadTitular { get; set; }
        public string? Provincia { get; set; }
        public string? Pais { get; set; }
        public string? CodigoPostalTitular { get; set; }
        public string? Nacionalidad { get; set; }
        public DateTime? FechaNacimiento { get; set; }
        public string? Celular { get; set; }
        public string? TelFijo { get; set; }
        public string? Correo { get; set; }
        public string? Apoderado { get; set; }
        public string? NombreFantasia { get; set; }
        public string? Domicilio { get; set; }
        public string? LocalidadComercio { get; set; }
        public string? CodigoPostalComercio { get; set; }
        public bool? AfipMonotributista { get; set; }
        public bool? AfipResponsableInscripto { get; set; }
        public bool? AfipExentoGanancia { get; set; }
        public bool? AfipExentoIva { get; set; }
        public bool? RentasIncripto { get; set; }
        public bool? RentasConvenioMultilateral { get; set; }
        public bool? RentasExento { get; set; }
        public string? Banco { get; set; }
        public string? TipoCuenta { get; set; }
        public string? Cbucvu { get; set; }
        public string? Alias { get; set; }
        public string? Cuitbancario { get; set; }
        public string? TitularRazonSocial { get; set; }
        public int? IdGestor { get; set; }
        public string? NumeroComericoActual { get; set; }
        public string? NumeroComercioSolicitado { get; set; }
        public string? TipoAlta { get; set; }
        public bool? NuevoPanel { get; set; }
        public byte[]? AltaFirmada { get; set; }
        public byte[]? CuponInicializacionTerminal { get; set; }
        public byte[]? ConstanciaAfip { get; set; }
        public byte[]? ContanciaCbuCvu { get; set; }
        public byte[]? Dnifrente { get; set; }
        public byte[]? CopiaContratoSocialOactoConstitutivo { get; set; }
        public byte[]? FichaAutorizacion { get; set; }
        public byte[]? CierredeLote { get; set; }
        public byte[]? ConstanciaRentas { get; set; }
        public byte[]? Dnidorso { get; set; }
        public bool? FueUtilizado { get; set; }

        public virtual Usuario? IdGestorNavigation { get; set; }
    }
}
