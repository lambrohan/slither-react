import React, { useEffect, useState } from 'react'

interface ScoreProps {}

export const Score: React.FC<ScoreProps> = ({}) => {
	const [score, setScore] = useState(0)
	const [scale, setScale] = useState(1)

	;(window as any).updateScore = (val: number) => {
		setScore(val)
	}

	useEffect(() => {
		setScale(1.4)
		setTimeout(() => {
			setScale(1)
		}, 150)
	}, [score])

	return (
		<div className="absolute left-12 bottom-12 text-white font-bold text-lg text-center flex flex-col items-center">
			<h4>Score</h4>
			<div className="bg-primary p-2 rounded-full min-w-[8rem] mt-2">
				<h4 style={{ transform: `scale(${scale})` }}>{score} Mil.</h4>
			</div>
		</div>
	)
}
