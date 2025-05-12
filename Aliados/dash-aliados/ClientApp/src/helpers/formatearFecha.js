export default function formatearFecha(fecha) {
  const fechaObj = new Date(fecha);
  const año = fechaObj.getFullYear();
  const mes = String(fechaObj.getMonth() + 1).padStart(2, "0");
  const dia = String(fechaObj.getDate()).padStart(2, "0");

  return `${dia}-${mes}-${año}`;
}
