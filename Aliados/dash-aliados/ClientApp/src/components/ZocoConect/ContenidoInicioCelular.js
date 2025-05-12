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
import infocelu from '../../assets/img/Barra explicativa de niveles (Celular) (1).png'

const ContenidoInicioCelular = ({ resultadosPorMes }) => {
    const { darkMode } = useContext(DarkModeContext);
  const [isPaused, setIsPaused] = useState(false);
 const [mesSeleccionado, setMesSeleccionado] = useState(null);

  const [ultimoResultado, setUltimoResultado]= useState(null)
  const nivelUsuario = ultimoResultado ? ultimoResultado.nivel : 0;
  const porcentaje = ultimoResultado ? ultimoResultado.porcentaje : 0;
  const comision = ultimoResultado ? ultimoResultado.comision : 0;
  const nombreComercio= ultimoResultado? ultimoResultado.nombre: "";
  const nivel0= ultimoResultado? ultimoResultado.nivel0:0;
  const nivel1= ultimoResultado? ultimoResultado.nivel1:0;
  const nivel2= ultimoResultado? ultimoResultado.nivel2:0;
  const nivel3= ultimoResultado? ultimoResultado.nivel3:0
  const comision1= ultimoResultado?  ultimoResultado.comisionNivel1:0;
  const comision2= ultimoResultado?  ultimoResultado.comisionNivel2:0;
  const comision3= ultimoResultado?  ultimoResultado.comisionNivel3:0;
  const estado= ultimoResultado? ultimoResultado.estado:"Inactivo"
  const terminal= ultimoResultado?ultimoResultado.nroTerminal:0
  const [cuitSeleccionado, setCuitSeleccionado]= useState(0)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [expandido, setExpandido] = useState(false);

  // Actualizar el estado cuando se redimensiona la ventana
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  
  useEffect(() => {
    if (resultadosPorMes.length > 0) {
      const defaultResultado = resultadosPorMes[resultadosPorMes.length - 1];
      setUltimoResultado(defaultResultado);
      setCuitSeleccionado(defaultResultado.cuit);
      setMesSeleccionado({ value: defaultResultado.mes, label: defaultResultado.mes });
    }
  }, [resultadosPorMes]);

  const handleVerClick = (dato) => {
    setCuitSeleccionado(dato.cuit);
    setMesSeleccionado({ value: dato.mes, label: dato.mes });
    actualizarUltimoResultado(dato.cuit, dato.mes);
  };

  const actualizarUltimoResultado = (cuit, mes) => {
    const nuevoResultado = resultadosPorMes.find(r => r.cuit === cuit && r.mes === mes);
    if (nuevoResultado) {
      setUltimoResultado(nuevoResultado);
    }
  };

  const handleMesChange = (selected) => {
    if (selected) {
      setMesSeleccionado(selected);
      if (cuitSeleccionado) {
        actualizarUltimoResultado(cuitSeleccionado, selected.value);
      }
    }
  };

  const mesOptions = Array.from(new Set(resultadosPorMes.map(resultado => resultado.mes)))
    .map(mes => ({ value: mes, label: mes }));
  

  // Agrupar los resultados en conjuntos de 3 sin duplicación
  const groupResults = (results) => {
    const grouped = [];
    for (let i = 0; i < results.length; i += 3) {
      grouped.push(results.slice(i, i + 3));
    }
    return grouped;
  };
  const getHeigthBar  = (windowWidth) =>{
    if(windowWidth>500)
      return "14px"
    else
    return "10px"
  }
  const styles = {
    progressContainer: {
      
      height: "auto",
      
      backgroundColor: "#ddd",
      borderRadius: "5px",
      // overflow: "hidden",
      marginTop: "5px",
      position: "relative",
      
    },
    progressBar: {
      height: "14px",
      backgroundColor: "#B4C400",
      transition: "width 0.5s ease-in-out",
      position: "relative",
      zIndex: 1,
      borderRadius:"12px"
    },
    progressText: {
      position: "absolute",
      right: "10px",
      top: "50%",
      transform: "translateY(-50%)",
      fontSize: "10px",
      fontWeight: "bold",
      color: "#fff",
    },
    levelCircle: {
      position: "absolute",
      top: "50%",
      transform: "translate(-50%, -50%)",
      // width: "25px",
      // height: "25px",
      borderRadius: "50%",
      textAlign: "center",
      // fontSize: "9px",
      // fontWeight: "bold",
      // lineHeight: "14px",
      // color: "#333",
      zIndex: 2,
    },
    progressLevels: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "3px",
      fontSize: "10px",
      fontWeight: "bold",
      color: "#333",
      
      
    },
  };
  const groupedResultados = groupResults(resultadosPorMes);
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
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
      borderRadius: "37px 37px 37px 37px",
      border: "2px solid #999",
      boxShadow: "6px 7px 9px #3C88D338",
      justifyContent: "center", 
      width:"150px",
      height:"50px"
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#EAEFF4" : isFocused ? "#B4C400" : "transparent",
      color: isSelected || isFocused ? "#000000" : "#333",
      justifyContent: "center", 
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: "center", // Centra el texto seleccionado
    }),
    menu: (base) => ({
      ...base,
      border: "2px solid #999",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      color: "#0c0c0c",
    }),
    indicatorsContainer: () => ({
      display: "none", // Oculta la flecha y la 'X'
    }),
  };
  const getHeigthSelect = (windowWidth)=>{
    if (windowWidth===320)
      return "42px"
    else if (windowWidth<=350)
      return "42px"
    else if (windowWidth<=375)
      return "49px"
    else
    return "50px"
    
  }
  const getWidthSelect = (windowWidth) => {
    if (windowWidth>935) return "145px"
    if (windowWidth <=935 && windowWidth > 350) return "140px"; // Exactamente 320px
    if (windowWidth > 320 && windowWidth <= 350) return "135px"; // Entre 321 y 350
    return "130px"; // Mayor a 935
  };
  const getSizeImg=(windowWidth)=>{
    if (windowWidth>600)
      return "425px"
    else if (windowWidth<=600 && windowWidth>450)
      return "350px"
    else if (windowWidth<=450 && windowWidth>375)
      return "320px"
    else if (windowWidth<=375 && windowWidth>320)
      return"280px"
    else
    return "270px"
  }
  
  const customStyles2 = {
    control: (base) => ({
      ...base,
      backgroundColor: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
      borderRadius: "37px 37px 37px 37px",
      border: "2px solid #999",
      boxShadow: "6px 7px 9px #3C88D338",
      justifyContent: "center", 
      alignItems:"center",
      width:getWidthSelect(windowWidth),
      height:getHeigthSelect(windowWidth),
      fontSize:"14px"
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#EAEFF4" : isFocused ? "#B4C400" : "transparent",
      color: isSelected || isFocused ? "#000000" : "#333",
      justifyContent: "center", 
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: "center", // Centra el texto seleccionado
    }),
    menu: (base) => ({
      ...base,
      border: "2px solid #999",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      color: "#0c0c0c",
    }),
    indicatorsContainer: () => ({
      display: "none", // Oculta la flecha y la 'X'
    }),
  };
  const customStyles3= {
    control: (base) => ({
      ...base,
      backgroundColor: "transparent linear-gradient(135deg, #ffffff 0%, #ffffff 100%) 0% 0% no-repeat padding-box;",
      borderRadius: "37px 37px 37px 37px",
      border: "2px solid #999",
      boxShadow: "5px 4px 16px #d0d7e2",
      justifyContent: "center", 
      alignItems:"center",
      width:"15em",
      height:"auto",
      fontSize:"14px"
    }),
    option: (base, { isFocused, isSelected }) => ({
      ...base,
      backgroundColor: isSelected ? "#EAEFF4" : isFocused ? "#B4C400" : "transparent",
      color: isSelected || isFocused ? "#000000" : "#333",
      justifyContent: "center", 
      cursor: "pointer",
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: "center", // Centra el texto seleccionado
    }),
    menu: (base) => ({
      ...base,
      border: "2px solid #999",
      borderRadius: "8px",
      backgroundColor: "#ffffff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      color: "#0c0c0c",
    }),
    indicatorsContainer: () => ({
      display: "none", // Oculta la flecha y la 'X'
    }),
  };
  const getNivelData = (porcentaje) => {
    let colorNivel;
  
    if (nivelUsuario === 0) {
      colorNivel = "#ddd"; // Gris
    } else if (nivelUsuario === 1) {
      colorNivel = "#63B0DB"; // Azul
    } else if (nivelUsuario === 2) {
      colorNivel = "#57C1A0"; // Turquesa
    } else if (nivelUsuario === 3) {
      colorNivel = "#B4C400"; // Verde
    }
  
    return {
      datasets: [
        {
          data: [porcentaje, 100 - porcentaje],
          backgroundColor: [colorNivel, "#dcdcdc"], // Color dinámico + gris
          borderWidth: 0,
        },
      ],
    };
  };
  const getNivelColor = (nivel) => {
    switch (nivel) {
      case 1:
        return "#63B0DB"; // Azul
      case 2:
        return "#57C1A0"; // Turquesa
      case 3:
        return "#B4C400"; // Verde
      default:
        return "#ddd"; // Gris (nivel 0 o indefinido)
    }
  };
  const getNivelComision = () => {
    return {
      color: getNivelColor(nivelUsuario),
      fontWeight: "bold",
    };
  };
 
  const niveles = [
    { nivel: 0, porcentaje: 0 },
    { nivel: 1, porcentaje: 33.3 },
    { nivel: 2, porcentaje: 66.6 },
    { nivel: 3, porcentaje: 100 },
  ];
  

  // Filtrar niveles para pantallas pequeñas
  let nivelesFiltrados = niveles;
  let posiciones = {};

  if (windowWidth<500) {
    const nivelActual = niveles.findLast(n => porcentaje >= n.porcentaje);
    const nivelSiguiente = niveles.find(n => porcentaje < n.porcentaje) || niveles[niveles.length - 2];

    nivelesFiltrados = [nivelActual, nivelSiguiente].filter(Boolean);

    if (nivelActual.nivel === niveles[niveles.length - 1].nivel) {
      // Si está en el nivel máximo
      posiciones = {
        [nivelActual.nivel]: "100%",
        [nivelSiguiente.nivel]: "0%",
      };
    } else {
      // Si está en cualquier otro nivel
      posiciones = {
        [nivelActual.nivel]: "0%",
        [nivelSiguiente.nivel]: "100%",
      };
    }
  }
 
  const getProgressBarStyle = (porcentaje) => {
    let backgroundColor = "#ddd"; // Inicialmente gris
    let gradientStart = "#ddd"; // Inicialmente gris
  let gradientMid = "#ddd"; // Mantiene gris más tiempo
  let gradientEnd = "#ddd"; // Transición al color final
  if (nivelUsuario === 3) {
    // 🔹 Personalización para Nivel 3: más turquesa y verde
    gradientMid = "#57C1A0"; // Turquesa más dominante
    gradientEnd = "#B4C400"; // Verde intenso
    return {
      width: `${porcentaje}%`,
      height: "14px",
      borderRadius: "12px",
      transition: "width 0.5s ease-in-out, background 0.5s ease-in-out",
      background: `linear-gradient(90deg, ${gradientStart} 5%, #63B0DB 33%, ${gradientMid} 70%, ${gradientEnd} 100%)`, 
      position: "relative",
      zIndex: 1,
    };
  }

  // 🔹 Transición normal para otros niveles
  if (porcentaje > 0 && porcentaje <= 50) {
    gradientMid = "#A0C4E3"; // Azul tenue para transición suave
    gradientEnd = "#63B0DB"; // Azul fuerte en el 50%
  } else if (porcentaje > 50 && porcentaje <= 90) {
    gradientMid = "#63B0DB"; // Azul fuerte en la mitad
    gradientEnd = "#57C1A0"; // Turquesa en el 75%
  } else if (porcentaje > 90) {
    gradientMid = "#57C1A0"; // Turquesa en 75%
    gradientEnd = "#B4C400"; // Verde en el 100%
  }

  return {
    width: `${porcentaje}%`,
    height: "14px",
    borderRadius: "12px",
    transition: "width 0.5s ease-in-out, background 0.5s ease-in-out",
    background: `linear-gradient(90deg, ${gradientStart} 0%, ${gradientMid} 40%, ${gradientEnd} 100%)`, 
    position: "relative",
    zIndex: 1,
  };
};

  
  const uniqueEntries = new Set();
  return (
    <div className="container">
      <div 
          >
  <div className="select-2"
                    style={{
                     marginBottom:"1em",
                      display: "flex", 
                      flexDirection: "column", // Hace que los elementos se apilen verticalmente
                      alignItems: "center", // Alinea el contenido al extremo derecho
                      gap: "10px" // Espacio entre el Select y el botón
                    }}
                  >
                    <h6 className="select-cel-mes">
                      Seleccione mes de facturacion
                    </h6>
                    <Select 
                      className="select-cel-mes"
                      styles={customStyles3}
                      options={mesOptions}
                      onChange={handleMesChange}
                      value={mesSeleccionado}
                      isClearable
                      menuPlacement="top"
                      
                    />
                    
                    
                   
                
                  </div>
    </div>
        <section className={
            darkMode ? " bg-connect-celular-dark px-4" : "bg-connect-celular px-4"
          }>
            

<div  style={{padding:"10px"}}>
  
  <article className="col-12  d-flex justify-content-center align-items-center">
    
  <div
            className={
              darkMode
                ? " bg-data-title-cel-dark titulo-pequeño border-0 quitar-cursor-pointer"
                : "container-light bg-data-title-cel titulo-pequeño  border-0 quitar-cursor-pointer"
            }
             style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                padding:"5px",
                width:"100%" // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className="row">
            <article  className="col-12">
            <div className=" d-flex justify-content-center border-0 zocoTextCenterInicio zocoFont12">
              <span >
              {nombreComercio}{" "}-{" "} {terminal}
              </span>
               
            </div>

</article>
            </div>
            
          </div>
  </article>

  

          <div style={{marginBottom:"5px"}} className="row">
            
            
      <article className="col-6 col-sm-6 col-md-6 col-lg-4 py-2 d-flex flex-column align-items-center">
        
     
      <div
            className={
              darkMode
                ? " bg-data-title-cel-dark titulo-medio border-0 quitar-cursor-pointer"
                : "container-light bg-data-title-cel titulo-medio border-0 quitar-cursor-pointer"
            }
             style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "auto",
                padding:"5px" // Asegúrate de que coincida con la altura del círculo
              }}
          >
            <div className="row">
            <article  className="col-12">
            <div className=" d-flex justify-content-center border-0 zocoTextCenterInicio zocoFont12">
              <span>
              {nombreComercio}{" "}-{" "} {terminal}
              </span>
               
            </div>

