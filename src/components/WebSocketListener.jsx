import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function WebSocketListener({ onMessage, id }) {
  useEffect(() => {
    if (!id) {
      console.error("ID do entregador não definido");
      return;
    }

    const socketUrl = `http://localhost:8080/ws-location/${id}`;  // Definindo corretamente a URL sem token
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP DEBUG]", str),
      onConnect: () => {
        console.log("WebSocket conectado.");
        stompClient.subscribe("/topic/updates", (message) => {
          const posicao = JSON.parse(message.body);
          onMessage(posicao);
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [onMessage, id]);

  return null;
}

export default WebSocketListener;
