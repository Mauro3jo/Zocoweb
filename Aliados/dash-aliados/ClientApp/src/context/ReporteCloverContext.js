import React, { createContext, useState, useEffect } from 'react';

export const ReporteCloverContext = createContext();

export const ReporteCloverProvider = ({ children }) => {
    const [datosResumenDiario, setDatosResumenDiario] = useState(null);
    const [datosResumenMensual, setDatosResumenMensual] = useState(null); // Nuevo estado para el resumen mensual
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [tokenValido, setTokenValido] = useState(false);

    const apiUrlResumenDiario = "/api/clover/obtenerresumendiario";
    const apiUrlResumenMensual = "/api/clover/obtenerresumenmensual"; // Nueva API para resumen mensual
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

    const formatFecha = (fecha) => {
        return fecha ? fecha.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '';
    };

    const verificarToken = async () => {
        const token = sessionStorage.getItem('token');
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
            setTokenValido(data === 5);
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setTokenValido(false);
        }
    };

    const fetchDatosResumenDiario = async () => {
        const token = sessionStorage.getItem('token');
        if (!token || !tokenValido) return;

        try {
            const response = await fetch(apiUrlResumenDiario, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    fecha: formatFecha(fechaSeleccionada),
                }),
            });

            if (response.ok) {
                setDatosResumenDiario(await response.json());
            } else {
                console.error('Error al obtener datos del resumen diario');
            }
        } catch (error) {
            console.error('Error en la solicitud del resumen diario:', error);
        }
    };

    const fetchDatosResumenMensual = async () => {
        const token = sessionStorage.getItem('token');
        if (!token || !tokenValido) return;

        try {
            const response = await fetch(apiUrlResumenMensual, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                }),
            });

            if (response.ok) {
                setDatosResumenMensual(await response.json());
            } else {
                console.error('Error al obtener datos del resumen mensual');
            }
        } catch (error) {
            console.error('Error en la solicitud del resumen mensual:', error);
        }
    };

    useEffect(() => {
        verificarToken();
    }, []);

    useEffect(() => {
        if (tokenValido) {
            fetchDatosResumenDiario();
            fetchDatosResumenMensual(); // Llamar a la nueva API cuando el token sea válido
        }
    }, [fechaSeleccionada, tokenValido]);

    return (
        <ReporteCloverContext.Provider
            value={{
                datosResumenDiario,
                fetchDatosResumenDiario,
                datosResumenMensual, // Agregar el nuevo dato al contexto
                fetchDatosResumenMensual, // Agregar la función de la nueva API al contexto
                fechaSeleccionada,
                setFechaSeleccionada,
            }}
        >
            {children}
        </ReporteCloverContext.Provider>
    );
};
