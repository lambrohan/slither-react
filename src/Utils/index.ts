export const GameQualityOptions = ['Low', 'Medium', 'High']

export function isMobileDevice(gameCtx: Phaser.Game): boolean {
	return gameCtx.device.os.desktop === false
}
