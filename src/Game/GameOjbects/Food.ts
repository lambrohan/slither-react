import { DataChange } from '@colyseus/schema'
import Phaser from 'phaser'
import { SPRITE_LABELS } from '../../Utils'
import { FoodItem, FoodItemOptions } from '../Models'

export interface FoodOptions {
	world: Phaser.Physics.Matter.World
	foodState: FoodItem
}

export class Food extends Phaser.Physics.Matter.Sprite {
	foodState: FoodItem | null = null
	constructor({ world, foodState }: FoodOptions) {
		super(world, foodState.x, foodState.y, 'slither', 'food/coin.png', {
			label: SPRITE_LABELS.FOOD,
		})
		this.foodState = foodState
		this.init()
	}

	private init() {
		if (!this.foodState) return
		this.setOrigin(0.5, 0.5)
		this.setSensor(true)
		this.world.scene.add.existing(this)
	}

	getSize(): number {
		return this.foodState?.size || 0
	}
}
