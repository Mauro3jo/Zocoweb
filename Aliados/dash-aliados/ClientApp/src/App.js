// import hoja general de estilos (css)
import "./custom.css";

// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "./context/DarkModeContext";
import { CRMProvider } from "./context/CRMContext";

// import librerias
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// import componentes
import NuevoNavReact from "./components/NuevoNavReact";
import SidebarReact from "./components/SidebarReact";
import ScrollToTopButton from "./components/ScrollToTopButton";

// import vistas
import Home from "./views/landing/Home";
import Inicio from "./views/aliados/Inicio";
import Contabilidad from "./views/aliados/Contabilidad";
import Analisis from "./views/aliados/Analisis";
import Tickets from "./views/aliados/Tickets";
import Calificar from "./views/aliados/Calificar";
import Login from "./views/aliados/Login";
import RedirectToHome from "./views/RedirectToHome";
import Liquidaciones from "./views/liquidaciones/Liquidaciones";
import CriteriosAsesores from "./views/asesores/CriteriosAsesores";
import CuadroComparativaAsesores from "./views/asesores/CuadroComparativaAsesores";
import DescargasAsesores from "./views/asesores/DescargasAsesores";
import CheckInAsesores from "./views/asesores/CheckInAsesores";
import Admin from "./views/administracion/Admin";
import AdminNotificaciones from "./views/administracion/AdminNotificaciones";
import AdminCalificaciones from "./views/administracion/AdminCalificaciones";
import AcademyAsesores from "./views/asesores/AcademyAsesores";
import ChatAsesores from "./views/asesores/ChatAsesores";
import AdminChat from "./views/administracion/AdminChat";
import BuscadorCupones from "./views/liquidaciones/BuscadorCupones";
import AdminBlanqueos from "./views/administracion/AdminBlanqueos";
import ReclutamientoBusqueda from "./views/reclutamiento/ReclutamientoBusqueda";
import ReclutamientoPuestos from "./views/reclutamiento/ReclutamientoPuestos";
import ReclutamientoContratados from "./views/reclutamiento/ReclutamientoContratados";
import OrdenDePago from "./views/liquidaciones/OrdenDePago";
import GestorCheck from "./views/gestoria/GestorCheck";
import GestorAcademy from "./views/gestoria/GestorAcademy";
import Consultas from "./views/aliados/Consultas";
import AdminPeticiones from "./views/administracion/AdminPeticiones";
import GestorPeticiones from "./views/gestoria/GestorPeticiones";
import LiquidacionesPeticiones from "./views/liquidaciones/LiquidacionesPeticiones";
import CalculadoraVista from "./views/aliados/CalculadoraVista"; 
import GestorFormulario from "./views/gestoria/GestorFormulario";
import ProspectoAsesores from "./views/asesores/ProspectoAsesores";
import VisitasAsesores from "./views/asesores/VisitasAsesores";
import GestorSimulador from "./views/gestoria/GestorSimulador";
import GestorCalculadora from "./views/gestoria/GestorCalculadora";
import CalculadoraAsesores from "./views/asesores/CalculadoraAsesores";
import LiquidacionesAfip from "./views/liquidaciones/LiquidacionesAfip";
import LiquidacionesFacturantes from "./views/liquidaciones/LiquidacionFacturantes";
import LiquidacionesIIBB from "./views/liquidaciones/LiquidacionesIIBB";
import GestorDescargas from "./views/gestoria/GestorDescargas";
import AdminFormularios from "./views/administracion/AdminFormularios";
import CajeroInicio from "./views/cajero/CajeroInicio";
import CajeroConsultas from "./views/cajero/CajeroConsultas";
import AdminEmpleado from "./views/administracion/AdminEmpleado";
import AdminLegajos from "./views/administracion/AdminLegajos";
import AdminCRM from "./views/administracion/AdminCRM";
import ReporteMensual from "./views/reporte/ReporteMensual";
import AdminNroComercio from "./views/administracion/AdminNroComercio";
import CalidadAdmin from "./views/Calidad/Admin";
import CalidadLegajos from "./views/Calidad/AdminLegajos";
import CalidadCRM from "./views/Calidad/AdminCRM";
import CalidadPeticiones from "./views/Calidad/AdminPeticiones";
import CalidadNroComercio from "./views/Calidad/AdminNroComercio";
import CalidadPanelInterno from "./views/Calidad/PanelInterno";
import CalidadPanelControlINterno from "./views/Calidad/PanelControlInterno";
import AdminCupones from "./views/administracion/AdminCupones";
import AdminPanelInterno from "./views/administracion/AdminPanelInterno";
import HistorialCRM from "./views/Calidad/HistorialCRM";
import AdminSimulador from "./views/administracion/AdminSimulador";
import AdminComparador from "./views/administracion/AdminComparador";
import PanelAuditoria from "./views/Calidad/PanelAuditoria";
import InicioFlorencia from "./views/panelFlorencia/Inicio";
import GraficosEstadisticas from "./views/panelFlorencia/GraficosEstadisticas";

