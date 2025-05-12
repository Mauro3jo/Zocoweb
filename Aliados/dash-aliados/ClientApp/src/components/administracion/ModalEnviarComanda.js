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

const ModalEnviarComanda = (props) => {
  const { show, onHide, idParaId, datosDetalles } = props;
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
    const token = sessionStorage.getItem("token");
    const formData = {
      ...data,
      Id: idParaId,
      token: token, 
      Idgestor: gestor.id, 
    };

    try {
      const response = await fetch("/api/comanda/EditarComanda", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        Swal.fire({
          title: "Éxito",
          text: "Los datos han sido enviados correctamente",
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
      } else {
        Swal.fire({
          title: "Error",
          text: "Los datos no se han sido enviados correctamente.",
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
      }
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
      Swal.fire("Error", "Problema de conexión al enviar los datos", "error");
    }

    setIsSubmitting(false);
    reset(); 
    onHide();
  };

  const [gestor, setGestor] = useState({ name: "", id: null }); 

  const fetchGestor = async () => {
    const token = sessionStorage.getItem("token");
    const requestData = {
      Usuario: filtro,
      Token: token,
    };

    try {
      const response = await fetch("/api/usuarios/buscargestor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      const data = await response.json();

      if (response.ok) {
        setGestor({ name: data.nombre, id: data.id }); 
      } else {
        Swal.fire(
          "Error",
          data.message || "No se pudo obtener el gestor",
          "error"
        );
      }
    } catch (error) {
      console.error("Error fetching gestor:", error);
      Swal.fire("Error", "Problema de conexión", "error");
    }
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
    { id: 23, nombre: "Tucumán" },
  ];

  const opcionesProvincias = provincias.map((provincia) => ({
    value: provincia.nombre,
    label: provincia.nombre,
  }));

  // estado para guardar el filtro
  const [filtro, setFiltro] = useState("");

  const {
    motivo,
    cuit,
    nombredelComercio,
    direccion,
    provincia,
    email,
    numeroTelefono,
    fechaApertura,
    fechaCierre,
    numeroTerminal,
    observacionAliado,
    observacionGestor,
  } = datosDetalles;

  // Función auxiliar para formatear fecha y hora
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString();
  };

  const formatTime = (dateTimeStr) => {
    const time = new Date(dateTimeStr);
    return time.toLocaleTimeString([], { timeStyle: "short" });
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
            darkMode ? " modal-content text-black" : "modal-content text-black "
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Editar petición</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>
          <div className="">
            <form
              className="px-5 mx-5 "
              onSubmit={handleSubmit(customOnSubmit)}
            >
              <article className="row ">
                <div className="col-lg-8 col-12">
                  <h6>Motivo</h6>
                  <h6 className="lato-regular">
                    {motivo === null || motivo === "" ? (
                      <> No hay MOTIVO ingresado </>
                    ) : (
                      motivo
                    )}
                  </h6>
                </div>
                <div className="col-lg-4 col-12">
                  <h6>Fecha de apertura</h6>
                  <h6 className="lato-regular">
                    {" "}
                    {fechaApertura === null || fechaApertura === "" ? (
                      <> No hay fecha de apertura ingresada</>
                    ) : (
                      <>
                        <span className="me-1">
                          {formatDate(fechaApertura)}
                        </span>
                        -
                        <span className="ms-1">
                          {formatTime(fechaApertura)} hs
                        </span>
                      </>
                    )}
                  </h6>
                </div>
              </article>
              <article className="row ">
                <div className="col-lg-8 col-12">
                  <h6>CUIT</h6>
                  <h6 className="lato-regular">{cuit}</h6>
                </div>
                <div className="col-lg-4 col-12">
                  <h6>Fecha de cierre</h6>
                  <h6 className="lato-regular">
                    {fechaCierre === null || fechaCierre === "" ? (
                      <> No hay fecha de cierre ingresada</>
                    ) : (
                      <>
                        <span className="me-1">{formatDate(fechaCierre)}</span>-
                        <span className="ms-1">
                          {formatTime(fechaCierre)} hs
                        </span>
                      </>
                    )}
                  </h6>
                </div>
              </article>
              <article>
                <div className="form-group col-12">
                  <h6>Observación Aliado</h6>
                  <h6 className="lato-regular">
                    {observacionAliado === null || observacionAliado === "" ? (
                      <> No hay ingresada observacion por parte del Aliado</>
                    ) : ( observacionAliado)}
                  </h6>
                </div>
              </article>
              <article>
                <div className="form-group col-12">
                  <h6>Observación Gestor</h6>
                  <h6 className="lato-regular">
                    {observacionGestor}
                  </h6>
                </div>
              </article>

              <article className="row py-2">
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1 h6">Direccion</label>
                  <Controller
                    name="Direccion"
                    defaultValue={direccion ? direccion : ""}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Direccion"
                        className="form-control input-form-editar-comanda "
                      />
                    )}
                  />
                  {errors.Direccion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-lg-6 col-12">
                  <label className="fs-14 mb-2 ms-1 h6">Provincia</label>
                  <Controller
                    name="Provincia"
                    defaultValue={provincia ? provincia : ""}
                    control={control}
                    rules={{ required: false}} // Asegúrate de que el campo es requerido
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
                  <label className="fs-14 mb-2 ms-1 h6">Nombre de comercio </label>
                  <Controller
                    name="Comercio"
                    defaultValue={nombredelComercio ? nombredelComercio: ""}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Comercio"
                        className="form-control input-form-editar-comanda "
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
                  <label className="fs-14 mb-2 ms-1 h6">N° de Terminal </label>
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
                  <label className="fs-14 mb-2 ms-1 h6">Teléfono </label>
                  <Controller
                    name="Telefono"
                    defaultValue={numeroTelefono ? numeroTelefono : ""}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        placeholder="Teléfono"
                        className="form-control input-form-editar-comanda "
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
                  <label className="fs-14 mb-2 ms-1 h6">Nombre representante</label>
                  <Controller
                    name="email"
                    defaultValue={email ? email: ""}
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        placeholder="Ingresar nombre representante"
                        className="form-control input-form-editar-comanda "
                      />
                    )}
                  />
                  {errors.email && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
             
              <div>

              <h6 className="mt-2 pb-2">CUIT gestor</h6>
              <article className="d-flex justify-content-start">
            
                <div className=" d-flex align-items-center">
             
                  <div className="campo-busqueda d-flex">
                 
                    <input
                      type="text"
                      className={`form-control ${
                        darkMode ? "text-white" : ""
                      } label-buscador-cuit lato-regular fs-18 border-0`}
                      placeholder="0123456789"
                      value={filtro}
                      maxLength={11}
                      onChange={(e) => setFiltro(e.target.value)}
                    />
                    <button
                      type="button"
                      className="buscar-lupa-cuit ms-2 border-0"
                      onClick={fetchGestor}
                    >
                      <FontAwesomeIcon
                        icon={faMagnifyingGlass}
                        className="text-white"
                      />
                    </button>
                  </div>
                </div>
              </article>
              </div>
              <article className="row py-2">
                <div className="form-group col-12">
                  <label className="fs-14 mb-2 ms-1 h6">Gestor asignado</label>
                  <Controller
                    name="Gestor"
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        disabled
                        value={gestor.name} // Display the gestor's name from the state
                        className="form-control label-input-disabled"
                      />
                    )}
                  />
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group ">
                  <label className="fs-14 mb-2 ms-1 h6">Observaciones</label>
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
                  type="button"
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

export default ModalEnviarComanda;
