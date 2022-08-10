import { FoodAssetType, GameMeta } from '../../Utils'
import Phaser from 'phaser'
import { FoodItem } from '../Models'
import { GamePad } from '../GameOjbects/Gamepad'
import { GameState } from '../Models/GameState'
import { Food, getFoodAsset } from '../GameOjbects/Food'
import { Room } from 'colyseus.js'
import * as Colyseus from 'colyseus.js'
import { PlayerState } from '../Models/PlayerState'
import { PlayerV2 } from '../GameOjbects/PlayerV2'
import _ from 'lodash'
import { StorageService } from '../../Services'
import toast from 'react-hot-toast'

export default class MainScene extends Phaser.Scene {
	tileW = 584
	tileH = 527
	gridSizeX: number = 0
	gridSizeY: number = 0
	player: PlayerV2 | null = null
	foodGroup!: Phaser.GameObjects.Group
	foodObjects: Map<String, Phaser.GameObjects.Sprite> = new Map()
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
	sectionGroup!: Phaser.GameObjects.Group

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('bg', '/bg.png')
		this.load.atlas('food', '/food.png', '/food.json')
		this.load.atlas('snake', '/snake.png', '/snake.json')
		this.load.image('eyes', '/eyes.png')
	}

	create() {
		this.sectionGroup = this.add.group([], {
			defaultKey: 'snake',
		})
		const miniMapScaleFactor = this.game.device.os.desktop ? 48 : 96
		const zoom = this.game.device.os.desktop ? 0.08 : 0.04
		this.miniMap = this.cameras
			.add(
				this.sys.canvas.width - GameMeta.boundX / miniMapScaleFactor,
				this.sys.canvas.height - GameMeta.boundY / miniMapScaleFactor,
				GameMeta.boundX / miniMapScaleFactor,
				GameMeta.boundY / miniMapScaleFactor
			)
			.setZoom(zoom)
			.setName('mini')
		this.miniMap
			.setBounds(0, 0, GameMeta.boundX, GameMeta.boundY)
			.setBackgroundColor(0x80000000)
		this.foodGroup = this.add.group()

		this.debugFPS = this.add.text(4, 10, '', { color: '#ff0000' })
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
			process.env.WS_ENDPOINT || 'wss://gs.topweb3developers.co/'
		)
		const roomName = localStorage.getItem('roomName')
		if (!roomName) {
			toast.error('Please select a room first')
			;(window as any).navigateTo('/')
			return
		}
		try {
			this.gameRoom = await client.joinOrCreate<GameState>(roomName, {
				nickname: localStorage.getItem('nickname'),
				accessToken: StorageService.getToken(),
				stakeAmtUsd: localStorage.getItem('stakeUSD'),
				skin: localStorage.getItem('color'),
			})
		} catch (error: any) {
			toast(error.message)
			this.game.destroy(true)
			;(window as any).navigateTo('/entergame')
		}

		this.gameRoom.state.foodItems.onAdd = async (f) => await this._onAddFood(f)
		this.gameRoom.state.foodItems.onRemove = (f) => this._onRemoveFood(f)
		this.gameRoom.state.players.onAdd = (p) => this._onPlayerAdd(p)
		this.gameRoom.state.players.onRemove = (p) => this._onPlayerRemove(p)
		this.gameRoom.onMessage('gameover', async (sessionId: string) => {
			console.log('GAMEOVER')
			await this.game.destroy(true)
			clearInterval((window as any).leaderboardInterval)
			;(window as any).navigateTo(`/gameover?sessionId=${sessionId}`)
		})
	}

	updateLeaderboard() {
		if (!this.gameRoom) return
		if (!this.gameRoom.state) return
		const sortedPlayers: PlayerState[] = []
		this.gameRoom.state.players.forEach((p) => {
			sortedPlayers[p.rank - 1] = p
		})
		this.sortedPlayers = sortedPlayers
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
		console.log('player remove')

		this.playerObjects.get(playerState.sessionId)?.destroy()

		this.playerObjects.delete(playerState.sessionId)
	}

	_onRemoveFood(foodItem: FoodItem) {
		const foodObj = this.foodObjects.get(foodItem.id)
		if (!foodObj) return
		this.tweens.add({
			targets: foodObj,
			scale: 0,
			duration: 150,
			onComplete: () => {
				this.foodGroup.killAndHide(foodObj)
				this.tweens.killTweensOf(foodObj)
			},
		})
	}
	async _onAddFood(foodItem: FoodItem) {
		const frame = getFoodAsset(foodItem.type)
		const f: Phaser.GameObjects.Sprite = this.foodGroup.get(
			foodItem.x,
			foodItem.y,
			'food',
			
		)

		this.miniMap.ignore(f)
		f.setFrame(frame)
		f.setDepth(2)
		f.setScale(0)
		f.setAlpha(.5)
		f.setVisible(true)
		f.setActive(true)
		

		this.foodObjects.set(foodItem.id, f)
		


		this.tweens.add({

            targets:f,
			ease: 'Linear',
            alpha: 1,
			scale: {
				getStart: () => foodItem.type = FoodAssetType.COIN ? 1 : 0.5,
				getEnd: () =>  foodItem.type = FoodAssetType.COIN? 1 : 2,
			  },
			  x: { value: f.x+Phaser.Math.Between(-20, 20), duration: 3000},
			  y: { value: f.y+Phaser.Math.Between(-20, 20), duration: 3000},
			
            duration: Phaser.Math.Between(200, 1000),

            yoyo: true,
            repeat: -1,
            delay: 1000,
            hold: 500,
            onComplete: () => {
                this.tweens.killTweensOf(f)
            },
		
		 })
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
				this.player.playerState.kills || 0,
				this.gameRoom.state.players.size
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
