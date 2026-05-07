import type { MatchRef } from "./shared";

export type MatchDestroyedEvent = {
	Event: "MatchDestroyed";
	Data: MatchRef;
};
