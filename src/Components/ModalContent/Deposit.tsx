import React, { useState } from 'react'
import { Button } from '../Button/Button'
import { Select } from '../Select/Select'

interface DepositProps {
	handlePayNow: Function
	loading: boolean
	hideCurrency?: boolean
}

export const Deposit: React.FC<DepositProps> = ({
	handlePayNow,
	loading = false,
	hideCurrency,
}) => {
	const [selectedCurrency, setSelectedCurrency] = useState(
		hideCurrency ? 'BABYDOGE' : ''
	)
	const [amount, setAmount] = useState(0)
	return (
		<div className="flex flex-col items-center">
			{!hideCurrency ? (
				<Select
					options={['BNB', 'USDT', 'BABYDOGE']}
					handleSelect={(v) => {
						setSelectedCurrency(v)
					}}
					selection={selectedCurrency}
					label="Select Currency"
					className="mb-4"
				/>
			) : (
				<div className="mt-8"></div>
			)}
			<input
				type="text"
				className="rounded-full p-2 text-center bg-transparent border border-white text-white font-semibold mb-6"
				placeholder="enter amount"
				onChange={(e) => {
					setAmount(parseFloat(e.target.value))
				}}
			/>
			<Button
				className="w-full"
				disabled={!selectedCurrency || !amount || amount <= 0}
				loading={loading}
				onClick={() => {
					handlePayNow(selectedCurrency, amount)
				}}
			>
				<span className="">Submit</span>
			</Button>
		</div>
	)
}
