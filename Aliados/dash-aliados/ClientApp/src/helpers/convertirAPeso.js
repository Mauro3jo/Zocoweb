function convertirAPeso(str) {
  // Reemplazar coma por punto para convertir el string a formato numérico válido
  const numero = parseFloat(str.replace(",", "."));

  // Formatear el número como valor de moneda
  // Ajusta 'es-AR' y 'currency: 'ARS'' según el país y la moneda específica que necesitas
  const formateado = new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(numero);

  return formateado;
}

export default convertirAPeso;
