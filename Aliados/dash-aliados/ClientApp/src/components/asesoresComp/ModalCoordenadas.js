// import hooks
import React, { useContext, useState, useEffect, useRef } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// librerias
import Swal from "sweetalert2";
import { Col, Form, Modal, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpFromBracket,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

// assets
import logo from "../../assets/img/logo.png";
import { useForm } from "react-hook-form";

const ModalCoordenadas = (props) => {
  // variables desde las props para cerrar y abrir el modal
  const { show, onHide } = props;

  // darkMode context funcionalidad para claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // hook para capturar la referencia de la coordenada
  const recordingInputRef = useRef(null);

  // state para el loading
  const [isUploading, setIsUploading] = useState(false);

  // estado para guardar los datos que se envia a la base
  const [formData, setFormData] = useState({
    selectedFile: null,
    selectedRecording: null,
    latitude: null,
    longitude: null,
    nombreLocal: "",
    tipoVisita: "Prospecto",
    comentario: "", // Nueva línea agregada aquí
  });

  // funcion fetch para las coordenadas
  const fetchCoordinates = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {}
      );
    } else {
    }
  };

  // funcion para enviar las coordenadas
    const sendLocationToServer = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "No tienes autorización para enviar la ubicación.",
            });
            return;
        }

        setIsUploading(true); // Iniciar la carga

        // 🔥 Función para limpiar encabezado Base64
        const cleanBase64 = (base64) => base64?.split(",")[1] || base64;

        const formDataToSend = new FormData();
        formDataToSend.append("ImageBase64", cleanBase64(formData.selectedFile));
        formDataToSend.append("AudioBase64", cleanBase64(formData.selectedRecording));
        formDataToSend.append("Latitud", String(formData.latitude));
        formDataToSend.append("Longitud", String(formData.longitude));
        formDataToSend.append("Local", formData.nombreLocal);
        formDataToSend.append("Tipo", formData.tipoVisita);
        formDataToSend.append("Token", token);
        formDataToSend.append("Observacion", formData.comentario);
        formDataToSend.append("TiempoAudio", "00:30"); // Ajustar si necesario

        console.log("📤 Enviando formDataToSend:", [...formDataToSend.entries()]);

        const url = "/api/geo/checkimagenyaudio";

        try {
            const response = await fetch(url, {
                method: "POST",
                body: formDataToSend,
            });

            if (response.ok) {
                Swal.fire({
                    title: "Enviado",
                    text: "Tus archivos se enviaron exitosamente.",
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
                }).then(() => {
                    onHide();
                });
            } else {
                throw new Error(`Error ${response.status}: No se pudo enviar`);
            }
        } catch (error) {
            console.error("❌ Error al enviar:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al enviar los datos.",
                icon: "error",
            });
        } finally {
            setIsUploading(false);
        }
    };

  // funcionalidad para capturar el input
  const handleInputChange = async (event) => {
    const { name, files, value } = event.target;

    if (files && files[0]) {
      if (name === "selectedFile") {
        // Convertir la imagen a Base64
        convertImageToBase64(files[0], (base64Image) => {
          setFormData((prevFormData) => ({
            ...prevFormData,
            selectedFile: base64Image, 
          }));
        });
      
      } else if (name === "selectedRecording") {
        const reader = new FileReader();
        reader.onload = (e) => {
          const base64Audio = e.target.result.split(",")[1];
          setFormData((prevFormData) => ({
            ...prevFormData,
            selectedRecording: base64Audio,
          }));
        };
        reader.readAsDataURL(files[0]);
      }
    } else {
      // Actualizar el estado para otros inputs que no son de tipo 'file'
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  // Función para convertir archivo a Base64
  function convertImageToBase64(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const maxWidth = 800; 
        const maxHeight = 600; 
        let width = img.width;
        let height = img.height;

        // Calcular el nuevo tamaño manteniendo la proporción
        if (width > height) {
          if (width > maxWidth) {
            height = height * (maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = width * (maxHeight / height);
            height = maxHeight;
          }
        }

        // Redimensionar la imagen con canvas
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        const base64 = canvas.toDataURL("image/png", 0.5); 
        callback(base64);
      };
      img.src = e.target.result;
    };
    reader.onerror = function (error) {
      console.log("Error: ", error);
    };
    reader.readAsDataURL(file);
  }

  // funcion para enviar los datos del formulario
  const handleSubmit = (event) => {
    event.preventDefault();
    if (formData.latitude !== null && formData.longitude !== null) {
      sendLocationToServer();
    } else {
      alert("Esperando la ubicación...");
      fetchCoordinates();
      Swal.fire({
        title: "error",
        text: "Error al enviar. Revisa tus archivos.",
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
  };

  useEffect(() => {
    if (show) {
      fetchCoordinates();
    }
  }, [show]);

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      pasoServicioTecnico: [
        { label: "Rollos", checked: false },
        {
          label: "Cargador",
          checked: false,
        },
        { label: "Bateria", checked: false },
        { label: "Teclado", checked: false },
        { label: "Inicializar/reiniciar", checked: false },
        { label: "Panel", checked: false },
        { label: "Referido", checked: false },
        { label: "Limpieza de la terminal", checked: false },
        {
          label: "Actualizar días y horarios de atención (En observaciones)",
          checked: false,
        },
        {
          label: "Actualizar número de contacto (En observaciones)",
          checked: false,
        },
      ],
    },
  });

  const pasoServicioTecnico = watch("pasoServicioTecnico"); // Asegúrate de obtener los pasos desde el form


  return (
    <div translate="no">
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
              ? "modal-content-2-dark text-white"
              : "modal-content-2 text-black"
          }
        >
          <section className="d-flex justify-content-between my-4">
            <div className="ocultar-div"></div>
            <div className="d-flex justify-content-center">
              <h6 className="fs-18 lato-bold">Subir archivos</h6>
            </div>
            <div>
              <button className="border-0 btn-filtro-cruz" onClick={onHide}>
                <FontAwesomeIcon className="fs-18 " icon={faXmark} />
              </button>
            </div>
          </section>

          <div className=" d-flex justify-content-center">
            <form className="" onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="nombreLocal" className="fs-16">
                  Nombre del comercio:
                </label>
                <input
                  name="nombreLocal"
                  type="text"
                  className="form-control "
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="">
                <Row>
                  <Form.Group className="mb-3 mt-1" as={Col} md="6">
                    <Form.Check
                      type="radio"
                      label="Prospecto"
                      name="tipoVisita"
                      id="Prospecto"
                      value="Prospecto"
                      checked={formData.tipoVisita === "Prospecto"}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                  {/* <Form.Group className="mt-2" as={Col} md="6">
                    <Form.Check
                      type="radio"
                      label="Visita"
                      name="tipoVisita"
                      id="Visita"
                      value="Visita"
                      checked={formData.tipoVisita === "Visita"}
                      onChange={handleInputChange}
                    />
                  </Form.Group> */}
                </Row>
              </div>
              {/* {formData.tipoVisita === "Prospecto" ? (
                  <article className="py-2">
                    <Form.Check
                      type="checkbox"
                      label="Días y horarios de atención (En observaciones)"
                      name="Días y horarios de atención (En observaciones)"
                      required
                    />
                    <Form.Check
                      type="checkbox"
                      label="Especificar Rubro (En observaciones)"
                      name="Especificar Rubro (En observaciones)"
                      required
                    />
                  </article>
                ) : (
                  <>
                    <div className="form-group pt-2 pb-4">
                      <label>
                        <h6>Verificación de visita</h6>
                      </label>
                      {pasoServicioTecnico.map((paso, index) => (
                        <Form.Check
                          key={index}
                          required
                          type="checkbox"
                          className="lato-regular fs-16"
                          label={paso.label}
                          {...register(`pasoServicioTecnico[${index}].checked`)}
                        />
                      ))}
                    </div>
                  </>
                )} */}
              <div className="mb-3">
                <label htmlFor="comentarioInput" className="fs-16">
                  Observaciones:
                </label>
                <textarea
                  name="comentario"
                  className="form-control"
                  id="comentarioInput"
                  onChange={handleInputChange}
                  rows="3" // Puedes ajustar el número de filas según tus necesidades
                  required
                ></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="imageInput" className="fs-16">
                  Enviá una foto del comercio:
                </label>
                <input
                  name="selectedFile"
                  type="file"
                  className="form-control"
                  id="imageInput"
                  onChange={handleInputChange}
                  accept="image/*"
                  required
                />
              </div>
             
              <div className="mb-3">
                <label htmlFor="recordingInput" className="fs-16">
                  Enviá una grabación:
                </label>
                <input
                  name="selectedRecording"
                  type="file"
                  className="form-control"
                  id="recordingInput"
                  onChange={handleInputChange}
                  accept="audio/aac,audio/amr,audio/x-caf,audio/alac,audio/mp3,audio/wav,audio/mpeg,audio/mp4,audio/*"
                  ref={recordingInputRef}
                />
              </div>
              <article className="d-flex justify-content-center">
                <button
                  className="btn-empezar-dia border-0"
                  disabled={isUploading ? true : false}
                  type="submit"
                >
                  {isUploading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {" Cargando..."}
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        className="me-2"
                        icon={faArrowUpFromBracket}
                      />
                      <span className="lato-bold fs-16">Enviar</span>
                    </>
                  )}
                </button>
              </article>
            </form>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalCoordenadas;
