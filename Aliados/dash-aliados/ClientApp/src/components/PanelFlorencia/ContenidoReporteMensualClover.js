import React, { useEffect, useState, useContext } from 'react'
import { ReporteCloverContext } from '../../context/ReporteCloverContext';
import { DarkModeContext } from '../../context/DarkModeContext';
import { Table, Form } from 'react-bootstrap';

const ContenidoReporteMensualClover = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [filaExtendida, setFilaExtendida] = useState(null);

    const [cargando, setCargando] = useState(false);
    const { datosResumenMensual, fetchDatosResumenMensual } = useContext(ReporteCloverContext);

    useEffect(() => {
        const obtenerDatos = async () => {
            if (typeof fetchDatosResumenMensual === 'function') {
                try {
                    setCargando(true);
                    await fetchDatosResumenMensual();
                    console.log('Datos desde el backend:', datosResumenMensual);
                } catch (error) {
                    console.error('Error al obtener los datos:', error);
                } finally {
                    setCargando(false);
                }
            } else {
                console.error('fetchDatosResumenMensual no está definido o no es una función');
            }
        };

        obtenerDatos();
    }, []);


   

    const tableRowStyle = {
        transition: "transform 0.2s ease-in-out",
    };

    const tableCellStyle = (isExpanded) => ({
        whiteSpace: isExpanded ? "normal" : "nowrap",
        overflow: isExpanded ? "visible" : "hidden",
        textOverflow: isExpanded ? "clip" : "ellipsis",
        height: isExpanded ? "auto" : "60px",
    });

    const handleFilaClick = (index) => {
        setFilaExtendida(filaExtendida === index ? null : index);
    };

  return (
     <div>
    {/* // {cargando ? (
    //     <div>Cargando datos...</div>
    // ) : datosResumenMensual ? (
    //     <pre>{JSON.stringify(datosResumenMensual, null, 2)}</pre>
    // ) : (
    //     <div>No hay datos disponibles.</div>
    // )}
     */}


    <div className={
                        darkMode
                        ? "container table-responsive py-3 px-5"
                        : "container table-responsive py-3 px-5"
                      }>
                        <Table table table-borderless responsive striped hover>
            <thead className="border-0 bg-dark py-2">
              <tr className="text-center tabla-thead">
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3  "
                }
                scope="col ">Numero de Terminal</th >
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white fs-12 lato-regular py-3   "
                }
                scope="col">Mes</th>
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white fs-12 lato-regular py-3   "
                }
                scope="col">Provincia</th>
                                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tablaborder-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white border-tabla border-0 lato-regular fs-12 py-3  "
                }
                scope="col ">Nombre de Fantasia</th>
                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tabla border-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white border-tabla border-0 lato-regular fs-12 py-3  "
                }
                scope="col ">Fecha de alta</th>
                <th className={
                  darkMode
                    ? " bg-white text-center text-dark border-tabla-derecha border-0 lato-regular fs-12 py-3  "
                    : "bg-dark text-center text-white border-tabla-derecha border-0 lato-regular fs-12 py-3 "
                }
                scope="col ">Total Montos</th>
                            </tr>
                        </thead>
                          <tbody className="text-center">
                          {Array.isArray(datosResumenMensual) && datosResumenMensual.length > 0 ? (
    datosResumenMensual.map((dato, index) => (
      <tr
        className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
        style={tableRowStyle}
        onClick={() => handleFilaClick(index)}
        key={index}
      >
        <td className="fs-12-a-10 lato-regular py-3 priority-1">
          {dato.numeroDeTerminal}
        </td>
        <td className="fs-12-a-10 lato-regular py-3 priority-2">
          {dato.mes}
        </td>
        <td className="fs-12-a-10 lato-regular py-3 priority-3">
          {dato.provincia}
        </td>
        <td className="fs-12-a-10 lato-regular py-3 priority-3">
          {dato.nombreDeFantasia}
        </td>
        <td className="fs-12-a-10 lato-regular py-3 priority-4">
          {dato.fechaAlta}
        </td>
        <td className="fs-12-a-10 lato-regular py-3 priority-1">
          {dato.totalMontos.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              })}
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="12">No hay datos disponibles.</td>
    </tr>
  )}
                              
                          </tbody>

                    </Table>
        
    </div>
    
    </div>

    
  )
}

export default ContenidoReporteMensualClover