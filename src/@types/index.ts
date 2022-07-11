export enum CurrencyAddress {
	BNB = '0x0000000000000000000000000000000000000000',
	USDT = '0x288274bE90365785d40a035337bA68945A5499D9',
	BABY_DOGE = '0x24043F6738bD40772179fb334f5289261CC7e829',
}

export type CURRENCY = 'BNB' | 'BABYDOGE' | 'USDT'

export interface DepositResponse {
	status: boolean
	transactionHash: string
	events: {
		TokensDeposited: {
			returnValues: {
				id: string
				amount: string
				currency: CurrencyAddress
				user: string
			}
		}
	}
}
