import React, { useContext, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { DarkModeContext } from "../../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

const ModalSolicitudNuevaPeticion = (props) => {
  const { show, onHide, dato } = props;
  const { darkMode } = useContext(DarkModeContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm();
  const [gestor, setGestor] = useState({ name: "", id: null });
  const [user, setUser] = useState({ name: "", id: null, CUIT: null });

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
          CUIT: data.usuario,
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

  const [datosCargarContratados, setCargarContratados] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fetchGestorDetails = async () => {
    const token = sessionStorage.getItem("token");
    const requestData = {
      Usuario: filtroCuitGestor,
      Token: token,
    };

    try {
      const response = await fetch("/api/usuarios/buscargestor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();

      if (response.ok) {
        setGestor({ ...gestor, name: data.nombre, id: data.id });
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudo obtener la información del gestor",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching gestor details:", error);
      Swal.fire(
        "Error",
        "Problema de conexión al obtener información",
        "error"
      );
    }
  };

  // Manejador del envío del formulario
  const customOnSubmit = async (data) => {
    setIsSubmitting(true);
    let formData = { ...data, estado: "pendiente" };

    // Incluir token si es necesario
    const token = sessionStorage.getItem("token");
    if (token) {
      formData = {
        ...formData,
        token,
        Iduser: user.id,
        Idgestor: gestor.id,
        Cuit: user.CUIT,
      };
    }

    try {
      const response = await fetch("/api/comanda/CrearComanada2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        showAlert(
          "Éxito",
          "Los datos han sido enviados correctamente",
          "success"
        );
      } else {
        showAlert("Error", "Hubo un problema al enviar los datos", "error");
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      showAlert("Error", "Hubo un problema al enviar los datos", "error");
    }

    setIsSubmitting(false);
    reset();
    onHide();
  };

  function showAlert(title, text, icon) {
    Swal.fire({
      title: title,
      text: text,
      imageUrl: logo,
      imageWidth: 100,
      imageHeight: 30,
      imageAlt: "Logo",
      confirmButtonText: "Ok",
      timer: 5000,
      allowOutsideClick: true,
      customClass: {
        container: darkMode
          ? "swal2-container--dark"
          : "swal2-container--light",
        confirmButton: "my-swal-button",
      },
      willClose: () => {
        window.location.reload();
      },
    });
  }

  const motivos = [
    { id: 1, nombre: "Alta - Prioridad: MÁXIMA" },
    { id: 2, nombre: "Agrega Terminal - Prioridad: MÁXIMA" },
    { id: 3, nombre: "Auditoría Cupones  - Prioridad: MÁXIMA" },
    { id: 4, nombre: "Baja Facturación - Prioridad: MÁXIMA" },
    { id: 5, nombre: "Entrega Terminal - Prioridad: MÁXIMA" },
    { id: 6, nombre: "Modificación de Datos  - Prioridad: MÁXIMA" },
    { id: 7, nombre: "Modificación de Terminal - Prioridad: MÁXIMA" },
    { id: 8, nombre: "Retiro Terminal - Prioridad: MÁXIMA" },
    { id: 9, nombre: "Servicio Técnico - Prioridad: MÁXIMA" },
    { id: 10, nombre: "Visita Mensual - Prioridad: MÁXIMA" },
    { id: 11, nombre: "Reposición rollo - Prioridad: MÁXIMA" },
    { id: 12, nombre: "Reposición rollo - Prioridad: MEDIA" },
    { id: 13, nombre: "Otra Consulta - Prioridad: MÁXIMA" },
    { id: 14, nombre: "Otra Consulta - Prioridad: MÍNIMA" },
    { id: 15, nombre: "Consulta Sobre mi Liquidación - Prioridad: MEDIA" },
    { id: 16, nombre: "Contacto Telefónico - Prioridad: MEDIA" },
    { id: 17, nombre: "Extracción Reporte Mensual - Prioridad: MEDIA" },
    { id: 18, nombre: "Fidelización - Prioridad: MEDIA" },
    { id: 19, nombre: "Capacitación - Medios de Pagos - Prioridad: MÍNIMA" },
    { id: 20, nombre: "Capacitación – Panel - Prioridad: MÍNIMA" },
    { id: 21, nombre: "Comercio en Mantenimiento" },
  ];

  const opcionesMotivos = motivos.map((motivo) => ({
    value: motivo.nombre,
    label: motivo.nombre,
  }));

  // estado para guardar el filtro
  const [filtroCuit, setFiltroCuit] = useState("");
  const [filtroCuitGestor, setFiltroCuitGestor] = useState("");

  const provincias = [
    { id: 1, nombre: "Buenos Aires" },
    { id: 2, nombre: "Catamarca" },
    { id: 3, nombre: "Chaco" },
    { id: 4, nombre: "Chubut" },
    { id: 5, nombre: "Córdoba" },
    { id: 6, nombre: "Corrientes" },
    { id: 7, nombre: "Entre Ríos" },
    { id: 8, nombre: "Formosa" },
    { id: 9, nombre: "Jujuy" },
    { id: 10, nombre: "La Pampa" },
    { id: 11, nombre: "La Rioja" },
    { id: 12, nombre: "Mendoza" },
    { id: 13, nombre: "Misiones" },
    { id: 14, nombre: "Neuquén" },
    { id: 15, nombre: "Río Negro" },
    { id: 16, nombre: "Salta" },
    { id: 17, nombre: "San Juan" },
    { id: 18, nombre: "San Luis" },
    { id: 19, nombre: "Santa Cruz" },
    { id: 20, nombre: "Santa Fe" },
    { id: 21, nombre: "Santiago del Estero" },
    { id: 22, nombre: "Tierra del Fuego" },
    { id: 23, nombre: "Tucumán" },
  ];

  const opcionesProvincias = provincias.map((provincia) => ({
    value: provincia.nombre,
    label: provincia.nombre,
  }));

  return (
    <div>
      <Modal
        {...props}
        show={show}
        onHide={onHide}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Body
          className={
            darkMode ? " modal-content text-black" : "modal-content text-black "
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Nueva petición</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div className="">
            <form onSubmit={handleSubmit(customOnSubmit)}>
              <article className="row py-2">
                <div className="form-group col-12">
                  <label className="fs-14 mb-2 ms-1">Motivo</label>
                  <Controller
                    name="Motivo"
                    control={control}
                    rules={{ required: true }} // Asegúrate de que el campo es requerido
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={opcionesMotivos}
                        className="lato-bold border-0 text-dark"
                        classNamePrefix="select"
                        placeholder="motivo"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                        value={opcionesMotivos.find(
                          (option) => option.value === field.value
                        )}
                      />
                    )}
                  />
                  {errors.Motivo && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group col-6">
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
                        onClick={fetchUserDetails} // Use the new fetch function here
                      >
                        <FontAwesomeIcon
                          className="text-white"
                          icon={faMagnifyingGlass}
                        />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="form-group col-6">
                  <label className="fs-14 mb-3 ms-1">Razón social</label>
                  <Controller
                    name="Razon"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled
                        value={user.name} // Display the fetched user's name here
                        className="form-control label-input-disabled "
                      />
                    )}
                  />
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">Nombre de comercio</label>
                  <Controller
                    name="Comercio"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="nombre comercio"
                      />
                    )}
                  />
                  {errors.Comercio && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">N° de Terminal</label>
                  <Controller
                    name="Terminal"
                    control={control}
                    rules={{
                      required: false,
                      maxLength: 10,
                      pattern: /^[0-9]*$/,
                    }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        maxLength="10"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="2222222222"
                      />
                    )}
                  />
                  {errors.Terminal && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">Dirección</label>
                  <Controller
                    name="Direccion"
                    // defaultValue="default direccion"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="Dirección"
                      />
                    )}
                  />
                  {errors.Direccion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-lg-6  col-12">
                  <label className="fs-14 mb-2 ms-1">Provincia</label>
                  <Controller
                    name="Provincia"
                    control={control}
                    rules={{ required: true }} // Asegúrate de que el campo es requerido
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={opcionesProvincias}
                        className="select-control-custom lato-bold border-0"
                        classNamePrefix="select"
                        placeholder="Provincias"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                        value={opcionesProvincias.find(
                          (option) => option.value === field.value
                        )}
                      />
                    )}
                  />
                  {errors.Provincia && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">Teléfono </label>
                  <Controller
                    name="Telefono"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="Teléfono"
                      />
                    )}
                  />
                  {errors.Telefono && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">
                    Nombre representante
                  </label>
                  <Controller
                    name="Email"
                    // defaultValue="default direccion"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="Ingresar nombre representante"
                      />
                    )}
                  />
                  {errors.Email && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group col-6">
                  <label className="fs-14 ms-1">CUIT Gestor</label>
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
                        value={filtroCuitGestor}
                        onChange={(e) => setFiltroCuitGestor(e.target.value)}
                      />
                      <button
                        type="button"
                        className="buscar-lupa-cuit ms-2 border-0"
                        onClick={fetchGestorDetails}
                      >
                        <FontAwesomeIcon
                          className="text-white"
                          icon={faMagnifyingGlass}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group col-12">
                  <label className="fs-14 mb-3 ms-1">Gestor asignado</label>
                  <Controller
                    name="Razon" // 'Razon' might not be the correct field name if it is supposed to hold the gestor's name; consider renaming if needed
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled
                        value={gestor.name} // Use the state variable that holds the gestor's name
                        className="form-control label-input-disabled"
                      />
                    )}
                  />
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group ">
                  <label className="fs-14 mb-2 ms-1">Observación</label>
                  <Controller
                    name="Observacion"
                    // defaultValue="default observaciones"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
                        placeholder="Observaciones"
                        className="form-control input-cargar-nueva-busqueda-observaciones "
                        style={{ height: "100px" }}
                      />
                    )}
                  />
                  {errors.Observacion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <div className="d-flex justify-content-between mt-5">
                <button
                  className={
                    darkMode
                      ? "btn-cancel-modificaciones-nuevo-puesto  border-0 lato-bold text-white "
                      : "btn-cancel-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                  }
                  onClick={onHide}
                >
                  Cancel
                </button>
                <button
                  className={
                    darkMode
                      ? "btn-guardar-modificaciones-nuevo-puesto  border-0 lato-bold text-white "
                      : "btn-guardar-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                  }
                  disabled={isSubmitting} // Deshabilita el botón durante el envío
                  type="submit"
                >
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" />
                  ) : (
                    "Guardar"
                  )}
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalSolicitudNuevaPeticion;
