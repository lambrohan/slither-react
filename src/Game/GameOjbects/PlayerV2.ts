import { CONSTANTS, GameMeta, Point, SnakeSkinSprite } from '../../Utils'
import { PlayerState } from '../Models/PlayerState'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	sections = new Array<Phaser.GameObjects.Sprite>()
	isCurrentPlayer: boolean = false
	cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
	remoteRef!: Phaser.GameObjects.Arc
	SPEED = CONSTANTS.DEF_SPEED
	target = 0
	skin!: SnakeSkinSprite
	playerNameText!: Phaser.GameObjects.Text
	playerLight!: Phaser.GameObjects.PointLight
	scale = 1
	snakePath!: Array<Point>

	constructor(
		scene: MainScene,
		playerState: PlayerState,
		isCurrentPlayer = false
	) {
		this.playerState = playerState
		this.scene = scene
		this.isCurrentPlayer = isCurrentPlayer
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
			'eyes',
			undefined,
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
		this.head.setDepth(this.playerState.snakeLength + 3)

		this.setRemoteRef()

		if (this.isCurrentPlayer) {
			this.scene.cameras.main.startFollow(this.head)
			this.playerLight = this.scene.add.pointlight(
				this.head.x,
				this.head.y,
				0xaa0000,
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
			const sec = this.sections.pop()!
			this.scene.sectionGroup.killAndHide(sec)
			for (let i = 0; i < this.playerState.spacer; i++) {
				this.snakePath.pop()
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
		this.sections = []
		this.snakePath = []

		for (let i = 0; i < num; i++) {
			const sec: Phaser.GameObjects.Sprite = this.scene.sectionGroup.create(
				this.head.x,
				this.head.y,
				'snake',
				this.playerState.skin,
				true,
				true
			)
			sec.setDepth(num + 2 - i)
			this.sections.push(sec)
		}

		for (let i = 0; i < num * this.playerState.spacer; i++) {
			this.snakePath.push(new Point(this.head.x, this.head.y, this.head.angle))
		}
	}

	addSection() {
		const last = this.sections[this.sections.length - 1]
		const sec: Phaser.GameObjects.Sprite = this.scene.sectionGroup.get(
			last.x,
			last.y,
			'snake',
			this.playerState.skin,
			true
		)
		sec.setActive(true)
		sec.setVisible(true)
		sec
			.setDepth(last.depth)
			.setAngle(last.angle)
			.setFrame(this.playerState.skin)
		this.sections.push(sec)

		for (let i = 0; i < this.playerState.spacer; i++) {
			this.snakePath.push(new Point(last.x, last.y, last.angle))
		}
	}

	update() {
		this.scale = this.playerState.scale

		this.head
			.setAlpha(this.playerState.cooldown ? 0.4 : 1)
			.setScale(this.playerState.scale)
			.setDepth(this.sections.length + 4)

		// for testing only
		// console.log(this.head.angle, this.playerState.angle)
		this.refMovement()

		this.localPlayerMovement()
		this.interpolateRemotePlayers()
		this.playerNameText.setPosition(this.head.x, this.head.y - 50)

		let part = this.snakePath.pop()!
		part.setTo(this.head.x, this.head.y, this.head.angle)
		this.snakePath.unshift(part)

		for (let i = 0; i < this.sections.length; i++) {
			const el = this.snakePath[i * this.playerState.spacer]
			this.sections[i]
				.setPosition(el.x, el.y)
				.setAngle(el.angle)
				.setDepth(this.playerState.snakeLength + 3 - i)
				.setAlpha(this.playerState.cooldown ? 0.4 : 1)
				.setScale(this.playerState.scale)
		}
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
		if (Math.abs(this.head.angle - this.playerState.angle) > 1) {
			this.head.setAngle(this.playerState.angle)
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
		this.sections.forEach((s) => {
			this.scene.sectionGroup.killAndHide(s)
		})
		this.head?.destroy(true)
		this.playerNameText?.destroy()
		this.sections = []
	}
}
