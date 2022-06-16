import React from 'react'
import { GameConfig } from '../Game/index'
import { useEffectOnce } from '../Hooks/useEffectOnce'
import { Score } from '../Game/GameOjbects/Score'
import { RoomHeader } from '../Game/GameOjbects/RoomHeader'
import { Leaderboard } from '../Game/GameOjbects/Leaderboard'
import { PlayerState } from '../Game/Models/PlayerState'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { queryString } from '../Utils'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

interface GameProps {}
const pageVariants = {
	initial: {
		opacity: 0,
	},
	animate: {
		opacity: 1,
	},
	out: {
		opacity: 0,
	},
}
export const GameLayout: React.FC<GameProps> = ({}) => {
	const navigate = useNavigate()
	const handleGame = async () => {
		const canvasExists = document.querySelectorAll('#gamearea canvas')
		canvasExists.forEach((el) => {
			el.remove()
		})

		const game = new Phaser.Game(GameConfig)
	}

	;(window as any).onGameOver = (player: PlayerState, rank: number = 0) => {
		navigate(
			`/gameover?${queryString({
				survivalTime: dayjs
					.duration(player.endAt - player.startAt, 'ms')
					.format('mm:ss'),
				kills: player.kills,
				tokens: player.tokens,
				rank,
				snakeLength: player.snakeLength,
				playerId: player.sessionId,
				win: dayjs(player.endAt).diff(dayjs(player.startAt), 'minutes') >= 10,
			})}`
		)
	}

	useEffectOnce(() => {
		handleGame()
	})

	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
		>
			<div
				id="game-area"
				className="w-full max-h-screen overflow-hidden duration-300 linear"
			>
				{' '}
				<RoomHeader />
				<Score />
				<Leaderboard />
			</div>
		</motion.div>
	)
}
