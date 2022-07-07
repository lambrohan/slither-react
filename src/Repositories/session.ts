import axios from 'axios'

export interface GameSessionResponse {
	id: String
	started_at: Date
	finished_at: Date
	tokens_earned: number
	tokens_staked: number
	kills: number
	won: boolean
	nickname: string
	snake_length: number
	rank: number
	user_id: string
}

export const SessionRepo = {
	getById: async (id: string): Promise<GameSessionResponse> => {
		const { data } = await axios.get(`/play-session/${id}`)
		return data
	},
}
