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
	border = 2
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
	gamepad: GamePad | null = null
	gameRoom!: Room<GameState>
	playerObjects: Map<String, PlayerV2> = new Map()
	elapsedTime = 0
	fixedTimeStep = 1000 / 60
	debugFPS!: Phaser.GameObjects.Text
	sortedPlayers: PlayerState[] = []

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('hex', '/hex.svg')
		this.load.atlas('slither', '/spritesheet.png', '/slither.json')
		this.load.json('shapes', '/slither_physics.json')
		this.load.atlas('gamepad', '/gamepad.png', '/gamepad.json')
		this.load.atlas('food', '/food.png', '/food.json')
		this.load.atlas('snake', '/snake.png', '/snake.json')
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
			0x000000,
			0.6
		)

		rect.setOrigin(0, 0)
		rect.setStrokeStyle(50, 0x000000)

		this.initRoom()

		this.matter.world.disableGravity()
		this.createHex()
		this.scaleDiagonalHexagons(1)

		setInterval(() => {
			this.updateLeaderboard()
		}, 1000)
	}

	async initRoom() {
		const client = new Colyseus.Client(
			process.env.WS_ENDPOINT || 'ws://192.168.29.71:2567'
		)
		this.gameRoom = await client.joinOrCreate<GameState>('my_room', {
			nickname: localStorage.getItem('nickname'),
		})
		this.gameRoom.state.foodItems.onAdd = (f) => this._onAddFood(f)
		this.gameRoom.state.foodItems.onRemove = (f) => this._onRemoveFood(f)
		this.gameRoom.state.players.onAdd = (p) => this._onPlayerAdd(p)
		this.gameRoom.state.players.onRemove = (p) => this._onPlayerRemove(p)
	}

	updateLeaderboard() {
		if (!this.gameRoom) return
		if (!this.gameRoom.state) return
		const sortedPlayers: PlayerState[] = []
		let maxScore = 0
		this.gameRoom.state.players.forEach((p) => {
			if (p.snakeLength > maxScore) {
				sortedPlayers.unshift(p)
				maxScore = p.snakeLength
			} else {
				sortedPlayers.push(p)
			}
		})
		;(window as any).updateLeaderboard(sortedPlayers)
		this.sortedPlayers = sortedPlayers
	}

	_onPlayerAdd(playerState: PlayerState) {
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
			setTimeout(() => {
				const rank = this.sortedPlayers.findIndex(
					(p) => p.sessionId === this.player?.playerState.sessionId
				)
				;(window as any).onGameOver(
					{ ...this.player?.playerState, endAt: Date.now() },
					rank + 1
				)
				this.player = null
			}, 500)
		}

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
			scene: this,
			foodState: foodItem,
		})
		this.foodObjects.set(foodItem.id, f)
	}

	update(time: number, delta: number): void {
		this.elapsedTime += delta

		while (this.elapsedTime >= this.fixedTimeStep) {
			this.elapsedTime -= this.fixedTimeStep
			this.fixedTick(delta)
		}
		this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`
	}

	fixedTick(delta: number) {
		this.playerObjects.forEach((p) => {
			p.update()
		})
		if (this.player) {
			;(window as any).updateScore(this.player.playerState.snakeLength || 0)
		}
	}

	_processhandler(head: any, food: any) {
		return true
	}

	createHex() {
		this.hexConeHeight = (Math.tan(Math.PI / 6) * this.hexWidth) / 2
		this.hexGroup = this.add.group()
		this.gridSizeX = Math.ceil(GameMeta.boundX / (this.hexWidth - this.border))
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
				hex.setDepth(1)
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
		var delay = 1
		for (var slice = 1; slice < m + n - 1; ++slice) {
			var z1 = slice < n ? 1 : slice - n + 1
			var z2 = slice < m ? 1 : slice - m + 1
			for (var j = slice - z2; j >= z1; --j) {
				var hexagon = this.hexArray[j][slice - j]
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
