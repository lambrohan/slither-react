import axios from 'axios'
import { StorageService } from './storage'

export class ApiService {
	static init() {
		axios.defaults.baseURL = process.env.BASE_URL || 'http://localhost:4000'
		axios.defaults.headers.common.authorization =
			StorageService.getToken() || ''
		this.setInterceptors()
	}

	static setInterceptors() {
		axios.interceptors.request.use((req) => {
			req.headers = Object.assign(
				{ authorization: StorageService.getToken() },
				req.headers
			)
			return req
		})
	}
}
