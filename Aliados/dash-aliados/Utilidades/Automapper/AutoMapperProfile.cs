

using System.Globalization;
using AutoMapper;

using dash_aliados.Models.ViewModelsZoco;
using DocumentFormat.OpenXml.Drawing;
using Entity.VM;
using Entity.Zoco;

namespace dash_aliados.Utilidades.Automapper
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            #region Contratados


           
CreateMap<dash_aliados.Models.ViewModelsZoco.VMContratado, Entity.Zoco.Contratado>()
    .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
    .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre))
    .ForMember(dest => dest.Edad, opt => opt.MapFrom(src => src.Edad))
    .ForMember(dest => dest.Dni, opt => opt.MapFrom(src => src.Dni))
    .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => src.Direccion))
    .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
    .ForMember(dest => dest.Foto, opt => opt.Ignore())
    .ForMember(dest => dest.BusquedaId, opt => opt.MapFrom(src => src.BusquedaId))
    .ForMember(dest => dest.Puesto, opt => opt.MapFrom(src => src.Puesto))
    .ForMember(dest => dest.FechaEntrevista, opt => opt.MapFrom(src =>
        string.IsNullOrEmpty(src.FechaEntrevista) ? (DateTime?)null : DateTime.Parse(src.FechaEntrevista, CultureInfo.InvariantCulture)))
    .ForMember(dest => dest.FechaDeContratacion, opt => opt.MapFrom(src =>
        string.IsNullOrEmpty(src.FechaDeContratacion) ? (DateTime?)null : DateTime.Parse(src.FechaDeContratacion, CultureInfo.InvariantCulture)))
    .ForMember(dest => dest.TipoDeContratacion, opt => opt.MapFrom(src => src.TipoDeContratacion))
    .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
    .ForMember(dest => dest.FechaDeCierre, opt => opt.MapFrom(src =>
        string.IsNullOrEmpty(src.FechaDeCierre) ? (DateTime?)null : DateTime.Parse(src.FechaDeCierre, CultureInfo.InvariantCulture)))
    .ForMember(dest => dest.Observacion, opt => opt.MapFrom(src => src.Observacion));

            CreateMap<Entity.Zoco.Contratado, dash_aliados.Models.ViewModelsZoco.VMContratado>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre))
                .ForMember(dest => dest.Edad, opt => opt.MapFrom(src => src.Edad))
                .ForMember(dest => dest.Dni, opt => opt.MapFrom(src => src.Dni))
                .ForMember(dest => dest.Direccion, opt => opt.MapFrom(src => src.Direccion))
                .ForMember(dest => dest.Email, opt => opt.MapFrom(src => src.Email))
                .ForMember(dest => dest.Foto, opt => opt.Ignore()) 
                .ForMember(dest => dest.BusquedaId, opt => opt.MapFrom(src => src.BusquedaId))
                .ForMember(dest => dest.Puesto, opt => opt.MapFrom(src => src.Puesto))
                .ForMember(dest => dest.FechaEntrevista, opt => opt.MapFrom(src =>
                    src.FechaEntrevista.HasValue ? src.FechaEntrevista.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null))
                .ForMember(dest => dest.FechaDeContratacion, opt => opt.MapFrom(src =>
                    src.FechaDeContratacion.HasValue ? src.FechaDeContratacion.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null))
                .ForMember(dest => dest.TipoDeContratacion, opt => opt.MapFrom(src => src.TipoDeContratacion))
                .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                .ForMember(dest => dest.FechaDeCierre, opt => opt.MapFrom(src =>
                    src.FechaDeCierre.HasValue ? src.FechaDeCierre.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null))
                .ForMember(dest => dest.Observacion, opt => opt.MapFrom(src => src.Observacion));
            #endregion

            #region Busqueda
            CreateMap<VMBusqueda, Busqueda>()
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre))
             .ForMember(dest => dest.FechaPuesto, opt => opt.MapFrom(src =>
                string.IsNullOrEmpty(src.FechaPuesto) ? (DateTime?)null : DateTime.Parse(src.FechaPuesto, CultureInfo.InvariantCulture)))

                .ForMember(dest => dest.Provincia, opt => opt.MapFrom(src => src.Provincia))
                .ForMember(dest => dest.Cantidad, opt => opt.MapFrom(src => src.Cantidad))
                         .ForMember(dest => dest.FechaCierre, opt => opt.MapFrom(src => 
                string.IsNullOrEmpty(src.FechaCierre) ? (DateTime?)null : DateTime.Parse(src.FechaCierre, CultureInfo.InvariantCulture)))
              .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                .ForMember(dest => dest.CantidadDeSolicitantes, opt => opt.MapFrom(src => src.CantidadDeSolicitantes))
                .ForMember(dest => dest.Seleccionados, opt => opt.MapFrom(src => src.Seleccionados))
                .ForMember(dest => dest.Finalistas, opt => opt.MapFrom(src => src.Finalistas))
                .ForMember(dest => dest.Contratados, opt => opt.MapFrom(src => src.Contratados))
                .ForMember(dest => dest.Rechazados, opt => opt.MapFrom(src => src.Rechazados))
                     .ForMember(dest => dest.Puesto, opt => opt.MapFrom(src => src.Puesto))

                .ForMember(dest => dest.Observaciones, opt => opt.MapFrom(src => src.Observaciones));

            CreateMap<Busqueda, VMBusqueda>()
                .ForMember(dest => dest.Nombre, opt => opt.MapFrom(src => src.Nombre))
              .ForMember(dest => dest.FechaPuesto, opt => opt.MapFrom(src =>
                src.FechaPuesto.HasValue ? src.FechaPuesto.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null))
          .ForMember(dest => dest.Provincia, opt => opt.MapFrom(src => src.Provincia))
                .ForMember(dest => dest.Cantidad, opt => opt.MapFrom(src => src.Cantidad))
             .ForMember(dest => dest.FechaCierre, opt => opt.MapFrom(src =>
                src.FechaCierre.HasValue ? src.FechaCierre.Value.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture) : null))
            .ForMember(dest => dest.Estado, opt => opt.MapFrom(src => src.Estado))
                .ForMember(dest => dest.CantidadDeSolicitantes, opt => opt.MapFrom(src => src.CantidadDeSolicitantes))
                .ForMember(dest => dest.Seleccionados, opt => opt.MapFrom(src => src.Seleccionados))
                .ForMember(dest => dest.Finalistas, opt => opt.MapFrom(src => src.Finalistas))
                .ForMember(dest => dest.Contratados, opt => opt.MapFrom(src => src.Contratados))
                .ForMember(dest => dest.Rechazados, opt => opt.MapFrom(src => src.Rechazados))
                .ForMember(dest => dest.Observaciones, opt => opt.MapFrom(src => src.Observaciones))
                                     .ForMember(dest => dest.Puesto, opt => opt.MapFrom(src => src.Puesto))

                .ForMember(dest => dest.Token, opt => opt.Ignore());
            #endregion 
            #region ComentarioMapping

            CreateMap<ComentarioViewModel, Comentario>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.IdUsuario, opt => opt.MapFrom(src => src.IdUsuario))
                .ForMember(dest => dest.Comentario1, opt => opt.MapFrom(src => src.Comentario1))
                .ForMember(dest => dest.IdComentarioPadre, opt => opt.MapFrom(src => src.IdComentarioPadre))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.FechaCreacion))
                .ForMember(dest => dest.IdUsuarioRespuesta, opt => opt.MapFrom(src => src.IdUsuarioRespuesta))
                .ForMember(dest => dest.InverseIdComentarioPadreNavigation, opt => opt.Ignore())
                .ForMember(dest => dest.IdComentarioPadreNavigation, opt => opt.Ignore()); 

          
            CreateMap<Comentario, ComentarioViewModel>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                .ForMember(dest => dest.IdUsuario, opt => opt.MapFrom(src => src.IdUsuario))
                .ForMember(dest => dest.Comentario1, opt => opt.MapFrom(src => src.Comentario1))
                .ForMember(dest => dest.IdComentarioPadre, opt => opt.MapFrom(src => src.IdComentarioPadre))
                .ForMember(dest => dest.FechaCreacion, opt => opt.MapFrom(src => src.FechaCreacion))
                .ForMember(dest => dest.IdUsuarioRespuesta, opt => opt.MapFrom(src => src.IdUsuarioRespuesta));
            
            #endregion


            #region CheckAsesoresimagenMapping


            CreateMap<VMCheckAsesoresExtended, CheckAsesoresImagen>()
           .ForMember(dest => dest.IdUser, opt => opt.MapFrom(src => src.IdUser.HasValue ? src.IdUser.Value : 0))
           .ForMember(dest => dest.Latitud, opt => opt.MapFrom(src => src.Latitud))
           .ForMember(dest => dest.Longitud, opt => opt.MapFrom(src => src.Longitud))
           .ForMember(dest => dest.FechaHora, opt => opt.MapFrom(src => src.FechaHora))
           .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo))
           .ForMember(dest => dest.Observacion, opt => opt.MapFrom(src => src.Observacion))
           .ForMember(dest => dest.ObservacionAdmin, opt => opt.MapFrom(src => src.ObservacionAdmin))
           .ForMember(dest => dest.Imagen, opt => opt.Ignore())
           .ForMember(dest => dest.ImagenTerminal, opt => opt.Ignore())
           .ForMember(dest => dest.AudioFile, opt => opt.Ignore());
         
            #endregion

            #region CheckAsesoresMapping


            CreateMap<CheckAsesore, VMCheckAsesores>()
                .ForMember(dest => dest.IdUser, opt => opt.MapFrom(src => src.IdUser))
                .ForMember(dest => dest.Latitud, opt => opt.MapFrom(src => src.Latitud))
                .ForMember(dest => dest.Longitud, opt => opt.MapFrom(src => src.Longitud))
                .ForMember(dest => dest.FechaHora, opt => opt.MapFrom(src => src.FechaHora)) 
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo))
                .ForMember(dest => dest.Token, opt => opt.Ignore());
            CreateMap<VMCheckAsesores, CheckAsesore>()
                .ForMember(dest => dest.IdUser, opt => opt.MapFrom(src => src.IdUser))
                .ForMember(dest => dest.Latitud, opt => opt.MapFrom(src => src.Latitud))
                .ForMember(dest => dest.Longitud, opt => opt.MapFrom(src => src.Longitud))
                .ForMember(dest => dest.FechaHora, opt => opt.MapFrom(src => src.FechaHora)) 
                .ForMember(dest => dest.Tipo, opt => opt.MapFrom(src => src.Tipo))
                .ForMember(dest => dest.Id, opt => opt.Ignore());
            #endregion
            #region TasaInteres
            // Mapping from Noticia to VMNoticia
            CreateMap<TasaIntere, VMTasaInteres>()
                .ForMember(dest => dest.Fechavencimiento, opt => opt.MapFrom(src => src.Fechavencimiento.HasValue ? src.Fechavencimiento.Value.ToString("yyyy-MM-dd") : null))
                .ForMember(dest => dest.Descripciontasa, opt => opt.MapFrom(src => src.Descripciontasa))
                .ForMember(dest => dest.Tasa, opt => opt.MapFrom(src => src.Tasa.HasValue ? src.Tasa.Value.ToString() : null));

            // Mapping from VMNoticia to Noticia
            CreateMap<VMTasaInteres, TasaIntere>()
                .ForMember(dest => dest.Fechavencimiento, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Fechavencimiento) ? DateTime.Parse(src.Fechavencimiento) : (DateTime?)null))
                .ForMember(dest => dest.Descripciontasa, opt => opt.MapFrom(src => src.Descripciontasa))
                .ForMember(dest => dest.Tasa, opt => opt.MapFrom(src=>(int?)int.Parse(src.Tasa)));

            #endregion
            #region Noticia
            // Mapping from Noticia to VMNoticia
            CreateMap<Noticia, VMNoticia>()
                .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => src.Fecha.HasValue ? src.Fecha.Value.ToString("yyyy-MM-dd") : null))
                .ForMember(dest => dest.Noticia1, opt => opt.MapFrom(src => src.Noticia1))
                    .ForMember(dest => dest.TipoUsuario, opt => opt.MapFrom(src => src.TipoUsuario))

                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

            // Mapping from VMNoticia to Noticia
            CreateMap<VMNoticia, Noticia>()
                .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => !string.IsNullOrEmpty(src.Fecha) ? DateTime.Parse(src.Fecha) : (DateTime?)null))
                .ForMember(dest => dest.Noticia1, opt => opt.MapFrom(src => src.Noticia1))
                  .ForMember(dest => dest.TipoUsuario, opt => opt.MapFrom(src => src.TipoUsuario))
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));

            #endregion

            #region Usuarios zoco
            CreateMap<Usuario, VMUsuariosZoco>()
                .ForMember(destino =>
                    destino.Usuario,
                    opt => opt.MapFrom(origen => origen.Usuario1))
                .ForMember(destino =>
                    destino.Password,
                    opt => opt.MapFrom(origen => origen.Password))
                .ForMember(destino =>
                    destino.Nombre,
                    opt => opt.MapFrom(origen => origen.Nombre))
                .ForMember(destino =>
                    destino.TipoUsuario,
                    opt => opt.MapFrom(origen => origen.TipoUsuario))
                .ForMember(destino =>
                    destino.CambioClave,
                    opt => opt.MapFrom(origen => origen.CambioClave))
                .ForMember(destino =>
                    destino.Correo,
                    opt => opt.MapFrom(origen => origen.Correo))
                .ForMember(destino => destino.Token, opt => opt.Ignore())
                .ForSourceMember(origen => origen.Afips, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.CalificoComs, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.CheckAsesoresImagens, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.ComentarioIdUsuarioNavigations, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.ComentarioIdUsuarioRespuestaNavigations, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.DocumentosUsuarios, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.Facturantes, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.FormularioAlta, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.FormularioBajas, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.FormularioModificaciones, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.Iibbs, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.ListaTasaPreferecials, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.Tokens, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.UsuarioCajeros, opt => opt.DoNotValidate());

            CreateMap<VMUsuariosZoco, Usuario>()
                .ForMember(destino =>
                    destino.Usuario1,
                    opt => opt.MapFrom(origen => origen.Usuario))
                .ForMember(destino =>
                    destino.Password,
                    opt => opt.MapFrom(origen => origen.Password))
                .ForMember(destino =>
                    destino.Nombre,
                    opt => opt.MapFrom(origen => origen.Nombre))
                .ForMember(destino =>
                    destino.TipoUsuario,
                    opt => opt.MapFrom(origen => origen.TipoUsuario))
                .ForMember(destino =>
                    destino.CambioClave,
                    opt => opt.MapFrom(origen => origen.CambioClave))
                .ForMember(destino =>
                    destino.Correo,
                    opt => opt.MapFrom(origen => origen.Correo))
                .ForMember(destino => destino.Afips, opt => opt.Ignore())
                .ForMember(destino => destino.CalificoComs, opt => opt.Ignore())
                .ForMember(destino => destino.CheckAsesoresImagens, opt => opt.Ignore())
                .ForMember(destino => destino.ComentarioIdUsuarioNavigations, opt => opt.Ignore())
                .ForMember(destino => destino.ComentarioIdUsuarioRespuestaNavigations, opt => opt.Ignore())
                .ForMember(destino => destino.DocumentosUsuarios, opt => opt.Ignore())
                .ForMember(destino => destino.Facturantes, opt => opt.Ignore())
                .ForMember(destino => destino.FormularioAlta, opt => opt.Ignore())
                .ForMember(destino => destino.FormularioBajas, opt => opt.Ignore())
                .ForMember(destino => destino.FormularioModificaciones, opt => opt.Ignore())
                .ForMember(destino => destino.Iibbs, opt => opt.Ignore())
                .ForMember(destino => destino.ListaTasaPreferecials, opt => opt.Ignore())
                .ForMember(destino => destino.Tokens, opt => opt.Ignore())
                .ForMember(destino => destino.UsuarioCajeros, opt => opt.Ignore());
            #endregion
            #region Usuarios zoco - UsuarioCajero
            CreateMap<UsuarioCajero, VMUsuariosZoco>()
                .ForMember(destino =>
                    destino.Usuario,
                    opt => opt.MapFrom(origen => origen.Cuit))
                .ForMember(destino =>
                    destino.Password,
                    opt => opt.MapFrom(origen => origen.Password))
                .ForMember(destino =>
                    destino.Nombre,
                    opt => opt.MapFrom(origen => origen.Nombre))
                .ForMember(destino =>
                    destino.TipoUsuario,
                    opt => opt.MapFrom(origen => origen.TipoUsuario))
                .ForMember(destino =>
                    destino.Id,
                    opt => opt.MapFrom(origen => origen.Id))
                .ForMember(destino =>
                    destino.Correo,
                    opt => opt.MapFrom(origen => origen.Correo))
                .ForMember(destino => destino.Token, opt => opt.Ignore())
                .ForMember(destino => destino.UsuarioPadre, opt => opt.Ignore()) // Ignorar al mapear desde UsuarioCajero
                .ForSourceMember(origen => origen.IdUsuario, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.IdUsuarioNavigation, opt => opt.DoNotValidate())
                .ForSourceMember(origen => origen.TokenCajeros, opt => opt.DoNotValidate());

            CreateMap<VMUsuariosZoco, UsuarioCajero>()
                .ForMember(destino =>
                    destino.Cuit,
                    opt => opt.MapFrom(origen => origen.Usuario))
                .ForMember(destino =>
                    destino.Password,
                    opt => opt.MapFrom(origen => origen.Password))
                .ForMember(destino =>
                    destino.Nombre,
                    opt => opt.MapFrom(origen => origen.Nombre))
                .ForMember(destino =>
                    destino.TipoUsuario,
                    opt => opt.MapFrom(origen => origen.TipoUsuario))
                .ForMember(destino =>
                    destino.Id,
                    opt => opt.MapFrom(origen => origen.Id))
                .ForMember(destino =>
                    destino.Correo,
                    opt => opt.MapFrom(origen => origen.Correo))
                .ForMember(destino => destino.IdUsuario, opt => opt.Ignore())
                .ForMember(destino => destino.IdUsuarioNavigation, opt => opt.Ignore())
                .ForMember(destino => destino.TokenCajeros, opt => opt.Ignore());
            #endregion

            #region Mapeo VMUsuarioConect a VMUsuariosZoco

            CreateMap<VMUsuarioConect, VMUsuariosZoco>()
                .ForMember(destino => destino.Usuario, opt => opt.MapFrom(origen => origen.Usuario1))
                .ForMember(destino => destino.Id, opt => opt.MapFrom(origen => origen.IdUser)) // Mapear IdUser de VMUsuarioConect a Id en VMUsuariosZoco
                .ForMember(destino => destino.TipoUsuario, opt => opt.MapFrom(origen => origen.TipoUsuario))
                .ForMember(destino => destino.Correo, opt => opt.MapFrom(origen => origen.Correo));

            #endregion

            #region Mapeo Postulante a VMUsuariosZoco

            CreateMap<Postulante, VMUsuariosZoco>()
                .ForMember(destino => destino.Usuario, opt => opt.MapFrom(origen => origen.Dni))
                .ForMember(destino => destino.TipoUsuario, opt => opt.MapFrom(origen => origen.TipoUsuario));
               // .ForMember(destino => destino.Estado, opt => opt.MapFrom(origen => origen.Estado));

            #endregion




            #region comentariocom
            CreateMap<VMCalificoCom, CalificoCom>()
          
            .ForMember(dest => dest.NumCalifico, opt => opt.MapFrom(src => src.NumCalifico))
            .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.Descripcion))
            .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => DateTime.Parse(src.Fecha ?? string.Empty)));

            CreateMap<CalificoCom, VMCalificoCom>()
          
                .ForMember(dest => dest.NumCalifico, opt => opt.MapFrom(src => src.NumCalifico))
                .ForMember(dest => dest.Descripcion, opt => opt.MapFrom(src => src.Descripcion))
                .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => src.Fecha.HasValue ? src.Fecha.Value.ToString() : null));
            #endregion
            #region Comentarios
            CreateMap<VMCalifico, Califico>()
    .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => int.Parse(src.UsuarioId)))
    .ForMember(dest => dest.NumCalifico, opt => opt.MapFrom(src => (int?)int.Parse(src.NumCalifico)))
    .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => (DateTime?)DateTime.Parse(src.Fecha)))
    // Ignora el mapeo del campo 'Califico1' y 'Id' ya que no están en VMCalifico
    .ForMember(dest => dest.Califico1, opt => opt.Ignore())
    .ForMember(dest => dest.Id, opt => opt.Ignore());
            CreateMap<Califico, VMCalifico>()
                .ForMember(dest => dest.UsuarioId, opt => opt.MapFrom(src => src.UsuarioId.ToString()))
                .ForMember(dest => dest.NumCalifico, opt => opt.MapFrom(src => src.NumCalifico.HasValue ? src.NumCalifico.Value.ToString() : null))
                .ForMember(dest => dest.Fecha, opt => opt.MapFrom(src => src.Fecha.HasValue ? src.Fecha.Value.ToString("o") : null));
            // 'o' para el formato de fecha es ISO 8601



            #endregion
            #region BaseDashboard
            CreateMap<BaseDashboard, VMBaseDashboard>()
        .ForMember(dest => dest.NroDeComercio, opt => opt.MapFrom(src => src.NroDeComercio.ToString()))
        .ForMember(dest => dest.NroDeTarjeta, opt => opt.MapFrom(src => src.NroDeTarjeta.ToString()))
        .ForMember(dest => dest.TotalBruto, opt => opt.MapFrom(src => src.TotalBruto.ToString()))
        .ForMember(dest => dest.TotalDescuento, opt => opt.MapFrom(src => src.TotalDescuento.ToString()))
        .ForMember(dest => dest.TotalNeto, opt => opt.MapFrom(src => src.TotalNeto.ToString()))
        .ForMember(dest => dest.Cuotas, opt => opt.MapFrom(src => src.Cuotas.ToString()))
        .ForMember(dest => dest.NroDeAutorizacion, opt => opt.MapFrom(src => src.NroDeAutorizacion.ToString()))
        .ForMember(dest => dest.CostoFinanciero, opt => opt.MapFrom(src => src.CostoFinanciero.ToString()))
        .ForMember(dest => dest.CostoFinancieroEn, opt => opt.MapFrom(src => src.CostoFinancieroEn.ToString()))
        .ForMember(dest => dest.CostoPorAnticipo, opt => opt.MapFrom(src => src.CostoPorAnticipo.ToString()))
        .ForMember(dest => dest.ComisionConIva, opt => opt.MapFrom(src => src.ComisionConIva.ToString()))
        .ForMember(dest => dest.Arancel, opt => opt.MapFrom(src => src.Arancel.ToString()))
        .ForMember(dest => dest.Iva21, opt => opt.MapFrom(src => src.Iva21.ToString()))
        .ForMember(dest => dest.ImpuestoDebitoCredito, opt => opt.MapFrom(src => src.ImpuestoDebitoCredito.ToString()))
        .ForMember(dest => dest.Cuit, opt => opt.MapFrom(src => src.Cuit.ToString()))
        .ForMember(dest => dest.RetencionProvincial, opt => opt.MapFrom(src => src.RetencionProvincial.ToString()))
        .ForMember(dest => dest.RetencionGanacia, opt => opt.MapFrom(src => src.RetencionGanacia.ToString()))
        .ForMember(dest => dest.RetencionIva, opt => opt.MapFrom(src => src.RetencionIva.ToString()))
        .ForMember(dest => dest.TotalConDescuentos, opt => opt.MapFrom(src => src.TotalConDescuentos.ToString()))
        .ForMember(dest => dest.RetencionMunicipal, opt => opt.MapFrom(src => src.RetencionMunicipal.ToString()))
        .ForMember(dest => dest.RetencionImpositiva, opt => opt.MapFrom(src => src.RetencionImpositiva.ToString()))
        .ForMember(dest => dest.FechaAltaComercio, opt => opt.MapFrom(src => src.FechaAltaComercio.ToString()))
        .ForMember(dest => dest.Legajo, opt => opt.MapFrom(src => src.Legajo.ToString()))
        .ForMember(dest => dest.CodActividad, opt => opt.MapFrom(src => src.CodActividad.ToString()))
        .ForMember(dest => dest.AñoOp, opt => opt.MapFrom(src => src.AñoOp))
        .ForMember(dest => dest.MesOp, opt => opt.MapFrom(src => src.MesOp))
        .ForMember(dest => dest.AñoPago, opt => opt.MapFrom(src => src.AñoPago))
        .ForMember(dest => dest.MesPago, opt => opt.MapFrom(src => src.MesPago))
        .ForMember(dest => dest.SemanaMesPago, opt => opt.MapFrom(src => src.SemanaMesPago))
        .ForMember(dest => dest.SemanaMesOp, opt => opt.MapFrom(src => src.SemanaMesOp))
        .ForMember(dest => dest.DiaSemana, opt => opt.MapFrom(src => src.DiaSemana))
        .ForMember(dest => dest.TipoDeCredito, opt => opt.MapFrom(src => src.TipoDeCredito))
        .ForMember(dest => dest.TipoFinanciacion, opt => opt.MapFrom(src => src.TipoFinanciacion));

            CreateMap<VMBaseDashboard, BaseDashboard>()
    .ForMember(dest => dest.NroDeComercio, opt => opt.MapFrom(src => int.Parse(src.NroDeComercio)))
    .ForMember(dest => dest.NroDeTarjeta, opt => opt.MapFrom(src => int.Parse(src.NroDeTarjeta)))
    .ForMember(dest => dest.TotalBruto, opt => opt.MapFrom(src => decimal.Parse(src.TotalBruto)))
    .ForMember(dest => dest.TotalDescuento, opt => opt.MapFrom(src => decimal.Parse(src.TotalDescuento)))
    .ForMember(dest => dest.TotalNeto, opt => opt.MapFrom(src => decimal.Parse(src.TotalNeto)))
    .ForMember(dest => dest.Cuotas, opt => opt.MapFrom(src => int.Parse(src.Cuotas)))
    .ForMember(dest => dest.NroDeAutorizacion, opt => opt.MapFrom(src => int.Parse(src.NroDeAutorizacion)))
    .ForMember(dest => dest.CostoFinanciero, opt => opt.MapFrom(src => decimal.Parse(src.CostoFinanciero)))
    .ForMember(dest => dest.CostoFinancieroEn, opt => opt.MapFrom(src => decimal.Parse(src.CostoFinancieroEn)))
    .ForMember(dest => dest.CostoPorAnticipo, opt => opt.MapFrom(src => decimal.Parse(src.CostoPorAnticipo)))
    .ForMember(dest => dest.ComisionConIva, opt => opt.MapFrom(src => decimal.Parse(src.ComisionConIva)))
    .ForMember(dest => dest.Arancel, opt => opt.MapFrom(src => decimal.Parse(src.Arancel)))
    .ForMember(dest => dest.Iva21, opt => opt.MapFrom(src => decimal.Parse(src.Iva21)))
    .ForMember(dest => dest.ImpuestoDebitoCredito, opt => opt.MapFrom(src => decimal.Parse(src.ImpuestoDebitoCredito)))
    .ForMember(dest => dest.Cuit, opt => opt.MapFrom(src => long.Parse(src.Cuit)))
    .ForMember(dest => dest.RetencionProvincial, opt => opt.MapFrom(src => decimal.Parse(src.RetencionProvincial)))
    .ForMember(dest => dest.RetencionGanacia, opt => opt.MapFrom(src => decimal.Parse(src.RetencionGanacia)))
    .ForMember(dest => dest.RetencionIva, opt => opt.MapFrom(src => decimal.Parse(src.RetencionIva)))
    .ForMember(dest => dest.TotalConDescuentos, opt => opt.MapFrom(src => decimal.Parse(src.TotalConDescuentos)))
    .ForMember(dest => dest.RetencionMunicipal, opt => opt.MapFrom(src => decimal.Parse(src.RetencionMunicipal)))
    .ForMember(dest => dest.RetencionImpositiva, opt => opt.MapFrom(src => decimal.Parse(src.RetencionImpositiva)))
    .ForMember(dest => dest.FechaAltaComercio, opt => opt.MapFrom(src => DateTime.Parse(src.FechaAltaComercio)))
    .ForMember(dest => dest.Legajo, opt => opt.MapFrom(src => int.Parse(src.Legajo)))
    .ForMember(dest => dest.CodActividad, opt => opt.MapFrom(src => int.Parse(src.CodActividad)))
    .ForMember(dest => dest.AñoOp, opt => opt.MapFrom(src => src.AñoOp))
    .ForMember(dest => dest.MesOp, opt => opt.MapFrom(src => src.MesOp))
    .ForMember(dest => dest.AñoPago, opt => opt.MapFrom(src => src.AñoPago))
    .ForMember(dest => dest.MesPago, opt => opt.MapFrom(src => src.MesPago))
    .ForMember(dest => dest.SemanaMesPago, opt => opt.MapFrom(src => src.SemanaMesPago))
    .ForMember(dest => dest.SemanaMesOp, opt => opt.MapFrom(src => src.SemanaMesOp))
    .ForMember(dest => dest.DiaSemana, opt => opt.MapFrom(src => src.DiaSemana))
    .ForMember(dest => dest.TipoDeCredito, opt => opt.MapFrom(src => src.TipoDeCredito))
    .ForMember(dest => dest.TipoFinanciacion, opt => opt.MapFrom(src => src.TipoFinanciacion));

            #endregion

            //#region ReporteMensual
            //CreateMap<ReporteMensual, VMReporteMensual>()
            //.ForMember(dest => dest.FechaOperacion, opt => opt.MapFrom(src => src.FechaOperacion.ToString()))
            //.ForMember(dest => dest.FechaDePresentacion, opt => opt.MapFrom(src => src.FechaDePresentacion.ToString()))
            //.ForMember(dest => dest.FechaDePago, opt => opt.MapFrom(src => src.FechaDePago.ToString()))
            //.ForMember(dest => dest.NroDeCupon, opt => opt.MapFrom(src => src.NroDeCupon.ToString()))
            //.ForMember(dest => dest.NroDeComercio, opt => opt.MapFrom(src => src.NroDeComercio.ToString()))
            //.ForMember(dest => dest.NroDeTarjeta, opt => opt.MapFrom(src => src.NroDeTarjeta.ToString()))
            //.ForMember(dest => dest.Moneda, opt => opt.MapFrom(src => src.Moneda))
            //.ForMember(dest => dest.TotalBruto, opt => opt.MapFrom(src => src.TotalBruto.ToString()))
            //.ForMember(dest => dest.TotalDescuento, opt => opt.MapFrom(src => src.TotalDescuento.ToString()))
            //.ForMember(dest => dest.TotalNeto, opt => opt.MapFrom(src => src.TotalNeto.ToString()))
            //.ForMember(dest => dest.Cuotas, opt => opt.MapFrom(src => src.Cuotas.ToString()))
            
            //.ForMember(dest => dest.TipoDeOperacion, opt => opt.MapFrom(src => src.TipoDeOperacion))
            //.ForMember(dest => dest.CostoFinanciero, opt => opt.MapFrom(src => src.CostoFinanciero.ToString("N2")))




        }
    }
}