</article>
            </div>
            
          </div>
            <div
              className="d-flex justify-content-center align-items-center"
              style={{position: "relative", width: getWidth(windowWidth), height: getHeigth(windowWidth) }}
            >
              <Pie data={getNivelData(porcentaje)}  options={{ responsive: true, maintainAspectRatio: false, cutout: "80%"}} />
              <span className="zocoFontXXL"
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  fontWeight: "bold",
                  color: getNivelColor(nivelUsuario),
                }}
              >
                Nivel {nivelUsuario}
              </span>
            </div>
            <article className="col-12 col-md-6 col-lg-6 py-2">
                  <div className="select-2"
                    style={{
                      marginTop:"2em",
                      display: "flex", 
                      flexDirection: "column", // Hace que los elementos se apilen verticalmente
                      alignItems: "center", // Alinea el contenido al extremo derecho
                      gap: "10px" // Espacio entre el Select y el botón
                    }}
                  >
                    {/* <Select 
                      className="select-cel-mes"
                      styles={customStyles2}
                      options={mesOptions}
                      onChange={handleMesChange}
                      value={mesSeleccionado}
                      isClearable
                      menuPlacement="top"
                    />
                    
                     */}
                   
                
                  </div>
                </article>

           

         
            
          </article>
          <article className="col-6 col-sm-6 col-md-6 col-lg-8 py-2">
            <div className="col">
              <div className="row">
                <div className="col comision-cel">
                <article className="col-12 col-md-6 col-lg-6  py-2">
                <h6 className="zocoFontLarge">
                  Comision actual: 
                 
              </h6>
              <h6 className="zocoFontLarge" style={{ display: "flex", alignItems: "center", gap: "2px" }}>
  <button 
    className="btn-status" 
    disabled 
    style={{
      backgroundColor: getNivelColor(nivelUsuario), 
      width: "30px", 
      height: "30px", 
      borderRadius: "100%", 
      marginRight: "1px", 
      border: "none",
    }}
  >
    <ZocoBolsa className="iconBag"/>
  </button>

  <span style={{ color: getNivelColor(nivelUsuario), fontWeight: "bold" }}>
    {new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(comision)}
  </span>
