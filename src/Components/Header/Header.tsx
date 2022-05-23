import React from 'react'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
	return (
		<header
			id="header"
			className="w-full bg-primary py-3 flex items-center justify-between md:pl-[9.875rem] md:pr-[8.563rem] px-4"
		>
			<img src="/doge.png" className="w-6 " />
			<div className="">
				{/* <Select options={['Hi ', 'this', 'is']} label="GRAPHICS" /> */}
				<Button>Connect Wallet </Button>
			</div>
		</header>
	)
}
