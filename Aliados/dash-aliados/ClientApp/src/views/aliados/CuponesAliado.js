import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import { DarkModeContext } from "../../context/DarkModeContext";
import ContenidoCuponesAliados from "../../components/ContenidoCuponesAliados";

const CuponesAliado = () => {
    // Estado para los campos del formulario
    const [formData, setFormData] = useState({
        fecha: "",
        bruto: "",
        ultimos4digitos: "",
        tarjeta: "",
        cuotas: "",
    });

    // Estado para la carga
    const [loading, setLoading] = useState(false);

    // Contexto para el modo oscuro
    const { darkMode } = useContext(DarkModeContext);

    // URL de la API
    const apiUrl = "/api/cuponesaliado/cuponesaliado";

    // Función para manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Función para enviar la consulta
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            Swal.fire({
                title: "Error",
                text: "No se encontró un token válido. Inicie sesión nuevamente.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    ...formData,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Respuesta de la API:", data);

                Swal.fire({
                    title: "Consulta Exitosa",
                    text: "Los datos han sido obtenidos correctamente.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                console.error("Error en la API:", response.status);
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los datos.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            Swal.fire({
                title: "Error",
                text: "Ocurrió un problema con la consulta.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }

        setLoading(false);
    };

    return (
        <div className="container mt-4">
            <ContenidoCuponesAliados/>
        </div>
    );
};

export default CuponesAliado;
