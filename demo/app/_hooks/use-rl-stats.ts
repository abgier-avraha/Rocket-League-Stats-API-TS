import { useEffect, useRef, useState } from "react";
import { RlStatsApiClient, RlStatsEvent } from 'rl-stats-api-client'

export function useRlStats(opts: {
  port?: number, host?: "localhost"
}) {
  const clientRef = useRef<RlStatsApiClient | undefined>(undefined);
  const [connected, setConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<RlStatsEvent | undefined>(undefined);

  if (!clientRef.current) {
    clientRef.current = new RlStatsApiClient();
  }

  const client = clientRef.current;

  useEffect(() => {
    const unsubOpen = client.onOpen(() => setConnected(true));
    const unsubClose = client.onClose(() => setConnected(false));
    const unsubEvent = client.onEvent(setLastEvent);

    client.open(opts.port, opts.host);

    return () => {
      unsubOpen();
      unsubClose();
      unsubEvent();
      client.close();
    };
  }, [client]);

  return {
    connected,
    lastEvent,
  };
}