import React, { useContext, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import Select from 'react-select';

function ModalEditarAliado(props) {
  const { darkMode } = useContext(DarkModeContext);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const opcionesTipoUsuario = [
    { value: 0, label: "Aliados" },
    { value: 1, label: "Asesores" },
    { value: 2, label: "Liquidaciones" },
    { value: 4, label: "RRHH" },
    { value: 6, label: "Gestor" },
  ];

    // Establece los valores iniciales cuando el modal recibe un usuario
    useEffect(() => {
      if (props.usuario) {
        setValue("id", props.usuario.id);
        setValue("usuario", props.usuario.usuario);
        setValue("nombre", props.usuario.nombre);
        setValue("correo", props.usuario.correo);
        setValue("tipoUsuario", opcionesTipoUsuario.find(option => option.value === props.usuario.tipoUsuario));
      }
    }, [props.usuario, setValue]);

  const onSubmit = async (data) => {
    const token = sessionStorage.getItem("token");
     // Datos editados del formulario
     const dataToSend = {
      Nombre: data.nombre,
      Usuario: data.usuario,
      Correo: data.correo,
      TipoUsuario: data.tipoUsuario.value,
      Token: token,
    };
    try {
      const response = await fetch("/api/liquidaciones/editarusuario", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      Swal.fire({
        title: "¡Enviado!",
        text: "Usuario editado con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
      props.onActualizarDatos();
      props.onHide();
    } catch (error) {
      console.error("Hubo un error al enviar los datos:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo editar el usuario.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
    reset();
    props.onHide();
  };

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
            <h6 className="fs-18 lato-bold">Editar Aliado</h6>
          </div>
          <div>
            <button className="border-0 btn-filtro-cruz" onClick={props.onHide}>
              <FontAwesomeIcon className="fs-18 mb-3" icon={faXmark} />
            </button>
          </div>
        </section>
        <section>
          <div className="d-flex justify-content-center">
            <form className="" onSubmit={handleSubmit(onSubmit)}>
              <article>
                <div>
                  <label className="lato-bold fs-16-a-14 mb-2" htmlFor="cuit">
                    CUIT
                  </label>
                </div>
                <div>
                  <Controller
                    name="usuario"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <input
                        className="input-configuraciones border-0"
                        type="text"
                        {...field} // Vincula el input con el Controller
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.usuario && (
                      <p className="fs-16 lato-bold">
                        {errors.usuario.message}
                      </p>
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
              <article className="my-2">
                <div>
                  <label
                    className="lato-bold fs-16-a-14 mb-2"
                    htmlFor="tipoUsuario"
                  >
                    Tipo de Usuario
                  </label>
                </div>
                <div>
                  <Controller
                    name="tipoUsuario"
                    control={control}
                    rules={{ required: "Campo requerido" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={opcionesTipoUsuario}
                        className="lato-bold"
                        classNamePrefix="select"
                      />
                    )}
                  />
                  <div className="text-danger">
                    {errors.tipoUsuario && (
                      <p className="fs-16 lato-bold">
                        {errors.tipoUsuario.message}
                      </p>
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
                    name="correo"
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
                    {errors.correo && (
                      <p className="fs-16 lato-bold">{errors.correo.message}</p>
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

const ItemTablaUsuariosLiquidaciones = ({ dato, onActualizarDatos }) => {
  const { darkMode } = useContext(DarkModeContext);
  const [modalShow, setModalShow] = useState(false);
  const apiUrlRestaurar =
    process.env.REACT_APP_API_LIQUIDACIONES_RESTAURAR_USUARIO;
  const handleRestaurarClave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const dataToSend = {
        Id: dato.id,
        Nombre: dato.nombre,
        Usuario: dato.usuario,
        Correo: dato.correo,
        Token: token,
      };

      const response = await fetch("/api/liquidaciones/restaurarclave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }

      Swal.fire({
        title: "¡Enviado!",
        text: "Solicitud de restauración de clave enviada con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error al restaurar la clave", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al restaurar la clave.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };
  return (
    <>
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4 "> {dato.id}</td>
        <td className="fs-12-a-10 lato-regular pt-4 "> {dato.usuario}</td>
        <td className="fs-12-a-10 lato-regular pt-4 ">{dato.nombre}</td>
        <td className="fs-12-a-10 lato-regular pt-4 ">{dato.correo}</td>
        <td className="fs-13 lato-regular  d-flex margin-left-btn-publicar">
          <div className="margin-left-right-btn-publicar">
            <div className="d-flex centrado-responsive">
              <Button
                className="btn-publicar centrado border-0 mx-2"
                onClick={() => setModalShow(true)}
              >
                <FontAwesomeIcon
                  className="text-dark fs-16-a-14"
                  icon={faPen}
                />
              </Button>
            </div>
            <ModalEditarAliado
              show={modalShow}
              onHide={() => setModalShow(false)}
              usuario={dato}
              onActualizarDatos={onActualizarDatos}
            />
          </div>

          <div>
            <button
              className="btn-publicar-numero border-0 "
              type="button"
              onClick={handleRestaurarClave}
            >
              <span className="lato-bold ">1 2 3 4</span>
            </button>
          </div>
        </td>
      </tr>
    </>
  );
};

export default ItemTablaUsuariosLiquidaciones;
