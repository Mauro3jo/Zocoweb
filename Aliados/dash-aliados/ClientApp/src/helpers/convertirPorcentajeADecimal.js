export default function convertirDecimalAPorcentaje(numeroDecimal) {
    // Multiplica el número decimal por 100 y luego convierte a entero
    var porcentaje = Math.round(numeroDecimal * 100);
    return porcentaje;
}