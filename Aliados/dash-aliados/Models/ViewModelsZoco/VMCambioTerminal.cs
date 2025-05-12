namespace dash_aliados.Models.ViewModelsZoco
{
    public class VMCambioTerminal
    {
        public string? Token { get; set; }
        public string? Tipo { get; set; }
        public string? Observacion { get; set; }
        public string? NumeroTerminalBaja { get; set; }
        public string? NumeroTerminalAlta { get; set; }
        /// <summary>
        public string? Motivo { get; set; }
        /// </summary>
        // Campos adicionales para "Cambio Titularidad"
        public string? Titular { get; set; }          // Nombre del titular
        public string? CuitCuil { get; set; }         // CUIT/CUIL del titular
        public string? Banco { get; set; }            // Nombre del banco
        public string? TipoDeCuenta { get; set; }     // Tipo de cuenta (Ahorro, Corriente, etc.)
        public string? CbuCvu { get; set; }           // CBU o CVU
        public string? NDeCuenta { get; set; }        // Número de cuenta
        public string? LetraCbu { get; set; }         // Letra del CBU
        public int? LargoCbu { get; set; }            // Largo del CBU (cantidad de caracteres)
        public string? Alias { get; set; }            // Alias del CBU
        /// <summary>
        /// nuevos agregados
        /// </summary>

        public string? NDeComercio { get; set; }     // numero de comercio
        public string? Legajo { get; set; }         // Legajo
        public string? NombreDeFantasia { get; set; } // NombreDeFantasia
        public string? Domicilio { get; set; } //Domicilio
        public string? Localidad { get; set; } //Localidad
        public string? codigoPostal { get; set; }  //codigoPostal
        public string? Telefono { get; set; } //Telefono
        public string? Rubro { get; set; } //Rubro
        public string? RubroSecundario { get; set; } //RubroSecundario
        public string? Mail { get; set; }  // Mail
        public string? Razonsocial { get; set; } // Razonsocial
        public string? CuitRazonSocial { get; set; } // cuit de la razon social
        public string? EstadoAfip { get; set; } //S EstadoAfip
        public string? CodActividad { get; set; } // CodActividad
        public string? Actividad { get; set; } // 
        public string? Exento { get; set; }

        public string? EstadoRentas { get; set;}
        public string? Actividad2 { get; set; }
        public string? DomicilioFiscal { get; set; }
        public string? Provincia3 { get; set; }
        public string? Alicuota { get; set; }
        public string? CodActividadRentas { get; set; }
        public string? ActividadRentas {get; set;}

        //////
        /// otros agregados me recontra cago en el pingo
        /// 
        public string? FechaBaja { get; set; }

        public string? FechaAlta { get; set; }

    }
}
