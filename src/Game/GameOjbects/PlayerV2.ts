import {
	CONSTANTS,
	degToRad,
	distanceFormula,
	Point,
	velocityFromAngle,
} from '../../Utils'
import { FoodItem } from '../Models'
import { GameState } from '../Models/GameState'
import { MousePosition } from '../Models/InputSchema'
import { PlayerState } from '../Models/PlayerState'
import { SnakeSectionState } from '../Models/SnakeSection'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	lastHeadPosition!: Point
	scale = 1.4
	headPath = new Array<Point>()
	sections = new Array<Phaser.GameObjects.Sprite>()
	sectionGroup!: Map<string, Phaser.GameObjects.Sprite>
	queuedSections = 0
	isCurrentPlayer: boolean = false
	localSnakeLength: number = 0
	cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys
	remoteRef!: Phaser.GameObjects.Rectangle
	preferredDistance = 17 * this.scale
	lastInputTimestamp = 0
	lastMouseX = 0
	lastMouseY = 0

	constructor(
		scene: MainScene,
		playerState: PlayerState,
		isCurrentPlayer = false
	) {
		this.playerState = playerState
		this.scene = scene
		this.isCurrentPlayer = isCurrentPlayer
		this.sectionGroup = new Map()
		this.init()
	}

	init() {
		this.head = this.scene.matter.add.sprite(
			this.playerState.x,
			this.playerState.y,
			'slither',
			'snake/head.png',
			{ isSensor: true }
		)

		this.remoteRef = this.scene.add.rectangle(0, 0, 10, 10)
		this.remoteRef.setStrokeStyle(1, 0xff0000)
		this.remoteRef.setDepth(2)

		this.head.setDepth(2)
		this.head.setAngle(this.playerState.angle)
		this.head.setScale(this.scale)
		this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y)

		if (this.isCurrentPlayer) {
			this.scene.cameras.main.startFollow(this.head)
			this.cursorKeys = this.scene.input.keyboard.createCursorKeys()
		}

		this.initSections(this.playerState.snakeLength)

		this.playerState.sections.onAdd = (section) => {
			// this.addSection(section)
			console.log('add section')
			if (this.playerState.snakeLength > 2) {
				this.addSectionsAfterLast(1)
			}
		}
	}

	initSections(num: number) {
		for (let i = 1; i <= num; i++) {
			const x = this.head.x
			const y = this.head.x + i * this.preferredDistance
			this.addSectionAtPosition(x, y)
			//add a point to the head path so that the section stays there
			this.headPath.push(new Point(this.head.x, this.head.y))
		}
	}

	addSectionAtPosition(x: number, y: number) {
		//initialize a new section
		const sec = this.scene.matter.add.sprite(
			x,
			y,
			'slither',
			'snake/body.png',
			{
				isSensor: true,
			}
		)
		sec.setDepth(1)
		sec.setScale(this.scale)
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

	addSection(state: SnakeSectionState) {
		const sec = this.scene.matter.add.sprite(
			state.x,
			state.y,
			'slither',
			'snake/body.png',
			{
				isSensor: true,
			}
		)
		sec.setDepth(1)
		sec.setScale(this.scale)
		this.sections.push(sec)
		console.log('added')
	}

	update() {
		// for testing only
		// console.log(this.head.angle, this.playerState.angle)

		this.remoteRef.setPosition(this.playerState.x, this.playerState.y)
		this.remoteRef.setAngle(this.playerState.angle)
		this.remoteRef.setOrigin(0.5, 0.5)
		this.debouncedInput()

		this.localPlayerMovement()
		this.interpolateRemotePlayers()

		if (!this.head || !this.headPath.length) return
		let point = this.headPath.pop()!
		point.setTo(this.head.x, this.head.y)
		this.headPath.unshift(point)

		//place each section of the snake on the path of the snake head,
		//a certain distance from the section before it
		let index = 0
		let lastIndex = null

		//TODO- check local len and server len
		for (let i = 0; i < this.localSnakeLength; i++) {
			this.sections[i].setPosition(
				this.headPath[index].x,
				this.headPath[index].y
			)

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
			this.headPath.push(new Point(lastPos.x, lastPos.y))
		} else {
			this.headPath.pop()
		}

		//this calls onCycleComplete every time a cycle is completed
		//a cycle is the time it takes the second section of a snake to reach
		//where the head of the snake was at the end of the last cycle
		let i = 0
		let found = false
		while (
			this.headPath[i].x != this.sections[1].x &&
			this.headPath[i].y != this.sections[1].y
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
			this.lastHeadPosition = new Point(this.head.x, this.head.y)
			this.onCycleComplete()
		}
	}

	localPlayerMovement() {
		if (!this.isCurrentPlayer) return

		const vel = velocityFromAngle(
			Number(this.head.angle.toFixed(2)),
			CONSTANTS.SNAKE_SPEED
		)
		this.head.setPosition(this.head.x + vel.x, this.head.y + vel.y)

		if (
			Math.abs(this.head.x - this.playerState.x) > 10 ||
			Math.abs(this.head.y - this.playerState.y) > 10
		) {
			console.log('correcting position')
			this.head.setPosition(
				Phaser.Math.Linear(this.head.x, this.playerState.x, 0.02),
				Phaser.Math.Linear(this.head.y, this.playerState.y, 0.02)
			)
		}

		if (Math.abs(this.head.angle - this.playerState.angle) > 1) {
			console.log('correcting angle')
			this.head.setAngle(
				Phaser.Math.Linear(this.head.angle, this.playerState.angle, 0.02)
			)
		}

		// sync server position after a while
	}

	debouncedInput() {
		if (!this.isCurrentPlayer) return
		this.head.setAngularVelocity(0)
		var mousePosX = this.scene.input.activePointer.worldX
		var mousePosY = this.scene.input.activePointer.worldY
		if (this.lastMouseX === mousePosX && this.lastMouseY === mousePosY) {
			return
		}
		this.lastMouseX = mousePosX
		this.lastMouseY = mousePosY
		let angle =
			(Math.atan2(mousePosY - this.head.y, mousePosX - this.head.x) * 180) /
			Math.PI
		const diff = Math.abs(this.head.angle - angle)

		if (Date.now() - this.lastInputTimestamp > 50) {
			this.lastInputTimestamp = Date.now()
			this.scene.gameRoom.send('input', `${mousePosX}_${mousePosY}`)
			this.head.setRotation(degToRad(angle))
		}
	}

	interpolateRemotePlayers() {
		if (this.isCurrentPlayer) return
		this.head.setAngle(
			Phaser.Math.Linear(this.head.angle, this.playerState.angle, 0.02)
		)
		this.head.setPosition(
			Phaser.Math.Linear(this.head.x, this.playerState.x, 0.02),
			Phaser.Math.Linear(this.head.y, this.playerState.y, 0.02)
		)
	}

	updateRemote() {
		// interpolate
		this.head.setPosition(
			Phaser.Math.Linear(this.head.x, this.playerState.x, 0.2),
			Phaser.Math.Linear(this.head.y, this.playerState.y, 0.2)
		)
		this.head.setAngle(
			Phaser.Math.Linear(this.head.angle, this.playerState.angle, 0.2)
		)

		for (let i = 0; i < this.playerState.sections.length; i++) {
			const el = this.playerState.sections[i]
			const section = this.sections[i]
			section.setPosition(
				Phaser.Math.Linear(section.x, el.x, 0.2),
				Phaser.Math.Linear(section.y, el.y, 0.2)
			)
		}
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
		}
		this.sections.forEach((sec) => {
			sec.destroy(true)
		})
		this.head.destroy(true)

		this.sections = []
	}
}
