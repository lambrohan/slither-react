export const GameQualityOptions = ['Low', 'Medium', 'High']

export function isMobileDevice(gameCtx: any): boolean {
	return gameCtx.device.os.desktop === false
}

export function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min
}
