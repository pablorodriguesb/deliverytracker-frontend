import { useEffect } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

function WebSocketListener({ onMessage }) {
  useEffect(() => {
    const socketUrl = "http://localhost:8080/ws-location";
    const stompClient = new Client({
      webSocketFactory: () => new SockJS(socketUrl),
      reconnectDelay: 5000,
      debug: (str) => console.log("[STOMP DEBUG]", str),
      onConnect: () => {
        console.log("WebSocket conectado.");
        stompClient.subscribe("/topic/posicoes", (message) => {
          const posicao = JSON.parse(message.body);
          onMessage(posicao);
        });
      },
      onStompError: (frame) => {
        console.error("Erro STOMP:", frame);
      },
    });

    stompClient.activate(); // ativa a conexão

    return () => {
      stompClient.deactivate(); // fecha a conexão corretamente
    };
  }, [onMessage]);

  return null;
}

export default WebSocketListener;
