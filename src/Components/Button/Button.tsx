import React, { PropsWithChildren } from 'react'
import './Button.scss'

export type ButtonType = 'default' | 'primary' | 'accent'
interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
	type?: ButtonType
}

export const Button: React.FC<ButtonProps> = ({
	type = 'default',
	children,
	className,
}: PropsWithChildren<ButtonProps>) => {
	return (
		<button className={`mybtn btn-${type} ${className}`}>{children}</button>
	)
}
