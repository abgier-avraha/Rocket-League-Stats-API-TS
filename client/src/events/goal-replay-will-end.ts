import type { MatchRef } from "./shared";

export type GoalReplayStartEvent = {
	Event: "GoalReplayStart";
	Data: MatchRef;
};

export type GoalReplayEndEvent = {
	Event: "GoalReplayEnd";
	Data: MatchRef;
};

export type GoalReplayWillEndEvent = {
	Event: "GoalReplayWillEnd";
	Data: MatchRef;
};
