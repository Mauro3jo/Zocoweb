import React, { useContext, useState } from "react";
import { Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { DarkModeContext } from "../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { CambiarClaveContext } from "../context/CambiarClaveContext";

const ModalConfiguracionesCel = (props) => {
    const { show, onHide } = props;
    const { darkMode } = useContext(DarkModeContext);
    const { control, handleSubmit, formState } = useForm();
    const { errors } = formState;
    const {onSubmit} = useContext(CambiarClaveContext)
   
    return (
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
              ? " modal-content text-dark border-0"
              : "modal-content border-0 text-dark "
          }
        >
           <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Cambiar contraseña</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 mb-3" icon={faXmark} />
              </button>
            </div>
          </section>
          <div className="d-flex justify-content-center">
            <form className="py-5 " onSubmit={handleSubmit(onSubmit)}>
              <article>
                <div>
                  <label
                    className="lato-bold fs-16-a-14 mb-2"
                    htmlFor="anterior"
                  >
                    Ingresar contraseña anterior:
                  </label>
                </div>
                <div>
                  <Controller
                    name="anterior"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-configuraciones border-0"
                        style={{ padding: "10px" }}
                        type="text"
                        {...field}
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.anterior && (
                      <p className="fs-16 lato-bold">
                        {errors.anterior.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label className="lato-bold fs-16-a-14 mb-2" htmlFor="nueva">
                    Ingresar contraseña nueva:
                  </label>
                </div>
                <div>
                  <Controller
                    name="nueva"
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
                    {errors.nueva && (
                      <p className="fs-16 lato-bold">{errors.nueva.message}</p>
                    )}
                  </div>
                </div>
              </article>
              <article className="my-1">
                <div>
                  <label
                    className="lato-bold fs-16-a-14 mb-2"
                    htmlFor="confirmar"
                  >
                    Ingresar contraseña nueva otra vez:
                  </label>
                </div>
                <div>
                  <Controller
                    name="confirmar"
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
                    {errors.confirmar && (
                      <p className="fs-16 lato-bold">
                        {errors.confirmar.message}
                      </p>
                    )}
                  </div>
                </div>
              </article>
              <div className="d-flex justify-content-center my-5">
                <button
                  className={
                    darkMode
                      ? "btn-guardar-modal-configuraciones border-0 lato-bold text-dark "
                      : "btn-guardar-modal-configuraciones border-0 lato-bold text-white"
                  }
                  type="submit"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    );
};

export default ModalConfiguracionesCel;