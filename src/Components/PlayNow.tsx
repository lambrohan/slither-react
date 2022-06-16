import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button/Button'

interface PlayNowProps {}

export const PlayNow: React.FC<PlayNowProps> = ({}) => {
	const navigate = useNavigate()
	const [name, setName] = useState('')
	return (
		<div className="flex flex-col mt-2 items-center">
			<input
				type="text"
				className="p-2 text-center bg-transparent rounded-full border-primary border italic focus:scale-105 focus:outline-none text-white font-bold tracking-widest transition"
				placeholder="nickname"
				max={10}
				onChange={(e) => {
					setName(e.target.value)
				}}
			/>
			<Button
				className="md:mt-6 mt-8"
				onClick={() => {
					name
						? navigate(`/game?nickname=${name}`)
						: alert('please enter a nickname')
				}}
			>
				<span className="text-xl px-[3.375rem]">Play Now</span>
			</Button>
		</div>
	)
}
