import Phaser from 'phaser'
import { CONSTANTS, FoodAssetType, SPRITE_LABELS } from '../../Utils'
import { FoodItem, FoodItemOptions } from '../Models'

export interface FoodOptions {
	world: Phaser.Scene
	foodState: FoodItem
}

export class Food extends Phaser.GameObjects.Sprite {
	foodState: FoodItem | null = null
	constructor({ world, foodState }: FoodOptions) {
		super(world, foodState.x, foodState.y, 'food', getFoodAsset(foodState.type))
		this.foodState = foodState
		this.init()
	}

	private init() {
		if (!this.foodState) return
		this.setOrigin(0.5, 0.5)
		this.setDepth(1)
		this.scene.add.existing(this)
		this.setScale(0)
		this.scene.tweens.add({
			targets: this,
			scale: 1,
			duration: 300,
		})
	}
}

export function getFoodAsset(type: FoodAssetType) {
	switch (type) {
		case FoodAssetType.BLUE:
			return 'food_blue.png'
		case FoodAssetType.COIN:
			return 'food_coin.png'
		case FoodAssetType.RED:
			return 'food_red.png'
		case FoodAssetType.ORANGE:
			return 'food_orange.png'
		default:
			return ''
	}
}
