import type { MatchRef } from "./shared";

export type MatchUnpausedEvent = {
	Event: "MatchUnpaused";
	Data: MatchRef;
};
