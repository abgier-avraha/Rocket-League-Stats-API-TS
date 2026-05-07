import type { MatchRef, PlayerRef, Vector3 } from "./shared";

export type CrossbarHitEvent = {
	Event: "CrossbarHit";
	Data: MatchRef & {
		BallLocation: Vector3;
		BallSpeed: number;
		ImpactForce: number;
		BallLastTouch: {
			Player: PlayerRef;
			Speed: number;
		};
	};
};
