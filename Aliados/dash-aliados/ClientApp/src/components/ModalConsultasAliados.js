import React, { useContext, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";
import { DarkModeContext } from "../context/DarkModeContext";

// import librerias
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../assets/img/logo.png";

// simulacion de datos
const datos = [
  {
    id: 1,
    motivo: "Solicitud de rollos",
  },
  {
    id: 2,
    motivo: "Consulta técnica",
  },
  {
    id: 3,
    motivo: "Consulta/Modificación de datos",
  },
  {
    id: 4,
    motivo: "Consulta sobre mi liquidación",
  },
  {
    id: 5,
    motivo: "Quiero darme de baja",
  },
  {
    id: 6,
    motivo: "Otra consulta",
  },
];

const ModalConsultasAliados = (props) => {
  const { show, onHide } = props;
  const { darkMode } = useContext(DarkModeContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    register,
    reset,
    setValue,
  } = useForm();

  const [datosCargarContratados, setCargarContratados] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar la carga y el botón

  // Manejador del envío del formulario
  const customOnSubmit = async (data) => {
    setIsSubmitting(true);
    let formData = { ...data, estado: "pendiente" };
    // Incluir token si es necesario
    const token = sessionStorage.getItem("token");
    if (token) {
      formData.token = token;
    }

    try {
      const response = await fetch("/api/comanda/CrearComanada", {
        // Cambia esta URL por la URL de tu API
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        Swal.fire(
          "Éxito",
          "Los datos han sido enviados correctamente",
          "success"
        );
      } else {
        Swal.fire("Error", "Hubo un problema al enviar los datos", "error");
      }
    } catch (error) {}

    setIsSubmitting(false);
    reset(); 
    onHide(); 
    window.location.reload();
  };

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
    { id: 23, nombre: "Tucumán" }
];


  // Convertir datos para ser usados en react-select
  const opcionesMotivo = datos.map((dato) => ({
    value: dato.motivo,
    label: dato.motivo,
  }));

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
          <section className="d-flex justify-content-between pt-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Nueva consulta</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div className="px-5 py-5">
            <form onSubmit={handleSubmit(customOnSubmit)}>
              <article className="row ">
                <div className="form-group col-12">
                  <label className="fs-14 mb-2 ms-1">Motivo</label>
                  <Controller
                    name="Motivo"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={opcionesMotivo}
                        className=" select__control_custom2 lato-bold"
                        classNamePrefix="select"
                        placeholder="Selecciona un motivo"
                        onChange={(selectedOption) =>
                          field.onChange(selectedOption.value)
                        }
                        value={opcionesMotivo.find(
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
                <div className="form-group ">
                  <label className="fs-14 mb-2 ms-1">Comentario</label>
                  <Controller
                    name="Observacion"
                    // defaultValue="default observaciones"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
                        placeholder="Ej: Necesitamos rollos hoy por favor"
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
              <article className="row py-2">
              <div className="form-group col-lg-4 col-12">
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
                        placeholder="Dirección local"
                      />
                    )}
                  />
                  {errors.Direccion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-lg-4 col-12">
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
                <div className="form-group col-lg-4 col-12">
                  <label className="fs-14 mb-2 ms-1">N° Telefono</label>
                  <Controller
                    name="Telefono"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-control input-cargar-nueva-busqueda"
                        placeholder="0123456789"
                      />
                    )}
                  />
                  {errors.Telefono && (
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

export default ModalConsultasAliados;
