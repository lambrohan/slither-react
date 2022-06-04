import { GameMeta, generateFood, getCenter, SPRITE_LABELS } from '../../Utils'
import Phaser, { GameObjects } from 'phaser'
import { Player } from '../GameOjbects/Player'
import { FoodItem } from '../Models'
import { DebugInfo } from '../GameOjbects/Debug'
import { GamePad } from '../GameOjbects/Gamepad'
import { GameState } from '../Models/GameState'
import { Food } from '../GameOjbects/Food'
import { Room } from 'colyseus.js'
import * as Colyseus from 'colyseus.js'

export default class MainScene extends Phaser.Scene {
	hexWidth = 70
	border = 4
	hexHeight = 80
	hexArray: Phaser.GameObjects.Sprite[][] = []
	hexGroup: Phaser.GameObjects.Group | undefined = undefined
	gridSizeX: number = 0
	gridSizeY: number = 0
	hexConeHeight: number = 0
	player: Player | null = null
	foodGroup: Phaser.GameObjects.Group | null = null
	foodObjects: Map<String, Food> = new Map()
	players: Array<Player> = []
	debugView: DebugInfo | null = null
	gamepad: GamePad | null = null
	gameRoom: Room<GameState> | null = null

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('hex', '/hex.svg')
		this.load.atlas('slither', '/spritesheet.png', '/slither.json')
		this.load.json('shapes', '/slither_physics.json')
		this.load.atlas('gamepad', '/gamepad.png', '/gamepad.json')
	}

	create() {
		this.initRoom()
		this.matter.world.disableGravity()
		this.createHex()
		this.scaleDiagonalHexagons(1)
		this.createPlayer()
		this._handleCollision()
		this.debugView = new DebugInfo(this.scene)
		this.gamepad = new GamePad(this)
		this.gamepad.setPlayer(this.player)
	}

	async initRoom() {
		const client = new Colyseus.Client('ws://localhost:2567')
		this.gameRoom = await client.joinOrCreate<GameState>('my_room')
		this.gameRoom.state.foodItems.onAdd = (f) => this._onAddFood(f)
		this.gameRoom.state.foodItems.onRemove = (f) => this._onRemoveFood(f)
	}

	_onRemoveFood(foodItem: FoodItem) {
		this.foodObjects.get(foodItem.id)?.destroy()
	}
	_onAddFood(foodItem: FoodItem) {
		const f = new Food({
			world: this.matter.world,
			foodState: foodItem,
		})
		this.foodObjects.set(foodItem.id, f)
	}

	update(time: number, delta: number): void {
		// update player
		this.player?.update()
		this.debugView?.updateScore(this.player?.numSnakeSections || 0)
	}

	_handleCollision() {
		this.matter.world.on(
			'collisionstart',
			(
				event: Phaser.Physics.Matter.Events.CollisionStartEvent,
				bodyA: Matter.Body | any,
				bodyB: Matter.Body | any
			) => {
				if (
					bodyA.label !== bodyB.label &&
					bodyA.label === SPRITE_LABELS.HEAD &&
					bodyB.label === SPRITE_LABELS.FOOD
				) {
					this.player?.grow(bodyB.gameObject)
					;(bodyB.gameObject as Food).destroy()
					this.matter.world.remove(bodyB)
				}
			}
		)
	}

	_processhandler(head: any, food: any) {
		return true
	}

	createPlayer() {
		const center = getCenter(this)
		this.player = new Player({
			index: 0,
			scene: this,
			x: center.x,
			y: center.y,

			numSnakeSections: 30,
			assets: {
				head: 'head',
				body: 'body',
			},
		})
		this.cameras.main.setBounds(0, 0, GameMeta.boundX, GameMeta.boundY)
		this.cameras.main.startFollow(this.player.snakeHead as any)
	}

	createHex() {
		this.hexConeHeight = (Math.tan(Math.PI / 6) * this.hexWidth) / 2
		this.hexGroup = this.add.group()
		this.gridSizeX = Math.floor(GameMeta.boundX / this.hexWidth)
		this.gridSizeY = Math.ceil(
			GameMeta.boundY / (this.hexHeight - this.hexConeHeight)
		)

		for (let i = 1; i < this.gridSizeX; i++) {
			this.hexArray[i] = []
			for (let j = 1; j < this.gridSizeY; j++) {
				const x = i * (this.hexWidth + this.border)
				const y = j * (this.hexHeight - this.hexConeHeight + this.border)
				const xOffset = j % 2 == 0 ? (this.hexWidth + this.border) / 2 : 0
				const hex = this.add.sprite(x + xOffset, y, 'hex')
				hex.setAlpha(0)
				if (this.hexArray[i]) {
					this.hexArray[i][j] = hex
				}
				this.hexGroup.add(hex)
			}
		}

		this.hexGroup.setOrigin(1.5, 1)
	}

	scaleDiagonalHexagons(scale: number) {
		var m = this.hexArray.length
		var n = this.hexArray[1].length
		var delay = 100
		for (var slice = 1; slice < m + n - 1; ++slice) {
			var z1 = slice < n ? 1 : slice - n + 1
			var z2 = slice < m ? 1 : slice - m + 1
			for (var j = slice - z2; j >= z1; --j) {
				var hexagon = this.hexArray[j][slice - j]
				delay += Phaser.Math.Between(2, 4)
				this.add.tween({
					targets: hexagon,
					alpha: Phaser.Math.Between(70, 89) / 100,
					angle: 0,
					scaleX: scale,
					scaleY: scale,
					duration: 400,
					ease: 'Linear',
					delay,
				})
			}
		}
	}
}
