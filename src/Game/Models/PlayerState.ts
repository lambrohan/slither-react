import { ArraySchema, Schema, type } from '@colyseus/schema'
import { FoodItem } from './FoodItem'
import { SnakeSectionState } from './SnakeSection'

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

	@type('int8')
	snakeLength: number = 0

	@type([SnakeSectionState])
	sections: ArraySchema<SnakeSectionState> = new ArraySchema()
}
