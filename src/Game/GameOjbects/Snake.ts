import _ from 'lodash'
import {
	CONSTANTS,
	degToRad,
	distanceFormula,
	GameMeta,
	getSkinAssetFromEnum,
	Point,
	SnakeSkin,
	SnakeSkinSprite,
} from '../../Utils'

export class Snake {
	scene!: Phaser.Scene
	head!: Phaser.Physics.Matter.Sprite
	lastHeadPosition!: Point
	scale = 0.4
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
	skin = ''
	constructor(scene: Phaser.Scene, x: number, y: number, skin: string) {
		this.scene = scene
		this.skin = skin
		this.init(x, y)
	}

	init(x: number, y: number) {
		this.head = this.scene.matter.add.sprite(x, y, 'eyes', undefined, {
			isSensor: true,
			friction: 0,
			frictionAir: 0,
			mass: 0,
			collisionFilter: {
				group: -1,
				category: 2,
				mask: 0,
			},
		})
		this.head.setScale(this.scale).setVelocityX(2)
		this.head.setDepth(5)
		this.initSections(30)
		this.scene.cameras.main.startFollow(
			this.sections[Math.floor(this.sections.length / 2)]
		)
	}

	changeSkin(skin: string) {
		this.skin = skin
		for (let i = 0; i < this.sections.length; i++) {
			const sec = this.sections[i]
			sec.setFrame(skin)
		}
	}

	initSections(num: number) {
		for (let i = 1; i <= num; i++) {
			const x = this.head.x - i * this.preferredDistance
			const y = this.head.y
			this.addSectionAtPosition(x, y)
			//add a point to the head path so that the section stays there
			this.headPath.push(new Point(this.head.x, this.head.y, this.head.angle))
		}
	}

	addSectionAtPosition(x: number, y: number) {
		//initialize a new section
		const sec = this.scene.matter.add.sprite(x, y, 'snake_body', this.skin, {
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
		sec.setDepth(4)
		sec.setScale(this.scale)
		this.sections.push(sec)
		this.localSnakeLength++

		return sec
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

	update() {
		// for testing only

		const angle = Phaser.Math.Angle.RotateTo(
			this.head.rotation,
			this.target,
			0.08
		)

		this.head.setRotation(angle)

		const a =
			Phaser.Physics.Arcade.ArcadePhysics.prototype.velocityFromRotation(
				this.head.rotation,
				this.SPEED
			)
		this.head.setVelocity(a.x, a.y)

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
				.setScale(this.scale)
				.setAngle(this.headPath[index].angle)

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
	}
}
