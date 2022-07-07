import axios from 'axios'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import './App.scss'
import { AnimatedRoutes } from './Components/AnimatedRoutes'
import { useEffectOnce } from './Hooks/useEffectOnce'
import { ApiService, StorageService } from './Services'
function App() {
	const navigate = useNavigate()
	useEffectOnce(() => {
		StorageService.clear()
		ApiService.init()
		;(window as any).navigateTo = (route: string) => {
			console.log('navigateTo', route)
			navigate(route)
		}
	})
	return (
		<div className="app">
			<AnimatedRoutes />
			<Toaster />
		</div>
	)
}

export default App
