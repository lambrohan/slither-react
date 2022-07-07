import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './Button/Button'

interface PlayNowProps {}

export const PlayNow: React.FC<PlayNowProps> = ({}) => {
	const navigate = useNavigate()
	return (
		<div className="flex flex-col mt-2 items-center">
			<Button
				className="md:mt-6 mt-8"
				onClick={() => {
					navigate(`/entergame`)
				}}
			>
				<span className="text-xl px-[3.375rem]">Play Now</span>
			</Button>
		</div>
	)
}
