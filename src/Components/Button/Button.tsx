import React, { PropsWithChildren } from 'react'
import './Button.scss'

export type ButtonType = 'default' | 'primary' | 'accent' | 'transparent'
interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
	type?: ButtonType
}

export const Button: React.FC<ButtonProps> = (
	props: PropsWithChildren<ButtonProps>
) => {
	const { type = 'default', children, className } = props
	return (
		<button
			className={`mybtn btn-${type} ${className}`}
			onClick={props.onClick}
			disabled={props.disabled}
		>
			{children}
		</button>
	)
}
