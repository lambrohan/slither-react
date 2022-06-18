import React, { useState } from 'react'
import { PlayerState } from '../Models/PlayerState'
interface LeaderboardProps {}

export const Leaderboard: React.FC<LeaderboardProps> = ({}) => {
	const [players, setPlayers] = useState([])
	;(window as any).updateLeaderboard = (payload: any) => {
		setPlayers(payload)
	}
	return (
		<div
			id="leaderboard"
			className="text-base font-semibold absolute right-12 top-10 text-white opacity-80"
		>
			<h4 className="text-center">Leaderboard</h4>
			<table className="mt-2">
				<tbody>
					{players.slice(0, 5).map((p: PlayerState, i) => (
						<tr key={p.sessionId}>
							<td>
								<span className="px-2">{i + 1}</span>
							</td>
							<td>
								<span className="px-2">{p.nickname || p.sessionId}</span>
							</td>
							<td>
								<span className="px-2 text-right">{p.tokens}</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}
