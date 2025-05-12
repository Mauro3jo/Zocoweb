import React, { useState, useContext } from 'react';
import { DarkModeContext } from "../../context/DarkModeContext";

const RegistrarZocoConectAliado = () => {
    const { darkMode } = useContext(DarkModeContext);
    const [formData, setFormData] = useState({
        cbu: '',
        alias: '',
        banco: '',
        claveZocoConect: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem('token');

        if (!token) {
            alert("Token no disponible. Por favor, inicia sesión.");
            return;
        }

        const payload = {
            Cbu: formData.cbu,
            Alias: formData.alias,
            Banco: formData.banco,
            ClaveZocoConect: formData.claveZocoConect,
            token: token
        };

        try {
            const response = await fetch("/api/zococonect/registrarzococonectaliado", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                alert("Registro exitoso");
                setFormData({ cbu: '', alias: '', banco: '', claveZocoConect: '' });
            } else {
                alert("Error en el registro: " + response.statusText);
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            alert("Ocurrió un error al enviar la solicitud.");
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
                <h1 className={darkMode ? "text-white" : "text-dark"} style={{ marginBottom: "20px" }}>Registrar Zoco Conect Aliado</h1>

                {[
                    { label: "CBU:", name: "cbu", type: "text" },
                    { label: "Alias:", name: "alias", type: "text" },
                    { label: "Banco:", name: "banco", type: "text" },
                    { label: "Clave Zoco Conect:", name: "claveZocoConect", type: "password" }
                ].map((field, index) => (
                    <div key={index} className="form-group">
                        <label
                            htmlFor={field.name}
                            className={darkMode ? "text-white lato-regular fs-16 py-3" : "text-dark lato-regular fs-16 py-3"}
                        >
                            {field.label}
                        </label>
                        <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
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
                    </div>
                ))}

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
                    Registrar
                </button>
            </form>
        </section>
    );
};

export default RegistrarZocoConectAliado;
