import net from "node:net";
import { WebSocketServer } from "ws";

type BridgeConfig = {
	port: number;
	rlhost: string;
	rlport: number;
};

export class BridgeServer {
	private wss: WebSocketServer;
	private socket: net.Socket | null = null;
	private buffer = "";
	private isShuttingDown = false;

	constructor(private config: BridgeConfig) {
		this.wss = new WebSocketServer({ port: config.port });

		console.log(`Bridge server running on port ${config.port}`);

		this.setupShutdown();
	}

	public connect() {
		if (this.isShuttingDown) return;

		this.socket = net.createConnection({
			host: this.config.rlhost,
			port: this.config.rlport,
		});

		this.socket.on("connect", this.onConnect);
		this.socket.on("data", this.onData);
		this.socket.on("error", this.onError);
		this.socket.on("close", this.onClose);
	}

	private onConnect = () => {
		console.log("Connected to RL Stats TCP stream");
		this.buffer = "";
	};

	private onData = (data: Buffer) => {
		this.buffer += data.toString("utf-8");

		const messages: unknown[] = [];

		let start = this.buffer.indexOf("{");

		/*
			Read through buffer until a json object is completed
			then slice it out of buffer.
		*/
		while (start !== -1) {
			let open = 0;
			let end = -1;

			for (let i = start; i < this.buffer.length; i++) {
				if (this.buffer[i] === "{") open++;
				else if (this.buffer[i] === "}") open--;

				if (open === 0) {
					end = i + 1;
					break;
				}
			}

			// Break if no end to json object yet
			if (end === -1) break;

			// Get the json object
			const raw = this.buffer.slice(start, end);

			try {
				const event = JSON.parse(raw);

				const parsed = {
					Event: event.Event,
					Data: JSON.parse(event.Data),
				};

				messages.push(parsed);
			} catch (err) {
				console.warn("Failed to parse frame:", err, raw);
			}

			// Remove the object from the buffer
			this.buffer = this.buffer.slice(end);

			// Check if the start of another object was in the frame
			start = this.buffer.indexOf("{");
		}

		for (const msg of messages) {
			console.debug(msg);

			console.log(
				`Bridge received message, forwarding to ${this.wss.clients.size} websocket clients`,
			);

			this.broadcast(msg);
		}
	};

	private broadcast(msg: unknown) {
		const payload = JSON.stringify(msg);

		for (const client of this.wss.clients) {
			if (client.readyState === 1) {
				client.send(payload);
			}
		}
	}

	private onError = (err: Error) => {
		console.error("TCP error:", err);
	};

	private onClose = () => {
		console.log("RL Stats TCP stream connection was closed");

		if (this.isShuttingDown) return;

		setTimeout(() => {
			console.log("Attempting to reconnect...");
			this.connect();
		}, 3000);
	};

	private setupShutdown() {
		process.on("SIGINT", () => {
			console.log("Shutting down...");
			this.isShuttingDown = true;

			if (this.socket) {
				this.socket.removeAllListeners();
				this.socket.destroy();
				this.socket = null;
			}

			this.wss.close(() => {
				process.exit(0);
			});
		});
	}
}
