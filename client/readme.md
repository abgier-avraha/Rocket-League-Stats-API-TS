# Rocket League Stats API TS

<table>
<tr>
<td><strong>Bridge</strong></td>
<td>

[![npm version](https://img.shields.io/npm/v/rl-ts-bridge?style=flat-square)](https://www.npmjs.com/package/rl-ts-bridge)

</td>
</tr>

<tr>
<td><strong>Client</strong></td>
<td>

[![npm version](https://img.shields.io/npm/v/rl-ts-client?style=flat-square)](https://www.npmjs.com/package/rl-ts-client)

</td>
</tr>
</table>

This repo provides a bridge server and client library for building web based applications that stream live Rocket League game data.

The events are fully typed within the client library. [Find them here.](./client/src/events)

## Quickstart

### 1. Start Bridge Server

The bridge server forwards rocket league game data to a web socket server.

Simply run `npx rl-ts-bridge` to start the bridge
- Optionally specify the port the bridge server runs on with `--port 3333`
- Optionally specify the port the bridge is pointing tod for Rocket League Stats using API `--rlport 49123`
- Optionally specify the host the bridge is pointing to for Rocket League Stats using API `--rlhost 172.27.192.1`

You should immediately see a stream of events if your game is running.


### 2. Integrate the Bridge Client

1. Install the package `npm install rl-ts-client`
2. Connect and listen for events.
    ```ts
    function disposableListener() {
      const unsubOpen = client.onOpen(() => setConnected(true));
      const unsubClose = client.onClose(() => setConnected(false));

      const unsubEvent = client.onEvent((event) => {
        // Handle the event
        console.log(event)
      });

      client.open(opts.port, opts.host);

      return () => {
        unSubOpen();
        unsubClose();
        unsubEvent();
      }
    }

    const dispose = disposableListener();
    ```

### React Hook Example

You can write a simple hook for React like this. [Example source code can be found here](./demo/README.md).

```ts 
// use-rl-stats.ts

import { useEffect, useRef, useState } from "react";
import { RlStatsApiClient, RlStatsEvent } from "rl-ts-client";

type UseRlStatsOptions = {
  port?: number;
  host?: string;
  onEvent?: (event: RlStatsEvent) => void;
};

export function useRlStats(opts: UseRlStatsOptions = {}) {
  const clientRef = useRef<RlStatsApiClient | null>(null);
  const [connected, setConnected] = useState(false);

  // init once
  if (!clientRef.current) {
    clientRef.current = new RlStatsApiClient();
  }

  const client = clientRef.current;

  useEffect(() => {
    const unsubOpen = client.onOpen(() => setConnected(true));
    const unsubClose = client.onClose(() => setConnected(false));

    const unsubEvent = client.onEvent((event) => {
      opts.onEvent?.(event);
    });

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
  };
}
```

```ts
// rl-stats-demo.tsx

'use client';

import { useState } from "react";
import { useRlStats } from "../_hooks/use-rl-stats";
import { RlStatsEvent } from "rl-ts-client";

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
```
