import { useContext, useEffect, useState } from "react";

import { DarkModeContext } from "../context/DarkModeContext";

// import helpers
// funcion para formatear los valores numericos a valor peso
import formatearValores from "../helpers/formatearAPeso";

// funcion para formatear la fecha en DD/MM/AA
import formatearFecha from "../helpers/formatearFecha";
import jsPDF from "jspdf";
import "jspdf-autotable";

// import assets
import logo from "../assets/img/logo.png";

const ItemsTablaTicket = ({
  fecha,
  costoFinancieroEn,
  totalBruto,
  arancel,
  iva21,
  retencionIva,
  impuestoDebitoCredito,
  retencionProvincial,
  retencionGanacia,
  totalConDescuentos,
  tieneDocumentos,
}) => {
  // context para la modalidad claro/oscuro
  const { darkMode } = useContext(DarkModeContext);

  // utilizo la funcion formatear valores para pasarle por parametros
  // los datos a mostrar en pantalla
  const valoresFormateados = formatearValores(
    totalBruto, // 0
    costoFinancieroEn, // 1
    arancel, // 2
    iva21, // 3
    impuestoDebitoCredito, // 4
    iva21, // 5
    impuestoDebitoCredito, // 6
    retencionProvincial, // 7
    retencionGanacia, // 8
    retencionIva, // 9
    totalConDescuentos // 10
  );
 
  const [descargando, setDescargando] = useState(false);
  const fechaFormateada = formatearFecha(fecha);

  const descargarPDFPorFecha = async (fecha) => {
    setDescargando(true);  // Comienza la descarga
    const token = sessionStorage.getItem("token");
    const url = "/api/pdfaliado/descargarpdfordenes";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          fecha: fecha,
        }),
      });

      if (!response.ok) {
        throw new Error("Error en la respuesta de la API");
      }

      // Asumiendo que la API devuelve un array de objetos como los que mostraste
      const documentos = await response.json();

      documentos.forEach((doc, index) => {
        if (doc.documentoPdfBase64) {
          // Asegurarse de que el nombre de la propiedad esté correctamente escrito
          const pdfBlob = b64toBlob(doc.documentoPdfBase64, "application/pdf");

          const pdfUrl = URL.createObjectURL(pdfBlob);
          const link = document.createElement("a");
          link.href = pdfUrl;
          link.download = `Orden-Pago-${doc.nombreDocumento}-${fecha}.pdf`; // Asegúrate de que `nombreDocumento` está correctamente escrito
          document.body.appendChild(link);
          link.click();

          setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(pdfUrl);
          }, 100 * (index + 1)); // Un pequeño retardo para no saturar el proceso
        } else {
          console.log(
            "documentoPdfBase64 no encontrado o undefined para uno de los documentos."
          );
        }
      });

      console.log("PDFs descargados exitosamente.");
    } catch (error) {
      console.error("Error al descargar los PDFs:", error);
    }
    setDescargando(false)
  };

  // Función b64toBlob sin cambios, asegurándose de manejar cualquier prefijo si es necesario

  // Función para convertir Base64 a Blob
  function b64toBlob(b64Data, contentType = "", sliceSize = 512) {
    // Quitar prefijo si existe
    const base64Data = b64Data.split(";base64,").pop();

    try {
      const byteCharacters = atob(base64Data);
      const byteArrays = [];

      for (
        let offset = 0;
        offset < byteCharacters.length;
        offset += sliceSize
      ) {
        const slice = byteCharacters.slice(offset, offset + sliceSize);

        const byteNumbers = new Array(slice.length);
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
      }

      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    } catch (error) {
      console.error("Error al decodificar Base64:", error);
      // Retorna un blob vacío o maneja el error de acuerdo a tu aplicación
      return new Blob([], { type: contentType });
    }
  }

  // css condicional boton cargando 
  const descargandoBtn = descargando ? "btn-slide-descargar:disabled" : "btn-slide-descargar"

  return (
    <tr
      className={
        darkMode
          ? " tabla-borde-bottom  text-white"
          : "tabla-borde-bottom  text-dark"
      }
    >
      <td className="fs-12-a-10 lato-regular py-3 priority-1">
        {" "}
        {fechaFormateada}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-2">
        $ {valoresFormateados[0]}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-3">
        $ {valoresFormateados[1]}{" "}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-4">
        $ {valoresFormateados[2]}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-5">
        $ {valoresFormateados[3]}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-6">
        $ {valoresFormateados[4]}{" "}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-7">
        $ {valoresFormateados[7]}{" "}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-8">
        $ {valoresFormateados[8]}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-9">
        $ {valoresFormateados[9]}
      </td>
      <td className="fs-12-a-10 lato-regular py-3 priority-1">
        ${valoresFormateados[10]}{" "}
      </td>

      <td className="fs-12-a-10 lato-regular priority-1">
        {tieneDocumentos === false ? (
          <> 
            No hay documentos para descargar
          </>
        ) : (
          <button
          type="button"
          className={descargandoBtn}
          onClick={() => descargarPDFPorFecha(fechaFormateada)}
          disabled={descargando}  // Deshabilita el botón durante la descarga
        >
          {descargando ? 'Descargando...' : 'Descargar'}
        </button>
        )}
      </td>
    </tr>
  );
};

export default ItemsTablaTicket;
