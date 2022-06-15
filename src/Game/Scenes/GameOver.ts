import { PlayerState } from '../Models/PlayerState'

export default class MainScene extends Phaser.Scene {
	playerState!: PlayerState
	constructor() {
		super('gameover')
	}

	create() {}
}
