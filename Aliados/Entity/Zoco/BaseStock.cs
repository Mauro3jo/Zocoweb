using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class BaseStock
    {
        public double? NDeTerminal { get; set; }
        public string? Estado { get; set; }
        public double? Terminal { get; set; }
        public string? Provincia { get; set; }
        public string? Asesor { get; set; }
        public DateTime? FechaDeCargaAbm { get; set; }
        public string? FechaDeBaja { get; set; }
        public decimal? FacturaciónMesPasado { get; set; }
        public decimal? FacturaciónMesEnCurso { get; set; }
        public decimal? FacturacionDelMesRazonSocial { get; set; }
        public string? RazonSocial { get; set; }
        public string? Comercio { get; set; }
        public string? DecisionTomada { get; set; }
        public string? DecisionAbm { get; set; }
        public string? Feedback { get; set; }
        public string? OrigenTerminal { get; set; }
        public string? Factura { get; set; }
        public string? EnPausa { get; set; }
        public string? Backup { get; set; }
        public string? Activacion { get; set; }
        public string? TipoDeAlta { get; set; }
        public double? AuxDiasDesdeElAlta { get; set; }
        public decimal? DeReubicar { get; set; }
        public decimal? DeBajoAnalisis { get; set; }
        public double? Alta { get; set; }
        public double? ParaLlegarA10000 { get; set; }
        public string? Rubro { get; set; }
        public decimal? FacturaciónMesPasado2 { get; set; }
        public string? IngresoASstt { get; set; }
        public string? EgresoDeSstt { get; set; }
        public string? MotivoSstt { get; set; }
        public double? AuxAltaActiva { get; set; }
        public double? AuxAltaNoActiva { get; set; }
        public string? Jefe { get; set; }
        public string? IngresoASstt2 { get; set; }
        public string? EgresoDeSstt2 { get; set; }
        public string? MotivoSstt3 { get; set; }
        public double? Terminal2 { get; set; }
    }
}
