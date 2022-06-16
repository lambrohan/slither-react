import React, { useEffect, useState } from 'react'
import { GameOver, GameOverProps } from '../Components/ModalContent/GameOver'
import SlitherImage from '../assets/images/SlitherImage.svg'
import { motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

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
	const [playerStat, setPlayerStat] = useState<GameOverProps | null>(null)
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
				{playerStat ? (
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
			</div>
		</motion.div>
	)
}
