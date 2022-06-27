import axios from 'axios'
import './App.scss'
import { AnimatedRoutes } from './Components/AnimatedRoutes'
import { useEffectOnce } from './Hooks/useEffectOnce'
import { ApiService } from './Services'
function App() {
	useEffectOnce(() => {
		ApiService.init()
	})
	return (
		<div className="app">
			<AnimatedRoutes />
		</div>
	)
}

export default App
