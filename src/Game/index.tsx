import MainScene from './Scenes/MainScene'
import Phaser from 'phaser'
export const GameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'game-area',
	backgroundColor: '#230B0B',
	width: window.innerWidth,
	height: window.innerHeight,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity:{
				y:0,
				x:0,
			}
		},
	},
	scene: [MainScene],
}
