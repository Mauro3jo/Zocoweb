import React, { useState, useContext } from "react";
import Swal from "sweetalert2";
import { ThreeDots } from "react-loader-spinner";
import { DarkModeContext } from "../context/DarkModeContext";
import { Table } from "react-bootstrap";
import "./ContenidoCuponesAliados.css";

const ContenidoCuponesAliados = () => {
    const [formData, setFormData] = useState({
        fecha: "",
        bruto: "",
        ultimos4digitos: "",
        tarjeta: "",
        cuotas: "",
    });

    // Estado para la carga
    const [loading, setLoading] = useState(false);

    // Contexto para el modo oscuro
    const { darkMode } = useContext(DarkModeContext);
    const [datos, setDatos] = useState([]);
    // URL de la API
    const apiUrl = "/api/cuponesaliado/cuponesaliado";

    // Función para manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "fecha") {
            setFormData({ ...formData, [name]: formatFecha(value) });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };


    // Función para enviar la consulta
    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = sessionStorage.getItem("token");

        if (!token) {
            Swal.fire({
                title: "Error",
                text: "No se encontró un token válido. Inicie sesión nuevamente.",
                icon: "error",
                confirmButtonText: "OK",
            });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(apiUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                    ...formData,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setDatos(data);
                Swal.fire({
                    title: "Consulta Exitosa",
                    text: "Los datos han sido obtenidos correctamente.",
                    icon: "success",
                    confirmButtonText: "OK",
                });
            } else {
                Swal.fire({
                    title: "Error",
                    text: "No se pudieron obtener los datos.",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Error",
                text: "Ocurrió un problema con la consulta.",
                icon: "error",
                confirmButtonText: "OK",
            });
        }

        setLoading(false);
    };
    const formatFecha = (value) => {
        // Eliminar cualquier caracter que no sea número
        let cleaned = value.replace(/\D/g, "");

        // Limitar a máximo 8 dígitos (ddMMyyyy)
        if (cleaned.length > 8) {
            cleaned = cleaned.slice(0, 8);
        }

        // Formatear con slashes
        if (cleaned.length >= 5) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}/${cleaned.slice(4)}`;
        } else if (cleaned.length >= 3) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`;
        } else {
            return cleaned;
        }
    };

    const formatFechaISO = (fechaString) => {
        if (!fechaString) return "";
        const fecha = new Date(fechaString);
        const dia = String(fecha.getDate()).padStart(2, "0");
        const mes = String(fecha.getMonth() + 1).padStart(2, "0");
        const anio = fecha.getFullYear();
        return `${dia}/${mes}/${anio}`;
    }; const formatMoneda = (valor) => {
        if (valor == null || isNaN(valor)) return "$ 0,00";

        return `$ ${parseFloat(valor)
            .toFixed(2) // dos decimales
            .replace(/\B(?=(\d{3})+(?!\d))/g, ".") // miles con punto
            .replace(".", "#") // temporal para evitar conflicto con siguiente replace
            .replace(",", ",") // opcional para claridad
            .replace("#", ",") // cambia el decimal
            }`;
    };


  return (
      <div className="contenido-cupones-aliados-container">
          <h2 className="text-center">Buscador De Cupones</h2>

          <div className="contenido-cupones-aliados-card">
              <form onSubmit={handleSubmit} className="mt-4">
                  <div className="contenido-cupones-aliados-form-grid">
                      {/* Fila 1 */}
                      <div>
                          <label className="form-label">Fecha (dd/MM/yyyy)</label>
                          <input
                              type="text"
                              className="form-control"
                              name="fecha"
                              value={formData.fecha}
                              onChange={handleChange}
                              placeholder="Ej: 01/03/2024"
                          />
                      </div>

                      <div>
                          <label className="form-label">Tarjeta</label>
                          <input
                              type="text"
                              className="form-control"
                              name="tarjeta"
                              value={formData.tarjeta}
                              onChange={handleChange}
                              placeholder="Ej: VISA"
                          />
                      </div>

                      {/* Fila 2 */}
                      <div>
                          <label className="form-label">Bruto</label>
                          <input
                              type="text"
                              className="form-control"
                              name="bruto"
                              value={formData.bruto}
                              onChange={handleChange}
                              placeholder="Ej: 1000"
                          />
                      </div>

                      <div>
                          <label className="form-label">Cuotas</label>
                          <input
                              type="text"
                              className="form-control"
                              name="cuotas"
                              value={formData.cuotas}
                              onChange={handleChange}
                              placeholder="Ej: 3"
                          />
                      </div>

                      {/* Fila 3 */}
                      <div>
                          <label className="form-label">Últimos 4 Dígitos de Tarjeta</label>
                          <input
                              type="text"
                              className="form-control"
                              name="ultimos4digitos"
                              value={formData.ultimos4digitos}
                              onChange={handleChange}
                              placeholder="Ej: 1234"
                          />
                      </div>

                      <div className="d-flex align-items-end">
                          <button
                              type="submit"
                              className="btn contenido-cupones-aliados-btn"
                              disabled={loading}
                          >
                              {loading ? "Consultando..." : "Consultar"}
                          </button>
                      </div>
                  </div>
              </form>
          </div>

          {loading && (
              <div className="text-center mt-3">
                  <ThreeDots visible={true} height="60" width="60" color="#b4c400" />
              </div>
          )}

          <div className="contenido-cupones-aliados-tabla table-responsive py-3">
              <Table responsive striped hover>
                  <thead className="bg-dark py-2">
                      <tr className="text-center tabla-thead">
                          <th className={darkMode ? "bg-white text-dark" : "bg-dark text-white"}>Fecha de Operación</th>
                          <th className={darkMode ? "bg-white text-dark" : "bg-dark text-white"}>Fecha de Pago</th>
                          <th className={darkMode ? "bg-white text-dark" : "bg-dark text-white"}>Bruto</th>
                          <th className={darkMode ? "bg-white text-dark" : "bg-dark text-white"}>Total con Descuentos</th>
                      </tr>
                  </thead>
                  <tbody className="text-center">
                      {datos.length > 0 ? (
                          datos.map((dato, index) => (
                              <tr key={index}>
                                  <td>{formatFechaISO(dato.fechaOperacion)}</td>
                                  <td>{formatFechaISO(dato.fechaDePago)}</td>
                                  <td>{formatMoneda(dato.totalBruto)}</td>
                                  <td>{formatMoneda(dato.totalConDescuentos)}</td>

                              </tr>
                          ))
                      ) : (
                          <tr>
                              <td colSpan="4">No hay datos disponibles.</td>
                          </tr>
                      )}
                  </tbody>
              </Table>
          </div>
      </div>





  )
}

export default ContenidoCuponesAliados