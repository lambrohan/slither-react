import {
	GameMeta,
	getCenter,
	getSkinAssetFromEnum,
	skins,
	SnakeSkin,
} from '../../Utils'
import { PlayerV2 } from '../GameOjbects/PlayerV2'
import { Snake } from '../GameOjbects/Snake'
import MainScene from './MainScene'

export default class InitScene extends Phaser.Scene {
	tileW = 584
	tileH = 527
	dummySnake!: Snake
	light!: Phaser.GameObjects.PointLight
	colors!: Phaser.GameObjects.Group
	selectedSkin = skins[0]
	selectedColor!: Phaser.GameObjects.Arc
	center!: { x: number; y: number }
	tiles!: Phaser.GameObjects.Group
	cols: Phaser.GameObjects.Group[] = []
	gridSizeX = 0
	constructor() {
		super('init')
	}

	preload() {
		this.load.image('eyes', '/eyes.png')
		this.load.image('blur', '/blur.png')
		this.load.image('next_btn', '/next_btn.png')

		this.load.image('bg', '/bg.png')
		this.load.image('hex', '/hex.svg')
		this.load.atlas('food', '/food.png', '/food.json')
		this.load.atlas('snake_head', '/snake_head.png', '/snake_head.json')
		this.load.atlas('snake_body', '/snake_body.png', '/snake_body.json')
	}

	create() {
		this.center = getCenter(this)
		this.tiles = this.add.group()
		this.colors = this.add.group()
		this.createTiles()
		this.createColorPicker()
	}

	createTiles() {
		this.light = this.add
			.pointlight(
				this.sys.game.canvas.width / 2,
				this.sys.game.canvas.height / 2,
				0xaa0000,
				1000,
				0.2
			)
			.setDepth(-1)

		this.light.setScrollFactor(0, 0)

		const gridSizeX = Math.ceil(this.sys.canvas.width / this.tileW) + 2
		this.gridSizeX = gridSizeX
		const gridSizeY = Math.ceil(this.sys.canvas.height / this.tileH)
		for (let i = 0; i <= gridSizeX; i++) {
			const group = this.add.group()
			for (let j = 0; j <= gridSizeY; j++) {
				const c = this.add.tileSprite(
					this.tileW * i,
					this.tileH * j,
					this.tileW,
					this.tileH,
					'bg'
				)

				group.add(c)
			}
			this.cols[i] = group
		}
	}

	createColorPicker() {
		const center = getCenter(this)
		const rect = this.add.rectangle(center.x, center.y, 837, 450, 0x000000, 0.8)
		this.add
			.text(center.x, center.y - 180, 'Pick your color', { align: 'center' })
			.setScrollFactor(0, 0)
			.setOrigin(0.5, 0.5)
		rect.setScrollFactor(0, 0)
		this.dummySnake = new Snake(this, center.x, center.y - 120, skins[0])

		for (let i = 0; i < skins.length; i++) {
			const c = this.add
				.sprite(center.x + i * 45, center.y + 100, 'snake_body', skins[i])
				.setScrollFactor(0, 0)
				.setOrigin(0.5, 0.5)
				.setScale(0.3)
				.setInteractive()
			c.on('pointerdown', () => {
				this.selectedSkin = skins[i]
				this.dummySnake.changeSkin(skins[i])
			})
			this.colors.add(c)
		}

		this.selectedColor = this.add
			.circle(-100, -100, 18, 0x0000000, 0)
			.setStrokeStyle(2, 0xffffff)
			.setScrollFactor(0, 0)

		this.add
			.sprite(center.x, center.y + 180, 'next_btn')
			.setScrollFactor(0, 0)
			.setDepth(4)
			.setScale(0.4)
			.setAlpha(0.9)
			.setInteractive()
			.on('pointerdown', () => {
				console.log('start scene')
				const scene = this.scene.start('main', { skin: this.selectedSkin })
			})
	}

	update(time: number, delta: number): void {
		this.dummySnake?.update()
		for (let i = 0; i < this.colors.children.getArray().length; i++) {
			const c = this.colors.children.getArray()[i] as Phaser.GameObjects.Sprite
			if (c.frame.name == this.selectedSkin) {
				c.setAlpha(1)
				this.selectedColor.setPosition(c.x, c.y)
			} else {
				c.setAlpha(0.7)
			}
		}

		if (this.cols.length) {
			const camX = this.cameras.main.worldView.right + 500
			if (
				camX >
				this.cols[this.cols.length - 1].getFirstAlive().x + this.tileW
			) {
				console.log('wow')
				const first = this.cols.shift()!
				first?.setX(
					this.cols[this.cols.length - 1].getFirstAlive().x + this.tileW
				)
				this.cols.push(first)
			}
		}
	}
}
