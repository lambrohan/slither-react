import React from 'react'
import borderLine from '../../assets/images/borderLine.png'
import Ice from '../../assets/images/Ice.png'
import Fire from '../../assets/images/Fire.png'
import './ModalContent.scss'
import LeftSolid from '../../assets/images/leftSolid.svg'
import RightSolid from '../../assets/images/rightSolid.svg'
import useWeb3Ctx from '../../Context/Web3Context'

interface EnterGameProps {}

export const EnterGame: React.FC<EnterGameProps> = ({}) => {
	const {
		web3Instance,
		depositContract,
		account,
		babyDogeContract,
		usdtContract,
	} = useWeb3Ctx()

	const initDeposit = async () => {
		const amt = 100
		const nonce = 2
		await babyDogeContract.methods
			.approve('0xB116c568d1c056046aD7095C941Ed6491A79cD7A', amt)
			.send({
				from: account,
			})

		const response = await depositContract.methods
			.depositTokensTest('0x0000000000000000000000000000000000000000', 0)
			.send({
				from: account,
				value: 100,
			})

		console.log(response)
	}
	return (
		<>
			<div className="w-100 blur-background rounded-lg">
				<p className="text-white font-medium my-5 text-center">
					ENTER THE GAME
				</p>

				<img src={borderLine} alt="border-line" />

				<div className="flex justify-around items-center  my-4">
					<img
						className="h-[16px] lg:h-[32px] cursor-pointer"
						src={LeftSolid}
						alt="LeftSolid"
					/>
					<div className="relative">
						<img
							src={Ice}
							alt=""
							className="hoverGameImage mr-2 lg:mr-4 hover:outline-offset-4"
						/>
						<p className="absolute bottom-[20px] left-[24px] text-lg lg:text-2xl text-white  font-bold flex flex-col">
							Ice Room
							<span className="hidden lg:text-xs font-normal">
								Game Token 0.50 standard
							</span>
						</p>
					</div>
					<div className="relative">
						<img
							src={Fire}
							alt=""
							className="hoverGameImage hover:outline-offset-4"
						/>
						<p className="absolute bottom-[20px] left-[24px] text-lg lg:text-2xl  text-white font-bold flex flex-col">
							Fire Room
							<span className="hidden lg:text-xs font-normal">
								Game Token 0.50 - 500 standard
							</span>
						</p>
					</div>
					<img
						className="h-[16px] lg:h-[32px] cursor-pointer"
						src={RightSolid}
					/>
				</div>

				<img src={borderLine} alt="border-line" />

				<div className="flex flex-col mx-7">
					<p className="text-white text-sm font-bold mt-[22px] mb-[12px]">
						YOUR AMOUNT
					</p>
					<div className="relative h-[57px]">
						<button
							id="dropdownDefault"
							data-dropdown-toggle="dropdown"
							className="text-black h-full absolute z-30 bg-white font-bold rounded-tl-lg rounded-bl-lg text-sm px-8 py-2.5 text-center inline-flex items-center"
							type="button"
						>
							USD{' '}
							<svg
								className="w-4 h-4 ml-2"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="2"
									d="M19 9l-7 7-7-7"
								></path>
							</svg>
						</button>
						<input
							type="text"
							className="indent-32 absolute z-10 text-white font-bold text-2xl h-full w-full  p-2 bg-[#0000002c] rounded-lg focus:outline-none"
						/>
						<button className="absolute z-30  right-[6px] top-[10px] text-white bg-[#46125D] text-[8px] py-2.5 px-10 rounded-full ">
							SAVE
						</button>
					</div>
				</div>

				<div className="flex flex-col justify-start mt-4 mx-7">
					<p className="text-white font-medium">USERNAME</p>
					<input
						type="text"
						placeholder="GUSOBRAL"
						className="customInput indent-5 h-[57px] w-full  p-2 bg-[#0000002c] text-white font-bold text-medium rounded-lg focus:outline-none"
					/>
				</div>
				<div className="flex justify-center my-6">
					<button
						className="bg-white rounded-full px-[54px] py-[13px] font-bold"
						onClick={initDeposit}
					>
						PLAY NOW
					</button>
				</div>
			</div>
		</>
	)
}
