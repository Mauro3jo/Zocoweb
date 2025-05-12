import React, { useContext, useEffect, useState } from 'react';
import { DarkModeContext } from '../../context/DarkModeContext';
import { FacturacionContext } from '../../context/FacturacionContext'; // Importar contexto
import TituloPagina from '../../components/TituloPagina';
import BienvenidaZocoConect from '../../components/ZocoConect/BienvenidoPanelZocoConect';
import Select from 'react-select';
import DatePicker from 'react-datepicker'; // Asegúrate de que está instalado e importado
import 'react-datepicker/dist/react-datepicker.css';
import { Col, Form, Row } from 'react-bootstrap';
import ContenidoInicio from '../../components/ZocoConect/ContenidoInicio';
import Footer from '../../components/Footer';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import ProgressBarWrapper from '../../components/ZocoConect/ProgressBarWrapper';
import logo from "../../assets/img/logo.png";
import {
    faCircleArrowDown,
    faCircleArrowUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ContenidoInicioCelular from '../../components/ZocoConect/ContenidoInicioCelular';
import ContenidoInicioVacio from '../../components/ZocoConect/ContenidoInicioVacio'
import ContenidoInicioCelularVacio from '../../components/ZocoConect/ContenidoInicioCelularVacio'
import ContenidoInicioTabletVacio from '../../components/ZocoConect/ContenidoInicioTabletVacio';

const Inicio = () => {
    const { darkMode } = useContext(DarkModeContext);
    const apiUrlToken = process.env.REACT_APP_API_TOKEN;
    const navegacion = useNavigate();
    const [cargando, setCargando] = useState(false);
    const [resultadosPorMes, setResultadosPorMes] = useState([]);
    const [error404, setError404] = useState(false); // Nuevo estado para manejar el 404



    useEffect(() => {
        const fetchData = async () => {
            setCargando(true);
            const token = sessionStorage.getItem('token'); // Obtener el token de sessionStorage
            setError404(false);

            if (!token) {
                Swal.fire('Error', 'El token no está disponible', 'error');
                setCargando(false);
                return;
            }

            try {
                const response = await fetch('/api/zococonect/obtenerzococonect', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiUrlToken}`
                    },
                    body: JSON.stringify({ Token: token })
                });
                if (response.status === 404) {
                    setError404(true);
                    return;
                }
                if (response.ok) {
                    const data = await response.json();
                    setResultadosPorMes(data);
                } else {
                    const errorText = await response.text();
                    Swal.fire('Error', errorText, 'error');
                }
            } catch (error) {
                Swal.fire('Error', 'Hubo un problema al realizar la consulta', 'error');
            } finally {
                setCargando(false);
            }
        };

        fetchData();
    }, [apiUrlToken]);

    return (
        <>
            <div className='d-xl-block d-none mt-4 pt-4 '>
                <BienvenidaZocoConect />
            </div>

            {/* {cargando ? (
                <p>Cargando...</p>
            ) : (
                <div>
                    <h2>Resultados por Mes</h2>
                    <ul>
                        {resultadosPorMes.map((resultado, index) => (
                            <li key={index}>
                                <strong>CUIT:</strong> {resultado.cuit} <br />
                                <strong>Nombre:</strong> {resultado.nombre} <br />
                                <strong>Mes:</strong> {resultado.mes} <br />
                                <strong>Total Bruto:</strong> {resultado.totalBruto}<br />
                                <strong>Comision:</strong> {resultado.comision}

                            </li>
                        ))}
                    </ul>
                </div>
            )} */}
            {cargando?(
                <p>Cargando...</p>
            ):error404?(
                <>
                <div className="py-4 d-xl-block d-none">
      <ContenidoInicioVacio/>
    </div>
    <div className="py-4 d-block d-xl-none">
        <div className="d-none d-md-block">
            <ContenidoInicioTabletVacio/>
        </div>
        <div className="d-md-none d-block">
        <ContenidoInicioCelularVacio/>
        </div>
      
    </div>
                </>
            ):(
                <div>
                    <>
          <div className="py-4 d-xl-block d-none">
            <ContenidoInicio resultadosPorMes={resultadosPorMes} />
          </div>
          <div className="py-4 d-block d-xl-none">
            <ContenidoInicioCelular resultadosPorMes={resultadosPorMes} />
          </div>
        </>
                {/* <div className='pt-5'>
                <ProgressBarWrapper resultadosPorMes={resultadosPorMes}/>
                </div> */}

                </div>
                
                
                
            )}
           

            <div className='pt-5'>
                <Footer />
            </div>
        </>
    );
};

export default Inicio;
