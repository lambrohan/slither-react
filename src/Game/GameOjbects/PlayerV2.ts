import { CONSTANTS, distanceFormula, velocityFromAngle } from '../../Utils'
import { FoodItem } from '../Models'
import { PlayerState } from '../Models/PlayerState'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	lastHeadPosition!: Phaser.Geom.Point
	scale = 1
	preferredDistance = 17 * this.scale
	headPath = new Array<Phaser.Geom.Point>()
	sections = new Array<Phaser.Physics.Matter.Sprite>()
	sectionGroup!: Phaser.GameObjects.Group
	queuedSections = 0
	isCurrentPlayer: boolean = false
	localSnakeLength: number = 0

	constructor(
		scene: MainScene,
		playerState: PlayerState,
		isCurrentPlayer = false
	) {
		this.playerState = playerState
		this.scene = scene
		this.isCurrentPlayer = isCurrentPlayer
		this.sectionGroup = this.scene.add.group()
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
		this.head.setDepth(2)
		this.head.setAngle(this.playerState.angle)
		this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y)

		/// add n sections behind head
		this.initSections()

		if (this.isCurrentPlayer) {
			this.scene.cameras.main.startFollow(this.head)
		}

		this.playerState.consumedFood.onAdd = (size: number) => {
			this.addSectionsAfterLast(size)
		}
	}

	initSections() {
		for (let i = 1; i <= this.playerState.snakeLength; i++) {
			var x = this.head.x
			var y = this.head.y + i * this.preferredDistance
			this.addSectionAtPosition(x, y)
			//add a point to the head path so that the section stays there
			this.headPath.push(new Phaser.Geom.Point(this.head.x, this.head.y))
		}
	}

	addSectionAtPosition(x: number, y: number) {
		//initialize a new section
		var sec = this.scene.matter.add.sprite(x, y, 'slither', 'snake/body.png', {
			isSensor: true,
		})

		sec.setDepth(1)
		this.localSnakeLength++

		this.sectionGroup.add(sec)

		this.sections.push(sec)

		return sec
	}

	update() {
		this.head.setAngle(this.playerState.angle)
		const velocity = velocityFromAngle(this.head.angle, CONSTANTS.SNAKE_SPEED)
		this.head.setVelocity(velocity.x, velocity.y)
		// this.head.setAngle(this.playerState.angle)
		// this.head.setPosition(this.playerState.x, this.playerState.y)

		//remove the last element of an array that contains points which
		//the head traveled through
		//then move this point to the front of the array and change its value
		//to be where the head is located
		var point = this.headPath.pop()!
		point.setTo(this.head.x, this.head.y)
		this.headPath.unshift(point)

		//place each section of the snake on the path of the snake head,
		//a certain distance from the section before it
		var index = 0
		let lastIndex = null
		for (var i = 0; i < this.localSnakeLength; i++) {
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
			var lastPos = this.headPath[this.headPath.length - 1]
			this.headPath.push(new Phaser.Geom.Point(lastPos.x, lastPos.y))
		} else {
			this.headPath.pop()
		}

		//this calls onCycleComplete every time a cycle is completed
		//a cycle is the time it takes the second section of a snake to reach
		//where the head of the snake was at the end of the last cycle
		var i = 0
		var found = false
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
			this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y)
			this.onCycleComplete()
		}
	}

	/**
	 * Find in the headPath array which point the next section of the snake
	 * should be placed at, based on the distance between points
	 * @param  {Integer} currentIndex Index of the previous snake section
	 * @return {Integer}              new index
	 */
	findNextPointIndex(currentIndex: number) {
		var pt = this.headPath[currentIndex]
		//we are trying to find a point at approximately this distance away
		//from the point before it, where the distance is the total length of
		//all the lines connecting the two points
		var prefDist = this.preferredDistance
		var len = 0
		var dif = len - prefDist
		var i = currentIndex
		var prevDif = null
		//this loop sums the distances between points on the path of the head
		//starting from the given index of the function and continues until
		//this sum nears the preferred distance between two snake sections
		while (i + 1 < this.headPath.length && (dif === null || dif < 0)) {
			//get distance between next two points
			var dist = distanceFormula(
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

	onCycleComplete() {
		if (this.queuedSections > 0) {
			var lastSec = this.sections[this.sections.length - 1]
			this.addSectionAtPosition(lastSec.x, lastSec.y)
			this.queuedSections--
		}
	}

	addSectionsAfterLast(amount: number) {
		console.log('wtf', amount)
		this.queuedSections += amount
	}

	destroy() {}
}
