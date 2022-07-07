import React, { useEffect } from 'react'
import { GameConfig } from '../Game/index'
import { useEffectOnce } from '../Hooks/useEffectOnce'
import { Score } from '../Game/GameOjbects/Score'
import { RoomHeader } from '../Game/GameOjbects/RoomHeader'
import { PlayerState } from '../Game/Models/PlayerState'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { queryString } from '../Utils'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { Leaderboard } from '../Game/GameOjbects/Leaderboard/Leaderboard'
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
	let game: Phaser.Game
	const navigate = useNavigate()
	const { 0: params } = useSearchParams()
	const handleGame = async () => {
		console.log('called')
		document.getElementById('WEB3_CONNECT_MODAL_ID')?.remove()
		localStorage.setItem('nickname', params.get('nickname') || '')
		localStorage.setItem('stakeUSD', params.get('stakeUSD') || '')
		localStorage.setItem('roomName', params.get('roomName') || 'ice')

		const canvasExists = document.querySelectorAll('#gamearea canvas')
		canvasExists.forEach((el) => {
			el.remove()
		})

		game = new Phaser.Game(GameConfig)

		return () => {
			console.log('destroyed')
			game?.destroy(true, false)
		}
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
				<RoomHeader />
				<Score />
				<Leaderboard />
			</div>
		</motion.div>
	)
}
