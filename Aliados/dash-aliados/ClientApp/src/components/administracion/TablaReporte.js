import React, { useContext, useState, useEffect } from "react";
import { Table, Button, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";
import GrafTerminal from "../GrafTerminales";
import DatosReportes from "../DatosReportes";
import GraficoTerminales from "../GraficoTerminales";
import GrafLineasTerminales from "../GrafLineasTerminales";
import { FacturacionContext } from "../../context/FacturacionContext";
import DatosDiarios from "../PanelFlorencia/DatosDiarios";
import GraficoProvincias from "../PanelFlorencia/GraficoProvincias";

const TablaReporte = () => {
  const darkMode = useContext(DarkModeContext);
    const { datosResumenMensual, datosResumenFacturacionPorTerminales, datosBarraComparativa, datosFacturacionPorTerminalSemana, datosBarraComparativaProvincia } = useContext(FacturacionContext);
  useEffect(() => {
     // Mostrar datos en consola
    
    // Simular que la carga ha terminado cuando datosResumenMensual ya esté disponible
    if (datosResumenMensual && datosResumenFacturacionPorTerminales&& datosBarraComparativa && datosFacturacionPorTerminalSemana && datosBarraComparativaProvincia) {
      setLoading(false); // Cambiar el estado de carga a false cuando haya datos
    }
  }, [datosResumenMensual, datosResumenFacturacionPorTerminales, datosBarraComparativa, datosFacturacionPorTerminalSemana,datosBarraComparativaProvincia]); 
  const [reportes, setReportes] = useState([]);
  const [evolucionResultados, setEvolucionResultados] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataFacturacion, setDataFacturacion] = useState({
    totalBruto:0,
    totalNeto:0,
    totalDebito:0,
    _1Pago:0,
    CreditoCuotas:0,
    conFacturacion: 0,
    sinFacturacion: 0,
    totalComercios:0,
    porcentajeSinFacturacion:0,
    porcentajeConFacturacion:0,
    porcentajeCredito:0,
    porcentajeDebito:0,
    porcentaje1Pago:0
  });
  const [dataValores, setValores]=useState({
    cantOperaciones:0,
    debito:0,
    credito:0,
    unPago:0
  })

  // Carga inicial de reportes al montar el componente
  // useEffect(() => {
  //   fetchReportesInicial();
  // }, []);

  // const fetchReportesInicial = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch(
  //       process.env.REACT_APP_API_REPORTE_MENSUAL_VERTODOS
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setReportes(data);
  //     } else {
  //       console.error("Error fetching data");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleButtonClick = async () => {
  //   const token = sessionStorage.getItem("token");
  //   const hoy = "2024/07/31";

  //   try {
  //     const response = await fetch("/api/reportemensual/reportemensual", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ Token: token, Fecha: hoy }),
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data);
  //       // Aquí puedes decidir qué hacer con los datos recibidos
  //     } else {
  //       console.error(`Error fetching data: ${response.status} ${response.statusText}`);
  //           const errorData = await response.json();
  //           console.error("Detalles del error:", errorData);
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  // const handleEvolucionButtonClick = async () => {
  //   const token = sessionStorage.getItem("token");
  //   const hoy = "2024/07/31";

  //   try {
  //     const response = await fetch("/api/reportemensual/evolucionterminales", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ Token: token, Fecha: hoy }),      
  //     });
  //     if (response.ok) {
  //       const data = await response.json();
  //       setEvolucionResultados(data);
  //       console.log(data);
  //       processReportData(data);
  //       processResults(data)
  //     } else {
  //       console.error("Error fetching data");
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };
  // const processResults=(data)=>{
  //   console.log(data.resultadosAdicionales, data.conteoOperaciones)
  //   const {
  //     totalDebito,
  //     _1Pago,
  //     creditoCuotas
  //   } = data.resultadosAdicionales;
  
  //   let totalConteoOperaciones = 0;
  //   for (const fecha in data.conteoOperaciones) {
  //     totalConteoOperaciones += data.conteoOperaciones[fecha];
  //   }
  
  //   // Creando un nuevo objeto con los valores procesados
  //   const dataValores = {
  //     cantOperaciones: totalConteoOperaciones, // Asegúrate de que 'conteoOperaciones' se envíe correctamente desde el backend
  //     debito: totalDebito,
  //     credito: creditoCuotas,
  //     unPago: _1Pago
  //   };
  //   setValores(dataValores)
  //   console.log(dataValores)
      
  // }
  // const processReportData = (data) => {
  //   console.log("Datos recibidos en processReportData:", data.resultadosAdicionales);
  //   const {
  //       totalBruto,
  //       totalDebito,
  //       _1Pago,
  //       creditoCuotas,
  //       totalNeto,
  //       comerciosConBruto,
  //       comerciosSinBruto,
  //       comercios,
  //       porcentajesSinBruto,
  //       porcentajesConBruto,
  //       porcentajeDebito,
  //       porcentaje1Pago,
  //       porcentajeCreditoCuotas
  //   } = data.resultadosAdicionales;

  //   const dataFacturacion = {
  //       bruto: totalBruto,
  //       debito: totalDebito,
  //       unpago: _1Pago,
  //       credito: creditoCuotas,
  //       neto: totalNeto,
  //       conFacturacion: comerciosConBruto,
  //       sinFacturacion: comerciosSinBruto,
  //       totalComercios: comercios,
  //       porcentajeSinFacturacion: porcentajesSinBruto,
  //       porcentajeConFacturacion: porcentajesConBruto,
  //       porcentajesDebito: porcentajeDebito,
  //       porcentajes1Pago: porcentaje1Pago,
  //       porcentajesCredito: porcentajeCreditoCuotas
  //   };
    
  //   setDataFacturacion(dataFacturacion); // Asegúrate de que esta función está definida para actualizar el estado
  //   console.log("Data de facturación procesada:", dataFacturacion);
  // };
