import { GameMeta } from '../../Utils'

export interface DebugInfoOptions {
	scene: Phaser.Scene
	score?: number
}
export class DebugInfo {
	scene: Phaser.Scene | null = null
	score: number = 0
	scoreText: Phaser.GameObjects.Text | null = null
	constructor({ scene }: DebugInfoOptions) {
		this.scene = scene
		this.scoreText = this.scene.add.text(10, 10, `Score - ${this.score}`, {
			fontSize: '20px',
			align: 'left',
			color: '#fff',
		})
		this.scoreText.setScrollFactor(0, 0)
	}

	updateScore(score: number) {
		this.score = score
		this.scoreText?.setText(`Score - ${this.score}`)
	}
}
