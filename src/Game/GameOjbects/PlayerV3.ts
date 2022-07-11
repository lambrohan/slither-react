import _ from 'lodash'
import { GameMeta, Point } from '../../Utils'
import MainScene from '../Scenes/MainScene'

export class SnakeV3 {
	head!: Phaser.GameObjects.Sprite
	sections: Array<Phaser.GameObjects.Sprite>
	group!: Phaser.GameObjects.Group
	scene: MainScene
	snakePath: Array<Point> = []
	target = 0
	numSnakeSections = 2
	snakeSpacer = 20
	current = false
	spacer = 30
	constructor(scene: MainScene, current = false) {
		this.scene = scene
		this.sections = []
		this.current = current
		this.initSections()

		setTimeout(() => {
			console.log('grow')
			this.grow()
		}, 2000)

		setTimeout(() => {
			console.log('pop')
			this.reduce()
		}, 5000)
	}

	initSections() {
		this.group = this.scene.add.group([], {
			defaultKey: 'snake',
			defaultFrame: 'blue.png',
		})
		this.sections = []
		this.snakePath = []
		this.head = this.scene.add.sprite(
			Math.random() * 100,
			Math.random() * 1000,
			'eyes'
		)
		this.head.setDepth(this.numSnakeSections + 3)

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
			}, 5000)
		}

		for (let i = 0; i < this.numSnakeSections; i++) {
			const x = this.head.x - i * this.spacer
			const sec = this.group.create(x, this.head.y)
			sec.setDepth(this.numSnakeSections + 2 - i)
			this.sections[i] = sec
		}
		for (let i = 0; i < this.numSnakeSections * this.snakeSpacer; i++) {
			this.snakePath.push(new Point(this.head.x, this.head.y, this.head.angle))
		}
	}

	grow() {
		const last = this.sections[this.sections.length - 1]
		const sec = this.group.create(last.x, last.y)
		sec.setDepth(2)
		this.sections.push(sec)
		for (let i = 0; i < this.snakeSpacer; i++) {
			this.snakePath.push(new Point(last.x, last.y, last.angle))
		}
	}

	reduce() {
		const sec = this.sections.pop()
		sec?.destroy(true)
		for (let i = 0; i < this.snakeSpacer; i++) {
			this.snakePath.pop()
		}
	}

	update() {
		if (this.head.x >= GameMeta.boundX) {
			this.head.setX(0)
		}
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

		const part = this.snakePath.pop()!
		part.setTo(this.head.x, this.head.y, this.head.angle)
		this.snakePath.unshift(part)

		for (let i = 0; i < this.sections.length; i++) {
			const el = this.snakePath[i * this.snakeSpacer]
			this.sections[i].setPosition(el.x, el.y).setAngle(el.angle)
		}
	}
}