import AbmPanelInterno from "./views/abm/PanelInterno";
import AbmBlanqueo from "./views/abm/Blanqueo";
import AbmComparador from "./views/abm/Comparador";
import AbmSimulador from "./views/abm/Simulador";
import AbmSimuladorLiquidaciones from "./views/abm/AbmSimuladorLiquidaciones";
import AbmResumenAliado from "./views/abm/AbmResumenAliado";
import AbmNroComercio from "./views/abm/NroComercio";
import AbmCupones from "./views/abm/Cupones";
import AbmListaOrdenPago from "./views/abm/OrdenesPago";
import AbmLegajos from "./views/abm/Legajo";
import Reportemensual from "./views/panelFlorencia/ReporteMensual";
import AbmCRM from "./views/abm/AbmCRM"
import { FacturacionProvider } from './context/FacturacionContext';
import ReporteSemanal from "./views/panelFlorencia/ReporteSemanal";
import AdminResumenAliado from "./views/administracion/AdminResumenAliado";
import InicioZocoConect from "./views/zococonect/Inicio"; //RegistrarZocoConectAliado
import RegistroZocoConectAliado from "./views/zococonect/RegistrarZocoConectAliado";
import RegistroZocoConect from "./views/zococonect/RegistrarZocoConect";
import AgregarReferidos from "./views/zococonect/AgregarReferidos";
import Fidelizacion from "./views/panelFlorencia/Fidelizacion";
import AdminFidelizacion from "./views/administracion/AdminFidelizacion";
import { FidelizacionProvider } from './context/FidelizacionContext';
//import listausuarioszococonect from "./views/zococonect/ListaUsuarioZocoConect";
import ListaUsuarioZocoConect from "./views/zococonect/ListaUsuarioZocoConect";
import SubirDatosClover from "./views/panelFlorencia/SubirDatoClover";
import ListaOrdenPago from "./views/administracion/AdminListaOrdenPago";
import { AdminProvider } from './context/AdminContext';
import Cupones from "./views/panelFlorencia/Cupones";
import testpdf from "./views/zococonect/TestPdfUser";
import TestPdfUser from "./views/zococonect/TestPdfUser";
import { ReporteCloverProvider } from './context/ReporteCloverContext';
import ReporteSemanalClover from './views/panelFlorencia/ReporteSemanalClover';
import ReporteMensualClover from './views/panelFlorencia/ReporteMensualClover'
import SimuladorLIquidacion from "./views/simuladorOrden/SimuladorLiquidacion";
import PDFPage from "./views/simuladorOrden/PDFPage";
import { InicioAhorroProvider } from './context/InicioAhorroContext';
import PruebaVacios from "./views/zococonect/PruebaVacios";
import RegistroPostulante from "./views/postulante/RegistroPostulante";
import InicioPostulante from "./views/postulante/InicioPostulante";
import Tests from "./views/postulante/Tests";
import ReclutamientoCuestionarios from "./views/reclutamiento/ReclutamientoCuestionarios";
import CuestionariosPostulante from "./views/postulante/CuestionariosPostulante"
import Formulario from "./views/postulante/Formulario";
import CuponesAliado from "./views/aliados/CuponesAliado";
import ReclutamientoPostulantesCuestionarios from "./views/reclutamiento/ReclutamientoPostulantesCuestionarios";
import { PostulacionesProvider } from './context/PostulacionesContext';

