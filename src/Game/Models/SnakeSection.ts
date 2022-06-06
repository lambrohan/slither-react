import { Schema, type } from '@colyseus/schema'

export class SnakeSectionState extends Schema {
	constructor(x: number, y: number) {
		super()
		this.x = x
		this.y = y
	}
	@type('number')
	x: number

	@type('number')
	y: number
}
