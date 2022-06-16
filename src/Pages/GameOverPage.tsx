import React, { useEffect, useState } from 'react'
import { GameOver, GameOverProps } from '../Components/ModalContent/GameOver'
import SlitherImage from '../assets/images/SlitherImage.svg'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Congratulation } from '../Components/ModalContent/Congratulation'

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
	const [playerStat, setPlayerStat] = useState<GameOverProps | any>()
	useEffect(() => {
		const p: any = {}
		params.forEach((v, key) => {
			p[key] = v
		})
		p.win = params.get('win') === 'true'
		setPlayerStat(p)
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

				{playerStat && playerStat.win && showNext ? (
					<GameOver
						snakeLength={playerStat.snakeLength}
						kills={playerStat.kills}
						tokens={playerStat.tokens}
						survivalTime={playerStat.survivalTime}
						playerId={playerStat.playerId}
						rank={playerStat.rank}
						win={playerStat.win}
						nickname={playerStat.nickname}
					/>
				) : (
					''
				)}

				{playerStat && playerStat.win === false ? (
					<GameOver
						snakeLength={playerStat.snakeLength}
						kills={playerStat.kills}
						tokens={playerStat.tokens}
						survivalTime={playerStat.survivalTime}
						playerId={playerStat.playerId}
						rank={playerStat.rank}
						win={playerStat.win}
						nickname={playerStat.nickname}
					/>
				) : (
					''
				)}

				{playerStat && playerStat.win && !showNext ? (
					<Congratulation
						tokens={playerStat.tokens}
						rank={playerStat.rank}
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
