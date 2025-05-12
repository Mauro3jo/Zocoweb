const formaPesos = (numero) => {
  if (!numero) return '$0,00';

  const monto = parseFloat(numero);
  let partes = monto.toFixed(2).split('.');

  partes[0] = partes[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return `$${partes[0]},${partes[1]}`;
};

export default formaPesos;
