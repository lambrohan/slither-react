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
import { SnakeSectionState } from '../Models/SnakeSection'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	lastHeadPosition!: Point
	scale = 1.42
	headPath = new Array<Point>()
	sections = new Array<Phaser.Physics.Matter.Sprite>()
	sectionGroup!: Phaser.GameObjects.Group
	queuedSections = 0
	isCurrentPlayer: boolean = false
	localSnakeLength: number = 0
	cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
	remoteRef!: Phaser.GameObjects.Arc
	preferredDistance = CONSTANTS.PREF_DISTANCE * this.scale
	SPEED = CONSTANTS.DEF_SPEED
	target = 0
	skin!: SnakeSkinSprite
	playerNameText!: Phaser.GameObjects.Text
	playerLight!: Phaser.GameObjects.PointLight

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
		this.scale = this.playerState.scale
		this.playerNameText = this.scene.add.text(
			this.playerState.x,
			this.playerState.y - 50,
			this.playerState.nickname || this.playerState.sessionId,
			{ fontSize: '12px' }
		)
		this.playerNameText.setDepth(12)

		this.head = this.scene.matter.add.sprite(
			this.playerState.x,
			this.playerState.y,
			'snake',
			this.skin.head,
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

		this.setRemoteRef()

		this.head.setDepth(1001)
		this.head.setAngle(this.playerState.angle)
		this.head.setScale(this.scale)
		this.lastHeadPosition = new Point(this.head.x, this.head.y, this.head.angle)

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
			// this.addSection(section)
			console.log('add section')
			if (this.playerState.snakeLength > 2) {
				this.incrementSize()
			}
		}

		this.playerState.sections.onRemove = () => {
			this.sections.pop()?.destroy()
			this.localSnakeLength--
		}
	}

	setRemoteRef() {
		if (process.env.NODE_ENV == 'production') return
		this.remoteRef = this.scene.add.circle(0, 0, this.head.width / 2)
		this.remoteRef.setOrigin(0.5, 0.5)
		this.remoteRef.setStrokeStyle(1, 0xff0000)
		this.remoteRef.setDepth(2)
	}

	incrementSize() {
		this.addSectionsAfterLast(1)
	}

	setScale() {
		this.preferredDistance = CONSTANTS.PREF_DISTANCE * this.scale
		if (this.remoteRef) {
			this.remoteRef.setScale(this.scale)
		}
		this.head.setScale(this.scale)
		this.sections.forEach((sec) => {
			sec.setScale(this.scale)
		})
	}

	initSections(num: number) {
		for (let i = 1; i <= num; i++) {
			const x = this.head.x
			const y = this.head.x + i * this.preferredDistance
			this.addSectionAtPosition(x, y)
			//add a point to the head path so that the section stays there
			this.headPath.push(new Point(this.head.x, this.head.y, this.head.angle))
		}
	}

	addSectionAtPosition(x: number, y: number) {
		//initialize a new section
		const sec = this.scene.matter.add.sprite(x, y, 'snake', this.skin.body, {
			isSensor: true,
			mass: 0,
			friction: 0,
			frictionAir: 0,
			collisionFilter: {
				group: -1,
				category: 2,
				mask: 0,
			},
		})
		sec.setDepth(1000 - this.sections.length)
		sec.setScale(this.scale)
		// this.sectionGroup.add(sec)
		this.sections.push(sec)
		this.localSnakeLength++

		return sec
	}

	onCycleComplete() {
		if (this.queuedSections > 0) {
			let lastSec = this.sections[this.sections.length - 1]
			this.addSectionAtPosition(lastSec.x, lastSec.y)
			this.queuedSections--
		}
	}

	update() {
		this.scale = this.playerState.scale
		this.head.setScale(this.playerState.scale)
		this.preferredDistance = CONSTANTS.PREF_DISTANCE * this.scale
		// for testing only
		// console.log(this.head.angle, this.playerState.angle)
		this.refMovement()

		this.localPlayerMovement()
		this.interpolateRemotePlayers()
		this.playerNameText.setPosition(this.head.x, this.head.y - 50)

		let point = this.headPath.pop()!
		point.setTo(this.head.x, this.head.y, this.head.angle)
		this.headPath.unshift(point)

		//place each section of the snake on the path of the snake head,
		//a certain distance from the section before it
		let index = 0
		let lastIndex = null

		//TODO- check local len and server len
		for (let i = 0; i < this.localSnakeLength; i++) {
			this.sections[i]
				.setPosition(this.headPath[index].x, this.headPath[index].y)
				.setScale(this.playerState.scale)
			this.sections[i].setAngle(this.headPath[index].angle)

			//hide sections if they are at the same position
			if (lastIndex && index == lastIndex) {
				this.sections[i].alpha = 0
			} else {
				this.sections[i].alpha = 1
			}

			lastIndex = index
			//this finds the index in the head path array that the next point
			//should be at
			index = this.findNextPointIndex(index)
		}

		if (index >= this.headPath.length - 1) {
			let lastPos = this.headPath[this.headPath.length - 1]
			this.headPath.push(new Point(lastPos.x, lastPos.y, lastPos.angle))
		} else {
			this.headPath.pop()
		}

		//this calls onCycleComplete every time a cycle is completed
		//a cycle is the time it takes the second section of a snake to reach
		//where the head of the snake was at the end of the last cycle
		let i = 0
		let found = false
		while (
			this.headPath[i].x != this.sections[1]?.x &&
			this.headPath[i].y != this.sections[1]?.y
		) {
			if (
				this.headPath[i].x == this.lastHeadPosition.x &&
				this.headPath[i].y == this.lastHeadPosition.y
			) {
				found = true
				break
			}
			i++
		}
		if (!found) {
			this.lastHeadPosition = new Point(
				this.head.x,
				this.head.y,
				this.head.angle
			)
			this.onCycleComplete()
		}
	}

	refMovement() {
		if (!this.remoteRef) return
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
			Phaser.Math.Linear(this.head.x, this.playerState.x, 0.08),
			Phaser.Math.Linear(this.head.y, this.playerState.y, 0.08)
		)
	}

	findNextPointIndex(currentIndex: number) {
		//we are trying to find a point at approximately this distance away
		//from the point before it, where the distance is the total length of
		//all the lines connecting the two points
		let prefDist = this.preferredDistance
		let len = 0
		let dif = len - prefDist
		let i = currentIndex
		let prevDif = null
		//this loop sums the distances between points on the path of the head
		//starting from the given index of the function and continues until
		//this sum nears the preferred distance between two snake sections
		while (i + 1 < this.headPath.length && (dif === null || dif < 0)) {
			//get distance between next two points
			let dist = distanceFormula(
				this.headPath[i].x,
				this.headPath[i].y,
				this.headPath[i + 1].x,
				this.headPath[i + 1].y
			)
			len += dist
			prevDif = dif
			//we are trying to get the difference between the current sum and
			//the preferred distance close to zero
			dif = len - prefDist
			i++
		}

		//choose the index that makes the difference closer to zero
		//once the loop is complete
		if (prevDif === null || Math.abs(prevDif) > Math.abs(dif)) {
			return i
		} else {
			return i - 1
		}
	}

	addSectionsAfterLast(amount: number) {
		this.queuedSections += amount
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
