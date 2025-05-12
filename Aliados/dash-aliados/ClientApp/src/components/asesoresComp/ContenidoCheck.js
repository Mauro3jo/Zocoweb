// import hoja de estilos (css)
import "./ContenidoCheck.css";

// import hooks
import React, { useContext, useState } from "react";

// import context
import { DarkModeContext } from "../../context/DarkModeContext";

// import libreria
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpFromBracket } from "@fortawesome/free-solid-svg-icons";
import { Button } from "react-bootstrap";

// import component
import ModalCoordenadas from "./ModalCoordenadas";

const ContenidoCheck = ({

  isCheckedActive,
  estadoCheck,
}) => {
  // variable para guardar en el localStorage el estado IsActive
  const chequeado = localStorage.getItem("isActive") === "true";

  // estado para para utilizar la variable guardada previamente
  const [isCheckedIn, setIsCheckedIn] = useState(chequeado);

  // estado para guardar las coordenadas
  const [records, setRecords] = useState([]);

  // Inicializar isActive basándose en el valor almacenado en localStorage, o en estadoCheck si no hay nada en localStorage
  const [isActive, setIsActive] = useState(() => {
    const storedIsActive = localStorage.getItem("isActive");
    return storedIsActive !== null ? storedIsActive === "true" : estadoCheck;
  });

  // darkMode context para la funcionalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // Actualiza isActive y almacena el nuevo valor en localStorage
  const toggleIsActive = () => {
    const newValue = !isActive;
    setIsActive(newValue);
    localStorage.setItem("isActive", newValue.toString());
  };

  // consulta para enviar la geo
  const sendLocationToServer = async (newRecord) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("Token no encontrado");
      return;
    }
    const url = "/api/geo/check";
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRecord),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      isCheckedActive();
    } catch (error) {
      console.error("Error al enviar la ubicación:", error);
    }
  };

  // funcion para tomar los datos enviado por el asesor
  const handleCheck = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
              const timeZone = "America/Argentina/Buenos_Aires";
              const now = new Date();
              const formatter = new Intl.DateTimeFormat("es-AR", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: timeZone,
                  hourCycle: 'h23' // Esto asegura el formato de 24 horas
              });
              const formattedDate = formatter.format(now);



          const newRecord = {
            Token: sessionStorage.getItem("token"),
            Latitud: position.coords.latitude.toString(),
            Longitud: position.coords.longitude.toString(),
            FechaHora: formattedDate,
            Tipo: isCheckedIn === false ? "checkIn" : " checkOut",
          };
          setRecords((prevRecords) => [...prevRecords, newRecord]);
          sendLocationToServer(newRecord);
          setIsCheckedIn(!isCheckedIn);
          toggleIsActive(); // Usar toggleIsActive para cambiar el estado y actualizar localStorage
        },
        (error) => {
          console.error("Error al obtener la geolocalización:", error);
        }
      );
    }
  };

  // estado para seleccionar file de los archivos
  const [selectedFile, setSelectedFile] = useState(null);

  // funcion para controlar los archivos
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };
  // funcion para enviar los datos
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  const [modalShowCompleta, setModalShowCompleta] = useState(false);

  return (
    <div className="container">
      <section className="d-flex justify-content-center">
        <div
          className={
            darkMode
              ? "bg-check-dark d-flex justify-content-center align-items-center"
              : "bg-check d-flex justify-content-center align-items-center"
          }
        >
          <div>
            {isActive && (
              <article>
                <article>
                  <div>
                    <h6 className="lato-regular fs-16 text-center">
                      Para cargar tus archivos o lo referente a la comanda, por
                      favor <br /> presiona el boton <b>"subir archivos"</b>
                    </h6>
                  </div>
                </article>
                <div className="centrado my-3 pb-5">
                  <Button
                    className={
                      darkMode
                        ? "d-flex btn-check-modal-dark  centrado border-0"
                        : "d-flex btn-check-modal centrado  border-0"
                    }
                    onClick={() => setModalShowCompleta(true)}
                  >
                    <FontAwesomeIcon
                      className="mx-2"
                      icon={faArrowUpFromBracket}
                    />
                    <span className="ms-2  lato-bold fs-16">
                      Subir archivos
                    </span>
                  </Button>
                  <ModalCoordenadas
                    show={modalShowCompleta}
                    onHide={() => setModalShowCompleta(false)}
                  
                  />
                </div>
              </article>
            )}
            <h6 className="fs-16 lato-regular text-center">
              {isActive ? (
                <>
                  Cuando terminés tu horario laboral,
                  <br /> tocá en
                  <b>'Terminar jornada'. </b> <br />
                  Con esto quedara registrado tu horario de salida.
                  <div className="text-center">
                    <button
                      onClick={handleCheck}
                      disabled={isActive ? false : true}
                      className={
                        isActive
                          ? "btn-terminar-dia border-0 mt-2"
                          : "btn-empezar-dia border-0 mt-2"
                      }
                    >
                      <span className="text-white border-0 text-decoration-none lato-bold fs-16">
                        {isActive ? " Terminar jornada" : " Empezar jornada"}
                      </span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {" "}
                  En cuanto te encuentres en la dirección indicada o recibida la
                  comanda de tarea <br /> por favor tocá en 'Empezar jornada'.{" "}
                  <br />
                  Esto habilitara una nueva ventana, donde puedes cargar tus
                  archivos.
                  <div className="text-center">
                    <button
                      onClick={handleCheck}
                      disabled={isActive ? true : false}
                      className={
                        isActive
                          ? "btn-terminar-dia border-0 mt-2"
                          : "btn-empezar-dia border-0 mt-2"
                      }
                    >
                      <span className="text-white border-0 text-decoration-none lato-bold fs-16">
                        {isActive ? " Terminar jornada" : " Empezar jornada"}
                      </span>
                    </button>
                  </div>
                </>
              )}
            </h6>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContenidoCheck;
