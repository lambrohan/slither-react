import React from 'react'
import { Menu, Transition } from '@headlessui/react'

import './Select.scss'
interface SelectProps extends React.HTMLProps<HTMLDivElement> {
	label?: string
	options: string[]
	handleSelect?: (val: string) => void
	selection?: string
}

export const Select: React.FC<SelectProps> = ({
	label = 'Select',
	options,
	className,
	selection,
	handleSelect = () => {},
}) => {
	return (
		<div className={`relative ${className} z-10`}>
			<Menu>
				<Menu.Button className="font-bold text-white flex items-center">
					{selection || label}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className={`h-5 w-5 ml-1`}
						viewBox="0 0 20 20"
						fill="currentColor"
					>
						<path
							fillRule="evenodd"
							d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
							clipRule="evenodd"
						/>
					</svg>
				</Menu.Button>
				<Transition
					enter="transition duration-100 ease-out"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0"
				>
					<Menu.Items className="absolute bg-white min-w-[10rem] w-full rounded-xl left-2/4 -translate-x-2/4 mt-4 shadow-lg pb-2">
						{options.map((o) => (
							<Menu.Item
								key={o}
								as="div"
								onClick={() => {
									handleSelect(o)
								}}
								className="p-2 text-center hover:text-yellowAccent cursor-pointer"
							>
								{o}
							</Menu.Item>
						))}
					</Menu.Items>
				</Transition>
			</Menu>
		</div>
	)
}
