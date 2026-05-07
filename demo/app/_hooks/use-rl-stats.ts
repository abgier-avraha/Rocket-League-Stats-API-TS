import { useEffect, useRef, useState } from "react";
import { RlStatsApiClient, RlStatsEvent } from "rl-ts-stats-api-client";

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
	}, [client]);

	return {
		connected,
	};
}
