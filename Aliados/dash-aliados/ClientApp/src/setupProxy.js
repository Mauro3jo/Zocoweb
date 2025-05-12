const { createProxyMiddleware } = require('http-proxy-middleware');
const { env } = require('process');

const target = env.ASPNETCORE_HTTPS_PORT ? `https://localhost:${env.ASPNETCORE_HTTPS_PORT}` :
    env.ASPNETCORE_URLS ? env.ASPNETCORE_URLS.split(';')[0] : 'http://localhost:7702';

// querido nuevo colega programador
//
// debo dejarte, porque? no puedo decirte
// a donde ire?, todavia no tire cv, 
// como llegare? ah todavia no lo decido
//
// Pero puedo decirte algo, cada vez que escuche el viento, 
// susurrara TODA TUYA ROBERTO!

const context = [
    "/api/acceso/login", 
    "/api/datosinicio/base",
    "/api/datosinicio/lista",
    "/api/analisis/analisis",
    "/api/califico/calificocom",
    "/api/califico/califico",
    "/api/califico/calificomes",
    "/api/contablidad/contabilidad",
    "/api/cupones/cupones",
    "/api/excel/excel",
    "/api/bienvenidopanel/bienvenidopanel",
    "/api/notificacion/noticias",//eliminarnoticia
    "/api/notificacion/eliminarnoticia",
    "/api/pdf/pdf",
    "/api/acceso/cambiarClave", 
    "/api/acceso/logout",
    "/api/token/token",
    "/api/tasainteres/tasainteres",
    "/api/liquidaciones/crearusuario",
    "/api/liquidaciones/editarusuario", 
    "/api/liquidaciones/restaurarclave", 
    "/api/liquidaciones/listausuarios",
    "/api/datosinicioasesores/inicioasesores",
    "/api/basestock/basestock",
    "/api/analisisasesores/analisisasesores",
    "/api/analisisasesores/excelasesores",
    "/api/calculadora/calculadora",
    "/api/calculadora/calculadorausuarios",//datostarjeta
    "/api/calculadora/datostarjeta",//datostarjeta plazos
    "/api/calculadora/plazos",//datostarjeta plazos
    "/api/geo/check",
    "/api/geo/checklista", 
    "/api/geo/checkimagenyaudio",
    "/api/geo/cofirmarcheck",
    "/api/geo/checklistaimagen", 
    "/api/geo/checklistaimagenasesor",
    "/api/geo/agregarobservacionadmin",
    "/api/notificacion/crearnoticia", 
    "/api/notificacion/editarnoticia",
    "/api/califico/listacalificacion",
    "/api/chat/chatnuevo",
    "/api/chat/listartodos",
    "/api/chat/listarporusuario",
    "/api/datosinicioasesores/listarAsesores", 
    "/api/chat/listarparausuario",
    "/api/token/nohaydatos", 
    "/api/excel/exceladmin", // excelcomanda
    "/api/excel/excelcomanda",
    "/api/busqueda/Crear", 
    "/api/busqueda/Editar",
    "/api/busqueda/Listar",
    "/api/busqueda/grafica",//grafica Editar
    "/api/puesto/Crear",
    "/api/puesto/Listar",
    "/api/puesto/Editar",
    "/api/contratado/Crear",
    "/api/contratado/Listar",
    "/api/contratado/contratados",
    "/api/contratado/Editar",
    "/api/busqueda/panelrecultamiento", //pdfordenpago
    "/api/pdf/pdfordenpago",
    "/api/pdfaliado/pdfordenes",//descargarpdfordenes
    "/api/pdfaliado/descargarpdfordenes",
    "/api/comanda/CrearComanada",
    "/api/comanda/CrearComanada2",
    "/api/comanda/EditarComanda",
    "/api/comanda/ListarComandasPorUsuario",
    "/api/comanda/ListarComandasPorGestor",
    "/api/comanda/ListarTodasComandas",
    "/api/comanda/listaconsulta",//resumenUltimosCincoDias  listaconsulta CrearComanada2 FinalizarComanda
    "/api/comanda/FinalizarComanda",//resumenUltimosCincoDias  listaconsulta CrearComanada2 FinalizarComanda

    "/api/pdfaliado/resumenUltimosCincoDias",//resumenUltimosCincoDias
    "/api/usuarios/buscarusuario", //buscargestor
    "/api/usuarios/buscargestor",
    "/api/horas/horas",

    "/api/geo/DescargarAudio", 

    "/api/formulario/formularioaltacrear",
      "/api/formulario/ListarFormulariasAltaporId",
    "/api/formulario/ListarTodosFormulariosAlta",
    "/api/formulario/EditarFomularioAlta",    ///descargarformularioalta
    "/api/formulario/descargarformularioalta",

    "/api/formulario/formulariomodificarcrear",
    "/api/formulario/EditarFomularioModificaciones",
    "/api/formulario/ListarFormulariasModificacionesporId",
    "/api/formulario/ListarTodosFormulariosModificaciones",
    "/api/formulario/descargarformulariomodificar",

    "/api/formulario/formulariobajacrear",
    "/api/formulario/EditarFomularioBaja",
    "/api/formulario/ListarFormulariasBajaporId",
    "/api/formulario/ListarTodosFormulariosBaja", //calculadorausuarios
    "/api/formulario/descargarformulariobaja",



    "/api/AFIP/pdfafip",
    "/api/AFIP/descargarafiafip",
    "/api/AFIP/resumenUltimosCincoDias",
    "/api/Facturante/pdffacturante",
    "/api/Facturante/descargarpdffacturante",
    "/api/Facturante/resumenUltimosCincoDias",
    "/api/IIBB/pdfiibb",
    "/api/IIBB/descargarpdfiibb",
    "/api/IIBB/resumenUltimosCincoDias",

    "/api/listaafip/listaafip",
    "/api/Banco/lista",
    "/api/Rubro/lista",
    "/api/Comercio/lista",

    // apis para el usuario cajero
    "/api/empleado/crearusuario",  ///listausuarios editarusuario restaurarclave
    "/api/empleado/listausuarios",
    "/api/empleado/editarusuario",
    "/api/empleado/restaurarclave",

    "/api/terminal/obtenerterminales",

    "/api/altas/agregaralta",
    "/api/altas/CRM", //editarcrmalta
    "/api/altas/editarcrmalta",


    "/api/excel/excelcrm",

    "/api/bajas/agregabaja",   //agregamodificacion reportemensual   editarcrmbajas
    "/api/bajas/editarcrmbajas",
    "/api/modificacion/agregamodificacion",
    "/api/bajas/CRM",
    "/api/reportemensual/listartodos",
    "/api/reportemensual/reportemensual",
    "/api/reportemensual/evolucionterminales",

    "/api/abm/baja", // sstt
    "/api/abm/sstt",
    "/api/abm/ssttcambio",
    "/api/abm/bajaycambioclover", ///alta
    "/api/abm/alta",

    "/api/legajo/lista",
    "/api/comercio/listarubros",
    "/api/usuarios/obtenergestoresyasesores",
    "/api/provincia/listaprovincia",
    "/api/altas/altacrm", //listacompleto
    "/api/legajo/listacompleto",//crearlegajo
    "/api/legajo/crearlegajo", //listanrocomercio
    "/api/comercio/listanrocomercio",//obtenerlegajoporiduser panelinternomes
    "/api/legajo/obtenerlegajoporiduser",
    "/api/comercio/crearcomercio",
    "/api/calidad/panelinternogestores",
    "/api/calidad/panelinternomes",
    "/api/calidad/crearnuevodatopanel",
    "/api/abm/obteneraliados",
    "/api/calidad/listadias",
    "/api/excel/excelcrmsemanal",
    "/api/abm/desvinculacion",
    "/api/abm/cambiotitularidad",
    "/api/excel/excelcrmmensual",
    "/api/historial/lista",
    "/api/excel/excelfacturacion",
    "/api/panelinternocalidad/crearnuevodatopanel",
    "/api/panelinternocalidad/listadias",
    "/api/usuarios/obtenerusuarios",
    "/api/historial/listahistorialcrmporid",
    "/api/panelinternocalidad/editardatopanel",
    "/api/origendestino/obtenerorigenydestino",
    "/api/origendestino/Crearorigen",
    "/api/origendestino/Creardestino",
    "/api/historial/nuevohistorial",
    "/api/excel/excelfacturacionmensualdia",
    "/api/facturacion/facturacionpagina1",//facturacionpagina2
    "/api/facturacion/facturacionpagina2",
    "/api/facturacion/bienvenidopanelfacturacion",
    "/api/resumenmensual/resumenapi1",
    "/api/resumenmensual/resumenFacturacionPorTerminales",
    "/api/resumenmensual/barracomparativa",
    "/api/resumenmensual/facturacionPorTerminalSemana",
    "/api/resumenmensual/excelcrmsemanal",
    "/api/resumenaliado/gestionesaliados",
    "/api/resumenaliado/gestionesaliadosfacturacion",
    "/api/abm/obtenercomercios",
    "/api/zococonect/obtenerzococonect",
    "/api/zococonect/registrarzococonectaliado",
    "/api/zococonect/registrarzococonectnuevo",
    "/api/zococonect/agregarreferidos",
        "/api/fidelizacion/agregarfidelizacion",
    "/api/fidelizacion/eliminarFidelizacion",
    "/api/fidelizacion/listafidelizacion",
    "/api/fidelizacion/agregarobservacion",
    "/api/token/obtenerid",
    "/api/calidad/editarpanel",
    "/api/resumenmensual/barracomparativaprovincia",
    "/api/zococonect/agregarcomprobante",
    "/api/zococonect/listausuarioszococonect",
    "/api/zococonect/calcularcomision",
    "/api/zococonect/descargarcomprobante",
    "/api/clover/subirdatosclover",
    "/api/pdf/listaordenespago",
    "/api/pdf/descargarordenpago",
    "/api/clover/obtenerdatos",
    "/api/calidad/modalcuit",
    "/api/clover/obtenerresumendiario",
    "/api/clover/obtenerresumenmensual",
    "/api/calidad/zocoresumen",
    "/api/calculadora/calculadoraliquidaciones",
    "/api/calculadora/calculadoraliquidacionespayway",
    "/api/inicioahorro/inicioahorro",
    "/api/token/demo",
    "/api/resumenaliado/ahorroaliado",
    "/api/postulantes/crearpostulante",
    "/api/puesto/Listapuestospostulantes",
    "/api/PostulantePuesto/crearpostulantepuesto",
    "/api/cuestionario/crear",//obtenercuestionarios
    "/api/cuestionario/obtenercuestionarios",
    "/api/preguntas/crearpregunta",
    "/api/preguntas/obtenerpreguntas",
    "/api/respuestas/crearrespuesta",
    "/api/respuestas/obtenerrespuesta",
    "/api/preguntas/editarpregunta",
    "/api/postulantecuestionario/crearpostulantepuesto",
    "/api/preguntas/obtenerpreguntaporcuestionarioid",
    "/api/respuestas/obtenerrespuestasporpreguntaid",
    "/api/preguntas/eliminarpregunta",
    "/api/respuestas/editarrespuesta",
    "/api/respuestas/eliminarrespuesta",
    "/api/cuestionario/obtenercuestionariosporpuestoid",
    "/api/preguntas/obtenerpreguntaporcuestionarioidpostulante",
    "/api/respuestausuario/guardarrespuestapostulante",
    "/api/postulantecuestionario/crearcuestionariopostulante",
    "/api/postulantecuestionario/finalizarcuestionario",
    "/api/cuponesaliado/cuponesaliado",
    "/api/excel/excelreporte",

    "/api/puesto/resultadospostulantes",
    "/api/abm/extraviada",
    "/api/excel/anual",

];

module.exports = function (app) {
    const appProxy = createProxyMiddleware(context, {
        target: target,
        secure: false,
        headers: {
            Connection: 'Keep-Alive'
        }
    });

    app.use(appProxy);
};
