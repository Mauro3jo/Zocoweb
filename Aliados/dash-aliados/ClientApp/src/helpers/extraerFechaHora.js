/**
 * Función para extraer la fecha y la hora de un objeto Date o una cadena de fecha y hora.
 * @param {string | Date} fechaHora - La fecha y hora en formato de cadena o como objeto Date.
 * @returns {object} Un objeto con la fecha y la hora separadas.
 */
const extraerFechaHora = (fechaHora) => {
  const fecha = new Date(fechaHora);
  const opcionesFecha = { year: "numeric", month: "long", day: "numeric" };
  const opcionesHora = {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return {
    fecha: fecha.toLocaleDateString("es-ES", opcionesFecha),
    hora: fecha.toLocaleTimeString("es-ES", opcionesHora),
  };
};

export default extraerFechaHora;
