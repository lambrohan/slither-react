import React, { useEffect, useState } from 'react'
import { GameQualityOptions } from '../../Utils'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'
import useWeb3Ctx from '../../Context/Web3Context'
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
	const [quality, setQuality] = useState(GameQualityOptions[0])
	const { account, openModal, balance } = useWeb3Ctx()

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
					<h4 className="text-white text-xl font-semibold tracking-wider">
						{(Number(balance) / Math.pow(10, 9)).toFixed(4)}{' '}
						<span className="tracking-normal ml-2 font-normal uppercase text-sm">
							Baby Doge Coin
						</span>
					</h4>
				)}
			</div>

			<div className="flex items-center">
				<Select
					options={GameQualityOptions}
					label="GRAPHICS"
					className="md:mr-8 mr-2 text-sm"
					handleSelect={(val) => {
						setQuality(val)
					}}
					selection={quality}
				/>

				{account ? (
					<h4 className="text-xs md:max-w-[200px] max-w-[80px] text-ellipsis overflow-hidden text-white">
						{account}
					</h4>
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
