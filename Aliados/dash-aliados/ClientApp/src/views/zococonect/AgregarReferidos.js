import React, { useState, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";

const AgregarReferidos = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [formData, setFormData] = useState({
        IdZocoConect: "",
        IdUser: "",
        NroTerminal:"",
        FechaAlta: "",
        FechaBaja: ""
    });
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            setMessage("Token no disponible. Inicia sesión nuevamente.");
            return;
        }

        try {
            const response = await fetch("/api/zococonect/agregarreferidos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ ...formData, token }),
            });

            if (response.ok) {
                setMessage("Referido agregado exitosamente.");
            } else {
                const errorData = await response.json();
                setMessage(errorData.message || "Error al agregar referido.");
            }
        } catch (error) {
            setMessage("Hubo un problema al conectar con el servidor.");
        }
    };

    return (
        <section
            className={darkMode ? "container cuadro-calificaciones-dark" : "container cuadro-calificaciones"}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                width: "100%"
            }}
        >
            <form onSubmit={handleSubmit} style={{
                width: "100%",
                maxWidth: "700px",
                padding: "20px",
                borderRadius: "10px",
            }}>
                <h1 className={darkMode ? "text-white" : "text-dark"} style={{ marginBottom: "20px" }}>Agregar Referido</h1>

                <input
                    type="number"
                    name="IdZocoConect"
                    placeholder="ID Zoco Connect"
                    value={formData.IdZocoConect}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "50px",
                        border: "2px solid #D0D7E2",
                        marginBottom: "10px",
                    }}
                />

                <input
                    type="number"
                    name="IdUser"
                    placeholder="ID Usuario"
                    value={formData.IdUser}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "50px",
                        border: "2px solid #D0D7E2",
                        marginBottom: "10px",
                    }}
                />
                <input
                    type="number"
                    name="NroTerminal"
                    placeholder="N° de Terminal"
                    value={formData.NroTerminal}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "50px",
                        border: "2px solid #D0D7E2",
                        marginBottom: "10px",
                    }}
                />

                <input
                    type="date"
                    name="FechaAlta"
                    placeholder="Fecha Alta"
                    value={formData.FechaAlta}
                    onChange={handleChange}
                    required
                    style={{
                        width: "100%",
                        padding: "10px",
                        fontSize: "1rem",
                        borderRadius: "50px",
                        border: "2px solid #D0D7E2",
                        marginBottom: "10px",
                    }}
                />

                {/*<input*/}
                {/*    type="date"*/}
                {/*    name="FechaBaja"*/}
                {/*    placeholder="Fecha Baja"*/}
                {/*    value={formData.FechaBaja}*/}
                {/*    onChange={handleChange}*/}
                {/*    style={{*/}
                {/*        width: "100%",*/}
                {/*        padding: "10px",*/}
                {/*        fontSize: "1rem",*/}
                {/*        borderRadius: "50px",*/}
                {/*        border: "2px solid #D0D7E2",*/}
                {/*        marginBottom: "10px",*/}
                {/*    }}*/}
                {/*/>*/}

                <button
                    type="submit"
                    className="btn lato-bold"
                    style={{
                        borderRadius: "23px",
                        width: "182px",
                        height: "44px",
                        background: "#B4C400",
                        color: "#FFFFFF",
                        fontSize: "1rem",
                        marginTop: "10px",
                        cursor: "pointer"
                    }}
                >
                    Agregar Referido
                </button>
            </form>
            {message && (
                <p className={darkMode ? "text-white" : "text-dark"} style={{ marginTop: "10px" }}>
                    {message}
                </p>
            )}
        </section>
    );
};

export default AgregarReferidos;
