import net from "node:net";
import { WebSocketServer, WebSocket } from "ws";

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
	private reconnectTimer: NodeJS.Timeout | null = null;

	constructor(private config: BridgeConfig) {
		this.wss = new WebSocketServer({ port: config.port });

		console.log(`Bridge server running on port ${config.port}`);

		this.setupShutdown();
	}

	public connect() {
		if (this.isShuttingDown) return;

		// Prevent duplicate sockets
		if (this.socket) {
			this.socket.destroy();
			this.socket = null;
		}

		this.socket = net.createConnection({
			host: this.config.rlhost,
			port: this.config.rlport,
			timeout: 5000,
		});

		this.socket.on("connect", this.onConnect);
		this.socket.on("data", this.onData);
		this.socket.on("error", this.onError);
		this.socket.on("close", this.onClose);
	}

	private onConnect = () => {
		console.log("Connected to RL Stats TCP stream");

		this.buffer = "";

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}
	};

	private onData = (data: Buffer) => {
		this.buffer += data.toString("utf-8");

		const messages: unknown[] = [];

		let start = this.buffer.indexOf("{");

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

			// Incomplete JSON object
			if (end === -1) break;

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

			this.buffer = this.buffer.slice(end);

			start = this.buffer.indexOf("{");
		}

		for (const msg of messages) {
			console.log(
				`Forwarding message to ${this.wss.clients.size} websocket clients`,
			);

			this.broadcast(msg);
		}
	};

	private broadcast(msg: unknown) {
		const payload = JSON.stringify(msg);

		for (const client of this.wss.clients) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(payload);
			}
		}
	}

	private onError = (err: Error) => {
		if (this.isShuttingDown) return;

		console.error("TCP error:", err.message);
	};

	private onClose = () => {
		console.log("RL Stats TCP stream connection was closed");

		this.socket = null;

		if (this.isShuttingDown) {
			console.log("Skipping reconnect because server is shutting down");
			return;
		}

		// Prevent multiple reconnect timers
		if (this.reconnectTimer) return;

		this.reconnectTimer = setTimeout(() => {
			this.reconnectTimer = null;

			if (this.isShuttingDown) return;

			console.log("Attempting to reconnect...");
			this.connect();
		}, 3000);
	};

	private setupShutdown() {
		process.on("SIGINT", this.shutdown);
		process.on("SIGTERM", this.shutdown);
	}

	private shutdown = () => {
		if (this.isShuttingDown) return;

		console.log("Shutting down...");

		this.isShuttingDown = true;

		if (this.reconnectTimer) {
			clearTimeout(this.reconnectTimer);
			this.reconnectTimer = null;
		}

		if (this.socket) {
			this.socket.destroy();
			this.socket = null;
		}

		this.wss.close(() => {
			process.exit(0);
		});

		// Fallback
		setTimeout(() => {
			process.exit(0);
		}, 2000);
	};
}
