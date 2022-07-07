import axios from 'axios'

export interface Wallet {
	id: string
	amount: number
	amountInUSD?: number
}
export const WalletRepo = {
	getWallet: async (): Promise<Wallet> => {
		const { data } = await axios.get('/wallet/me')
		return data
	},
}
