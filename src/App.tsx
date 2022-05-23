import { useState } from 'react'
import {
	BrowserRouter,
	BrowserRouter as Router,
	Route,
	useLocation,
	Routes,
} from 'react-router-dom'

import './App.css'
import { GameLayout } from './Layouts/Game'
import { Lobby } from './Layouts/Lobby/Lobby'
import { Error } from './Pages/Error'
import { Home } from './Pages/Home'

function App() {
	return (
		<div className="app">
			<Routes>
				<Route path="/" element={<Lobby />}>
					<Route index element={<Home />} />
				</Route>
				<Route path="/game" element={<GameLayout />}></Route>
				<Route path="*" element={<Error />} />
			</Routes>
		</div>
	)
}

export default App
