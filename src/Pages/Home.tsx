import React from 'react'
import { Button } from '../Components/Button/Button'
import useWeb3Ctx from '../Context/Web3Context'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
	const { account, openModal } = useWeb3Ctx()
	return (
		<main id="home-page" className="flex flex-col items-center py-20">
			<img src="/slither.webp" className="md:w-[30.938rem] w-2/3" alt="" />
			{account ? (
				<Button className="md:mt-6 mt-8">
					<span className="text-xl px-[3.375rem]">Play Now</span>
				</Button>
			) : (
				<Button className="md:mt-6 mt-8" onClick={openModal} type="transparent">
					<span className="text-xl px-[3.375rem]">Connect Now</span>
				</Button>
			)}
		</main>
	)
}
