import React, { createContext, useState, useEffect } from 'react';

export const InicioAhorroContext = createContext();

export const InicioAhorroProvider = ({ children }) => {
    const [datosInicioAhorro, setDatosInicioAhorro] = useState(null);
    const [tokenValido, setTokenValido] = useState(false);

    const apiUrlInicioAhorro = '/api/inicioahorro/inicioahorro';
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
            setTokenValido(data === 0); // Ajusta según la respuesta de la API
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setTokenValido(false);
        }
    };

    // Fetch para obtener los datos de inicio ahorro
    const fetchDatosInicioAhorro = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlInicioAhorro, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Token: token }),
            });

            if (response.ok) {
                const data = await response.json();
                setDatosInicioAhorro(data); // Guarda los datos en el estado
            } else {
                console.error('Error al obtener datos de inicio ahorro');
                setDatosInicioAhorro(null); // Asegúrate de manejar errores limpiamente
            }
        } catch (error) {
            console.error('Error en la solicitud de inicio ahorro:', error);
        }
    };

    // Efecto para verificar el token al cargar
    useEffect(() => {
        verificarToken();
    }, []);

    // Efecto para obtener los datos de inicio ahorro si el token es válido
    useEffect(() => {
        if (tokenValido) {
            fetchDatosInicioAhorro();
        }
    }, [tokenValido]);

    // Desestructurar las propiedades de datosInicioAhorro
    const {
        ahorroMercadoPago = null,
        ahorroPayway = null,
        porcentajeAhorroMercadoPago = null,
        porcentajeAhorroPayway = null,
        ahorroNaranjaX = null,
        porcentajeAhorroNaranjaX = null,
        ahorroGetnet = null,
        porcentajeAhorroGetnet = null,
        ahorroViumi = null,
        porcentajeAhorroViumi = null,
        ahorroNave = null,
        porcentajeAhorroNave = null,
        netoZoco = null,
    } = datosInicioAhorro || {};

    return (
        <InicioAhorroContext.Provider
            value={{
                tokenValido,
                ahorroMercadoPago,
                ahorroPayway,
                porcentajeAhorroMercadoPago,
                porcentajeAhorroPayway,
                ahorroNaranjaX,
                porcentajeAhorroNaranjaX,
                ahorroGetnet,
                porcentajeAhorroGetnet,
                ahorroViumi,
                porcentajeAhorroViumi,
                ahorroNave,
                porcentajeAhorroNave,
                fetchDatosInicioAhorro,
                netoZoco,
            }}
        >
            {children}
        </InicioAhorroContext.Provider>
    );
};
