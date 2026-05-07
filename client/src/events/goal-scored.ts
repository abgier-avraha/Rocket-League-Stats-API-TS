import type { MatchRef, Vector3, PlayerRef } from "./shared";

export type GoalScoredEvent = {
	Event: "GoalScored";
	Data: MatchRef & {
		GoalSpeed: number;
		GoalTime: number;
		ImpactLocation: Vector3;

		Scorer: PlayerRef;
		Assister: PlayerRef | null;

		BallLastTouch: {
			Player: PlayerRef;
			Speed: number;
		};
	};
};
