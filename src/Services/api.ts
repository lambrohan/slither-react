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
			const token = StorageService.getToken()
			if (token) {
				req.headers = Object.assign(
					{ authorization: 'Bearer ' + token },
					req.headers
				)
			}

			return req
		})
	}
}
