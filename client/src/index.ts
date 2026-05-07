import type { RlStatsEvent } from "./events";

export { RlStatsEvent } from "./events";

export class RlStatsApiClient {
	private ws?: WebSocket;

	private shouldReconnect = true;
	private reconnectAttempt = 0;

	private onOpenCallbacks = new Set<() => void>();
	private onCloseCallbacks = new Set<() => void>();
	private onEventCallbacks = new Set<(e: RlStatsEvent) => void>();

	open(port = 3001, host = "localhost") {
		this.shouldReconnect = true;
		this.connect(port, host);
	}

	private connect(port: number, host: string) {
		this.ws = new WebSocket(`ws://${host}:${port}`);

		this.ws.onopen = () => {
			this.reconnectAttempt = 0;

			this.onOpenCallbacks.forEach((cb) => cb());
		};

		this.ws.onclose = () => {
			this.onCloseCallbacks.forEach((cb) => cb());

			if (this.shouldReconnect) {
				this.scheduleReconnect(port, host);
			}
		};

		this.ws.onmessage = (event) => {
			try {
				const parsed = JSON.parse(event.data);
				this.onEventCallbacks.forEach((cb) => cb(parsed));
			} catch (error) {
				console.error("Error parsing / sending data", error);
			}
		};
	}

	private scheduleReconnect(port: number, host: string) {
		this.reconnectAttempt++;

		const delay = Math.min(1000 * 2 ** this.reconnectAttempt, 10000);

		setTimeout(() => {
			this.connect(port, host);
		}, delay);
	}

	close() {
		this.shouldReconnect = false;
		this.ws?.close();
	}

	// subscriptions
	onOpen(cb: () => void) {
		this.onOpenCallbacks.add(cb);
		return () => this.onOpenCallbacks.delete(cb);
	}

	onClose(cb: () => void) {
		this.onCloseCallbacks.add(cb);
		return () => this.onCloseCallbacks.delete(cb);
	}

	onEvent(cb: (e: RlStatsEvent) => void) {
		this.onEventCallbacks.add(cb);
		return () => this.onEventCallbacks.delete(cb);
	}
}
