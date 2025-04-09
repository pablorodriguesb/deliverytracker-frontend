import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import axios from 'axios';
import L from 'leaflet';

import WebSocketListener from "../components/WebSocketListener";

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrige os ícones padrão do Leaflet no React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapaRastreamento() {
  const [rotas, setRotas] = useState([]);
  const [posicaoAtual, setPosicaoAtual] = useState(null);
  const [entregadorSelecionado, setEntregadorSelecionado] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  // Requisição inicial das rotas
  useEffect(() => {
    axios.get('http://localhost:8080/api/rotas')
      .then(response => {
        setRotas(response.data);
        setPosicaoAtual(response.data[0]);
      })
      .catch(error => console.error('Erro ao buscar rotas:', error));
  }, []);

  // Recebe atualização em tempo real do WebSocket
  const handleNovaPosicao = (novaPosicao) => {
    setPosicaoAtual(novaPosicao);
    setRotas(prev => [...prev, novaPosicao]); // adiciona à lista de rotas
  };

  // Simulação de entregadores únicos
  const entregadoresUnicos = [...new Map(rotas.map(r => [r.entregador?.id, r.entregador])).values()];

  // Filtro por entregador e status
  const rotasFiltradas = rotas.filter(r =>
    (!entregadorSelecionado || r.entregador?.id === entregadorSelecionado) &&
    (!statusFiltro || r.entregador?.status === statusFiltro)
  );

  return (
    <div style={{ display: 'flex' }}>
      {/* WebSocket ativo */}
      <WebSocketListener onMessage={handleNovaPosicao} />

      {/* Painel de controle */}
      <div style={{ width: '300px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Gestão de Entregadores</h2>

        <label>Selecionar Entregador:</label>
        <select
          value={entregadorSelecionado}
          onChange={(e) => setEntregadorSelecionado(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <option value="">Todos</option>
          {entregadoresUnicos
            .filter(ent => ent?.id !== undefined)
            .map(ent => (
              <option key={ent.id} value={ent.id}>
                {ent.nome || `ID ${ent.id}`}
              </option>
            ))}

        </select>

        <label>Filtrar por Status:</label>
        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          style={{ width: '100%' }}
        >
          <option value="">Todos</option>
          <option value="ativo">Ativo</option>
          <option value="inativo">Inativo</option>
          <option value="em_rota">Em Rota</option>
        </select>
      </div>

      {/* Mapa */}
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center' }}>Rastreamento em Tempo Real</h1>

        <MapContainer center={[-23.5, -47.3]} zoom={13} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* Polyline da rota filtrada */}
          {rotasFiltradas.length > 1 && (
            <Polyline
              positions={rotasFiltradas.map(ponto => [ponto.latitude, ponto.longitude])}
              color="blue"
            />
          )}

          {/* Posição atual */}
          {posicaoAtual?.latitude && posicaoAtual?.longitude && (
            <Marker position={[posicaoAtual.latitude, posicaoAtual.longitude]}>
              <Popup>
                Entregador ID: {posicaoAtual.entregador?.id}<br />
                Coordenadas: {posicaoAtual.latitude}, {posicaoAtual.longitude}
              </Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapaRastreamento;
