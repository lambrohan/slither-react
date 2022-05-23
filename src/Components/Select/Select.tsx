import React from 'react'
import { Menu, Transition } from '@headlessui/react'

import './Select.scss'
interface SelectProps extends React.HTMLProps<HTMLDivElement> {
	label?: string
	options: string[]
}

export const Select: React.FC<SelectProps> = ({
	label = 'Select',
	options,
	className,
}) => {
	return (
		<div className={`relative ${className}`}>
			<Menu>
				<Menu.Button className="font-bold text-white">{label}</Menu.Button>
				<Transition
					enter="transition duration-100 ease-out"
					enterFrom="transform scale-95 opacity-0"
					enterTo="transform scale-100 opacity-100"
					leave="transition duration-75 ease-out"
					leaveFrom="transform scale-100 opacity-100"
					leaveTo="transform scale-95 opacity-0"
				>
					<Menu.Items className="absolute bg-white w-[10rem] rounded-xl left-2/4 -translate-x-2/4 mt-4 shadow-lg">
						{options.map((o) => (
							<Menu.Item
								key={o}
								as="div"
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
