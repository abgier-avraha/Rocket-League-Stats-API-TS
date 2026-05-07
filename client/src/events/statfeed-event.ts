import type { MatchRef, PlayerRef } from "./shared";

export type StatfeedEvent = {
	Event: "StatfeedEvent";
	Data: MatchRef & {
		EventName: string;
		Type: string;

		MainTarget: PlayerRef;
		SecondaryTarget: PlayerRef | null;
	};
};
