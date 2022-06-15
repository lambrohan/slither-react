import React, { useEffect, useState } from 'react'
import { GameOver, GameOverProps } from '../Components/ModalContent/GameOver'
import SlitherImage from '../assets/images/SlitherImage.svg'
import { motion } from 'framer-motion'
import { useParams } from 'react-router-dom'
import { useQuery } from '../Hooks/useQuery'

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
	const params = useQuery()
	const [playerStat, setPlayerStat] = useState<GameOverProps | null>(null)
	useEffect(() => {
		setPlayerStat({
			snakeLength: params.get('snakeLength') || '',
			kills: params.get('kills') || '',
			survivalTime: params.get('survivalTime') || '',
			playerId: params.get('playerId') || '',
			tokens: params.get('tokens') || '',
		})
	}, [])
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
					/>
				) : (
					''
				)}
			</div>
		</motion.div>
	)
}
