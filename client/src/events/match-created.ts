import type { MatchRef } from "./shared";

export type MatchCreatedEvent = {
	Event: "MatchCreated";
	Data: MatchRef;
};
