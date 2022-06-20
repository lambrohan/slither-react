import MainScene from './Scenes/MainScene'

import Phaser from 'phaser'
import InitScene from './Scenes/InitScene'
export const GameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'game-area',
	backgroundColor: '#331818',
	width: window.innerWidth,
	height: window.innerHeight,
	scale: {
		mode: Phaser.Scale.ScaleModes.RESIZE,
	},
	physics: {
		default: 'matter',
		matter: {
			gravity: {
				x: 0,
				y: 0,
			},
		},
	},

	scene: [InitScene, MainScene],
}
