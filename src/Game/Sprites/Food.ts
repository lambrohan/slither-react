import Phaser from 'phaser'

export interface FoodOptions {
	world: Phaser.Physics.Matter.World
	x: number
	y: number
	asset?: string
	size: number
	id: string | number
}

export class Food extends Phaser.Physics.Matter.Sprite {
	x: number = 0
	y: number = 0
	asset: string = 'slither'
	size: number = 0
	id: string | number = 0
	constructor({ world, x, y, asset = 'slither', size, id }: FoodOptions) {
		super(world, x, y, asset, 'food/coin.png')
		this.id = id
		this.size = size
		this.world = world
		this.x = x
		this.y = y
		this.asset = asset
		this.init()
	}

	init() {
		this.world.scene.add.existing(this)
		this.setOrigin(0.5, 0.5)
		this.setSensor(true)
	}
}
