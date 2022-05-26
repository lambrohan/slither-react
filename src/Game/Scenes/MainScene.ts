import Phaser from 'phaser'
export default class MainScene extends Phaser.Scene {
	hexWidth = 70
	border = 2
	hexHeight = 80
	hexArray: Phaser.GameObjects.Sprite[][] = []
	hexGroup: Phaser.GameObjects.Group | undefined = undefined
	gridSizeX: number = 0
	gridSizeY: number = 0
	actualHex = undefined
	constructor() {
		super('main')
	}

	preload() {
		this.load.setBaseURL(
			process.env.BASE_URL ||
				process.env.VITE_VERCEL_URL ||
				'http://localhost:3000'
		)
		this.load.image('hex', '/hex.svg')
	}

	create() {
		//Create hexagons with scale
		this.hexGroup = this.add.group()
		this.gridSizeX = Math.floor(this.sys.canvas.width / this.hexWidth) + 30
		this.gridSizeY = Math.floor(this.sys.canvas.height / this.hexHeight) + 12
		for (var i = 0; i < this.gridSizeY / 2; i++) {
			this.hexArray[i] = []
			for (var j = 0; j < this.gridSizeX; j++) {
				if (
					this.gridSizeY % 2 == 0 ||
					i + 1 < this.gridSizeY / 2 ||
					j % 2 == 0
				) {
					var hexagonX = (this.hexHeight * j) / 2.1
					var hexagonY =
						this.hexHeight * i * 1.5 + (this.hexHeight / 4) * 3 * (j % 2)
					var hexagon = this.add.sprite(
						hexagonX + this.hexHeight / 2,
						hexagonY * 1.1 + this.hexHeight / 2,
						'hex'
					)

					hexagon.setScale(0)
					hexagon.setAlpha(0)
					hexagon.setAngle(45)
					this.hexArray[i][j] = hexagon
					this.hexGroup.add(hexagon)
				}
			}
		}

		this.hexGroup.setOrigin(1.05, 1)
		this.scaleDiagonalHexagons(1)
		// this.scaleHex(1)
	}

	scaleHex(scale: number) {
		this.hexGroup?.children.each((hex) => {
			this.tweens.add({
				targets: hex,
				scaleX: scale,
				scaleY: scale,
				onComplete: (tween) => tween.remove(),
				duration: 600,
			})
		})
	}

	createEmitter() {}

	scaleDiagonalHexagons(scale: number) {
		var m = this.hexArray.length
		var n = this.hexArray[0].length
		var delay = 100
		for (var slice = 0; slice < m + n - 1; ++slice) {
			var z1 = slice < n ? 0 : slice - n + 1
			var z2 = slice < m ? 0 : slice - m + 1
			for (var j = slice - z2; j >= z1; --j) {
				var hexagon = this.hexArray[j][slice - j]
				delay += 2
				this.add.tween({
					targets: hexagon,
					alpha: 1,
					angle: 0,
					scaleX: 1,
					scaleY: 1,
					duration: 400,
					ease: 'Linear',
					delay,
				})
			}
		}
	}
}
