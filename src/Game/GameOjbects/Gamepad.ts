import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js'
import { Player } from './Player'
export class GamePad {
	scene: Phaser.Scene | null = null
	base: Phaser.GameObjects.Sprite | null = null
	thumb: Phaser.GameObjects.Sprite | null = null
	joystick: VirtualJoystick | null = null
	updateCallback: Function = () => {}
	player: Player | null = null
	constructor(scene: Phaser.Scene) {
		this.scene = scene
		this.init()
	}

	init() {
		if (!this.scene) return
		this.base = this.scene.add.sprite(0, 0, 'gamepad', 'base.png')
		this.thumb = this.scene.add.sprite(0, 0, 'gamepad', 'thumb.png')
		this.joystick = new VirtualJoystick(this.scene, {
			x: 100,
			y: this.scene.sys.canvas.height - 100,
			fixed: true,
			dir: 'left&right',
			base: this.base,
			thumb: this.thumb,
			radius: 30,
		})

		// @ts-ignore
		this.joystick?.on('update', () => {
			if (!this.player) return
			this.joystick?.left ? this.player.rotateHead(-0.1) : ''
			this.joystick?.right ? this.player.rotateHead(0.1) : ''
		})
	}

	setPlayer(player: Player | null) {
		this.player = player
	}
}
