// src/contexts/WebsocketContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import type { ReactNode } from "react";
import { config } from "../config";

export type WSMessage = { event: string; data: any };

export interface WSContextType {
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
  onEvent: (handler: (msg: WSMessage) => void) => () => void;
}

const WSContext = createContext<WSContextType | null>(null);

export const WebsocketProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const socketRef = useRef<WebSocket | null>(null);
  const handlersRef = useRef<((msg: WSMessage) => void)[]>([]);

  // mount socket once
  useEffect(() => {
    const url = config.wsUrl.replace(/^http/, "ws") + "/ws";
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => console.log("[WS] Connected to", url);
    ws.onmessage = ({ data }) => {
      let msg: WSMessage;
      try {
        msg = JSON.parse(data);
      } catch {
        return;
      }
      handlersRef.current.forEach((h) => h(msg));
    };
    ws.onerror = (e) => console.error("[WS] Error", e);
    ws.onclose = () => console.log("[WS] Disconnected");

    return () => ws.close();
  }, []);

  // stable methods
  const joinRoom = useCallback((room: string) => {
    socketRef.current?.send(JSON.stringify({ event: "join", data: room }));
  }, []);

  const leaveRoom = useCallback((room: string) => {
    socketRef.current?.send(JSON.stringify({ event: "leave", data: room }));
  }, []);

  const onEvent = useCallback((handler: (msg: WSMessage) => void) => {
    handlersRef.current.push(handler);
    return () => {
      handlersRef.current = handlersRef.current.filter((h) => h !== handler);
    };
  }, []);

  // memoize context value
  const ctx = useMemo(
    () => ({ joinRoom, leaveRoom, onEvent }),
    [joinRoom, leaveRoom, onEvent]
  );

  return <WSContext.Provider value={ctx}>{children}</WSContext.Provider>;
};

export function useWebsocket() {
  const ctx = useContext(WSContext);
  if (!ctx) throw new Error("Missing WebsocketProvider");
  return ctx;
}
