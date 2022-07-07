import { createContext, useContext, useState } from 'react'
import Web3 from 'web3'
import * as Web3Token from 'web3-token'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'
import babyDogeABI from '../abi/babydoge.json'
import despositABI from '../abi/deposit.json'
import { StorageService } from '../Services'
import { Web3Config } from '../Utils/web3'
import { User, UserRepo } from '../Repositories'
import toast from 'react-hot-toast'
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
	balance: number
	web3Instance: Web3
	babyDogeContract: any
	usdtContract: any
	depositContract: any
	user: User | null
	refreshBalance: Function
	web3Provider: any
}
export const Web3Context = createContext<Web3ContextType | null>(null)

export const Web3Provider: React.FC<any> = (props) => {
	const [account, setAccount] = useState<string | null>(null)
	const [balance, setBalance] = useState<number>(0)
	const [web3Instance, setWeb3Instance] = useState<any>(null)
	const [babyDogeContract, setBabyDogeContract] = useState<any>(null)
	const [usdtContract, setUsdtContract] = useState<any>(null)
	const [depositContract, setDepositContract] = useState<any>(null)
	const [user, setUser] = useState<User | null>(null)
	const [web3Provider, setProvider] = useState<any>(undefined)

	const openModal = async () => {
		const provider = await web3Modal.connect()
		setProvider(provider)

		const web3 = new Web3(provider)
		const chainId = await web3.eth.getChainId()
		if (chainId !== 97) {
			toast('You are not on correct network')
			try {
				await window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
				})
			} catch (err: any) {
				if (err.code === 4902)
					window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [
							{
								chainId: '0x61',
								chainName: 'BSC mainnet',
								nativeCurrency: {
									name: 'Binance Coin',
									symbol: 'BNB',
									decimals: 18,
								},
								rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
								blockExplorerUrls: ['https://bscscan.com/'],
							},
						],
					})
			}
		}

		setWeb3Instance(web3)
		const [account] = await web3.eth.getAccounts()
		toast('account=' + account)
		const token = await Web3Token.sign(
			(msg) => web3.eth.personal.sign(msg, account, ''),
			'1d'
		)
		toast('token=' + token)
		StorageService.setToken(token)
		const babyDogeContract = new web3.eth.Contract(
			babyDogeABI as any,
			Web3Config.ADDRESS.babydoge
		)

		const usdtContract = new web3.eth.Contract(
			babyDogeABI as any,
			Web3Config.ADDRESS.usdt
		)
		const depositContract = new web3.eth.Contract(
			despositABI as any,
			Web3Config.ADDRESS.deposit
		)

		setUsdtContract(usdtContract)
		setDepositContract(depositContract)
		setBabyDogeContract(babyDogeContract)
		const balance = await getBalance(provider, babyDogeContract)
		toast('balance ' + balance)
		setBalance(Number((balance as any) / Math.pow(10, 18)))
		setAccount(account)
		console.log('Account Address', account)

		try {
			const u = await UserRepo.findOrCreate()
			setUser(u)
		} catch (error) {
			toast.error('unable to get user')
		}
	}

	return (
		<Web3Context.Provider
			value={{
				web3Provider,
				user,
				account,
				openModal,
				balance,
				web3Instance,
				babyDogeContract,
				depositContract,
				usdtContract,
				refreshBalance: async (p: any) => {
					const balance = await getBalance(p, babyDogeContract)
					setBalance(Number((balance as any) / Math.pow(10, 18)))
				},
			}}
		>
			{props.children}
		</Web3Context.Provider>
	)
}

export default function useWeb3Ctx(): Web3ContextType {
	return useContext(Web3Context) as Web3ContextType
}

export const getBalance = (provider: any, contract: any): Promise<string> => {
	return new Promise(async (resolve, reject) => {
		try {
			const web3 = new Web3(provider)
			const [account] = await web3.eth.getAccounts()

			const balance = (await contract.methods
				.balanceOf(account)
				.call()) as string

			resolve(balance)
		} catch (error) {
			reject(error)
		}
	})
}
