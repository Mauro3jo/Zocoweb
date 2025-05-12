using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
//using DAL.DBContext;
using Microsoft.EntityFrameworkCore;
using DAL.Interfaces;
using DAL.Implementacion;

using BLL.InterfacesZoco;
using DAL.DBContext;
using BLL.ImplemtacionZoco;
using BLL.ImplementacionZoco;
using Entity.Zoco;

namespace IOC
{
    public static class Dependencia
    {

        public static void InyectarDependencia(this IServiceCollection services, IConfiguration Configuration)
        {

            services.AddDbContext<zocowebContext>(options =>
            {
                options.UseSqlServer(Configuration.GetConnectionString("CadenaSQL"));
            });

            services.AddTransient(typeof(IGenericRepository<>), typeof(GenericRepository<>));

            services.AddScoped<IUsuarioZocoService, UsuarioZocoService>();
            services.AddScoped<IBaseDashboardService, BaseDashboardService>();
            services.AddScoped<IInflacionService, InflacionService>();
            services.AddScoped<ICalificoComentarioService, CalificoService>();
            services.AddScoped<INotificacionService, NotificacionService>();
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<ITasaInteresService, TasaInteresService>();

            services.AddScoped<IInicioAsesoresService, InicioAsesoresService>();

            services.AddScoped<IBaseStockService, BaseStockService>();
            services.AddScoped<IAnalisisService, AnalisisService>();
            services.AddScoped<IChechAsesores, CheckAsesoresService>();
            services.AddScoped<ICheckImagenService, CheckAsesoresImagenService>();
            services.AddScoped<IComentarioService, ComentarioService>();
            services.AddScoped<IBusquedaService, BusquedaService>();
            services.AddScoped<IContratadoService, ContratadoService>();
            services.AddScoped<IPuestoService, PuestoService>();
            services.AddScoped<IPDFService, PDFService>();
            services.AddScoped<IComandaService, ComandaService>();
            services.AddScoped<IFormularioAltaService, FormularioAltaService>();
            services.AddScoped<IFormularioModificacionService, FormularioModificacionService>();
            services.AddScoped<IFormularioBajaService, FormularioBajaService>();
            services.AddScoped<ICalculadoraService, CalculadoraService>();

            services.AddScoped<IAFIPService, AFIPService>();
            services.AddScoped<IFacturanteService, FacturanteService>();
            services.AddScoped<IIIBBService, IIBBService>();

            services.AddScoped<IbancoService, BancoService>();
            services.AddScoped<ITokenCajeroService, TokenCajeroService>();

            services.AddScoped<IUsuarioCajeroService, UsuarioCajeroService>();
            services.AddScoped<IRubroService, RubroService>();
            services.AddScoped<IComercioService, ComercioService>();
            services.AddScoped<IAltaService, AltaService>();
            services.AddScoped<IHistorialCRMService, HistorialCRMService>();
            services.AddScoped<INroComercioService, NroComercioService>();
            services.AddScoped<IBajaService, BajaService>();
            services.AddScoped<ILegajoService, LegajoService>();
            services.AddScoped<IReporteMensualService, ReporteMensualService>();
            services.AddScoped<ICloverService, CloverService>();
            services.AddScoped<IPanelControlInterno, PanelGestorInternoService>();
            services.AddScoped<IPanelInternoCalidad, PanelInternoCalidadService>();
            services.AddScoped<IOrigenService, OrigenService>();
            services.AddScoped<IDestinoService, DestinoService>();
            services.AddScoped<IZocoConectService, ZocoConectService>();
            services.AddScoped<IReferidosService, ReferidosService>();
            services.AddScoped<IFidelizacionService, FidelizacionService>();
            services.AddScoped<IFidelizacionService, FidelizacionService>();
            services.AddScoped<IPDFService, PDFService>();
            services.AddScoped<ITicketCloverService, TicketCloverService>();
            services.AddScoped<IFilasCloverTicketService, FilasCloverTicketService>();
            services.AddScoped<IFilasCloverQrService, FilasCloverQrService>();
            services.AddScoped<INotificacionResumenService, NotificacionResumenService>();
            services.AddScoped<IPostulantesService, PostulanteService>();
            services.AddScoped<ITokenPostulanteService, TokenPostulanteService>();
            services.AddScoped<IPreguntasService, PreguntasService>();
            services.AddScoped<IRespuestasService, RespuestasService>();
            services.AddScoped<IPostulantePuestoService, PostulantePuestoService>();
            services.AddScoped<ICuestionariosService, CuestionarioService>();
            services.AddScoped<ICuestionarioPostulane, CuestionarioPostulante>();
            services.AddScoped<IRespuestasUsuariosService,RespuestaUsuarioService>();
            services.AddScoped<ICargosAnteriores, CargosAnterioresService>();
            services.AddScoped<IReferenciaService, ReferenciaService>();
            services.AddScoped<IEducacionService, EducacionService>();
            services.AddScoped<IAptitudService, AptitudService>();
        }
    }
}
