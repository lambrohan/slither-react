import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Web3Context, Web3Provider } from './Context/Web3Context'

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<BrowserRouter>
			<Web3Provider>
				<App />
			</Web3Provider>
		</BrowserRouter>
	</React.StrictMode>
)
