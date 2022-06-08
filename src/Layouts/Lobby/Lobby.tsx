import React from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../../Components/Header/Header'
import './Lobby.scss'

interface LobbyProps {}

export const Lobby: React.FC<LobbyProps> = ({}) => {
	return (
		<div
			className="w-full min-h-screen overflow-auto lg:max-h-screen bg-no-repeat bg-cover bg-center"
			id="lobby"
		>
			<Header />
			<Outlet />
		</div>
	)
}
