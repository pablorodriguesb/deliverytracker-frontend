import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';


// Corrige o ícone padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapaRastreamento() {
  const [rotas, setRotas] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:8080/api/rotas') // pegar todas as rotas
      .then(response => setRotas(response.data))
      .catch(error => console.error('Erro ao buscar rotas:', error));
  }, []);

  return (
    <div>
      <h1>Página de Rastreamento em Tempo Real</h1>

      <MapContainer center={[-23.5, -47.3]} zoom={12} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {rotas.map((rota) => (
          <Marker key={rota.id} position={[rota.latitude, rota.longitude]}>
            <Popup>
              Entregador ID: {rota.entregador?.id}<br />
              Coordenadas: {rota.latitude}, {rota.longitude}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default MapaRastreamento;
