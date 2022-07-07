import React, { PropsWithChildren } from 'react'
import './Button.scss'

export type ButtonType = 'default' | 'primary' | 'accent' | 'transparent'
interface ButtonProps extends React.HTMLProps<HTMLButtonElement> {
	type?: ButtonType
	loading?: boolean
}

export const Button: React.FC<ButtonProps> = (
	props: PropsWithChildren<ButtonProps>
) => {
	const { type = 'default', children, className } = props
	return (
		<button
			className={`mybtn btn-${type} ${className}`}
			onClick={props.onClick}
			disabled={props.disabled || props.loading}
		>
			{props.loading ? (
				<div className="w-full flex items-center justify-center ">
					<svg
						viewBox="0 0 38 38"
						className="w-6 h-6"
						xmlns="http://www.w3.org/2000/svg"
						stroke="#000"
					>
						<g fill="none" fillRule="evenodd">
							<g transform="translate(1 1)" strokeWidth="2">
								<circle strokeOpacity=".5" cx="18" cy="18" r="18" />
								<path d="M36 18c0-9.94-8.06-18-18-18">
									<animateTransform
										attributeName="transform"
										type="rotate"
										from="0 18 18"
										to="360 18 18"
										dur="0.6s"
										repeatCount="indefinite"
									/>
								</path>
							</g>
						</g>
					</svg>
				</div>
			) : (
				children
			)}
		</button>
	)
}
