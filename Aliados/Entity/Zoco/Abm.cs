using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class Abm
    {
        public int Id { get; set; }
        public int? IdAsesor { get; set; }
        public int? IdTerminal { get; set; }
        public int? Terminal { get; set; }
        public DateTime? Fecha { get; set; }
        public int? IdAliado { get; set; }
        public int? DniCuit { get; set; }
        public string? NombreTit { get; set; }
        public string? CalleRealTit { get; set; }
        public int? NumRealTit { get; set; }
        public string? LocalidadTit { get; set; }
        public string? ProvinciaTit { get; set; }
        public string? PaisTit { get; set; }
        public string? CpTit { get; set; }
        public string? Nacionalidad { get; set; }
        public DateTime? FechaNac { get; set; }
        public string? Celular { get; set; }
        public string? Fijo { get; set; }
        public string? NombreFantasia { get; set; }
        public string? Domicilio { get; set; }
        public string? Localidad { get; set; }
        public int? Cp { get; set; }
        public string? CondicionFiscal { get; set; }
        public string? Banco { get; set; }
        public string? TipoCuenta { get; set; }
        public string? Cuenta { get; set; }
        public long? CbuCvu { get; set; }
        public string? Alias { get; set; }
        public int? Cuit { get; set; }
        public string? TitularRazonSocial { get; set; }
        public string? Asesor { get; set; }
        public string? NumComActTerminal { get; set; }
        public string? NumComSolTerminal { get; set; }
        public string? TipoAbm { get; set; }
        public byte[]? ImgAlta { get; set; }
        public byte[]? ImgCuponIni { get; set; }
        public byte[]? ImgConstFiscal { get; set; }
        public byte[]? ImgConstCbuCvu { get; set; }
        public byte[]? ImgCopDniTit { get; set; }
        public byte[]? ImgFichaAut { get; set; }
        public byte[]? ImgEstadoMovimiento { get; set; }
    }
}
