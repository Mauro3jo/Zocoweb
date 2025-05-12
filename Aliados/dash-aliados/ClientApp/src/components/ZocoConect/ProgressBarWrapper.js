import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';
import { Col, Row } from 'react-bootstrap';

const ProgressBarContainer = styled.div`
  background-color: #e0e0e0;
  width: 100%;
  height: 25px;
  border-radius: 20px;
  overflow: hidden;
  margin-top: 20px;
`;

const Progress = styled.div`
  height: 100%;
  width: ${(props) => props.level}%;
  background-color: ${(props) => {
    if (props.level < 30) return 'red';
    if (props.level < 70) return 'yellow';
    return 'green';
  }};
  transition: width 0.3s ease, background-color 0.3s ease;
`;

const ProgressBar = ({ level }) => {
  return (
    <ProgressBarContainer>
      <Progress level={level} />
    </ProgressBarContainer>
  );
};

const MensajeProgreso = ({ level }) => {
  if (level === 100) {
    return <p style={{ color: 'green' }}>¡Felicidades! Obtuviste tu comisión.</p>;
  } else if (level === 70) {
    return <p style={{ color: 'orange' }}>¡Estás cerca! Sigue así.</p>;
  } else if (level === 30) {
    return <p style={{ color: 'red' }}>El comercio debe esforzarse más.</p>;
  } else {
    return null;
  }
};

const ProgressBarWrapper = ({ resultadosPorMes }) => {
  const [level, setLevel] = useState(0);
  const [cuitSeleccionado, setCuitSeleccionado] = useState(null);
  const [mesSeleccionado, setMesSeleccionado] = useState(null);

  // Obtener CUITs únicos
  const cuitOptions = Array.from(
    new Set(resultadosPorMes.map((resultado) => resultado.cuit))
  ).map((cuit) => ({
    value: cuit,
    label: cuit,
  }));

  // Obtener meses únicos
  const mesOptions = Array.from(
    new Set(resultadosPorMes.map((resultado) => resultado.mes))
  ).map((mes) => ({
    value: mes,
    label: mes,
  }));

  // Actualiza el progreso cuando se selecciona un CUIT y un mes
  useEffect(() => {
    if (cuitSeleccionado && mesSeleccionado) {
      const resultadosFiltrados = resultadosPorMes.filter(
        (resultado) =>
          resultado.cuit === cuitSeleccionado.value &&
          resultado.mes === mesSeleccionado.value
      );

      const totalBruto = resultadosFiltrados.reduce(
        (acc, item) => acc + item.totalBruto,
        0
      );

      // Aplica la lógica de niveles según el valor de totalBruto
      if (totalBruto < 2000000) {
        setLevel(30);
      } else if (totalBruto >= 2000000 && totalBruto < 5000000) {
        setLevel(70);
      } else if (totalBruto >= 5000000) {
        setLevel(100);
      }
    } else {
      setLevel(0);
    }
  }, [cuitSeleccionado, mesSeleccionado, resultadosPorMes]);

  return (
    <div className='container' style={{ marginTop: '20px', marginBottom: '20px' }}>
      <h3>Barra de progreso</h3>

      <Row className="my-3 align-items-center">
        <Col className='lg-6'>
        <Select
      className="select__control_custom-inicio select__control_custom lato-bold fs-12"
          classNamePrefix="select"
        options={cuitOptions}
        onChange={(selected) => setCuitSeleccionado(selected)}
        placeholder="Seleccionar CUIT"
        isClearable
      />

        </Col>
        <Col className='lg-6'>
        <Select
      className="select__control_custom-inicio select__control_custom lato-bold fs-12"
          classNamePrefix="select"
        options={mesOptions}
        onChange={(selected) => setMesSeleccionado(selected)}
        placeholder="Seleccionar Mes"
        isClearable
      />

        </Col>
      </Row>

      {/* Selector de CUIT */}
      
      {/* Selector de Mes */}
      
      {/* Barra de progreso */}
      <ProgressBar level={level} />

      {/* Mensaje basado en el nivel */}
      <MensajeProgreso level={level} />
    </div>
  );
};

export default ProgressBarWrapper;
