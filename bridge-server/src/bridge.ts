import net from "node:net";
import { WebSocketServer } from "ws";

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

	let buffer = "";

	socket.on("connect", () => {
		console.log("Connected to RL Stats TCP stream");
	});

	socket.on("data", (data: Buffer) => {
		buffer += data.toString("utf-8");

		const messages: any[] = [];

		let start = buffer.indexOf("{");

		while (start !== -1) {
			let open = 0;
			let end = -1;

			for (let i = start; i < buffer.length; i++) {
				if (buffer[i] === "{") open++;
				if (buffer[i] === "}") open--;

				if (open === 0) {
					end = i + 1;
					break;
				}
			}

			if (end === -1) break;

			const raw = buffer.slice(start, end);

			try {
				const parsed = JSON.parse(raw);
				messages.push(parsed);
			} catch (err) {
				console.warn("Failed to parse frame:", raw);
			}

			buffer = buffer.slice(end);
			start = buffer.indexOf("{");
		}

		for (const msg of messages) {
			console.debug(msg);

			console.log(
				`Bridge received message, forwarding to ${wss.clients.size} web socket clients`,
			);

			for (const client of wss.clients) {
				if (client.readyState === 1) {
					client.send(JSON.stringify(msg));
				}
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