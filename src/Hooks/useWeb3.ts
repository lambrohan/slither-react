import { useState } from 'react'
import Web3 from 'web3'
import WalletConnectProvider from '@walletconnect/web3-provider'
import Web3Modal from 'web3modal'
import CoinbaseWalletSDK from '@coinbase/wallet-sdk'

export function useWeb3() {
	const [modalState, setModalState] = useState(false)

	const toggleModal = async () => {
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
			cacheProvider: true, // optional
			providerOptions, // required
			theme: {
				background: '#7c019a',
				main: '#fff',
				secondary: '#cfcfcf',
				border: 'rgba(195, 195, 195, 0.14)',
				hover: '#4a025c',
			},
		})

		const provider = await web3Modal.connect()
		const web3 = new Web3(provider)
		const account = await web3.eth.getAccounts()
		console.log('Account Address', account)

		setModalState(!modalState)
	}

	return {
		modalState,
		toggleModal,
	}
}