// querido colega programador
//
// cuando escribi este codigo, solo Dios y yo
// sabiamos como funcionaba.
// Ahora, ¡solo Dios lo sabe!
//
// Asi que si esta tratando de "optimizarlo"
// y fracasa (seguramente), por favor,
// incremente el contador a continuacion
// como una advertencia para su siguiente colega:
// total_horas_perdida_aqui= 108
// aiuda martin tengo que hacer las vistas yo culiao jajajaj
// nueva historia, me recontra cago en el pingo martin culiao
// cada dia mas putita
// re culo roto las de abm
// los diseñadores son todos putos
//F por el roquesito fue criado como cerdo para el matadero
function App() {
  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);
  // estado para mostrar el sidebar y el navbar
  const [navVisible, showNavbar] = useState(false);
  // Wrapper Component para usar useLocation
  function UseLocationComponent({ children }) {
    let location = useLocation();
    // Actualiza la visibilidad del navbar y sidebar basado en la ruta
    useEffect(() => {
      const hideOnRoutes = ["/", "/login", "*", "/Admin/pdforden","/registropostulante", "/postulante/inicio", "/postulante/cuestionarios", "/postulante/respondercuestionario"];
      showNavbar(!hideOnRoutes.includes(location.pathname));
    }, [location]);

    return children;
  }

    return (
        <InicioAhorroProvider>
            <PostulacionesProvider>

        <ReporteCloverProvider>
        <AdminProvider>
        <FacturacionProvider>
            <FidelizacionProvider>
                <CRMProvider>
              
                        
    <BrowserRouter>
      <UseLocationComponent>
        <div
          className={darkMode ? "container-dark" : "container-light bg-gris"}
        >
          <div className="App">
            {navVisible && (
              <div>
                <div
                  className={
                    darkMode
                      ? "container-dark d-xl-none d-block breackpoint-nav "
                      : "container-light bg-gris d-xl-none d-block breackpoint-nav "
                  }
                >
                  <NuevoNavReact />
                </div>
                <article className="d-xl-block d-none bg-gris">
                  <SidebarReact visible={navVisible} show={showNavbar} />
                </article>
              </div>
            )}
            <ScrollToTopButton />
            <Routes>
              {/* Tus rutas  */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/registropostulante" element={<RegistroPostulante/>} />
              <Route
                path="/aliados/inicio"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Inicio />
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/contabilidad"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Contabilidad />
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/analisis"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Analisis />{" "}
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/cupones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Tickets />
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/calificar"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Calificar />
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/consultas"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Consultas />
                    </div>
                  </section>
                }
              />
              <Route
                path="/aliados/calculadora"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CalculadoraVista />
                    </div>
                  </section>
                }
                                                    />     <Route
                                                        path="/aliados/cuponesaliado"
                                                        element={
                                                            <section
                                                                className={navVisible ? "page-with-navbar " : "page  "}
                                                            >
                                                                <div
                                                                    className={
                                                                        darkMode
                                                                            ? " container-dark "
                                                                            : "container-light bg-gris"
                                                                    }
                                                                >
                                                                    <CuponesAliado />
                                                                </div>
                                                            </section>
                                                        }
                                                    />
              {/* rutas para el cajeros */}
              <Route
                path="/cajero/inicio"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CajeroInicio />
                    </div>
                  </section>
                }
              />
              <Route
                path="/cajero/consultas"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CajeroConsultas />
                    </div>
                  </section>
                }
              />
              {/* rutas liquidaciones  */}
              <Route
                path="/liquidaciones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Liquidaciones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/Buscador/Cupones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <BuscadorCupones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/ordenes/pago"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <OrdenDePago />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/afip"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <LiquidacionesAfip />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/facturante"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <LiquidacionesFacturantes />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/iibb"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <LiquidacionesIIBB />
                    </div>
                  </section>
                }
              />
              <Route
                path="/liquidaciones/peticiones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <LiquidacionesPeticiones />
                    </div>
                  </section>
                }
              />

              {/* rutas Administracion  */}
              <Route
                path="/administracion"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <Admin />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/notificaciones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminNotificaciones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/calificaciones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminCalificaciones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/chat"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminChat />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/blanqueos"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminBlanqueos />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/peticiones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminPeticiones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/formularios"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminFormularios />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/blanqueos/empleados"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminEmpleado />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/legajos"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminLegajos />
                    </div>
                  </section>
                }
              />
              <Route
                path="/administracion/crm"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AdminCRM />
                    </div>
                  </section>
                }
              />
              <Route
              path="/facturacion/reporte"
              element={
                <section
                className={navVisible ? "page-with-navbar " : "page "}
                >
                 <div 
                 className={
                  darkMode
                  ? " container-dark "
                  : "container-light bg-gris"
                 }
                 >
                  <ReporteMensual/>
                 </div>
                </section>
              } />  
                          <Route
                              path="/administracion/nrocomercio"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <AdminNroComercio />
                                      </div>
                                  </section>
                              } />  
                          <Route
                              path="/administracion/AdminCupones"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <AdminCupones />
                                      </div>
                                  </section>
                              } />  
                          <Route
                              path="/administracion/AdminPanelInterno"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <AdminPanelInterno />
                                      </div>
                                  </section>
                              } />  
                          <Route
                              path="/administracion/AdminSimulador"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <AdminSimulador />
                                      </div>
                                  </section>
                              }
                          />
                          <Route
                              path="/administracion/AdminComparador"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <AdminComparador />
                                      </div>
                                  </section>
                              }
                                    />
                                    <Route
                                        path="/administracion/AdminResumenAliado"
                                        element={
                                            <section
                                                className={navVisible ? "page-with-navbar " : "page  "}
                                            >
                                                <div
                                                    className={
                                                        darkMode
                                                            ? " container-dark "
                                                            : "container-light bg-gris"
                                                    }
                                                >
                                                    <AdminResumenAliado />
                                                </div>
                                            </section>
                                        }
                                    />   <Route
                                        path="/administracion/Fidelizacion"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div
                                                    className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                >
                                                    <AdminFidelizacion />

                                                </div>
                                            </section>
                                        }

                                    />
              {/* rutas reclutamiento AdminCupones */}
              <Route
                path="/reclutamiento/busqueda"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <ReclutamientoBusqueda />
                    </div>
                  </section>
                }
              />
                                                    <Route
                                                        path="/reclutamiento/puestos/postulantes"
                                                        element={
                                                            <section
                                                                className={navVisible ? "page-with-navbar " : "page  "}
                                                            >
                                                                <div
                                                                    className={
                                                                        darkMode
                                                                            ? " container-dark "
                                                                            : "container-light bg-gris"
                                                                    }
                                                                >
                                                                    <ReclutamientoPostulantesCuestionarios />
                                                                </div>
                                                            </section>
                                                        }
                                                    />
              <Route
                path="/reclutamiento/puestos"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <ReclutamientoPuestos />
                    </div>
                  </section>
                }
              />

              <Route
                path="/reclutamiento/contratados"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <ReclutamientoContratados />
                    </div>
                  </section>
                }
              />

              <Route
              path="/reclutamiento/cuestionarios"
              element={
                <section
                  className={navVisible ? "page-with-navbar " : "page  "}
                >
                  <div
                    className={
                      darkMode
                        ? " container-dark "
                        : "container-light bg-gris"
                    }
                  >
                    <ReclutamientoCuestionarios />
                  </div>
                </section>
              }
              
              />

              {/* rutas asesores  */}
              <Route
                path="/asesores/criterios"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CriteriosAsesores />
                    </div>
                  </section>
                }
              />
              <Route
                path="/asesores/simulador"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CuadroComparativaAsesores />
                    </div>
                  </section>
                }
              />
              <Route
                path="/asesores/descargas"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <DescargasAsesores />
                    </div>
                  </section>
                }
              />
              <Route
                path="/asesores/check"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CheckInAsesores />
                    </div>
                  </section>
                }
              />

              <Route
                path="/asesores/academy"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <AcademyAsesores />
                    </div>
                  </section>
                }
              />
              <Route
                path="/asesores/chat"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <ChatAsesores />
                    </div>
                  </section>
                }
              />
              <Route
                path="/asesores/calculadora"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <CalculadoraAsesores />
                    </div>
                  </section>
                }
              />

              {/* rutas GESTOR */}
              <Route
                path="/gestor/check"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorCheck />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/academy"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorAcademy />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/peticiones"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorPeticiones />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/formularios"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorFormulario />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/simulador"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorSimulador />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/calculadora"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorCalculadora />
                    </div>
                  </section>
                }
              />
              <Route
                path="/gestor/descargas"
                element={
                  <section
                    className={navVisible ? "page-with-navbar " : "page  "}
                  >
                    <div
                      className={
                        darkMode
                          ? " container-dark "
                          : "container-light bg-gris"
                      }
                    >
                      <GestorDescargas />
                    </div>
                  </section>
                }
                          />

                          {/* rutas Calidad import CalidadLegajos from "./views/Calidad/AdminLegajos";
import CalidadCRM from "./views/Calidad/AdminCRM"; recontra putito el que lee esto
import CalidadPeticiones from "./views/Calidad/AdminPeticiones";
import CalidadNroComercio from "./views/Calidad/AdminNroComercio";  */}
                          <Route
                              path="/Calidad/Admin"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadAdmin />
                                      </div>
                                  </section>
                              }
                          />  <Route
                              path="/Calidad/AdminNroComercio"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadNroComercio />
                                      </div>
                                  </section>
                              }
                          />  <Route
                              path="/Calidad/AdminPeticiones"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadPeticiones />
                                      </div>
                                  </section>
                              }
                          />  <Route
                              path="/Calidad/AdminCRM"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadCRM />
                                      </div>
                                  </section>
                              }
                          />  <Route
                              path="/Calidad/PanelInterno"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadPanelInterno />
                                      </div>
                                  </section>
                              }
                          /> <Route
                              path="/Calidad/PanelControlInterno"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadPanelControlINterno />
                                      </div>
                                  </section>
                              }
                          />
                          
                          <Route
                              path="/Calidad/AdminLegajos"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <CalidadLegajos />
                                      </div>
                                  </section>
                              }
                          />
                          <Route
                              path="/Calidad/Historial"
                              element={
                                  <section
                                      className={navVisible ? "page-with-navbar " : "page  "}
                                  >
                                      <div
                                          className={
                                              darkMode
                                                  ? " container-dark "
                                                  : "container-light bg-gris"
                                          }
                                      >
                                          <HistorialCRM />
                                      </div>
                                  </section>
                              }
                          />
                          <Route
                          path="/Calidad/Auditorias"
                          element={
                            <section
                            className={navVisible?"page-with-navbar":"page"}
                            >
                              <div
                              className={
                                darkMode?"container-dark":"container-light bg-gris"
                              }
                              >
                                <PanelAuditoria/>

                              </div>

                            </section>
                          }
                          />
                          {/**Rutas florencia */}
                          <Route
                          path="/Admin"
                          element={
                            <section className={navVisible?"page-with-navbar":"page"}>
                              <div
                              className={darkMode?"container_dark":"container-light bg-gris"}
                              >
                                <InicioFlorencia/>

                              </div>
                            </section>
                          }

                                    />
                                    <Route
                                  path="/Admin/ReporteMensual"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div
                                              className={darkMode ? "container_dark" : "container-light bg-gris"}
                                          >
                                              <Reportemensual />

                                          </div>
                                      </section>
                                  }
                              />
                              <Route 
                              path="/Admin/datosestadisticos"
                              element={
                                <section className={navVisible ? "page-with-navbar":"page"}>
                                  <div className={darkMode? "container_dark":"container-light bg-gris"}>
                                    <GraficosEstadisticas/>
                                  </div>



                                </section>
                              }
                              />
                              <Route
                              path="/Admin/reportesemanal"
                              element={
                                <section className={navVisible ? "page-with-navbar":"page"} >
                                  <div className={darkMode? "container_dark":"container-light bg-gris"}>
                                    <ReporteSemanal/>
                                  </div>

                                </section>
                              }
                              
                                    />
                                    <Route
                                        path="/Admin/Fidelizacion"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div
                                                    className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                >
                                                    <Fidelizacion />

                                                </div>
                                            </section>
                                        }

                                        />    <Route
                                            path="/Admin/SubirDatosClover"
                                            element={
                                                <section className={navVisible ? "page-with-navbar" : "page"}>
                                                    <div
                                                        className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                    >
                                                        <SubirDatosClover />

                                                    </div>
                                                </section>
                                            }

                                        />
                                        <Route
                                            path="/Admin/listaordenpago"
                                            element={
                                                <section className={navVisible ? "page-with-navbar" : "page"}>
                                                    <div
                                                        className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                    >
                                                        <ListaOrdenPago />

                                                    </div>
                                                </section>
                                            }

                                        />

                                        <Route
                                        path="/Admin/cuponesexcel"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div
                                                    className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                >
                                                    <Cupones/>

                                                </div>
                                            </section>
                                        }
                                                />
                                                <Route
                                                    path="/Admin/ReporteSemanalClover"
                                                    element={
                                                        <section className={navVisible ? "page-with-navbar" : "page"}>
                                                            <div
                                                                className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                            >
                                                                <ReporteSemanalClover />

                                                            </div>
                                                        </section>
                                                    }
                                                />
                                                <Route
                                                    path="/Admin/ReporteMensualClover"
                                                    element={
                                                        <section className={navVisible ? "page-with-navbar" : "page"}>
                                                            <div
                                                                className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                            >
                                                                <ReporteMensualClover />

                                                            </div>
                                                        </section>
                                                    }
                                                />
                                                <Route
                                                    path="/Admin/pdforden"
                                                    element={
                                                        <section 
                                                        className={navVisible ? "page-with-navbar" : "page"}
                                                        >
                                                            <div
                                                                className={darkMode ? "container_dark" : "container-light bg-gris"}
                                                            >
                                                                <PDFPage/>

                                                            </div>
                                                        </section>
                                                    }
                                                />
                          {/**Rutas Abm */}
                         
                            
                          
                          
                              <Route path="/abmtest/panelinterno"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmPanelInterno />
                                          </div>
                                      </section>
                                  } />

                              <Route path="/abmtest/blanqueo"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmBlanqueo />
                                          </div>
                                      </section>
                                  } />

                              <Route path="/abmtest/comparador"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmComparador />
                                          </div>
                                      </section>
                                  } />

                              <Route path="/abmtest/simulador"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmSimulador />
                                          </div>
                                      </section>
                                  } />

                              <Route path="/abmtest/cupones"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmCupones />
                                          </div>
                             

                            </section>
                            
                          }
                          /><Route path="/abmtest/simuladorliquidaciones"
                          element={
                              <section className={navVisible ? "page-with-navbar" : "page"}>
                                  <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                      <AbmSimuladorLiquidaciones />
                                  </div>
                     

                    </section>
                    
                  }
                  
                  />

                  
