import net from "node:net";
import { WebSocketServer } from "ws";

// TODO: sensible defaults and prccess args
const BRIDGE_SERVER_PORT = 3001;
const RL_SERVER_HOST = "172.27.192.1";
const RL_SERVER_PORT = 49123;

export function startBridgeServer() {
	const wss = new WebSocketServer({ port: BRIDGE_SERVER_PORT });

	console.log(`Bridge server running on port ${BRIDGE_SERVER_PORT}`);

	const socket = net.createConnection({
		host: RL_SERVER_HOST,
		port: RL_SERVER_PORT,
	});

	socket.on("connect", () => {
		console.log("Connected to RL Stats TCP stream");
	});

	socket.on("data", (data: Buffer) => {
		const text = data.toString("utf-8");

		console.debug(JSON.parse(text));
		console.log(
			`Bridge received message, forwarding to ${wss.clients.size} web socket clients`,
		);

		for (const client of wss.clients) {
			if (client.readyState === 1) {
				client.send(text);
			}
		}
	});

	socket.on("error", (err) => {
		console.error("TCP error:", err);
	});

	socket.on("close", () => {
		console.log("TCP connection closed");
	});
}
