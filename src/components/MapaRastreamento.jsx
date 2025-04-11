import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../services/api';

import WebSocketListener from "./WebSocketListener";

import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Corrige ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapaRastreamento() {
  // Estado principal: armazena as rotas agrupadas por entregador
  const [rotasPorEntregador, setRotasPorEntregador] = useState({});
  const [entregadorSelecionado, setEntregadorSelecionado] = useState('');
  const [statusFiltro, setStatusFiltro] = useState('');

  // Carrega as rotas do backend ao montar o componente
  useEffect(() => {
    api.get('/api/rotas')
      .then(response => {
        console.log("🔍 Dados do backend:", response.data);

        // Verifica se a resposta é um array
        if (Array.isArray(response.data)) {
          const agrupado = agruparPorEntregador(response.data);
          setRotasPorEntregador(agrupado);
        } else {
          console.error("Erro: Dados não são um array", response.data);
        }
      })
      .catch(error => console.error('Erro ao buscar rotas:', error));
  }, []);

  // Agrupa os pontos por entregador (objeto: { id: [pontos...] })
  const agruparPorEntregador = (dados) => {
    const mapa = {};
    dados.forEach(ponto => {
      const id = ponto.entregador?.id;
      if (!id) return;
      if (!mapa[id]) mapa[id] = [];
      mapa[id].push(ponto);
    });
    return mapa;
  };

  // WebSocket: atualiza a rota em tempo real
  const handleNovaPosicao = (novaPosicao) => {
    const id = novaPosicao.entregadorId;
    if (!id) return;

    setRotasPorEntregador(prev => ({
      ...prev,
      [id]: [...(prev[id] || []), {
        ...novaPosicao,
        entregador: { id },
      }]
    }));
  };

  // Gera a lista de entregadores únicos com base nas rotas recebidas
  const entregadores = Object.values(rotasPorEntregador)
    .map(pontos => pontos[0]?.entregador)
    .filter(ent => ent); // remove nulls

  // Aplica filtros de entregador e status
  const rotasFiltradas = Object.entries(rotasPorEntregador)
    .filter(([, pontos]) => {
      const entregador = pontos[0]?.entregador;
      return (!entregadorSelecionado || entregador?.id === parseInt(entregadorSelecionado)) &&
        (!statusFiltro || entregador?.status === statusFiltro);
    });

  return (
    <div style={{ display: 'flex' }}>
      {/* WebSocket: escuta mensagens em tempo real */}
      {entregadorSelecionado && (
        <WebSocketListener onMessage={handleNovaPosicao} id={entregadorSelecionado} />
      )}

      {/* Painel lateral com filtros */}
      <div style={{ width: '300px', padding: '20px', borderRight: '1px solid #ccc' }}>
        <h2>Gestão de Entregadores</h2>

        <label>Selecionar Entregador:</label>
        <select
          value={entregadorSelecionado}
          onChange={(e) => setEntregadorSelecionado(e.target.value)}
          style={{ width: '100%', marginBottom: '10px' }}
        >
          <option value="">Todos</option>
          {entregadores.map(ent => (
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
          <option value="ATIVO">Ativo</option>
          <option value="INATIVO">Inativo</option>
          <option value="EM_ROTA">Em Rota</option>
        </select>
      </div>

      {/* Área do mapa */}
      <div style={{ flex: 1 }}>
        <h1 style={{ textAlign: 'center' }}>Rastreamento em Tempo Real</h1>

        <MapContainer center={[-23.5, -47.3]} zoom={13} style={{ height: '500px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {rotasFiltradas.map(([id, pontos]) => {
            const ultimaPosicao = pontos[pontos.length - 1];
            return (
              <div key={id}>
                <Polyline
                  positions={pontos.map(p => [p.latitude, p.longitude])}
                  color="blue"
                />
                <Marker position={[ultimaPosicao.latitude, ultimaPosicao.longitude]}>
                  <Popup>
                    Entregador ID: {id}<br />
                    {ultimaPosicao.latitude}, {ultimaPosicao.longitude}
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default MapaRastreamento;
