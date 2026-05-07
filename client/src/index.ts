export type RlStatsEvent = unknown

export class RlStatsApiClient {
	private ws?: WebSocket;

	private onOpenCallbacks = new Set<() => void>();
	private onCloseCallbacks = new Set<() => void>();
	private onEventCallbacks = new Set<(e: unknown) => void>();

	open(port = 3001, host = "localhost") {
		this.ws = new WebSocket(`ws://${host}:${port}`);

		this.ws.onopen = () => {
			Array.from(this.onOpenCallbacks.values()).forEach((cb) => {
				cb();
			});
		};

		this.ws.onclose = () => {
			Array.from(this.onCloseCallbacks.values()).forEach((cb) => {
				cb();
			});
		};

		this.ws.onmessage = (event) => {
			try {
				Array.from(this.onEventCallbacks.values()).forEach((cb) => {
          const parsed = JSON.parse(event.data);
          // TODO: types with discrim
					cb({
            Event: parsed.Event,
            Data: JSON.parse(parsed.Data)
          });
				});
			} catch {
				Array.from(this.onEventCallbacks.values()).forEach((cb) => {
					cb({ raw: event.data });
				});
			}
		};
	}

	close() {
		this.ws?.close();
	}

	// public subscriptions
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
