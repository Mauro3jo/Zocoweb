// import hooks
import React, { useEffect, useState } from "react";

// librerias
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

const MapComponent2 = () => {
  // estado para la checkList
  const [checkList, setCheckList] = useState([]);

    // consulta para el checkList para la imagen asesor
  useEffect(() => {
    const fetchCheck = async () => {
      try {
        // Recuperar el token del sessionStorage
        const token = sessionStorage.getItem("token");

        // Verificar si el token existe antes de hacer la llamada fetch
        if (!token) {
          console.log("Token no encontrado");
          return;
        }

        // Ajusta la URL '/api/geo/checklistaimagenasesor' según sea necesario
        const response = await fetch("/api/geo/checklistaimagenasesor", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Token: token }), // Enviar el token en el cuerpo de la solicitud
        });
        const data = await response.json();
        setCheckList(
          data.map((item) => ({
            coordinates: [item.latitud, item.longitud], 
            name: item.nombre, 
            fechaHora: item.fechaHora,
          }))
        );
 

      } catch (error) {
      }
    };

    fetchCheck();
  }, []);

  return (
    <section className="container py-5">
      <MapContainer
        center={
          checkList.length > 0
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
        {checkList.map((marker, index) => (
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

export default MapComponent2;
