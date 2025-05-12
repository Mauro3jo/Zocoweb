import { useForm } from "react-hook-form";
import pdf from "../assets/img/pdf.png";
import xls from "../assets/img/xls.png";
import { useContext, useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import pdfPrueba from "../doc/prueba.pdf";
import { DarkModeContext } from "../context/DarkModeContext";

const Buscador = () => {
  const [datosBuscador, setDatosBuscador] = useState({});
  const { register, handleSubmit, reset } = useForm();

  const onSubmit = (datos) => {
    setDatosBuscador(datos);
    reset();
    };
    const BotonDescargarExcel = () => {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        const fechaActual = new Date();
        const año = fechaActual.getFullYear();
        const mes = fechaActual.getMonth() + 1; 

        const manejarClicDescarga = async () => {
            try {
                const respuesta = await fetch('/api/excel/excel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        Id: userId,
                        Year: año,
                        Month: mes,
                        comercio: 'todos'
                    })
                });

                if (!respuesta.ok) {
                    throw new Error('La respuesta de la red no fue correcta');
                }

              
                const blob = await respuesta.blob();
                const urlDescarga = window.URL.createObjectURL(blob);
                const enlace = document.createElement('a');
                enlace.href = urlDescarga;
                enlace.setAttribute('download', 'datos.xlsx');
                document.body.appendChild(enlace);
                enlace.click();
                enlace.parentNode.removeChild(enlace);
            } catch (error) {
                console.error('Hubo un error:', error);
            }
        };

        return (
            <button onClick={manejarClicDescarga}>
                Descargar Excel
            </button>
        );
    };

    export default BotonDescargarExcel;

  const { darkMode } = useContext(DarkModeContext);
  return (
    <section className="container mt-3 mb-3 ">
      <div className="d-flex flex-wrap justify-content-between ">
        <div className="margin-centrado-responsive">
          <div className="my-3">
            <form className="d-flex" onSubmit={handleSubmit(onSubmit)}>
              <h6 className="my-3 me-2 lato-regular fs-18">Buscar:</h6>
              <input
                className={
                  darkMode
                    ? " form-control text-white label-buscador-dark lato-regular fs-18 border-0"
                    : "form-control label-buscador lato-regular fs-18 border-0"
                }
                type="search"
                aria-label="Search"
                {...register("datosBuscados")}
              />
              <button className="btn  btn-search ms-2" type="submit">
                <FontAwesomeIcon
                  className="text-white"
                  icon={faMagnifyingGlass}
                />
              </button>
            </form>
          </div>
        </div>
        <div className="d-flex centrado-responsive">
          <div className="btn-pdf-descargar centrado border-0 mx-2">
            <a
              className="text-decoration-none centrado-flex"
              href={pdfPrueba}
              download="Reporte Pdf Prueba"
            >
              <div className="my-3">
                <div>
                  <div className="text-center">
                    <img
                      className="img-fluid icono-pdf-xls mb-1"
                      src={pdf}
                      alt="pdf"
                    />
                  </div>
                </div>
                <div>
                  <div className="d-flex justify-content-center align-items-center">
                    <h6 className="text-white lato-bold fs-16">Descargar</h6>
                  </div>
                </div>
              </div>
            </a>
          </div>
                  <div className="btn-pdf-descargar centrado border-0 mx-2">
                      <button
                          className="text-decoration-none centrado-flex"
                          onClick={handleDownloadExcel} 
                      >
                          <div className="my-3">
                              <div>
                                  <div className="text-center">
                                      <img
                                          className="img-fluid icono-pdf-xls mb-1"
                                          src={xls}
                                          alt="Excel"
                                      />
                                  </div>
                              </div>
                              <div>
                                  <div className="d-flex justify-content-center align-items-center">
                                      <h6 className="text-white lato-bold fs-16">Descargar Excel</h6>
                                  </div>
                              </div>
                          </div>
                      </button>
                  </div>

        </div>
      </div>
    </section>
  );
};

export default Buscador;
