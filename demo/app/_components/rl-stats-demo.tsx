'use client';

import { useRlStats } from "../_hooks/use-rl-stats";

export function RlStatsDemo() {
  const { connected, lastEvent } = useRlStats({
    port: 3001,
    host: "localhost",
  });

  return (
    <div>
      <h1>Rocket League Stats</h1>

      <p>Status: {connected ? "🟢 Connected" : "🔴 Disconnected"}</p>

      <pre>{JSON.stringify(lastEvent, null, 2)}</pre>
    </div>
  );
}