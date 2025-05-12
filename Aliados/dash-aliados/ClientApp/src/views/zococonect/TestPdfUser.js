import React, { useState } from 'react';
import PopUpPrueba from '../../components/ZocoConect/PopUpPrueba';

const TestPdfUser = () => {
    const [showModalNotificaciones, setShowModalNotificaciones] = useState(false);
    const [cuitInput, setCuitInput] = useState('');
    const [loading, setLoading] = useState(false); // Indicador de carga
    const [error, setError] = useState(null); // Manejo de errores
    const [popupData, setPopupData] = useState(null); // Datos para el popup

    const handleCheckCuit = async () => {
        const cuitIngresado = cuitInput.trim();
        const ultimoCuitVisto = localStorage.getItem('ultimoCuitVisto');

        if (cuitIngresado && cuitIngresado !== ultimoCuitVisto) {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/calidad/modalcuit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ Cuit: cuitIngresado }),
                });

                if (!response.ok) {
                    throw new Error('Error al procesar el CUIT');
                }

                const data = await response.json();
                console.log('Respuesta de la API:', data);

                setPopupData(data); // Guardar la data para el popup
                setShowModalNotificaciones(true); // Mostrar modal si la solicitud es exitosa
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        } else {
            alert('El CUIT ya ha sido procesado o no es válido.');
        }
    };

    const handleClose = () => {
        localStorage.setItem('ultimoCuitVisto', cuitInput.trim()); // Guardar el CUIT actual como el último procesado
        setShowModalNotificaciones(false);
        setPopupData(null); // Limpiar la data al cerrar
    };

    return (
        <div>
            <div>
                <label htmlFor="cuitInput">Ingrese su CUIT:</label>
                <input
                    type="text"
                    id="cuitInput"
                    value={cuitInput}
                    onChange={(e) => setCuitInput(e.target.value)}
                />
                <button onClick={handleCheckCuit} disabled={loading}>
                    {loading ? 'Procesando...' : 'Verificar CUIT'}
                </button>
            </div>

            {/* Mostrar error si ocurre */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* MODAL NOTIFICACION */}
            {showModalNotificaciones && (
                <PopUpPrueba translate="no" onClose={handleClose} data={popupData} />
            )}
        </div>
    );
};

export default TestPdfUser;