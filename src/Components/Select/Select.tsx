import React from 'react'
import { Menu } from '@headlessui/react'

import './Select.scss'
interface SelectProps extends React.HTMLProps<HTMLDivElement> {
	label?: string
	options: string[]
}

export const Select: React.FC<SelectProps> = ({
	label = 'Select',
	options,
}) => {
	return (
		<div>
			<Menu>
				<Menu.Button>{label}</Menu.Button>
				<Menu.Items>
					{options.map((o) => (
						<Menu.Item key={o}>{o}</Menu.Item>
					))}
				</Menu.Items>
			</Menu>
		</div>
	)
}
