import React, { useEffect, useState } from 'react'
import { GameOver, GameOverProps } from '../Components/ModalContent/GameOver'
import SlitherImage from '../assets/images/SlitherImage.svg'
import { motion } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Congratulation } from '../Components/ModalContent/Congratulation'
import { GameSessionResponse, SessionRepo } from '../Repositories/session'
import toast from 'react-hot-toast'

import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

interface GameOverPageProps {}

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

export const GameOverPage: React.FC<GameOverPageProps> = ({}) => {
	const { 0: params } = useSearchParams()
	const [showNext, setShowNext] = useState(false)
	const navigate = useNavigate()
	const [session, setSession] = useState<GameSessionResponse>()
	const fetchSessionDetails = async () => {
		const sessionId = params.get('sessionId')
		if (!sessionId) {
			return
		}
		try {
			const session = await SessionRepo.getById(sessionId)

			setSession(session)
		} catch (error: any) {
			toast.error(error.response.data.message)
		}
	}
	useEffect(() => {
		fetchSessionDetails().catch((e) => {
			toast.error(e.response.data.message)
		})
	}, [params])
	return (
		<motion.div
			initial="initial"
			animate="animate"
			exit="exit"
			variants={pageVariants}
		>
			<div className="mt-6 flex items-center flex-col justify-center">
				<img className="mx-auto mb-1" src={SlitherImage} alt="SlitherImage" />

				{session && session.won && showNext ? (
					<GameOver
						snakeLength={session.snake_length}
						kills={session.kills}
						tokens={session.tokens_earned}
						survivalTime={dayjs
							.duration(
								dayjs(session.finished_at).diff(session.started_at, 'seconds'),
								'seconds'
							)
							.format('mm:ss')}
						playerId={session.user_id}
						rank={session.rank}
						win={session.won}
						nickname={session.nickname}
					/>
				) : (
					''
				)}

				{session && session.won === false ? (
					<GameOver
						snakeLength={session.snake_length}
						kills={session.kills}
						tokens={session.tokens_earned}
						survivalTime={dayjs
							.duration(
								dayjs(session.finished_at).diff(session.started_at, 'seconds'),
								'seconds'
							)
							.format('mm:ss')}
						playerId={session.user_id}
						rank={session.rank}
						win={session.won}
						nickname={session.nickname}
					/>
				) : (
					''
				)}

				{session && session.won && !showNext ? (
					<Congratulation
						tokens={session.tokens_earned}
						rank={session.rank}
						onNext={() => {
							setShowNext(true)
						}}
					/>
				) : (
					''
				)}
			</div>
		</motion.div>
	)
}
