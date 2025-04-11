import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import WebSocketListener from "../components/WebSocketListener";

const Mapa = () => {
  const [pontos, setPontos] = useState([]);

  const handleNewPosicao = (posicao) => {
    console.log("Nova posição recebida:", posicao);
    setPontos((prevPontos) => {
      const pontosAtualizados = prevPontos.filter(p => p.entregadorId !== posicao.entregadorId);
      return [...pontosAtualizados, posicao];
    });
  };

  const rotasPorEntregador = pontos.reduce((acc, ponto) => {
    const id = ponto.entregadorId ?? "desconhecido";
    if (!acc[id]) acc[id] = [];
    acc[id].push([ponto.latitude, ponto.longitude]);
    return acc;
  }, {});

  return (
    <div>
      <WebSocketListener onMessage={handleNewPosicao} />

      <MapContainer center={[-22.7512, -47.3325]} zoom={15} style={{ height: "60vh", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {Object.entries(rotasPorEntregador).map(([id, pontos], index) => (
          <div key={id}>
            <Polyline positions={pontos} color={index % 2 === 0 ? "blue" : "green"} />
            <Marker position={pontos[pontos.length - 1]}>
              <Popup>Entregador {id}</Popup>
            </Marker>
          </div>
        ))}
      </MapContainer>
    </div>
  );
};

export default Mapa;
