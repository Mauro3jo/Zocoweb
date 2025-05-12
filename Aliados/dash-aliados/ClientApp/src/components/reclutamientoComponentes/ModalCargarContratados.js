import React, { useContext, useEffect, useState } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


import { DarkModeContext } from "../../context/DarkModeContext";

const ModalCargarContratados = (props) => {
  const { show, onHide, onContratadoCreadoOEditado } = props;
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
  const [isSubmitting, setIsSubmitting] = useState(false); 

  // Función auxiliar para convertir archivo a base64
  const convertToBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Manejador del envío del formulario
  const customOnSubmit = async (data) => {
    setIsSubmitting(true);
    let formData = { ...data };

    // Verifica y convierte la imagen a base64
    if (data.foto && data.foto.length > 0) {
      const base64 = await convertToBase64(data.foto[0]);
      formData.foto = base64; 
    } else {
      formData.foto = ""; 
    }

    // Incluir token si es necesario
    const token = sessionStorage.getItem("token");
    if (token) {
      formData.token = token;
    }

    // Intento de envío de datos
    try {
      setIsSubmitting(true);
      // Añade el token y el id al objeto formData
      formData = {
        ...formData,
        token: token,
      };

      const response = await fetch("/api/contratado/Crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
       
        props.onContratadoCreadoOEditado();
       
      } else {
        // Error en la respuesta
        console.error("Error al enviar los datos:", response.statusText);
        props.onContratadoCreadoOEditado();
      }
    } catch (error) {
      // Error en el envío
      console.error("Error al intentar enviar los datos a la API:", error);
    }
    setIsSubmitting(false);
    props.onContratadoCreadoOEditado();
    reset(); 
    onHide(); 
  };

  // estado para guardar la lista de la carga de busqueda
  const [listaBusqueda, setListaBusqueda] = useState([]);

  // consulta para listar
  const busquedaListar = "/api/busqueda/Listar";

  // Método para obtener la lista actualizada de búsquedas
  const actualizarListaBusquedas = async () => {
    try {
      const response = await fetch(busquedaListar);
      const data = await response.json();
      setListaBusqueda(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarListaBusquedas();
  }, []); 

  // Antes de tu componente
  const obtenerPuestoPorNombre = (lista, nombre) => {
    const busqueda = lista.find((item) => item.nombre === nombre);
    return busqueda ? busqueda.puesto : "";
  };

  const [nombreSeleccionado, setNombreSeleccionado] = useState("");

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
              <h6 className="fs-18 lato-bold">Cargar contratados</h6>
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
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">Nombre</label>
                  <Controller
                    name="Nombre"
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
                  {errors.Nombre && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>

                <div className="form-group col-3">
                  <label className="fs-14 mb-2 ms-1">Edad</label>
                  <Controller
                    name="Edad"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.Edad && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-3">
                  <label className="fs-14 mb-2 ms-1">DNI</label>
                  <Controller
                    name="Dni"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="number"
                        className="form-control input-cargar-nueva-busqueda"
                      />
                    )}
                  />
                  {errors.Dni && (
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
                  {errors.Direccion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-6">
                  <label className="fs-14 mb-2 ms-1">E-mail</label>
                  <Controller
                    name="Email"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="email"
                        className="form-control input-cargar-nueva-busqueda"
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

              <article className="col-6 py-2">
                <div className="form-group">
                  <label className="fs-14 mb-2 ms-1">Foto</label>
                  <input
                    type="file"
                    {...register("foto", { required: "Campo requerido" })}
                    className="form-control"
                  />
                  {errors.Foto && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group col-8">
                  <label className="fs-14 mb-2 ms-1">Búsqueda por Nombre</label>
                  <Controller
                    name="BusquedaId"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => {
                          const nombreSeleccionado = e.target.value;
                          // Encuentra el objeto de búsqueda basado en el nombre seleccionado.
                          const busquedaObj = listaBusqueda.find(
                            (b) => b.nombre === nombreSeleccionado
                          );

                          if (busquedaObj) {
                            // Actualiza el estado local si estás usando uno para mostrar el nombre seleccionado en el UI
                            setNombreSeleccionado(busquedaObj.nombre);

                            // Actualiza el BusquedaId en el formulario con el ID del objeto de búsqueda seleccionado.
                            setValue("BusquedaId", busquedaObj.id, {
                              shouldValidate: true,
                            });

                            // Actualiza el "Puesto" en el formulario con el puesto del objeto de búsqueda seleccionado.
                            // Asegúrate de que esto coincide con cómo esperas que el nombre del puesto sea actualizado.
                            setValue("Puesto", busquedaObj.puesto, {
                              shouldValidate: true,
                            });
                          } else {
                            // Opcionalmente maneja el caso donde no se encuentra el objeto (e.g., cuando se selecciona "Ver opciones").
                            setNombreSeleccionado("");
                            setValue("BusquedaId", null);
                            setValue("Puesto", "");
                          }
                        }}
                        value={nombreSeleccionado} // Esto debería cambiar para reflejar el nombre o id correcto, dependiendo de cómo estás gestionando los valores
                      >
                        <option value="">Ver opciones</option>
                        {listaBusqueda.map((busqueda, index) => (
                          <option key={index} value={busqueda.nombre}>
                            {busqueda.nombre}
                          </option>
                        ))}
                      </select>
                    )}
                  />

                  {errors.BusquedaId && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="me-4 mt-1 fs-14 ms-1 mb-2">Puesto</label>
                  <Controller
                    name="Puesto"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        readOnly // Puedes hacerlo de solo lectura si quieres que solo se actualice automáticamente
                      />
                    )}
                  />
                  {errors.Puesto && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group  col-4">
                  <label className="fs-14 mb-2 ms-1">Fecha de entrevista</label>
                  <Controller
                    name="FechaEntrevista"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => handleDateChange(e, "FechaEntrevista")} // Usa la nueva función para manejar el cambio
                        maxLength={10}
                      />
                    )}
                  />
                  {errors.FechaEntrevista && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">
                    Fecha de contratación
                  </label>
                  <Controller
                    name="FechaDeContratacion"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => handleDateChange(e, "FechaDeContratacion")} // Usa la nueva función para manejar el cambio
                        maxLength={10}
                      />
                    )}
                  />
                  {errors.FechaDeContratacion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">
                    Tipo de contratación
                  </label>
                  <Controller
                    name="TipoDeContratacion"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <select
                        {...field}
                        className="form-control input-cargar-nueva-busqueda"
                      >
                        <option value="">Ver opciones</option>
                        <option value="Plazo fijo">Plazo fijo</option>
                        <option value="Prestación de servicio (Monotributo)">
                          Prestación de servicio (Monotributo)
                        </option>
                      </select>
                    )}
                  />
                  {errors.TipoDeContratacion && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group  col-4">
                  <label className="fs-14 mb-2 ms-1">Estado</label>
                  <Controller
                    name="Estado"
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
                  {errors.Estado && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">Fecha de cierre</label>
                  <Controller
                    name="FechaDeCierre"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <input
                        {...field}
                        type="text"
                        className="form-control input-cargar-nueva-busqueda"
                        onChange={(e) => handleDateChange(e, "FechaDeCierre")} // Usa la nueva función para manejar el cambio
                        maxLength={10}
                      />
                    )}
                  />
                  {errors.FechaDeCierre && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
                <div className="form-group col-4">
                  <label className="fs-14 mb-2 ms-1">CV Url</label>
                  <Controller
                    name="Cv"
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
                  {errors.Cv && (
                    <span className="fs-12 text-danger ms-1">
                      Este campo es requerido
                    </span>
                  )}
                </div>
              </article>
              <article className="row py-2">
                <div className="form-group ">
                  <label className="fs-14 mb-2 ms-1">Observacion</label>
                  <Controller
                    name="Observacion"
                    control={control}
                    rules={{ required: false }}
                    render={({ field }) => (
                      <textarea
                        {...field}
                        type="text"
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

export default ModalCargarContratados;
