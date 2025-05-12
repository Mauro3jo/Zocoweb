import React from "react";

const NotificacionIndicador = ({ count }) => {
  return (
    <div
      style={{
        position: 'absolute', 
        top: '-10px', 
        right: '-2px', 
        background: 'red', 
        borderRadius: '50%', 
        width: '20px', 
        height: '20px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        color: 'white',
        fontSize: '12px'
      }}
    >
      {count}
    </div>
  );
};

export default NotificacionIndicador;
