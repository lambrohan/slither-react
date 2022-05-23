import React, { useState } from 'react'
import { useWeb3 } from '../../Hooks/useWeb3'
import { GameQualityOptions } from '../../Utils'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'
import Web3Modal from 'web3modal'
interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
	const [quality, setQuality] = useState(GameQualityOptions[0])
	const { toggleModal } = useWeb3()
	return (
		<header
			id="header"
			className="w-full bg-primary py-3 flex items-center justify-between md:pl-[9.875rem] md:pr-[8.563rem] px-4"
		>
			<img src="/doge.png" className="w-6 " />
			<div className="flex items-center">
				<Select
					options={GameQualityOptions}
					label="GRAPHICS"
					className="md:mr-8 mr-2"
					handleSelect={(val) => {
						setQuality(val)
					}}
					selection={quality}
				/>
				<Button className="ml-4" onClick={toggleModal}>
					Connect Wallet
				</Button>
			</div>
		</header>
	)
}
