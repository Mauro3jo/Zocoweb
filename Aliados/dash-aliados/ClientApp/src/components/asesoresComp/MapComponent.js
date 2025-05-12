// import hooks
import React, { useEffect, useState } from "react";

// import libreria
import { Icon } from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Importa el ícono personalizado
import iconoMarcador from "../../assets/img/marcador.png";

// Configura el ícono personalizado para Leaflet
const customIcon = new Icon({
  iconUrl: iconoMarcador,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapComponent = ({ fechaFiltrada }) => {
  // estado para guardar la checkList
  const [checkList, setCheckList] = useState([]);

  // consulta para traer los datos de la checkList
  useEffect(() => {
    const fetchCheck = async () => {
      const token = sessionStorage.getItem("token");

      const fechaHoy = new Date();

      const dia = ("0" + fechaHoy.getDate()).slice(-2);
      const mes = ("0" + (fechaHoy.getMonth() + 1)).slice(-2);
      const anio = fechaHoy.getFullYear();

      try {
        const response = await fetch("/api/geo/checklista", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            Token: token,
            Fecha: fechaFiltrada,
          }),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCheckList(
          data.map((item) => ({
            coordinates: [item.latitud, item.longitud], 
            name: item.nombre, 
            fechaHora: item.fechaHora,
          }))
        );
      } catch (error) {
        console.error("Hubo un error al realizar la solicitud: ", error);
      }
    };

    fetchCheck();
  }, [fechaFiltrada]);

  return (
    <section className="container py-5">
      <MapContainer
        center={
          checkList.length > 0 && checkList[0].coordinates
            ? checkList[0].coordinates
            : [-26.8293153, -65.2061862]
        }
        zoom={20}
        style={{ height: "400px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {checkList.length > 0 &&
          checkList.map((marker, index) => (
            <Marker key={index} position={marker.coordinates} icon={customIcon}>
              <Popup>
                <div>
                  <p>
                    <strong>Asesor:</strong> {marker.name}
                  </p>
                  <p>
                    <strong>Fecha:</strong> {marker.fechaHora}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </section>
  );
};

export default MapComponent;
