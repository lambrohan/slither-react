import axios from 'axios'
import { Wallet } from './index'
export interface User {
	id: string
	public_address: string
	wallet?: Wallet
}

export interface UserDashInfo {
	bestCareerHigh: number
	earnings: bigint
	losses: bigint
	recentRank: number
	totalWinMatches: number
	totalLossMatches: number
}

export const UserRepo = {
	findOrCreate: async (): Promise<User> => {
		const { data } = await axios.post('/user')
		return data
	},

	me: async (): Promise<User> => {
		const { data } = await axios.get('/user/me')
		return data
	},

	getDashInfo: async (): Promise<UserDashInfo> => {
		const { data } = await axios.get('/dashboard/me')
		return data
	},
}
