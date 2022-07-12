import React from 'react'

interface RoomHeaderProps {
	roomName: string
}

export const RoomHeader: React.FC<RoomHeaderProps> = ({ roomName }) => {
	return (
		<div className="w-full absolute top-0 left-0">
			<div className="relative w-full flex flex-col items-center">
				<div className="w-full h-2 bg-primary"></div>
				<div
					className="w-[231px] relative"
					style={{
						backgroundImage: `url(/shapes/prpl_poly.svg)`,
						backgroundPosition: 'center',
						backgroundRepeat: 'no-repeat',
						backgroundSize: 'cover',
					}}
				>
					<p
						className="text-lg text-white text-center uppercase font-semibold mx-4 my-1"
						id="room-header"
					>
						{roomName}
					</p>
				</div>
			</div>
		</div>
	)
}
