import React, { useContext, useState } from "react";
import { Form, Modal, Spinner } from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faCircleMinus,
  faLocationDot,
  faPhone,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { DarkModeContext } from "../../context/DarkModeContext";

import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";

const ModalCompletarPeticion = (props) => {
  const { show, onHide, datosDetalles, idParaEnviar } = props;
  const { darkMode } = useContext(DarkModeContext);
  const {
    motivo,
    estado,
    nombredelComercio,
    direccion,
    provincia,
    numeroTelefono,
    numeroTerminal,
    observacionAliado,
    observacionAdministracion,
  } = datosDetalles;

  const {
    control,
    handleSubmit,
    register,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      observacion: "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data) => {
    setIsSubmitting(true);

    // Consolidar los pasos en un solo array y extraer las observaciones
    const pasos = [];

    if (data.agregaTerminal) pasos.push("Agrega terminal");
    if (data.baja) pasos.push("Baja procesada");
    if (data.cambioTerminal) pasos.push("Cambio de Terminal");
    if (data.cambioTitularidad) pasos.push("Cambio de titularidad");
    if (data.servicioTecnico) pasos.push("Servicio técnico completado");
    if (data.incorporacionTarjetasProvinciales)
      pasos.push("Incorporacion de Tarjetas Provinciales");
    if (data.modificaciones) pasos.push("Modificaciones de Boca de pago");
    if (data.retencionCliente) pasos.push("Retención de Cliente");
    if (data.rollos) pasos.push("Rollos");
    if (data.establecimientoCerrado) pasos.push("Establecimiento cerrado");

    const token = sessionStorage.getItem("token");
    const observaciones = data.observacion;

    // Crear el objeto con los datos consolidados
    const formData = {
      token,
      observaciones,
      pasos,
      id: idParaEnviar, 
    };

    try {
      const response = await fetch("/api/comanda/FinalizarComanda", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await Swal.fire({
        title: "Éxito",
        text: "Peticion enviada con éxito",
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
      });
      reset();
      onHide();
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al enviar los datos",
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
      });
    } finally {
      setIsSubmitting(false);
    }
    window.location.reload();
  };

  return (
    <div>
      <Modal
        {...props}
        show={show}
        onHide={onHide}
        centered
        size="xl"
        fullscreen={true}
        aria-labelledby="contained-modal-title-vcenter"
        style={{
          backgroundColor: "#E5E8EE 0% 0% no-repeat padding-box;",
          opacity: "1",
        }}
      >
        <Modal.Body className={darkMode ? " modal-fondo" : "modal-fondo "}>
          <section className="modal-contenedor-fondo-1 px-4 d-flex justify-content-between py-2 my-2 ">
            <div className="ocultar-div mt-1"></div>
            <div className="d-flex justify-content-center mt-1">
              <h6 className="fs-16 lato-bold ">Completar petición</h6>
            </div>
            <div className="mt-1">
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div>
            <section className="modal-contenedor-fondo-1 px-4 py-4">
              <article className="row ">
                <div className="col-lg-8 col-12">
                  <h6 className="fs-18 color-verde">
                    {motivo === null || motivo === ""
                      ? "No hay motivo cargado en el sistema."
                      : motivo}
                  </h6>
                </div>
              </article>
              <article className="row ">
                <div className="col-lg-8 col-12">
                  <h6 className="lato-regular fs-16 mx-2 d-flex">
                    Estado:
                    {estado === "pendiente" ? (
                      <>
                        <div
                          className="fs-16 lato-regular"
                          style={{ color: "#E89F2F" }}
                        >
                          <FontAwesomeIcon
                            className="mx-1"
                            icon={faCircleMinus}
                            style={{ color: "#E89F2F" }}
                          />
                          Pendiente
                        </div>
                      </>
                    ) : (
                      <div className="fs-16 lato-regular  color-verde">
                        <FontAwesomeIcon
                          className="mx-1"
                          icon={faCircleCheck}
                          style={{ color: "#b4c400 " }}
                        />
                        Completado
                      </div>
                    )}
                  </h6>
                </div>
              </article>

              <article className="row py-2">
                <div className="col-lg-8 col-12">
                  <h6 className="lato-bold  fs-18">
                    {nombredelComercio === null || nombredelComercio === ""
                      ? "N/A"
                      : nombredelComercio}{" "}
                  </h6>
                  <h6 className="fs-14 lato-regular mx-2">
                    <FontAwesomeIcon
                      size="lg"
                      className="me-2"
                      icon={faLocationDot}
                      style={{ color: "#b4c400" }}
                    />
                    <span>
                      {direccion === null || direccion === ""
                        ? "N/A"
                        : direccion}{" "}
                    </span>
                    <span className="mx-3">-</span>
                    {provincia === null || provincia === ""
                      ? "N/A"
                      : provincia}{" "}
                  </h6>
                  <h6 className="fs-14 lato-regular mx-2">
                    <FontAwesomeIcon
                      className="me-2"
                      icon={faPhone}
                      size="lg"
                      style={{ color: "#b4c400" }}
                    />

                    {numeroTelefono === null || numeroTelefono === ""
                      ? "N/A"
                      : numeroTelefono}
                  </h6>
                </div>
              </article>
              <article className="row py-2">
                <div className="col-lg-8 col-12">
                  <h6 className="fs-14 lato-regular">
                    N° de Terminal <br />
                    <span className="mx-2">
                      {numeroTerminal === null || numeroTerminal === ""
                        ? "N/A"
                        : numeroTerminal}
                    </span>
                  </h6>
                </div>
              </article>
              <article>
                <div className="form-group col-12  ">
                  <h6 className="fs-14 lato-regula ">
                    Observaciones Aliado
                    <br />{" "}
                  </h6>
                </div>
                <div className="bg-observaciones-completar-peticion-modal  py-2 px-2">
                  <span className="lato-regular fs-16">
                    {observacionAliado === null || observacionAliado === ""
                      ? "No hay observacion por parte del Aliado cargada en el sistema."
                      : observacionAliado}
                  </span>
                </div>
              </article>
              <article>
                <div className="form-group col-12">
                  <h6 className="fs-14 lato-regular py-3">
                    {" "}
                    Observaciones Administración
                    <br />{" "}
                    <div className="bg-observaciones-completar-peticion-modal py-2 px-2 mt-2">
                      <span className="lato-regular fs-16 mx-2">
                        {observacionAdministracion === null ||
                        observacionAdministracion === ""
                          ? "N/A"
                          : observacionAdministracion}
                      </span>
                    </div>
                  </h6>
                </div>
              </article>
            </section>

            <form onSubmit={handleSubmit(onSubmit)}>
              <section className="modal-contenedor-fondo-1 my-4 px-4 ">
                <div>
                  <h6 className="fs-12 lato-regular pt-4">
                    <i> Marcar según gestión realizada:</i>
                  </h6>
                </div>

                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Agrega terminal"
                    {...register("agregaTerminal")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    label="Baja procesada"
                    className="lato-bold fs-16"
                    {...register("baja")}
                  />
                </div>

                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Cambio de Terminal"
                    {...register("cambioTerminal")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Cambio de titularidad"
                    {...register("cambioTitularidad")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Establecimiento cerrado"
                    {...register("establecimientoCerrado")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Incorporacion de Tarjetas Provinciales"
                    {...register("incorporacionTarjetasProvinciales")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold  fs-16"
                    label="Modificaciones de Boca de pago"
                    {...register("modificaciones")}
                  />
                </div>

                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Retención de Cliente"
                    {...register("retencionCliente")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Rollos"
                    {...register("rollos")}
                  />
                </div>
                <div className="form-group py-2">
                  <Form.Check
                    type="checkbox"
                    className="lato-bold fs-16"
                    label="Servicio técnico completado"
                    {...register("servicioTecnico")}
                  />
                </div>
              </section>
              <div className="form-group">
                <label className="fs-14 lato-regular mx-2">Observación</label>
                <Controller
                  name="observacion"
                  control={control}
                  render={({ field }) => (
                    <textarea
                      {...field}
                      className="form-control caja-observaciones-gestor-completada"
                      style={{ height: "100px" }}
                      placeholder="Observaciones"
                    />
                  )}
                />
              </div>
              <div className="d-flex justify-content-between mt-5">
                <button
                  type="button"
                  className="btn-cancel-modificaciones-nuevo-puesto border-0 lato-bold text-white"
                  onClick={onHide}
                >
                  Salir
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-guardar-modificaciones-nuevo-puesto border-0 lato-bold text-white"
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

export default ModalCompletarPeticion;
