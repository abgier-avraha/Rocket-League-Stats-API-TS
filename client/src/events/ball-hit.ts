import type { MatchRef, Player, Vector3 } from "./shared";

export type BallHitEvent = {
	Event: "BallHit";
	Data: MatchRef & {
		Players: Player[];
		Ball: {
			PreHitSpeed: number;
			PostHitSpeed: number;
			Location: Vector3;
		};
	};
};
