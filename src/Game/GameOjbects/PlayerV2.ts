import { CONSTANTS, distanceFormula, velocityFromAngle } from '../../Utils'
import { FoodItem } from '../Models'
import { PlayerState } from '../Models/PlayerState'
import { SnakeSectionState } from '../Models/SnakeSection'
import MainScene from '../Scenes/MainScene'

export class PlayerV2 {
	scene!: MainScene
	head!: Phaser.Physics.Matter.Sprite
	playerState!: PlayerState
	lastHeadPosition!: Phaser.Geom.Point
	scale = 1.4
	headPath = new Array<Phaser.Geom.Point>()
	sections = new Array<Phaser.Physics.Matter.Sprite>()
	sectionGroup!: Map<string, Phaser.Physics.Matter.Sprite>
	queuedSections = 0
	isCurrentPlayer: boolean = false
	localSnakeLength: number = 0
	remoteRef!: Phaser.GameObjects.Arc

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
		// this.remoteRef = this.scene.add.circle(0, 0, 10)
		// this.remoteRef.setStrokeStyle(1, 0xff0000)

		this.head.setDepth(2)
		this.head.setAngle(this.playerState.angle)
		this.head.setScale(this.scale)
		this.lastHeadPosition = new Phaser.Geom.Point(this.head.x, this.head.y)

		/// add n sections behind head

		if (this.isCurrentPlayer) {
			this.scene.cameras.main.startFollow(this.head)
		}

		// this.initSections()

		this.playerState.sections.onAdd = (section) => {
			this.addSection(section)
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

	updateRemote() {
		// for testing only
		// this.remoteRef.setPosition(this.playerState.x, this.playerState.y)
		// this.remoteRef.setAngle(this.playerState.angle)

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
