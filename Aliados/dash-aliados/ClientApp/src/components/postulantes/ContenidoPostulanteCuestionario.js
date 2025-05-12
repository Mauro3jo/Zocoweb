import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/DarkModeContext";
import './ContenidoPostCues.css';

const TarjetaCuestionario = React.memo(({ dato, puestoNombre, darkMode, navigate }) => (
    <div style={{ marginTop: "2em" }}>
        <article className={darkMode ? "cartas-posiciones-cuestionario-dark text-center py-2 my-2" : "cartas-posiciones-cuestionario text-center py-2 my-2"}>
            <h6 className="mx-5 pt-5">{puestoNombre}</h6>
            <div className="mx-5 contenido-carta-puesto">
                <article>
                    <h6 className="py-2">Cuestionario de {dato.nombre}</h6>
                    <h6 className="lato-regular">El cuestionario posee un máximo de {dato.maxPreguntas}</h6>
                </article>
                <article>
                    <h6 className="lato-regular py-2">
                        A través de los siguientes test, evaluaremos tu potencial en diversos ámbitos
                    </h6>
                </article>
                <article>
                    {!dato.yaContestado ? (
                        <button
                            className="btn-publicar border-0 mx-1 text-center"
                            style={{
                                width: "145px",
                                height: "44px",
                                marginTop: "1em",
                                background: "#B4C400",
                                color: "#FFFFFF",
                                borderRadius: "32px",
                            }}
                            onClick={() =>
                                navigate("/postulante/respondercuestionario", {
                                    state: { cuestionario: dato },
                                })
                            }
                        >
                            Comenzar
                        </button>
                    ) : (
                        <>
                            <p className="text-muted mt-3">✔ Ya contestado</p>
                            {dato.nota != null && (
                                <p className="text-dark fw-bold">Nota: {dato.nota}</p>
                            )}
                        </>
                    )}
                </article>
            </div>
            <div className="d-flex justify-content-end me-5 mt-5"></div>
        </article>
    </div>
));

const ContenidoPostulanteCuestionario = ({ cuestionarios, puestos }) => {
    const { darkMode } = useContext(DarkModeContext);
    const navigate = useNavigate();

    return (
        <div className="container" style={{ height: '95vh', marginTop: "20vh", overflow: "none" }}>
            <h2 className="text-center my-4">Cuestionarios del Puesto</h2>
            <section className="d-flex flex-wrap justify-content-center" style={{ gap: "1rem" }}>
                {cuestionarios.map((dato, id) => (
                    <TarjetaCuestionario
                        key={id}
                        dato={dato}
                        puestoNombre={dato.puesto || puestos.find((p) => p.id === dato.idPuesto)?.nombre || "No disponible"}
                        darkMode={darkMode}
                        navigate={navigate}
                    />
                ))}
            </section>
        </div>
    );
};

export default React.memo(ContenidoPostulanteCuestionario);
