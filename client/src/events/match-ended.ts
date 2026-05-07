import type { MatchRef } from "./shared";

export type MatchEndedEvent = {
	Event: "MatchEnded";
	Data: MatchRef & {
		WinnerTeamNum: number;
	};
};
