import { useRef, useEffect, useState } from "react";

export type OverlayMessage =
	| {
			type: "set_match_title";
			value: string;
	  }
	| {
			type: "set_series_info";
			value: {
				currentGame: number;
				seriesLength: number;
				leftTeamWins: number;
				rightTeamWins: number;
			};
	  }
	| {
			type: "set_team_names";
			value: {
				leftTeamName: string;
				rightTeamName: string;
			};
	  };

export type OverlayState = {
	matchTitle: string;
	currentGame: number;
	seriesLength: number;
	leftTeamWins: number;
	rightTeamWins: number;
	leftTeamName: string;
	rightTeamName: string;
};

export function useRemoteController(url = "ws://localhost:3002") {
	const ws = useRef<WebSocket | null>(null);

	useEffect(() => {
		ws.current = new WebSocket(url);

		return () => {
			ws.current?.close();
		};
	}, [url]);

	function send(message: OverlayMessage) {
		if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
		ws.current.send(JSON.stringify(message));
	}

	return {
		setMatchTitle: (value: string) => send({ type: "set_match_title", value }),
		setSeriesInfo: (value: {
			currentGame: number;
			seriesLength: number;
			leftTeamWins: number;
			rightTeamWins: number;
		}) => send({ type: "set_series_info", value }),
		setTeamNames: (value: { leftTeamName: string; rightTeamName: string }) =>
			send({ type: "set_team_names", value }),
	};
}

export function useRemoteReader(url = "ws://localhost:3002") {
	const ws = useRef<WebSocket | null>(null);

	const [overlay, setOverlay] = useState<OverlayState>({
		matchTitle: "",
		currentGame: 1,
		leftTeamWins: 0,
		rightTeamWins: 0,
		seriesLength: 1,
		leftTeamName: "",
		rightTeamName: "",
	});

	useEffect(() => {
		ws.current = new WebSocket(url);

		ws.current.onmessage = (event) => {
			const msg: OverlayMessage = JSON.parse(event.data);

			if (msg.type === "set_match_title") {
				setOverlay((o) => ({
					...o,
					matchTitle: msg.value,
				}));
			}
			if (msg.type === "set_series_info") {
				setOverlay((o) => ({
					...o,
					currentGame: msg.value.currentGame,
					leftTeamWins: msg.value.leftTeamWins,
					rightTeamWins: msg.value.rightTeamWins,
					seriesLength: msg.value.seriesLength,
				}));
			}
			if (msg.type === "set_team_names") {
				setOverlay((o) => ({
					...o,
					leftTeamName: msg.value.leftTeamName,
					rightTeamName: msg.value.rightTeamName,
				}));
			}
		};

		return () => {
			ws.current?.close();
		};
	}, [url]);

	return overlay;
}
