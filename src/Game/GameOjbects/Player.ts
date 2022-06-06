import Phaser, { GameObjects } from 'phaser'
import { GameMeta, SPRITE_LABELS } from '../../Utils'
import { PlayerState } from '../Models/PlayerState'

export interface PlayerOptions {
	scene: Phaser.Scene
	playerState: PlayerState
	isCurrentPlayer?: boolean
}
export class Player {
	snakeHead: Phaser.Physics.Matter.Sprite | null = null
	scene: Phaser.Scene | null = null
	cursors: Phaser.Types.Input.Keyboard.CursorKeys | null = null
	playerState!: PlayerState
	isCurrentPlayer: boolean = false
	snakePath: Array<Phaser.Geom.Point> = []
	snakeSection: Array<Phaser.GameObjects.Sprite> = []
	snakeSpacer = 1
	numSnakeSections = 30

	constructor({ scene, playerState, isCurrentPlayer }: PlayerOptions) {
		this.scene = scene
		this.cursors = this.scene.input.keyboard.createCursorKeys()
		this.playerState = playerState
		this.isCurrentPlayer = isCurrentPlayer || false
		this.init()
	}

	init() {
		console.log('player init')
		if (!this.playerState || !this.scene) return
		// Snake and its head
		this.snakeHead = this.scene.matter.add.sprite(
			this.playerState.x,
			this.playerState.y,
			'slither',
			'snake/head.png',
			{ label: SPRITE_LABELS.HEAD, isSensor: true }
		)
		if (this.isCurrentPlayer) {
			this.scene.cameras.main.setBounds(0, 0, GameMeta.boundX, GameMeta.boundY)
			this.scene.cameras.main.startFollow(this.snakeHead)
		}

		this.initSections()
	}

	update() {
		console.log('player update')
		if (!this.snakeHead || !this.playerState) return

		this.movePlayer(this.snakeHead.x, this.snakeHead.y)
		this.scene?.tweens.add({
			targets: this.snakeHead,
			x: this.playerState?.x,
			y: this.playerState?.y,
			angle: this.playerState?.angle,
			duration: 50,
		})
	}

	initSections() {
		if (!this.snakeHead || !this.playerState) return
		for (let i = 1; i <= this.playerState.snakeLength - 1; i++) {
			this.snakeSection[i] = this.scene?.add.sprite(
				this.playerState.x,
				this.playerState.y,
				'slither',
				'snake/body.png'
			)!
			this.snakeSection[i].setOrigin(0.5, 0.5)
		}

		for (let i = 0; i <= this.playerState.snakeLength * this.snakeSpacer; i++) {
			this.snakePath[i] = new Phaser.Geom.Point(
				this.playerState.x,
				this.playerState.y
			)
		}
	}

	checkBounds() {
		if (!this.snakeHead) return
		if (this.snakeHead?.x < GameMeta.boundPadding) {
			// determind if angle has to be positive or negative

			this.rotateHead(this.snakeHead?.angle < 0 ? 0.15 : -0.15)
		}

		if (this.snakeHead?.x > GameMeta.boundX - GameMeta.boundPadding) {
			this.rotateHead(this.snakeHead?.angle < 0 ? -0.15 : 0.15)
		}

		if (this.snakeHead?.y < GameMeta.boundPadding) {
			const angle = Math.abs(this.snakeHead?.angle)
			this.rotateHead(angle < 90 ? 0.15 : -0.15)
		}

		if (this.snakeHead?.y > GameMeta.boundY - GameMeta.boundPadding) {
			const angle = Math.abs(this.snakeHead?.angle)

			this.rotateHead(angle > 90 ? 0.15 : -0.15)
		}
	}

	movePlayer(x: number, y: number) {
		if (!this.snakeHead) return

		let part = this.snakePath.pop()!
		part.setTo(this.snakeHead.x, this.snakeHead.y)
		this.snakePath.unshift(part)

		for (let i = 1; i <= this.numSnakeSections - 1; i++) {
			this.snakeSection[i].x = this.snakePath[i * this.snakeSpacer].x
			this.snakeSection[i].y = this.snakePath[i * this.snakeSpacer].y
		}
	}

	rotateHead(angle: number) {
		this.snakeHead?.setAngularVelocity(angle)
	}

	destroy() {
		this.snakeHead?.destroy()
	}
}
