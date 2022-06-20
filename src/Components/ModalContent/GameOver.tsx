import React, { useEffect, useState } from 'react'
import BabyDoge from '../../assets/images/babyAlt.webp'
import SadBabyDoge from '../../assets/images/sad_babydoge.svg'
// import BabyDogeOver from '../../assets/images/babyGameOver.svg'
import Coin from '../../assets/images/coin.webp'
import Firework1 from '../../assets/images/firework-1.svg'
import Firework2 from '../../assets/images/firework-2.svg'

import './ModalContent.scss'
import LoaderGameOver from '../../assets/images/loaderGameOver.svg'

import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'

export interface GameOverProps {
	snakeLength: string
	survivalTime: string
	kills: string
	tokens: string
	playerId: string
	rank: string
	win: boolean
	nickname: string
}

export const GameOver: React.FC<GameOverProps> = ({
	snakeLength,
	survivalTime,
	kills,
	tokens,
	playerId,
	rank,
	win,
	nickname,
}) => {
	const navigate = useNavigate()
	const [progress, setProgress] = useState('0px')
	useEffect(() => {
		const [m, s] = survivalTime ? survivalTime.split(':') : '00:00'
		const percent = (Number(m) * 60 + Number(s)) / 6
		setProgress(`${percent > 100 ? 100 : percent}%`)
	}, [survivalTime])
	return (
		<>
			<div className="BigBox2 blur-background  flex items-center justify-center flex-col">
				<div className="PFBothBox  grid grid-cols-1 lg:grid-cols-2 gap-2">
					<div className="LeftBox ">
						<div className="WhiteHead">
							<h1 className="WhiteHeadContent">OVERVIEW</h1>
						</div>
						<br />
						<h2 className="CongratsTxt">
							{win ? 'Congratulations!' : 'Better luck next time.'}
						</h2>
						<br />
						<div className="Coin"></div>
						{win ? (
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
						) : (
							<div className="flex justify-center items-center h-[148px] relative">
								<img src={SadBabyDoge} alt="" className="absolute" />
							</div>
						)}

						<h2 id="NameTxt">{nickname || playerId}</h2>
						<div className="min-w-[324px]"></div>
						<div className=" px-4 mt-2 flex items-center">
							<div className="bg-primary w-14 h-14 rounded-full flex flex-col items-center p-2">
								<span className="text-white text-xs">Rank</span>
								<h4 className="text-yellowAccent font-semibold">{rank}</h4>
							</div>
							<div
								className="range grow border border-white h-4 rounded-full flex items-center overflow-hidden px-0.5"
								id="progressbar"
							>
								<div
									className="bg-yellowAccent h-2  w-12 rounded-full"
									style={{
										minWidth: progress,
										transition: '2s ease all',
										maxWidth: progress,
									}}
								></div>
							</div>
						</div>
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
					<button
						className="TransferTokenBtn"
						onClick={() => {
							navigate('/dashboard')
						}}
					>
						Dashboard
					</button>
					<button
						className="PlayAgainBtn"
						onClick={() => {
							navigate(
								`/game?nickname=${localStorage.getItem('nickname') || ''}`
							)
						}}
					>
						Play again
					</button>
					<button
						className="ExitBtn"
						onClick={() => {
							navigate('/')
						}}
					>
						Exit
					</button>
				</div>
			</div>
		</>
	)
}
