import React, { useEffect, useState } from 'react'
import { GameConfig } from '../Game/index'
import { useEffectOnce } from '../Hooks/useEffectOnce'

import { motion } from 'framer-motion'

interface GameProps {}

export const GameLayout: React.FC<GameProps> = ({}) => {
	const handleGame = async () => {
		const canvasExists = document.querySelectorAll('#gamearea canvas')
		canvasExists.forEach((el) => {
			el.remove()
		})
		const Phaser = await import('phaser')
		new Phaser.Game(GameConfig)
	}

	useEffectOnce(() => {
		handleGame()
	})

	return (
		<div
			id="game-area"
			className="w-full max-h-screen overflow-hidden duration-300 linear"
		></div>
	)
}
