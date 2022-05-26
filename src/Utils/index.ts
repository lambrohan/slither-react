export const GameQualityOptions = ['Low', 'Medium', 'High']
const Phaser = await import('phaser')

export function isMobileDevice(gameCtx: Phaser.Game): boolean {
	return gameCtx.device.os.desktop === false
}
