export const formatearAPeso = (valor) => {
    const valorFormateado = new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(valor);
    const partes = valorFormateado.split(",");
    partes[0] = partes[0]
      .replace(/\D/g, "")
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    return partes.join(",");
  };

 export default function formatearValores(...valores) {
    return valores.map(valor => formatearAPeso(valor));
  }
  
  