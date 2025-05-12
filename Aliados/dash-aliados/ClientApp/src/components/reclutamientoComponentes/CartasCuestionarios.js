import { faCopy, faDownload, faPen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useContext, useEffect, useRef, useState } from "react";
import ModalEditarNuevoPuesto from "./ModalEditarNuevoPuesto";
import { DarkModeContext } from "../../context/DarkModeContext";
import ModalAgregarPreguntas from "./ModalAgregarPreguntas";
import ModalEditarPreguntas from "./ModalEditarPreguntas";


const CartasCuestionarios = ({cuetionarios,puestos} ) => {
  // context para el modo oscuro
  const { darkMode } = useContext(DarkModeContext);

  // Ref para acceder al contenedor del texto que queremos copiar
  const textoRef = useRef(null);
  const [modalPreguntasShow, setModalPreguntasShow] = useState(false);
  const [cuestionarioActual, setCuestionarioActual] = useState(null);
  const [modalEditarPreguntasShow,setModalEditarPreguntasShow]=useState(false)
  
  const abrirModalPreguntas = (dato) => {
    setCuestionarioActual(dato);
    setModalPreguntasShow(true);
  };
  const abrirModalEditarPreguntas = (dato) => {
    setCuestionarioActual(dato);
    setModalEditarPreguntasShow(true);
  };
  // Función para copiar el texto
  const copiarAlPortapapeles = (textoParaCopiar) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textoParaCopiar).then(
        () => {
          alert("Texto copiado al portapapeles");
        },
        (err) => {
          console.error("Error al copiar el texto: ", err);
        }
      );
    } else {
      console.error("La función de copiado no es soportada en este navegador.");
    }
  };

  // estado para controlar la apertura y cierre del modal
  const [modalShowCompleta, setModalShowCompleta] = React.useState(false);

  // estado para guardar la lista de la carga de busqueda
  const [cartas, setCartas] = useState([]);
  const [cartaActual, setCartaActual] = useState(null); 

  // consulta para listar
  const busquedaListar = "/api/cuestionarios/obtenercuestionarios";

  // Método para obtener la lista actualizada de búsquedas
  const actualizarListaCartas = async () => {
    try {
      const response = await fetch(busquedaListar);
      const data = await response.json();
      setCartas(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarListaCartas();
  }, []); // Dependencias vacías para ejecutar solo al montar el componente

  const descargarImagenBase64 = (base64, nombreArchivo = "descarga.png") => {
    // Convertir base64 a un objeto Blob
    const partes = base64.split(";base64,");
    const tipoMime = partes[0].split(":")[1];
    const binStr = atob(partes[1]);
    let length = binStr.length;
    const arr = new Uint8Array(length);

    while (length--) {
      arr[length] = binStr.charCodeAt(length);
    }

    const blob = new Blob([arr], { type: tipoMime });

    // Crear un enlace para la descarga
    const enlace = document.createElement("a");
    enlace.href = window.URL.createObjectURL(blob);
    enlace.download = nombreArchivo;

    // Simular un clic en el enlace para iniciar la descarga
    document.body.appendChild(enlace);
    enlace.click();

    // Limpiar
    document.body.removeChild(enlace);
    window.URL.revokeObjectURL(enlace.href);
  };

  // Nuevo manejador para mostrar el modal y establecer la carta actual
  const mostrarModalEditar = (dato) => {
    setCartaActual(dato); 
    setModalShowCompleta(true); 
  };

  // Método para obtener la lista actualizada de búsquedas
  const actualizarListaBusquedas = async () => {
    try {
      const response = await fetch(busquedaListar);
      const data = await response.json();
      setCartas(data);
    } catch (error) {
      console.error("Error al cargar la lista de búsquedas:", error);
    }
  };

  useEffect(() => {
    actualizarListaBusquedas();
  }, []); 
  

  return (
    <div>
      <section className="d-flex justify-content-between flex-wrap ">
        {cuetionarios.map((dato, id) => (
          <div key={id}>
            <article
              className={
                darkMode
                  ? "cartas-posiciones-dark py-2 my-2"
                  : "cartas-posiciones py-2 my-2"
              }
              ref={textoRef}
            >
              <h6 className="mx-5 pt-5 ">
                {" "}
                #{dato.id} - {dato.nombre}
              </h6>
              <div className="mx-5  contenido-carta">
                <article>
                  <h6 className="py-2">📄 Puesto</h6>
                  <h6>    {puestos.find((p) => p.id === dato.idPuesto)?.nombre || "No disponible"}
                  </h6>
                </article>
                <article>
                  <h6 className="py-2">📝 Preguntas</h6>
                  <h6>{dato.maxPreguntas}</h6>
                </article>
                <article className="row">
                    <div className="col-6">
                    <button
  className="btn-publicar border-0 mx-1 text-center"
  style={{
    width: "145px",
    height: "44px",
    background: "#B4C400",
    color: "#FFFFFF",
    borderRadius: "32px",
  }}
  onClick={() => abrirModalPreguntas(dato)}
>
  Agregar preguntas
</button>
                    </div>
                    <div className="col-6">
                    <button
  className="btn-publicar border-0 mx-1 text-center"
  style={{
    width: "145px",
    height: "44px",
    background: "#B4C400",
    color: "#FFFFFF",
    borderRadius: "32px",
  }}
  onClick={() => abrirModalEditarPreguntas(dato)}
>
  Editar preguntas
</button>
                    </div>
               
                </article>
                
              </div>
              <div className="d-flex justify-content-end me-5 mt-5">
                <div className="mx-2">
                  <FontAwesomeIcon
                    // onClick={() => mostrarModalEditar(dato)}
                    size="2xl"
                    title="Editar"
                    icon={faPen}
                    style={{ color: "#b4c400", cursor: "pointer" }}
                  />
                </div>

                {/* <div className="mx-2">
                  <FontAwesomeIcon
                    onClick={() =>
                      descargarImagenBase64(
                        `data:image/png;base64,${dato.foto}`,
                        `Imagen-${dato.id}.png`
                      )
                    }
                    size="2xl"
                    icon={faDownload}
                    title="Descargar Imagen"
                    style={{ color: "#b4c400", cursor: "pointer" }}
                  />
                </div>
                <div className="mx-2">
                  <FontAwesomeIcon
                    onClick={() =>
                      copiarAlPortapapeles(
                        `#${dato.id} - ${dato.nombre}\n${dato.requisitos}\n${dato.principalesTareas}\n${dato.ofrecemos}`
                      )
                    }
                    size="2xl"
                    icon={faCopy}
                    title="Copiar Texto"
                    style={{ color: "#b4c400", cursor: "pointer" }}
                  />
                </div> */}
              </div>
            </article>
          </div>
        ))}
        {cuestionarioActual && (
  <ModalAgregarPreguntas
    show={modalPreguntasShow}
    onHide={() => setModalPreguntasShow(false)}
    cuestionario={cuestionarioActual}
  />
)}
        
        {cuestionarioActual && (
  <ModalEditarPreguntas
    show={modalEditarPreguntasShow}
    onHide={() => setModalEditarPreguntasShow(false)}
    cuestionario={cuestionarioActual}
  />
)}
      </section>
    </div>
  );
};

export default CartasCuestionarios;
