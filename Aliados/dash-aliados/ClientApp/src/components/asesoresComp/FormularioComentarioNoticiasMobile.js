import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import Select from "react-select";

import "./FormularioComentarioNoticias.css";
import { DarkModeContext } from "../../context/DarkModeContext";

const optionsAsesores = [
  { value: "Todos", label: "Todos" },
  { value: "asesor 1", label: "asesor 1" },
  { value: "asesor 2", label: "asesor 2" },
  { value: "asesor 3", label: "asesor 3" },
  { value: "asesor 4", label: "asesor 4" },
  { value: "asesor 5", label: "asesor 5" },
  { value: "asesor 6", label: "asesor 6" },
];

const optionsProvincias = [
  { value: "Todos", label: "Todos" },
  { value: "provincia 1", label: "provincia 1" },
  { value: "provincia 2", label: "provincia 2" },
  { value: "provincia 3", label: "provincia 3" },
  { value: "provincia 4", label: "provincia 4" },
  { value: "provincia 5", label: "provincia 5" },
  { value: "provincia 6", label: "provincia 6" },
];

const FormularioComentarioNoticiasMobile = () => {
  const [datosCapturadosNoticias, setDatosCapturadosNoticias] = useState({});
  const [datoCapturadosFilter, setDatoCapturadosFilter] = useState({});

  // AQUI GUARDO LOS DATOS PARA ENVIARLO AL BACK
  const datosParaEnviarAlBackend = {
    datosCapturadosNoticias,
    datoCapturadosFilter,
  };

  const { register, handleSubmit } = useForm();
  const onSubmit = (datos) => {
    setDatosCapturadosNoticias(datos);
  };

  const [visibleModal, setVisibleModal] = useState(false);
  const verModalFilter = () => {
    setVisibleModal(!visibleModal);
  };

  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedAsesores, setSelectedAsesores] = useState(null);
  const [selectedProvincias, setSelectedProvincias] = useState(null);

  const handleEnviarDatos = () => {
    const data = {
      asesor: selectedAsesores?.value,
      provincia: selectedProvincias?.value,
    };
    setDatoCapturadosFilter(data);
    verModalFilter();
  };

  const { darkMode } = useContext(DarkModeContext);
  return (
    <div className="container">
      <form className="pb-0 pb-lg-5" onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <div className="d-sm-none d-block">
            <label
              htmlFor="exampleFormControlInput1"
              className="lato-bold fs-16 ms-3 py-2"
            >
              Mensaje:
            </label>
          </div>
          <div className="d-none d-sm-block">
            <label
              htmlFor="exampleFormControlInput1"
              className="lato-bold fs-16 ms-3 py-2"
            >
              Mensaje:
            </label>
          </div>
          <textarea
            className="form-control input-comentarios-calificar-celular  px-5 py-4"
            placeholder="Ingresá tu texto aquí."
            {...register("comentario")}
          />
        </div>
        <div className="my-4">
          <button
            className="border-0 panel-control-select-noticias-mobile  lato-bold fs-16"
            onClick={verModalFilter}
          >
            Elegir destinatario y prioridad
          </button>
        </div>
        {visibleModal && (
          <div className="modalShadowFilter centrado-flex">
            <div className="centrado ">
              <div
                className={
                  darkMode
                    ? "modalbox-dark"
                    : "modalbox-filter-asesores-provincia "
                }
              >
                <button className="border-0 close" onClick={verModalFilter}>
                  x
                </button>

                <h2 className="text-center mt-4 pb-2 lato-bold fs-16 ">
                  Filtros
                </h2>
                <div>
                  <article className="py-2 ">
                    <div>
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="lato-bold fs-16 "
                      >
                        Asesores
                      </label>
                    </div>

                    <Select
                      value={selectedAsesores}
                      defaultInputValue="(Todos)"
                      className="d-flex justify-content-center"
                      classNamePrefix="select"
                      isSearchable={isSearchable}
                      name="asesores"
                      options={optionsAsesores}
                      onChange={(selectedOption) =>
                        setSelectedAsesores(selectedOption)
                      }
                    />
                  </article>
                  <article className="py-2 ">
                    <div>
                      <label
                        htmlFor="exampleFormControlInput1"
                        className="lato-bold fs-16"
                      >
                        Provincia
                      </label>
                    </div>
                    <Select
                      value={selectedProvincias}
                      defaultInputValue="(Todos)"
                      className="d-flex justify-content-center"
                      classNamePrefix="select"
                      isSearchable={isSearchable}
                      name="asesores"
                      options={optionsProvincias}
                      onChange={(selectedOption) =>
                        setSelectedProvincias(selectedOption)
                      }
                    />
                  </article>
                  <div className="my-4 ">
                    <button
                      className="cursor-point btn-enviar-filtros border-0 lato-bold fs-16 text-white"
                      type="button"
                      onClick={handleEnviarDatos}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <article className="">
          <div className="d-flex justify-content-center my-4 ">
            <button className="btn-enviar-publicar-celular" type="submit">
              <span className="lato-bold fs-18 text-white ">Publicar</span>
            </button>
          </div>
        </article>
      </form>
    </div>
  );
};

export default FormularioComentarioNoticiasMobile;
