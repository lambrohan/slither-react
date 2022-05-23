import React from 'react'
import { Button } from '../Components/Button/Button'
import { useWeb3 } from '../Hooks/useWeb3'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
	const { toggleModal } = useWeb3()
	return (
		<main id="home-page" className="flex flex-col items-center py-20">
			<img src="/slither.webp" className="md:w-[30.938rem] w-2/3" alt="" />
			<Button className="md:mt-6 mt-8" onClick={toggleModal}>
				<span className="text-xl px-[3.375rem]">Connect Now</span>
			</Button>
		</main>
	)
}
