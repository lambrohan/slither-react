import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { GameLayout } from '../Layouts/Game'
import { Lobby } from '../Layouts/Lobby/Lobby'
import { Error } from '../Pages/Error'
import { Home } from '../Pages/Home'
import { FollowUs } from '../Pages/FollowUs';

import {DashboardPage} from "../Pages/Dashboard" 
import {CongratulationPage} from "../Pages/Congratulation"
import {EnterGamePage} from "../Pages/EnterGamePage"
import {GameOverPage} from "../Pages/GameOverPage"
import {PrivacyPolicyPage} from "../Pages/PrivacyPolicyPage"

interface AnimatedRoutesProps {}

export const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({}) => {
	const location = useLocation()
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Lobby />}>
					<Route index element={<Home />} />
					<Route path="follow-us" element={<FollowUs />}></Route>

					{/* temp routes */}
					<Route path="dashboard" element={<DashboardPage/>}></Route>
					<Route path="congratulation" element={<CongratulationPage/>}></Route>
					<Route path="EnterGame" element={<EnterGamePage/>}></Route>
					<Route path="GameOver" element={<GameOverPage />}></Route>
					<Route path="PrivacyPolicy" element={<PrivacyPolicyPage />}></Route>
				</Route>
				<Route path="/game" element={<GameLayout />}></Route>
				
				<Route path="*" element={<Error />} />
			</Routes>
		</AnimatePresence>
	)
}
