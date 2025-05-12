using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Entity.Zoco
{
    public partial class Usuario
    {
        public Usuario()
        {
            ActividadeIdcierregestionNavigations = new HashSet<Actividade>();
            ActividadeIdgestorNavigations = new HashSet<Actividade>();
            ActividadeIduserNavigations = new HashSet<Actividade>();
            Afips = new HashSet<Afip>();
            CalificoComs = new HashSet<CalificoCom>();
            CheckAsesores = new HashSet<CheckAsesore>();
            CheckAsesoresImagens = new HashSet<CheckAsesoresImagen>();
            ComentarioIdUsuarioNavigations = new HashSet<Comentario>();
            ComentarioIdUsuarioRespuestaNavigations = new HashSet<Comentario>();
            DocumentosUsuarios = new HashSet<DocumentosUsuario>();
            Facturantes = new HashSet<Facturante>();
            FormularioAlta = new HashSet<FormularioAlta>();
            FormularioBajas = new HashSet<FormularioBaja>();
            FormularioModificaciones = new HashSet<FormularioModificacione>();
            HistorialCrms = new HashSet<HistorialCrm>();
            Iibbs = new HashSet<Iibb>();
            Legajos = new HashSet<Legajo>();
            ListaTasaPreferecials = new HashSet<ListaTasaPreferecial>();
            PanelCalidadInternoGestors = new HashSet<PanelCalidadInterno>();
            PanelCalidadInternoIdUserNavigations = new HashSet<PanelCalidadInterno>();
            PanelGestorInternoIdAliadoNavigations = new HashSet<PanelGestorInterno>();

            PanelGestorInternoIdUserNavigations = new HashSet<PanelGestorInterno>();
            Tokens = new HashSet<Token>();
            UsuarioCajeros = new HashSet<UsuarioCajero>();

            // Additions from the second model
            Referidos = new HashSet<Referido>();
            ZocoConects = new HashSet<ZocoConect>();
        }

        public string? Usuario1 { get; set; }
        public string? Password { get; set; }
        public string? Nombre { get; set; }
        public int? TipoUsuario { get; set; }
        public int? CambioClave { get; set; }
        public int Id { get; set; }
        public string? Correo { get; set; }
        public bool? Estado { get; set; }

        [JsonIgnore]
        public virtual ICollection<Actividade> ActividadeIdcierregestionNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Actividade> ActividadeIdgestorNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Actividade> ActividadeIduserNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Afip> Afips { get; set; }

        [JsonIgnore]
        public virtual ICollection<CalificoCom> CalificoComs { get; set; }

        [JsonIgnore]
        public virtual ICollection<CheckAsesore> CheckAsesores { get; set; }

        [JsonIgnore]
        public virtual ICollection<CheckAsesoresImagen> CheckAsesoresImagens { get; set; }

        [JsonIgnore]
        public virtual ICollection<Comentario> ComentarioIdUsuarioNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Comentario> ComentarioIdUsuarioRespuestaNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<DocumentosUsuario> DocumentosUsuarios { get; set; }

        [JsonIgnore]
        public virtual ICollection<Facturante> Facturantes { get; set; }

        [JsonIgnore]
        public virtual ICollection<FormularioAlta> FormularioAlta { get; set; }

        [JsonIgnore]
        public virtual ICollection<FormularioBaja> FormularioBajas { get; set; }

        [JsonIgnore]
        public virtual ICollection<FormularioModificacione> FormularioModificaciones { get; set; }

        [JsonIgnore]
        public virtual ICollection<HistorialCrm> HistorialCrms { get; set; }

        [JsonIgnore]
        public virtual ICollection<Iibb> Iibbs { get; set; }

        [JsonIgnore]
        public virtual ICollection<Legajo> Legajos { get; set; }

        [JsonIgnore]
        public virtual ICollection<ListaTasaPreferecial> ListaTasaPreferecials { get; set; }

        [JsonIgnore]
        public virtual ICollection<PanelCalidadInterno> PanelCalidadInternoGestors { get; set; }

        [JsonIgnore]
        public virtual ICollection<PanelCalidadInterno> PanelCalidadInternoIdUserNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<PanelGestorInterno> PanelGestorInternoIdUserNavigations { get; set; }

        [JsonIgnore]
        public virtual ICollection<Token> Tokens { get; set; }

        [JsonIgnore]
        public virtual ICollection<UsuarioCajero> UsuarioCajeros { get; set; }

        // Additional collections added
        [JsonIgnore]
        public virtual ICollection<Referido> Referidos { get; set; }

        [JsonIgnore]
        public virtual ICollection<ZocoConect> ZocoConects { get; set; }
        [JsonIgnore]
        public virtual ICollection<PanelGestorInterno> PanelGestorInternoIdAliadoNavigations { get; set; }

    }
}