<Route path="/abmtest/nrocomercio"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmNroComercio />
                                          </div>
                             

                            </section>
                            
                          }
                          />
                          <Route path="/abmtest/ordenpago"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmListaOrdenPago />
                                          </div>
                             

                            </section>
                            
                          }
                          />
                          <Route path="/abmtest/legajos"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmLegajos />
                                          </div>
                             

                            </section>
                            
                          }
                          />
                          <Route path="/abmtest/resumenaliado"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmResumenAliado/>
                                          </div>
                             

                            </section>
                            
                          }
                          />
                          <Route path="/abmtest/crm"
                                  element={
                                      <section className={navVisible ? "page-with-navbar" : "page"}>
                                          <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                              <AbmCRM />
                                          </div>
                             

                            </section>
                            
                          }
                                    />
                                    {/*zoco conect :) trolito el que lee*/ }
                                    
                                    <Route path="/ZocoConect/Inicio"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                    <InicioZocoConect />
                                                </div>


                                            </section>

                                        }
                                    />
                                    <Route path="/ZocoConect/RegistroAliado"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                    <RegistroZocoConectAliado />
                                                </div>


                                            </section>

                                        }
                                    />
                                    <Route path="/ZocoConect/Registro"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                    <RegistroZocoConect />
                                                </div>


                                            </section>

                                        }
                                        />
                                        <Route path="/ZocoConect/ListaUsuariosZocoConect"
                                            element={
                                                <section className={navVisible ? "page-with-navbar" : "page"}>
                                                    <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                        <ListaUsuarioZocoConect />
                                                    </div>


                                                </section>

                                            }
                                        />
                                    <Route path="/ZocoConect/AgregarReferidos"
                                        element={
                                            <section className={navVisible ? "page-with-navbar" : "page"}>
                                                <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                    <AgregarReferidos />
                                                </div>


                                            </section>

                                        }
                                            />

                                            <Route path="/ZocoConect/testpdf"
                                                element={
                                                    <section className={navVisible ? "page-with-navbar" : "page"}>
                                                        <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                            <TestPdfUser />
                                                        </div>


                                                    </section>

                                                }
                                                />
                                                {/* <Route path="/ZocoConect/testvacios"
                                                element={
                                                    <section className={navVisible ? "page-with-navbar" : "page"}>
                                                        <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                            <PruebaVacios />
                                                        </div>


                                                    </section>

                                                }
                                                /> */}
                                                <Route path="/admin/Simuladorliquidacion"
                                                    element={
                                                        <section className={navVisible ? "page-with-navbar" : "page"}>
                                                            <div className={darkMode ? "container_dark" : "container-light bg-gris"}>
                                                                <SimuladorLIquidacion />
                                                            </div>


                                                        </section>

                                                    }
                                                />

                                                {/* Rutas Posatulante, agarrame el gigante CuestionariosPostulante */}
                                                <Route path="/postulante/inicio"
                                                element={
                                                  <section className={navVisible? "page-with-navbar":"page"}>
                                                    <div className={darkMode? "container_dark":"container-light bg-gris"}>
                                                      <InicioPostulante />
                                                    </div>
                                                  </section>
                                                }
                                                />
                                                <Route path="/postulante/cuestionarios"
                                                element={
                                                  <section className={navVisible? "page-with-navbar":"page"}>
                                                    <div className={darkMode? "container_dark":"container-light bg-gris"}>
                                                            <CuestionariosPostulante />
                                                    </div>
                                                  </section>
                                                }
                                                />
                                                <Route path="/postulante/respondercuestionario"
                                                element={
                                                  <section className={navVisible? "page-with-navbar":"page"}>
                                                    <div className={darkMode? "container_dark":"container-light bg-gris"}>
                                                            <Formulario/>
                                                    </div>
                                                  </section>
                                                }
                                                    />

              <Route path="*" element={<RedirectToHome />} />
            </Routes>
          </div>
        </div>
      </UseLocationComponent>
                        </BrowserRouter>
             

                </CRMProvider>
            </FidelizacionProvider>
            </FacturacionProvider>
            </AdminProvider>
            </ReporteCloverProvider>
            </PostulacionesProvider>
        </InicioAhorroProvider>

  );
}

export default App;
