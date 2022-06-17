import { GameMeta } from '../../Utils'
import MainScene from '../Scenes/MainScene'

export class SnakeV3 {
	head: Phaser.Physics.Matter.Sprite
	sections: Array<Phaser.Physics.Matter.Sprite>
	scene: MainScene
	target = 0

	constructor(scene: MainScene) {
		this.scene = scene
		this.sections = []
		this.head = this.scene.matter.add.sprite(
			500,
			500,
			'snake',
			'snake_head_purple.png',
			{ isSensor: true, mass: 0, friction: 0 }
		)
		this.head.setDepth(3)
		this.scene.cameras.main.startFollow(this.head)
		this.scene.input.on('pointermove', (pointer: any) => {
			this.target = Phaser.Math.Angle.BetweenPoints(this.head.body.position, {
				x: pointer.worldX,
				y: pointer.worldY,
			})
		})

		this.initSections()
	}

	initSections() {
		this.sections = []
		for (let i = 1; i < 3; i++) {
			const sec = this.scene.matter.add.sprite(
				this.head.x - i * this.head.width,
				this.head.x,
				'snake_body',
				undefined,
				{
					isSensor: true,
					mass: 0,
				}
			)
			sec.setScale(2)
			sec.setDepth(2)
			this.sections.push(sec)
		}
	}

	update() {
		const angle = Phaser.Math.Angle.RotateTo(
			this.head.rotation,
			this.target,
			0.08
		)
		this.head.setRotation(angle)
		const a =
			Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(
				this.head.rotation,
				2.5
			)
		this.head.setVelocity(a.x, a.y)
		if (this.head.x >= GameMeta.boundX) {
			this.head.x = 0
		}

		const point = this.sections.pop()!
		point?.setPosition(this.head.x, this.head.y)
		this.sections.unshift(point)
	}

	move() {}
}
