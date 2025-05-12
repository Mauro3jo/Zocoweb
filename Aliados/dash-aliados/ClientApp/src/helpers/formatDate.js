  // Función auxiliar para formatear fecha y hora
  const formatDate = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleDateString();
  };

  export default formatDate; 