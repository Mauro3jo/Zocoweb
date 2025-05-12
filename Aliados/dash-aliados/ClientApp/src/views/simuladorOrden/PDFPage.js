import React, {useState, useEffect, useRef,useContext} from 'react'
import HeaderOrden from '../../components/simuladorLiquidaciones/HeaderOrden'
import OrdenPago from '../../components/simuladorLiquidaciones/OrdenPago'
import FooterOrden from '../../components/simuladorLiquidaciones/FooterOrden'
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from 'jspdf';
import html2pdf from "html2pdf.js";
import html2canvas from 'html2canvas';
import './PDF.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faFileArrowDown, faBackward} from '@fortawesome/free-solid-svg-icons'
import { DarkModeContext } from '../../context/DarkModeContext';
import zocoLogo from "../../assets/img/Datos Establecimiento Orden de Pago.png";
import zocoDatos from "../../assets/img/Datos Establecimiento, con fondo.png"
import zocoDatosSinFondo from "../../assets/img/Datos Establecimiento sin fondo.png"
import '../../components/simuladorLiquidaciones/Header.css'
import { Table } from 'react-bootstrap';
import '../../components/simuladorLiquidaciones/tabla.css'
import qrZoco from '../../assets/img/QR Imagen.png'
const PDFPage = () => {
  const location = useLocation();
  const [historialDatos, setHistorialDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const pdfRef = useRef(null); // Referencia para el contenido a exportar como PDF
  const headerRef = useRef(null);
  const ordenPagoRef = useRef(null);
  const footerRef = useRef(null);
  const contentRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null); 
  const {darkMode}=useContext(DarkModeContext)
  const today = new Date().toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
  });
  const [currentPage, setCurrentPage] = useState(0); // Página actual
  const itemsPerPage = 10; // Elementos por página
  const navigate= useNavigate()

  const convertirNumero = (numeroString) => {
      if (!numeroString) return 0; // Si el valor es nulo o vacío, devolvemos 0
      return parseFloat(numeroString.replace(/\./g, "").replace(",", "."));
  };
  const calcularTotales = () => {
      const totales = {
        bruto: 0,
        arancel: 0,
        iva: 0,
        costoTrans: 0,
        costoFinanciero: 0,
        costoAnticipo: 0,
        retGanancias: 0,
        retIIBB: 0,
        retIVA: 0,
        totalOp: 0,
    };

    // Sumar los valores de cada campo en historialDatos
    historialDatos.forEach((dato) => {
        totales.bruto += convertirNumero(dato.montoinicial);
        totales.arancel += convertirNumero(dato.sumComision);
        totales.iva += convertirNumero(dato.sumIvaComision);
        totales.costoTrans += convertirNumero(dato.debcredFinal);
        totales.costoFinanciero += convertirNumero(dato.costoTarjeta);
        totales.costoAnticipo += convertirNumero(dato.costoAnticipo); // Ajustar si hay otro campo
        totales.retGanancias += convertirNumero(dato.gananciaFinal);
        totales.retIIBB += convertirNumero(dato.alicuotaFinal);
        totales.retIVA += convertirNumero(dato.ivaFinal);
        totales.totalOp += convertirNumero(dato.bruto);
    });

      return totales;
  };
  const totales = calcularTotales();

  const getNeto = (dato) =>{
      const neto= convertirNumero(dato.montoinicial)
      const netoFinal= neto - convertirNumero(dato.sumComision)- convertirNumero(dato.sumIvaComision) - convertirNumero(dato.debcredFinal) -convertirNumero(dato.costoTarjeta) - convertirNumero(dato.costoAnticipo) - convertirNumero(dato.alicuotaFinal)
      return new Intl.NumberFormat("es-AR", {
          style: "currency",
          currency: "ARS",
          minimumFractionDigits: 2, // Dos decimales
      }).format(netoFinal)
  }
  useEffect(() => {
    
    const datos = location.state?.historialDatos || [];
      // Referencias para los componentes
 
    
    if (datos.length > 0) {
      setHistorialDatos(datos);
      setLoading(false); // Indica que los datos ya están cargados
    } else {
      setLoading(false); // Incluso si no hay datos, deja de cargar
    }
  }, [location.state]);



// const handleDownloadPDF = async () => {
//   if (!contentRef.current) return;

//   const canvas = await html2canvas(contentRef.current, {
//     scale: 3, // Escala alta para mayor calidad
//     useCORS: true,
//     backgroundColor: null, // Fondo transparente
//   });

//   const pdf = new jsPDF("p", "mm", "a4");
//   const pdfWidth = pdf.internal.pageSize.getWidth(); // Ancho de la hoja A4
//   const pdfHeight = pdf.internal.pageSize.getHeight(); // Alto de la hoja A4

//   // Ajustar la imagen para que sea más ancha
//   const desiredWidth = pdfWidth * 1.4; // Incrementar el ancho al 125%
  
//   const imgWidth = desiredWidth; // No limitar el ancho
//   const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener proporción

