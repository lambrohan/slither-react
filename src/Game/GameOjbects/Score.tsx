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
	const [total, setTotal] = useState(0)

	;(window as any).updateScore = (
		val: number,
		kills: number,
		total: number
	) => {
		setScore(val)
		setKills(kills)
		setTotal(total)
	}

	useEffect(() => {
		setScale(1.4)
		setTimeout(() => {
			setScale(1)
		}, 150)
	}, [score])

	useEffect(() => {
		const interval = setInterval(() => {
			setTimerText(
				dayjs.duration(dayjs().diff(startedAt, 's'), 's').format('mm:ss')
			)
		}, 1000)

		return () => {
			clearInterval(interval)
		}
	}, [])

	return (
		<div className="absolute left-8 bottom-8 text-white  text-xs md:text-lg text-center flex flex-col items-center opacity-50 ">
			<h4>Score</h4>
			<div className="bg-primary p-2 rounded-full min-w-[8rem] mt-2">
				<h4 style={{ transform: `scale(${scale})` }}>{score} Mil.</h4>
			</div>
			<h4>{timerText}</h4>
			<p>
				Killed - <strong>{kills}</strong>
			</p>
			<p>Total Players - {total}</p>
		</div>
	)
}
