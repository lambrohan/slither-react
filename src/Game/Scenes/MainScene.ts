import { getRandomNumber, isMobileDevice } from '../../Utils'
import Phaser from 'phaser'
export default class MainScene extends Phaser.Scene {
	hexWidth = 70
	border = 4
	hexHeight = 80
	hexArray: Phaser.GameObjects.Sprite[][] = []
	hexGroup: Phaser.GameObjects.Group | undefined = undefined
	gridSizeX: number = 0
	gridSizeY: number = 0
	hexConeHeight: number = 0

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('hex', '/hex.svg')
		this.load.image('hex1', '/hex_1.svg')
	}

	create() {
		this.game.canvas.setAttribute('backgroundColor', '')
		this.hexConeHeight = (Math.tan(Math.PI / 6) * this.hexWidth) / 2
		this.hexGroup = this.add.group()
		this.gridSizeX = Math.floor(this.sys.canvas.width / this.hexWidth) + 4
		this.gridSizeY = Math.ceil(
			this.sys.canvas.height / (this.hexHeight - this.hexConeHeight) + 4
		)

		for (let i = 1; i < this.gridSizeX; i++) {
			this.hexArray[i] = []
			for (let j = 1; j < this.gridSizeY; j++) {
				const x = i * (this.hexWidth + this.border)
				const y = j * (this.hexHeight - this.hexConeHeight + this.border)
				const xOffset = j % 2 == 0 ? (this.hexWidth + this.border) / 2 : 0
				const hex = this.add.sprite(x + xOffset, y, 'hex')
				hex.setAlpha(0)
				if (this.hexArray[i]) {
					this.hexArray[i][j] = hex
				}
				this.hexGroup.add(hex)
			}
		}

		this.hexGroup.setOrigin(1.5, 1)
		this.scaleDiagonalHexagons(1)
	}

	createEmitter() {}

	scaleRandomly() {
		const group = this.hexGroup?.getChildren() || []
		const totalHexes = group.length
		let loadedHexes = 0
		let delay = 0
		let alreadyScaled: any = {}

		while (loadedHexes < totalHexes) {
			const randomI = getRandomNumber(0, totalHexes)
			alreadyScaled[randomI] = true
			const hex = group[randomI]
			delay += Math.random() * 10
			this.add.tween({
				targets: hex,
				alpha: 1,
				angle: 0,
				scaleX: 1,
				scaleY: 1,
				duration: 400,
				ease: 'Linear',
				delay,
			})

			loadedHexes += 1
		}
	}

	scaleDiagonalHexagons(scale: number) {
		var m = this.hexArray.length
		var n = this.hexArray[1].length
		var delay = 100
		for (var slice = 1; slice < m + n - 1; ++slice) {
			var z1 = slice < n ? 1 : slice - n + 1
			var z2 = slice < m ? 1 : slice - m + 1
			for (var j = slice - z2; j >= z1; --j) {
				var hexagon = this.hexArray[j][slice - j]
				delay += 2
				this.add.tween({
					targets: hexagon,
					alpha: getRandomNumber(8, 10) / 10,
					angle: 0,
					scaleX: scale,
					scaleY: scale,
					duration: 400,
					ease: 'Linear',
					delay,
				})
			}
		}
	}
}
