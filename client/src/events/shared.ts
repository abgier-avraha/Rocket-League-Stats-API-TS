export type Player = {
	Name: string;
	PrimaryId: string;
	Shortcut: number;
	TeamNum: number;
	Score: number;
	Goals: number;
	Shots: number;
	Assists: number;
	Saves: number;
	Touches: number;
	CarTouches: number;
	Demos: number;

	bHasCar: boolean;
	Speed: number;
	Boost: number;
	bBoosting: boolean;
	bOnGround: boolean;
	bOnWall: boolean;
	bPowersliding: boolean;
	bDemolished: boolean;
	bSupersonic: boolean;

	Attacker: Attacker | null;
};

export type MatchRef = {
	MatchGuid: string;
};

export type PlayerRef = {
	Name: string;
	Shortcut: number;
	TeamNum: number;
};

export type Attacker = {
	Name: string;
	Shortcut: number;
	TeamNum: number;
};

export type GameState = {
	Teams: Team[];
	TimeSeconds: number;
	bOvertime: boolean;
	Frame: number;
	Elapsed: number;

	Ball: BallState;

	bReplay: boolean;
	bHasWinner: boolean;
	Winner: string;

	Arena: string;

	bHasTarget: boolean;
	Target: Attacker | null;
};

export type Team = {
	Name: string;
	TeamNum: number;
	Score: number;
	ColorPrimary: string;
	ColorSecondary: string;
};

export type BallState = {
	Speed: number;
	TeamNum: number;
};

export type Vector3 = {
	X: number;
	Y: number;
	Z: number;
};
