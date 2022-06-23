import {
	CONSTANTS,
	degToRad,
	distanceFormula,
	GameMeta,
	getSkinAssetFromEnum,
	Point,
	SnakeSkinSprite,
} from '../../Utils'
import { PlayerState } from '../Models/PlayerState'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	sections = new Array<Phaser.Physics.Matter.Sprite>()
	sectionGroup!: Phaser.GameObjects.Group
	isCurrentPlayer: boolean = false
	cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
	remoteRef!: Phaser.GameObjects.Arc
	SPEED = CONSTANTS.DEF_SPEED
	target = 0
	skin!: SnakeSkinSprite
	playerNameText!: Phaser.GameObjects.Text
	playerLight!: Phaser.GameObjects.PointLight
	scale = 1

	constructor(
		scene: MainScene,
		playerState: PlayerState,
		isCurrentPlayer = false
	) {
		this.playerState = playerState
		this.scene = scene
		this.isCurrentPlayer = isCurrentPlayer
		this.sectionGroup = this.scene.add.group()
		this.skin = getSkinAssetFromEnum(this.playerState.skin)
		this.init()
	}

	init() {
		this.playerNameText = this.scene.add.text(
			this.playerState.x,
			this.playerState.y - 50,
			this.playerState.nickname || this.playerState.sessionId,
			{ fontSize: '12px' }
		)
		this.playerNameText.setDepth(1001)

		this.head = this.scene.matter.add.sprite(
			this.playerState.x,
			this.playerState.y,
			'snake',
			'snake_head_blue.png',
			{
				isSensor: true,
				friction: 0,
				frictionAir: 0,
				mass: 0,
				collisionFilter: {
					group: -1,
					category: 2,
					mask: 0,
				},
			}
		)
		this.head.setAngle(this.playerState.angle)
		this.head.setDepth(1000)

		this.setRemoteRef()

		if (this.isCurrentPlayer) {
			this.scene.cameras.main.startFollow(this.head)
			this.playerLight = this.scene.add.pointlight(
				this.head.x,
				this.head.y,
				0xfffff,
				150,
				0.1
			)
			this.playerLight.setDepth(-1)

			this.scene.cameras.main.setBounds(
				-8,
				-20,
				GameMeta.boundX + 20,
				GameMeta.boundY + 40
			)
			this.cursorKeys = this.scene.input.keyboard.createCursorKeys()
			this.scene.input.on('pointermove', (pointer: any) => {
				this.target = Phaser.Math.Angle.BetweenPoints(this.head.body.position, {
					x: pointer.worldX,
					y: pointer.worldY,
				})
				this.scene.gameRoom.send('input', this.target)
			})
			this.cursorKeys.space.onDown = () => {
				this.scene.gameRoom.send('speed', true)
			}

			this.cursorKeys.space.onUp = () => {
				this.scene.gameRoom.send('speed', false)
			}

			this.cursorKeys.up.onDown = () => {
				this.scene.gameRoom.send('speed', true)
			}

			this.cursorKeys.up.onUp = () => {
				this.scene.gameRoom.send('speed', false)
			}

			if (!this.scene.game.device.os.desktop) {
				let lastTime = 0
				this.scene.input.on('pointerdown', (pointer: any) => {
					const delay = Date.now() - lastTime
					lastTime = Date.now()
					if (delay < 350) {
						this.scene.gameRoom.send('speed', true)
					}
					this.target = Phaser.Math.Angle.BetweenPoints(
						this.head.body.position,
						{ x: pointer.worldX, y: pointer.worldY }
					)
					this.scene.gameRoom.send('input', this.target)
				})
			} else {
				this.scene.input.on('pointerdown', () => {
					if (this.scene.input.activePointer.isDown) {
						this.scene.gameRoom.send('speed', true)
					}
				})
			}

			this.scene.input.on('pointerup', () => {
				this.scene.gameRoom.send('speed', false)
			})
		}

		this.initSections(this.playerState.snakeLength)

		this.playerState.sections.onAdd = () => {
			console.log('add section')
			if (this.playerState.snakeLength > CONSTANTS.MIN_SNAKE_LENGTH) {
				this.addSection()
			}
		}

		this.playerState.sections.onRemove = () => {
			const sec = this.sections.pop()
			if (sec) {
				this.sectionGroup.remove(sec)
				sec.destroy()
			}
		}
	}

	setRemoteRef() {
		if (process.env.NODE_ENV == 'production') return
		this.remoteRef = this.scene.add.circle(0, 0, this.head.width / 2)
		this.remoteRef.setOrigin(0.5, 0.5)
		this.remoteRef.setStrokeStyle(1, 0xff0000)
		this.remoteRef.setDepth(2)
	}

	initSections(num: number) {
		for (let i = 1; i <= num - 1; i++) {
			const sec = this.scene.matter.add.sprite(
				this.head.x,
				this.head.y,
				'snake',
				'snake_body_blue.png',
				{
					isSensor: true,
					mass: 0,
					friction: 0,
					frictionAir: 0,
					collisionFilter: {
						group: -1,
						category: 2,
						mask: 0,
					},
				}
			)

			this.sectionGroup.add(sec)

			sec.setDepth(2)

			this.sections.push(sec)
		}
	}

	addSection() {
		const last = this.sections[this.sections.length - 1]
		const sec = this.scene.matter.add.sprite(
			last.x,
			last.y,
			'snake',
			this.skin.body,
			{
				isSensor: true,
				mass: 0,
				friction: 0,
				frictionAir: 0,
				collisionFilter: {
					group: -1,
					category: 2,
					mask: 0,
				},
			}
		)
		sec.setDepth(2)
		this.sections.push(sec)
		this.sectionGroup.add(sec)

		// for (
		// 	let i = this.snakePath.length;
		// 	i <= this.playerState.snakeLength * this.snakeSpacer;
		// 	i++
		// ) {
		// 	this.snakePath[i] = new Point(
		// 		this.snakePath[i - 1].x,
		// 		this.snakePath[i - 1].y,
		// 		this.snakePath[i - 1].angle
		// 	)
		// }
	}

	update() {
		this.head
			.setAlpha(this.playerState.cooldown ? 0.4 : 1)
			.setScale(this.playerState.scale)

		this.scale = this.playerState.scale

		// for testing only
		// console.log(this.head.angle, this.playerState.angle)
		this.refMovement()

		this.localPlayerMovement()
		this.interpolateRemotePlayers()
		this.playerNameText.setPosition(this.head.x, this.head.y - 50)

		let part = this.sections.pop()!
		part
			.setPosition(this.head.x, this.head.y)
			.setAngle(this.head.angle)
			.setScale(this.scale)
		this.sections.unshift(part)
	}

	refMovement() {
		if (!this.remoteRef) return
		this.remoteRef.setScale(this.playerState.scale)
		this.remoteRef.setPosition(this.playerState.x, this.playerState.y)
		this.remoteRef.setAngle(this.playerState.angle)
	}

	localPlayerMovement() {
		if (!this.isCurrentPlayer) return

		const angle = Phaser.Math.Angle.RotateTo(
			this.head.rotation,
			this.target,
			0.08
		)

		this.head.setRotation(angle)
		this.SPEED = CONSTANTS.DEF_SPEED

		if (this.playerState.isSpeeding) {
			this.SPEED = CONSTANTS.BOOST_SPEED
		}

		const a =
			Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(
				this.head.rotation,
				this.SPEED
			)
		this.head.setVelocity(a.x, a.y)

		if (
			Math.abs(this.head.x - this.playerState.x) > 10 ||
			Math.abs(this.head.y - this.playerState.y) > 10
		) {
			this.head.setPosition(
				Phaser.Math.Linear(this.head.x, this.playerState.x, 0.08),
				Phaser.Math.Linear(this.head.y, this.playerState.y, 0.08)
			)
		}
		this.playerLight.setPosition(this.head.x, this.head.y)
	}

	interpolateRemotePlayers() {
		if (this.isCurrentPlayer) return
		this.head.setAngle(
			Phaser.Math.Linear(this.head.angle, this.playerState.angle, 0.08)
		)
		this.head.setPosition(
			Phaser.Math.Linear(this.head.x, this.playerState.x, 0.2),
			Phaser.Math.Linear(this.head.y, this.playerState.y, 0.2)
		)
	}

	destroy() {
		if (this.isCurrentPlayer) {
			this.scene.cameras.main.stopFollow()
			this.scene.input.removeAllListeners()
		}
		this.sections.forEach((sec, i) => {
			this.scene.tweens.add({
				targets: sec,
				alpha: 0,
				duration: 300,
				delay: (this.sections.length - i) * 10,
				onComplete: () => {
					sec.destroy(true)
				},
			})
		})
		this.head?.destroy(true)
		this.playerNameText?.destroy()
		this.sections = []
	}
}
