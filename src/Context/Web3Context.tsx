import { createContext, useContext, useState } from 'react'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import ABI from '../abi/babydoge.json'
const providerOptions = {
	/* See Provider Options Section */
	walletconnect: {
		package: WalletConnectProvider, // required
		options: {
			rpc: {
				56: 'https://speedy-nodes-nyc.moralis.io/362fc40c1ab324c15e79d4da/bsc/mainnet',
			},
		},
	},
	binancechainwallet: {
		package: true,
	},

	coinbasewallet: {
		package: CoinbaseWalletSDK, // Required
		options: {
			appName: 'Baby Doge Coin', // Required
			rpc: 'https://speedy-nodes-nyc.moralis.io/362fc40c1ab324c15e79d4da/bsc/mainnet', // Optional if `infuraId` is provided; otherwise it's required
			chainId: 56, // Optional. It defaults to 1 if not provided
		},
	},
}

const web3Modal = new Web3Modal({
	providerOptions, // required
	theme: {
		background: '#fff',
		main: '#002636',
		secondary: 'rgb(136, 136, 136)',
		border: 'rgba(195, 195, 195, 0.14)',
		hover: '#f5f5f5',
	},
})
export type Web3ContextType = {
	openModal: () => void
	account: string | null
	balance: string | number | undefined
}
export const Web3Context = createContext<Web3ContextType | null>(null)

export const Web3Provider: React.FC<any> = (props) => {
	const [account, setAccount] = useState<string | null>(null)
	const [balance, setBalance] = useState<string | number | undefined>(undefined)

	const openModal = async () => {
		const provider = await web3Modal.connect()

		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x38' }], // chainId must be in hexadecimal numbers
			})
		} catch (err: any) {
			if (err.code === 4902)
				window.ethereum.request({
					method: 'wallet_addEthereumChain',
					params: [
						{
							chainId: '0x38',
							chainName: 'BSC mainnet',
							nativeCurrency: {
								name: 'Binance Coin',
								symbol: 'BNB',
								decimals: 18,
							},
							rpcUrls: ['https://bsc-dataseed.binance.org/'],
							blockExplorerUrls: ['https://bscscan.com/'],
						},
					],
				})
		}

		const web3 = new Web3(provider)
		const [account] = await web3.eth.getAccounts()
		const balance = await getBalance(provider)
		setBalance(balance)
		setAccount(account)
		console.log('Account Address', account)
	}

	return (
		<Web3Context.Provider value={{ account, openModal, balance }}>
			{props.children}
		</Web3Context.Provider>
	)
}

export default function useWeb3Ctx(): Web3ContextType {
	return useContext(Web3Context) as Web3ContextType
}

export const getBalance = (provider: any): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const web3 = new Web3(provider)
			const [account] = await web3.eth.getAccounts()
			const contract = new web3.eth.Contract(
				ABI as any,
				'0xc748673057861a797275CD8A068AbB95A902e8de'
			)
			const balance = (await contract.methods
				.balanceOf(account)
				.call()) as string

			resolve(balance)
		} catch (error) {
			reject(error)
		}
	})
}
