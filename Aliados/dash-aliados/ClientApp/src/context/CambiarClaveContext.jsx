import React, { createContext, useState } from "react";
import Swal from "sweetalert2";

export const CambiarClaveContext = createContext();

function CambiarClaveProvider(props) {

    const [formData, setFormData] = useState({
        anterior: "",
        confirmar: "",
        nueva: "",
      });

      const apiUrlClave = process.env.REACT_APP_API_CAMBIAR_CLAVE;
    
      const onSubmit = async (data) => {
        setFormData(data);
        const token =sessionStorage.getItem("token");

        const datosPassword = {
          Token: token,
  
          ClaveActual: data.anterior,
          ClaveNueva: data.nueva,
          ConfirmarClave: data.confirmar,
        };
    
        try {
          await fetch(apiUrlClave, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(datosPassword),
          });
          Swal.fire({
            title: "¡Enviado!",
            text: "Tu contraseña fue cambiada con exito.",
            icon: "success",
            confirmButtonText: "Ok",
          });
        } catch (error) {
          console.error("Hubo un error:", error);
          Swal.fire({
            title: "Error",
            text: "Hubo un problema al cambiar la clave.",
            icon: "error",
            confirmButtonText: "Cerrar",
          });
        }
      };
    

  return (
    <div>
      <CambiarClaveContext.Provider
        value={{
            onSubmit,
        }}
      >
        {props.children}
      </CambiarClaveContext.Provider>
    </div>
  );
}


export { CambiarClaveProvider };