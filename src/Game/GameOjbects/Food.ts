import { DataChange } from '@colyseus/schema'
import Phaser from 'phaser'
import { SPRITE_LABELS } from '../../Utils'
import { FoodItem, FoodItemOptions } from '../Models'

export interface FoodOptions {
	world: Phaser.Scene
	foodState: FoodItem
}

export class Food extends Phaser.GameObjects.Sprite {
	foodState: FoodItem | null = null
	constructor({ world, foodState }: FoodOptions) {
		super(world, foodState.x, foodState.y, 'slither', 'food/coin.png')
		this.foodState = foodState
		this.init()
	}

	private init() {
		if (!this.foodState) return
		this.setOrigin(0.5, 0.5)
		// this.setSensor(true)
		this.setDepth(0)
		this.scene.add.existing(this)
		// this.world.scene.add.existing(this)
	}

	getSize(): number {
		return this.foodState?.size || 0
	}
}
