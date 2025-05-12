import React, { useState, useEffect, useContext } from "react";
import { DarkModeContext } from "../../context/DarkModeContext";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// assets
import logo from "../../assets/img/logo.png";
import BienvenidoCalidad from "../../components/Calidad/BienvenidoCalidad";
import TituloPagina from "../../components/TituloPagina";
import Footer from "../../components/Footer";
import { Table } from "react-bootstrap";

const HistorialCRM = () => {
    const [historial, setHistorial] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { darkMode } = useContext(DarkModeContext);
    const navegacion = useNavigate();
    const[filaExtendida,setFilaExtendida]=useState(null)

  const tableRowStyle = {
    transition: "transform 0.2s ease-in-out",
  };

  const tableRowHoverStyle = {
    transform: "scale(1.01)",
    zIndex: 1,
  };

  const tableCellStyle = (isExpanded) => ({
    whiteSpace: isExpanded ? "normal" : "nowrap",
    overflow: isExpanded ? "visible" : "hidden",
    textOverflow: isExpanded ? "clip" : "ellipsis",
    height: isExpanded? "auto" : "60px",
  });

  const tableCellHoverStyle = {
    whiteSpace: "normal",
    overflow: "visible",
  };

  const handleFilaClick = (index) =>{
    setFilaExtendida(filaExtendida===index? null: index)
  }

    // Función para obtener los datos del historial desde la API usando fetch
    const fetchHistorial = async () => {
        try {
            const response = await fetch('/api/historial/lista');
            if (!response.ok) {
                throw new Error('Error en la solicitud de datos.');
            }
            const data = await response.json();
            setHistorial(data);
            setLoading(false);
        } catch (error) {
            setError('Error al obtener los datos.');
            setLoading(false);
        }
    };

    // useEffect para cargar los datos al montar el componente
    useEffect(() => {
        fetchHistorial();
    }, []);

    // Redirigir en caso de error de sesión o token
    const manejarRespuestaNoAutorizada = () => {
        sessionStorage.removeItem("token");

        Swal.fire({
            title: "Sesión expirada o token inválido.",
            text: "Inicie sesión nuevamente.",
            imageUrl: logo,
            imageWidth: 100,
            imageHeight: 30,
            imageAlt: "Logo",
            confirmButtonText: "Ok",
            timer: 5000,
            allowOutsideClick: true,
            customClass: {
                container: darkMode
                    ? "swal2-container--dark"
                    : "swal2-container--light",
                confirmButton: "my-swal-button",
            },
        }).then(() => {
            navegacion("/");
            window.location.reload();
        });
    };

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="d-flex flex-column min-vh-100" translate="no">
            {/* Componente Bienvenida */}
            <div className="pt-5">
                <BienvenidoCalidad />
            </div>

            {/* Título de la página */}
            <div>
                <TituloPagina title="Historial CRM" />
            </div>

            {/* Tabla con datos del Historial */}
            <div className="container table-responsive py-3 px-5">
                <Table table-borderless responsive striped hover>
                    <thead className={darkMode ? "bg-dark py-2" : "bg-light py-2"}>
                        <tr className="text-center tabla-thead">
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>ID</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Usuario ID</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Fecha de Subida</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Tipo</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Alta ID</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Baja ID</th>
                            <th className={darkMode ? "bg-white text-dark fs-14 py-3" : "bg-dark text-white fs-14 py-3"}>Observaciones</th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {historial.map((item) => (
                            <tr 
                            style={tableRowStyle}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = tableRowHoverStyle.transform;
                              e.currentTarget.style.overflow = "hidden"; // Asegura que no se muestre scroll lateral
                            }}
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                            onClick={() => handleFilaClick(item.id)}
                             key={item.id} className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.id}</td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.usuarioId}</td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>
                                    {item.fechaSubida ? new Date(item.fechaSubida).toLocaleDateString() : 'N/A'}
                                </td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.tipo || 'N/A'}</td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.altaId || 'N/A'}</td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.bajaId || 'N/A'}</td>
                                <td style={tableCellStyle(filaExtendida === item.id)} className={darkMode ? "fs-14 py-4 text-white" : "fs-14 py-4"}>{item.observaciones || 'N/A'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Footer */}
            <div translate="no" className="py-4 mt-auto">
                <Footer />
            </div>
        </div>
    );
};

export default HistorialCRM;
