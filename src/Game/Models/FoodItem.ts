import { Schema, type } from '@colyseus/schema'
import { FoodAssetType } from '../../Utils'

export interface FoodItemOptions {
	x: number
	y: number
	size: number
	id: string
	eaten?: boolean
}
export class FoodItem extends Schema {
	@type('string')
	id: string

	@type('int16')
	x: number

	@type('int16')
	y: number

	@type('number')
	type: FoodAssetType = 0

	@type('number')
	scale = 1

	constructor({ id, x, y }: FoodItemOptions) {
		super()
		this.id = id
		this.x = x
		this.y = y
	}
}
