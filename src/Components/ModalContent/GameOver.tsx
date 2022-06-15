import React from 'react'
import BabyDoge from '../../assets/images/babyAlt.webp'
// import BabyDogeOver from '../../assets/images/babyGameOver.svg'
import Coin from '../../assets/images/coin.webp'
import Firework1 from '../../assets/images/firework-1.svg'
import Firework2 from '../../assets/images/firework-2.svg'

import './ModalContent.scss'
import LoaderGameOver from '../../assets/images/loaderGameOver.svg'

import { useNavigate } from 'react-router-dom'

export interface GameOverProps {
	snakeLength: string
	survivalTime: string
	kills: string
	tokens: string
	playerId: string
	rank: string
}

export const GameOver: React.FC<GameOverProps> = ({
	snakeLength,
	survivalTime,
	kills,
	tokens,
	playerId,
	rank,
}) => {
	const navigate = useNavigate()
	return (
		<>
			<div className="BigBox2 blur-background  flex items-center justify-center flex-col">
				<div className="PFBothBox  grid grid-cols-1 lg:grid-cols-2 gap-2">
					<div className="LeftBox">
						<div className="WhiteHead">
							<h1 className="WhiteHeadContent">OVERVIEW</h1>
						</div>
						<br />
						<h2 className="CongratsTxt">Congratulations!</h2>
						<br />
						<div className="Coin">
							<img src={Coin} alt="" className="coin" />
							<h1 className="noofcoins Txt567 font-bold text-3xl text-white">
								{snakeLength}
							</h1>
						</div>
						<div className="flex justify-center items-center h-[148px] relative">
							<img src={BabyDoge} alt="" className="absolute" />
							<img
								src={Firework1}
								alt=""
								className="absolute z-[-1] left-[32px]"
							/>
							<img
								src={Firework2}
								alt=""
								className="absolute h-[57px] right-[62px] top-[-15px]"
							/>
						</div>
						<h2 id="NameTxt">{playerId}</h2>
						<img
							className="w-3/4 mx-auto mb-2"
							src={LoaderGameOver}
							alt="LoaderGameOver"
						/>
					</div>
					<div className="RightBox">
						<div className="WhiteHead">
							<h1 className="WhiteHeadContent">STATS</h1>
						</div>
						<br />
						<p className="whiteColor">Survival Time</p>

						<h2 className="StatsTime">{survivalTime}</h2>
						<br />
						<br />
						<p className="whiteColor">Players Killed</p>

						<h2 className="StatsTime">{kills}</h2>
						<br />
						<br />
						<p className="whiteColor">Tokens Eaten</p>

						<h2 className="StatsTime">{tokens}</h2>
					</div>
				</div>
				<br />
				{/* Buttons */}
				<div className="Buttons ">
					<button className="TransferTokenBtn">Transfer Tokens</button>
					<button
						className="PlayAgainBtn"
						onClick={() => {
							navigate('/game')
						}}
					>
						Play again
					</button>
					<button className="ExitBtn">Exit</button>
				</div>
			</div>
		</>
	)
}
