import { MapSchema, Schema, type } from '@colyseus/schema'
import { FoodItem } from './FoodItem'
import { PlayerState } from './PlayerState'

export class GameState extends Schema {
	@type({ map: FoodItem })
	foodItems: MapSchema<FoodItem> = new MapSchema<FoodItem>()

	@type({ map: PlayerState })
	players: MapSchema<PlayerState> = new MapSchema<PlayerState>()
}
