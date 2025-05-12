import React, { createContext, useState, useEffect } from 'react';

export const FacturacionContext = createContext();

export const FacturacionProvider = ({ children }) => {
    const [datosFacturacionDiaria, setDatosFacturacionDiaria] = useState(null);
    const [datosFacturacionMensual, setDatosFacturacionMensual] = useState(null);
    const [datosPanel, setDatosPanel] = useState(null);
    const [datosResumenMensual, setDatosResumenMensual] = useState(null);
    const [datosResumenFacturacionPorTerminales, setDatosResumenFacturacionPorTerminales] = useState(null);
    const [datosBarraComparativa, setDatosBarraComparativa] = useState(null);
    const [datosBarraComparativaProvincia, setDatosBarraComparativaProvincia] = useState(null);
    const [datosFacturacionPorTerminalSemana, setDatosFacturacionPorTerminalSemana] = useState(null);
    const [datosExcelCRMsemanal, setDatosExcelCRMsemanal] = useState(null);
    const [provincias, setProvincias] = useState([]);
    const [provinciaSeleccionada, setProvinciaSeleccionada] = useState(null);
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [tokenValido, setTokenValido] = useState(false);
    const [datosFidelizacion, setDatosFidelizacion] = useState(null);

    const apiUrlFacturacionDiaria = '/api/facturacion/facturacionpagina1';
    const apiUrlFacturacionMensual = '/api/facturacion/facturacionpagina2';
    const apiUrlResumenMensual = '/api/resumenmensual/resumenapi1';
    const apiUrlPanelBienvenida = '/api/facturacion/bienvenidopanelfacturacion';
    const apiUrlResumenFacturacionPorTerminales = '/api/resumenmensual/resumenFacturacionPorTerminales';
    const apiUrlBarraComparativa = '/api/resumenmensual/barracomparativa';
    const apiUrlBarraComparativaProvincia = '/api/resumenmensual/barracomparativaprovincia';
    const apiUrlFacturacionPorTerminalSemana = '/api/resumenmensual/facturacionPorTerminalSemana';
    const apiUrlExcelCRMsemanal = '/api/resumenmensual/excelcrmsemanal';
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const apiUrlProvincias = process.env.REACT_APP_API_PROVINCIAS;
    const apiUrlFidelizacion = '/api/fidelizacion/listafidelizacion';

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

    const fetchProvincias = async () => {
        try {
            const response = await fetch(apiUrlProvincias);
            const data = await response.json();
            setProvincias(data.map((item) => ({ value: item.provincia, label: item.provincia })));
        } catch (error) {
            console.error('Error al obtener las provincias:', error);
        }
    };

    const fetchDatosPanel = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlPanelBienvenida, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                }),
            });

            if (response.ok) {
                setDatosPanel(await response.json());
            } else {
                console.error('Error al obtener datos del panel de bienvenida');
            }
        } catch (error) {
            console.error('Error en la solicitud del panel de bienvenida:', error);
        }
    };

    const fetchDatosFacturacionDiaria = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlFacturacionDiaria, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                    fecha: formatFecha(fechaSeleccionada),
                }),
            });

            if (response.ok) {
                setDatosFacturacionDiaria(await response.json());
            } else {
                console.error('Error al obtener datos de facturación diaria');
            }
        } catch (error) {
            console.error('Error en la solicitud de facturación diaria:', error);
        }
    };

    const fetchDatosFacturacionMensual = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        let intentos = 0; // Contador de intentos
        const maxIntentos = 2; // Número máximo de intentos permitidos

        while (intentos < maxIntentos) {
            try {
                const response = await fetch(apiUrlFacturacionMensual, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Token: token,
                        provincia: provinciaSeleccionada || '',
                        fecha: formatFecha(fechaSeleccionada),
                    }),
                });

                if (response.ok) {
                    setDatosFacturacionMensual(await response.json());
                    return; // Salir inmediatamente si la solicitud fue exitosa
                } else if (response.status === 524) {
                    console.warn(`Error 524 detectado (intento ${intentos + 1} de ${maxIntentos}).`);
                } else {
                    console.error('Error al obtener datos de facturación mensual:', response.statusText);
                    break; // Salir del bucle para errores distintos a 524
                }
            } catch (error) {
                console.error(`Error en la solicitud de facturación mensual (intento ${intentos + 1} de ${maxIntentos}):`, error);
            }

            intentos++; // Incrementar el contador de intentos
            if (intentos < maxIntentos) {
                console.log('Reintentando solicitud...');
            } else {
                console.error('Se alcanzó el máximo de intentos para la solicitud de facturación mensual.');
            }
        }
    };


    const fetchDatosResumenMensual = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlResumenMensual, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                }),
            });

            if (response.ok) {
                setDatosResumenMensual(await response.json());
            } else {
                console.error('Error al obtener datos del resumen mensual');
            }
        } catch (error) {
            console.error('Error en la solicitud de resumen mensual:', error);
        }
    };

    const fetchDatosResumenFacturacionPorTerminales = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlResumenFacturacionPorTerminales, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                }),
            });

            if (response.ok) {
                setDatosResumenFacturacionPorTerminales(await response.json());
            } else {
                console.error('Error al obtener datos del resumen de facturación por terminales');
            }
        } catch (error) {
            console.error('Error en la solicitud del resumen de facturación por terminales:', error);
        }
    };

    const fetchDatosBarraComparativa = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlBarraComparativa, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                }),
            });

            if (response.ok) {
                setDatosBarraComparativa(await response.json());
            } else {
                console.error('Error al obtener datos de la barra comparativa');
            }
        } catch (error) {
            console.error('Error en la solicitud de barra comparativa:', error);
        }
    };

    const fetchDatosBarraComparativaProvincia = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        let intentos = 0;
        const maxIntentos = 2; // Número máximo de intentos permitidos (1 intento original + 1 reintento).

        while (intentos < maxIntentos) {
            try {
                const response = await fetch(apiUrlBarraComparativaProvincia, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        Token: token,
                        provincia: provinciaSeleccionada || '',
                    }),
                });

                if (response.ok) {
                    setDatosBarraComparativaProvincia(await response.json());
                    return; // Salir inmediatamente si la solicitud fue exitosa.
                } else if (response.status === 524) {
                    console.warn(`Error 524 detectado (intento ${intentos + 1} de ${maxIntentos}).`);
                } else {
                    console.error('Error al obtener datos de la barra comparativa:', response.statusText);
                    break; // Salir del bucle para errores distintos al 524.
                }
            } catch (error) {
                console.error(`Error en la solicitud de barra comparativa (intento ${intentos + 1} de ${maxIntentos}):`, error);
            }

            intentos++; // Incrementar el contador de intentos.
            if (intentos < maxIntentos) {
                console.log('Reintentando solicitud de barra comparativa...');
            } else {
                console.error('Se alcanzó el máximo de intentos para la solicitud de barra comparativa.');
            }
        }
    };



    const fetchDatosFacturacionPorTerminalSemana = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlFacturacionPorTerminalSemana, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                }),
            });

            if (response.ok) {
                setDatosFacturacionPorTerminalSemana(await response.json());
            } else {
                console.error('Error al obtener datos de la facturación semanal por terminal');
            }
        } catch (error) {
            console.error('Error en la solicitud de facturación semanal por terminal');
        }
    };

    const fetchDatosExcelCRMsemanal = async () => {
        const token = sessionStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(apiUrlExcelCRMsemanal, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Token: token,
                    provincia: provinciaSeleccionada || '',
                    fecha: formatFecha(fechaSeleccionada),
                }),
            });

            if (response.ok) {
                setDatosExcelCRMsemanal(await response.json());
            } else {
                console.error('Error al obtener datos del CRM semanal');
            }
        } catch (error) {
            console.error('Error en la solicitud de CRM semanal:', error);
        }
    };
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

    useEffect(() => {
        verificarToken();
        fetchProvincias();
    }, []);

    useEffect(() => {
        if (tokenValido) {
            const fetchDatosSecuencialmente = async () => {
                try {
                    await fetchDatosFacturacionDiaria();
                    await fetchDatosFacturacionMensual();
                    await fetchDatosPanel();
                    await fetchDatosResumenMensual();
                    await fetchDatosResumenFacturacionPorTerminales();
                    await fetchDatosBarraComparativa();
                    await fetchDatosFacturacionPorTerminalSemana();
                    await fetchDatosExcelCRMsemanal();
                    await fetchDatosFidelizacion();
                    await fetchDatosBarraComparativaProvincia();
                } catch (error) {
                    console.error("Error en la ejecución secuencial de los fetch:", error);
                }
            };

            fetchDatosSecuencialmente();
        }
    }, [provinciaSeleccionada, fechaSeleccionada, tokenValido]);



    return (
        <FacturacionContext.Provider
            value={{
                tokenValido,
                provincias,
                provinciaSeleccionada,
                setProvinciaSeleccionada,
                setFechaSeleccionada,
                fechaSeleccionada,
                datosFacturacionDiaria,
                datosFacturacionMensual,
                datosPanel,
                datosResumenMensual,
                fetchDatosResumenMensual,
                datosResumenFacturacionPorTerminales,
                fetchDatosResumenFacturacionPorTerminales,
                datosBarraComparativa,
                fetchDatosBarraComparativa,
                datosFacturacionPorTerminalSemana,
                fetchDatosFacturacionPorTerminalSemana,
                datosExcelCRMsemanal,
                fetchDatosExcelCRMsemanal,
                datosFidelizacion,
                fetchDatosFidelizacion,
                datosBarraComparativaProvincia,
                fetchDatosBarraComparativaProvincia

            }}
        >
            {children}
        </FacturacionContext.Provider>
    );
};
