import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)

import React, { useEffect, useState } from 'react'
import { useEffectOnce } from '../../Hooks/useEffectOnce'

interface ScoreProps {}

export const Score: React.FC<ScoreProps> = ({}) => {
	const [score, setScore] = useState(0)
	const [scale, setScale] = useState(1)
	const [startedAt] = useState(Date.now())
	const [timerText, setTimerText] = useState('00:00')
	const [kills, setKills] = useState(0)

	;(window as any).updateScore = (val: number, kills: number) => {
		setScore(val)
		setKills(kills)
	}

	useEffect(() => {
		setScale(1.4)
		setTimeout(() => {
			setScale(1)
		}, 150)
	}, [score])

	useEffect(() => {
		const interval = setInterval(() => {
			console.log('set')
			setTimerText(
				dayjs.duration(dayjs().diff(startedAt, 's'), 's').format('mm:ss')
			)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="absolute left-12 bottom-12 text-white font-bold text-lg text-center flex flex-col items-center">
			<h4>Score</h4>
			<div className="bg-primary p-2 rounded-full min-w-[8rem] mt-2">
				<h4 style={{ transform: `scale(${scale})` }}>{score} Mil.</h4>
			</div>
			<h4>{timerText}</h4>
			<p>
				Killed - <strong>{kills}</strong>
			</p>
		</div>
	)
}
