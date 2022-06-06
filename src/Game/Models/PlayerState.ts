import { ArraySchema, Schema, type } from '@colyseus/schema'
import { FoodItem } from './FoodItem'

export class PlayerState extends Schema {
	@type('string')
	publicAddress: string = ''

	@type('string')
	sessionId: string = ''

	// TODO -  change number types to precise ints later
	@type('number')
	x: number = 0

	@type('number')
	y: number = 0

	@type('number')
	score: number = 0

	@type('float32')
	angle: number = 0

	@type('int16')
	snakeLength: number = 0

	@type(['number'])
	consumedFood: ArraySchema<number> = new ArraySchema()
}
