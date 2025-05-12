import React, { createContext, useState, useEffect } from 'react';

export const FidelizacionContext = createContext();

export const FidelizacionProvider = ({ children }) => {
    const [datosFidelizacion, setDatosFidelizacion] = useState(null);
    const [tokenValido, setTokenValido] = useState(false);

    const apiUrlFidelizacion = '/api/fidelizacion/listafidelizacion';
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

    // Verificar si el token es válido
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
            setTokenValido(data === 8); 
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setTokenValido(false);
        }
    };

    // Fetch para obtener los datos de fidelización
    const fetchDatosFidelizacion = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlFidelizacion, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Token: token }),
            });

            if (response.ok) {
                setDatosFidelizacion(await response.json());
            } else {
                console.error('Error al obtener datos de fidelización');
            }
        } catch (error) {
            console.error('Error en la solicitud de fidelización:', error);
        }
    };

    // Efecto para verificar el token al cargar
    useEffect(() => {
        verificarToken();
    }, []);

    // Efecto para obtener los datos de fidelización si el token es válido
    useEffect(() => {
        if (tokenValido) {
            fetchDatosFidelizacion();
        }
    }, [tokenValido]);

    return (
        <FidelizacionContext.Provider
            value={{
                tokenValido,
                datosFidelizacion,
                fetchDatosFidelizacion
            }}
        >
            {children}
        </FidelizacionContext.Provider>
    );
};
