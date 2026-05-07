import type { MatchRef } from "./shared";

export type MatchPausedEvent = {
	Event: "MatchPaused";
	Data: MatchRef;
};
