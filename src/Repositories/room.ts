import axios from 'axios'

export interface RoomResponse {
	id: string
	min_usd_to_join: number
	max_usd_to_join: number
	created_at: Date
	name: string
	variable_stake: boolean
}

export const RoomRepo = {
	getAll: async (): Promise<RoomResponse[]> => {
		const { data } = await axios.get('/room')
		return data
	},
}
