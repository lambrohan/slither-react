import { ArraySchema, Schema, type } from '@colyseus/schema'
import { SnakeSkin } from '../../Utils'
import { FoodItem } from './FoodItem'
import { SnakeSectionState } from './SnakeSection'

export class PlayerState extends Schema {
	@type('string')
	skin: string = ''

	@type('number')
	rank: number = 0

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

	@type('boolean')
	isSpeeding: boolean = false

	@type('number')
	startAt: number = 0

	@type('number')
	endAt: number = 0

	@type('int8')
	kills: number = 0

	@type('number')
	tokens: number = 0

	@type('string')
	nickname: string = ''

	@type('number')
	scale = 1

	@type('boolean')
	cooldown = false

	@type('int16')
	spacer: number = 1
}
