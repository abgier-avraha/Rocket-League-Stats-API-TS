import net from "node:net";
import { WebSocketServer } from "ws";

export function startBridgeServer(config: {
	port: number;
	rlhost: string;
	rlport: number;
}) {
	const wss = new WebSocketServer({ port: config.port });

	console.log(`Bridge server running on port ${config.port}`);

	const socket = net.createConnection({
		host: config.rlhost,
		port: config.rlport,
	});

	let buffer = "";

	socket.on("connect", () => {
		console.log("Connected to RL Stats TCP stream");
	});

	socket.on("data", (data: Buffer) => {
		buffer += data.toString("utf-8");

		const messages: unknown[] = [];

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
				const event = JSON.parse(raw);
				const parsed = {
					Event: event.Event,
					Data: JSON.parse(event.Data),
				};
				messages.push(parsed);
			} catch (err: unknown) {
				console.warn("Failed to parse frame:", err, raw);
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
