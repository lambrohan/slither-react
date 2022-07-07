import React, { useEffect, useState } from 'react'
import './ModalContent.scss'
import BorderLine from '../../assets/images/borderLine.png'
import ProfileImage from '../../assets/images/profileImage.svg'
import { StarSvg } from '../../assets/Star'
import { PieChartDraw } from '../PieChart/PieChart'
import { Button } from '../Button/Button'
import { useNavigate } from 'react-router-dom'
import useWeb3Ctx from '../../Context/Web3Context'
import { UserDashInfo, UserRepo, Wallet, WalletRepo } from '../../Repositories'
import { usdPerBabyDoge } from '../../Services'
import { Modal } from '../Modal/Modal'
import { Deposit } from './Deposit'
import { CURRENCY, DepositResponse } from '../../@types'
import { TxnRepo } from '../../Repositories/txn'
import toast from 'react-hot-toast'
import { Web3Config } from '../../Utils/web3'

interface DashboardProps {}

export const Dashboard: React.FC<DashboardProps> = ({}) => {
	const [dashboardData, setDashboardData] = useState<UserDashInfo>()
	const [usdRate, setUsdRate] = useState(0)
	const {
		balance,
		account,
		depositContract,
		babyDogeContract,
		refreshBalance,
		web3Provider,
	} = useWeb3Ctx()
	const [wallet, setWallet] = useState<Wallet | null>(null)
	const [showDepositModal, setDepositModalState] = useState(false)
	const [depositLoading, setDepositLoading] = useState(false)
	const navigate = useNavigate()
	const [withdrawModal, setWithdrawModal] = useState(false)

	useEffect(() => {
		refreshWallet().catch((e) => {
			console.log('error fetching wallet', e)
		})
	}, [account])

	const refreshWallet = async () => {
		if (!account) return
		await refreshBalance(web3Provider)
		const wallet = await WalletRepo.getWallet()
		const dash = await UserRepo.getDashInfo()
		if (!wallet) return
		const rate = await usdPerBabyDoge()
		setUsdRate(rate)
		setWallet(wallet)
		setDashboardData(dash)
	}

	const initDeposit = async (currency: CURRENCY, amount: number) => {
		setDepositLoading(true)
		let response: DepositResponse
		const multiplyer = Math.pow(10, 18)

		try {
			switch (currency) {
				case 'BNB':
					response = await initBNBDeposit(amount * multiplyer)
					break
				case 'BABYDOGE':
					response = await initBabyDogeDeposit(amount * multiplyer)
					break
				case 'USDT':
					response = await initUSDTDeposit(amount * multiplyer)
					break
			}

			console.log(response)

			if (response) {
				await TxnRepo.verifyDeposit(
					response.events.TokensDeposited.returnValues.id
				)
			}
			await refreshWallet()
			setDepositModalState(false)
			setDepositLoading(false)
		} catch (error: any) {
			setDepositLoading(false)
			if (error.response) {
				toast.error(error.response.data.message)
			} else {
				toast.error(error.message)
			}
		}
	}

	const initBNBDeposit = async (amount: number) => {
		console.log('initbnbdeposit')

		return await depositContract.methods
			.depositTokensTest('0x0000000000000000000000000000000000000000', amount)
			.send({
				from: account,
				value: amount,
			})
	}
	const initBabyDogeDeposit = async (amount: number) => {
		console.log('initbabydogedeposit')
		await babyDogeContract.methods
			.approve(Web3Config.ADDRESS.deposit, amount + '')
			.send({
				from: account,
			})

		return await depositContract.methods
			.depositTokensTest(Web3Config.ADDRESS.babydoge, amount + '')
			.send({
				from: account,
			})
	}

	const initUSDTDeposit = async (amount: number) => {
		console.log('initusdtdeposit')

		await babyDogeContract.methods
			.approve(Web3Config.ADDRESS.deposit, amount + '')
			.send({
				from: account,
			})

		return await depositContract.methods
			.depositTokensTest(Web3Config.ADDRESS.usdt, amount + '')
			.send({
				from: account,
			})
	}

	const initWithdraw = async (c: any, amt: number) => {
		try {
			setDepositLoading(true)
			const res = await depositContract.methods
				.withdrawTokensTest(amt * Math.pow(10, 18) + '')
				.send({
					from: account,
				})

			setDepositLoading(false)
			setWithdrawModal(false)
		} catch (error: any) {
			toast.error(error.message)
			setDepositLoading(false)
		}
	}

	return (
		<>
			<div className="">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
					<div className="blur-background lg:w-[412px] rounded-3xl py-3 px-3">
						<h2 className="font-bold text-lg text-white uppercase">
							Token Balance
						</h2>
						<img src={BorderLine} alt="BorderLine" />
						<div className="flex items-center justify-center flex-col py-5">
							<p className="text-4xl mb-[20px] font-bold text-[#FFCE01]">
								${Number(balance * usdRate).toFixed(4)}
							</p>
							<div>
								<a href="https://pancakeswap.finance/swap">
									<button className="text-white text-xs font-medium uppercase py-2.5 px-5 rounded-full bg-[#46125D]">
										+ Add Funds
									</button>
								</a>
							</div>
						</div>
					</div>
					<div className="blur-background lg:w-[412px] rounded-3xl py-3 px-3">
						<h2 className="font-bold text-lg text-white uppercase">
							Game Balance
						</h2>
						<img src={BorderLine} alt="BorderLine" />
						<div className="flex items-center flex-col justify-center py-5">
							<p className="text-4xl mb-[20px] font-bold text-[#FFCE01]">
								${wallet ? (wallet.amount * usdRate).toFixed(4) : 0}
							</p>
							<div>
								<button
									className="text-white text-xs font-medium uppercase py-2.5 px-5 rounded-full bg-[#46125D]"
									onClick={() => {
										setDepositModalState(true)
									}}
								>
									+ Add Funds
								</button>
								<button
									className="border--white  text-white text-xs font-medium uppercase py-2 px-5 rounded-full"
									onClick={() => {
										setWithdrawModal(true)
									}}
								>
									Remove Funds
								</button>
							</div>
						</div>
					</div>
					<div className="blur-background lg:col-span-2 rounded-3xl py-3 px-3">
						<h2 className="font-bold text-lg flex justify-between items-center text-white uppercase">
							Dashboard
						</h2>
						<img
							src={BorderLine}
							alt="BorderLine"
							className="w-full opacity-60"
						/>
						{/* No data */}
						{!dashboardData && (
							<div className="flex items-center justify-center py-5">
								<p className="text-2xl font-bold text-white">No Data Yet</p>
							</div>
						)}

						{/* if data */}
						{dashboardData && (
							<div className="flex flex-row overflow-y-auto lg:overflow-y-hidden">
								<div className="w-1/4 lg:w-1/2 dash-border-right">
									<div className="flex flex-col lg:flex-row items-center p-5">
										<img
											className="h-[42px] lg:h-[56px] mr-2"
											src={ProfileImage}
											alt="altImage"
										/>
										<div className="flex items-center max-w-[80%]">
											<p className="text-medium lg:text-lg font-bold text-white max-w-[90%] break-words">
												{account}
											</p>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4 text-white ml-2 cursor-pointer"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor"
												strokeWidth="2"
												onClick={() => {
													navigator.clipboard.writeText(account || '')
												}}
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
												/>
											</svg>
										</div>
									</div>
									<div className="h-[110px] lg:h-[180px] mr-2">
										<PieChartDraw
											win={dashboardData.totalWinMatches}
											lose={dashboardData.totalLossMatches}
										/>
									</div>
								</div>
								<div className="w-3/8 lg:w-1/4 dash-border-right p-4 lg:p-6 flex flex-col">
									<div className="flex flex-row items-center mb-3 lg:mb-10">
										<div className="mr-6">
											<p className="font-bold text-xs text-[#FFCE01]">Win</p>
											<span className="font-bold text-[21px] text-white">
												{dashboardData.totalWinMatches}
											</span>
										</div>
										<div>
											<p className="font-bold text-xs text-[#FFCE01]">Lose</p>
											<span className="font-bold text-[21px] text-white">
												{dashboardData.totalLossMatches}
											</span>
										</div>
										{/* <div>
											<p className="font-bold text-xs text-[#FFCE01]">
												Walkover
											</p>
											<span className="font-bold text-[21px] text-white">
												14
											</span>
										</div> */}
									</div>
									<div className="mb-2">
										<p className="font-bold text-xs text-[#FFCE01]">
											Best Career High
										</p>
										<span className="font-bold text-[21px] text-white">
											{dashboardData.bestCareerHigh}
										</span>
									</div>
									<div className="mb-2">
										<p className="font-bold text-xs text-[#FFCE01]">Earnings</p>
										<span className="font-bold text-[21px] text-white">
											$
											{Number(Number(dashboardData.earnings) * usdRate).toFixed(
												4
											)}
										</span>
									</div>
									<div className="mb-2">
										<p className="font-bold text-xs text-[#FFCE01]">Losses</p>
										<span className="font-bold text-[21px] text-white">
											$
											{Number(Number(dashboardData.losses) * usdRate).toFixed(
												4
											)}
										</span>
									</div>
								</div>
								<div className="w-3/8 lg:w-1/4">
									<div className="flex flex-col items-center justify-center p-4 min-h-full">
										<span className="uppercase text-white text-sm font-medium mb-4">
											Rank
										</span>
										<span className="uppercase text-white text-[60px] lg:text-[73px] font-bold leading-[50px]">
											{dashboardData.recentRank}
										</span>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
				<div className="w-full flex items-center justify-between blur-background rounded-2xl mt-2 p-4 mb-4">
					<Button
						type="transparent"
						className="px-12 mr-12"
						onClick={() => {
							navigate('/')
						}}
					>
						Home
					</Button>
					<Button
						className="px-12"
						onClick={() => {
							const nickname = localStorage.getItem('nickname') || ''
							navigate(`/entergame`)
						}}
					>
						Play Again
					</Button>
				</div>
				<Modal
					visible={showDepositModal}
					overlay={true}
					dismiss={() => {
						setDepositModalState(false)
						setDepositLoading(false)
					}}
					transparent={false}
				>
					<Deposit handlePayNow={initDeposit} loading={depositLoading} />
				</Modal>

				<Modal
					visible={withdrawModal}
					overlay={true}
					dismiss={() => {
						setWithdrawModal(false)
					}}
					transparent={false}
				>
					<Deposit
						handlePayNow={initWithdraw}
						loading={depositLoading}
						hideCurrency
					/>
				</Modal>
			</div>
		</>
	)
}
