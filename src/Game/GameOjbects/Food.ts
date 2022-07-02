import Phaser from 'phaser'
import { CONSTANTS, FoodAssetType, SPRITE_LABELS } from '../../Utils'
import { FoodItem, FoodItemOptions } from '../Models'
import MainScene from '../Scenes/MainScene'

export interface FoodOptions {
	scene: MainScene
	foodState: FoodItem
}

export class Food extends Phaser.Physics.Matter.Sprite {
	mainScene!: MainScene
	foodState: FoodItem | null = null
	constructor({ scene, foodState }: FoodOptions) {
		super(
			scene.matter.world,
			foodState.x,
			foodState.y,
			'food',
			getFoodAsset(foodState.type),
			{
				isSensor: true,
				mass: 0,
				collisionFilter: {
					group: -1,
					category: 2,

					mask: 0,
				},
			}
		)
		this.foodState = foodState
		this.mainScene = scene

		this.init()
	}

	private init() {
		if (!this.foodState) return
		this.setOrigin(0.5, 0.5)
		this.setDepth(2)
		this.scene.add.existing(this)
		this.setScale(this.foodState.scale)
		this.mainScene.miniMap.ignore(this)
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
		case FoodAssetType.GREEN:
			return 'food_green.png'
		default:
			return ''
	}
}