</h6>
              {/* <h6 className="fs-17 lato-bold">
                {nombreComercio}
              </h6> */}
              {windowWidth>500?(
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
                     
                    {"  "} Estatus: <button className="btn-status" disabled style={{backgroundColor:getNivelColor(nivelUsuario), width:"10px", height:"10px", borderRadius:"100%", marginRight:"3px", marginLeft:"3px"}}></button> {" "}{estado===true?"Activo":estado}{" "}Categoria{" "}{nivelUsuario} 
    
                  </div>
              ):(
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
                     
                    {"  "} Estatus: <button className="btn-status" disabled style={{backgroundColor:getNivelColor(nivelUsuario), width:"10px", height:"10px", borderRadius:"100%", marginRight:"3px", marginLeft:"3px"}}></button> {" "}{estado===true?"Activo":estado}{" "}
    
                  </div>
              )}
              {/* <div  className={
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
                 
                {"  "} Estatus: <button className="btn-status" disabled style={{backgroundColor:getNivelColor(nivelUsuario), width:"10px", height:"10px", borderRadius:"100%", marginRight:"3px", marginLeft:"3px"}}></button> {" "}{estado===true?"Activo":estado}{" "}Categoria{" "}{nivelUsuario} 

              </div> */}
              <article className="col-12 col-md-6 col-lg-6 py-2">
                  
                    
                    <div>
                    {/* <button 
                  className="btn btn-referir-2" 
                  style={{
                    display: "flex",
                    flexDirection: "row", // Asegura que los elementos estén en línea horizontal
                    alignItems: "center", // Centra el icono y el texto verticalmente
                    justifyContent: "center", // Centra el contenido dentro del botón
                    background: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
                    border: "2px solid #999",
                    height: "50px",
                    padding: "0 15px", // Espaciado interno
                    gap: "8px", // Espacio entre el icono y el texto
                    textAlign: "center", // Asegura que el texto esté alineado correctamente
                    whiteSpace: "nowrap", // Evita que el texto se divida en dos líneas
                    borderRadius:"37px 37px 37px 37px",
                    boxShadow: "6px 7px 9px #3C88D338",
                  }}
                >
                  <FontAwesomeIcon icon={faClipboardList} style={{color:"#B4C400", fontSize: "1.8em" }} />
                  <span className="zocoFontMedium" style={{ lineHeight: "1" }}>Seguí refiriendo</span>
                </button> */}
                    </div>
                    
                
                  
                </article>
          
        </article>
        

                </div>
                <article className="col-12 col-md-6 col-lg-6 py-2">
                  <div className="buttons1"
                    style={{
                      marginRight: "2em", 
                      display: "flex", 
                      flexDirection: "column", // Hace que los elementos se apilen verticalmente
                      alignItems: "flex-end", // Alinea el contenido al extremo derecho
                      gap: "10px" // Espacio entre el Select y el botón
                    }}
                  >
                    <Select 
                      styles={customStyles}
                      options={mesOptions}
                      onChange={handleMesChange}
                      value={mesSeleccionado}
                      isClearable
                    />
                    
                    
                    <button 
                  className="btn btn-referir " 
                  style={{
                    display: "flex",
                    flexDirection: "row", // Asegura que los elementos estén en línea horizontal
                    alignItems: "center", // Centra el icono y el texto verticalmente
                    justifyContent: "center", // Centra el contenido dentro del botón
                    background: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
                    border: "2px solid #999",
                    height: "50px",
                     // Opcional: ajusta el ancho del botón
                    padding: "0 15px", // Espaciado interno
                    gap: "8px", // Espacio entre el icono y el texto
                    textAlign: "center", // Asegura que el texto esté alineado correctamente
                    whiteSpace: "nowrap", // Evita que el texto se divida en dos líneas
                    boxShadow: "6px 7px 9px #3C88D338",
                    borderRadius:"37px 37px 37px 37px"
                  }}
                >
                  <FontAwesomeIcon icon={faClipboardList} style={{color:"#B4C400", fontSize: "1.8em" }} />
                  <span className="zocoFontMedium" style={{ lineHeight: "1" }}>Seguí refiriendo</span>
                </button>
                
                  </div>
                </article>
                
              </div>
             

            </div>
          </article>
           
            
          
          
          <div className="row">
              <article className="col-12">
              
                <div className="zocoFontMedium level-progress-cel" style={styles.progressLevels}>
                    <span  ><div  className={
              darkMode
                ? " bg-data-comision-dark border-0 quitar-cursor-pointer  zocoFontMedium"
                : "container-light bg-data-comision  border-0 quitar-cursor-pointer zocoFontMedium"
            }
             style={{
                display: "flex",
                justifyContent:"center",
                alignItems: "center",
                height: "35px", // Asegúrate de que coincida con la altura del círculo
              }}>
                Comision por nivel

              </div> </span>
                    <span style={{color:"#63B0DB"}} className="zocoFontLarge span-level1">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(comision1)}</span>
                    <span style={{color:"#57C1A0"}} className="zocoFontLarge span-level2" >{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(comision2)}</span>
                    <span style={{color:"#B4C400"}} className="zocoFontLarge ">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(comision3)}</span>
                  </div>
               
                  <div className="bar-inicio justify-content-center zocoFontXLBold" style={styles.progressContainer}>
                    {/* CÍRCULOS DE NIVELES FIJOS EN EL 100% */}
                    {nivelesFiltrados.map(({ nivel, porcentaje: nivelPorcentaje }) => (
                        <button
                          key={nivel}
                          className="btn btn-nivel-responsive  text-center align-content-center"
                          disabled
                          style={{
                            ...styles.levelCircle,
                            left: windowWidth<500? posiciones[nivel]: `${nivelPorcentaje}%`, // SIEMPRE en base al 100%
                            backgroundColor:porcentaje >= niveles.find(n => n.nivel === nivel).porcentaje ? "#fff" : "#999",
                             color: nivel > 0 ? getNivelColor(nivel) : "black"
                          }}
                          
                        >
                          
                          {nivel}

                         
                          
                        </button>
                      ))}
                  <div style={getProgressBarStyle(porcentaje)}>

                        
                    </div>
                  </div>
                  
              <div className="level-progress-cel" style={styles.progressLevels}>
                    <span className="zocoFontMedium span-facturacion">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(nivel0)} <p className="zocoFontXS"> Sin facturación
    </p></span>
                    <span className="zocoFontMedium span-facturacion1">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(nivel1)} <p className="zocoFontXS"> Facturación a alcanzar
    </p></span>
                    <span className="zocoFontMedium span-facturacion2">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(nivel2)} <p className="zocoFontXS"> Facturación a alcanzar
    </p></span>
                    <span className="zocoFontMedium">{new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(nivel3)} <p className="zocoFontXS"> Facturación a alcanzar
    </p></span>
                  </div>
                 
                 
                </article>
                <div className="py-4 d-block d-xl-none">
                  <div className="d-md-none d-block">
                    <div className="d-flex justify-content-center align-content-center">
                      <img src={infocelu} width={getSizeImg(windowWidth)} style={{marginLeft:"2em", marginTop:"-3em"}}>
                      </img>

                    </div>

                  </div>

                </div>
                
          
         
          
                
                </div>
       
        

      </div>

          </div>
          </section> 
    <div  className={
          darkMode
            ? " container table-responsive py-5 bg-tabla-calculadora-dark my-5"
            : "container table-responsive py-5 bg-tabla-calculadora my-5"
        }>
    <table className="table table-borderless responsive striped hover">
        <thead className="bg-dark py-2">
        <tr className="text-center tabla-thead">
                                      
                                        
                                      
                                      <th
                                          className={
                                            darkMode
                                              ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 priority-1 "
                                              : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  priority-1"
                                          }
                                          scope="col"
                                      >
                                          Nombre Aliado
                                      </th>
                                      <th
                                          className={
                                            darkMode
                                              ? " bg-white text-dark border-0 lato-regular fs-12 py-3  priority-2"
                                              : "bg-dark text-white fs-12 lato-regular py-3  priority-2"
                                          }
                                          scope="col"
                                      >
                                          Comision
                                      </th>
                                      <th
                                         className={
                                          darkMode
                                            ? " bg-white text-dark  border-tabla-derecha border-0 lato-regular fs-12 py-3 priority-2"
                                            : "bg-dark text-white border-tabla-derecha fs-12 lato-regular py-3  priority-2"
                                        }
                                          scope="col"
                                      >
                                          Detalle
                                      </th>
                                      

                                  </tr>

        </thead>
        <tbody className="text-center">
          {resultadosPorMes.length > 0 ? (
    resultadosPorMes
      .filter((dato) => {
        const key = `${dato.cuit}-${dato.nombre}`;
        if (uniqueEntries.has(key)) {
          return false; // Ya existe, lo excluimos
        }
        uniqueEntries.add(key);
        return true; // Se agrega si es único
      })
      .map((dato, index) => (
                <tr  className={
                  darkMode ? "bg-dark text-white" : "bg-white text-dark"
              }
             > 
              
              
              <td
              className={
                  darkMode
                      ? "fs-10 lato-regular py-3 priority-1 text-white "
                      : "fs-10 lato-regular py-3 priority-1 "
              }
          >
            {dato.nombre}

          </td>
         
              
              
              <td
                  
                  className={
                      darkMode
                          ? "fs-10 lato-regular py-3 prority-2 text-white "
                          : "fs-10 lato-regular py-3 prority-2 "
                  }
              >
               {new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
  }).format(dato.totalBruto)}
              </td>
              <td
                  
                  className={
                      darkMode
                          ? "fs-10 lato-regular py-3 priority-2 text-white "
                          : "fs-10 lato-regular py-3 priority-2 "
                  }
              >
               <button type="submit"
                    className="btn lato-regular"
                    onClick={() => handleVerClick(dato)}
                    style={{
                        borderRadius: "23px",
                        width: "auto",
                        height: "auto",
                        background: "#B4C400",
                        color: "#FFFFFF",
                        fontSize: "10px",
                        
                    }}>
                      Ver

               </button>
              </td>
             

</tr>
              ))
            ):(
                <td>No hay datos para mostrar</td>
            )
              
          }
         

        </tbody>

      </table>


    </div>

    <div className="select-cel-mes">
    <button
      className="btn btn-referir-2"
      onClick={() => setExpandido(!expandido)}
      style={{
        position: "fixed",
        top: "20vh",
        right: "10px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(99deg, #FFFFFF 7%, #FBFCFD 44%, #F0F4F7 76%, #EAEFF4 90%)",
        border: "2px solid #999",
        height: "50px",
        padding: expandido ? "0 15px" : "0 12px",
        gap: expandido ? "8px" : "0",
        textAlign: "center",
        whiteSpace: "nowrap",
        borderRadius: "37px",
        boxShadow: "6px 7px 9px #3C88D338",
        transition: "all 0.3s ease-in-out",
        overflow: "hidden",
      }}
    >
      <FontAwesomeIcon
        icon={faClipboardList}
        style={{ color: "#B4C400", fontSize: "1.8em" }}
      />
      {expandido && (
        <span
          className="zocoFontMedium"
          style={{ lineHeight: "1", marginLeft: "8px" }}
        >
          Seguí refiriendo
        </span>
      )}
    </button>
    </div>
    
    </div>

  )
}

export default ContenidoInicioCelular