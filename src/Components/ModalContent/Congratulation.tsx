import React from 'react'
import BabyDoge from '../../assets/images/babydoge.webp'
import BackgroundFilter from '../../assets/images/background-filter.svg'
import Coin from '../../assets/images/coin.webp'
import Increase from '../../assets/images/increase.svg'
import './ModalContent.scss'
interface CongratulationProps {
	tokens: number
	rank: number
	onNext: Function
}

export const Congratulation: React.FC<CongratulationProps> = ({
	tokens,
	rank,
	onNext,
}) => {
	return (
		<>
			<div className="w-full lg:w-3/4 xl:w-1/2  m-2.5 h-full px-6 md:px-10 lg:px-[200px] blur-background rounded-lg py-2 md:py-12">
				<h1 className="text-3xl text-center lg:text-5xl font-bold text-white">
					Congratulations!
				</h1>
				<div className="relative min-h-[400px] flex items-center justify-center">
					<p className="absolute top-[20px] text-[17px] text-white font-bold">
						No one can stop you!
					</p>
					<img className="absolute" src={BackgroundFilter} alt="babydoge" />
					<img className="absolute" src={BabyDoge} alt="babydoge-backdrop" />
				</div>
				<div className="flex flex-row justify-between">
					<div className="">
						<p className="text-xs font-bold text-white text-center ml-8">
							You Won
						</p>
						<div className="flex flex-row">
							<div className="flex items-center justify-center">
								<img className="mr-[9px]" src={Coin} alt="Coin" />
							</div>
							<div>
								<p className="text-[49px] font-bold text-white flex items-center justify-center">
									{tokens}
								</p>
							</div>
						</div>
					</div>
					<div className="flex flex-col">
						<p className="text-xs font-bold text-white text-center ">Rank</p>
						<div>
							<p className="text-[49px] font-bold text-white flex items-center justify-center">
								{rank}
								<sup className="text-xs">
									<img src={Increase} alt="increase" />
								</sup>
							</p>
						</div>
					</div>
				</div>
				<div className="h-[34px] relative ">
					<button
						className="next-btn absolute right-[-10px] lg:right-[-150px] text-white font-bold rounded-full border-white"
						onClick={() => {
							onNext()
						}}
					>
						Next
					</button>
				</div>
			</div>
		</>
	)
}
