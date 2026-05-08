import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 3002 });

wss.on("connection", (ws) => {
	console.log("Client connected");

	ws.on("message", (msg) => {
		const data = JSON.parse(msg.toString());
		console.log("Received:", data);

		// optional broadcast example:
		wss.clients.forEach((client) => {
			if (client.readyState === 1) {
				client.send(JSON.stringify(data));
			}
		});
	});
});

console.log("WebSocket server running on ws://localhost:3002");
