import React, { useContext, useState, useEffect } from 'react';
import { FormControl,
    InputGroup,
    Row,
    Col,
    Form,
    Button,
    Card,
    Spinner,
    Modal,
    FormGroup,
    FormLabel,
    Table,
    Badge } from 'react-bootstrap';
import { DarkModeContext } from "../../context/DarkModeContext";
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
import Select from "react-select";




const ContenidoInicio = ({ datos = [] }) => {
    const { darkMode } = useContext(DarkModeContext);
    const [filaExtendida, setFilaExtendida] = useState(null);
    const [searchField, setSearchField] = useState("");
    const [searchValue, setSearchValue] = useState("");
    const [searchTerms, setSearchTerms] = useState({});
    const [showAll, setShowAll] = useState(true);
    const [loading, setLoading] = useState(false);
    const [searchSubmitted, setSearchSubmitted] = useState(false); // Nuevo estado para controlar si se ha enviado una búsqueda
    const [selectedActivo, setSelectedActivo] = useState(null);
    


    const [filters, setFilters] = useState({
        searchTerms: {}, // Aquí se guardan los términos de búsqueda (número de terminal, comercio, CUIT, provincia, etc.)
        estado: null, // Aquí se guarda el estado seleccionado
      });

      const handleSearchSubmit = () => {
        if (!searchValue || searchValue.trim().length < 4 || !searchField) {
          setShowAll(true);
          return;
        }
      
        setLoading(true);
        setTimeout(() => {
          // Solo actualizará los filtros cuando se haga clic en el botón
          setFilters((prevFilters) => ({
            ...prevFilters,
            searchTerms: {
              ...prevFilters.searchTerms,
              [searchField]: searchValue.trim(), // Agregar .trim() para eliminar espacios adicionales
            },
          }));
          setShowAll(false);
          setLoading(false);
          setSearchSubmitted(true); // Marcar que la búsqueda ha sido enviada
        }, 1000);
      };

      const selectOptions = [
        { value: "ndeterminal", label: "N° Terminal" },
        { value: "cuit", label: "CUIT/CUIL" },
        {value:"nombreDeFantasia", label: "Nombre de fantasia"}
        //{ value: "cuitrazonsocial", label: "Cuit razón social" },
        // { value: "estado", label: "Estado" },
      
      ];
      const tiempoInactivoOptions = [
        { value: "Activo", label: "Activo" },
        { value: "Baja facturación", label: "Baja facturación" },
        {value: "Activo (Hoy no facturó)", label:"Hoy no facturó"},
        { value: "No factura", label: "No factura" }, // Actualizamos la descripción aquí
      ];
      const [cuitsNoFacturan, setCuitsNoFacturan] = useState([]);
    const [totalCuitsNoFacturan, setTotalCuitsNoFacturan] = useState(0);
    const [terminalesNoFacturan, setTerminalesNoFacturan]=useState([]);
    const [totalTerminalesNoFacturan, setTotalTerminalesNoFacturan]=useState(0)

    // Calcular los CUITs que no facturan
    
    useEffect(() => {
        const cuitMap = new Map();
    
        datos.forEach((dato) => {
          const cuit = dato.cuit;
          const estadoFacturacion = dato.tiempoInactiva || ''; 
    
          if (!cuitMap.has(cuit)) {
            cuitMap.set(cuit, { facturando: false });
          }
    
          if (!/No factura hace \d+ días/.test(estadoFacturacion)) {
            cuitMap.set(cuit, { facturando: true });
          }
        });
    
        const cuitsSinFacturar = [...cuitMap.entries()]
          .filter(([, value]) => !value.facturando)
          .map(([cuit]) => cuit);
    
        setCuitsNoFacturan(cuitsSinFacturar);
        setTotalCuitsNoFacturan(cuitsSinFacturar.length);
      }, [datos]);
      useEffect(() => {
        const terminalMap = new Map();
      
        datos.forEach((dato) => {
          const terminal = dato.nDeTerminal;
          const estadoFacturacion = dato.tiempoInactiva || ''; // Usamos `tiempoInactiva` que es donde está el estado
      
          if (!terminalMap.has(terminal)) {
            terminalMap.set(terminal, { facturando: false });
          }
      
          // Comparar directamente con "Activo (Hoy no facturó)"
          if (estadoFacturacion !== "Activo (Hoy no facturó)") {
            terminalMap.set(terminal, { facturando: true });
          }
        });
      
        const terminalesSinFacturar = [...terminalMap.entries()]
          .filter(([, value]) => !value.facturando)
          .map(([terminal]) => terminal);
      
        setTerminalesNoFacturan(terminalesSinFacturar);
        setTotalTerminalesNoFacturan(terminalesSinFacturar.length);
      }, [datos]);
      
      const handleCuitSelect = (selectedOption) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          cuitFilter: selectedOption ? selectedOption.value : null,
        }));
      };
      const handleTerminalSelect = (selectedOption) => {
        setFilters((prevFilters) => ({
          ...prevFilters,
          terminalFilter: selectedOption ? selectedOption.value : null,
        }));
      };
    
      // Handler para eliminar filtros individuales
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
    

      const filteredDatos = datos.filter((dato) => {
        // Filtrar por términos de búsqueda
        const matchesSearchTerms = Object.keys(filters.searchTerms).every((field) => {
          const searchValue = filters.searchTerms[field]?.toLowerCase() || '';
          const datoField = dato[field]?.toString().toLowerCase() || '';
      
          // Si el campo es "Nombre de Fantasía", buscar por coincidencia parcial
          if (field === 'nombreDeFantasia') {
            return datoField.includes(searchValue); // Comparación por similitud
          }
      
          // Para otros campos, usar búsqueda exacta
          return datoField.includes(searchValue);
        });
      
          const matchesCuitFilter = filters.cuitFilter ? dato.cuit === filters.cuitFilter : true;
          const matchesTerminalFilter = filters.terminalFilter ? dato.nDeTerminal === filters.terminalFilter : true;
      
        // Filtrar por tiempo inactivo seleccionado
        const matchesTiempoInactivo = (() => {
          if (!filters.tiempoInactivo) return true;
      
          // Si se seleccionó "Activo"
          if (filters.tiempoInactivo === "Activo") {
            return dato.tiempoInactiva === "Activo";
          }
      
          // Si se seleccionó "No factura"
          if (filters.tiempoInactivo === "No factura") {
            // Usamos una expresión regular para detectar "No factura hace X días"
            const regex = /No factura hace \d+ días/;
            return regex.test(dato.tiempoInactiva);
          }
          if (filters.tiempoInactivo === "Hoy no facuró"){
            const regex =/Activo(Hoy no facturó)/;
            return regex.test(dato.tiempoInactiva)
          }
      
          // Otros estados (como "Baja facturación")
          return dato.tiempoInactiva === filters.tiempoInactivo;
        })();
        
      
        // Retornar verdadero si ambos filtros coinciden
        return matchesSearchTerms && matchesCuitFilter && matchesTiempoInactivo && matchesTerminalFilter;
      });
    
      const handleSelectorChange = (selectedOption) => {
        setSearchField(selectedOption.value);
        setSearchValue("");
      };
    
      const customFilterOption = (option, inputValue) => {
        return option.label.toLowerCase().includes(inputValue.toLowerCase());
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
        if(valor==="Baja facturación") return "#E89F2F"
        if(valor==="Activo (Hoy no facturó)") return "#E89F2F"
        else return "#E24444"
      }
      

    return (
        <div>
            
            
                <div className='container' style={{ marginBottom: "10px" }}>
                 {/* Row para buscar */}
          <Row className="my-3 align-items-center">
            {/* Col para Buscar */}
            <Col xs="auto">
              <Form.Label className="fs-18 lato-bold mb-0" style={{ color: "#292B2F" }}>
                Buscar
              </Form.Label>
            </Col>

            {/* Select para elegir campo de búsqueda */}
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

            {/* Campo de búsqueda */}
            <Col xs="auto">
              <FormControl
                className="form-control input-ingresar-buscador-crm px-5 border-0"
                placeholder={`Buscar por ${
                  selectOptions.find((option) => option.value === searchField)?.label ||
                  "Seleccione un campo"
                }`}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                disabled={!searchField}
                style={{ width: "100%" }}
              />
            </Col>

            {/* Botón de búsqueda */}
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

          {/* Fila para filtrar por Tiempo inactivo */}
          <Row className="my-3 align-items-center">
            <Col className="d-flex align-items-center justify-content-start">
              <Form.Label className="fs-16 lato-bold mb-0 me-2">Filtrar por Tiempo Inactivo</Form.Label>
              <Select
                className="select__control_custom-inicio select__control_custom lato-bold fs-12 me-2"
                classNamePrefix="select"
                value={tiempoInactivoOptions.find((option) => option.value === filters.tiempoInactivo)}
                onChange={(option) =>
                  setFilters((prevFilters) => ({
                    ...prevFilters,
                    tiempoInactivo: option ? option.value : null,
                  }))
                }
                options={tiempoInactivoOptions}
                isClearable={true}
                placeholder="Seleccione"
              />
            </Col>

            <Col xs="auto">
                    <Form.Label className="fs-16 lato-bold mb-0">
                        Total de CUITs que no facturan: {totalCuitsNoFacturan}
                    </Form.Label>
                </Col>

                <Col xs="auto">
          <Select
            className="select__control_custom-inicio"
            classNamePrefix="select"
            options={cuitsNoFacturan.map((cuit) => ({ label: cuit, value: cuit }))}
            placeholder="Filtrar por CUIT"
            onChange={handleCuitSelect}
            isClearable={true}
          />
        </Col>
        <Col xs="auto">
                    <Form.Label className="fs-16 lato-bold mb-0">
                        Dejaron de facturar hoy: {totalTerminalesNoFacturan}
                    </Form.Label>
                </Col>

                <Col xs="auto">
          <Select
            className="select__control_custom-inicio"
            classNamePrefix="select"
            options={terminalesNoFacturan.map((nDeTerminal) => ({ label:`${nDeTerminal} - ${datos.find(dato => dato.nDeTerminal === nDeTerminal)?.nombreDeFantasia}`, value: nDeTerminal }))}
            placeholder="Filtrar por Terminal"
            onChange={handleTerminalSelect}
            isClearable={true}
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
        {filters.cuitFilter && (
          <span className=" badge me-2 mb-2"
          style={{ cursor: "pointer", background: "#B4C400",
            color: "#FFFFFF",
            display: "inline-flex", // Ajustar tamaño al contenido
            alignItems: "center", // Alinear el icono y texto en el centro
            padding: "5px 10px", // Espaciado interno
            borderRadius: "10px", // Bordes redondeados como badges
             }}>
            CUIT: {filters.cuitFilter}
            <span>
            <FontAwesomeIcon
              icon={faTimes}
              onClick={() => handleRemoveFilter("cuitFilter")}
              
              style={{ cursor: 'pointer' }}
            />

            </span>
            
          </span>
        )}
            </Col>
        
      </Row>

                </div>
                <section translate="no" className="container py-analisis-grafica">

                
                <article>
                <div
                    className={
                        darkMode
                            ? "container table-responsive py-3 px-5"
                            : "container table-responsive py-3 px-5"
                    }
                >
                        
                            <Table responsive striped hover>
                                <thead className="bg-dark py-2">
                                    <tr className="text-center tabla-thead">
                                      
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Estado
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Terminal
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Nombre de Fantasía
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            CUIT/CUIL
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Provincia
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Fecha de alta
                                        </th>
                                        <th
                                            className={
                                                darkMode
                                                    ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                    : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                            }
                                            scope="col"
                                        >
                                            Tiempo inactiva
                                        </th>
                                    {/* Columnas para la facturación diaria */}
                                    {datos.length > 0 && datos[0].facturacionDiaria.slice().reverse().map((_, i) => {
                                        const [mes] = datos[0].mesYAnio.split("/"); // Extraemos el mes
                                        const dia = datos[0].facturacionDiaria.length - i; // Generamos el día en orden inverso

                                        return (
                                            <th
                                                key={i}
                                                className={
                                                    darkMode
                                                        ? "bg-white text-dark border-tabla border-0 lato-regular fs-14 py-3"
                                                        : "bg-dark text-white border-tabla border-0 lato-regular fs-14 py-3"
                                                }
                                                scope="col"
                                            >
                                                {/* Mostrar el día en formato "dd/MM" */}
                                                {`${dia.toString().padStart(2, '0')}/${mes}`}
                                            </th>
                                        );
                                    })}



                                    </tr>
                                </thead>
                                <tbody className="text-center">
                                    {/* Renderizar tabla vacía si no hay datos */}
                                    {filteredDatos.length > 0 ? (
                  filteredDatos.map((dato, index) => (
                                            <tr
                                                className={
                                                    darkMode ? "bg-dark text-white" : "bg-white text-dark"
                                                }
                                                style={tableRowStyle}
                                                onClick={() => handleFilaClick(index)}
                                                key={index}
                                            >
                                              
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {getEstadoIcon(dato.estado)}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.nDeTerminal}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.nombreDeFantasia}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.cuit ?? "-"}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.provincia}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-14 lato-regular py-4 prority-4 text-white "
                                                            : "fs-14 lato-regular py-4 prority-4 "
                                                    }
                                                >
                                                    {dato.fechaDeAlta}
                                                </td>
                                                <td
                                                    style={tableCellStyle(filaExtendida === index)}
                                                    className={
                                                        darkMode
                                                            ? "fs-13 lato-regular py-4 prority-4 text-white "
                                                            : "fs-13 lato-regular py-4 prority-4 text-white "
                                                    }
                                                >
                                                    {""}
                                                    <button disabled
          style={{
            borderRadius: "10px",
            top: "auto",
            left: "auto",
            width: "auto",
            height: "auto",
            background: getColorFacturacion(dato.tiempoInactiva),
            color: 'white',
             width: filaExtendida === index ? "auto" : "60px",
            verticalAlign:"middle",
            overflow: "hidden", // Esconder el texto que se sale del botón
      textOverflow: "ellipsis", // Aplicar puntos suspensivos cuando se corta el texto
      whiteSpace: filaExtendida === index ? "normal" : "nowrap",
          }}>
            {""}
                                                    {dato.tiempoInactiva}

                                                    </button>
                                                    
                                                </td>
                          {/* Recorriendo la facturación diaria */}
                          {Array.isArray(dato.facturacionDiaria) && dato.facturacionDiaria.length > 0 ? (
                              dato.facturacionDiaria.slice().reverse().map((facturacion, i) => (
                                  <td
                                      key={i}
                                      style={{
                                          whiteSpace: 'nowrap',  // Evitar que el texto se corte
                                          overflow: 'visible',   // Asegurar que el contenido siempre sea visible
                                          textOverflow: 'clip',  // No agregar puntos suspensivos
                                          maxWidth: '100px',     // Puedes ajustar el ancho máximo si es necesario
                                          verticalAlign: 'middle', // Alinear verticalmente el texto
                                      }}
                                      className={
                                          darkMode
                                              ? "fs-11 lato-bold py-4 prority-4 text-white "
                                              : "fs-11 lato-bold py-4 prority-4 "
                                      }
                                  >
                                      {facturacion.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })}
                                  </td>
                              ))
                          ) : (
                              <td colSpan={datos[0].facturacionDiaria.length}>
                                  No hay facturación disponible.
                              </td>
                          )}

                          
                      </tr>
                  ))
                                ) : (
                                    <tr>
                                       
                                    </tr>
                                )
                                }

                                </tbody>
                            </Table>
                        </div>
                    
                </article>
                </section>
                
            
        </div>
    );
};

export default ContenidoInicio;
