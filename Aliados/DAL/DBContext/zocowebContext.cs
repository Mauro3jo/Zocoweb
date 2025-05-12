
using System;
using System.Collections.Generic;

using Entity.Zoco;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace DAL.DBContext
{
    public partial class zocowebContext : DbContext
    {
        public zocowebContext()
        {
        }

        public zocowebContext(DbContextOptions<zocowebContext> options)
            : base(options)
        {
        }


        public virtual DbSet<Abm> Abms { get; set; } = null!;
        public virtual DbSet<Actividade> Actividades { get; set; } = null!;
        public virtual DbSet<Afip> Afips { get; set; } = null!;
        public virtual DbSet<Alta> Altas { get; set; } = null!;
        public virtual DbSet<AltasCrudo> AltasCrudos { get; set; } = null!;
        public virtual DbSet<Analisi> Analises { get; set; } = null!;
        public virtual DbSet<Aptitud> Aptituds { get; set; } = null!;
        public virtual DbSet<Baja> Bajas { get; set; } = null!;
        public virtual DbSet<BajasCrudo> BajasCrudos { get; set; } = null!;
        public virtual DbSet<Banco> Bancos { get; set; } = null!;
        public virtual DbSet<BaseCuota> BaseCuotas { get; set; } = null!;
        public virtual DbSet<BaseDashboarHistorico> BaseDashboarHistoricos { get; set; } = null!;
        public virtual DbSet<BaseDashboard> BaseDashboards { get; set; } = null!;
        public virtual DbSet<BaseStock> BaseStocks { get; set; } = null!;
        public virtual DbSet<Busqueda> Busquedas { get; set; } = null!;
        public virtual DbSet<Califico> Calificos { get; set; } = null!;
        public virtual DbSet<CalificoCom> CalificoComs { get; set; } = null!;
        public virtual DbSet<CargosAnteriore> CargosAnteriores { get; set; } = null!;
        public virtual DbSet<CheckAsesore> CheckAsesores { get; set; } = null!;
        public virtual DbSet<CheckAsesoresImagen> CheckAsesoresImagens { get; set; } = null!;
        public virtual DbSet<Clover> Clovers { get; set; } = null!;
        public virtual DbSet<Comentario> Comentarios { get; set; } = null!;
        public virtual DbSet<Comercio> Comercios { get; set; } = null!;
        public virtual DbSet<CompMensual> CompMensuals { get; set; } = null!;
        public virtual DbSet<ConstPreEstablecida> ConstPreEstablecidas { get; set; } = null!;
        public virtual DbSet<Contratado> Contratados { get; set; } = null!;
        public virtual DbSet<CrudoReport> CrudoReports { get; set; } = null!;
        public virtual DbSet<Cuestionario> Cuestionarios { get; set; } = null!;
        public virtual DbSet<Cuota> Cuotas { get; set; } = null!;
        public virtual DbSet<DestinoTerminal> DestinoTerminals { get; set; } = null!;
        public virtual DbSet<DocumentosUsuario> DocumentosUsuarios { get; set; } = null!;
        public virtual DbSet<Educacion> Educacions { get; set; } = null!;
        public virtual DbSet<EmailConfiguration> EmailConfigurations { get; set; } = null!;
        public virtual DbSet<Facturante> Facturantes { get; set; } = null!;
        public virtual DbSet<FechaEliminar> FechaEliminars { get; set; } = null!;
        public virtual DbSet<Fidelizacion> Fidelizacions { get; set; } = null!;
        public virtual DbSet<FilasCloverQr> FilasCloverQrs { get; set; } = null!;
        public virtual DbSet<FilasCloverTicket> FilasCloverTickets { get; set; } = null!;
        public virtual DbSet<FormularioAlta> FormularioAltas { get; set; } = null!;
        public virtual DbSet<FormularioBaja> FormularioBajas { get; set; } = null!;
        public virtual DbSet<FormularioModificacione> FormularioModificaciones { get; set; } = null!;
        public virtual DbSet<HistorialCrm> HistorialCrms { get; set; } = null!;
        public virtual DbSet<Iibb> Iibbs { get; set; } = null!;
        public virtual DbSet<Inflacion> Inflacions { get; set; } = null!;
        public virtual DbSet<InicioAsesore> InicioAsesores { get; set; } = null!;
        public virtual DbSet<Legajo> Legajos { get; set; } = null!;
        public virtual DbSet<ListaCuotum> ListaCuota { get; set; } = null!;
        public virtual DbSet<ListaIibbprovincium> ListaIibbprovincia { get; set; } = null!;
        public virtual DbSet<ListaImpositiva> ListaImpositivas { get; set; } = null!;
        public virtual DbSet<ListaTasaPreferecial> ListaTasaPreferecials { get; set; } = null!;
        public virtual DbSet<Menu> Menus { get; set; } = null!;
        public virtual DbSet<Noticia> Noticias { get; set; } = null!;
        public virtual DbSet<NotificacionResuman> NotificacionResumen { get; set; } = null!;
        public virtual DbSet<NroComercio> NroComercios { get; set; } = null!;
        public virtual DbSet<Origen> Origens { get; set; } = null!;
        public virtual DbSet<PanelCalidadInterno> PanelCalidadInternos { get; set; } = null!;
        public virtual DbSet<PanelGestorInterno> PanelGestorInternos { get; set; } = null!;
        public virtual DbSet<Postulante> Postulantes { get; set; } = null!;
        public virtual DbSet<PostulanteCuestionario> PostulanteCuestionarios { get; set; } = null!;
        public virtual DbSet<PostulantePuesto> PostulantePuestos { get; set; } = null!;
        public virtual DbSet<Pregunta> Preguntas { get; set; } = null!;
        public virtual DbSet<Prospecto> Prospectos { get; set; } = null!;
        public virtual DbSet<Puesto> Puestos { get; set; } = null!;
        public virtual DbSet<ReceivedEmail> ReceivedEmails { get; set; } = null!;
        public virtual DbSet<Referencia> Referencias { get; set; } = null!;
        public virtual DbSet<Referido> Referidos { get; set; } = null!;
        public virtual DbSet<ReporteMensual> ReporteMensuals { get; set; } = null!;
        public virtual DbSet<Respuesta> Respuestas { get; set; } = null!;
        public virtual DbSet<RespuestasUsuario> RespuestasUsuarios { get; set; } = null!;
        public virtual DbSet<Reunione> Reuniones { get; set; } = null!;
        public virtual DbSet<Rol> Rols { get; set; } = null!;
        public virtual DbSet<RolMenu> RolMenus { get; set; } = null!;
        public virtual DbSet<Rubro> Rubros { get; set; } = null!;
        public virtual DbSet<SentEmail> SentEmails { get; set; } = null!;
        public virtual DbSet<Stock> Stocks { get; set; } = null!;
        public virtual DbSet<TasaIntere> TasaInteres { get; set; } = null!;
        public virtual DbSet<Terminale> Terminales { get; set; } = null!;
        public virtual DbSet<TerminalesNew> TerminalesNews { get; set; } = null!;
        public virtual DbSet<TicketsClover> TicketsClovers { get; set; } = null!;
        public virtual DbSet<Token> Tokens { get; set; } = null!;
        public virtual DbSet<TokenCajero> TokenCajeros { get; set; } = null!;
        public virtual DbSet<TokenPostulante> TokenPostulantes { get; set; } = null!;
        public virtual DbSet<Usuario> Usuarios { get; set; } = null!;
        public virtual DbSet<UsuarioCajero> UsuarioCajeros { get; set; } = null!;
        public virtual DbSet<UsuarioNo> UsuarioNos { get; set; } = null!;
        public virtual DbSet<ZocoConect> ZocoConects { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {

        }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Abm>(entity =>
            {
                entity.ToTable("ABM");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias)
                    .HasMaxLength(50)
                    .HasColumnName("alias");

                entity.Property(e => e.Asesor)
                    .HasMaxLength(255)
                    .HasColumnName("asesor");

                entity.Property(e => e.Banco)
                    .HasMaxLength(255)
                    .HasColumnName("banco");

                entity.Property(e => e.CalleRealTit)
                    .HasMaxLength(255)
                    .HasColumnName("calle_real_tit");

                entity.Property(e => e.CbuCvu).HasColumnName("cbu_cvu");

                entity.Property(e => e.Celular)
                    .HasMaxLength(20)
                    .HasColumnName("celular");

                entity.Property(e => e.CondicionFiscal)
                    .HasMaxLength(50)
                    .HasColumnName("condicion_fiscal");

                entity.Property(e => e.Cp).HasColumnName("cp");

                entity.Property(e => e.CpTit)
                    .HasMaxLength(10)
                    .IsUnicode(false)
                    .HasColumnName("cp_tit");

                entity.Property(e => e.Cuenta)
                    .HasMaxLength(20)
                    .HasColumnName("cuenta");

                entity.Property(e => e.Cuit).HasColumnName("cuit");

                entity.Property(e => e.DniCuit).HasColumnName("dni_cuit");

                entity.Property(e => e.Domicilio)
                    .HasMaxLength(255)
                    .HasColumnName("domicilio");

                entity.Property(e => e.Fecha)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha");

                entity.Property(e => e.FechaNac)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha_nac");

                entity.Property(e => e.Fijo)
                    .HasMaxLength(20)
                    .HasColumnName("fijo");

                entity.Property(e => e.IdAliado).HasColumnName("id_aliado");

                entity.Property(e => e.IdAsesor).HasColumnName("id_asesor");

                entity.Property(e => e.IdTerminal).HasColumnName("id_terminal");

                entity.Property(e => e.ImgAlta).HasColumnName("img_alta");

                entity.Property(e => e.ImgConstCbuCvu).HasColumnName("img_const_cbu_cvu");

                entity.Property(e => e.ImgConstFiscal).HasColumnName("img_const_fiscal");

                entity.Property(e => e.ImgCopDniTit).HasColumnName("img_cop_dni_tit");

                entity.Property(e => e.ImgCuponIni).HasColumnName("img_cupon_ini");

                entity.Property(e => e.ImgEstadoMovimiento).HasColumnName("img_estado_movimiento");

                entity.Property(e => e.ImgFichaAut).HasColumnName("img_ficha_aut");

                entity.Property(e => e.Localidad)
                    .HasMaxLength(100)
                    .HasColumnName("localidad");

                entity.Property(e => e.LocalidadTit)
                    .HasMaxLength(100)
                    .HasColumnName("localidad_tit");

                entity.Property(e => e.Nacionalidad)
                    .HasMaxLength(50)
                    .HasColumnName("nacionalidad");

                entity.Property(e => e.NombreFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("nombre_fantasia");

                entity.Property(e => e.NombreTit)
                    .HasMaxLength(255)
                    .HasColumnName("nombre_tit");

                entity.Property(e => e.NumComActTerminal)
                    .HasMaxLength(20)
                    .HasColumnName("num_com_act_terminal");

                entity.Property(e => e.NumComSolTerminal)
                    .HasMaxLength(20)
                    .HasColumnName("num_com_sol_terminal");

                entity.Property(e => e.NumRealTit).HasColumnName("num_real_tit");

                entity.Property(e => e.PaisTit)
                    .HasMaxLength(100)
                    .HasColumnName("pais_tit");

                entity.Property(e => e.ProvinciaTit)
                    .HasMaxLength(100)
                    .HasColumnName("provincia_tit");

                entity.Property(e => e.Terminal).HasColumnName("terminal");

                entity.Property(e => e.TipoAbm)
                    .HasMaxLength(50)
                    .HasColumnName("tipo_abm");

                entity.Property(e => e.TipoCuenta)
                    .HasMaxLength(50)
                    .HasColumnName("tipo_cuenta");

                entity.Property(e => e.TitularRazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("titular_razon_social");
            });

            modelBuilder.Entity<Actividade>(entity =>
            {
                entity.ToTable("actividades");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("CUIT");

                entity.Property(e => e.Direccion)
                    .HasMaxLength(500)
                    .HasColumnName("direccion");

                entity.Property(e => e.Estado).HasMaxLength(100);

                entity.Property(e => e.FechaApertura)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaApertura");

                entity.Property(e => e.FechaCierre)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaCierre");

                entity.Property(e => e.Finalizado).HasColumnName("finalizado");

                entity.Property(e => e.Idcierregestion).HasColumnName("idcierregestion");

                entity.Property(e => e.Idgestor).HasColumnName("idgestor");

                entity.Property(e => e.Iduser).HasColumnName("iduser");

                entity.Property(e => e.Motivo)
                    .HasMaxLength(255)
                    .HasColumnName("motivo");

                entity.Property(e => e.NombredelComercio).HasMaxLength(255);

                entity.Property(e => e.NumeroTelefono)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.Provincia).HasMaxLength(100);

                entity.HasOne(d => d.IdcierregestionNavigation)
                    .WithMany(p => p.ActividadeIdcierregestionNavigations)
                    .HasForeignKey(d => d.Idcierregestion)
                    .HasConstraintName("FK_Actividades_CierreGestion_IdCierreGestion");

                entity.HasOne(d => d.IdgestorNavigation)
                    .WithMany(p => p.ActividadeIdgestorNavigations)
                    .HasForeignKey(d => d.Idgestor)
                    .HasConstraintName("FK_Actividades_Gestores_IdGestor");

                entity.HasOne(d => d.IduserNavigation)
                    .WithMany(p => p.ActividadeIduserNavigations)
                    .HasForeignKey(d => d.Iduser)
                    .HasConstraintName("FK_actividades_iduser");
            });

            modelBuilder.Entity<Afip>(entity =>
            {
                entity.ToTable("AFIP");

                entity.Property(e => e.AfipId).HasColumnName("AFIP_id");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.DocumentoPdf).HasColumnName("documento_pdf");

                entity.Property(e => e.FechaSubida)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_subida");

                entity.Property(e => e.NombreDocumento)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("nombre_documento");

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Afips)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AFIP_usuario_usuarios");
            });

            modelBuilder.Entity<Alta>(entity =>
            {
                entity.ToTable("altas");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AbmObservacionesDeCarga)
                    .HasMaxLength(255)
                    .HasColumnName("ABM OBSERVACIONES DE CARGA");

                entity.Property(e => e.Actividad)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD");

                entity.Property(e => e.Actividad2)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD2");

                entity.Property(e => e.ActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD RENTAS");

                entity.Property(e => e.Alias)
                    .HasMaxLength(255)
                    .HasColumnName("ALIAS");

                entity.Property(e => e.Alicuota).HasColumnName("ALICUOTA");

                entity.Property(e => e.AltaAhora12)
                    .HasMaxLength(255)
                    .HasColumnName("ALTA AHORA 12");

                entity.Property(e => e.Altas)
                    .HasMaxLength(255)
                    .HasColumnName("ALTAS");

                entity.Property(e => e.AutorizadoPorTitular)
                    .HasMaxLength(255)
                    .HasColumnName("AUTORIZADO POR TITULAR");

                entity.Property(e => e.Backup)
                    .HasMaxLength(255)
                    .HasColumnName("BACKUP");

                entity.Property(e => e.Baja)
                    .HasMaxLength(255)
                    .HasColumnName("BAJA");

                entity.Property(e => e.Banco)
                    .HasMaxLength(255)
                    .HasColumnName("BANCO");

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad).HasColumnName("COD# ACTIVIDAD");

                entity.Property(e => e.CodActividadRentas).HasColumnName("COD# ACTIVIDAD RENTAS");

                entity.Property(e => e.CodigoPostal).HasColumnName("Codigo Postal");

                entity.Property(e => e.CuitCuil).HasColumnName("CUIT/CUIL");

                entity.Property(e => e.CuitRazonSocial).HasColumnName("CUIT RAZON SOCIAL");

                entity.Property(e => e.DestinoDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("DESTINO DE LA TERMINAL");

                entity.Property(e => e.DiasParaAlta)
                    .HasMaxLength(255)
                    .HasColumnName("Dias para alta");

                entity.Property(e => e.DiasSinAltaDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("Dias sin alta de terminal");

                entity.Property(e => e.Domicilio)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO");

                entity.Property(e => e.DomicilioFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO FISCAL");

                entity.Property(e => e.EgresoDeSstt).HasColumnName("EGRESO DE SSTT");

                entity.Property(e => e.EnPausa)
                    .HasMaxLength(255)
                    .HasColumnName("EN PAUSA");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.EstadoAfip)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO AFIP");

                entity.Property(e => e.EstadoRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO RENTAS");

                entity.Property(e => e.Exento)
                    .HasMaxLength(255)
                    .HasColumnName("EXENTO");

                entity.Property(e => e.FechaDeAlta)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE ALTA");

                entity.Property(e => e.FechaDeBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE BAJA");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de carga ABM");

                entity.Property(e => e.FechaDeFinalizacionDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE FINALIZACION DE PAUSA");

                entity.Property(e => e.FechaDeInicioDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE INICIO DE PAUSA");

                entity.Property(e => e.FechaDeModificacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de Modificacion");

                entity.Property(e => e.FechaSsttMes)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA SSTT MES");

                entity.Property(e => e.IngresoASstt)
                    .HasColumnType("datetime")
                    .HasColumnName("INGRESO A SSTT");

                entity.Property(e => e.LargoCbu).HasColumnName("LARGO CBU");

                entity.Property(e => e.Legajo).HasColumnName("LEGAJO");

                entity.Property(e => e.LetraCbu)
                    .HasMaxLength(255)
                    .HasColumnName("LETRA CBU");

                entity.Property(e => e.LinkDePago)
                    .HasMaxLength(255)
                    .HasColumnName("LINK DE PAGO");

                entity.Property(e => e.Localidad).HasMaxLength(255);

                entity.Property(e => e.Mail)
                    .HasMaxLength(255)
                    .HasColumnName("MAIL");

                entity.Property(e => e.MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT");

                entity.Property(e => e.NDeComercio).HasColumnName("N° DE COMERCIO");

                entity.Property(e => e.NDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE CUENTA");

                entity.Property(e => e.NDeTerminal).HasColumnName("N° DE TERMINAL");

                entity.Property(e => e.NombreDeFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DE FANTASIA");

                entity.Property(e => e.NombreDelAsesor)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DEL ASESOR");

                entity.Property(e => e.NroLocal).HasColumnName("Nro# Local");

                entity.Property(e => e.Observacion)
                    .HasMaxLength(255)
                    .HasColumnName("OBSERVACION");

                entity.Property(e => e.OrigenDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("ORIGEN DE LA TERMINAL");

                entity.Property(e => e.ParaInforme)
                    .HasMaxLength(255)
                    .HasColumnName("PARA INFORME");

                entity.Property(e => e.ProgramacionBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("PROGRAMACION BAJA");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Provincia3)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA3");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("RAZON SOCIAL");

                entity.Property(e => e.ReUbicacion)
                    .HasMaxLength(255)
                    .HasColumnName("RE UBICACION");

                entity.Property(e => e.Rubro)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO");

                entity.Property(e => e.RubroSecundario)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO SECUNDARIO");

                entity.Property(e => e.SasMutual)
                    .HasMaxLength(255)
                    .HasColumnName("SAS/MUTUAL");

                entity.Property(e => e.Telefono).HasColumnName("TELEFONO");

                entity.Property(e => e.TipoDeBaja)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE BAJA");

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE CUENTA");

                entity.Property(e => e.Titular)
                    .HasMaxLength(255)
                    .HasColumnName("TITULAR");

                entity.Property(e => e._2EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° EGRESO DE SSTT");

                entity.Property(e => e._2IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° INGRESO A SSTT");

                entity.Property(e => e._2MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° MOTIVO SSTT");
            });

            modelBuilder.Entity<AltasCrudo>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Altas_crudo");

                entity.Property(e => e.AbmObservacionesDeCarga)
                    .HasMaxLength(255)
                    .HasColumnName("ABM OBSERVACIONES DE CARGA");

                entity.Property(e => e.Actividad)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD");

                entity.Property(e => e.Actividad2)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD2");

                entity.Property(e => e.ActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD RENTAS");

                entity.Property(e => e.Alias)
                    .HasMaxLength(255)
                    .HasColumnName("ALIAS");

                entity.Property(e => e.Alicuota).HasColumnName("ALICUOTA");

                entity.Property(e => e.AltaAhora12)
                    .HasMaxLength(255)
                    .HasColumnName("ALTA AHORA 12");

                entity.Property(e => e.Altas)
                    .HasMaxLength(255)
                    .HasColumnName("ALTAS");

                entity.Property(e => e.AutorizadoPorTitular)
                    .HasMaxLength(255)
                    .HasColumnName("AUTORIZADO POR TITULAR");

                entity.Property(e => e.Backup)
                    .HasMaxLength(255)
                    .HasColumnName("BACKUP");

                entity.Property(e => e.Baja)
                    .HasMaxLength(255)
                    .HasColumnName("BAJA");

                entity.Property(e => e.Banco)
                    .HasMaxLength(255)
                    .HasColumnName("BANCO");

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad).HasColumnName("COD# ACTIVIDAD");

                entity.Property(e => e.CodActividadRentas).HasColumnName("COD# ACTIVIDAD RENTAS");

                entity.Property(e => e.CodigoPostal).HasColumnName("Codigo Postal");

                entity.Property(e => e.CuitCuil).HasColumnName("CUIT/CUIL");

                entity.Property(e => e.CuitRazonSocial).HasColumnName("CUIT RAZON SOCIAL");

                entity.Property(e => e.DestinoDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("DESTINO DE LA TERMINAL");

                entity.Property(e => e.DiasParaAlta)
                    .HasMaxLength(255)
                    .HasColumnName("Dias para alta");

                entity.Property(e => e.DiasSinAltaDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("Dias sin alta de terminal");

                entity.Property(e => e.Domicilio)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO");

                entity.Property(e => e.DomicilioFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO FISCAL");

                entity.Property(e => e.EgresoDeSstt).HasColumnName("EGRESO DE SSTT");

                entity.Property(e => e.EnPausa)
                    .HasMaxLength(255)
                    .HasColumnName("EN PAUSA");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.EstadoAfip)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO AFIP");

                entity.Property(e => e.EstadoRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO RENTAS");

                entity.Property(e => e.Exento)
                    .HasMaxLength(255)
                    .HasColumnName("EXENTO");

                entity.Property(e => e.FechaDeAlta)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE ALTA");

                entity.Property(e => e.FechaDeBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE BAJA");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de carga ABM");

                entity.Property(e => e.FechaDeFinalizacionDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE FINALIZACION DE PAUSA");

                entity.Property(e => e.FechaDeInicioDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE INICIO DE PAUSA");

                entity.Property(e => e.FechaDeModificacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de Modificacion");

                entity.Property(e => e.FechaSsttMes)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA SSTT MES");

                entity.Property(e => e.IngresoASstt)
                    .HasColumnType("datetime")
                    .HasColumnName("INGRESO A SSTT");

                entity.Property(e => e.LargoCbu).HasColumnName("LARGO CBU");

                entity.Property(e => e.Legajo).HasColumnName("LEGAJO");

                entity.Property(e => e.LetraCbu)
                    .HasMaxLength(255)
                    .HasColumnName("LETRA CBU");

                entity.Property(e => e.LinkDePago)
                    .HasMaxLength(255)
                    .HasColumnName("LINK DE PAGO");

                entity.Property(e => e.Localidad).HasMaxLength(255);

                entity.Property(e => e.Mail)
                    .HasMaxLength(255)
                    .HasColumnName("MAIL");

                entity.Property(e => e.MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT");

                entity.Property(e => e.NDeComercio).HasColumnName("N° DE COMERCIO");

                entity.Property(e => e.NDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE CUENTA");

                entity.Property(e => e.NDeTerminal).HasColumnName("N° DE TERMINAL");

                entity.Property(e => e.NombreDeFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DE FANTASIA");

                entity.Property(e => e.NombreDelAsesor)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DEL ASESOR");

                entity.Property(e => e.NroLocal).HasColumnName("Nro# Local");

                entity.Property(e => e.Observacion)
                    .HasMaxLength(255)
                    .HasColumnName("OBSERVACION");

                entity.Property(e => e.OrigenDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("ORIGEN DE LA TERMINAL");

                entity.Property(e => e.ParaInforme)
                    .HasMaxLength(255)
                    .HasColumnName("PARA INFORME");

                entity.Property(e => e.ProgramacionBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("PROGRAMACION BAJA");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Provincia3)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA3");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("RAZON SOCIAL");

                entity.Property(e => e.ReUbicacion)
                    .HasMaxLength(255)
                    .HasColumnName("RE UBICACION");

                entity.Property(e => e.Rubro)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO");

                entity.Property(e => e.RubroSecundario)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO SECUNDARIO");

                entity.Property(e => e.SasMutual)
                    .HasMaxLength(255)
                    .HasColumnName("SAS/MUTUAL");

                entity.Property(e => e.Telefono).HasColumnName("TELEFONO");

                entity.Property(e => e.TipoDeBaja)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE BAJA");

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE CUENTA");

                entity.Property(e => e.Titular)
                    .HasMaxLength(255)
                    .HasColumnName("TITULAR");

                entity.Property(e => e._2EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° EGRESO DE SSTT");

                entity.Property(e => e._2IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° INGRESO A SSTT");

                entity.Property(e => e._2MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° MOTIVO SSTT");
            });

            modelBuilder.Entity<Analisi>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Analisis");

                entity.Property(e => e.Asesor).HasMaxLength(255);

                entity.Property(e => e.Credito)
                    .HasColumnType("money")
                    .HasColumnName("credito ");

                entity.Property(e => e.Debito)
                    .HasColumnType("money")
                    .HasColumnName("Debito ");

                entity.Property(e => e.FaltaVisita)
                    .HasColumnType("money")
                    .HasColumnName("Falta visita ");

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.Terminal1).HasColumnType("money");

                entity.Property(e => e.Total).HasColumnType("money");

                entity.Property(e => e._1pago)
                    .HasColumnType("money")
                    .HasColumnName("1pago ");
            });

            modelBuilder.Entity<Aptitud>(entity =>
            {
                entity.ToTable("Aptitud");

                entity.Property(e => e.Aptitud1).HasColumnName("Aptitud");

                entity.HasOne(d => d.IdEducacionNavigation)
                    .WithMany(p => p.Aptituds)
                    .HasForeignKey(d => d.IdEducacion)
                    .HasConstraintName("FK_Aptitud_Educacion");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.Aptituds)
                    .HasForeignKey(d => d.IdPostulante)
                    .HasConstraintName("FK_Aptitud_Postulante");
            });

            modelBuilder.Entity<Baja>(entity =>
            {
                entity.ToTable("bajas");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AbmObservacionesDeCarga)
                    .HasMaxLength(255)
                    .HasColumnName("ABM OBSERVACIONES DE CARGA");

                entity.Property(e => e.Actividad)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD");

                entity.Property(e => e.Actividad2)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD2");

                entity.Property(e => e.ActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD RENTAS");

                entity.Property(e => e.Alias)
                    .HasMaxLength(255)
                    .HasColumnName("ALIAS");

                entity.Property(e => e.Alicuota).HasColumnName("ALICUOTA");

                entity.Property(e => e.AltaAhora12)
                    .HasMaxLength(255)
                    .HasColumnName("ALTA AHORA 12");

                entity.Property(e => e.Altas)
                    .HasMaxLength(255)
                    .HasColumnName("ALTAS");

                entity.Property(e => e.AutorizadoPorTitular)
                    .HasMaxLength(255)
                    .HasColumnName("AUTORIZADO POR TITULAR");

                entity.Property(e => e.Backup)
                    .HasMaxLength(255)
                    .HasColumnName("BACKUP");

                entity.Property(e => e.Baja1)
                    .HasMaxLength(255)
                    .HasColumnName("BAJA");

                entity.Property(e => e.Banco)
                    .HasMaxLength(255)
                    .HasColumnName("BANCO");

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad)
                    .HasMaxLength(255)
                    .HasColumnName("COD# ACTIVIDAD");

                entity.Property(e => e.CodActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("COD# ACTIVIDAD RENTAS");

                entity.Property(e => e.CodigoPostal)
                    .HasMaxLength(255)
                    .HasColumnName("Codigo Postal");

                entity.Property(e => e.CuitCuil).HasColumnName("CUIT/CUIL");

                entity.Property(e => e.CuitRazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("CUIT RAZON SOCIAL");

                entity.Property(e => e.DestinoDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("DESTINO DE LA TERMINAL");

                entity.Property(e => e.DiasParaAlta).HasColumnName("Dias para alta");

                entity.Property(e => e.DiasSinAltaDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("Dias sin alta de terminal");

                entity.Property(e => e.Domicilio)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO");

                entity.Property(e => e.DomicilioFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO FISCAL");

                entity.Property(e => e.EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("EGRESO DE SSTT");

                entity.Property(e => e.EnPausa)
                    .HasMaxLength(255)
                    .HasColumnName("EN PAUSA");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.EstadoAfip)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO AFIP");

                entity.Property(e => e.EstadoRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO RENTAS");

                entity.Property(e => e.Exento)
                    .HasMaxLength(255)
                    .HasColumnName("EXENTO");

                entity.Property(e => e.FechaDeAlta)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE ALTA");

                entity.Property(e => e.FechaDeBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE BAJA");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de carga ABM");

                entity.Property(e => e.FechaDeFinalizacionDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE FINALIZACION DE PAUSA");

                entity.Property(e => e.FechaDeInicioDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE INICIO DE PAUSA");

                entity.Property(e => e.FechaDeModificacion)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de Modificacion");

                entity.Property(e => e.FechaSsttMes)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA SSTT MES");

                entity.Property(e => e.IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("INGRESO A SSTT");

                entity.Property(e => e.LargoCbu).HasColumnName("LARGO CBU");

                entity.Property(e => e.Legajo).HasColumnName("LEGAJO");

                entity.Property(e => e.LetraCbu)
                    .HasMaxLength(255)
                    .HasColumnName("LETRA CBU");

                entity.Property(e => e.LinkDePago)
                    .HasMaxLength(255)
                    .HasColumnName("LINK DE PAGO");

                entity.Property(e => e.Localidad).HasMaxLength(255);

                entity.Property(e => e.Mail)
                    .HasMaxLength(255)
                    .HasColumnName("MAIL");

                entity.Property(e => e.MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT");

                entity.Property(e => e.NDeComercio).HasColumnName("N° DE COMERCIO");

                entity.Property(e => e.NDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE CUENTA");

                entity.Property(e => e.NDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE TERMINAL");

                entity.Property(e => e.NombreDeFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DE FANTASIA");

                entity.Property(e => e.NombreDelAsesor)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DEL ASESOR");

                entity.Property(e => e.NroLocal).HasColumnName("Nro# Local");

                entity.Property(e => e.Observacion)
                    .HasMaxLength(255)
                    .HasColumnName("OBSERVACION");

                entity.Property(e => e.OrigenDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("ORIGEN DE LA TERMINAL");

                entity.Property(e => e.ParaInforme)
                    .HasMaxLength(255)
                    .HasColumnName("PARA INFORME");

                entity.Property(e => e.ProgramacionBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("PROGRAMACION BAJA");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Provincia3)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA3");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("RAZON SOCIAL");

                entity.Property(e => e.ReUbicacion)
                    .HasMaxLength(255)
                    .HasColumnName("RE UBICACION");

                entity.Property(e => e.Rubro)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO");

                entity.Property(e => e.RubroSecundario)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO SECUNDARIO");

                entity.Property(e => e.SasMutual)
                    .HasMaxLength(255)
                    .HasColumnName("SAS/MUTUAL");

                entity.Property(e => e.Telefono).HasColumnName("TELEFONO");

                entity.Property(e => e.TipoDeBaja)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE BAJA");

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE CUENTA");

                entity.Property(e => e.Titular)
                    .HasMaxLength(255)
                    .HasColumnName("TITULAR");

                entity.Property(e => e._2EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° EGRESO DE SSTT");

                entity.Property(e => e._2IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° INGRESO A SSTT");

                entity.Property(e => e._2MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° MOTIVO SSTT");
            });

            modelBuilder.Entity<BajasCrudo>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("Bajas_crudo");

                entity.Property(e => e.AbmObservacionesDeCarga)
                    .HasMaxLength(255)
                    .HasColumnName("ABM OBSERVACIONES DE CARGA");

                entity.Property(e => e.Actividad)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD");

                entity.Property(e => e.Actividad2)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD2");

                entity.Property(e => e.ActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ACTIVIDAD RENTAS");

                entity.Property(e => e.Alias)
                    .HasMaxLength(255)
                    .HasColumnName("ALIAS");

                entity.Property(e => e.Alicuota).HasColumnName("ALICUOTA");

                entity.Property(e => e.AltaAhora12)
                    .HasMaxLength(255)
                    .HasColumnName("ALTA AHORA 12");

                entity.Property(e => e.Altas)
                    .HasMaxLength(255)
                    .HasColumnName("ALTAS");

                entity.Property(e => e.AutorizadoPorTitular)
                    .HasMaxLength(255)
                    .HasColumnName("AUTORIZADO POR TITULAR");

                entity.Property(e => e.Backup)
                    .HasMaxLength(255)
                    .HasColumnName("BACKUP");

                entity.Property(e => e.Baja)
                    .HasMaxLength(255)
                    .HasColumnName("BAJA");

                entity.Property(e => e.Banco)
                    .HasMaxLength(255)
                    .HasColumnName("BANCO");

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad)
                    .HasMaxLength(255)
                    .HasColumnName("COD# ACTIVIDAD");

                entity.Property(e => e.CodActividadRentas)
                    .HasMaxLength(255)
                    .HasColumnName("COD# ACTIVIDAD RENTAS");

                entity.Property(e => e.CodigoPostal)
                    .HasMaxLength(255)
                    .HasColumnName("Codigo Postal");

                entity.Property(e => e.CuitCuil).HasColumnName("CUIT/CUIL");

                entity.Property(e => e.CuitRazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("CUIT RAZON SOCIAL");

                entity.Property(e => e.DestinoDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("DESTINO DE LA TERMINAL");

                entity.Property(e => e.DiasParaAlta).HasColumnName("Dias para alta");

                entity.Property(e => e.DiasSinAltaDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("Dias sin alta de terminal");

                entity.Property(e => e.Domicilio)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO");

                entity.Property(e => e.DomicilioFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("DOMICILIO FISCAL");

                entity.Property(e => e.EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("EGRESO DE SSTT");

                entity.Property(e => e.EnPausa)
                    .HasMaxLength(255)
                    .HasColumnName("EN PAUSA");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.EstadoAfip)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO AFIP");

                entity.Property(e => e.EstadoRentas)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO RENTAS");

                entity.Property(e => e.Exento)
                    .HasMaxLength(255)
                    .HasColumnName("EXENTO");

                entity.Property(e => e.FechaDeAlta)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE ALTA");

                entity.Property(e => e.FechaDeBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE BAJA");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de carga ABM");

                entity.Property(e => e.FechaDeFinalizacionDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE FINALIZACION DE PAUSA");

                entity.Property(e => e.FechaDeInicioDePausa)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE INICIO DE PAUSA");

                entity.Property(e => e.FechaDeModificacion)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de Modificacion");

                entity.Property(e => e.FechaSsttMes)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA SSTT MES");

                entity.Property(e => e.IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("INGRESO A SSTT");

                entity.Property(e => e.LargoCbu).HasColumnName("LARGO CBU");

                entity.Property(e => e.Legajo).HasColumnName("LEGAJO");

                entity.Property(e => e.LetraCbu)
                    .HasMaxLength(255)
                    .HasColumnName("LETRA CBU");

                entity.Property(e => e.LinkDePago)
                    .HasMaxLength(255)
                    .HasColumnName("LINK DE PAGO");

                entity.Property(e => e.Localidad).HasMaxLength(255);

                entity.Property(e => e.Mail)
                    .HasMaxLength(255)
                    .HasColumnName("MAIL");

                entity.Property(e => e.MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT");

                entity.Property(e => e.NDeComercio).HasColumnName("N° DE COMERCIO");

                entity.Property(e => e.NDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE CUENTA");

                entity.Property(e => e.NDeTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("N° DE TERMINAL");

                entity.Property(e => e.NombreDeFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DE FANTASIA");

                entity.Property(e => e.NombreDelAsesor)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DEL ASESOR");

                entity.Property(e => e.NroLocal).HasColumnName("Nro# Local");

                entity.Property(e => e.Observacion)
                    .HasMaxLength(255)
                    .HasColumnName("OBSERVACION");

                entity.Property(e => e.OrigenDeLaTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("ORIGEN DE LA TERMINAL");

                entity.Property(e => e.ParaInforme)
                    .HasMaxLength(255)
                    .HasColumnName("PARA INFORME");

                entity.Property(e => e.ProgramacionBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("PROGRAMACION BAJA");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Provincia3)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA3");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("RAZON SOCIAL");

                entity.Property(e => e.ReUbicacion)
                    .HasMaxLength(255)
                    .HasColumnName("RE UBICACION");

                entity.Property(e => e.Rubro)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO");

                entity.Property(e => e.RubroSecundario)
                    .HasMaxLength(255)
                    .HasColumnName("RUBRO SECUNDARIO");

                entity.Property(e => e.SasMutual)
                    .HasMaxLength(255)
                    .HasColumnName("SAS/MUTUAL");

                entity.Property(e => e.Telefono).HasColumnName("TELEFONO");

                entity.Property(e => e.TipoDeBaja)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE BAJA");

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("TIPO DE CUENTA");

                entity.Property(e => e.Titular)
                    .HasMaxLength(255)
                    .HasColumnName("TITULAR");

                entity.Property(e => e._2EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° EGRESO DE SSTT");

                entity.Property(e => e._2IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° INGRESO A SSTT");

                entity.Property(e => e._2MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("2° MOTIVO SSTT");
            });

            modelBuilder.Entity<Banco>(entity =>
            {
                entity.HasKey(e => e.CodBanco)
                    .HasName("PK__banco__526BA585294E60A9");

                entity.ToTable("banco");

                entity.Property(e => e.CodBanco).HasColumnName("codBanco");

                entity.Property(e => e.NomBanco)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("nomBanco");
            });

            modelBuilder.Entity<BaseCuota>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("base_cuotas");

                entity.Property(e => e.AñoPago).HasColumnName("Año_Pago");

                entity.Property(e => e.CodigoPosnet)
                    .HasMaxLength(255)
                    .HasColumnName("codigo posnet");

                entity.Property(e => e.Cuit).HasColumnName("CUIT");

                entity.Property(e => e.MesPago).HasColumnName("Mes_Pago");

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.SemanaMesPago).HasColumnName("semana_mes_pago");

                entity.Property(e => e.TotalBruto)
                    .HasColumnType("money")
                    .HasColumnName("total_bruto");
            });

            modelBuilder.Entity<BaseDashboarHistorico>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("base_dashboar_historico");

                entity.Property(e => e.Alias).HasMaxLength(255);

                entity.Property(e => e.Arancel).HasColumnType("money");

                entity.Property(e => e.AsesorAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Asesor ABM");

                entity.Property(e => e.AñoOp).HasColumnName("Año_op");

                entity.Property(e => e.AñoPago).HasColumnName("Año_Pago");

                entity.Property(e => e.Banco).HasMaxLength(255);

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad).HasColumnName("Cod. Actividad");

                entity.Property(e => e.ComercioParticipante)
                    .HasMaxLength(255)
                    .HasColumnName("Comercio Participante");

                entity.Property(e => e.ComisionConIva).HasColumnName("% Comision con IVA");

                entity.Property(e => e.CondicionFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("Condicion Fiscal");

                entity.Property(e => e.CostoFinanciero).HasColumnName("Costo Financiero");

                entity.Property(e => e.CostoFinancieroEn)
                    .HasColumnType("money")
                    .HasColumnName("Costo Financiero en $");

                entity.Property(e => e.CostoPorAnticipo)
                    .HasColumnType("money")
                    .HasColumnName("Costo por anticipo");

                entity.Property(e => e.CuentaBancaria)
                    .HasMaxLength(255)
                    .HasColumnName("Cuenta Bancaria");

                entity.Property(e => e.Cuit).HasColumnName("CUIT");

                entity.Property(e => e.DiaSemana)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .HasColumnName("dia_semana");

                entity.Property(e => e.EntidadPagadora)
                    .HasMaxLength(255)
                    .HasColumnName("Entidad Pagadora");

                entity.Property(e => e.Estado).HasMaxLength(255);

                entity.Property(e => e.FechaAltaComercio).HasColumnName("Fecha Alta comercio");

                entity.Property(e => e.FechaDePago)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de Pago");

                entity.Property(e => e.FechaDePresentacion)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de Presentacion");

                entity.Property(e => e.FechaOperacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha Operacion");

                entity.Property(e => e.ImpuestoDebitoCredito)
                    .HasColumnType("money")
                    .HasColumnName("IMPUESTO DEBITO/CREDITO");

                entity.Property(e => e.Iva21)
                    .HasColumnType("money")
                    .HasColumnName("IVA 21%");

                entity.Property(e => e.MesOp).HasColumnName("Mes_op");

                entity.Property(e => e.MesPago).HasColumnName("Mes_Pago");

                entity.Property(e => e.Moneda).HasMaxLength(255);

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.NroDeAutorizacion).HasColumnName("Nro# de Autorizacion");

                entity.Property(e => e.NroDeComercio).HasColumnName("Nro# de Comercio");

                entity.Property(e => e.NroDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("Nro de cuenta");

                entity.Property(e => e.NroDeCupon)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# de Cupon");

                entity.Property(e => e.NroDeLote)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# de Lote");

                entity.Property(e => e.NroDeTarjeta).HasColumnName("Nro# de Tarjeta");

                entity.Property(e => e.NroLiquidacion)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# Liquidacion");

                entity.Property(e => e.PromocionPlan)
                    .HasMaxLength(255)
                    .HasColumnName("Promocion Plan");

                entity.Property(e => e.Provincia).HasMaxLength(255);

                entity.Property(e => e.ProvinciaAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Provincia ABM");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("Razon Social");

                entity.Property(e => e.Retencion)
                    .HasMaxLength(255)
                    .HasColumnName("RETENCION");

                entity.Property(e => e.RetencionGanacia)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Ganacia");

                entity.Property(e => e.RetencionImpositiva)
                    .HasColumnType("money")
                    .HasColumnName("Retencion impositiva");

                entity.Property(e => e.RetencionIva)
                    .HasColumnType("money")
                    .HasColumnName("Retencion IVA");

                entity.Property(e => e.RetencionMunicipal)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Municipal");

                entity.Property(e => e.RetencionProvincial)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Provincial");

                entity.Property(e => e.Rubro).HasMaxLength(255);

                entity.Property(e => e.SemanaMesOp).HasColumnName("semana_mes_op");

                entity.Property(e => e.SemanaMesPago).HasColumnName("semana_mes_pago");

                entity.Property(e => e.Tarjeta).HasMaxLength(255);

                entity.Property(e => e.TarjetaTipo)
                    .HasMaxLength(255)
                    .HasColumnName("Tarjeta-Tipo");

                entity.Property(e => e.TipoDeCredito)
                    .HasMaxLength(7)
                    .IsUnicode(false)
                    .HasColumnName("TIPO DE CREDITO");

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de cuenta");

                entity.Property(e => e.TipoDeFinanciacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Financiacion");

                entity.Property(e => e.TipoDeLiquidacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Liquidacion");

                entity.Property(e => e.TipoDeOperacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Operacion");

                entity.Property(e => e.TipoFinanciacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo_Financiacion");

                entity.Property(e => e.TotalBruto)
                    .HasColumnType("money")
                    .HasColumnName("Total Bruto");

                entity.Property(e => e.TotalConDescuentos)
                    .HasColumnType("money")
                    .HasColumnName("Total Con descuentos");

                entity.Property(e => e.TotalDescuento)
                    .HasColumnType("money")
                    .HasColumnName("Total Descuento");

                entity.Property(e => e.TotalNeto)
                    .HasColumnType("money")
                    .HasColumnName("Total Neto");
            });

            modelBuilder.Entity<BaseDashboard>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("base_dashboard");

                entity.HasIndex(e => e.FechaDePago, "IX_base_dashboard");

                entity.HasIndex(e => e.Cuit, "IX_base_dashboard_1");

                entity.Property(e => e.Alias).HasMaxLength(255);

                entity.Property(e => e.Anticipo)
                    .HasMaxLength(255)
                    .HasColumnName("anticipo%");

                entity.Property(e => e.Arancel).HasColumnType("money");

                entity.Property(e => e.ArancelFiserv)
                    .HasColumnType("money")
                    .HasColumnName("Arancel Fiserv");

                entity.Property(e => e.AsesorAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Asesor ABM");

                entity.Property(e => e.AñoOp)
                    .HasColumnName("Año_op")
                    .HasComputedColumnSql("(datepart(year,[Fecha Operacion]))", false);

                entity.Property(e => e.AñoPago)
                    .HasColumnName("Año_Pago")
                    .HasComputedColumnSql("(datepart(year,[Fecha de Pago]))", false);

                entity.Property(e => e.Banco).HasMaxLength(255);

                entity.Property(e => e.Bonificacion)
                    .HasMaxLength(255)
                    .HasColumnName("BONIFICACION");

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(255)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad).HasColumnName("Cod. Actividad");

                entity.Property(e => e.CodActividadRentas).HasColumnName("COD# ACTIVIDAD RENTAS");

                entity.Property(e => e.CodigoPostal).HasColumnName("Codigo Postal");

                entity.Property(e => e.ComercioParticipante)
                    .HasMaxLength(255)
                    .HasColumnName("Comercio Participante");

                entity.Property(e => e.ComisionConIva).HasColumnName("% Comision con IVA");

                entity.Property(e => e.CondicionFiscal)
                    .HasMaxLength(255)
                    .HasColumnName("Condicion Fiscal");

                entity.Property(e => e.CostoFinanciero).HasColumnName("Costo Financiero");

                entity.Property(e => e.CostoFinancieroEn)
                    .HasColumnType("money")
                    .HasColumnName("Costo Financiero en $");

                entity.Property(e => e.CostoPorAnticipo)
                    .HasColumnType("money")
                    .HasColumnName("Costo por anticipo");

                entity.Property(e => e.CuentaBancaria)
                    .HasMaxLength(255)
                    .HasColumnName("Cuenta Bancaria");

                entity.Property(e => e.Cuit).HasColumnName("CUIT");

                entity.Property(e => e.DebitoCredito)
                    .HasMaxLength(255)
                    .HasColumnName("Debito/credito");

                entity.Property(e => e.DiaSemana)
                    .HasMaxLength(9)
                    .IsUnicode(false)
                    .HasColumnName("dia_semana")
                    .HasComputedColumnSql("(case datename(weekday,[Fecha Operacion]) when 'Sunday' then 'Domingo' when 'Monday' then 'Lunes' when 'Tuesday' then 'Martes' when 'Wednesday' then 'Miércoles' when 'Thursday' then 'Jueves' when 'Friday' then 'Viernes' when 'Saturday' then 'Sábado'  end)", false);

                entity.Property(e => e.DiasHabiles).HasColumnName("dias habiles");

                entity.Property(e => e.EntidadPagadora)
                    .HasMaxLength(255)
                    .HasColumnName("Entidad Pagadora");

                entity.Property(e => e.Estado).HasMaxLength(255);

                entity.Property(e => e.Fecha)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha");

                entity.Property(e => e.Fecha2)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA2");

                entity.Property(e => e.FechaAltaComercio).HasColumnName("Fecha Alta comercio");

                entity.Property(e => e.FechaDePago)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de Pago");

                entity.Property(e => e.FechaDePresentacion)
                    .HasMaxLength(255)
                    .HasColumnName("Fecha de Presentacion");

                entity.Property(e => e.FechaInicio)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha inicio");

                entity.Property(e => e.FechaOp)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha OP");

                entity.Property(e => e.FechaOperacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha Operacion");

                entity.Property(e => e.FechaTasaPreferencial)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha tasa preferencial");

                entity.Property(e => e.FormulaAnticipo)
                    .HasColumnType("money")
                    .HasColumnName("Formula anticipo");

                entity.Property(e => e.Ganancia).HasColumnName("ganancia");

                entity.Property(e => e.ImpuestoDebitoCredito)
                    .HasColumnType("money")
                    .HasColumnName("IMPUESTO DEBITO/CREDITO");

                entity.Property(e => e.Iva21)
                    .HasColumnType("money")
                    .HasColumnName("IVA 21%");

                entity.Property(e => e.MesOp)
                    .HasColumnName("Mes_op")
                    .HasComputedColumnSql("(datepart(month,[Fecha Operacion]))", false);

                entity.Property(e => e.MesPago)
                    .HasColumnName("Mes_Pago")
                    .HasComputedColumnSql("(datepart(month,[Fecha de Pago]))", false);

                entity.Property(e => e.Moneda).HasMaxLength(255);

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.NroDeAutorizacion).HasColumnName("Nro# de Autorizacion");

                entity.Property(e => e.NroDeComercio).HasColumnName("Nro# de Comercio");

                entity.Property(e => e.NroDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("Nro de cuenta");

                entity.Property(e => e.NroDeCupon)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# de Cupon");

                entity.Property(e => e.NroDeLote)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# de Lote");

                entity.Property(e => e.NroDeTarjeta).HasColumnName("Nro# de Tarjeta");

                entity.Property(e => e.NroLiquidacion)
                    .HasMaxLength(255)
                    .HasColumnName("Nro# Liquidacion");

                entity.Property(e => e.PagoReal)
                    .HasMaxLength(255)
                    .HasColumnName("Pago Real");

                entity.Property(e => e.PromocionPlan)
                    .HasMaxLength(255)
                    .HasColumnName("Promocion Plan");

                entity.Property(e => e.Provincia).HasMaxLength(255);

                entity.Property(e => e.ProvinciaAbm)
                    .HasMaxLength(255)
                    .HasColumnName("Provincia ABM");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("Razon Social");

                entity.Property(e => e.Retencion)
                    .HasMaxLength(255)
                    .HasColumnName("RETENCION");

                entity.Property(e => e.RetencionGanacia)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Ganacia");

                entity.Property(e => e.RetencionImpositiva)
                    .HasColumnType("money")
                    .HasColumnName("Retencion impositiva");

                entity.Property(e => e.RetencionIva)
                    .HasColumnType("money")
                    .HasColumnName("Retencion IVA");

                entity.Property(e => e.RetencionMunicipal)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Municipal");

                entity.Property(e => e.RetencionProvincial)
                    .HasColumnType("money")
                    .HasColumnName("Retencion Provincial");

                entity.Property(e => e.Rubro).HasMaxLength(255);

                entity.Property(e => e.SemanaMesOp)
                    .HasColumnName("semana_mes_op")
                    .HasComputedColumnSql("((datepart(week,[Fecha Operacion])-datepart(week,dateadd(month,datediff(month,(0),[Fecha Operacion]),(0))))+(1))", false);

                entity.Property(e => e.SemanaMesPago)
                    .HasColumnName("semana_mes_pago")
                    .HasComputedColumnSql("((datepart(week,[Fecha de Pago])-datepart(week,dateadd(month,datediff(month,(0),[Fecha de Pago]),(0))))+(1))", false);

                entity.Property(e => e.Tarjeta).HasMaxLength(255);

                entity.Property(e => e.TarjetaTipo)
                    .HasMaxLength(255)
                    .HasColumnName("Tarjeta-Tipo");

                entity.Property(e => e.TasaPreferencial)
                    .HasMaxLength(255)
                    .HasColumnName("TASA_PREFERENCIAL");

                entity.Property(e => e.TipoDeCredito)
                    .HasMaxLength(7)
                    .IsUnicode(false)
                    .HasColumnName("TIPO DE CREDITO")
                    .HasComputedColumnSql("(case when [Cuotas]=(0) then 'Debito' when [Cuotas]=(1) then '1 Pago' else 'Credito' end)", false);

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de cuenta");

                entity.Property(e => e.TipoDeFinanciacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Financiacion");

                entity.Property(e => e.TipoDeLiquidacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Liquidacion");

                entity.Property(e => e.TipoDeOperacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo de Operacion");

                entity.Property(e => e.TipoFinanciacion)
                    .HasMaxLength(255)
                    .HasColumnName("Tipo_Financiacion")
                    .HasComputedColumnSql("(case when [Tipo de Financiacion]='1' then 'Debito' when [Tipo de Financiacion] IS NULL then 'Debito' when [Tipo de Financiacion]='' then 'Debito' when [Tipo de Financiacion]='0' then 'Debito' else [Tipo de Financiacion] end)", false);

                entity.Property(e => e.TotalBruto)
                    .HasColumnType("money")
                    .HasColumnName("Total Bruto");

                entity.Property(e => e.TotalConDescuentos)
                    .HasColumnType("money")
                    .HasColumnName("Total Con descuentos");

                entity.Property(e => e.TotalDescuento)
                    .HasColumnType("money")
                    .HasColumnName("Total Descuento");

                entity.Property(e => e.TotalNeto)
                    .HasColumnType("money")
                    .HasColumnName("Total Neto");
            });

            modelBuilder.Entity<BaseStock>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("BaseStock");

                entity.Property(e => e.Activacion).HasMaxLength(255);

                entity.Property(e => e.Asesor)
                    .HasMaxLength(255)
                    .HasColumnName("ASESOR");

                entity.Property(e => e.AuxAltaActiva).HasColumnName("Aux alta activa");

                entity.Property(e => e.AuxAltaNoActiva).HasColumnName("Aux alta no activa");

                entity.Property(e => e.AuxDiasDesdeElAlta).HasColumnName("Aux dias desde el alta");

                entity.Property(e => e.Backup)
                    .HasMaxLength(255)
                    .HasColumnName("BACKUP");

                entity.Property(e => e.Comercio)
                    .HasMaxLength(255)
                    .HasColumnName("COMERCIO");

                entity.Property(e => e.DeBajoAnalisis)
                    .HasColumnType("money")
                    .HasColumnName("<de $ bajo analisis");

                entity.Property(e => e.DeReubicar)
                    .HasColumnType("money")
                    .HasColumnName("<de $ reubicar");

                entity.Property(e => e.DecisionAbm)
                    .HasMaxLength(255)
                    .HasColumnName("DECISION ABM");

                entity.Property(e => e.DecisionTomada)
                    .HasMaxLength(255)
                    .HasColumnName("DECISION TOMADA");

                entity.Property(e => e.EgresoDeSstt)
                    .HasMaxLength(255)
                    .HasColumnName("EGRESO DE SSTT");

                entity.Property(e => e.EgresoDeSstt2)
                    .HasMaxLength(255)
                    .HasColumnName("EGRESO DE SSTT2");

                entity.Property(e => e.EnPausa)
                    .HasMaxLength(255)
                    .HasColumnName("En Pausa");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.Factura).HasMaxLength(255);

                entity.Property(e => e.FacturacionDelMesRazonSocial)
                    .HasColumnType("money")
                    .HasColumnName("Facturacion del mes razon social");

                entity.Property(e => e.FacturaciónMesEnCurso)
                    .HasColumnType("money")
                    .HasColumnName("FACTURACIÓN MES EN CURSO");

                entity.Property(e => e.FacturaciónMesPasado)
                    .HasColumnType("money")
                    .HasColumnName("FACTURACIÓN MES PASADO");

                entity.Property(e => e.FacturaciónMesPasado2)
                    .HasColumnType("money")
                    .HasColumnName("FACTURACIÓN MES PASADO2");

                entity.Property(e => e.FechaDeBaja)
                    .HasMaxLength(255)
                    .HasColumnName("FECHA DE BAJA");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de carga ABM");

                entity.Property(e => e.Feedback)
                    .HasMaxLength(255)
                    .HasColumnName("FEEDBACK");

                entity.Property(e => e.IngresoASstt)
                    .HasMaxLength(255)
                    .HasColumnName("INGRESO A SSTT");

                entity.Property(e => e.IngresoASstt2)
                    .HasMaxLength(255)
                    .HasColumnName("INGRESO A SSTT2");

                entity.Property(e => e.Jefe)
                    .HasMaxLength(255)
                    .HasColumnName("JEFE");

                entity.Property(e => e.MotivoSstt)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT");

                entity.Property(e => e.MotivoSstt3)
                    .HasMaxLength(255)
                    .HasColumnName("MOTIVO SSTT3");

                entity.Property(e => e.NDeTerminal).HasColumnName("N° DE TERMINAL");

                entity.Property(e => e.OrigenTerminal)
                    .HasMaxLength(255)
                    .HasColumnName("ORIGEN TERMINAL");

                entity.Property(e => e.ParaLlegarA10000).HasColumnName("para llegar a 10000");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(255)
                    .HasColumnName("RAZON SOCIAL");

                entity.Property(e => e.Rubro).HasMaxLength(255);

                entity.Property(e => e.Terminal).HasColumnName("TERMINAL");

                entity.Property(e => e.Terminal2).HasColumnName("TERMINAL2");

                entity.Property(e => e.TipoDeAlta)
                    .HasMaxLength(255)
                    .HasColumnName("tipo de Alta");
            });

            modelBuilder.Entity<Busqueda>(entity =>
            {
                entity.Property(e => e.Cantidad).HasMaxLength(500);

                entity.Property(e => e.CantidadDeSolicitantes).HasMaxLength(500);

                entity.Property(e => e.Contratados).HasMaxLength(500);

                entity.Property(e => e.Estado).HasMaxLength(500);

                entity.Property(e => e.FechaCierre).HasColumnType("date");

                entity.Property(e => e.FechaPuesto).HasColumnType("date");

                entity.Property(e => e.Finalistas).HasMaxLength(500);

                entity.Property(e => e.Nombre).HasMaxLength(500);

                entity.Property(e => e.Observaciones).HasMaxLength(500);

                entity.Property(e => e.Provincia).HasMaxLength(500);

                entity.Property(e => e.Puesto)
                    .HasMaxLength(500)
                    .IsFixedLength();

                entity.Property(e => e.Rechazados).HasMaxLength(500);

                entity.Property(e => e.Seleccionados).HasMaxLength(500);
            });

            modelBuilder.Entity<Califico>(entity =>
            {
                entity.ToTable("Califico");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Califico1).HasColumnName("Califico");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
            });

            modelBuilder.Entity<CalificoCom>(entity =>
            {
                entity.ToTable("CalificoCom");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Descripcion).HasMaxLength(500);

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.CalificoComs)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__CalificoC__Usuar__3D491139");
            });

            modelBuilder.Entity<CargosAnteriore>(entity =>
            {
                entity.Property(e => e.FechaFin).HasColumnType("datetime");

                entity.Property(e => e.FechaInicio).HasColumnType("datetime");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.CargosAnteriores)
                    .HasForeignKey(d => d.IdPostulante)
                    .HasConstraintName("FK_CargosAnteriores_Postulantes");
            });

            modelBuilder.Entity<CheckAsesore>(entity =>
            {
                entity.Property(e => e.FechaHora)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Latitud)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Tipo)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.CheckAsesores)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_LocalizacionUsuario_Usuarios");
            });

            modelBuilder.Entity<CheckAsesoresImagen>(entity =>
            {
                entity.ToTable("CheckAsesoresImagen");

                entity.Property(e => e.CantidadRollos).IsUnicode(false);

                entity.Property(e => e.FechaDevolucion).HasColumnType("datetime");

                entity.Property(e => e.FechaHora)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Latitud)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Local)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Longitud)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.Property(e => e.Observacion)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.ObservacionAdmin)
                    .HasMaxLength(500)
                    .IsUnicode(false);

                entity.Property(e => e.TiempoAudio).IsUnicode(false);

                entity.Property(e => e.Tipo)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.CheckAsesoresImagens)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_CheckAsesoresImagen_Usuarios");
            });

            modelBuilder.Entity<Clover>(entity =>
            {
                entity.ToTable("Clover");

                entity.Property(e => e.Fecha).HasColumnType("date");
            });

            modelBuilder.Entity<Comentario>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Comentario1).HasColumnName("comentario");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_creacion")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdComentarioPadre).HasColumnName("id_comentario_padre");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

                entity.Property(e => e.IdUsuarioRespuesta).HasColumnName("id_usuario_respuesta");

                entity.HasOne(d => d.IdComentarioPadreNavigation)
                    .WithMany(p => p.InverseIdComentarioPadreNavigation)
                    .HasForeignKey(d => d.IdComentarioPadre)
                    .HasConstraintName("FK_comentarios_comentario_padre");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.ComentarioIdUsuarioNavigations)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK_comentarios_usuario");

                entity.HasOne(d => d.IdUsuarioRespuestaNavigation)
                    .WithMany(p => p.ComentarioIdUsuarioRespuestaNavigations)
                    .HasForeignKey(d => d.IdUsuarioRespuesta)
                    .HasConstraintName("FK_comentarios_usuario_respuesta");
            });

            modelBuilder.Entity<Comercio>(entity =>
            {
                entity.ToTable("comercios");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.NumComercio).HasColumnName("numComercio");
            });

            modelBuilder.Entity<CompMensual>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("comp_mensual");

                entity.Property(e => e.AñoPago).HasColumnName("Año_Pago");

                entity.Property(e => e.Cuit).HasColumnName("CUIT");

                entity.Property(e => e.Dia)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("dia");

                entity.Property(e => e.Mes)
                    .HasMaxLength(30)
                    .HasColumnName("mes");

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.TotalBruto)
                    .HasColumnType("money")
                    .HasColumnName("Total Bruto");
            });

            modelBuilder.Entity<ConstPreEstablecida>(entity =>
            {
                entity.HasKey(e => e.IdConst)
                    .HasName("PK__ConstPre__51CA993304F1D064");

                entity.Property(e => e.IdConst).HasColumnName("idConst");

                entity.Property(e => e.Clave)
                    .HasMaxLength(20)
                    .HasColumnName("clave");

                entity.Property(e => e.Password).HasColumnName("password");
            });

            modelBuilder.Entity<Contratado>(entity =>
            {
                entity.Property(e => e.Cv).HasColumnName("CV");

                entity.Property(e => e.Direccion).HasMaxLength(500);

                entity.Property(e => e.Dni)
                    .HasMaxLength(500)
                    .HasColumnName("DNI");

                entity.Property(e => e.Edad).HasMaxLength(500);

                entity.Property(e => e.Email).HasMaxLength(500);

                entity.Property(e => e.Estado).HasMaxLength(500);

                entity.Property(e => e.FechaDeCierre).HasColumnType("date");

                entity.Property(e => e.FechaDeContratacion).HasColumnType("date");

                entity.Property(e => e.FechaEntrevista).HasColumnType("date");

                entity.Property(e => e.Nombre).HasMaxLength(500);

                entity.Property(e => e.Observacion).HasMaxLength(500);

                entity.Property(e => e.Puesto).HasMaxLength(500);

                entity.Property(e => e.TipoDeContratacion).HasMaxLength(500);

                entity.HasOne(d => d.Busqueda)
                    .WithMany(p => p.ContratadosNavigation)
                    .HasForeignKey(d => d.BusquedaId)
                    .HasConstraintName("FK__Contratad__Busqu__611C5D5B");
            });

            modelBuilder.Entity<CrudoReport>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("crudo_report");

                entity.Property(e => e.ComercioParticipante)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Comercio_Participante");

                entity.Property(e => e.CuentaBancaria)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Cuenta_Bancaria");

                entity.Property(e => e.EntidadPagadora)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Entidad_Pagadora");

                entity.Property(e => e.Estado)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.FechaDePago)
                    .HasColumnType("date")
                    .HasColumnName("Fecha_de_Pago");

                entity.Property(e => e.FechaDePresentacion)
                    .HasColumnType("date")
                    .HasColumnName("Fecha_de_Presentacion");

                entity.Property(e => e.FechaOperacion)
                    .HasColumnType("date")
                    .HasColumnName("Fecha_Operacion");

                entity.Property(e => e.Moneda)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.NroDeAutorizacion).HasColumnName("Nro_de_Autorizacion");

                entity.Property(e => e.NroDeComercio).HasColumnName("Nro_de_Comercio");

                entity.Property(e => e.NroDeCupon).HasColumnName("Nro_de_Cupon");

                entity.Property(e => e.NroDeLote).HasColumnName("Nro_de_Lote");

                entity.Property(e => e.NroDeTarjeta).HasColumnName("Nro_de_Tarjeta");

                entity.Property(e => e.NroLiquidacion).HasColumnName("Nro_Liquidacion");

                entity.Property(e => e.PromocionPlan)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("Promocion_Plan");

                entity.Property(e => e.Tarjeta)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TipoDeLiquidacion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Tipo_de_Liquidacion");

                entity.Property(e => e.TipoDeOperacion)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Tipo_de_Operacion");

                entity.Property(e => e.TotalBruto)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("Total_Bruto");

                entity.Property(e => e.TotalDescuento)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("Total_Descuento");

                entity.Property(e => e.TotalNeto)
                    .HasColumnType("decimal(10, 2)")
                    .HasColumnName("Total_Neto");
            });

            modelBuilder.Entity<Cuestionario>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdPuesto).HasColumnName("ID_Puesto");

                entity.Property(e => e.Nombre).HasMaxLength(50);

                entity.Property(e => e.NotaAprobacion).HasMaxLength(50);

                entity.HasOne(d => d.IdPuestoNavigation)
                    .WithMany(p => p.Cuestionarios)
                    .HasForeignKey(d => d.IdPuesto)
                    .HasConstraintName("FK_Cuestionarios_Puestos");
            });

            modelBuilder.Entity<Cuota>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("cuotas");

                entity.Property(e => e.CodigoPosnet)
                    .HasMaxLength(255)
                    .HasColumnName("codigo posnet");

                entity.Property(e => e.Cuotas).HasColumnName("cuotas");

                entity.Property(e => e.Tipo)
                    .HasMaxLength(255)
                    .HasColumnName("tipo");
            });

            modelBuilder.Entity<DestinoTerminal>(entity =>
            {
                entity.ToTable("DestinoTerminal");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.HasOne(d => d.Origen)
                    .WithMany(p => p.DestinoTerminals)
                    .HasForeignKey(d => d.OrigenId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_DestinoTerminal_Origen");
            });

            modelBuilder.Entity<DocumentosUsuario>(entity =>
            {
                entity.HasKey(e => e.DocumentoId)
                    .HasName("PK__document__426F79E10F99CF2F");

                entity.ToTable("documentos_usuario");

                entity.Property(e => e.DocumentoId).HasColumnName("documento_id");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.DocumentoPdf).HasColumnName("documento_pdf");

                entity.Property(e => e.FechaSubida)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_subida");

                entity.Property(e => e.NombreDocumento)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("nombre_documento");

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.DocumentosUsuarios)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_documentos_usuario_usuarios");
            });

            modelBuilder.Entity<Educacion>(entity =>
            {
                entity.HasKey(e => e.IdEducacion)
                    .HasName("PK__Educacio__A177C0E35F1E1E35");

                entity.ToTable("Educacion");

                entity.Property(e => e.FechaFin).HasColumnType("datetime");

                entity.Property(e => e.FechaInicio).HasColumnType("datetime");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.Educacions)
                    .HasForeignKey(d => d.IdPostulante)
                    .HasConstraintName("FK_Educacion_Postulante");
            });

            modelBuilder.Entity<EmailConfiguration>(entity =>
            {
                entity.Property(e => e.DisplayName).HasMaxLength(100);

                entity.Property(e => e.Host).HasMaxLength(100);

                entity.Property(e => e.IsActive).HasDefaultValueSql("((1))");

                entity.Property(e => e.Password).HasMaxLength(100);

                entity.Property(e => e.ReplyToEmail).HasMaxLength(255);

                entity.Property(e => e.Username).HasMaxLength(100);
            });

            modelBuilder.Entity<Facturante>(entity =>
            {
                entity.ToTable("Facturante");

                entity.Property(e => e.FacturanteId).HasColumnName("Facturante_id");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.DocumentoPdf).HasColumnName("documento_pdf");

                entity.Property(e => e.FechaSubida)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_subida");

                entity.Property(e => e.NombreDocumento)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("nombre_documento");

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Facturantes)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Facturante_usuario_usuarios");
            });

            modelBuilder.Entity<FechaEliminar>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("fecha_eliminar");

                entity.Property(e => e.FechaDePago)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha de pago");
            });

            modelBuilder.Entity<Fidelizacion>(entity =>
            {
                entity.ToTable("fidelizacion");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Baja).HasColumnName("baja");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(11)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Nterminal)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("nterminal");
            });

            modelBuilder.Entity<FilasCloverQr>(entity =>
            {
                entity.ToTable("FilasCloverQR");
            });

            modelBuilder.Entity<FormularioAlta>(entity =>
            {
                entity.ToTable("Formulario_Altas");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ActividadLaboralProfesional).HasMaxLength(255);

                entity.Property(e => e.Alias).HasMaxLength(500);

                entity.Property(e => e.ApellidoYnombre)
                    .HasMaxLength(255)
                    .HasColumnName("ApellidoYNombre");

                entity.Property(e => e.Apoderado).HasMaxLength(255);

                entity.Property(e => e.Banco).HasMaxLength(500);

                entity.Property(e => e.Calle).HasMaxLength(255);

                entity.Property(e => e.Cbucvu).HasColumnName("CBUCVU");

                entity.Property(e => e.Celular)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.CodigoPostalComercio).HasMaxLength(255);

                entity.Property(e => e.CodigoPostalTitular).HasMaxLength(255);

                entity.Property(e => e.ConstanciaAfip).HasColumnName("ConstanciaAFIP");

                entity.Property(e => e.ContanciaCbuCvu).HasColumnName("ContanciaCBU/CVU");

                entity.Property(e => e.CopiaContratoSocialOactoConstitutivo).HasColumnName("CopiaContratoSocialOActoConstitutivo");

                entity.Property(e => e.Cuitbancario)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("CUITBancario");

                entity.Property(e => e.Cuittitular)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("CUITTitular");

                entity.Property(e => e.Dnidorso).HasColumnName("DNIDorso");

                entity.Property(e => e.Dnifrente).HasColumnName("DNIFrente");

                entity.Property(e => e.Domicilio).HasMaxLength(500);

                entity.Property(e => e.FechaApertura).HasColumnType("datetime");

                entity.Property(e => e.FechaNacimiento).HasColumnType("datetime");

                entity.Property(e => e.LocalidadComercio).HasMaxLength(255);

                entity.Property(e => e.LocalidadTitular).HasMaxLength(255);

                entity.Property(e => e.Nacionalidad).HasMaxLength(255);

                entity.Property(e => e.NombreFantasia).HasMaxLength(255);

                entity.Property(e => e.NumeroComercioSolicitado).HasMaxLength(500);

                entity.Property(e => e.NumeroComericoActual).HasMaxLength(500);

                entity.Property(e => e.Pais).HasMaxLength(255);

                entity.Property(e => e.Provincia).HasMaxLength(255);

                entity.Property(e => e.TelFijo)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.TipoAlta).HasMaxLength(500);

                entity.Property(e => e.TipoCuenta).HasMaxLength(500);

                entity.Property(e => e.TipoPersona).HasMaxLength(255);

                entity.Property(e => e.TitularRazonSocial).HasMaxLength(500);

                entity.HasOne(d => d.IdGestorNavigation)
                    .WithMany(p => p.FormularioAlta)
                    .HasForeignKey(d => d.IdGestor)
                    .HasConstraintName("FK_Formulario_Altas_iIdGestor");
            });

            modelBuilder.Entity<FormularioBaja>(entity =>
            {
                entity.ToTable("Formulario_Baja");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FechaApertura).HasColumnType("datetime");

                entity.Property(e => e.NombreComercio).HasMaxLength(255);

                entity.Property(e => e.Observacion).HasMaxLength(255);

                entity.HasOne(d => d.IdGestorNavigation)
                    .WithMany(p => p.FormularioBajas)
                    .HasForeignKey(d => d.IdGestor)
                    .HasConstraintName("FK_Formulario_Baja_iIdGestor");
            });

            modelBuilder.Entity<FormularioModificacione>(entity =>
            {
                entity.ToTable("Formulario_Modificaciones");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias).HasMaxLength(500);

                entity.Property(e => e.Banco).HasMaxLength(500);

                entity.Property(e => e.Cbucvu).HasColumnName("CBUCVU");

                entity.Property(e => e.Ciudad).HasMaxLength(255);

                entity.Property(e => e.ConstanciaCbucvu).HasColumnName("ConstanciaCBUCVU");

                entity.Property(e => e.ContanciaCbuCvu).HasColumnName("ContanciaCBU/CVU");

                entity.Property(e => e.Cuitbancario)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("CUITBancario");

                entity.Property(e => e.Dni).HasColumnName("DNI");

                entity.Property(e => e.Dnidorso).HasColumnName("DNIDorso");

                entity.Property(e => e.Domicilio).HasMaxLength(255);

                entity.Property(e => e.Email).HasMaxLength(500);

                entity.Property(e => e.FechaApertura).HasColumnType("datetime");

                entity.Property(e => e.NombreComercio).HasMaxLength(255);

                entity.Property(e => e.NombreFantasia).HasMaxLength(255);

                entity.Property(e => e.NumeroTerminalAltaL).HasColumnName("NumeroTerminal(alta)l");

                entity.Property(e => e.NumeroTerminalBaja).HasColumnName("NumeroTerminal(baja)");

                entity.Property(e => e.Observacion).HasMaxLength(255);

                entity.Property(e => e.Provincia).HasMaxLength(255);

                entity.Property(e => e.TipoCuenta).HasMaxLength(500);

                entity.HasOne(d => d.IdGestorNavigation)
                    .WithMany(p => p.FormularioModificaciones)
                    .HasForeignKey(d => d.IdGestor)
                    .HasConstraintName("FK_Formulario_Modificaciones_iIdGestor");
            });

            modelBuilder.Entity<HistorialCrm>(entity =>
            {
                entity.ToTable("Historial_CRM");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AltaId).HasColumnName("Alta_Id");

                entity.Property(e => e.BajaId).HasColumnName("Baja_Id");

                entity.Property(e => e.FechaSubida)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_subida");

                entity.Property(e => e.Tipo).HasMaxLength(250);

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Alta)
                    .WithMany(p => p.HistorialCrms)
                    .HasForeignKey(d => d.AltaId)
                    .HasConstraintName("FK_Historial_CRM_Altas");

                entity.HasOne(d => d.Baja)
                    .WithMany(p => p.HistorialCrms)
                    .HasForeignKey(d => d.BajaId)
                    .HasConstraintName("FK_Historial_CRM_Bajas");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.HistorialCrms)
                    .HasForeignKey(d => d.UsuarioId)
                    .HasConstraintName("FK_Historial_CRM_usuario_usuarios");
            });

            modelBuilder.Entity<Iibb>(entity =>
            {
                entity.ToTable("IIBB");

                entity.Property(e => e.IibbId).HasColumnName("IIBB_id");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.DocumentoPdf).HasColumnName("documento_pdf");

                entity.Property(e => e.FechaSubida)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_subida");

                entity.Property(e => e.NombreDocumento)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("nombre_documento");

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Iibbs)
                    .HasForeignKey(d => d.UsuarioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_IIBB_usuario_usuarios");
            });

            modelBuilder.Entity<Inflacion>(entity =>
            {
                entity.ToTable("Inflacion");

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.Inflacion1).HasColumnName("Inflacion");

                entity.Property(e => e.Rubro).HasMaxLength(255);
            });

            modelBuilder.Entity<InicioAsesore>(entity =>
            {
                entity.HasNoKey();

                entity.Property(e => e.Activas).HasColumnName("ACTIVAS");

                entity.Property(e => e.Activas2).HasColumnName("ACTIVAS2");

                entity.Property(e => e.AjustesPositivos)
                    .HasMaxLength(255)
                    .HasColumnName("Ajustes Positivos");

                entity.Property(e => e.Alta).HasColumnName("ALTA");

                entity.Property(e => e.Altas2).HasColumnName("ALTAS2");

                entity.Property(e => e.ApellidoYNombre)
                    .HasMaxLength(255)
                    .HasColumnName("APELLIDO Y NOMBRE");

                entity.Property(e => e.Bajas).HasColumnName("BAJAS");

                entity.Property(e => e.BajoAnalisis).HasColumnName("BAJO ANALISIS");

                entity.Property(e => e.BajoAnalisis2).HasColumnName("BAJO ANALISIS2");

                entity.Property(e => e.BajoAnalisis4).HasColumnName("BAJO ANALISIS4");

                entity.Property(e => e.Bruto2).HasColumnName("bruto2");

                entity.Property(e => e.CantTermin).HasColumnName("cant termin");

                entity.Property(e => e.Comision1Pago).HasColumnName("Comision 1 pago");

                entity.Property(e => e.Comision1Pago3).HasColumnName("Comision 1 pago3");

                entity.Property(e => e.ComisionCoorindacion).HasColumnName("Comision Coorindacion");

                entity.Property(e => e.ComisionCredito).HasColumnName("Comision Credito");

                entity.Property(e => e.ComisionCredito4).HasColumnName("Comision Credito4");

                entity.Property(e => e.ComisionDebito).HasColumnName("Comision Debito");

                entity.Property(e => e.ComisionDebito2).HasColumnName("Comision Debito2");

                entity.Property(e => e.ComisionMesPasado).HasColumnName("COMISION MES PASADO");

                entity.Property(e => e.ComisionPorActivacion).HasColumnName("Comision por Activacion");

                entity.Property(e => e.Credito).HasColumnName("CREDITO");

                entity.Property(e => e.CuitCuil).HasColumnName("CUIT/CUIL");

                entity.Property(e => e.Debito).HasColumnName("DEBITO");

                entity.Property(e => e.DescuentoFiserv).HasColumnName("Descuento Fiserv");

                entity.Property(e => e.DescuentoGerencial).HasColumnName("Descuento gerencial");

                entity.Property(e => e.DescuentoPendiente)
                    .HasMaxLength(255)
                    .HasColumnName("Descuento Pendiente");

                entity.Property(e => e.DescuentoPorGestiones).HasColumnName("Descuento por gestiones");

                entity.Property(e => e.DescuentoPorGestiones8).HasColumnName("Descuento por gestiones8");

                entity.Property(e => e.DescuentoPorVisitaGerencialYCoordinador).HasColumnName("Descuento por visita gerencial y coordinador");

                entity.Property(e => e.DescuentoPorVisitas).HasColumnName("Descuento por Visitas");

                entity.Property(e => e.DisponibleEnLaProvincia).HasColumnName("Disponible en la provincia");

                entity.Property(e => e.Disponibles).HasColumnName("DISPONIBLES");

                entity.Property(e => e.DisponiblesEnZoco).HasColumnName("Disponibles en Zoco");

                entity.Property(e => e.EMail)
                    .HasMaxLength(255)
                    .HasColumnName("E-MAIL");

                entity.Property(e => e.Envios).HasColumnName("ENVIOS");

                entity.Property(e => e.Envios6).HasColumnName("ENVIOS6");

                entity.Property(e => e.Estado)
                    .HasMaxLength(255)
                    .HasColumnName("ESTADO");

                entity.Property(e => e.EstadoDeProvincia)
                    .HasMaxLength(255)
                    .HasColumnName("Estado de Provincia");

                entity.Property(e => e.FrenarPago)
                    .HasMaxLength(255)
                    .HasColumnName("Frenar pago");

                entity.Property(e => e.FrenarPago2)
                    .HasMaxLength(255)
                    .HasColumnName("Frenar pago2");

                entity.Property(e => e.Id)
                    .HasMaxLength(255)
                    .HasColumnName("id");

                entity.Property(e => e.N3PorActivacion)
                    .HasColumnType("money")
                    .HasColumnName("N3 POR ACTIVACION");

                entity.Property(e => e.N3PorFacturacion)
                    .HasColumnType("money")
                    .HasColumnName("N3 POR FACTURACION");

                entity.Property(e => e.Nivel).HasColumnName("NIVEL");

                entity.Property(e => e.NivelDeActivacion).HasColumnName("Nivel de activacion");

                entity.Property(e => e.Posicion)
                    .HasMaxLength(255)
                    .HasColumnName("POSICION");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Reubicar).HasColumnName("REUBICAR");

                entity.Property(e => e.Reubicar2).HasColumnName("REUBICAR2");

                entity.Property(e => e.Reubicar3).HasColumnName("REUBICAR3");

                entity.Property(e => e.ServTecnico).HasColumnName("SERV# TECNICO");

                entity.Property(e => e.ServTecnico5).HasColumnName("SERV# TECNICO5");

                entity.Property(e => e.Stock).HasColumnName("STOCK");

                entity.Property(e => e.SubTotalFinal).HasColumnName("SubTotal FINAL");

                entity.Property(e => e.SubTotalFinal2).HasColumnName("SubTotal FINAL2");

                entity.Property(e => e.SubtotalSinDescuentos).HasColumnName("Subtotal sin  descuentos");

                entity.Property(e => e.SubtotalSinDescuentos4).HasColumnName("Subtotal sin  descuentos4");

                entity.Property(e => e.TicketPromeido).HasColumnName("ticket promeido");

                entity.Property(e => e.TotalFinalOk).HasColumnName("Total Final OK");

                entity.Property(e => e.TotalFinalOk2).HasColumnName("Total Final OK2");

                entity.Property(e => e.Varios).HasColumnName("VARIOS");

                entity.Property(e => e.Varios7).HasColumnName("VARIOS7");

                entity.Property(e => e.VentasMesActual).HasColumnName("VENTAS MES ACTUAL");

                entity.Property(e => e.VentasMesPasado).HasColumnName("VENTAS MES PASADO");

                entity.Property(e => e._1Pago).HasColumnName("1 PAGO");
            });

            modelBuilder.Entity<Legajo>(entity =>
            {
                entity.ToTable("legajos");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Asesor)
                    .HasMaxLength(255)
                    .HasColumnName("ASESOR");

                entity.Property(e => e.FechaDeCarga)
                    .HasColumnType("datetime")
                    .HasColumnName("FECHA DE CARGA");

                entity.Property(e => e.Iduser).HasColumnName("iduser");

                entity.Property(e => e.NombreDeFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("NOMBRE DE FANTASIA");

                entity.Property(e => e.NroLegajo).HasColumnName("nroLegajo");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(255)
                    .HasColumnName("PROVINCIA");

                entity.Property(e => e.Terminal).HasColumnName("TERMINAL");

                entity.HasOne(d => d.IduserNavigation)
                    .WithMany(p => p.Legajos)
                    .HasForeignKey(d => d.Iduser)
                    .HasConstraintName("FK_legajos_usuarios");
            });

            modelBuilder.Entity<ListaCuotum>(entity =>
            {
                entity.ToTable("Lista_Cuota");

                entity.Property(e => e.CodigoPosnet)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Codigo_Posnet");

                entity.Property(e => e.Comision)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ComisionMasIva)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Comision_mas_IVA");

                entity.Property(e => e.CostoAmericanExpressCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_American_Express_Credito");

                entity.Property(e => e.CostoArgencardCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_Argencard_Credito");

                entity.Property(e => e.CostoCabalCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_Cabal_Credito");

                entity.Property(e => e.CostoMastercardCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_Mastercard_Credito");

                entity.Property(e => e.CostoNaranjaCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_Naranja_Credito");

                entity.Property(e => e.CostoVisaCredito)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("Costo_Visa_Credito");

                entity.Property(e => e.Cuota)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Iva)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("IVA");
            });

            modelBuilder.Entity<ListaIibbprovincium>(entity =>
            {
                entity.ToTable("Lista_IIBBProvincia");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alicuota).HasMaxLength(255);

                entity.Property(e => e.Provincia).HasMaxLength(255);
            });

            modelBuilder.Entity<ListaImpositiva>(entity =>
            {
                entity.ToTable("Lista_Impositiva");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Porcentaje).HasMaxLength(255);

                entity.Property(e => e.Retecion).HasMaxLength(255);

                entity.Property(e => e.Tipo).HasMaxLength(255);
            });

            modelBuilder.Entity<ListaTasaPreferecial>(entity =>
            {
                entity.ToTable("Lista_TasaPreferecial");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CostTranscDebCred).HasMaxLength(255);

                entity.Property(e => e.CreditoTasaPreferencial).HasMaxLength(255);

                entity.Property(e => e.DebitoTasaPreferencial).HasMaxLength(255);

                entity.Property(e => e.Ganancia).HasMaxLength(255);

                entity.Property(e => e.InicioCostTranscDebCred).HasColumnType("datetime");

                entity.Property(e => e.InicioGanancia).HasColumnType("datetime");

                entity.Property(e => e.InicioTasaPreferencial).HasColumnType("datetime");

                entity.Property(e => e.NombreFantasia).HasMaxLength(255);

                entity.Property(e => e.PorcentajeCostTranscDebCred).HasMaxLength(255);

                entity.Property(e => e.PorcentajeGanancia).HasMaxLength(255);

                entity.Property(e => e.PorcentajeRetIibb)
                    .HasMaxLength(255)
                    .HasColumnName("PorcentajeRetIIBB");

                entity.Property(e => e.RetIibb)
                    .HasMaxLength(255)
                    .HasColumnName("RetIIBB");

                entity.Property(e => e.TasaPreferencial).HasMaxLength(255);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.ListaTasaPreferecials)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_Lista_TasaPreferecial_IdUser");
            });

            modelBuilder.Entity<Menu>(entity =>
            {
                entity.HasKey(e => e.IdMenu)
                    .HasName("PK__Menu__C26AF483CECD7B3E");

                entity.ToTable("Menu");

                entity.Property(e => e.IdMenu).HasColumnName("idMenu");

                entity.Property(e => e.Controlador)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("controlador");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.Icono)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("icono");

                entity.Property(e => e.IdMenuPadre).HasColumnName("idMenuPadre");

                entity.Property(e => e.PaginaAccion)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("paginaAccion");

                entity.HasOne(d => d.IdMenuPadreNavigation)
                    .WithMany(p => p.InverseIdMenuPadreNavigation)
                    .HasForeignKey(d => d.IdMenuPadre)
                    .HasConstraintName("FK__Menu__idMenuPadr__3F6663D5");
            });

            modelBuilder.Entity<Noticia>(entity =>
            {
                entity.ToTable("noticias");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Fecha)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha");

                entity.Property(e => e.Noticia1).HasColumnName("noticia");

                entity.Property(e => e.TipoUsuario)
                    .HasMaxLength(50)
                    .IsFixedLength();
            });

            modelBuilder.Entity<NotificacionResuman>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Fecha).HasColumnType("date");

                entity.Property(e => e.UsuarioId).HasColumnName("UsuarioID");
            });

            modelBuilder.Entity<NroComercio>(entity =>
            {
                entity.ToTable("NroComercio");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Categoria)
                    .HasMaxLength(150)
                    .HasColumnName("categoria");

                entity.Property(e => e.Cuotas).HasColumnName("cuotas");

                entity.Property(e => e.Legajos).HasColumnName("legajos");

                entity.Property(e => e.NomRubro)
                    .HasMaxLength(150)
                    .HasColumnName("nomRubro");

                entity.Property(e => e.NroComercio1).HasColumnName("nroComercio");

                entity.HasOne(d => d.LegajosNavigation)
                    .WithMany(p => p.NroComercios)
                    .HasForeignKey(d => d.Legajos)
                    .HasConstraintName("FK_Legajos");
            });

            modelBuilder.Entity<Origen>(entity =>
            {
                entity.ToTable("Origen");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.AltaId).HasColumnName("Alta_Id");

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.Origen1).HasColumnName("Origen");

                entity.HasOne(d => d.Alta)
                    .WithMany(p => p.Origens)
                    .HasForeignKey(d => d.AltaId)
                    .HasConstraintName("FK_Origen_Altas");
            });

            modelBuilder.Entity<PanelCalidadInterno>(entity =>
            {
                entity.ToTable("PanelCalidadInterno");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Fecha).HasColumnType("datetime");

                entity.Property(e => e.FechaCarga).HasColumnType("datetime");

                entity.HasOne(d => d.Gestor)
                    .WithMany(p => p.PanelCalidadInternoGestors)
                    .HasForeignKey(d => d.GestorId)
                    .HasConstraintName("FK_PanelCalidadInterno_Gestor_Usuarios");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.PanelCalidadInternoIdUserNavigations)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_PanelCalidadInterno_Usuarios");
            });

            modelBuilder.Entity<PanelGestorInterno>(entity =>
            {
                entity.ToTable("PanelGestorInterno");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.FechaCarga).HasColumnType("datetime");

                entity.HasOne(d => d.IdAliadoNavigation)
                    .WithMany(p => p.PanelGestorInternoIdAliadoNavigations)
                    .HasForeignKey(d => d.IdAliado)
                    .HasConstraintName("FK_PanelGestorInterno_Usuarios_IdAliado");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.PanelGestorInternoIdUserNavigations)
                    .HasForeignKey(d => d.IdUser)
                    .HasConstraintName("FK_PanelGestorInterno_Usuarios");
            });

            modelBuilder.Entity<Postulante>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Contraseña).HasMaxLength(100);

                entity.Property(e => e.Correo).HasMaxLength(100);

                entity.Property(e => e.Cv).HasColumnName("CV");

                entity.Property(e => e.Direccion).HasMaxLength(100);

                entity.Property(e => e.Dni).HasMaxLength(100);

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Localidad).HasMaxLength(100);

                entity.Property(e => e.Nombre).HasMaxLength(100);

                entity.Property(e => e.Provincia).HasMaxLength(100);

                entity.Property(e => e.Telefono).HasMaxLength(20);
            });

            modelBuilder.Entity<PostulanteCuestionario>(entity =>
            {
                entity.ToTable("Postulante_Cuestionario");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.IdCuestionario).HasColumnName("Id_Cuestionario");

                entity.Property(e => e.IdPostulante).HasColumnName("Id_Postulante");

                entity.Property(e => e.Resultado).HasColumnType("decimal(18, 0)");

                entity.HasOne(d => d.IdCuestionarioNavigation)
                    .WithMany(p => p.PostulanteCuestionarios)
                    .HasForeignKey(d => d.IdCuestionario)
                    .HasConstraintName("FK_Postulante_Cuestionario_Cuestionarios");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.PostulanteCuestionarios)
                    .HasForeignKey(d => d.IdPostulante)
                    .HasConstraintName("FK_Postulante_Cuestionario_Postulantes");
            });

            modelBuilder.Entity<PostulantePuesto>(entity =>
            {
                entity.ToTable("PostulantePuesto");

                entity.Property(e => e.FechaPostulacion).HasColumnType("datetime");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.PostulantePuestos)
                    .HasForeignKey(d => d.IdPostulante)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PostulantePuesto_Postulante");

                entity.HasOne(d => d.IdPuestoNavigation)
                    .WithMany(p => p.PostulantePuestos)
                    .HasForeignKey(d => d.IdPuesto)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PostulantePuesto_Puesto");
            });

            modelBuilder.Entity<Pregunta>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.IdCuestionario).HasColumnName("ID_Cuestionario");

                entity.Property(e => e.TextoPregunta).HasMaxLength(500);

                entity.Property(e => e.TiempoRespuesta).HasColumnType("decimal(18, 0)");

                entity.Property(e => e.TipoRespuesta).HasMaxLength(50);

                entity.HasOne(d => d.IdCuestionarioNavigation)
                    .WithMany(p => p.Pregunta)
                    .HasForeignKey(d => d.IdCuestionario)
                    .HasConstraintName("FK_Preguntas_Cuestionarios");
            });

            modelBuilder.Entity<Prospecto>(entity =>
            {
                entity.HasKey(e => e.IdProspecto)
                    .HasName("PK__Prospect__330560600192A3A2");

                entity.Property(e => e.IdProspecto).HasColumnName("id_prospecto");

                entity.Property(e => e.Cp).HasColumnName("CP");

                entity.Property(e => e.DniCuit).HasColumnName("dni_cuit");

                entity.Property(e => e.Domicilio).HasMaxLength(255);

                entity.Property(e => e.EstadoReunion)
                    .HasMaxLength(50)
                    .HasColumnName("estado_reunion");

                entity.Property(e => e.FacturacionEst)
                    .HasColumnType("money")
                    .HasColumnName("Facturacion_est");

                entity.Property(e => e.IdAsesor).HasColumnName("id_asesor");

                entity.Property(e => e.Localidad).HasMaxLength(100);

                entity.Property(e => e.NombreFantasia)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre_fantasia");

                entity.Property(e => e.NombrePersona)
                    .HasMaxLength(255)
                    .HasColumnName("Nombre_persona");

                entity.Property(e => e.PosnetCover)
                    .HasMaxLength(50)
                    .HasColumnName("posnet_cover");

                entity.Property(e => e.PrimerContactoFecha)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("primer_contacto_fecha");

                entity.Property(e => e.PrimerContactoHora).HasColumnName("primer_contacto_hora");

                entity.Property(e => e.PrimerContactoOrigen)
                    .HasMaxLength(255)
                    .HasColumnName("primer_contacto_origen");

                entity.Property(e => e.Provincia)
                    .HasMaxLength(100)
                    .HasColumnName("provincia");

                entity.Property(e => e.Rubro).HasMaxLength(255);
            });

            modelBuilder.Entity<Puesto>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.FechaCreacion).HasColumnType("datetime");

                entity.Property(e => e.Nombre).HasMaxLength(500);
            });

            modelBuilder.Entity<ReceivedEmail>(entity =>
            {
                entity.Property(e => e.FromEmail).HasMaxLength(255);

                entity.Property(e => e.IsReplied).HasDefaultValueSql("((0))");

                entity.Property(e => e.MessageId).HasMaxLength(255);

                entity.Property(e => e.ReceivedDate).HasColumnType("datetime");

                entity.Property(e => e.Subject).HasMaxLength(255);

                entity.Property(e => e.ToEmail).HasMaxLength(255);

                entity.HasOne(d => d.EmailConfiguration)
                    .WithMany(p => p.ReceivedEmails)
                    .HasForeignKey(d => d.EmailConfigurationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__ReceivedE__Email__34BEB830");
            });

            modelBuilder.Entity<Referencia>(entity =>
            {
                entity.HasOne(d => d.IdEmpleoNavigation)
                    .WithMany(p => p.Referencia)
                    .HasForeignKey(d => d.IdEmpleo)
                    .HasConstraintName("FK_Referencias_CargosAnteriores");
            });

            modelBuilder.Entity<Referido>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Comprobante).HasColumnName("comprobante");

                entity.Property(e => e.FechaAlta)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaAlta");

                entity.Property(e => e.FechaBaja)
                    .HasColumnType("datetime")
                    .HasColumnName("fechaBaja");

                entity.Property(e => e.FechaCierre).HasColumnType("datetime");

                entity.Property(e => e.FechaPago).HasColumnType("datetime");

                entity.Property(e => e.IdUser).HasColumnName("idUser");

                entity.Property(e => e.IdZocoConect).HasColumnName("idZocoConect");

                entity.Property(e => e.NroTerminal).HasMaxLength(50);

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.Referidos)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Referidos_Usuarios");

                entity.HasOne(d => d.IdZocoConectNavigation)
                    .WithMany(p => p.Referidos)
                    .HasForeignKey(d => d.IdZocoConect)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Referidos_ZocoConect");
            });

            modelBuilder.Entity<ReporteMensual>(entity =>
            {
                entity.ToTable("reporteMensual");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias).HasMaxLength(100);

                entity.Property(e => e.AsesorAbm)
                    .HasMaxLength(150)
                    .HasColumnName("Asesor ABM");

                entity.Property(e => e.AñoPago).HasColumnName("Año_Pago");

                entity.Property(e => e.Banco).HasMaxLength(100);

                entity.Property(e => e.CbuCvu)
                    .HasMaxLength(100)
                    .HasColumnName("CBU/CVU");

                entity.Property(e => e.CodActividad).HasColumnName("Cod. Actividad");

                entity.Property(e => e.CostoPorAnticipoTotal).HasColumnName("Costo por Anticipo Total");

                entity.Property(e => e.CreditoCuotas).HasColumnName("Credito Cuotas");

                entity.Property(e => e.FechaAltaComercio).HasColumnName("Fecha Alta comercio");

                entity.Property(e => e.FechaDePago)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha de Pago");

                entity.Property(e => e.FechaOperacion)
                    .HasColumnType("datetime")
                    .HasColumnName("Fecha Operacion");

                entity.Property(e => e.ImpuestoAlDebitoYCredito).HasColumnName("Impuesto al debito y credito");

                entity.Property(e => e.MesPago).HasColumnName("Mes_Pago");

                entity.Property(e => e.NombreComercio)
                    .HasMaxLength(100)
                    .HasColumnName("Nombre Comercio");

                entity.Property(e => e.NroDeComercio).HasColumnName("Nro# de Comercio");

                entity.Property(e => e.NroDeCuenta)
                    .HasMaxLength(100)
                    .HasColumnName("Nro de cuenta");

                entity.Property(e => e.ProvinciaAbm)
                    .HasMaxLength(150)
                    .HasColumnName("Provincia ABM");

                entity.Property(e => e.RazonSocial)
                    .HasMaxLength(150)
                    .HasColumnName("Razon Social");

                entity.Property(e => e.Retencion)
                    .HasMaxLength(100)
                    .HasColumnName("RETENCION");

                entity.Property(e => e.RetencionGanancia).HasColumnName("Retencion ganancia");

                entity.Property(e => e.RetencionImpositiva).HasColumnName("Retencion Impositiva");

                entity.Property(e => e.RetencionIva).HasColumnName("Retencion IVA");

                entity.Property(e => e.RetencionMunicipal).HasColumnName("Retencion municipal");

                entity.Property(e => e.RetencionProvincial).HasColumnName("Retencion Provincial");

                entity.Property(e => e.Rubro).HasMaxLength(200);

                entity.Property(e => e.TipoDeCuenta)
                    .HasMaxLength(100)
                    .HasColumnName("Tipo de cuenta");

                entity.Property(e => e.TotalBruto).HasColumnName("Total Bruto");

                entity.Property(e => e.TotalCostoFinanciero).HasColumnName("Total costo financiero");

                entity.Property(e => e.TotalDebito).HasColumnName("Total Debito");

                entity.Property(e => e.TotalNeto).HasColumnName("Total neto");

                entity.Property(e => e._1Pago).HasColumnName("1 Pago");
            });

            modelBuilder.Entity<Respuesta>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.IdPregunta).HasColumnName("ID_Pregunta");

                entity.HasOne(d => d.IdPreguntaNavigation)
                    .WithMany(p => p.Respuesta)
                    .HasForeignKey(d => d.IdPregunta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__Respuesta__ID_Pr__412EB0B6");
            });

            modelBuilder.Entity<RespuestasUsuario>(entity =>
            {
                entity.ToTable("RespuestasUsuario");

                entity.Property(e => e.FechaRespuesta).HasColumnType("datetime");

                entity.HasOne(d => d.IdPostulanteNavigation)
                    .WithMany(p => p.RespuestasUsuarios)
                    .HasForeignKey(d => d.IdPostulante)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RespuestasUsuario_Postulante");

                entity.HasOne(d => d.IdPreguntaNavigation)
                    .WithMany(p => p.RespuestasUsuarios)
                    .HasForeignKey(d => d.IdPregunta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RespuestasUsuario_Pregunta");

                entity.HasOne(d => d.IdRespuestaNavigation)
                    .WithMany(p => p.RespuestasUsuarios)
                    .HasForeignKey(d => d.IdRespuesta)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_RespuestasUsuario_Respuesta");
            });

            modelBuilder.Entity<Reunione>(entity =>
            {
                entity.HasKey(e => e.IdReunion)
                    .HasName("PK__Reunione__52FBEC8339B21741");

                entity.Property(e => e.IdReunion).HasColumnName("id_reunion");

                entity.Property(e => e.Comentarios).HasColumnName("comentarios");

                entity.Property(e => e.Estado)
                    .HasMaxLength(50)
                    .HasColumnName("estado");

                entity.Property(e => e.Fecha)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha");

                entity.Property(e => e.Hora).HasColumnName("hora");

                entity.Property(e => e.IdAsesor).HasColumnName("id_asesor");

                entity.Property(e => e.IdProspecto).HasColumnName("id_prospecto");
            });

            modelBuilder.Entity<Rol>(entity =>
            {
                entity.HasKey(e => e.IdRol)
                    .HasName("PK__Rol__3C872F76EDC1AEF7");

                entity.ToTable("Rol");

                entity.Property(e => e.IdRol).HasColumnName("idRol");

                entity.Property(e => e.Descripcion)
                    .HasMaxLength(30)
                    .IsUnicode(false)
                    .HasColumnName("descripcion");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");
            });

            modelBuilder.Entity<RolMenu>(entity =>
            {
                entity.HasKey(e => e.IdRolMenu)
                    .HasName("PK__RolMenu__CD2045D8F4BE4ACF");

                entity.ToTable("RolMenu");

                entity.Property(e => e.IdRolMenu).HasColumnName("idRolMenu");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.IdMenu).HasColumnName("idMenu");

                entity.Property(e => e.IdRol).HasColumnName("idRol");

                entity.HasOne(d => d.IdMenuNavigation)
                    .WithMany(p => p.RolMenus)
                    .HasForeignKey(d => d.IdMenu)
                    .HasConstraintName("FK__RolMenu__idMenu__405A880E");

                entity.HasOne(d => d.IdRolNavigation)
                    .WithMany(p => p.RolMenus)
                    .HasForeignKey(d => d.IdRol)
                    .HasConstraintName("FK__RolMenu__idRol__414EAC47");
            });

            modelBuilder.Entity<Rubro>(entity =>
            {
                entity.ToTable("rubros");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.NomRubro)
                    .HasMaxLength(100)
                    .HasColumnName("nomRubro");
            });

            modelBuilder.Entity<SentEmail>(entity =>
            {
                entity.Property(e => e.FromEmail).HasMaxLength(255);

                entity.Property(e => e.InReplyToMessageId).HasMaxLength(255);

                entity.Property(e => e.SentDate).HasColumnType("datetime");

                entity.Property(e => e.Subject).HasMaxLength(255);

                entity.Property(e => e.ToEmail).HasMaxLength(255);

                entity.HasOne(d => d.EmailConfiguration)
                    .WithMany(p => p.SentEmails)
                    .HasForeignKey(d => d.EmailConfigurationId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK__SentEmail__Email__379B24DB");
            });

            modelBuilder.Entity<Stock>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("stock");

                entity.Property(e => e.Activacion).HasColumnName("activacion");

                entity.Property(e => e.Alta).HasColumnName("alta");

                entity.Property(e => e.Asesor).HasColumnName("asesor");

                entity.Property(e => e.AuxAltaActiva).HasColumnName("aux_alta_activa");

                entity.Property(e => e.AuxAltaNoActiva).HasColumnName("aux_alta_no_activa");

                entity.Property(e => e.AuxDiasDesdeElAlta).HasColumnName("aux_dias_desde_el_alta");

                entity.Property(e => e.Año).HasColumnName("año");

                entity.Property(e => e.Backup).HasColumnName("backup");

                entity.Property(e => e.Comercio).HasColumnName("comercio");

                entity.Property(e => e.DeBajoAnalisis).HasColumnName("de_$_bajo_analisis");

                entity.Property(e => e.DeReubicar).HasColumnName("de_$_reubicar");

                entity.Property(e => e.DecisionAbm).HasColumnName("decision_abm");

                entity.Property(e => e.DecisionTomada).HasColumnName("decision_tomada");

                entity.Property(e => e.EgresoDeSstt).HasColumnName("egreso_de_sstt");

                entity.Property(e => e.EgresoDeSstt2).HasColumnName("egreso_de_sstt2");

                entity.Property(e => e.EnPausa).HasColumnName("en_pausa");

                entity.Property(e => e.Estado).HasColumnName("estado");

                entity.Property(e => e.Factura).HasColumnName("factura");

                entity.Property(e => e.FacturacionDelMesRazonSocial).HasColumnName("facturacion_del_mes_razon_social");

                entity.Property(e => e.FacturacionMesEnCurso).HasColumnName("facturacion_mes_en_curso");

                entity.Property(e => e.FacturacionMesPasado).HasColumnName("facturacion_mes_pasado");

                entity.Property(e => e.FacturacionMesPasado2).HasColumnName("facturacion_mes_pasado2");

                entity.Property(e => e.FechaDeBaja)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha_de_baja");

                entity.Property(e => e.FechaDeCargaAbm)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha_de_carga_abm");

                entity.Property(e => e.Feedback).HasColumnName("feedback");

                entity.Property(e => e.IngresoASstt).HasColumnName("ingreso_a_sstt");

                entity.Property(e => e.IngresoASstt2).HasColumnName("ingreso_a_sstt2");

                entity.Property(e => e.Jefe).HasColumnName("jefe");

                entity.Property(e => e.Mes).HasColumnName("mes");

                entity.Property(e => e.MotivoSstt).HasColumnName("motivo_sstt");

                entity.Property(e => e.MotivoSstt3).HasColumnName("motivo_sstt3");

                entity.Property(e => e.NroTerminal).HasColumnName("nro_terminal");

                entity.Property(e => e.OrigenTerminal).HasColumnName("origen_terminal");

                entity.Property(e => e.ParaLlegarA10000).HasColumnName("para_llegar_a_10000");

                entity.Property(e => e.Provincia).HasColumnName("provincia");

                entity.Property(e => e.RazonSocial).HasColumnName("razon_social");

                entity.Property(e => e.Rubro).HasColumnName("rubro");

                entity.Property(e => e.Terminal).HasColumnName("terminal");

                entity.Property(e => e.Terminal2).HasColumnName("terminal2");

                entity.Property(e => e.TipoDeAlta).HasColumnName("tipo_de_alta");
            });

            modelBuilder.Entity<TasaIntere>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Descripciontasa)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("descripciontasa");

                entity.Property(e => e.Fechavencimiento)
                    .HasColumnType("date")
                    .HasColumnName("fechavencimiento");

                entity.Property(e => e.Tasa)
                    .HasColumnType("decimal(5, 2)")
                    .HasColumnName("tasa");
            });

            modelBuilder.Entity<Terminale>(entity =>
            {
                entity.HasNoKey();

                entity.ToTable("terminales");

                entity.Property(e => e.Estado).HasColumnName("estado");

                entity.Property(e => e.Fecha)
                    .HasColumnType("smalldatetime")
                    .HasColumnName("fecha");

                entity.Property(e => e.NombreDeFantasia).HasColumnName("nombre_de_fantasia");

                entity.Property(e => e.NroTerminal).HasColumnName("nro_terminal");

                entity.Property(e => e.Terminal).HasColumnName("terminal");
            });

            modelBuilder.Entity<TerminalesNew>(entity =>
            {
                entity.ToTable("Terminales_new");

                entity.HasIndex(e => e.NroTerminal, "UQ__Terminal__1F5A372FAB12A9BF")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("ID");

                entity.Property(e => e.Estado).HasMaxLength(50);
            });

            modelBuilder.Entity<TicketsClover>(entity =>
            {
                entity.ToTable("TicketsClover");

                entity.Property(e => e.FechaDePago).HasColumnType("datetime");

                entity.Property(e => e.Importe).HasColumnName("importe");
            });

            modelBuilder.Entity<Token>(entity =>
            {
                entity.ToTable("tokens");

                entity.Property(e => e.TokenId).HasColumnName("token_id");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_creacion");

                entity.Property(e => e.FechaExpiracion)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_expiracion");

                entity.Property(e => e.Token1)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("token");

                entity.Property(e => e.UsuarioId).HasColumnName("usuario_id");

                entity.HasOne(d => d.Usuario)
                    .WithMany(p => p.Tokens)
                    .HasForeignKey(d => d.UsuarioId)
                    .HasConstraintName("FK_tokens_usuarios");
            });

            modelBuilder.Entity<TokenCajero>(entity =>
            {
                entity.HasKey(e => e.TokenId)
                    .HasName("PK__TokenCaj__CB3C9E17CDD93FA0");

                entity.ToTable("TokenCajero");

                entity.Property(e => e.TokenId).HasColumnName("token_id");

                entity.Property(e => e.FechaCreacion)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_creacion");

                entity.Property(e => e.FechaExpiracion)
                    .HasColumnType("datetime")
                    .HasColumnName("fecha_expiracion");

                entity.Property(e => e.Token)
                    .HasMaxLength(255)
                    .HasColumnName("token");

                entity.Property(e => e.UsuariocajeroId).HasColumnName("usuariocajero_id");

                entity.HasOne(d => d.Usuariocajero)
                    .WithMany(p => p.TokenCajeros)
                    .HasForeignKey(d => d.UsuariocajeroId)
                    .HasConstraintName("FK_TokenCajero_UsuarioCajero");
            });

            modelBuilder.Entity<TokenPostulante>(entity =>
            {
                entity.HasKey(e => e.TokenId)
                    .HasName("PK__Token_Po__AA16D4A0EE2F73B9");

                entity.ToTable("Token_Postulante");

                entity.Property(e => e.TokenId).HasColumnName("Token_Id");

                entity.Property(e => e.FechaCreacion).HasColumnType("datetime");

                entity.Property(e => e.FechaExpiracion).HasColumnType("datetime");

                entity.Property(e => e.PostulanteId).HasColumnName("Postulante_Id");

                entity.Property(e => e.Token)
                    .HasMaxLength(255)
                    .IsUnicode(false);

                entity.HasOne(d => d.Postulante)
                    .WithMany(p => p.TokenPostulantes)
                    .HasForeignKey(d => d.PostulanteId)
                    .HasConstraintName("FK_Token_Postulante_Postulante");
            });

            modelBuilder.Entity<Usuario>(entity =>
            {
                entity.ToTable("usuarios");

                entity.HasIndex(e => e.Usuario1, "IX_usuarios")
                    .IsUnique();

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CambioClave)
                    .HasColumnName("cambio_clave")
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.Correo)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(80)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Password)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("password");

                entity.Property(e => e.TipoUsuario).HasColumnName("tipo_usuario");

                entity.Property(e => e.Usuario1)
                    .HasMaxLength(40)
                    .IsUnicode(false)
                    .HasColumnName("usuario");
            });

            modelBuilder.Entity<UsuarioCajero>(entity =>
            {
                entity.ToTable("UsuarioCajero");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Correo)
                    .HasMaxLength(50)
                    .HasColumnName("correo");

                entity.Property(e => e.Cuit)
                    .HasMaxLength(20)
                    .IsUnicode(false)
                    .HasColumnName("cuit");

                entity.Property(e => e.IdUsuario).HasColumnName("id_usuario");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(50)
                    .HasColumnName("nombre");

                entity.Property(e => e.Password)
                    .HasMaxLength(100)
                    .HasColumnName("password");

                entity.Property(e => e.TipoUsuario)
                    .HasMaxLength(20)
                    .HasColumnName("tipo_usuario");

                entity.HasOne(d => d.IdUsuarioNavigation)
                    .WithMany(p => p.UsuarioCajeros)
                    .HasForeignKey(d => d.IdUsuario)
                    .HasConstraintName("FK_UsuarioCajero_Usuarios");
            });

            modelBuilder.Entity<UsuarioNo>(entity =>
            {
                entity.HasKey(e => e.IdUsuario)
                    .HasName("PK__UsuarioD__645723A6A9730B06");

                entity.Property(e => e.IdUsuario).HasColumnName("idUsuario");

                entity.Property(e => e.CambioClave).HasColumnName("cambio_clave");

                entity.Property(e => e.Clave)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("clave");

                entity.Property(e => e.Correo)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("correo");

                entity.Property(e => e.EsActivo).HasColumnName("esActivo");

                entity.Property(e => e.IdRol).HasColumnName("idRol");

                entity.Property(e => e.Nombre)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("nombre");

                entity.Property(e => e.Puntaje).HasColumnName("puntaje");

                entity.Property(e => e.Telefono)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("telefono");

                entity.HasOne(d => d.IdRolNavigation)
                    .WithMany(p => p.UsuarioNos)
                    .HasForeignKey(d => d.IdRol)
                    .HasConstraintName("FK__UsuarioDo__idRol__4242D080");
            });

            modelBuilder.Entity<ZocoConect>(entity =>
            {
                entity.ToTable("ZocoConect");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Alias).IsUnicode(false);

                entity.Property(e => e.Banco).IsUnicode(false);

                entity.Property(e => e.Cbu)
                    .IsUnicode(false)
                    .HasColumnName("CBU");

                entity.Property(e => e.ClaveZocoConect).IsUnicode(false);

                entity.Property(e => e.IdUser).HasColumnName("id_user");

                entity.HasOne(d => d.IdUserNavigation)
                    .WithMany(p => p.ZocoConects)
                    .HasForeignKey(d => d.IdUser)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ZocoConect_Usuarios");
            });

            OnModelCreatingPartial(modelBuilder);
        }




        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
