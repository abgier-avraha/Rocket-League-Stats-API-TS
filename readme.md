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


### 1. Configure Your RL Stats API Port

[Configuration docs here](https://www.rocketleague.com/en/developer/stats-api#overview).

### 2. Start Bridge Server

The bridge server forwards rocket league game data to a web socket server.

Simply run `npx rl-ts-bridge` to start the bridge
- Optionally specify the port the bridge server runs on with `--port 3333`
- Optionally specify the port the bridge is pointing to for Rocket League Stats API with `--rlport 49123`
- Optionally specify the host the bridge is pointing to for Rocket League Stats API with `--rlhost 172.27.192.1`

You should immediately see a stream of events if your game is running.


### 3. Integrate the Bridge Client

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

### React Example for Stream Overlay with Remote Control Page

[Example repo with stream overlay and remote  controls](./demo/README.md).

![](./images/overlay.png)

![](./images/overlay-remote.png)