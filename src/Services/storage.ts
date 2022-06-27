export class StorageService {
	public static getToken() {
		return localStorage.getItem('token')
	}

	public static setToken(token: string) {
		return localStorage.setItem('token', token)
	}

	public static clear() {
		return localStorage.clear()
	}
}
