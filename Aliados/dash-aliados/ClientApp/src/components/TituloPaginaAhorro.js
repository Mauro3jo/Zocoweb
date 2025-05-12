import React, { useContext, useRef, useEffect, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import logozoco from "../assets/img/Logo-ZOCO-4.png";
import logopayway from "../assets/img/payway-texto.png";
import logomercadopago from "../assets/img/Logo-Mercado-Pago-4.png";
import logonx from "../assets/img/Logo-Naranja-X-4.png";
import logogetnet from "../assets/img/Logo-Getnet-4.png";
import logoviumi from "../assets/img/Logo-viuMi-(Con-espacio-abajo).png";
import logoNave from "../assets/img/Logo-Nave-(Con-espacio-abajo).png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";

const TituloPaginaAhorro = ({
    ahorroMercadoPago,
    ahorroPayway,
    ahorroNaranjaX,
    ahorroGetnet,
    ahorroViumi,
    netoZoco,
    ahorroNave,
}) => {
    const { darkMode } = useContext(DarkModeContext);

    const comparativas = [
        { logo: logopayway, ahorro: ahorroPayway, size: 40 },
        { logo: logomercadopago, ahorro: ahorroMercadoPago, size: 35 },
        { logo: logogetnet, ahorro: ahorroGetnet, size: 30 },
        { logo: logoNave, ahorro: ahorroNave, size: 60 },
        { logo: logonx, ahorro: ahorroNaranjaX, size: 30 },
        { logo: logoviumi, ahorro: ahorroViumi, size: 60 },
    ];

    const ahorroRefs = useRef([]);
    const [anchoAhorro, setAnchoAhorro] = useState([]);
    const [isPaused, setIsPaused] = useState(false); // Estado para pausar/reanudar la animación

    useEffect(() => {
        const nuevosAnchos = ahorroRefs.current.map(ref => ref?.offsetWidth || 0);
        setAnchoAhorro(nuevosAnchos);
    }, [ahorroMercadoPago, ahorroPayway, ahorroNaranjaX, ahorroGetnet, ahorroViumi, ahorroNave, netoZoco]);

    return (
        <section className="container my-4">
            <div
                className={`${darkMode ? "bg-titulo-pagina-dark" : "bg-titulo-pagina"} border-0`}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    position: "relative",
                    width: "100%",
                    height: "100px",
                    overflowX: "hidden",
                }}
            >
                <div
                    className="scroll-wrapper"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                    onTouchStart={() => setIsPaused(true)}
                    onTouchEnd={() => setIsPaused(false)}
                >
                    <div className={`scroll-content ${isPaused ? "paused" : ""}`}>
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="scroll-item">
                                {comparativas.map((item, idx) => (
                                    <div key={idx} className="comparativa">
                                        <span className="vertical-divider" style={{ userSelect: "none" }}></span>
                                        <img
                                            src={logozoco}
                                            alt="Zoco Logo"
                                            style={{ width: "70px", marginRight: "8px", userSelect: "none", pointerEvents: "none" }}
                                        />
                                        <span className="ahorro-zoco" style={{ userSelect: "none" }}>
                                            <FontAwesomeIcon icon={faArrowUp} className="icono-up" style={{ userSelect: "none" }} />
                                            <span className="valor-ahorro" ref={el => (ahorroRefs.current[idx] = el)} style={{ userSelect: "none" }}>
                                                {netoZoco}
                                            </span>
                                            <span className="recibis-text" style={{
                                                left: `calc(50% + ${anchoAhorro[idx] / 4}px)`,
                                                textAlign: "center",
                                                userSelect: "none"
                                            }}>
                                                (recibís)
                                            </span>
                                        </span>
                                        <span className="vs" style={{ userSelect: "none" }}>VS</span>
                                        <img
                                            src={item.logo}
                                            alt="Competitor Logo"
                                            style={{ width: `${item.size}px`, marginRight: "8px", userSelect: "none", pointerEvents: "none" }}
                                        />
                                        <span className="ahorro-competidor" style={{ userSelect: "none" }}>
                                            <FontAwesomeIcon icon={faArrowDown} className="icono-down" style={{ userSelect: "none" }} />
                                            <span className="valor-ahorro" ref={el => (ahorroRefs.current[idx + comparativas.length] = el)} style={{ userSelect: "none" }}>
                                                {item.ahorro}
                                            </span>
                                            <span className="recibis-text" style={{
                                                left: `calc(50% + ${anchoAhorro[idx + comparativas.length] / 4}px)`,
                                                textAlign: "center",
                                                userSelect: "none"
                                            }}>
                                                (recibís)
                                            </span>
                                        </span>

                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>
                {`
    .scroll-wrapper {
    overflow: hidden;
    height: 100%;
    position: relative;
    display: flex;
    width: 100%;
}

.ahorro-zoco,
.ahorro-competidor {
    display: flex;
    align-items: center; /* Mantiene el número alineado con la flecha */
    flex-direction: row; /* Mantiene el número al lado de la flecha */
    position: relative; /* Permite posicionar "recibís" sin afectar la alineación */

}

.recibis-text {
    font-size: 13px;
    font-weight: normal;
    color: gray;
    position: absolute;
    bottom: -12px;
    transform: translateX(-50%);
    white-space: nowrap;
    text-align: center;
}

.scroll-content {
    display: flex;
    width: max-content;
    animation: scroll-left 90s linear infinite;
    flex-wrap: nowrap;
}

.scroll-content.paused {
    animation-play-state: paused; /* Pausa la animación cuando la clase está presente */
}

.scroll-item {
    display: flex;
    align-items: center;
    white-space: nowrap;
    min-width: 100vw;
}

.comparativa {
    display: flex;
    align-items: center;
    white-space: nowrap;
    margin: 0 10px;
}

.vertical-divider {
    border-left: 1px solid gray;
    height: 50px;
    margin: 0 12px;
}

/* Espaciado entre logo, flecha y número */
.logo-zoco,
.logo-competidor {
    margin-right: 8px;
}

.icono-up,
.icono-down {
    margin-right: 5px;
}

.valor-ahorro {
    margin-left: 5px;
}

.ahorro-zoco,
.ahorro-competidor {
    font-size: 14px;
    display: flex;
    align-items: center;
    font-weight: bold;
}

.icono-up {
    color: #26b803;
    font-weight: bold;
}

.icono-down {
    color: red;
    font-weight: bold;
}

.vs {
    font-weight: bold;
    margin: 0 6px;
}

/* Animación del scroll */
@keyframes scroll-left {
    from {
        transform: translateX(0);
    }
    to {
        transform: translateX(-50%);
    }
}

/* Responsivo */
@media (max-width: 768px) {
    .logo-zoco {
        width: 60px;
    }

    .logo-competidor {
        width: 45px;
    }

    .ahorro-zoco,
    .ahorro-competidor {
        font-size: 12px;
    }

    .comparativa {
        margin: 0 8px;
    }

    .vertical-divider {
        height: 45px;
        margin: 0 10px;
    }

    .scroll-content {
        animation: scroll-left 110s linear infinite;
    }
}

@media (max-width: 480px) {
    .logo-zoco {
        width: 55px;
    }

    .logo-competidor {
        width: 40px;
    }

    .ahorro-zoco,
    .ahorro-competidor {
        font-size: 12px;
        font-weight: bold;
    }

    .icono-up,
    .icono-down {
        font-size: 18px;
        font-weight: bold;
    }

    .comparativa {
        margin: 0 8px;
    }

    .vertical-divider {
        height: 45px;
        margin: 0 8px;
    }

    .scroll-content {
        animation: scroll-left 130s linear infinite;
    }
}

    `}
            </style>
        </section>
    );
};

export default TituloPaginaAhorro;
