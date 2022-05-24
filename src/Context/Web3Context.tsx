import { createContext, useContext, useState } from 'react'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
const providerOptions = {
	/* See Provider Options Section */
	walletconnect: {
		package: WalletConnectProvider, // required
		options: {
			infuraId: '3a6c24b4ff074a3cb9ae9a74f3473db2', // required
		},
	},
	binancechainwallet: {
		package: true,
	},

	coinbasewallet: {
		package: CoinbaseWalletSDK, // Required
		options: {
			appName: 'My Awesome App', // Required
			infuraId: '3a6c24b4ff074a3cb9ae9a74f3473db2', // Required
			rpc: '', // Optional if `infuraId` is provided; otherwise it's required
			chainId: 1, // Optional. It defaults to 1 if not provided
		},
	},
}

const web3Modal = new Web3Modal({
	network: 'mainnet', // optional
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
}
export const Web3Context = createContext<Web3ContextType>({
	account: null,
	openModal: () => {},
})

export const Web3Provider: React.FC<any> = (props) => {
	const [account, setAccount] = useState<string | null>(null)

	const openModal = async () => {
		const provider = await web3Modal.connect()
		const web3 = new Web3(provider)
		const [account] = await web3.eth.getAccounts()
		setAccount(account)
		console.log('Account Address', account)
	}

	return (
		<Web3Context.Provider value={{ account, openModal }}>
			{props.children}
		</Web3Context.Provider>
	)
}

export default function useWeb3Ctx(): Web3ContextType {
	return useContext(Web3Context) as Web3ContextType
}
