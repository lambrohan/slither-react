import React, { useEffect, useState } from 'react'
import { GameQualityOptions } from '../../Utils'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'
import useWeb3Ctx from '../../Context/Web3Context'
import { useNavigate } from 'react-router-dom'
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
	const [quality, setQuality] = useState(GameQualityOptions[0])
	const { account, openModal, balance } = useWeb3Ctx()
	const navigate = useNavigate()

	return (
		<header
			id="header"
			className="w-full bg-primary py-2 flex items-center justify-between md:pl-[9.875rem] md:pr-[8.563rem] px-4"
		>
			<div className="flex items-center">
				<img src="/doge.png" className="w-6 mr-4" />
				{balance == undefined ? (
					''
				) : (
					<h4 className="text-white font-semibold tracking-wider">
						<span className="text-xs md:text-md">
							{Number(balance).toFixed(4)}{' '}
						</span>
						<span className="tracking-normal ml-2 font-normal uppercase text-xs md:text-sm">
							Baby Doge Coin
						</span>
					</h4>
				)}
			</div>

			<div className="flex items-center">
				{account ? (
					<Button
						onClick={() => {
							navigate('/dashboard')
						}}
					>
						<span className="px-4">Dashboard</span>
					</Button>
				) : (
					<Button
						className="ml-4"
						disabled={account !== null}
						onClick={openModal}
					>
						Connect Wallet
					</Button>
				)}
			</div>
		</header>
	)
}
