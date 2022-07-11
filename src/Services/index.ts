import axios from 'axios'

export * from './storage'
export * from './api'

export async function usdPerBabyDoge() {
	const { data } = await axios.get(
		'https://api.coingecko.com/api/v3/simple/price?ids=baby-doge-coin&vs_currencies=usd'
	)
	const rate = data['baby-doge-coin']['usd']
	return rate
}
