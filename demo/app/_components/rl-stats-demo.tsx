'use client';

import { useState } from "react";
import { useRlStats } from "../_hooks/use-rl-stats";
import { RlStatsEvent } from "rl-stats-api-client";

export function RlStatsDemo() {
  const [lastEvent, setLastEvent] = useState<RlStatsEvent>()
  const { connected } = useRlStats({
    port: 3001,
    host: "localhost",
    onEvent: (e) => {
      console.log(e)
      setLastEvent(e)
    }
  });

  return (
    <div>
      <h1>Rocket League Stats</h1>

      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <pre>{JSON.stringify(lastEvent, null, 2)}</pre>
    </div>
  );
}