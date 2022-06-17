import React from 'react'

interface RoomHeaderProps {}

export const RoomHeader: React.FC<RoomHeaderProps> = ({}) => {
	return (
		<div className="w-full absolute top-0 left-0 hidden">
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
					<p className="text-lg text-white text-center uppercase font-semibold mx-4 my-1">
						Fire Room
					</p>
				</div>
			</div>
		</div>
	)
}
