import React, { useContext, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { DarkModeContext } from "../../context/DarkModeContext";

const ModalCargarNuevoCuestionario = (props) => {
    const { show, onHide, customOnSubmit, isSubmitting, puestos } = props;
  const { darkMode } = useContext(DarkModeContext);
  const { control, handleSubmit, formState, register, reset } = useForm();
  const { errors } = formState;
  return (
    <div>
          <Modal {...props}
        show={show}
        onHide={onHide}
        centered
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
      >
      <Modal.Body className={darkMode ? "modal-dark text-white" : "modal-light text-black"}>
        <section className="d-flex justify-content-between py-3">
          <div></div>
          <h6 className="fs-18 lato-bold text-center">Cargar nuevo cuestionario</h6>
          <button className="border-0 btn-close" onClick={onHide}>
            <FontAwesomeIcon className="fs-18" icon={faXmark} />
          </button>
        </section>

        <form onSubmit={handleSubmit(customOnSubmit)}>
          {/* Selección de puesto */}
          <div className="mb-3">
            <label className="lato-regular fs-16 mb-2">📌 Seleccionar puesto</label>
            <Controller
  name="idPuesto"
  control={control}
  rules={{ required: "Campo requerido" }}
  render={({ field }) => (
    <select
      className="form-select"
      {...field}
      onChange={(e) => field.onChange(e.target.value)} // Asegurar que guarda el ID
    >
      <option value="">Seleccione un puesto</option>
      {puestos.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nombre}
        </option>
      ))}
    </select>
  )}
/>
            {errors.puesto && <p className="text-danger fs-16">{errors.puesto.message}</p>}
          </div>

          {/* Nombre del cuestionario */}
          <div className="mb-3">
            <label className="lato-regular fs-16 mb-2">📝 Nombre del cuestionario</label>
            <Controller
              name="nombre"
              control={control}
              rules={{ required: "Campo requerido" }}
              render={({ field }) => (
                <input className="form-control" type="text" {...field} />
              )}
            />
            {errors.nombre && <p className="text-danger fs-16">{errors.nombre.message}</p>}
          </div>

          {/* Máximo de preguntas */}
          <div className="mb-3">
            <label className="lato-regular fs-16 mb-2">🔢 Máximo de preguntas</label>
            <Controller
              name="maxPreguntas"
              control={control}
              rules={{
                required: "Campo requerido",
                min: { value: 1, message: "Debe ser al menos 1" },
                max: { value: 100, message: "Máximo permitido: 100" },
              }}
              render={({ field }) => (
                <input className="form-control" type="number" {...field} min="1" max="100" />
              )}
            />
            {errors.maxPreguntas && <p className="text-danger fs-16">{errors.maxPreguntas.message}</p>}
          </div>

          {/* Botones */}
          <div className="d-flex justify-content-between mt-4">
            <button className="btn btn-secondary" type="button" onClick={onHide}>
              Cancelar
            </button>
            <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <Spinner animation="border" size="sm" /> : "Guardar"}
            </button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
        </div>
  )
}

export default ModalCargarNuevoCuestionario