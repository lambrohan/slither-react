import { GameMeta, Point } from '../../Utils'
import MainScene from '../Scenes/MainScene'

export class SnakeV3 {
	head!: Phaser.GameObjects.Sprite
	sections: Array<Phaser.GameObjects.Sprite>
	scene: MainScene
	snakePath: Array<Point> = []
	target = 0
	numSnakeSections = 50
	snakeSpacer = 5
	current = false
	constructor(scene: MainScene, current = false) {
		this.scene = scene
		this.sections = []
		this.current = current
		this.initSections()

		// setInterval(() => {
		// 	this.grow()
		// }, 500)
	}

	initSections() {
		this.sections = []
		this.snakePath = []
		this.head = this.scene.add.sprite(
			Math.random() * 100,
			Math.random() * 1000,
			'snake',
			'snake_head_blue.png'
		)
		this.head.setDepth(this.numSnakeSections + 3)
		this.head.setScale(2)

		for (let i = 1; i <= this.numSnakeSections - 1; i++) {
			const sec = this.scene.add.sprite(
				this.head.x,
				this.head.y,
				'snake',
				'snake_body_blue.png'
			)
			sec.setDepth(this.numSnakeSections + 2 - i).setScale(1.8)
			this.sections[i] = sec
		}

		for (let i = 0; i <= this.numSnakeSections * this.snakeSpacer; i++) {
			this.snakePath[i] = new Point(this.head.x, this.head.y, this.head.angle)
		}

		if (this.current) {
			this.scene.input.on('pointermove', (pointer: any) => {
				this.target = Phaser.Math.Angle.BetweenPoints(
					{ x: this.head.x, y: this.head.y },
					{
						x: pointer.worldX,
						y: pointer.worldY,
					}
				)
			})
			this.scene.cameras.main.startFollow(this.head)
		} else {
			setInterval(() => {
				this.target = Math.random()
			}, 1000)
		}
	}

	grow() {
		const last = this.sections[this.sections.length - 1]
		const sec = this.scene.add.sprite(
			last.x,
			last.y,
			'snake',
			'snake_body_blue.png'
		)
		this.sections[this.numSnakeSections] = sec
		this.numSnakeSections++
	}

	update() {
		console.log(this.numSnakeSections, this.sections.length)
		const angle = Phaser.Math.Angle.RotateTo(
			this.head.rotation,
			this.target,
			0.08
		)
		this.head.setRotation(angle)
		const a =
			Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(
				this.head.rotation,
				3.2
			)
		this.head.setPosition(this.head.x + a.x, this.head.y + a.y)

		let part = this.snakePath.pop()!
		part.setTo(this.head.x, this.head.y)
		this.snakePath.unshift(part)

		for (let i = 1; i <= this.numSnakeSections - 1; i++) {
			this.sections[i]
				.setPosition(
					this.snakePath[i * this.snakeSpacer].x,
					this.snakePath[i * this.snakeSpacer].y
				)
				.setAngle(this.snakePath[i * this.snakeSpacer].angle)
		}
	}
}
