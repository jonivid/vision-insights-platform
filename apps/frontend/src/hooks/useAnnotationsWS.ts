// src/hooks/useAnnotationsWS.ts
import { useEffect, useState } from "react";
import { useWebsocket } from "../contexts/WebSocketContext";
import type { WSMessage } from "../contexts/WebSocketContext";

export function useAnnotationsWS() {
  const { onEvent } = useWebsocket();
  const [tags, setTags] = useState<any[]>([]);

  useEffect(() => {
    // subscribe to incoming tag messages
    const off = onEvent((msg: WSMessage) => {
      if (msg.event === "tags") {
        setTags(msg.data);
      }
    });

    // cleanup subscription
    return () => off();
  }, [onEvent]);

  return tags;
}
