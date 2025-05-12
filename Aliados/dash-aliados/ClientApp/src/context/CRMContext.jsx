import React, { createContext, useEffect, useState } from 'react';

export const CRMContext = createContext();

export const CRMProvider = ({ children }) => {
    const [legajos, setLegajos] = useState([]);
    const [legajosCompleto, setLegajosCompleto] = useState([]);  // Estado para los datos completos
    const [comercios, setComercios] = useState([]);
    const [rubros, setRubros] = useState([]);
    const [provincias, setProvincias] = useState([]);
    const [asesores, setAsesores] = useState([]);
    const [bancos, setBancos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [tipoUsuario, setTipoUsuario] = useState(null);

    const apiUrlToken = process.env.REACT_APP_API_TOKEN;

    // Función para verificar el tipo de usuario
    const verificarUsuario = async () => {
        const token = sessionStorage.getItem("token");
        if (!token) {
            console.error("No se encontró el token");
            return false;
        }

        try {
            const response = await fetch(apiUrlToken, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ Token: token }),
            });

            if (response.ok) {
                const data = await response.json();

                setTipoUsuario(data);  // Almacenar el tipo de usuario en el estado

                return data === 3 || data === 8;
            } else {
                console.error("Error en la verificación del token");
                return false;
            }
        } catch (error) {
            console.error("Error en la solicitud:", error);
            return false;
        }
    };

    const fetchLegajos = async () => {
        const response = await fetch(process.env.REACT_APP_API_LEGAJOS);
        const data = await response.json();

        // Formatear los datos como antes
        const formattedData = data.map((item) => ({ value: item.nroLegajo, label: item.nroLegajo }));

        // Retornar tanto los datos formateados como completos
        return { formattedData, rawData: data };
    };

    const fetchComercios = async () => {
        const response = await fetch(process.env.REACT_APP_API_COMERCIOS);
        const data = await response.json();
        return data.map((item) => ({ value: item.num, label: item.numComercio }));
    };

    const fetchRubros = async () => {
        const response = await fetch(process.env.REACT_APP_API_RUBROS);
        const data = await response.json();
        return data.map((item) => ({ value: item, label: item }));
    };

    const fetchProvincias = async () => {
        const response = await fetch(process.env.REACT_APP_API_PROVINCIAS);
        const data = await response.json();
        return data.map((item) => ({
            value: item.provincia,
            label: item.provincia,
            alicuota: item.alicuota,
        }));
    };

    const fetchAsesores = async () => {
        const response = await fetch(process.env.REACT_APP_API_ASESORES);
        const data = await response.json();
        return data.map((item) => ({ value: item, label: item }));
    };

    const fetchBancos = async () => {
        const response = await fetch(process.env.REACT_APP_API_BANCOS);
        const data = await response.json();
        return data;
    };

    // Cargar todos los datos en paralelo si el tipo de usuario es 3 o 8
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const usuarioPermitido = await verificarUsuario();
                if (usuarioPermitido) {
                    const [legajosData, comerciosData, rubrosData, provinciasData, asesoresData, bancosData] = await Promise.all([
                        fetchLegajos(),
                        fetchComercios(),
                        fetchRubros(),
                        fetchProvincias(),
                        fetchAsesores(),
                        fetchBancos(),
                    ]);

                    // Verificar que los datos se estén cargando correctamente
                    setLegajos(legajosData.formattedData); // Asignar los datos formateados
                    setLegajosCompleto(legajosData.rawData); // Asignar los datos completos sin formatear
                    setComercios(comerciosData);
                    setRubros(rubrosData);
                    setProvincias(provinciasData);
                    setAsesores(asesoresData);
                    setBancos(bancosData);
                } else {
                }
            } catch (error) {
                console.error("Error al cargar los datos:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <CRMContext.Provider value={{ legajos, legajosCompleto, comercios, rubros, provincias, asesores, bancos, loading, tipoUsuario }}>
            {children}
        </CRMContext.Provider>
    );
};
