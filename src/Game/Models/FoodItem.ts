import { Schema, type } from '@colyseus/schema'

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
	size: number

	@type('boolean')
	eaten: boolean = false

	constructor({ id, x, y, size, eaten }: FoodItemOptions) {
		super()
		this.id = id
		this.x = x
		this.y = y
		this.size = size
		this.eaten = eaten || false
	}
}
