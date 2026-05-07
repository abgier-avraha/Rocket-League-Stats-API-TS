import type { MatchRef } from "./shared";

export type ReplayCreatedEvent = {
	Event: "ReplayCreated";
	Data: MatchRef;
};
