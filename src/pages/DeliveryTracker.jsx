import { useState } from 'react';
import WebSocketListener from '../components/WebSocketListener';
import Mapa from '../components/Mapa';

function DeliveryTracker() {
  const [posicoes, setPosicoes] = useState([]);

  const handleNovaPosicao = (novaPosicao) => {
    console.log('Nova posição recebida:', novaPosicao);
    setPosicoes((prev) => [...prev, novaPosicao]);
  };

  const ultimaPosicao = posicoes[posicoes.length - 1];

  return (
    <div style={{ padding: '1rem' }}>
      <WebSocketListener onMessage={handleNovaPosicao} />

      <h2 style={{ marginBottom: '1rem' }}>📦 Rastreamento em tempo real</h2>

      {ultimaPosicao ? (
        <div style={{ marginBottom: '2rem' }}>
          <p><strong>Entregador ID:</strong> {ultimaPosicao.entregadorId}</p>
          <p><strong>Latitude:</strong> {ultimaPosicao.latitude}</p>
          <p><strong>Longitude:</strong> {ultimaPosicao.longitude}</p>
        </div>
      ) : (
        <p style={{ marginBottom: '2rem' }}>Aguardando dados do entregador...</p>
      )}

      <Mapa pontos={posicoes} />
    </div>
  );
}

export default DeliveryTracker;
