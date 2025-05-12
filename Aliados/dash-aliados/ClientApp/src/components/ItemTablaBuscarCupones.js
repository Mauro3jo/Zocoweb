import React, { useContext, useState } from "react";
import { DarkModeContext } from "../context/DarkModeContext";
import Swal from "sweetalert2";

const ItemTablaBuscarCupones = ({ dato }) => {
  const { darkMode } = useContext(DarkModeContext);

  const apiUrlRestaurar =
    process.env.REACT_APP_API_LIQUIDACIONES_RESTAURAR_USUARIO;
  const handleRestaurarClave = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const dataToSend = {
        Id: dato.id,
        Nombre: dato.nombre,
        Usuario: dato.usuario,
        Correo: dato.correo,
        Token: token,
      };

      const response = await fetch("/api/liquidaciones/restaurarclave", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        throw new Error("Respuesta de la red no fue ok");
      }

      Swal.fire({
        title: "¡Enviado!",
        text: "Solicitud de restauración de clave enviada con éxito.",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (error) {
      console.error("Error al restaurar la clave", error);
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al restaurar la clave.",
        icon: "error",
        confirmButtonText: "Ok",
      });
    }
  };

  function formatToCurrency(value) {
    // Reemplazar la coma por un punto para convertir a un número válido
    const numberValue = parseFloat(value.replace(",", "."));

    // Formatear a moneda
    return numberValue.toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
    });
  }

  // Uso de la función con el string proporcionado
  const formattedValue = formatToCurrency(dato.totalBruto);

  return (
    <>
      <tr
        className={
          darkMode
            ? " tabla-borde-bottom  text-white"
            : "tabla-borde-bottom  text-dark"
        }
      >
        <td className="fs-12-a-10 lato-regular pt-4">{dato.fechaOperacion}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.fechaDePago}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.nroDeComercio}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.nroDeTarjeta}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{formattedValue}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.cuotas}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.tarjeta}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.provincia}</td>
        <td className="fs-12-a-10 lato-regular pt-4">{dato.nombreComercio}</td>
      </tr>
    </>
  );
};

export default ItemTablaBuscarCupones;
