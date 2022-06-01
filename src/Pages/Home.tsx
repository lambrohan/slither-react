import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../Components/Button/Button'
import { Modal } from '../Components/Modal/Modal'
import useWeb3Ctx from '../Context/Web3Context'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
	const { account, openModal } = useWeb3Ctx()
	const [modal, setModal] = useState(true)
	return (
		<main id="home-page" className="flex flex-col items-center py-16">
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

			<Modal visible={modal} dismiss={() => setModal(false)}>
				Hi this is modal
			</Modal>
		</main>
	)
}
