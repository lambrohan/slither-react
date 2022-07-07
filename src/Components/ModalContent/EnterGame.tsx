import React, { useState } from 'react'
import borderLine from '../../assets/images/borderLine.png'
import Ice from '../../assets/images/Ice.png'
import Fire from '../../assets/images/Fire.png'
import './ModalContent.scss'
import LeftSolid from '../../assets/images/leftSolid.svg'
import RightSolid from '../../assets/images/rightSolid.svg'
import useWeb3Ctx from '../../Context/Web3Context'
import { RoomRepo, RoomResponse } from '../../Repositories/room'
import { useEffectOnce } from '../../Hooks/useEffectOnce'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { queryString } from '../../Utils'

interface EnterGameProps {}

export const EnterGame: React.FC<EnterGameProps> = ({}) => {
	const { user } = useWeb3Ctx()
	const navigate = useNavigate()

	const [amt, setAmt] = useState('')
	const [rooms, setRooms] = useState<Array<RoomResponse>>([])
	const [name, setName] = useState('')
	const [selectedRoom, setSelectedRoom] = useState<RoomResponse>()

	const fetchRooms = async () => {
		const rooms = await RoomRepo.getAll()
		setRooms(rooms)
	}

	const initPlay = async () => {}

	useEffectOnce(() => {
		fetchRooms().catch((e) => {
			toast('failed to fetch rooms')
		})
	})

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
					{rooms.length &&
						rooms.map((r) => (
							<div
								className="relative"
								key={r.id}
								onClick={() => {
									setSelectedRoom(r)
								}}
							>
								<img
									src={r.name === 'ice' ? Ice : Fire}
									alt=""
									className={`hoverGameImage mr-2 lg:mr-4  ${
										selectedRoom?.name == r.name
											? 'border border-white border-2'
											: ''
									}`}
								/>
								<p className="absolute bottom-[20px] left-[24px] text-lg lg:text-2xl text-white  font-bold flex flex-col">
									{r.name}
									<span className=" lg:text-xs font-normal">
										Stake Worth $
										{r.variable_stake
											? `${r.min_usd_to_join} - ${r.max_usd_to_join}`
											: r.min_usd_to_join}
									</span>
								</p>
							</div>
						))}

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
							USD
						</button>
						<input
							type="text"
							value={amt}
							onChange={(e) => {
								selectedRoom?.variable_stake
									? setAmt(e.target.value)
									: setAmt(selectedRoom?.min_usd_to_join + '')
							}}
							className="indent-32 absolute z-10 text-white font-bold text-2xl h-full w-full  p-2 bg-[#0000002c] rounded-lg focus:outline-none"
						/>
					</div>
				</div>

				<div className="flex flex-col justify-start mt-4 mx-7">
					<p className="text-white font-medium mb-1">USERNAME</p>
					<input
						type="text"
						className="customInput indent-5 h-[57px] w-full  p-2 bg-[#0000002c] text-white font-bold text-medium rounded-lg focus:outline-none"
						onChange={(e) => {
							setName(e.target.value)
						}}
					/>
				</div>
				<div className="flex justify-center my-6">
					<button
						className="bg-white rounded-full px-[54px] py-[13px] font-bold"
						onClick={() => {
							navigate(
								`/game?` +
									queryString({
										roomName: selectedRoom?.name,
										nickname: name,
										stakeUSD: amt,
									})
							)
						}}
					>
						PLAY NOW
					</button>
				</div>
			</div>
		</>
	)
}
