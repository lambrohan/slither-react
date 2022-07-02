import { GameMeta, generateFood, getCenter, SPRITE_LABELS } from '../../Utils'
import Phaser, { GameObjects } from 'phaser'
import { FoodItem } from '../Models'
import { GamePad } from '../GameOjbects/Gamepad'
import { GameState } from '../Models/GameState'
import { Food } from '../GameOjbects/Food'
import { Room } from 'colyseus.js'
import * as Colyseus from 'colyseus.js'
import { PlayerState } from '../Models/PlayerState'
import { PlayerV2 } from '../GameOjbects/PlayerV2'
import _ from 'lodash'

export default class MainScene extends Phaser.Scene {
	tileW = 584
	tileH = 527
	gridSizeX: number = 0
	gridSizeY: number = 0
	player: PlayerV2 | null = null
	foodGroup!: Phaser.GameObjects.Group
	foodObjects: Map<String, Food> = new Map()
	players: Array<PlayerV2> = []
	gameRoom!: Room<GameState>
	playerObjects: Map<String, PlayerV2> = new Map()
	elapsedTime = 0
	fixedTimeStep = 1000 / 60
	debugFPS!: Phaser.GameObjects.Text
	sortedPlayers: PlayerState[] = []
	playerRank = 0
	container!: Phaser.GameObjects.Container
	miniMap!: Phaser.Cameras.Scene2D.Camera

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('bg', '/bg.png')
		this.load.atlas('food', '/food.png', '/food.json')
		this.load.atlas('snake', '/snake.png', '/snake.json')
	}

	create() {
		this.miniMap = this.cameras
			.add(
				this.sys.canvas.width - GameMeta.boundX / 12,
				this.sys.canvas.height - GameMeta.boundY / 12,
				GameMeta.boundX / 12,
				GameMeta.boundY / 12
			)
			.setZoom(0.08)
			.setName('mini')
		this.miniMap
			.setBounds(0, 0, GameMeta.boundX, GameMeta.boundY)
			.setBackgroundColor(0x80000000)
		this.foodGroup = this.add.group()

		this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' })
		this.debugFPS.setDepth(10)
		this.debugFPS.setScrollFactor(0, 0)

		const rect = this.add.rectangle(
			0,
			0,
			GameMeta.boundX,
			GameMeta.boundY,
			0x000000,
			0
		)

		rect.setOrigin(0, 0)
		rect.setStrokeStyle(50, 0x000000)

		this.matter.world.disableGravity()
		this.createBg()
		this.initRoom()
		;(window as any).leaderboardInterval = setInterval(() => {
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
		this.gameRoom.state.foodItems.onAdd = async (f) => await this._onAddFood(f)
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
			if (p.tokens > maxScore) {
				sortedPlayers.unshift(p)
				maxScore = p.tokens
			} else {
				sortedPlayers.push(p)
			}
		})
		this.sortedPlayers = sortedPlayers
		const r = this.sortedPlayers.findIndex(
			(p) => p.sessionId == this.player?.playerState.sessionId
		)

		r !== -1 ? (this.playerRank = r + 1) : ''
		;(window as any).updateLeaderboard(sortedPlayers)
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
			this.gameRoom.leave()
			setTimeout(() => {
				clearInterval((window as any).leaderboardInterval)
				;(window as any).onGameOver(
					{ ...this.player?.playerState, endAt: Date.now() },
					this.playerRank
				)
				this.game?.destroy(true)
			}, 500)
		}

		this.playerObjects.get(playerState.sessionId)?.destroy()

		this.playerObjects.delete(playerState.sessionId)
	}

	_onRemoveFood(foodItem: FoodItem) {
		const foodObj = this.foodObjects.get(foodItem.id)!
		this.foodObjects.delete(foodItem.id)
		const t = this.tweens.add({
			targets: foodObj,
			scale: 0,
			duration: 100,
			onComplete: () => {
				foodObj?.destroy()
				t.remove()
			},
		})
	}
	async _onAddFood(foodItem: FoodItem) {
		const f = new Food({
			scene: this,
			foodState: foodItem,
		})
		this.foodGroup.add(f)
		this.foodObjects.set(foodItem.id, f)
		return 0
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
			;(window as any).updateScore(
				this.player.playerState.tokens || 0,
				this.player.playerState.kills || 0
			)
		}
	}

	_processhandler(head: any, food: any) {
		return true
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

	createBg() {
		const group = this.add.group()
		const gridSizeX = Math.ceil(GameMeta.boundX / this.tileW) + 2
		const gridSizeY = Math.ceil(GameMeta.boundY / this.tileH)
		for (let i = 0; i <= gridSizeX; i++) {
			for (let j = 0; j <= gridSizeY; j++) {
				const c = this.add
					.image(this.tileW * i, this.tileH * j, 'bg')
					.setDepth(1)
				group.add(c)
			}
		}
		this.miniMap.ignore(group)
	}
}
