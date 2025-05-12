// import css
import "./TablaUsuariosLiquidaciones.css";

// import hooks, context y librerias
import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { Form } from "react-bootstrap";

// import component
import ItemTablaBuscarCupones from "./ItemTablaBuscarCupones";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { DNA } from "react-loader-spinner";

const TablaBuscarCupones = () => {
  // darkmode context para agregar la funcionalidad de claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // datos iniciales para realizar el pintado de la vista
    const [datosCrudo, setDatosCrudo] = useState([]);
  
  // estados iniciales de los filtros con valores predeterminados
  const [filtroFecha, setFiltroFecha] = useState("");
  const [filtroBruto, setFiltroBruto] = useState("");
  const [filtroTarjeta, setFiltroTarjeta] = useState("");
  const [filtroNumeroTarjeta, setFiltroNumeroTarjeta] = useState("");
    const [filtroCuotas, setFiltroCuotas] = useState("");
  // funcion para la filtrar datos
  const filtrarDatos = () => {
    return datosCrudo.filter((dato) => {
      return (
        (dato.fechaOperacion || "").includes(filtroFecha) &&
          (dato.totalBruto || "").includes(filtroBruto) &&

        (dato.nroDeTarjeta || "")
          .toLowerCase()
          .includes(filtroNumeroTarjeta.toLowerCase()) &&
        (dato.tarjeta || "").toLowerCase().includes(filtroTarjeta) &&
        (dato.cuotas || "").includes(filtroCuotas)
      );
    });
  };
 

  // estado para la carga del spinner
  const [cargando, setCargando] = useState(false);

  // variable con los resultados filtrados para pintar los items de la tabla
  const resultadosFiltrados = filtrarDatos().slice(0, 10);

  // consulta para la api
  const apiUrlNotificaciones = process.env.REACT_APP_API_NOTIFICACIONES;

  const [notificaciones, setNotificaciones] = useState([]);

  // Estado para almacenar el valor del input
  const [fechaCupones, setFechaCupones] = useState("");

  // Maneja el cambio en el input actualizando el estado
  const handleChange = (event) => {
    setFechaCupones(event.target.value);
  };

  // Maneja el envío del formulario
  const handleSubmit = (event) => {
    event.preventDefault(); 
    // Aquí puedes añadir la lógica para enviar el texto a donde necesites
  };



  const apiUrlCrudo = process.env.REACT_APP_API_LISTA_CRUDO;
  useEffect(() => {
    const fetchDatosCrudo = async () => {
      setCargando(true); 
      const Token = sessionStorage.getItem("token"); 
      try {
        const response = await fetch(apiUrlCrudo, {
          method: "POST", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Token: Token,
            Fecha: fechaCupones,
          }),
        });

        const data = await response.json();
        
        setDatosCrudo(data);
      } catch (error) {
        console.error("Error al cargar los datos del crudo:", error);
      } finally {
        setCargando(false); 
      }
    };

    fetchDatosCrudo();
  }, [apiUrlCrudo, fechaCupones]); 
  
  return (
    <div
      className={
        darkMode
          ? "container bg-tabla-usuarios-liquidaciones-dark"
          : "container bg-tabla-usuarios-liquidaciones"
      }
    >
      <section className="pt-4">
        <h6 className="mx-4 container"> Buscar por mes</h6>
        <form onSubmit={handleSubmit}>
          <input
            className="label-buscador-cupones border-0 ms-4 me-4"
            type="text"
            value={fechaCupones}
            onChange={handleChange}
            placeholder="01/24"
          />
        </form>
      </section>
      <section className="container mt-3 mb-3 ">
        <div className="d-flex flex-wrap  justify-content-between pt-4 container">
          <Form.Group className="mb-3" controlId="filtroFecha">
            <Form.Label className="fs-14 lato-bold">
              Fecha de Operaciónes
            </Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="Num Dia"
              value={filtroFecha}
              onChange={(e) => setFiltroFecha(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroBruto">
            <Form.Label className="fs-14 lato-bold">Bruto</Form.Label>
            <Form.Control
              type="text" 
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              placeholder="Bruto"
              value={filtroBruto}
              onChange={(e) => setFiltroBruto(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroTarjeta">
            <Form.Label className="fs-14 lato-bold">
              Tarjeta (4 digitos)
            </Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="1234"
              value={filtroNumeroTarjeta}
              onChange={(e) => setFiltroNumeroTarjeta(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroNumeroTarjeta">
            <Form.Label className="fs-14 lato-bold">Tarjeta</Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              value={filtroTarjeta}
              onChange={(e) => setFiltroTarjeta(e.target.value)}
              placeholder="Tarjeta"
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="filtroCuotas">
            <Form.Label className="fs-14 lato-bold">Cuotas</Form.Label>
            <Form.Control
              className={
                darkMode
                  ? " form-control text-white label-buscador-cupones-dark lato-regular fs-18 border-0"
                  : "form-control label-buscador-cupones lato-regular fs-18 border-0"
              }
              type="text"
              placeholder="Cuotas"
              value={filtroCuotas}
              onChange={(e) => setFiltroCuotas(e.target.value)}
            />
          </Form.Group>
        </div>
      </section>
      <article>
        <div
          className={
            darkMode
              ? " table-responsive py-3 px-5"
              : "table-responsive py-3 px-5"
          }
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0 ">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-tabla-izquierda   border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white border-tabla-izquierda   border-0 lato-regular fs-12 py-3 "
                  }
                  scope="col "
                >
                  Fecha operaciones
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white  border-0 lato-regular fs-12 py-3 "
                  }
                  scope="col "
                >
                  Fecha de pago
                </th>

                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  terminal
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  Num. tarjeta
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0   lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  Bruto
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0   lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  Cuota
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0   lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3   "
                  }
                  scope="col"
                >
                  Tarjeta
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  Provincia
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 border-tabla-derecha  lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha  "
                  }
                  scope="col"
                >
                  Comercio
                </th>
              </tr>
            </thead>
            {cargando ? (
              <tbody className="text-center">
                <tr>
                  <td colSpan="9" className="lato-bold fs-12-a-10">
                    <DNA
                      visible={true}
                      height="80"
                      width="80"
                      ariaLabel="dna-loading"
                      wrapperStyle={{}}
                      wrapperClass="dna-wrapper"
                    />
                  </td>
                </tr>
              </tbody>
            ) : (
              <tbody className="text-center">
                {resultadosFiltrados.length > 0 ? (
                  resultadosFiltrados.map((dato, id) => (
                    <ItemTablaBuscarCupones key={id} dato={dato} />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="lato-bold fs-12-a-10">
                      No se encontraron resultados para esta búsqueda.
                    </td>
                  </tr>
                )}
              </tbody>
            )}
          </table>
        </div>
      </article>
    </div>
  );
};

export default TablaBuscarCupones;
