import Phaser, { Game } from 'phaser'
import { GameMeta } from '../../Utils'
import { Food } from '../Sprites/Food'
import { SnakeHead } from '../Sprites/SnakeHead'

export interface PlayerOptions {
	index: number
	scene: Phaser.Scene
	x: number
	y: number
	numSnakeSections: number
	assets: any
}
export class Player {
	snakeHead: Phaser.GameObjects.Sprite | null | any = null
	snakeSection: Array<SnakeHead> = []
	snakePath: Array<any> = []
	numSnakeSections: number = 30
	snakeSpacer = 1
	scene: Phaser.Scene | null = null
	id: number | null = null
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
	adjustingBounds = false

	constructor({ index, scene, x, y, numSnakeSections, assets }: PlayerOptions) {
		this.snakeHead
		this.snakeSection = new Array()
		this.snakePath = new Array()
		this.numSnakeSections = numSnakeSections || 30
		this.scene = scene
		this.id = index
		this.cursors = this.scene.input.keyboard.createCursorKeys()

		// Snake and its head
		this.snakeHead = this.scene.physics.add.sprite(400, 300, assets.head)
		this.snakeHead.setOrigin(0.5, 0.5)

		// this.scene.physics.enable(this.snakeHead, Phaser.Physics.ARCADE);

		for (let i = 1; i <= this.numSnakeSections - 1; i++) {
			this.snakeSection[i] = this.scene.add.sprite(400, 300, assets.body)
			this.snakeSection[i].setOrigin(0.5, 0.5)
		}

		for (let i = 0; i <= this.numSnakeSections * this.snakeSpacer; i++) {
			this.snakePath[i] = new Phaser.Geom.Point(400, 300)
		}
	}

	update() {
		if (this.snakeHead) {
			this.movePlayer(this.snakeHead.x, this.snakeHead.y)
		}

		if (this.cursors?.left.isDown) this.rotateHead(-300)
		else if (this.cursors?.right.isDown) this.rotateHead(300)

		this.checkBounds()
	}

	checkBounds() {
		if (!this.snakeHead) return
		if (this.snakeHead?.x < GameMeta.boundPadding) {
			// determind if angle has to be positive or negative
			this.rotateHead(this.snakeHead?.angle < 0 ? 300 : -300)
		}

		if (this.snakeHead?.x > GameMeta.boundX - GameMeta.boundPadding) {
			this.rotateHead(this.snakeHead?.angle > -90 ? 300 : -300)
		}

		if (this.snakeHead?.y < GameMeta.boundPadding) {
			const angle = Math.abs(this.snakeHead?.angle)
			this.rotateHead(angle < 90 ? 360 : -360)
		}

		if (this.snakeHead?.y > GameMeta.boundY - GameMeta.boundPadding) {
			const angle = Math.abs(this.snakeHead?.angle)

			this.rotateHead(angle > 90 ? 300 : -300)
		}
	}

	movePlayer(x: number, y: number) {
		if (!this.snakeHead) return
		if (!this.scene) return
		this.snakeHead.body.angularVelocity = 0
		this.snakeHead.body.velocity.copy(
			this.scene.physics.velocityFromAngle(this.snakeHead.angle, 300)
		)
		this.snakeHead.x = x !== this.snakeHead.x ? x : this.snakeHead.x
		this.snakeHead.y = y !== this.snakeHead.y ? y : this.snakeHead.y

		let part = this.snakePath.pop()
		part.setTo(this.snakeHead.x, this.snakeHead.y)
		this.snakePath.unshift(part)

		for (let i = 1; i <= this.numSnakeSections - 1; i++) {
			this.snakeSection[i].x = this.snakePath[i * this.snakeSpacer].x
			this.snakeSection[i].y = this.snakePath[i * this.snakeSpacer].y
		}
	}

	rotateHead(angle: number) {
		this.snakeHead.body.angularVelocity = angle
	}

	grow(food: Food) {
		if (!this.scene) return
		for (let i = 0; i <= food.size; i++) {
			this.snakeSection[this.numSnakeSections] = this.scene?.add.sprite(
				this.snakeSection[this.numSnakeSections - 1].x + this.snakeSpacer,
				this.snakeSection[this.numSnakeSections - 1].y + this.snakeSpacer,
				'body'
			)
			this.snakeSection[this.numSnakeSections].setOrigin(0.5, 0.5)
			this.numSnakeSections++

			for (
				let i = this.snakePath.length;
				i <= this.numSnakeSections * this.snakeSpacer;
				i++
			) {
				this.snakePath[i] = new Phaser.Geom.Point(
					this.snakePath[i - 1].x,
					this.snakePath[i - 1].y
				)
			}
		}
	}
}
