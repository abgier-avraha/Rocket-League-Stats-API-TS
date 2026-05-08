import type { BallHitEvent } from "./ball-hit";
import type { ClockUpdatedSecondsEvent } from "./clock-updated-seconds";
import type { CountdownBeginEvent } from "./countdown-begin";
import type { CrossbarHitEvent } from "./crossbar-hit";
import type {
	GoalReplayStartEvent,
	GoalReplayEndEvent,
	GoalReplayWillEndEvent,
} from "./goal-replay-end";
import type { GoalScoredEvent } from "./goal-scored";
import type { MatchCreatedEvent } from "./match-created";
import type { MatchDestroyedEvent } from "./match-destroyed";
import type { MatchEndedEvent } from "./match-ended";
import type { MatchInitializedEvent } from "./match-initialized";
import type { MatchPausedEvent } from "./match-paused";
import type { MatchUnpausedEvent } from "./match-unpaused";
import type { PodiumStartEvent } from "./podium-start";
import type { ReplayCreatedEvent } from "./replay-created";
import type { RoundStartedEvent } from "./round-started";
import type { StatfeedEvent } from "./statfeed-event";
import type { UpdateStateEvent } from "./update-state";

export type { BallHitEvent } from "./ball-hit";
export type { ClockUpdatedSecondsEvent } from "./clock-updated-seconds";
export type { CountdownBeginEvent } from "./countdown-begin";
export type { CrossbarHitEvent } from "./crossbar-hit";
export type {
	GoalReplayStartEvent,
	GoalReplayEndEvent,
	GoalReplayWillEndEvent,
} from "./goal-replay-end";
export type { GoalScoredEvent } from "./goal-scored";
export type { MatchCreatedEvent } from "./match-created";
export type { MatchDestroyedEvent } from "./match-destroyed";
export type { MatchEndedEvent } from "./match-ended";
export type { MatchInitializedEvent } from "./match-initialized";
export type { MatchPausedEvent } from "./match-paused";
export type { MatchUnpausedEvent } from "./match-unpaused";
export type { PodiumStartEvent } from "./podium-start";
export type { ReplayCreatedEvent } from "./replay-created";
export type { RoundStartedEvent } from "./round-started";
export type { StatfeedEvent } from "./statfeed-event";
export type { UpdateStateEvent } from "./update-state";

export type RlStatsEvent =
	| UpdateStateEvent
	| BallHitEvent
	| CrossbarHitEvent
	| ClockUpdatedSecondsEvent
	| CountdownBeginEvent
	| GoalScoredEvent
	| GoalReplayStartEvent
	| GoalReplayEndEvent
	| GoalReplayWillEndEvent
	| MatchCreatedEvent
	| MatchInitializedEvent
	| MatchDestroyedEvent
	| MatchEndedEvent
	| MatchPausedEvent
	| MatchUnpausedEvent
	| PodiumStartEvent
	| ReplayCreatedEvent
	| RoundStartedEvent
	| StatfeedEvent;
