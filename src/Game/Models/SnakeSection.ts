import { Schema, type } from '@colyseus/schema'

export class SnakeSectionState extends Schema {
	constructor(x: number, y: number, index: number) {
		super()
		this.x = x
		this.y = y
		this.index = index
	}

	@type('int8')
	index: number

	@type('number')
	x: number

	@type('number')
	y: number
}
