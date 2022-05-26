import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { GameLayout } from '../Layouts/Game'
import { Lobby } from '../Layouts/Lobby/Lobby'
import { Error } from '../Pages/Error'
import { Home } from '../Pages/Home'

interface AnimatedRoutesProps {}

export const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({}) => {
	const location = useLocation()
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Lobby />}>
					<Route index element={<Home />} />
				</Route>
				<Route path="/game" element={<GameLayout />}></Route>
				<Route path="*" element={<Error />} />
			</Routes>
		</AnimatePresence>
	)
}