//   const handleMetodoButtonClick = async() =>{
//     const token = sessionStorage.getItem("token");
//     const hoy = "2024/06/01";
//     try{
//         const response= await fetch('api/reportemensual/evolucionterminales',{
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'aplication/json'
//             },
//             body: JSON.stringify({Token:token, Fecha:hoy})
//         });
//         if (response.ok) {
//             const data= await response.json()

//         }
//     }
//   }

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className={darkMode ? "dark-mode" : ""}>
      
        <div>
          <DatosReportes data={datosResumenMensual}/>
          {/* <pre>{JSON.stringify(evolucionResultados, null, 2)}</pre> */}
          <div>
            <section translate="no" className="container">
              <div className="row">
                <article className="col-12 col-lg-6 my-2">
                <div>
                  <GrafTerminal data={datosResumenFacturacionPorTerminales} />
                </div>
              
              
              
              </article>
              <article className="col-12 col-lg-6 my-2">
                <div>
                  <GraficoTerminales data={datosResumenFacturacionPorTerminales} />
                </div>
                
              
              
              
              </article>
              <article className= "col-12 col-lg-12 my-2">
              <div>
                  <GrafLineasTerminales data={datosBarraComparativa} />
                </div>

              </article>
              <article className= "col-12 col-lg-12 my-2">
              <div>
                  <GraficoProvincias data={datosBarraComparativaProvincia} />
                </div>

              </article>
              </div>
              
            

            </section>
            
          </div>
          <DatosDiarios data={datosFacturacionPorTerminalSemana}/>
        </div>
      

      {/* <Button
      onClick={handleMetodoButtonClick}
      style={{marginLeft:"10px"}}>
        Metodo de pago mas usado
      </Button> */}

      {/* <Table striped bordered hover>
        <thead>
          <tr>
            <th>Nro de Comercio</th>
            <th>Nombre Comercio</th>
            <th>Fecha de Pago</th>
            <th>Total Bruto</th>
            <th>Total Débito</th>
            <th>1 Pago</th>
            <th>Crédito Cuotas</th>
            <th>Total Neto</th>
            <th>Total Costo Financiero</th>
            <th>Costo por Anticipo Total</th>
            <th>Arancel</th>
            <th>Impuesto al Débito y Crédito</th>
            <th>Retención Provincial</th>
            <th>Retención Ganancia</th>
            <th>Retención IVA</th>
            <th>Retención Municipal</th>
            <th>Retención Impositiva</th>
            <th>CBU/CVU</th>
            <th>Banco</th>
            <th>Tipo de Cuenta</th>
            <th>Nro de Cuenta</th>
            <th>Alias</th>
            <th>Retención</th>
            <th>Asesor ABM</th>
            <th>Rubro</th>
            <th>Fecha Alta Comercio</th>
            <th>Provincia ABM</th>
            <th>Razón Social</th>
            <th>Legajo</th>
            <th>Cód. Actividad</th>
            <th>Año Pago</th>
            <th>Mes Pago</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.slice(0, 10).map((reporte, index) => (
            <tr key={index}>
              <td>{reporte.nroDeComercio}</td>
              <td>{reporte.nombreComercio}</td>
              <td>{new Date(reporte.fechaDePago).toLocaleDateString()}</td>
              <td>{reporte.totalBruto}</td>
              <td>{reporte.totalDebito}</td>
              <td>{reporte._1Pago}</td>
              <td>{reporte.creditoCuotas}</td>
              <td>{reporte.totalNeto}</td>
              <td>{reporte.totalCostoFinanciero}</td>
              <td>{reporte.costoPorAnticipoTotal}</td>
              <td>{reporte.arancel}</td>
              <td>{reporte.impuestoAlDebitoYCredito}</td>
              <td>{reporte.retencionProvincial}</td>
              <td>{reporte.retencionGanancia}</td>
              <td>{reporte.retencionIva}</td>
              <td>{reporte.retencionMunicipal}</td>
              <td>{reporte.retencionImpositiva}</td>
              <td>{reporte.cbuCvu}</td>
              <td>{reporte.banco}</td>
              <td>{reporte.tipoDeCuenta}</td>
              <td>{reporte.nroDeCuenta}</td>
              <td>{reporte.alias}</td>
              <td>{reporte.retencion}</td>
              <td>{reporte.asesorAbm}</td>
              <td>{reporte.rubro}</td>
              <td>{reporte.fechaAltaComercio}</td>
              <td>{reporte.provinciaAbm}</td>
              <td>{reporte.razonSocial}</td>
              <td>{reporte.legajo}</td>
              <td>{reporte.codActividad}</td>
              <td>{reporte.añoPago}</td>
              <td>{reporte.mesPago}</td>
              <td>
                <Button variant="info">
                  <FontAwesomeIcon icon={faEye} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table> */}
    </div>
  );
};

export default TablaReporte;
