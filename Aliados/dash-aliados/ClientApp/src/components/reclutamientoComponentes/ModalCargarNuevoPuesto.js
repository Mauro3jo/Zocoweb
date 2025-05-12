import React, { useContext, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { DarkModeContext } from "../../context/DarkModeContext";

const ModalCargarNuevoPuesto = (props) => {
  const { show, onHide, customOnSubmit, isSubmitting } = props;
  const { darkMode } = useContext(DarkModeContext);
  const { control, handleSubmit, formState, register, reset } = useForm();
  const { errors } = formState;

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
              ? " modal-content-cargar-puesto-dark  text-white "
              : "modal-content-cargar-puesto text-black "
          }
        >
          <section className="d-flex justify-content-between py-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Cargar descripción de puesto</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div className="container">
            <form className=" " onSubmit={handleSubmit(customOnSubmit)}>
              <article>
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2"
                    htmlFor="nombre"
                  >
                    Nombre
                  </label>
                </div>
                <div>
                  <Controller
                    name="nombre"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-cargar-nuevo-puesto"
                        style={{ padding: "10px" }}
                        type="text"
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.anterior && (
                      <p className="fs-16 lato-bold">{errors.nombre.message}</p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="requisitos"
                  >
                    📄 Requisitos
                  </label>
                </div>
                <div>
                  <Controller
                    name="requisitos"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger ">
                    {errors.requisitos && (
                      <p className="fs-16 lato-bold">
                        {errors.requisitos.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="principalesTareas"
                  >
                    📝 Principales tareas
                  </label>
                </div>
                <div>
                  <Controller
                    name="principalesTareas"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.principalesTareas && (
                      <p className="fs-16 lato-bold">
                        {errors.principalesTareas.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="ofrecemos"
                  >
                    🌟 Ofrecemos
                  </label>
                </div>
                <div>
                  <Controller
                    name="ofrecemos"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <textarea
                        className="input-cargar-nuevo-puesto-comentario"
                        style={{ padding: "10px" }}
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.ofrecemos && (
                      <p className="fs-16 lato-bold">
                        {errors.ofrecemos.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-3">
                <div>
                  <label
                    className="lato-regular fs-16-a-14 mb-2 mt-2"
                    htmlFor="foto"
                  >
                    🖼️ Cargar Imagen
                  </label>
                </div>
                <input
                  type="file"
                  {...register("foto", { required: "Campo requerido" })}
                  className="form-control"
                />
                <div className="text-danger">
                  {errors.foto && (
                    <p className="fs-16 lato-bold">{errors.foto.message}</p>
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

export default ModalCargarNuevoPuesto;
