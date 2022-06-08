import React from 'react'
import { GameConfig } from '../Game/index'
import { useEffectOnce } from '../Hooks/useEffectOnce'
import { GameState } from '../Game/Models/GameState'
import MainScene from '../Game/Scenes/MainScene'
import { FoodItem } from '../Game/Models'

interface GameProps {}

export const GameLayout: React.FC<GameProps> = ({}) => {
	const handleGame = async () => {
		const canvasExists = document.querySelectorAll('#gamearea canvas')
		canvasExists.forEach((el) => {
			el.remove()
		})

		const game = new Phaser.Game(GameConfig)
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
