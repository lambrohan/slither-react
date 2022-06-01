import React from 'react'
import './Modal.scss'

interface ModalProps extends React.HTMLProps<HTMLDivElement> {
	visible: boolean
	dismiss: () => void
}
export const Modal: React.FC<ModalProps> = ({
	children,
	visible = false,
	dismiss,
}: ModalProps) => {
	return (
		<>
			{visible ? (
				<div
					className="fixed w-full min-h-screen h-10 left-0 top-0 modal flex items-center justify-center"
					onClick={dismiss}
				>
					<div
						className="wrapper relative"
						onClick={(e) => {
							e.stopPropagation()
						}}
					>
						<div className="modal-content p-4 rounded-xl">{children}</div>
					</div>
				</div>
			) : null}
		</>
	)
}
