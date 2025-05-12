import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Card, Carousel, Table, Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import "./ContenidoInicio.css";
import "../TablaTickets.css"
import Chart from 'chart.js/auto'; // Importar Chart de chart.js para registrar plugins
import { Pie } from 'react-chartjs-2';
import Select from 'react-select';
import {ReactComponent as ZocoBolsa} from '../../assets/svg/Icono Bolsa de dinero (color blanco).svg'
// import {ReactComponent as Anotador} from '../../assets/svg/Icono anotador.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClipboardList} from '@fortawesome/free-solid-svg-icons'
import info from '../../assets/img/Comenzar a referir un comercio img (Pc).png'


const ContenidoInicioVacio = () => {
    const { darkMode } = useContext(DarkModeContext);
      
    
      
      
      const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    
      // Actualizar el estado cuando se redimensiona la ventana
      useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
    
        return () => {
          window.removeEventListener("resize", handleResize);
        };
      }, []);
     
    
    
    
      
    
      
      
    
      
      const getNivelData = () => {
        
      
        return {
          datasets: [
            {
              data: [100],
              backgroundColor: ["#dcdcdc"], // Color dinámico + gris
              borderWidth: 0,
            },
          ],
        };
      };
      

      
    
      
      
  return (
    <div className="container zocoTextCenterInicio">
        <section  >
        <section style={{marginBottom:"3em"}} className="d-lg-block d-none">
          <div className={
            darkMode
              ? "py-4 contenedor-panel-control-facturacion-dark"
              : "py-4 contenedor-panel-control-facturacion"
          } style={{padding:"20px"}}>
          <div style={{marginBottom:"5px"}} className="row">
      <article className="col-12 col-md-4 col-lg-4 py-2 d-flex flex-column align-items-center">
     
          
            <div
              className="d-flex justify-content-center align-items-center"
              style={{ position: "relative", width: "275px", height: "220px" }}
            >
              <Pie data={getNivelData()} options={{ responsive: true, maintainAspectRatio: false, cutout: "80%"}} />
              <span className="zocoFontXXL"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontWeight: "bold",
                  color: "#dcdcdc",
                }}
              >
                Nivel 0
              </span>
            </div>

           

         
            
          </article>
          <article className="col-12 col-md-8 col-lg-8 py-2">
            <div className="col">
              <div className="row">
                <div className="col comision-vacio">
                <article className="col-12 col-md-6 col-lg-6  py-2">
                <h6 className="zocoFontLarge">
                  Comision actual: 
                 
              </h6>
              <h6 className="zocoFontLarge" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
  <button 
    className="btn-status" 
    disabled 
    style={{
      backgroundColor: "#dcdcdc", 
      width: "30px", 
      height: "30px", 
      borderRadius: "100%", 
      marginRight: "5px", 
      border: "none",
    }}
  >
    <ZocoBolsa/>
  </button>

  <span style={{ color: "#dcdcdc", fontWeight: "bold" }}>
    {new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(0)}
  </span>
</h6>
              {/* <h6 className="fs-17 lato-bold">
                {nombreComercio}
              </h6> */}
              <div  className={
              darkMode
                ? " bg-data-estatus-dark border-0 quitar-cursor-pointer zocoFontXS"
                : "container-light bg-data-estatus  border-0 quitar-cursor-pointer zocoFontXS"
            }
             style={{
                display: "flex",
                justifyContent:"center",
                alignItems: "center",
                
                height: "35px", // Asegúrate de que coincida con la altura del círculo
              }}>
                 
                {"  "} Estatus: <button className="btn-status" disabled style={{backgroundColor:"#dcdcdc", width:"15px", height:"15px", borderRadius:"100%", marginRight:"3px", marginLeft:"3px"}}></button>{" "} {"Inactivo"}{" "}Categoria{" "}0 

              </div>
              
          
        </article>
        
        

                </div>
                
              </div>
             

            </div>
          </article>
         
          
          
       
        

      </div>

          </div>
        
        </section>
     
    </section>
    <section>
        <div className={
            darkMode
              ? "py-4 contenedor-panel-control-facturacion-dark"
              : "py-4 contenedor-panel-control-facturacion"
          }>
            <div className="d-flex justify-content-center">
            <img src={info} width={"900px"}>
            </img>
            
            </div>
            <div className="d-flex justify-content-center">
            <button 
                  className="btn btn-referir " 
                  style={{
                    display: "flex",
                    flexDirection: "row", // Asegura que los elementos estén en línea horizontal
                    alignItems: "center", // Centra el icono y el texto verticalmente
                    justifyContent: "center", // Centra el contenido dentro del botón
                    background: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
                    border: "1px solid #999",
                    height: "50px",
                     // Opcional: ajusta el ancho del botón
                    padding: "0 15px", // Espaciado interno
                    gap: "8px", // Espacio entre el icono y el texto
                    textAlign: "center", // Asegura que el texto esté alineado correctamente
                    whiteSpace: "nowrap", // Evita que el texto se divida en dos líneas
                    borderRadius:"15px"
                  }}
                >
                  <FontAwesomeIcon icon={faClipboardList} style={{color:"#B4C400", fontSize: "1.8em" }} />
                  <span className="zocoFontMedium" style={{ lineHeight: "1" }}>Comenzar a referir</span>
                </button>
            </div>
           

        </div>

    </section>
    </div>
  )
}

export default ContenidoInicioVacio