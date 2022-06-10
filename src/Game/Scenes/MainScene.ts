import { GameMeta, generateFood, getCenter, SPRITE_LABELS } from '../../Utils'
import Phaser, { GameObjects } from 'phaser'
import { FoodItem } from '../Models'
import { DebugInfo } from '../GameOjbects/Debug'
import { GamePad } from '../GameOjbects/Gamepad'
import { GameState } from '../Models/GameState'
import { Food } from '../GameOjbects/Food'
import { Room } from 'colyseus.js'
import * as Colyseus from 'colyseus.js'
import { PlayerState } from '../Models/PlayerState'
import { PlayerV2 } from '../GameOjbects/PlayerV2'

export default class MainScene extends Phaser.Scene {
	hexWidth = 70
	border = 4
	hexHeight = 80
	hexArray: Phaser.GameObjects.Sprite[][] = []
	hexGroup: Phaser.GameObjects.Group | undefined = undefined
	gridSizeX: number = 0
	gridSizeY: number = 0
	hexConeHeight: number = 0
	player: PlayerV2 | null = null
	foodGroup: Phaser.GameObjects.Group | null = null
	foodObjects: Map<String, Food> = new Map()
	players: Array<PlayerV2> = []
	debugView: DebugInfo | null = null
	gamepad: GamePad | null = null
	gameRoom!: Room<GameState>
	playerObjects: Map<String, PlayerV2> = new Map()
	elapsedTime = 0
	fixedTimeStep = 1000 / 60
	debugFPS!: Phaser.GameObjects.Text

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
		this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' })
		this.debugFPS.setDepth(10)
		this.debugFPS.setScrollFactor(0, 0)

		const rect = this.add.rectangle(
			0,
			0,
			GameMeta.boundX,
			GameMeta.boundY,
			0xff290010
		)
		this.cameras.main.setBounds(
			-50,
			-50,
			GameMeta.boundX + 100,
			GameMeta.boundY + 100
		)
		rect.setOrigin(0, 0)
		rect.setStrokeStyle(0, 0xff290010)

		this.initRoom()
		this.matter.world.disableGravity()
		this.createHex()
		this.scaleDiagonalHexagons(1)
		this.debugView = new DebugInfo(this.scene)
		// this.setInputs()
	}

	async initRoom() {
		const client = new Colyseus.Client('ws://192.168.29.71:2567')
		this.gameRoom = await client.joinOrCreate<GameState>('my_room')
		this.gameRoom.state.foodItems.onAdd = (f) => this._onAddFood(f)
		this.gameRoom.state.foodItems.onRemove = (f) => this._onRemoveFood(f)
		this.gameRoom.state.players.onAdd = (p) => this._onPlayerAdd(p)
		this.gameRoom.state.players.onRemove = (p) => this._onPlayerRemove(p)
	}

	_onPlayerAdd(playerState: PlayerState) {
		console.log('player added', playerState)

		if (!playerState?.sessionId) return

		const player = new PlayerV2(
			this,
			playerState,
			playerState.sessionId === this.gameRoom.sessionId
		)

		if (player.isCurrentPlayer) {
			this.player = player
		}

		this.playerObjects.set(playerState.sessionId, player)
	}

	_onPlayerRemove(playerState: PlayerState) {
		if (!playerState.sessionId) return
		if (this.player?.playerState.sessionId === playerState.sessionId) {
			this.debugView?.scoreText?.setText(
				`Game Over, Your Score is ${playerState.score}`
			)

			this.player = null
		}
		this.debugView?.scoreText?.setText(
			`Game Over, Your Score is ${playerState.score}`
		)
		this.playerObjects.get(playerState.sessionId)?.destroy()

		this.playerObjects.delete(playerState.sessionId)
	}

	_onRemoveFood(foodItem: FoodItem) {
		const foodObj = this.foodObjects.get(foodItem.id)
		this.tweens.add({
			targets: foodObj,
			scale: 0,
			duration: 100,
			onComplete: () => {
				foodObj?.destroy()
			},
		})
	}
	_onAddFood(foodItem: FoodItem) {
		const f = new Food({
			world: this,
			foodState: foodItem,
		})
		this.foodObjects.set(foodItem.id, f)
	}

	update(time: number, delta: number): void {
		this.elapsedTime += delta

		while (this.elapsedTime >= this.fixedTimeStep) {
			this.elapsedTime -= this.fixedTimeStep
			this.fixedTick()
		}
		this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`
	}

	fixedTick() {
		this.playerObjects.forEach((p) => {
			p.update()
		})
		if (this.player) {
			this.debugView?.updateScore(this.player?.playerState.score)
		}
	}

	_processhandler(head: any, food: any) {
		return true
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

	setInputs() {
		this.input.on('pointerup', () => {
			const x = this.input.activePointer.worldX
			const y = this.input.activePointer.worldY
			this.gameRoom?.send(
				'pointerup',
				Number(`${parseInt(x + '')}.${parseInt(y + '')}`)
			)
		})
	}
}
