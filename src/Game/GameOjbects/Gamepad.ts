import VirtualJoystick from 'phaser3-rex-plugins/plugins/virtualjoystick.js'
import MainScene from '../Scenes/MainScene'
import { Player } from './Player'
export class GamePad {
	scene: MainScene | null = null
	base: Phaser.GameObjects.Sprite | null = null
	thumb: Phaser.GameObjects.Sprite | null = null
	joystick!: VirtualJoystick
	updateCallback: Function = () => {}
	player: Player | null = null
	constructor(scene: MainScene) {
		this.scene = scene
		this.init()
	}

	init() {
		if (!this.scene) return
		this.base = this.scene.add.sprite(0, 0, 'gamepad', 'base.png')
		this.thumb = this.scene.add.sprite(0, 0, 'gamepad', 'thumb.png')
		this.thumb.setDepth(11)
		this.thumb.setDepth(10)
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
		this.joystick.on('update', () => {
			if (this.joystick.noKey) return
			this.scene?.gameRoom?.send(
				'joystick',
				this.joystick.left ? 1 : this.joystick?.right ? 2 : 0
			)
		})
	}
}
