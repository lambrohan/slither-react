import React from 'react'
import Star from './images/star.svg'

interface StarSvgProps {
	repeat: number
}

export const StarSvg: React.FC<StarSvgProps> = ({ repeat }) => {
	return (
		<>
			{[...Array(repeat)].map((a, idx) => (
				<img src={Star} alt={`${a}${idx}`} key={idx} />
			))}
		</>
	)
}
