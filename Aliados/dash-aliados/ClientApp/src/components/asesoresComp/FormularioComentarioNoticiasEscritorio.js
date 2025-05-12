import { useState } from "react";

import "./FormularioComentarioNoticias.css";

import Select from "react-select";

const optionsAsesores = [
  { value: "Francisco Quiroga", label: "Francisco Quiroga" },
  { value: "Paula Aranda", label: "Paula Aranda" },
  { value: "Ezequiel Rodriguez", label: "Ezequiel Rodriguez" },
];

const optionsPrioridad = [
  { value: "Todos", label: "Todos" },
  { value: "Alta", label: "Alta" },
  { value: "Baja", label: "Baja" },
];

const FormComentarioNoticiasEscritorio = () => {
  const [datosCapturadosNoticias, setDatosCapturadosNoticias] = useState({});
  const [isSearchable, setIsSearchable] = useState(true);
  const [selectedComentario, setSelectedComentario] = useState(null);
  const [selectedPrioridad, setSelectedPrioridad] = useState(null);
  const [selectedAsesor, setSelectedAsesor] = useState(null);

  const handleEnviarDatos = () => {
    // Aquí puedes preparar los datos para enviar al backend
    const data = {
      comentario: selectedComentario,
      prioridad: selectedPrioridad?.value,
      asesor: selectedAsesor?.value,
    };
    setDatosCapturadosNoticias(data);
  };

  return (
    <section className="container">
      <div>
        <form className="pb-0 pb-lg-2">
          <article className="row">
            <div className="my-4 d-flex ">
              <div className="mx-2 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="lato-bold fs-16 ms-3"
                >
                  Para:
                </label>
                <Select
                  value={selectedAsesor}
                  defaultInputValue={"(Todos)"}
                  className="select__control_custom lato-bold"
                  classNamePrefix="select"
                  isSearchable={isSearchable}
                  name="asesores"
                  options={optionsAsesores}
                  onChange={(selectedOption) =>
                    setSelectedAsesor(selectedOption)
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      textAlign: "center",
                    }),
                  }}
                />
              </div>
              <div className="mx-2 ">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="lato-bold fs-16 ms-3"
                >
                  Prioridad
                </label>
                <Select
                  value={selectedPrioridad}
                  defaultInputValue={"(Todos)"}
                  className="select__control_custom lato-bold"
                  classNamePrefix="select"
                  isSearchable={isSearchable}
                  name="prioridad"
                  options={optionsPrioridad}
                  onChange={(selectedOption) =>
                    setSelectedPrioridad(selectedOption)
                  }
                  styles={{
                    control: (base) => ({
                      ...base,
                      textAlign: "center",
                    }),
                  }}
                />
              </div>
            </div>
          </article>
          <div className="mb-3">
            <textarea
              className="form-control input-comentarios-calificar  px-5 py-4"
              placeholder="Ingresá tu texto aquí."
              value={selectedComentario}
              onChange={(e) => setSelectedComentario(e.target.value)}
              required
            />
          </div>
          <div className="d-flex my-4 justify-content-end ">
            <button
              className="btn-enviar-publicar"
              type="button"
              onClick={handleEnviarDatos}
            >
              <span className="lato-bold fs-18 text-white ">Publicar</span>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default FormComentarioNoticiasEscritorio;
