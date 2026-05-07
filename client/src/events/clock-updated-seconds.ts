import type { MatchRef } from "./shared";

export type ClockUpdatedSecondsEvent = {
	Event: "ClockUpdatedSeconds";
	Data: MatchRef & {
		TimeSeconds: number;
		bOvertime: boolean;
	};
};
