import { useEffect, useRef, useState } from "react";
import { RlStatsApiClient } from "rl-ts-client";
import type { RlStatsEvent } from "rl-ts-client/events";

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

	// biome-ignore lint/correctness/useExhaustiveDependencies: run once
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
	}, []);

	return {
		connected,
	};
}
