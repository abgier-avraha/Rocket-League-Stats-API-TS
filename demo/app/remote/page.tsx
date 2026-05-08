"use client";

import { useState } from "react";
import { useRemoteController } from "../_hooks/use-remote";

export default function ControlPage() {
	const [matchTitleInput, setMatchTitleInput] = useState<string>("");
	const [seriesInfoInput, setSeriesInfoInput] = useState<{
		currentGame: number;
		seriesLength: number;
		leftTeamWins: number;
		rightTeamWins: number;
	}>({
		currentGame: 1,
		seriesLength: 1,
		leftTeamWins: 0,
		rightTeamWins: 0,
	});
	const { setMatchTitle, setSeriesInfo } = useRemoteController();

	return (
		<div className="min-h-screen bg-[#0b0f16] text-white flex items-center justify-center p-6">
			<div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl">
				{/* Header */}
				<div className="border-b border-white/10 px-6 py-4">
					<h1 className="text-lg font-semibold tracking-wide">
						Overlay Control Panel
					</h1>
					<p className="text-xs text-white/50">Live broadcast controls</p>
				</div>

				{/* Body */}
				<div className="p-6 space-y-6">
					{/* Match Title */}
					<div className="space-y-2">
						<label className="text-xs uppercase tracking-widest text-white/60">
							Match Title
						</label>

						<input
							className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
							onChange={(e) => setMatchTitleInput(e.target.value)}
							placeholder="e.g. RLCS Grand Finals"
						/>

						<button
							type="button"
							onClick={() => setMatchTitle(matchTitleInput)}
							className="w-full rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition px-3 py-2 text-sm font-medium shadow-lg shadow-blue-600/20"
						>
							Update Match Title
						</button>
					</div>

					{/* Match Title */}
					<div className="space-y-2">
						<label className="text-xs uppercase tracking-widest text-white/60">
							Series Length (Best of)
						</label>

						<input
							className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
							onChange={(e) =>
								setSeriesInfoInput((o) => ({
									...o,
									seriesLength: Number.parseInt(e.target.value, 10),
								}))
							}
							placeholder="1"
							type="number"
							min={1}
						/>

						<label className="text-xs uppercase tracking-widest text-white/60">
							Current Game
						</label>

						<input
							className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
							onChange={(e) =>
								setSeriesInfoInput((o) => ({
									...o,
									currentGame: Number.parseInt(e.target.value, 10),
								}))
							}
							placeholder="1"
							type="number"
							min={1}
						/>

						<label className="text-xs uppercase tracking-widest text-white/60">
							Left Team Wins
						</label>

						<input
							className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
							onChange={(e) =>
								setSeriesInfoInput((o) => ({
									...o,
									leftTeamWins: Number.parseInt(e.target.value, 10),
								}))
							}
							placeholder="0"
							type="number"
							min={0}
						/>

						<label className="text-xs uppercase tracking-widest text-white/60">
							Right Team Wins
						</label>

						<input
							className="w-full rounded-md bg-black/40 border border-white/10 px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
							onChange={(e) =>
								setSeriesInfoInput((o) => ({
									...o,
									rightTeamWins: Number.parseInt(e.target.value, 10),
								}))
							}
							placeholder="0"
							type="number"
							min={0}
						/>

						<button
							type="button"
							onClick={() => setSeriesInfo(seriesInfoInput)}
							className="w-full rounded-md bg-blue-600 hover:bg-blue-500 active:bg-blue-700 transition px-3 py-2 text-sm font-medium shadow-lg shadow-blue-600/20"
						>
							Update Series Information
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
