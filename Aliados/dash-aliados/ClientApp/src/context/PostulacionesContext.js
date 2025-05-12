// ✅ CONTEXTO ACTUALIZADO
import React, { createContext, useState, useEffect } from 'react';

export const PostulacionesContext = createContext();

export const PostulacionesProvider = ({ children }) => {
    const [tokenValido, setTokenValido] = useState(false);
    const [puestosDisponibles, setPuestosDisponibles] = useState([]);
    const [cuestionariosPorPuesto, setCuestionariosPorPuesto] = useState([]);

    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const apiUrlPuestos = process.env.REACT_APP_API_PUESTOS;
    const apiUrlPostulantePuesto = process.env.REACT_APP_API_POSTULARSEPUESTO;
    const apiUrlCuestionarios = "/api/cuestionario/obtenercuestionariosporpuestoid";

    // Verificar token
    const verificarToken = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            setTokenValido(false);
            return;
        }

        try {
            const response = await fetch(apiUrlToken, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Token: token }),
            });

            const data = await response.json();
            setTokenValido(data === 9); // ✅ Token válido si es igual a 9
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setTokenValido(false);
        }
    };

    // Obtener puestos disponibles
    const cargarPuestos = async () => {
        try {
            const token = sessionStorage.getItem("token");
            const respuesta = await fetch(apiUrlPuestos, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Token: token }),
            });

            if (respuesta.ok) {
                const data = await respuesta.json();
                setPuestosDisponibles(data);
            } else {
                console.error("Error al obtener puestos disponibles");
                setPuestosDisponibles([]);
            }
        } catch (error) {
            console.error("Error al cargar puestos:", error);
        }
    };

    // Postularse a un puesto
    const postularse = async (idPuesto) => {
        try {
            const token = sessionStorage.getItem("token");
            const respuesta = await fetch(apiUrlPostulantePuesto, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ Token: token, IdPuesto: idPuesto }),
            });

            if (respuesta.ok) {
                alert("Postulación exitosa");

                setPuestosDisponibles(prev =>
                    prev.map(p => p.id === idPuesto ? { ...p, haPostulado: true } : p)
                );
            } else {
                alert("Error en la postulación");
            }
        } catch (error) {
            console.error("Error al postularse:", error);
        }
    };

    // Obtener cuestionarios por puesto
    const obtenerCuestionarios = async (idPuesto) => {
        try {
            const token = sessionStorage.getItem("token");
            const response = await fetch(apiUrlCuestionarios, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ IdPuesto: idPuesto, Token: token }),
            });

            if (!response.ok) throw new Error("Error al obtener cuestionarios");

            const data = await response.json();
            setCuestionariosPorPuesto(data);
        } catch (error) {
            console.error("Error obteniendo cuestionarios:", error);
        }
    };

    useEffect(() => {
        verificarToken();
        cargarPuestos();
    }, []);

    return (
        <PostulacionesContext.Provider value={{
            tokenValido,
            puestosDisponibles,
            postularse,
            obtenerCuestionarios,
            cuestionariosPorPuesto,
        }}>
            {children}
        </PostulacionesContext.Provider>
    );
};
