import type { MatchRef } from "./shared";

export type CountdownBeginEvent = {
	Event: "CountdownBegin";
	Data: MatchRef;
};
