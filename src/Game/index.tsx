import MainScene from './Scenes/MainScene'
export const GameConfig: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	parent: 'game-area',
	backgroundColor: '#651626',
	width: window.innerWidth,
	height: window.innerHeight,
	scale: {
		mode: Phaser.Scale.ScaleModes.FIT,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 200 },
		},
	},
	scene: [MainScene],
}
