export const GameQualityOptions = ['Low', 'Medium', 'High']

export function isMobileDevice(gameCtx: any): boolean {
	return gameCtx.device.os.desktop === false
}
