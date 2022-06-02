// @ts-nocheck

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/Button/Button'
import { Modal } from '../Components/Modal/Modal'
import useWeb3Ctx from '../Context/Web3Context'
import { EnterGame } from '../Components/ModalContent/EnterGame'
import { Congratulation } from '../Components/ModalContent/Congratulation'
import { GameOver } from '../Components/ModalContent/GameOver'
import { PrivacyPolicy } from '../Components/ModalContent/PrivacyPolicy'
import { Dashboard } from '../Components/ModalContent/Dashboard'
import { Select } from '../Components/Select/Select'

interface HomeProps {}

const Switch = (props: any) => {
	const { test, children } = props
	// filter out only children with a matching prop
	return children.find((child: any) => {
		return child.props.value === test
	})
}

export const Home: React.FC<HomeProps> = ({}) => {
	const { account, openModal } = useWeb3Ctx()
	const [modal, setModal] = useState(false)
	const [TempOptions, setTempOptions] = useState()

	useEffect(() => {
		setModal(true)
	}, [TempOptions])
	return (
		<main id="home-page" className="relative flex flex-col items-center py-16">
			<img src="/slither.webp" className="md:w-[30rem] w-2/3" alt="" />
			{account ? (
				<Link to={'/game'}>
					<Button className="md:mt-6 mt-8">
						<span className="text-xl px-[3.375rem]">Play Now</span>
					</Button>
				</Link>
			) : (
				<Button className="md:mt-6 mt-8" onClick={openModal} type="transparent">
					<span className="px-[3.375rem] text-lg">Connect Now</span>
				</Button>
			)}

			<Modal
				transparent={false}
				visible={modal}
				dismiss={() => setModal(false)}
			>
				<Switch test={TempOptions}>
					<div value={'Dashboard'}>
						<Dashboard />
					</div>
					<div value={'Congratulation'}>
						<Congratulation />
					</div>
					<div value={'EnterGame'}>
						<EnterGame />
					</div>
					<div value={'GameOver'}>
						<GameOver />
					</div>
					<div value={'Privacy Policy'}>
						<PrivacyPolicy />
					</div>
				</Switch>
			</Modal>
			<div className="absolute right-[20px] top-[50px]">
				<Select
					options={[
						'Dashboard',
						'Congratulation',
						'EnterGame',
						'GameOver',
						'Privacy Policy',
					]}
					label="TEMP"
					className="md:mr-8 mr-2 text-sm"
					handleSelect={(val: any) => {
						setTempOptions(val)
					}}
					selection={TempOptions}
				/>
			</div>
		</main>
	)
}
