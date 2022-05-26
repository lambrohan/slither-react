import Phaser from 'phaser'
import MainScene from './Scenes/MainScene'
const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'game-area',
	backgroundColor: '#DC143C',
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
		width: window.innerWidth,
		height: window.innerHeight,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [MainScene],
}
const canvasExists = document.querySelector('canvas')
canvasExists?.remove()
export default new Phaser.Game(config)
