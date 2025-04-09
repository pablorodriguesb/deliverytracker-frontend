import { useEffect, useState } from 'react';

function DeliveryTracker() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const socket = new WebSocket('ws://localhost:8080/ws/delivery');

    socket.onmessage = (event) => {
      const data = event.data;
      setMessage(data);
    };

    socket.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
    };

    return () => socket.close();
  }, []);

  return (
    <div>
      <h2>📦 Rastreamento em tempo real</h2>
      <p>Status da entrega: {message}</p>
    </div>
  );
}

export default DeliveryTracker;