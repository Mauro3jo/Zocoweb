using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Baja
    {
        public Baja()
        {
            HistorialCrms = new HashSet<HistorialCrm>();
        }

        public string? SasMutual { get; set; }
        public string? Estado { get; set; }
        public string? NDeTerminal { get; set; }
        public double? NDeComercio { get; set; }
        public double? NroLocal { get; set; }
        public double? Legajo { get; set; }
        public string? NombreDeFantasia { get; set; }
        public string? Domicilio { get; set; }
        public string? Localidad { get; set; }
        public string? CodigoPostal { get; set; }
        public double? Telefono { get; set; }
        public string? LinkDePago { get; set; }
        public string? Rubro { get; set; }
        public string? RubroSecundario { get; set; }
        public string? AltaAhora12 { get; set; }
        public DateTime? FechaDeAlta { get; set; }
        public DateTime? FechaDeBaja { get; set; }
        public string? TipoDeBaja { get; set; }
        public DateTime? ProgramacionBaja { get; set; }
        public double? DiasParaAlta { get; set; }
        public string? Provincia { get; set; }
        public string? NombreDelAsesor { get; set; }
        public string? Titular { get; set; }
        public double? CuitCuil { get; set; }
        public string? Banco { get; set; }
        public string? TipoDeCuenta { get; set; }
        public string? CbuCvu { get; set; }
        public string? NDeCuenta { get; set; }
        public string? LetraCbu { get; set; }
        public double? LargoCbu { get; set; }
        public string? Alias { get; set; }
        public string? Mail { get; set; }
        public string? RazonSocial { get; set; }
        public string? CuitRazonSocial { get; set; }
        public string? EstadoAfip { get; set; }
        public string? CodActividad { get; set; }
        public string? Actividad { get; set; }
        public string? Exento { get; set; }
        public string? EstadoRentas { get; set; }
        public string? Actividad2 { get; set; }
        public string? DomicilioFiscal { get; set; }
        public string? Provincia3 { get; set; }
        public double? Alicuota { get; set; }
        public string? Observacion { get; set; }
        public string? OrigenDeLaTerminal { get; set; }
        public string? DestinoDeLaTerminal { get; set; }
        public string? ReUbicacion { get; set; }
        public string? DiasSinAltaDeTerminal { get; set; }
        public string? AutorizadoPorTitular { get; set; }
        public string? FechaDeCargaAbm { get; set; }
        public string? FechaDeModificacion { get; set; }
        public string? AbmObservacionesDeCarga { get; set; }
        public string? ParaInforme { get; set; }
        public string? EnPausa { get; set; }
        public string? FechaDeInicioDePausa { get; set; }
        public string? FechaDeFinalizacionDePausa { get; set; }
        public string? Backup { get; set; }
        public string? Altas { get; set; }
        public string? Baja1 { get; set; }
        public string? IngresoASstt { get; set; }
        public string? EgresoDeSstt { get; set; }
        public string? MotivoSstt { get; set; }
        public string? _2IngresoASstt { get; set; }
        public string? _2EgresoDeSstt { get; set; }
        public string? _2MotivoSstt { get; set; }
        public string? FechaSsttMes { get; set; }
        public string? CodActividadRentas { get; set; }
        public string? ActividadRentas { get; set; }
        public int Id { get; set; }
        [JsonIgnore]

        public virtual ICollection<HistorialCrm> HistorialCrms { get; set; }
    }
}