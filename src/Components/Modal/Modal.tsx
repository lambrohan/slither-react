import React, { useEffect, useState } from 'react'
import './Modal.scss'

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
	visible: boolean
	dismiss: () => void
	transparent: boolean
	overlay?: boolean
}
export const Modal: React.FC<ModalProps> = ({
	children,
	visible = false,
	dismiss,
	overlay = false,
	transparent,
}: ModalProps) => {
	return (
		<>
			{visible ? (
				<div
					className={`fixed w-full min-h-screen h-10 left-0 top-0 modal flex items-center justify-center ${
						overlay ? 'overlay' : ''
					}`}
					onClick={dismiss}
				>
					<div
						className="wrapper relative shadow-xl"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<div
							className={
								transparent
									? 'modal-content p-4 rounded-xl'
									: 'moadal-background modal-content p-4 rounded-xl'
							}
						>
							{children}
						</div>
					</div>
				</div>
			) : null}
		</>
	)
}
