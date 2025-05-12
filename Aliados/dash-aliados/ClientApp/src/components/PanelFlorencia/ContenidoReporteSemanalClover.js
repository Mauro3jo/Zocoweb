import React, { useEffect, useState, useContext } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { ReporteCloverContext } from '../../context/ReporteCloverContext';
import { Table, Form } from 'react-bootstrap';


const ContenidoReporteSemanalClover = () => {
  const { datosResumenDiario, fetchDatosResumenDiario } = useContext(ReporteCloverContext);
  const [cargando, setCargando] = useState(false);
  const [filaExtendida, setFilaExtendida] = useState(null);
  const { darkMode } = useContext(DarkModeContext);


  useEffect(() => {
    const obtenerDatos = async () => {
        if (typeof fetchDatosResumenDiario === 'function') {
            try {
                setCargando(true);
                await fetchDatosResumenDiario();
                console.log('Datos desde el backend:', datosResumenDiario);
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            } finally {
                setCargando(false);
            }
        } else {
            console.error('fetchDatosResumenDiario no está definido o no es una función');
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
      {/* {cargando ? (
      <div>Cargando datos...</div>
  ) : datosResumenDiario ? (
      <pre>{JSON.stringify(datosResumenDiario, null, 2)}</pre>
  ) : (
      <div>No hay datos disponibles.</div>
  )} */}
  
  
     
  
  <div>

      {cargando ? (
        <div>Cargando datos...</div>
      ) : datosResumenDiario.length > 0 ? (
        <div className={darkMode ? "container table-responsive py-3 px-5" : "container table-responsive py-3 px-5"}>
          <Table responsive striped hover>
            <thead className="border-0 bg-dark py-2">
              <tr className="text-center tabla-thead">
                <th className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3"}>
                  Numero de Terminal
                </th>
                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-12 py-3" : "bg-dark text-white fs-12 lato-regular py-3"}>
                  Provincia
                </th>
                <th className={darkMode ? "bg-white text-dark border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"}>
                  Nombre de Fantasia
                </th>
                <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-12 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-12 py-3"}>
                  Fecha de Alta
                </th>
                {datosResumenDiario[0]?.montosPorDia?.slice().reverse().map((_, i) => {
                
                  return (
                    <th
                      key={i}
                      className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}
                    >
                      {datosResumenDiario.fechas}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="text-center">
              {datosResumenDiario.map((dato, index) => (
                <tr
                  key={index}
                  className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
                  onClick={() => handleFilaClick(index)}
                >
                  <td className="fs-12-a-10 lato-regular py-3 priority-1">
                    {dato.numeroDeTerminal || "N/A"}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-3">
                    {dato.provincia || "N/A"}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-3">
                    {dato.nombreDeFantasia || "N/A"}
                  </td>
                  <td className="fs-12-a-10 lato-regular py-3 priority-4">
                    {dato.fechaAlta || "N/A"}
                  </td>
                  {dato.montosPorDia
                    ? dato.montosPorDia.slice().reverse().map((facturacion, i) => (
                        <td
                          key={i}
                          style={{
                            whiteSpace: 'nowrap',
                            overflow: 'visible',
                            textOverflow: 'clip',
                            maxWidth: '100px',
                            verticalAlign: 'middle',
                          }}
                          className={
                            darkMode
                              ? "fs-11 lato-bold py-4 prority-4 text-white"
                              : "fs-11 lato-bold py-4 prority-4"
                          }
                        >
                          {facturacion.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                        </td>
                      ))
                    : (
                      <td colSpan={dato.montosPorDia?.length || 1}>
                        No hay facturación disponible.
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <div>No hay datos disponibles.</div>
      )}
    </div>
  
  
  </div>
  )
}

export default ContenidoReporteSemanalClover