import React, { createContext, useState, useEffect } from "react";

export const DatosInicioContext = createContext();

export const DatosInicioProvider = ({ children }) => {
  const [datosBackContext, setDatosBackContext] = useState({});
  const apiUrlInicio = process.env.REACT_APP_API_INICIO;
  const apiUrlContabilidad = process.env.REACT_APP_API_CONTABILIDAD;
  const apiUrlAnalisis = process.env.REACT_APP_API_ANALISIS;
  const apiUrlCupones = process.env.REACT_APP_API_CUPONES;
  const [codigoRespuesta, setCodigoRespuesta] = useState(null);

  const [datos, setDatos] = useState(null);
  const [datosMandados, setDatosMandados] = useState();
  const [datosContabilidadContext, setDatosContabilidadContext] = useState({});
  const [datosAnalisisContext, setDatosAnalisisContext] = useState({});

  const [datosCuponesContext, setDatosCuponesContext] = useState({});

  const [datosFiltrado, setdatosfiltrados] = useState({});

  // La función para modificar los datos del contexto
  const actualizarDatos = (nuevosDatos) => {
    setDatos(nuevosDatos);
  };
  const apiUrlToken = process.env.REACT_APP_API_TOKEN;

  // API URL
  const apiUrlNoHayDatos = process.env.REACT_APP_API_NO_HAY_DATOS;

  // estado para guardar la consulta a la api no hay datos
  const [noHayDatos, setNoHayDatos] = useState(true);


  // funcion para consultar el true/false para mostrar el modal de los datos
  const obtenerNoHayDatos = async () => {
    const token = sessionStorage.getItem("token");
    try {
      const response = await fetch(apiUrlNoHayDatos, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Token: token }),
      });

      if (response.ok) {
        const resultadoCalifico = await response.json();
        setNoHayDatos(resultadoCalifico);
      } else {
      }
    } catch (error) {}
  };

  useEffect(() => {
    const verificarYcargarDatos = async () => {
      const token = sessionStorage.getItem("token");
      if (token != null) {
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
            obtenerNoHayDatos();
           if (noHayDatos===true){
            if (data === 0) {
              if (datos === null) {
                cargarDatosInicio();
                cargarDatosContabilidad();
                cargarDatosAnalisis();
                cargarDatosCupones();
                setdatosfiltrados(datos);
              } else if (
                JSON.stringify(datos) !== JSON.stringify(datosFiltrado)
              ) {
                cargarDatosInicio();
                cargarDatosContabilidad();
                cargarDatosAnalisis();
                cargarDatosCupones();
                setdatosfiltrados(datos);
              }
            }
           }
        
          }
        } catch (error) {}
      }
    };

    const cargarDatosInicio = async () => {
      const token = sessionStorage.getItem("token");
      //  setdatosfiltrados(datos);
      const currentDate = new Date();
      const year = datos?.anio || currentDate.getFullYear();
      const month = datos?.mes || currentDate.getMonth() + 1;
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Primer día del mes actual
      const dayOfWeek = firstDayOfMonth.getDay();
      const week =
        datos?.semana || Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
      const comercio = datos?.comercio || "Todos";
      const day = 1;

      const requestData = {
        token,
        year,
        month,
        week,
        comercio,
        day,
      };

      try {
        const response = await fetch(apiUrlInicio, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 200) {
          setCodigoRespuesta(200);
          const data = await response.json();
          setDatosBackContext(data);
        } else if (response.status === 401) {
          setCodigoRespuesta(401);
          console.error("Usuario no autorizado");
        } else {
          setCodigoRespuesta(400);
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    const cargarDatosContabilidad = async () => {
      const token = sessionStorage.getItem("token");

      const currentDate = new Date();
      const year = datos?.anio || currentDate.getFullYear();
      const month = datos?.mes || currentDate.getMonth() + 1;
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Primer día del mes actual
      const dayOfWeek = firstDayOfMonth.getDay();
      const week =
        datos?.semana || Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
      const comercio = datos?.comercio || "Todos";
      const day = 1;

      const requestData = {
        token,
        year,
        month,
        week,
        comercio,
        day,
      };

      try {
        const response = await fetch(apiUrlContabilidad, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 200) {
          setCodigoRespuesta(200);
          const data = await response.json();
          setDatosContabilidadContext(data);
        } else if (response.status === 401) {
          setCodigoRespuesta(401);
          console.error("Usuario no autorizado");
        } else {
          setCodigoRespuesta(400);
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    const cargarDatosAnalisis = async () => {
      const token = sessionStorage.getItem("token");

      const currentDate = new Date();
      const year = datos?.anio || currentDate.getFullYear();
      const month = datos?.mes || currentDate.getMonth() + 1;
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Primer día del mes actual
      const dayOfWeek = firstDayOfMonth.getDay();
      const week =
        datos?.semana || Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
      const comercio = datos?.comercio || "Todos";
      const day = 1;

      const requestData = {
        token,
        year,
        month,
        week,
        comercio,
        day,
      };

      try {
        const response = await fetch(apiUrlAnalisis, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.status === 200) {
          setCodigoRespuesta(200);
          const data = await response.json();
          setDatosAnalisisContext(data);
        } else if (response.status === 401) {
          setCodigoRespuesta(401);
          console.error("Usuario no autorizado");
        } else {
          setCodigoRespuesta(400);
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
    const cargarDatosCupones = async () => {
      const token = sessionStorage.getItem("token");

      const currentDate = new Date();
      const year = datos?.anio || currentDate.getFullYear();
      const month = datos?.mes || currentDate.getMonth() + 1;
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      ); // Primer día del mes actual
      const dayOfWeek = firstDayOfMonth.getDay();
      const week =
        datos?.semana || Math.ceil((currentDate.getDate() + dayOfWeek) / 7);
      const comercio = datos?.comercio || "Todos";
      const day = 1;

      const requestData = {
        token,
        year,
        month,
        week,
        comercio,
        day,
      };

      try {
        const response = await fetch(apiUrlCupones, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (response.ok) {
          const data = await response.json();
          setDatosCuponesContext(data);
        } else {
          throw new Error("Error en la solicitud");
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };

    verificarYcargarDatos();
  }, [datos, codigoRespuesta]);

  return (
    <DatosInicioContext.Provider
      value={{
        datos,
        actualizarDatos,
        datosBackContext,
        setDatosBackContext,
        datosCuponesContext,
        datosMandados,
        setDatosMandados,
        datosContabilidadContext,
        setDatosContabilidadContext,
        datosAnalisisContext,
        setDatosAnalisisContext,
        codigoRespuesta,
        noHayDatos
      }}
    >
      {children}
    </DatosInicioContext.Provider>
  );
};
