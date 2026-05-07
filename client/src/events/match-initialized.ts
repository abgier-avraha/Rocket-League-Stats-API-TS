import type { MatchRef } from "./shared";

export type MatchInitializedEvent = {
	Event: "MatchInitialized";
	Data: MatchRef;
};
