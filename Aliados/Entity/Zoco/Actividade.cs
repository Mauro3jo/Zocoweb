using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Actividade
    {
        public int Id { get; set; }
        public string? Motivo { get; set; }
        public int? Iduser { get; set; }
        public int? Idgestor { get; set; }
        public DateTime? FechaApertura { get; set; }
        public DateTime? FechaCierre { get; set; }
        public bool? Finalizado { get; set; }
        public string? Direccion { get; set; }
        public string? ObservacionAliado { get; set; }
        public string? ObservacionAdministracion { get; set; }
        public string? ObservacionGestor { get; set; }
        public string? Estado { get; set; }
        public string? NombredelComercio { get; set; }
        public string? Cuit { get; set; }
        public string? Provincia { get; set; }
        public int? NumeroTerminal { get; set; }
        public string? NumeroTelefono { get; set; }
        public string? Email { get; set; }
        public byte[]? Firma { get; set; }
        public string? Pasos { get; set; }
        public int? Idcierregestion { get; set; }
        [JsonIgnore]

        public virtual Usuario? IdcierregestionNavigation { get; set; }
        [JsonIgnore]

        public virtual Usuario? IdgestorNavigation { get; set; }
        [JsonIgnore]

        public virtual Usuario? IduserNavigation { get; set; }
    }
}
