import { useState } from 'react';
import WebSocketListener from '../components/WebSocketListener';

function DeliveryTracker() {
  const [posicao, setPosicao] = useState(null);

  const handleNovaPosicao = (novaPosicao) => {
    console.log('Nova posição recebida:', novaPosicao);
    setPosicao(novaPosicao);
  };

  return (
    <div>
      <WebSocketListener onMessage={handleNovaPosicao} />

      <h2>📦 Rastreamento em tempo real</h2>

      {posicao ? (
        <div>
          <p><strong>Entregador:</strong> {posicao.entregador}</p>
          <p><strong>Status:</strong> {posicao.status}</p>
          <p><strong>Latitude:</strong> {posicao.latitude}</p>
          <p><strong>Longitude:</strong> {posicao.longitude}</p>
        </div>
      ) : (
        <p>Aguardando dados do entregador...</p>
      )}
    </div>
  );
}

export default DeliveryTracker;
