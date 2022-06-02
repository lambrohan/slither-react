import MainScene from './Scenes/MainScene'
import VirtualJoystickPlugin from 'phaser3-rex-plugins/plugins/virtualjoystick-plugin.js'

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
		default: 'matter',
		matter: {
			gravity: {
				x: 0,
				y: 0,
			},
			debug: true,
		},
	},

	scene: [MainScene],
}
