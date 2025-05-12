import React, { useContext, useState } from "react";
import {
  Table,
  FormControl,
  InputGroup,
  Row,
  Col,
  Form,
} from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";

const ContenidoBajaCRM= ({ datos = [] }) => {
  const [rowsToShow, setRowsToShow] = useState(5);
  const [searchTerms, setSearchTerms] = useState({
    nDeTerminal: "",
    nDeComercio: "",
    nombreDeFantasia: "",
    cuitCuil: "",
    cuitRazonSocial: "",
  });
  const { darkMode } = useContext(DarkModeContext);
  const handleShowMore = () => {
    setRowsToShow(rowsToShow + 5);
  };

  const handleSearch = (field, event) => {
    setSearchTerms({ ...searchTerms, [field]: event.target.value });
  };

  if (datos.length === 0) {
    return (
      <div className="container">
        <h6 className="text-center">No hay datos disponibles</h6>
      </div>
    );
  }

  // Filtra los datos según los términos de búsqueda
  const filteredDatos = datos.filter((dato) => {
    return (
      (searchTerms.nDeTerminal === "" ||
        (dato.nDeTerminal &&
          dato.nDeTerminal
            .toString()
            .toLowerCase()
            .includes(searchTerms.nDeTerminal.toLowerCase()))) &&
      (searchTerms.nDeComercio === "" ||
        (dato.nDeComercio &&
          dato.nDeComercio
            .toString()
            .toLowerCase()
            .includes(searchTerms.nDeComercio.toLowerCase()))) &&
      (searchTerms.nombreDeFantasia === "" ||
        (dato.nombreDeFantasia &&
          dato.nombreDeFantasia
            .toString()
            .toLowerCase()
            .includes(searchTerms.nombreDeFantasia.toLowerCase()))) &&
      (searchTerms.cuitCuil === "" ||
        (dato.cuitCuil &&
          dato.cuitCuil
            .toString()
            .toLowerCase()
            .includes(searchTerms.cuitCuil.toLowerCase()))) &&
      (searchTerms.cuitRazonSocial === "" ||
        (dato.cuitRazonSocial &&
          dato.cuitRazonSocial
            .toString()
            .toLowerCase()
            .includes(searchTerms.cuitRazonSocial.toLowerCase())))
    );
  });

  // Extrae las claves para los encabezados
  const keys = Object.keys(datos[0]);

  return (
    <>
      <div className="container">
        <Row>
          <Col>
            <Form.Label className="fs-12 lato-bold">
              Buscar por N° Terminal
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                className="label-buscador-crm"
                placeholder="Buscar por N° Terminal"
                aria-label="Buscar por NDeTerminal"
                value={searchTerms.nDeTerminal}
                onChange={(e) => handleSearch("nDeTerminal", e)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label className="fs-12 lato-bold">
              Buscar por N° Comercio
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                className="label-buscador-crm"
                placeholder="Buscar por N° Comercio"
                aria-label="Buscar por N° Comercio"
                value={searchTerms.nDeComercio}
                onChange={(e) => handleSearch("nDeComercio", e)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label className="fs-12 lato-bold">
              Buscar por Nombre Fantasia
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                className="label-buscador-crm"
                placeholder="Buscar por Nombre Fantasia"
                aria-label="Buscar por Nombre Fantasia"
                value={searchTerms.nombreDeFantasia}
                onChange={(e) => handleSearch("nombreDeFantasia", e)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label className="fs-12 lato-bold">
              Buscar por CUIT CUIL
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                className="label-buscador-crm"
                placeholder="Buscar por Cuit Cuil"
                aria-label="Buscar por Cuit Cuil"
                value={searchTerms.cuitCuil}
                onChange={(e) => handleSearch("cuitCuil", e)}
              />
            </InputGroup>
          </Col>
          <Col>
            <Form.Label className="fs-12 lato-bold">
              Buscar por Cuit razon social
            </Form.Label>
            <InputGroup className="mb-3">
              <FormControl
                className="label-buscador-crm"
                placeholder="Buscar por Cuit Razon Social"
                aria-label="Buscar por CuitRazonSocial"
                value={searchTerms.cuitRazonSocial}
                onChange={(e) => handleSearch("cuitRazonSocial", e)}
              />
            </InputGroup>
          </Col>
        </Row>
      </div>
      <section style={{ maxHeight: "500px", overflowY: "auto" }}>
        <div
          className="container custom-scrollbar"
          style={{ overflowX: "auto" }}
        >
          <Table
            className={darkMode ? "p-5 bg-light text-dark" : "p-5 bg-white"}
            bordered
            hover
            style={{ width: "auto", minWidth: "100%" }}
          >
            <thead
              className={
                darkMode ? "p-5 bg-light text-dark " : "p-5 bg-dark text-white "
              }
            >
              <tr className="fs-12">
                {keys.map((key, index) => (
                  <th
                    key={index}
                    style={{ minWidth: "200px", padding: "10px" }}
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredDatos.map((dato, indexFila) => (
                <tr key={indexFila} style={{ height: "auto" }}>
                  {keys.map((key, indexValor) => (
                    <td
                      className="fs-12"
                      key={indexValor}
                      style={{ minWidth: "200px", padding: "10px" }}
                    >
                      {dato[key] || <span>No hay datos registrados</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </section>
      {/* {rowsToShow < filteredDatos.length && (
        <div className="d-flex justify-content-center my-3">
          <Button
            className="btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
            onClick={handleShowMore}
          >
            Ver más
          </Button>
        </div>
      )} */}
    </>
  );
};

export default ContenidoBajaCRM;
