// import css
import "./TablaUsuariosEmpleados.css";

// import hooks, context y librerias
import React, { useContext, useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import { DarkModeContext } from "../../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCirclePlus,
  faMagnifyingGlass,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Button, Form, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

// import component
import ItemTablaUEmpleados from "./ItemTablaEmpleados";

function ModalNuevoAliado(props) {
  const { darkMode } = useContext(DarkModeContext);
  const { control, handleSubmit, formState, reset } = useForm();
  const { errors } = formState;
  const [loading, setLoading] = useState(false);

  const formRef = useRef(null);

  const [user, setUser] = useState({ name: "", id: null, CUIT: null });

  const onSubmit = async (formData) => {
    const { cuit, email, nombre } = formData;
    const userId = user.id;
    const token = sessionStorage.getItem("token");

    const dataEnviar = {
      IdUsuario: userId,
      Usuario: cuit,
      Nombre: nombre,
      Correo: email,
      Token: token,
    };
    try {
      setLoading(true);

      const response = await fetch("/api/empleado/crearusuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataEnviar),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }

      Swal.fire({
        title: "¡Enviado!",
        text: "Usuario creado con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
      setLoading(false);
    } catch (error) {
      console.error("Error al crear el usuario", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el usuario.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }

    props.onActualizarDatos();
    props.onHide();
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      formRef.current.submit();
    }
  };

  const fetchUserDetails = async () => {
    const token = sessionStorage.getItem("token");
    const requestData = {
      Usuario: filtroCuit,
      Token: token,
    };
    try {
      const response = await fetch("/api/usuarios/buscarusuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();
      if (response.ok) {
        setUser({
          ...user,
          name: data.nombre,
          id: data.id,
          CUIT: data.id,
        });
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudo obtener la información del usuario",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      Swal.fire(
        "Error",
        "Problema de conexión al obtener información",
        "error"
      );
    }
  };

  const [filtroCuit, setFiltroCuit] = useState("");

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Body>
        <section className="d-flex justify-content-between my-4">
          <div className="ocultar-div"></div>
          <div className="d-flex justify-content-center">
            <h6 className="fs-18 lato-bold">Crear usuario nuevo </h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={props.onHide}>
              <FontAwesomeIcon className="fs-18 mb-3" icon={faXmark} />
            </button>
          </div>
        </section>
        <section>
          <div className="d-flex justify-content-center">
            <form className="" ref={formRef} onSubmit={handleSubmit(onSubmit)}>
              <article className="row py-2">
                <div className="form-group col-12">
                  <label className="fs-14 ms-1">CUIT</label>
                  <div className="my-3 d-flex align-items-center">
                    <div className="campo-busqueda d-flex">
                      <input
                        type="text"
                        maxLength="11"
                        className={
                          darkMode
                            ? "form-control text-white label-buscador-cuit lato-regular fs-18 border-0"
                            : "form-control label-buscador-cuit lato-regular fs-18 border-0"
                        }
                        placeholder="0123456789"
                        value={filtroCuit}
                        onChange={(e) => setFiltroCuit(e.target.value)}
                      />
                      <button
                        type="button"
                        className="buscar-lupa-cuit ms-2 border-0"
                        onClick={fetchUserDetails} 
                      >
                        <FontAwesomeIcon
                          className="text-white"
                          icon={faMagnifyingGlass}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group col-12">
                  <label className="fs-14 mb-3 ms-1">Razón social</label>

                  <input
                    type="text"
                    disabled
                    value={user.name}
                    className="form-control label-input-disabled "
                  />
                </div>
              </article>
              <article>
                <div>
                  <label className="lato-bold fs-16-a-14 mb-2" htmlFor="cuit">
                    CUIT
                  </label>
                </div>
                <div>
                  <Controller
                    name="cuit"
                    control={control}
                    rules={{ required: "Campo requerido", maxLength: 11 }}
                    type="text"
                    render={({ field }) => (
                      <input
                        className="input-configuraciones border-0"
                        style={{ padding: "10px" }}
                        maxLength={11}
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.cuit && (
                      <p className="fs-16 lato-bold">{errors.cuit.message}</p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-2">
                <div>
                  <label className="lato-bold fs-16-a-14 mb-2" htmlFor="nombre">
                    Nombre y apellido
                  </label>
                </div>
                <div>
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-configuraciones border-0"
                        type="text"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger ">
                    {errors.nombre && (
                      <p className="fs-16 lato-bold">{errors.nombre.message}</p>
                    )}
                  </div>
                </div>
              </article>

              <article className="my-1">
                <div>
                  <label className="lato-bold fs-16-a-14 mb-2" htmlFor="email">
                    E-mail
                  </label>
                </div>
                <div>
                  <Controller
                    name="email"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-configuraciones border-0"
                        type="text"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.email && (
                      <p className="fs-16 lato-bold">{errors.email.message}</p>
                    )}
                  </div>
                </div>
              </article>

              <div className="d-flex justify-content-between my-5">
                <button
                  className={
                    darkMode
                      ? "btn-cancelar-usuario-editar lato-bold text-dark "
                      : "btn-cancelar-usuario-editar lato-bold text-dark"
                  }
                  onClick={props.onHide}
                >
                  Cancel
                </button>
                <button
                  className={
                    darkMode
                      ? "btn-guardar-usuario-editar  border-0 lato-bold text-dark "
                      : "btn-guardar-usuario-editar border-0 lato-bold text-white"
                  }
                  type="submit"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </section>
      </Modal.Body>
    </Modal>
  );
}

const TablaUsuariosEmpleados = () => {
  const { darkMode } = useContext(DarkModeContext);
  const data = [];
  const [busqueda, setBusqueda] = useState("");
  const [resultadosFiltrados, setResultadosFiltrados] = useState(data);
  const [resultadosMostrados, setResultadosMostrados] = useState([]);

  const maxResultados = 6;

  const handleSearchChange = (e) => {
    const nuevaBusqueda = e.target.value;

    if (/^[0-9]*$/.test(nuevaBusqueda)) {
      setBusqueda(nuevaBusqueda);
      filtrarResultados(nuevaBusqueda, resultadosFiltrados);
    }
  };

  const filtrarResultados = (busqueda, datos) => {
    const busquedaLower = busqueda.toLowerCase();
    const resultados = datos.filter(
      (item) =>
        (item.usuario && item.usuario.toLowerCase().includes(busquedaLower)) ||
        (item.comercioPadre &&
          item.comercioPadre.toString().includes(busquedaLower))
    );
    setResultadosMostrados(resultados.slice(0, maxResultados));
  };
  const apiUrllistausuarios = "/api/empleado/listausuarios";
  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(apiUrllistausuarios, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }

      const data = await response.json();
      setResultadosFiltrados(data);
      filtrarResultados(busqueda, data);
    } catch (error) {
      console.error("Error al obtener los datos de los usuarios", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [modalShow, setModalShow] = useState(false);
  const actualizarDatos = async () => {
    // Aquí va la lógica para obtener los datos actualizados de los usuarios
    // Por ejemplo, una solicitud fetch a tu API
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(apiUrllistausuarios, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }

      const data = await response.json();
      setResultadosFiltrados(data);
      filtrarResultados(busqueda, data);
    } catch (error) {
      console.error("Error al obtener los datos de los usuarios", error);
    }
  };

  return (
    <div
      className={
        darkMode
          ? "container bg-tabla-usuarios-liquidaciones-dark"
          : "container bg-tabla-usuarios-liquidaciones"
      }
    >
      <section className="container mt-3 mb-3 ">
        <div className="d-flex flex-wrap justify-content-between pt-4">
          <div className="margin-centrado-responsive">
            <div className="my-3 d-flex ">
              <h6 className="my-3 me-3 fs-18-a-16">Filtrar: </h6>
              <div className="campo-busqueda">
                <Form.Group
                  className="d-flex justify-content-center "
                  controlId="formBasicEmail"
                >
                  <Form.Control
                    className={
                      darkMode
                        ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                        : "form-control label-buscador lato-regular fs-18 border-0"
                    }
                    maxLength={11}
                    type="text"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                    placeholder="CUIT aliado - empleado"
                    value={busqueda}
                    onChange={handleSearchChange}
                  />
                </Form.Group>
              </div>
            </div>
          </div>
          <div className="d-flex centrado-responsive">
            <div className="pt-3">
              <Button
                className="btn-modal-nuevo-usuario-editar centrado border-0 mx-2"
                onClick={() => setModalShow(true)}
              >
                <FontAwesomeIcon icon={faCirclePlus} />{" "}
                <span className="lato-bold fs-18 ms-2"> Nueva</span>
              </Button>
            </div>
            <ModalNuevoAliado
              show={modalShow}
              onHide={() => setModalShow(false)}
              onActualizarDatos={actualizarDatos}
            />
          </div>
        </div>
      </section>
      <article>
        <div
          className={
            darkMode
              ? " container table-responsive py-3  px-5 "
              : "container table-responsive py-3  px-5 "
          }
        >
          <table className="table table-borderless responsive striped hover">
            <thead className="border-0 ">
              <tr className="text-center tabla-thead">
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white border-tabla-izquierda border-0 lato-regular fs-12 py-3 "
                  }
                  scope="col "
                >
                  #
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark  border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white  border-0 lato-regular fs-12 py-3 "
                  }
                  scope="col "
                >
                  CUIT - COMERCIO PADRE
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark  border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white  border-0 lato-regular fs-12 py-3 "
                  }
                  scope="col "
                >
                  CUIT
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  Nombre
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3  "
                  }
                  scope="col"
                >
                  E-mail
                </th>
                <th
                  className={
                    darkMode
                      ? " bg-white text-dark border-0 border-tabla-derecha  lato-regular fs-12 py-3 "
                      : "bg-dark text-white fs-12 lato-regular py-3 border-tabla-derecha  "
                  }
                  scope="col"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {resultadosMostrados.length > 0 ? (
                resultadosMostrados.map((dato, id) => (
                  <ItemTablaUEmpleados
                    onActualizarDatos={actualizarDatos}
                    dato={dato}
                    key={id}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="lato-bold fs-12-a-10">
                    No se encontraron resultados para esta búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </article>
    </div>
  );
};

export default TablaUsuariosEmpleados;
