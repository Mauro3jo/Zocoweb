// import hooks
import React, { useContext, useEffect, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import componente
import ItemsTablaAsesoresCoordenadas from "./ItemsTablaAsesoresCoordenadas";

// import libreria
import { MagnifyingGlass } from "react-loader-spinner";

const TablaAsesoresCoordenadas = ({ fechaFiltrada }) => {
  // darkMode context funcionalidad para el modo claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar el spinner de carga
  const [cargando, setCargando] = useState(false);

  // estado para guardar la checkList
  const [checkList, setCheckList] = useState([]);

  // estado para guardar el filtro
  const [filtro, setFiltro] = useState("");

  // funcion de filtrado: efectua el filtrador por nombre y usuario
  // y lo guarda en una variable "datosFiltrados".
  const datosFiltrados = checkList.filter(
    (dato) =>
      dato.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      dato.usuario.includes(filtro)
  );

  // consulta para guardar el checkList
  useEffect(() => {
    const fetchCheck = async () => {
      const token = sessionStorage.getItem("token");
      setCargando(true); // Inicia el spinner de carga
      const fechaHoy = new Date();

      const dia = ("0" + fechaHoy.getDate()).slice(-2);
      const mes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2);
      const anio = fechaHoy.getFullYear();

      const fechaFormateada = dia + "/" + mes + "/" + anio;
      try {
        const response = await fetch("/api/geo/checklista", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Token: token,
            Fecha: fechaFiltrada,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCheckList(data);
      } catch (error) {
        console.error("Hubo un error al realizar la solicitud: ", error);
      } finally {
        setCargando(false); // Detiene el spinner de carga
      }
    };

    fetchCheck();
  }, [fechaFiltrada]);

  return (
    <div className="container">
      <div
        className={`table-responsive ${darkMode ? "bg-tabla-calculadora-dark" : "bg-tabla-calculadora"} tabla-scrollable`}
      >
        <div className="text-center">
          <h6 className="fs-16">Tabla Check in - Check out</h6>
        </div>
        <div className="">
          <article>
            <div className="filtro-terminal mb-3">
              <div className="my-3 d-flex ">
                <h6 className="my-3 me-3 fs-18-a-16 ">Buscar: </h6>
                <div className="campo-busqueda ">
                  <input
                    type="text"
                    className={
                      darkMode
                        ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                        : "form-control label-buscador lato-regular fs-18 border-0"
                    }
                    placeholder="CUIT o nombre"
                    value={filtro}
                    onChange={(e) => setFiltro(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </article>
          <div>
            <table className="table table-borderless responsive striped hover">
              <thead className="border-0 ">
                <tr className="text-center tabla-thead">
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white border-tabla-izquierda"
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark  border-tabla-izquierda"
                    }
                    scope="col"
                  >
                    CUIT
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white"
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark"
                    }
                    scope="col"
                  >
                    Nombre
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Fecha - Hora
                  </th>

                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white "
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark "
                    }
                    scope="col "
                  >
                    Tipo
                  </th>
                  <th
                    className={
                      darkMode
                        ? " text-dark  border-0 lato-regular fs-12 py-3 bg-white border-tabla-derecha"
                        : " text-white  border-0 lato-regular fs-12 py-3 bg-dark border-tabla-derecha"
                    }
                    scope="col "
                  >
                    Mapa
                  </th>
                </tr>
              </thead>

              <tbody className="text-center">
                {cargando ? (
                  <tr>
                    <td colSpan="5" className="lato-bold fs-12-a-10">
                      <MagnifyingGlass
                        visible={true}
                        height="80"
                        width="80"
                        ariaLabel="magnifying-glass-loading"
                        wrapperStyle={{}}
                        wrapperClass="magnifying-glass-wrapper"
                        glassColor="#c0efff"
                        color="#b4c400 "
                      />
                    </td>
                  </tr>
                ) : (
                  datosFiltrados.map((dato, id) => (
                      <ItemsTablaAsesoresCoordenadas {...dato} key={id} />
                    ))
                )}
              </tbody>
            </table>
            {datosFiltrados.length === 0 && (
              <div className="text-center">
                <p className={darkMode ? "text-white" : "text-dark"}>
                  No se encontraron datos con el filtro aplicado.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TablaAsesoresCoordenadas;
