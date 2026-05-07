import type { Player, GameState, MatchRef } from "./shared";

export type UpdateStateEvent = {
	Event: "UpdateState";
	Data: MatchRef & {
		Players: Player[];
		Game: GameState;
	};
};
