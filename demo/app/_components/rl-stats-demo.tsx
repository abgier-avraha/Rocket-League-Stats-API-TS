"use client";

import { useState } from "react";
import { useRlStats } from "../_hooks/use-rl-stats";
import type { UpdateStateEvent } from "rl-ts-client/events";
import { useRemoteReader } from "../_hooks/use-remote";

export function RlStatsDemo() {
	const [gameState, setGameState] = useState<UpdateStateEvent>();
	useRlStats({
		port: 3001,
		host: "localhost",
		onEvent: (e) => {
			console.log(e);

			if (e.Event === "UpdateState") {
				setGameState(e);
			}
		},
	});

	const {
		matchTitle,
		seriesLength,
		currentGame,
		leftTeamWins,
		rightTeamWins,
		leftTeamName,
		rightTeamName,
	} = useRemoteReader();

	if (!gameState) {
		return null;
	}

	const leftTeam = gameState.Data.Game.Teams[0];
	const rightTeam = gameState.Data.Game.Teams[1];

	const totalSeconds = gameState.Data.Game.TimeSeconds;

	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;
	const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;

	return (
		<div className="w-full flex justify-center">
			<div className="w-[1000px] overflow-hidden rounded-md border border-white/10 bg-[#111827]/95 font-sans text-white shadow-2xl">
				{/* Top League Bar */}
				{matchTitle && (
					<div className="flex h-7 items-center justify-center bg-[#0b0f16] text-[11px] font-bold uppercase tracking-widest text-zinc-300">
						{matchTitle}
					</div>
				)}

				{/* Main Scoreboard */}
				<div className="grid h-20 grid-cols-[1fr_auto_1fr] items-center">
					{/* Blue Team */}
					<div className="flex h-full bg-gradient-to-l from-blue-900 to-blue-700">
						<div className="flex flex-1 justify-end items-center relative">
							<div className="pr-4 text-3xl font-black  tracking-wide">
								{leftTeamName ? leftTeamName : leftTeam.Name}
							</div>
							<div className="absolute bottom-0 left-0 right-0 pr-4 p-1 flex flex-row justify-end gap-2 bg-white/20 h-[18px]">
								{Array.from({ length: leftTeamWins }).map((_, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: iterate over no items
										key={i}
										style={{ width: 30 }}
										className="bg-white/70 h-full rounded-xs"
									/>
								))}
							</div>
						</div>

						<div className="flex justify-center items-center text-5xl font-black tabular-nums bg-blue-300/30">
							<span className="px-4">{leftTeam.Score}</span>
						</div>
					</div>

					{/* Center */}
					<div className="flex h-full flex-col items-center justify-center border-x border-white/10 bg-[#1a1f2b] w-[250px]">
						<div className="text-4xl font-black leading-none tabular-nums">
							{formattedTime}
						</div>

						{seriesLength > 1 && (
							<div className="mt-1 text-[11px] uppercase tracking-[0.25em] text-zinc-400">
								Game {currentGame} • Best of {seriesLength}
							</div>
						)}
					</div>

					{/* Orange Team */}
					<div className="flex h-full bg-gradient-to-l from-orange-700 to-orange-500">
						<div className="flex justify-center items-center text-5xl font-black tabular-nums bg-orange-300/30">
							<span className="px-4">{rightTeam.Score}</span>
						</div>

						<div className="flex flex-1 justify-start items-center relative">
							<div className="absolute bottom-0 left-0 right-0 pl-4 p-1 flex flex-row justify-start gap-2 bg-white/20 h-[18px]">
								{Array.from({ length: rightTeamWins }).map((_, i) => (
									<div
										// biome-ignore lint/suspicious/noArrayIndexKey: iterate over no items
										key={i}
										style={{ width: 30 }}
										className="bg-white/70 h-full rounded-xs"
									/>
								))}
							</div>
							<div className="pl-4 text-3xl font-black tracking-wide">
								{rightTeamName ? rightTeamName : rightTeam.Name}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
