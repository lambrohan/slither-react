import { Schema, type } from '@colyseus/schema'

export class MousePosition extends Schema {
	constructor(x = 0, y = 0) {
		super()
		this.x = x
		this.y = y
	}
	@type('float32')
	x: number = 0

	@type('float32')
	y: number = 0
}
