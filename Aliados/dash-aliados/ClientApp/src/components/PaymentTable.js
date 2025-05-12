import React, { useContext } from "react";
import { DarkModeContext } from "../context/DarkModeContext";

function PaymentTable() {
  const data = [
    {
      category: "DÉBITO",
      description:
        "Bancarizadas (Tarjetas de Débito de bancos virtuales, Brubank, Mercadopago y todas las recargables)",
      days: "24 hs hábiles ",
    },
    {
      category: "DÉBITO",
      description:
        "Billeteras virtuales (Bancos Nacionales, Provinciales y privados)",
      days: "48 hs hábiles",
    },
    {
      category: "ALIMENTAR",
      description: "Banco Nación/Provinciales",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Amex)",
      days: "10 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Cabal)",
      days: "18 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description: "Bancarizadas (Visa - Master-Argencard)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description:
        "No Bancarizadas (Naranja Visa, Naranja Master, Cencosud, etc)",
      days: "5 días hábiles",
    },
    {
      category: "CRÉDITO 1 PAGO",
      description:
        "Recargables (Tarjetas de débito de bancos virtuales, Uala, Brubank, Mercadopago y todas las recargables)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO 2 O MÁS PAGOS",
      description: "Bancarizadas (Amex - Cabal)",
      days: "10 días hábiles",
    },
    {
      category: "CRÉDITO 2 O MÁS PAGOS",
      description: "No Bancarizadas (Naranja Visa, Naranja Master, Cencosud)",
      days: "5 días hábiles",
    },
    {
      category: "CRÉDITO CUOTA SIMPLE",
      description:
        "Solo Bancarizadas habilitadas (Bancos Nacionales, Provinciales y Privados)",
      days: "48 hs hábiles",
    },
    {
      category: "CRÉDITO CUOTA SIMPLE",
      description: "Solo bancarizadas habilitadas (Amex)",
      days: "10 días hábiles",
    },
    {
      category: "FECHA DE PAGO",
      description: "Naranja",
      days: "Cierre: 24 cada mes - Pago 14",
    },
  ];

  // context darkMode para la funcionalidad claro/oscuro.
  const { darkMode } = useContext(DarkModeContext);

  return (
    <section
      className={
        darkMode
          ? "caracteristicas-container bg-tabla-simulador-dark"
          : "caracteristicas-container bg-tabla-simulador"
      }
    >
      <table className="caracteristicas-table">
        <thead className="rounded-top">
          <tr>
            <th
              colSpan="3"
              className={
                darkMode
                  ? "text-center text-dark bg-white py-2"
                  : "text-center text-white bg-dark py-2"
              }
            >
              PLAZOS DE ACREDITACIÓN
            </th>
          </tr>
          <tr className="border-bottom text-center py-2">
            <th className="py-2 fs-12">Categoría</th>
            <th className="py-2 fs-12">Descripción</th>
            <th className="py-2 fs-12">Plazos de Acreditación</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr className="border-bottom" key={index}>
              <td className="py-3 text-center fs-10">{row.category}</td>
              <td className="py-3 text-center fs-12">{row.description}</td>
              <td
                className="py-3 text-center fs-12 lato-bold"
                style={{
                  color: row.days === "48 hs hábiles" ? "#b4c400 " : "black",
                }}
              >
                {" "}
                {row.days}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default PaymentTable;
