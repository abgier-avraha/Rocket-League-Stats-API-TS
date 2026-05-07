import type { MatchRef } from "./shared";

export type PodiumStartEvent = {
	Event: "PodiumStart";
	Data: MatchRef;
};
