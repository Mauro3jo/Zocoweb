import React, { useState } from "react";

const CheckInCheckOut = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [records, setRecords] = useState([]);

  const handleCheck = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newRecord = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            time: new Date().toISOString(), // Guardamos la hora en formato ISO.
            type: isCheckedIn ? "Check-Out" : "Check-In",
          };

          // Actualizar el estado con el nuevo registro.
          setRecords((prevRecords) => [...prevRecords, newRecord]);
          setIsCheckedIn(!isCheckedIn); // Cambiar el estado de check-in/check-out.

          // Aquí podrías llamar a sendLocationToServer(newRecord) para enviar los datos al servidor.
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div>
      <button onClick={handleCheck}>
        {isCheckedIn ? "Check Out" : "Check In"}
      </button>
      <div>
        <h3>Registros:</h3>
        {records.map((record, index) => (
          <div key={index}>
            {record.type} - {record.time} - Lat: {record.lat}, Lng: {record.lng}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckInCheckOut;
