import React, { useState } from 'react'
import { PieChart } from 'react-minimal-pie-chart'

interface PieChartDrawProps {
	win: number
	lose: number
}

export const PieChartDraw: React.FC<PieChartDrawProps> = ({ win, lose }) => {
	const data = [
		{ title: 'win', value: win, color: '#00ff0080' },
		{ title: 'lose', value: lose, color: '#ff000080' },
	]
	return (
		<>
			<PieChart data={data} animate />
		</>
	)
}
