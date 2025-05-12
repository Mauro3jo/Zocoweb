import React, { useContext, useState } from 'react';
import {
    FormControl,
    Row,
    Col,
    Form,
    Button,
    Table
} from 'react-bootstrap';
import { DarkModeContext } from "../../context/DarkModeContext";
import Select from "react-select";
import { ReactComponent as DisponibleIcon } from "../../assets/svg/Recurso 7.svg";
import { ReactComponent as AltaIcon } from "../../assets/svg/Recurso 8.svg";
import { ReactComponent as BajaIcon } from "../../assets/svg/Recurso 9.svg";
import { ReactComponent as ServicioIcon } from "../../assets/svg/Recurso 10.svg";
import { ReactComponent as ExtraviadaIcon } from "../../assets/svg/Recurso 12.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFileInvoice,
    faSearch,
    faUndo,
    faEye,
    faEdit,
    faPlus,
    faTimes,
    faLocationDot,
    faFileExcel
  } from "@fortawesome/free-solid-svg-icons";

const ComponenteTablaMensual = ({ datos = [] }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [filaExtendida, setFilaExtendida] = useState(null);
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [filters, setFilters] = useState({
        searchTerms: {},
        estado: null,
    });

    const selectOptions = [
        { value: "nDeTerminal", label: "N° Terminal" },
        { value: "cuit", label: "CUIT/CUIL" }
    ];

    const handleSearchSubmit = () => {
        if (!searchValue || searchValue.trim().length < 4 || !searchField) {
            return;
        }

        setFilters((prevFilters) => ({
            ...prevFilters,
            searchTerms: {
                ...prevFilters.searchTerms,
                [searchField]: searchValue.trim(),
            },
        }));
    };

    const estadoFacturacionOptions = [
        { value: "Activo", label: "Activo" },
        { value: "Baja Facturación", label: "Baja Facturación" },
        { value: "No Factura", label: "No Factura" }, // Actualizamos la descripción aquí
      ];

      const filteredDatos = datos.filter((dato) => {
        // Filtrar por términos de búsqueda
        const matchesSearchTerms = Object.keys(filters.searchTerms).every((field) => {
            const searchValue = filters.searchTerms[field]?.toLowerCase() || '';
            const datoField = dato[field]?.toString().toLowerCase() || '';
            return datoField.includes(searchValue);
          });
      
      
        // Filtrar por tiempo inactivo seleccionado
        const matchesEstadoFacturacion = (() => {
          if (!filters.estadoFacturacion) return true;
      
          // Si se seleccionó "Activo"
          if (filters.estadoFacturacion === "Activo") {
            return dato.estadoFacturacion === "Activo";
          }
      
          // Si se seleccionó "No factura"
          if (filters.estadoFacturacion === "No factura") {
            // Usamos una expresión regular para detectar "No factura hace X días"
            const regex = /No factura hace \d+ días/;
            return regex.test(dato.estadoFacturacion);
          }
      
          // Otros estados (como "Baja facturación")
          return dato.estadoFacturacion === filters.estadoFacturacion;
        })();
        
      
        // Retornar verdadero si ambos filtros coinciden
        return matchesSearchTerms && matchesEstadoFacturacion;
      });

    const handleSelectorChange = (selectedOption) => {
        setSearchField(selectedOption.value);
        setSearchValue("");
    };

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

    // Helper para obtener los nombres de los meses, con el último mes siendo mesFacturacion
    const obtenerNombresMeses = (mesActual) => {
        const mesesNombres = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        let nombresMeses = [];

        for (let i = 3; i >= 0; i--) {
            let mesIndex = (mesActual - i - 1 + 12) % 12; // Calcular el índice del mes retrocediendo
            nombresMeses.push(mesesNombres[mesIndex]);
        }

        return nombresMeses;
    };
    const getEstadoIcon = (estado) => {
        switch (estado) {
            case "ALTA":
                return <AltaIcon style={{ width: 24, height: 24 }} />;
            case "BAJA":
                return <BajaIcon style={{ width: 24, height: 24 }} />;
            case "SERVICIO.TECNICO":
                return <ServicioIcon style={{ width: 24, height: 24 }} />;
            case "DISPONIBLE":
                return <DisponibleIcon style={{ width: 24, height: 24 }} />;
            case "EXTRAVIADA":
                return <ExtraviadaIcon style={{ width: 24, height: 24 }} />;
            default:
                return estado; // En caso de que no haya un ícono para el estado
        }
    };
    const getColorFacturacion=(valor)=>{
        if (valor==="Activo") return "#B4C400"
        if(valor==="Baja Facturación") return "#E89F2F"
        else return "#E24444"
      }
      const handleRemoveFilter = (filterKey) => {
        setFilters((prevFilters) => {
          const newFilters = { ...prevFilters };
          if (filterKey === "cuitFilter") {
            newFilters.cuitFilter = null;
          } else {
            delete newFilters.searchTerms[filterKey];
          }
          return newFilters;
        });
      };
    

    return (
        <div>
            <div className='container' style={{ marginBottom: "10px" }}>
                <Row className="my-3 align-items-center">
                    <Col xs="auto">
                        <Form.Label className="fs-18 lato-bold mb-0" style={{ color: "#292B2F" }}>
                            Buscar
                        </Form.Label>
                    </Col>

                    <Col xs="auto">
                        <Select
                            className="select__control_custom-inicio select__control_custom lato-bold fs-12"
                            classNamePrefix="select"
                            value={selectOptions.find((option) => option.value === searchField)}
                            onChange={handleSelectorChange}
                            options={selectOptions}
                            isSearchable={true}
                            placeholder="Seleccione"
                        />
                    </Col>

                    <Col xs="auto">
                        <FormControl
                            className="form-control input-ingresar-buscador-crm px-5 border-0"
                            placeholder={`Buscar por ${selectOptions.find((option) => option.value === searchField)?.label || "Seleccione un campo"}`}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                            disabled={!searchField}
                            style={{ width: "100%" }}
                        />
                    </Col>

                    <Col xs="auto">
                        <Button
                            className="btn-publicar border-0 mx-1"
                            onClick={handleSearchSubmit}
                            disabled={!searchField || searchValue.length < 4}
                        >
                            <FontAwesomeIcon icon={faSearch} />
                        </Button>
                    </Col>
                </Row>
                <Row className="my-3 align-items-center">
                <Col className="d-flex align-items-center justify-content-start">
              <Form.Label className="fs-18 lato-bold mb-0 me-2">Filtrar por Tiempo Inactivo</Form.Label>
              <Select
                className="select__control_custom-inicio select__control_custom lato-bold fs-12 me-2"
                classNamePrefix="select"
                value={estadoFacturacionOptions.find((option) => option.value === filters.estadoFacturacion)}
                onChange={(option) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    estadoFacturacion: option ? option.value : null,
                  }))
                }
                options={estadoFacturacionOptions}
                isClearable={true}
                placeholder="Seleccione"
              />
            </Col>
                </Row>
                <Row className="my-3 align-items-center">
            <Col>
            {Object.keys(filters.searchTerms).map((filterKey) => (
          <span key={filterKey}  className="me-2 mb-2"
          style={{ cursor: "pointer", background: "#B4C400",
            color: "#FFFFFF",
            display: "inline-flex", // Ajustar tamaño al contenido
            alignItems: "center", // Alinear el icono y texto en el centro
            padding: "5px 10px", // Espaciado interno
            borderRadius: "10px", // Bordes redondeados como badges 
            }}>
            {filterKey}: {filters.searchTerms[filterKey]}
            <span>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => handleRemoveFilter(filterKey)}
              className="ml-2"
              style={{ cursor: 'pointer' }}
            />

            </span>
            
          </span>
        ))}
       
            </Col>
        
      </Row>
            </div>

            <section translate="no" className="container py-analisis-grafica">
                <article>
                    <div className={darkMode ? "container table-responsive py-3 px-5" : "container table-responsive py-3 px-5"}>
                        <Table responsive striped hover>
                            <thead className="bg-dark py-2">
                                <tr className="text-center tabla-thead">
                                    <th className={darkMode ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"}>Estado</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Terminal</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Nombre de Fantasía</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>CUIT/CUIL</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Provincia</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Fecha de alta</th>
                                    <th className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>Estado Facturación</th>
                                    {/* Columnas para la facturación mensual */}
                                    {datos.length > 0 && obtenerNombresMeses(datos[0].mesFacturacion).map((mesNombre, i) => (
                                        <th key={i} className={darkMode ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3" : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"}>
                                            {mesNombre}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="text-center">
                                {filteredDatos.length > 0 ? (
                                    filteredDatos.map((dato, index) => (
                                        <tr
                                            className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}
                                            style={tableRowStyle}
                                            onClick={() => handleFilaClick(index)}
                                            key={index}
                                        >
                                            <td style={tableCellStyle(filaExtendida === index)}>{getEstadoIcon(dato.estado)}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>{dato.nDeTerminal}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>{dato.nombreDeFantasia}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>{dato.cuit}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>{dato.provincia}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>{dato.fechaDeAlta}</td>
                                            <td style={tableCellStyle(filaExtendida === index)}>
                    {dato.estadoFacturacion ? (
                        <>
                           
                            {/* Renderizamos el botón si el estadoFacturacion no es nulo o vacío */}
                            <button
                                disabled
                                style={{
                                  borderRadius: "10px",
                                  top: "auto",
                                  left: "auto",
                                  width: "auto",
                                  height: "auto",
                                  background: getColorFacturacion(dato.estadoFacturacion),
                                  color: 'white',
                                   width: filaExtendida === index ? "auto" : "60px",
                                  verticalAlign:"middle",
                                  overflow: "hidden", // Esconder el texto que se sale del botón
                            textOverflow: "ellipsis", // Aplicar puntos suspensivos cuando se corta el texto
                            whiteSpace: filaExtendida === index ? "normal" : "nowrap",}}
                            >
                                {""}
                                 {dato.estadoFacturacion}
                            </button>
                        </>
                    ) : (
                        <span></span>
                    )}
                </td>
                                            {Array.isArray(dato.facturacionPorMes) && dato.facturacionPorMes.length > 0 ? (
                                                dato.facturacionPorMes.map((facturacion, i) => (
                                                    <td
                                                        key={i}
                                                        style={{
                                                            whiteSpace: 'nowrap', // Mantener todo el dato en una línea.
                                                            overflow: 'hidden', // Evitar que el contenido desborde los bordes.
                                                            maxWidth: '100px', // Limitar el ancho de la celda.
                                                            verticalAlign: 'middle', // Centrar verticalmente.
                                                            fontSize: '0.9em', // Reducir ligeramente el tamaño del texto.
                                                        }}
                                                    >
                                                        {facturacion.toLocaleString('es-AR', {
                                                            style: 'currency',
                                                            currency: 'ARS',
                                                            minimumFractionDigits: 0, // Eliminar decimales
                                                            maximumFractionDigits: 0  // Asegurar que no se muestren
                                                        })}
                                                    </td>
                                                ))
                                            ) : (
                                                <td colSpan={datos[0].facturacionPorMes.length}>No hay facturación disponible.</td>
                                            )}


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
                </article>
            </section>
        </div>
    );
};

export default ComponenteTablaMensual;
