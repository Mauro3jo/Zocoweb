import React, { useState, useContext, useEffect } from "react";
import { Row, Col, Card, Carousel, Table, Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import "./ContenidoInicioCelular.css";
import "../TablaTickets.css"
import Chart from 'chart.js/auto'; // Importar Chart de chart.js para registrar plugins
import { Pie } from 'react-chartjs-2';
import Select from 'react-select';
import {ReactComponent as ZocoBolsa} from '../../assets/svg/Icono Bolsa de dinero (color blanco).svg'
// import {ReactComponent as Anotador} from '../../assets/svg/Icono anotador.svg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faClipboardList} from '@fortawesome/free-solid-svg-icons' 
import info from '../../assets/img/Comenzar a referir un comercio img  (Tablet).png'


const ContenidoInicioTabletVacio = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [isPaused, setIsPaused] = useState(false);
   const [mesSeleccionado, setMesSeleccionado] = useState(null);
  
    const [ultimoResultado, setUltimoResultado]= useState(null)
    const nivelUsuario = ultimoResultado ? ultimoResultado.nivel : 0;
    const porcentaje = ultimoResultado ? ultimoResultado.porcentaje : 0;
    const comision = ultimoResultado ? ultimoResultado.comision : 0;
    const nombreComercio= ultimoResultado? ultimoResultado.nombre: "";
    
    const estado= ultimoResultado? ultimoResultado.estado:"Inactivo"
    const terminal= ultimoResultado?ultimoResultado.nroTerminal:0
    const [cuitSeleccionado, setCuitSeleccionado]= useState(0)
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
    // Actualizar el estado cuando se redimensiona la ventana
    useEffect(() => {
      const handleResize = () => setWindowWidth(window.innerWidth);
      window.addEventListener("resize", handleResize);
  
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }, []);
    
  
  
  
    // Agrupar los resultados en conjuntos de 3 sin duplicación
    const groupResults = (results) => {
      const grouped = [];
      for (let i = 0; i < results.length; i += 3) {
        grouped.push(results.slice(i, i + 3));
      }
      return grouped;
    };
    
  const getTamaño=(windowWidth)=>{
    if (windowWidth <= 500)
    return "115px"
  else return "155px"
  }
  const getWidth=(windowWidth)=>{
    if (windowWidth >= 425)
    return "160px"
  if (windowWidth>=375)
    return "140px"
  if (windowWidth>=320)
    return "100px"
  }
  const getHeigth=(windowWidth)=>{
    if (windowWidth >= 425)
    return "140px"
  if (windowWidth>=375)
    return "110px"
  if (windowWidth>=320)
    return "120px"
  }
   
    const getNivelData = () => {
      
    
      return {
        datasets: [
          {
            data: [ 100 ],
            backgroundColor: ["#dcdcdc"], // Color dinámico + gris
            borderWidth: 0,
          },
        ],
      };
    };
    
    
    
  
    
return (
  <div className='container zocoTextCenterInicio'>
      <section className={
          darkMode ? " bg-connect-celular-dark px-4" : "bg-connect-celular px-4"
        }>

<div  style={{padding:"20px"}}>


        <div style={{marginBottom:"5px"}} className="row">
          
          
    <article className="col-6 col-sm-6 col-md-6 col-lg-4 py-2 d-flex flex-column align-items-center">
   
    
          <div
            className="d-flex justify-content-center align-items-center"
            style={{position: "relative", width: getWidth(windowWidth), height: getHeigth(windowWidth) }}
          >
            <Pie data={getNivelData()}  options={{ responsive: true, maintainAspectRatio: false, cutout: "80%"}} />
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
              Nivel {nivelUsuario}
            </span>
          </div>
          

         

       
          
        </article>
        <article className="col-6 col-sm-6 col-md-6 col-lg-8 py-2">
          <div className="col">
            <div className="row">
              <div className="col comision-vacio-cel">
              <article className="col-12 col-md-6 col-lg-6  py-2">
              <h6 className="zocoFontLarge">
                Comision actual: 
               
            </h6>
            <h6 className="zocoFontLarge" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
<button 
  className="btn-status" 
  disabled 
  style={{
    backgroundColor: "#dcdcdc", 
    width: "30px", 
    height: "30px", 
    borderRadius: "100%", 
    marginRight: "1px", 
    border: "none",
  }}
>
  <ZocoBolsa className="iconBag"/>
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
              ? " bg-data-estatus-cel-dark border-0 quitar-cursor-pointer zocoFontXS"
              : "container-light bg-data-estatus-cel  border-0 quitar-cursor-pointer zocoFontXS"
          }
           style={{
              display: "flex",
              justifyContent:"center",
              alignItems: "center",
              
              height: "35px", // Asegúrate de que coincida con la altura del círculo
            }}>
               
              {"  "} Estatus: <button className="btn-status" disabled style={{backgroundColor:"#dcdcdc", width:"10px", height:"10px", borderRadius:"100%", marginRight:"3px", marginLeft:"3px"}}></button> {" "}{"Inactivo"}{" "}Categoria{" "}{0} 

            </div>
            
        
      </article>
      

              </div>
              
              
            </div>
           

          </div>
        </article>
         
          
        
        
       
     
      

    </div>

        </div>
        </section>
        <section>
      <div className={
          darkMode
            ? "py-4 contenedor-panel-control-facturacion-dark"
            : "py-4 contenedor-panel-control-facturacion"
        } style={{marginTop:"20px"}}>
          <div className="d-flex justify-content-center">
          <img src={info} width={"500px"}>
          </img>
          
          </div>
          <div className="d-flex justify-content-center">
          <button 
                className="btn btn-referir-cel " 
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

export default ContenidoInicioTabletVacio