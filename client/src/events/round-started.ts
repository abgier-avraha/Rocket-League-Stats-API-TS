import type { MatchRef } from "./shared";

export type RoundStartedEvent = {
	Event: "RoundStarted";
	Data: MatchRef;
};
