import React, { useEffect } from 'react'
import { Header } from '../Components/Header/Header'
import phaserGame from '../Game/index'
import MainScene from '../Game/Scenes/MainScene'

interface GameProps {}

export const GameLayout: React.FC<GameProps> = ({}) => {
	const handleGame = () => {
		const scene = phaserGame.scene.keys.main as MainScene
		console.log(scene)
	}
	useEffect(() => {
		console.log('mounted')
		handleGame()
	})
	return (
		<div id="game-view">
			<div id="game-area"></div>
		</div>
	)
}