//   // Calcular el desplazamiento para centrar horizontalmente
//   const xOffset = (pdfWidth - imgWidth) / 2; // Puede ser negativo si la imagen es más ancha que el PDF
//   const yOffset = imgHeight < pdfHeight ? (pdfHeight - imgHeight) / 2 : 0; // Centrado vertical

//   const imgData = canvas.toDataURL("image/png");

//   // Agregar la imagen al PDF, permitiendo que sobresalga a los lados
//   pdf.addImage(imgData, "PNG", xOffset, yOffset, imgWidth, imgHeight);

//   pdf.save("SimuladorOrden.pdf");
// };

const handleDownloadPDF = async () => {
  const pdf = new jsPDF("p", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  for (let page = 0; page < totalPages; page++) {
    // Actualiza la página actual en el estado
    setCurrentPage(page);

    // Espera a que React actualice el contenido de la tabla
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Captura la tabla actualizada
    const canvas = await html2canvas(contentRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");

    // Agregar imagen al PDF
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);

    if (page < totalPages - 1) {
      pdf.addPage(); // Agregar nueva página para el próximo bloque
    }
  }

  pdf.save("SimuladorOrden.pdf");
};
const handleBackStep = async () =>{
navigate('/admin/Simuladorliquidacion')
}
  
  

  if (loading) {
    // Mientras los datos se están cargando, muestra un mensaje o spinner
    return <div>Cargando datos...</div>;
  }

  if (historialDatos.length === 0) {
    // Si no hay datos en historialDatos, muestra un mensaje adecuado
    return <div>No se encontraron datos para mostrar.</div>;
  }
  const paginatedData = historialDatos.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const totalPages = Math.ceil(historialDatos.length / itemsPerPage);

   // Estado para almacenar la URL de la imagen

  const handleCaptureImage = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Mejorar la calidad de la imagen
        useCORS: true, // Permitir cargar imágenes externas
        backgroundColor: null, // Fondo transparente
      });

      // Convertir el canvas a URL de imagen
      const imgData = canvas.toDataURL("image/png");
      setImageUrl(imgData); // Guardar la URL de la imagen generada

      // Opcional: Descarga automática
      const link = document.createElement("a");
      link.href = imgData;
      link.download = "SimuladorOrden.png";
      link.click();
    } catch (error) {
      console.error("Error al capturar la imagen:", error);
    }
  };
  return (
    <>
    <div id="pdf-content" ref={contentRef}>
  <div id="header" ref={headerRef}>
  <section className="container-header">
      <section className="d-lg-block d-none">
        <div
          className={
            darkMode
              ? "py-4 contenedor-panel-control-header-dark"
              : "py-4 contenedor-panel-control-header "
          }
        >
          
            <article  style={{
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center", // Centrar verticalmente
    height: "70%", // Usar toda la altura disponible
   
  }}>
              <div className="">
                
                  <img src={zocoDatosSinFondo} width="800px"  height="130px" ></img>
              
              </div>
            </article>
          
         
        </div>
      </section>
    </section>
  </div>
  <div id="body" ref={ordenPagoRef}>
  <div>
        <section className="container ">
      <div style={{marginBottom:"5px"}} className="row">
        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> HOY SE ACREDITA</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "bg-data-header  border-0 quitar-cursor-pointer"
            }
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "55px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500 fs-14">
            {new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(totales.totalOp)}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> ACUMULADO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            }
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "55px", // Asegúrate de que coincida con la altura del círculo
            }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
            ${" "}
            {[0]}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> DÉBITO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            } 
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "55px", // Asegúrate de que coincida con la altura del círculo
            }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
              $ {[0]}
            </div>
          </div>
        </article>

        <article className="col-12 col-md-6 col-lg-3  py-2">
          <h6 className="text-center lato-bold fs-14"> CRÉDITO</h6>
          <div
            className={
              darkMode
                ? " bg-data-header-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-header  border-0 quitar-cursor-pointer"
            }
             style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "55px", // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className=" d-flex justify-content-center border-0 lato-bold-a-lato-500  fs-14">
              $ {[0]}
            </div>
          </div>
        </article>
      </div>
    </section>
    

    
                <div
                    className={
                        darkMode
                            ? "container tabla-footer "
                            : "container tabla-footer "
                    }
                >
                        
                            <Table table table-borderless responsive striped hover>
                                <thead className="bg-dark py-2">
                                    <tr className="text-center tabla-thead">
                                      
                                        
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Fecha OP
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Tarjeta
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Cuotas
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Bruto
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Costo<br/>Financiero
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Costo Anticip.
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Arancel
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            IVA
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Cost. Trans.
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Ret. IIBB.
                                        </th>
                                        
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-derecha border-0 lato-regular fs-9 py-3"
                                                    : "bg-dark text-white border-tabla-derecha border-0 lato-regular fs-9 py-3"
                                            }
                                            scope="col"
                                        >
                                            Total OP.
                                        </th>
                                    


                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {/* Renderizar tabla vacía si no hay datos */}
                                    {paginatedData.length > 0 ? (
              paginatedData.map((dato, index)  => (
                                   
                                            <tr
                                                className={
                                                    darkMode ? "bg-dark text-white" : "bg-white text-dark"
                                                }
                                              
                                                // key={}
                                            >
                                              
                                                
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {today}
                                                </td>
                                                {dato.tarjeta==="American Express"? (
                                                <td
                                                id='tdTarjeta'
                                                className={
                                                    darkMode
                                                        ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                        : "fs-9 lato-bold py-4 prority-4 "
                                                }
                                            >
                                               {dato.tarjeta} {" "} {dato.tipoDebCred}
                                            </td>) :( 
                                                <td
                                                className={
                                                    darkMode
                                                        ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                        : "fs-9 lato-bold py-4 prority-4 "
                                                }
                                            >
                                               {dato.tarjeta} {" "} {dato.tipoDebCred}
                                            </td>
                                            )
                                                }
                                                
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.cuota}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.montoinicial}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.costoTarjeta}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.costoAnticipo}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.sumComision}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.sumIvaComision}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.debcredFinal}
                                                </td>
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    $ {dato.alicuotaFinal}
                                                </td>
                                                
                                                <td
                                                    
                                                    className={
                                                        darkMode
                                                            ? "fs-9 lato-bold py-4 prority-4 text-white "
                                                            : "fs-9 lato-bold py-4 prority-4 "
                                                    }
                                                >
                                                    {getNeto(dato)}
                                                </td>
                                                
                              

                          
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="14">No hay datos disponibles</td>
                      </tr>
                    )}

                                </tbody>
                            </Table>
                        </div>
                    

                

    </div>
  </div>
  <div id="footer" ref={footerRef}>
  <div >
    
        <div
          className= "contenedor-panel-control-footer"
          style={{
            marginTop: 0, // Elimina márgenes superiores
            paddingTop: 0, // Elimina padding superior
            display: "flex", // Alineación uniforme
            justifyContent: "center",
            alignItems: "center",
            
          }}
        > 
      
         
          <div className="d-flex justify-content-center py-3"
          > 
          
            
          {/* <article style={{
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center", // Centrar verticalmente
    height: "70%", // Usar toda la altura disponible
   
  }}> */}
            
 <div
    className={
      darkMode
        ? "bg-data-footer-dinero-dark border-0 quitar-cursor-pointer"
        : "container-light bg-data-footer-dinero border-0 quitar-cursor-pointer"
    }
  > 
    
    <div  style={{
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    
    height: "100%", // Usar toda la altura disponible
   
  }} className="resumen-fiscal">
      
      <div className="resumen-fiscal-row">
        <p className="lato-bold fs-12">BRUTO:</p>
        <p className="lato-bold fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.bruto)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">Arancel:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.arancel)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">IVA 21%:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.iva)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">Cost. Trans.:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoTrans)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">Costo Financiero:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoFinanciero)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">Costo Anticipo:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.costoAnticipo)}
        </p>
      </div>
      <div className="resumen-fiscal-row">
        <p className="lato-regular fs-12">Ret. IIBB:</p>
        <p className="lato-regular fs-12 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.retIIBB)}
        </p>
      </div>
      <div className="resumen-fiscal-row total-op">
        <p className="lato-bold fs-14">TOTAL OP:</p>
        <p className="lato-bold fs-14 numero">
          {new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
          }).format(totales.totalOp)}
        </p>
      </div>
    </div>
   </div> 
{/* </article>

           
            <article style={{
    display: "flex",
    justifyContent: "center", // Centrar horizontalmente
    alignItems: "center", // Centrar verticalmente
    height: "70%", // Usar toda la altura disponible
   
  }}> */}
              <div>
                 
                  <div className={
              darkMode
                ? " bg-data-footer-dark border-0 quitar-cursor-pointer"
                : "container-light bg-data-footer  border-0 quitar-cursor-pointer justify-content-center"
            }
            style={{
              display: "flex",
              justifyContent: "center", // Centrar horizontalmente
              alignItems: "center", // Centrar verticalmente
           
             
            }}
            >

                  
                  <img src={qrZoco} width="150px" height="175px"></img>
                  </div>

                
              </div>
             
            {/* </article> */}
          </div>
        </div>

    </div>
  </div>
</div>

    <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Botón de descarga que NO será capturado */}
      <button className="fixed-download-button" onClick={handleDownloadPDF}>
        <FontAwesomeIcon icon={faFileArrowDown} style={{ fontSize: "20px" }} />
      </button>
    </div>
    {/* Mostrar la imagen generada
    {imageUrl && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={imageUrl}
            alt="Captura generada"
            style={{ maxWidth: "100%", border: "1px solid #ccc" }}
          />
          <p>Haz clic derecho en la imagen para guardarla.</p>
        </div>
      )} */}
      <div style={{ marginTop: "20px", textAlign: "center" }}>
      {/* Botón de descarga que NO será capturado */}
      <button className="fixed-back-button" onClick={handleBackStep}>
        <FontAwesomeIcon icon={faBackward} style={{ fontSize: "18px" }} />
      </button>
    </div>
    </>
  );
};

export default PDFPage