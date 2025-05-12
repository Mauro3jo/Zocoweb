import React, { useContext, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { DarkModeContext } from "../../context/DarkModeContext";
import formatearFecha from "../../helpers/formatearFecha";
// import librerias
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

const ModalReclutamientoEditar = (props) => {
  const { show, onHide, dato } = props;
  const { darkMode } = useContext(DarkModeContext);
  const { control, handleSubmit, formState, reset, setValue } = useForm();
  const { errors } = formState;
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar la carga y el botón

  const {
    id,
    fechaPuesto,
    puesto,
    provincia,
    cantidad,
    fechaCierre,
    estado,
    nombre,
    cantidadDeSolicitantes,
    rechazados,
    seleccionados,
    finalistas,
    contratados,
    observaciones,
  } = dato || {};

  const idParaEditar = id;
  // formateo la fecha para la hora
  const fechaPuestoFormateada = formatearFecha(fechaPuesto);
  const fechaCierreFormateada = formatearFecha(fechaCierre);

  // Array de provincias
  const provincias = [
    "Ver opciones",
    "Buenos Aires",
    "Catamarca",
    "Chaco",
    "Chubut",
    "Córdoba",
    "Corrientes",
    "Entre Ríos",
    "Formosa",
    "Jujuy",
    "La Pampa",
    "La Rioja",
    "Mendoza",
    "Misiones",
    "Neuquén",
    "Río Negro",
    "Salta",
    "San Juan",
    "San Luis",
    "Santa Cruz",
    "Santa Fe",
    "Santiago del Estero",
    "Tierra del Fuego, Antártida e Islas del Atlántico Sur",
    "Tucumán",
  ];

  const customOnSubmit = async (data) => {
    setIsSubmitting(false);
    const token = sessionStorage.getItem("token"); 
    try {
      // Aquí añadimos el token al objeto data
      const dataWithToken = {
        ...data, 
        token: token, 
        id: idParaEditar,
      };

      // Convertimos el objeto dataWithToken a JSON
      const body = JSON.stringify(dataWithToken);
      const response = await fetch("/api/busqueda/Editar", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json", 
        },
        body, 
      });

      if (response.ok) {
        const responseData = await response.json();
   
        props.onNuevaBusquedaAñadida();
        Swal.fire({
          title: "Puesto cargado con éxito!",
          imageUrl: logo,
          imageWidth: 100,
          imageHeight: 30,
          imageAlt: "Logo",
          confirmButtonText: "Ok",
          timer: 5000,
          allowOutsideClick: false,
          customClass: {
            container: darkMode
              ? "swal2-container--dark"
              : "swal2-container--light",
            confirmButton: "my-swal-button",
          },
        })
      } else {
        // Manejar los errores, por ejemplo, mostrar un mensaje al usuario
        console.error("Error al enviar los datos:", response.statusText);
      }
    } catch (error) {
      console.error("Error al intentar enviar los datos a la API:", error);
    }
    props.onNuevaBusquedaAñadida();
    setIsSubmitting(false);
    // Limpiamos el formulario independientemente del resultado de la petición
    reset({
      nombre: "",
      fecha: "",
      FechaPuesto: "",
      provincia: "",
      cantidad: "",
      fechaCierre: "",
      estado: "",
      cantidadDeSolicitantes: "",
      seleccionados: "",
      finalistas: "",
      contratados: "",
      rechazados: "",
      observaciones: "",
    });
    onHide();
  };


   // Función para manejar el cambio de fecha y agregar las barras automáticamente
   const handleDateChange = (event, fieldName) => {
    let { value } = event.target;
    // Permite que el campo se borre completamente o maneja la eliminación de caracteres específicamente
    if (value === "") {
        setValue(fieldName, value);
        return;
    }

    // Permite remover cualquier caracter que no sea numerico. 
    let cleanValue = value.replace(/\D/g, ""); 

    // Determina cómo formatear basado en la longitud del valor limpio
    if (cleanValue.length <= 2) {
        value = cleanValue;
    } else if (cleanValue.length <= 4) {
        value = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2)}`;
    } else {
        value = `${cleanValue.slice(0, 2)}/${cleanValue.slice(2, 4)}/${cleanValue.slice(4, 8)}`;
    }

    setValue(fieldName, value);
};

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
            darkMode
              ? " modal-content-dark text-white "
              : "modal-content text-black "
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Editar búsqueda</h6>
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
                <div className="form-group col-8">
                  <label className="fs-14 mb-2 ms-1">Nombre</label>
                  <Controller
                    name="nombre"
                    control={control}
                    defaultValue={nombre}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.nombre && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">Fecha</label>
                  <Controller
                    name="FechaPuesto"
                    defaultValue={fechaPuestoFormateada}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => handleDateChange(e, "FechaPuesto")}
                        maxLength={10}
                      />
                    )}
                  />
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group col-5">
                  <label className="fs-14 mb-2 ms-1">Puesto</label>
                  <Controller
                    name="puesto"
                    defaultValue={puesto}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.puesto && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">Provincia</label>
                  <Controller
                    name="provincia"
                    defaultValue={provincia}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="form-control input-cargar-nueva-busqueda"
                      >
                        {provincias.map((provincia, index) => (
                          <option key={index} value={provincia}>
                            {provincia}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  {errors.provincia && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="form-group col-3">
                  <label className="fs-14 mb-2 ms-1">Cantidad</label>
                  <Controller
                    name="cantidad"
                    control={control}
                    defaultValue={cantidad}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.cantidad && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>

              <article className="d-flex justify-content-between py-2">
                <div className="form-group">
                  <label className="fs-14 mb-2 ms-1">Fecha de cierre</label>
                  <Controller
                    name="fechaCierre"
                    defaultValue={fechaCierreFormateada}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => handleDateChange(e, "fechaCierre")}
                        maxLength={10}
                      />
                    )}
                  />
                  {errors.fechaCierre && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">Estado</label>
                  <Controller
                    name="estado"
                    defaultValue={estado}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="form-control input-cargar-nueva-busqueda"
                      >
                        <option value="">Ver opciones</option>
                        <option value="Activa">Activa</option>
                        <option value="Cancelada">Cancelada</option>
                      </select>
                    )}
                  />
                  {errors.estado && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group d-flex col-5">
                  <label className="me-4 mt-1 fs-14 ms-1">
                    Cantidad de solicitantes
                  </label>
                  <Controller
                    name="cantidadDeSolicitantes"
                    defaultValue={cantidadDeSolicitantes}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                </div>
                {errors.cantidadDeSolicitantes && (
                  <span className="fs-12 text-danger ms-1">
                    Este campo es requerido
                  </span>
                )}
              </article>
              <article className="row py-2">
                <div className="form-group  col-3">
                  <label className="fs-14 mb-2 ms-1">Seleccionados</label>
                  <Controller
                    name="seleccionados"
                    defaultValue={seleccionados}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.seleccionados && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-3">
                  <label className="fs-14 mb-2 ms-1">Finalistas</label>
                  <Controller
                    name="finalistas"
                    defaultValue={finalistas}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.finalistas && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-3">
                  <label className="fs-14 mb-2 ms-1">Contratados</label>
                  <Controller
                    name="contratados"
                    defaultValue={contratados}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.contratados && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group  col-3">
                  <label className="fs-14 mb-2">Rechazados</label>
                  <Controller
                    name="rechazados"
                    defaultValue={rechazados}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.rechazados && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group ">
                  <label className="fs-14 mb-2 ms-1">Observaciones</label>
                  <Controller
                    name="observaciones"
                    defaultValue={observaciones}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.observaciones && (
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
                      ? "btn-guardar-modificaciones-nuevo-puesto  border-0 lato-bold text-white"
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

export default ModalReclutamientoEditar;
