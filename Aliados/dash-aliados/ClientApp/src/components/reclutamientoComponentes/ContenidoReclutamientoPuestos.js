import { Button } from "react-bootstrap";
import { DarkModeContext } from "../../context/DarkModeContext";
import CartasPuestos from "./CartasPuestos";
import "./ContenidoReclutamientoPuestos.css";
import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import ModalCargarNuevoPuesto from "./ModalCargarNuevoPuesto";
import { useForm } from "react-hook-form";
// import librerias
import Swal from "sweetalert2";

// assets logo de carpeta img
import logo from "../../assets/img/logo.png";

const ContenidoReclutamientoPuestos = () => {
  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  const [datosParaEnviar, setDatosParaEnviar] = useState({});

  const { reset } = useForm();
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
      const response = await fetch("/api/puesto/Crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Respuesta exitosa
        Swal.fire({
          title: "Puesto cargado con éxito!",
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
        cargarPuestos()
        reset(); // Limpia el formulario
      } else {
        // Error en la respuesta
        console.error("Error al enviar los datos:", response.statusText);
      }
    } catch (error) {
      // Error en el envío
      console.error("Error al intentar enviar los datos a la API:", error);
    }
    setIsSubmitting(false);
    reset(); // Limpia el formulario
    setModalShowCompleta(false);
  };

  const [puestos, setPuestos] = useState([]); 

  // Función para cargar puestos inicialmente o actualizarlos
  const cargarPuestos = async () => {
    try {
      const respuesta = await fetch("/api/puesto/Listar");
      if (respuesta.ok) {
        const data = await respuesta.json();
          setPuestos(data); 
      }
    } catch (error) {
      console.error("Error al cargar puestos:", error);
    }
  };

  // Cargar puestos al montar el componente
  useEffect(() => {
    cargarPuestos();
  }, []);

  return (
    <div className="container">
      <section className="d-flex justify-content-end">
        <div className="my-2 mx-3">
          <div className="centrado my-3">
            <Button
              className={
                darkMode
                  ? " btn-nuevo-cargar-puesto-dark  centrado border-0"
                  : " btn-nuevo-cargar-puesto centrado  border-0"
              }
              onClick={() => setModalShowCompleta(true)}
            >
              <FontAwesomeIcon size="xl" icon={faPlusCircle} />
              <span className="ms-2 lato-bold fs-18">Nuevo</span>
            </Button>
            <ModalCargarNuevoPuesto
              isSubmitting={isSubmitting}
              show={modalShowCompleta}
              onHide={() => setModalShowCompleta(false)}
              customOnSubmit={customOnSubmit}
            />
          </div>
        </div>
      </section>
      <CartasPuestos puestos={puestos}  />
    </div>
  );
};

export default ContenidoReclutamientoPuestos;
