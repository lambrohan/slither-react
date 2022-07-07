import axios from 'axios'

export interface TxnVerification {
	status?: 'success' | 'failed'
	id: string
	type: 'DEPOSIT' | 'EARNING' | 'STAKE' | 'WITHDRAW'
	amount: number
	session_id?: string
}
export const TxnRepo = {
	verifyDeposit: async (id: string): Promise<TxnVerification> => {
		const { data } = await axios.get(`/txn/deposit/${id}`)
		return data
	},
}
