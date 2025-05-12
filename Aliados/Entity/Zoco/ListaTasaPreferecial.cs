using System;
using System.Collections.Generic;

namespace Entity.Zoco
{
    public partial class ListaTasaPreferecial
    {
        public int Id { get; set; }
        public int? UserId { get; set; }
        public string? NombreFantasia { get; set; }
        public string? TasaPreferencial { get; set; }
        public DateTime? InicioTasaPreferencial { get; set; }
        public string? CostTranscDebCred { get; set; }
        public DateTime? InicioCostTranscDebCred { get; set; }
        public string? PorcentajeCostTranscDebCred { get; set; }
        public string? Ganancia { get; set; }
        public DateTime? InicioGanancia { get; set; }
        public string? PorcentajeGanancia { get; set; }
        public string? RetIibb { get; set; }
        public string? PorcentajeRetIibb { get; set; }
        public string? DebitoTasaPreferencial { get; set; }
        public string? CreditoTasaPreferencial { get; set; }

        public virtual Usuario? User { get; set; }
    }
}
