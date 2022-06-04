import { Schema, type } from '@colyseus/schema'

export class PlayerState extends Schema {
	@type('string')
	publicAddress: string = ''

	@type('string')
	sessionId: string = ''

	// TODO -  change number types to precise ints later
	@type('number')
	x: number = ''

	@type('number')
	y: number

	@type('number')
	score: number = 0
}
