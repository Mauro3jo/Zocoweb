import React from "react";

const ItemTablaPanelInterno = ({ dato, darkMode }) => {

  const getColorFueraHorario=(valor)=>{
    if (valor===0) return "#B4C400"
    if(valor>0) return "#E24444"
  }
  const getColorDesaprobados=(valor)=>{
    if (valor===0) return "#B4C400"
    if(valor>0 && valor<=5) return "#E24444"
    if(valor>5) return "#C13030"
  }
  const getTextoDesaprobados=(valor)=>{
    return valor > 5 ? "#FFFFFF" : "#2d3035";
    }
  
  const getColorPendientes=(valor)=>{
    if (valor===0) return "#B4C400"
    if(valor>0 && valor<10) return "#EFCA39"
    if(valor>= 10 && valor<20) return "#E89F2F"
    if(valor>=20&& valor <25) return "#E24444"
    if(valor>=25) return "#C13030"
  }
  const getTextoPendientes=(valor)=>{
    return valor > 25 ? "#FFFFFF" : "#2d3035";

  }

  const getColorPromedio=(valor)=>{
    const minutos=parseInt(valor.split(":")[1], 10);
    if (minutos>=0 && minutos<2) return "#E24444"
    if (minutos>=2 && minutos<4) return "#E89F2F"
    if (minutos>=4 && minutos<7) return "#B4C400"
    if (minutos>=7 && minutos<10) return "#E89F2F"
    if (minutos>=10) return "#E24444"
  }
  return (
    <tr className={darkMode ? "bg-dark text-white" : "bg-white text-dark"}>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.usuarioId}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.nombreUsuario}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.horasTrabajadas}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.diasTrabajados}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        <button
        disabled
          style={{
            borderRadius: "32px",
            top: "429px",
            left: "1040px",
            width: "62px",
            height: "31px",
            backgroundColor: getColorFueraHorario(dato.fueraHorario),
            color: darkMode ? "white" : "black",
            verticalAlign:"middle"
          }}
        >
          {" "}
          {dato.fueraHorario}
        </button>
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.totalRegistros}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {" "}
        <button
        disabled
          style={{
            borderRadius: "32px",
            top: "429px",
            left: "1282px",
            width: "62px",
            height: "31px",
            background: getColorDesaprobados(dato.desaprobados),
            color: getTextoDesaprobados(dato.desaprobados),
            verticalAlign:"middle"
          }}
        >
          {" "}
          {dato.desaprobados}
        </button>
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.visitas}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {dato.prospectos}
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        {" "}
        <button
        disabled
       
          style={{
            borderRadius: "32px",
            top: "429px",
            left: "1566px",
            width: "62px",
            height: "31px",
            backgroundColor: getColorPendientes(dato.pendientes),
            color: getTextoPendientes(dato.pendientes),
            verticalAlign:"middle"
          }}
        >
          {dato.pendientes}
        </button>
      </td>
      <td
        className={
          darkMode
            ? "fs-14 lato-regular py-4 prority-4 text-white "
            : "fs-14 lato-regular py-4 prority-4 "
        } style={{ verticalAlign: "middle" }}
      >
        <button
        disabled
          style={{
            borderRadius: "32px",
            top: "429px",
            left: "1652px",
            width: "94px",
            height: "31px",
            backgroundColor:getColorPromedio(dato.promedio),
            color: darkMode ? "white": "black",
            verticalAlign:"middle"
          }}
        >
          {dato.promedio}
        </button>
      </td>
    </tr>
  );
};

export default ItemTablaPanelInterno;
