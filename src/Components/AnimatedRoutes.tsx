import { AnimatePresence } from 'framer-motion'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { GameLayout } from '../Layouts/Game'
import { Lobby } from '../Layouts/Lobby/Lobby'
import { Error } from '../Pages/Error'
import { Home } from '../Pages/Home'
import { FollowUs } from '../Pages/FollowUs'

import { DashboardPage } from '../Pages/Dashboard'
import { CongratulationPage } from '../Pages/Congratulation'
import { EnterGamePage } from '../Pages/EnterGamePage'
import { GameOverPage } from '../Pages/GameOverPage'
import { PrivacyPolicyPage } from '../Pages/PrivacyPolicyPage'
import { ProtectedRoute } from '../Context/ProtectedRoute'
import useWeb3Ctx from '../Context/Web3Context'

interface AnimatedRoutesProps {}

export const AnimatedRoutes: React.FC<AnimatedRoutesProps> = ({}) => {
	const location = useLocation()
	const { user } = useWeb3Ctx()
	return (
		<AnimatePresence>
			<Routes location={location} key={location.pathname}>
				<Route path="/" element={<Lobby />}>
					<Route index element={<Home />} />
					<Route path="follow-us" element={<FollowUs />}></Route>

					{/* temp routes */}
					<Route element={<ProtectedRoute isAllowed={!!user} />}>
						<Route path="/dashboard" element={<DashboardPage />}></Route>
						<Route
							path="/congratulation"
							element={<CongratulationPage />}
						></Route>
						<Route path="/GameOver" element={<GameOverPage />}></Route>
						<Route path="/game" element={<GameLayout />}></Route>
						<Route path="EnterGame" element={<EnterGamePage />}></Route>
					</Route>
					<Route path="PrivacyPolicy" element={<PrivacyPolicyPage />}></Route>
				</Route>

				<Route path="*" element={<Error />} />
			</Routes>
		</AnimatePresence>
	)
}
