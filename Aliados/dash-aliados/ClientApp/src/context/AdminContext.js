import React, { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [ordenesPago, setOrdenesPago] = useState([]);
    const [tokenValido, setTokenValido] = useState(false);

    const apiUrlListaOrdenesPago = "/api/pdf/listaordenespago";
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
            setTokenValido(data === 8); // Asegúrate de que este código sea el correcto para token válido
        } catch (error) {
            console.error('Error al verificar el token:', error);
            setTokenValido(false);
        }
    };

    // Obtener lista de órdenes de pago
    const fetchOrdenesPago = async (fecha = "") => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlListaOrdenesPago, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Token: token, Fecha: fecha }),
            });

            if (response.ok) {
                setOrdenesPago(await response.json());
            } else {
                console.error('Error al obtener las órdenes de pago', response.status);
            }
        } catch (error) {
            console.error('Error en la solicitud de órdenes de pago:', error);
        }
    };

    // Efecto para verificar el token al cargar
    useEffect(() => {
        verificarToken();
    }, []);

    // Efecto para obtener la lista si el token es válido
    useEffect(() => {
        if (tokenValido) {
            fetchOrdenesPago(); // Inicialmente sin fecha
        }
    }, [tokenValido]);

    return (
        <AdminContext.Provider
            value={{
                tokenValido,
                ordenesPago,
                fetchOrdenesPago,
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};
