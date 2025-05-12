import React, { useEffect, useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ContenidoPostulanteCuestionario from '../../components/postulantes/ContenidoPostulanteCuestionario';
import { PostulacionesContext } from '../../context/PostulacionesContext';

const CuestionariosPostulante = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const idPuesto = location.state?.idPuesto;

    const {
        tokenValido,
        obtenerCuestionarios,
        cuestionariosPorPuesto
    } = useContext(PostulacionesContext);

    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        if (!idPuesto || !tokenValido) {
            alert("No tienes acceso a esta página.");
            navigate("/");
            return;
        }

        obtenerCuestionarios(idPuesto);
    }, [idPuesto, tokenValido, navigate, obtenerCuestionarios]);

    // 🔁 Cortamos el spinner apenas los cuestionarios llegan (o incluso si no hay)
    useEffect(() => {
        if (tokenValido) {
            setCargando(false);
        }
    }, [cuestionariosPorPuesto, tokenValido]);

    return (
        <section className="container">
            {cargando ? (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando cuestionarios disponibles...</p>
                </div>
            ) : (
                cuestionariosPorPuesto.length > 0 ? (
                    <ContenidoPostulanteCuestionario
                        cuestionarios={cuestionariosPorPuesto}
                        puestos={[{ id: idPuesto, nombre: "Puesto seleccionado" }]}
                    />
                ) : (
                    <p className="text-muted text-center">No hay cuestionarios disponibles para este puesto.</p>
                )
            )}
        </section>
    );
};

export default CuestionariosPostulante;
