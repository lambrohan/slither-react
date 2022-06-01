import { GameMeta, generateFood, getCenter, getRandomNumber, isMobileDevice } from '../../Utils'
import Phaser, { GameObjects } from 'phaser'
import { Player } from '../GameOjbects/Player'
import { Food } from '../Sprites/Food'
import { FoodItem } from '../Models'
export default class MainScene extends Phaser.Scene {
	hexWidth = 70
	border = 4
	hexHeight = 80
	hexArray: Phaser.GameObjects.Sprite[][] = []
	hexGroup: Phaser.GameObjects.Group | undefined = undefined
	gridSizeX: number = 0
	gridSizeY: number = 0
	hexConeHeight: number = 0
	player: Player|null= null;
	foodGroup: Phaser.GameObjects.Group|null=null;
	players : Array<Player> = []

	constructor() {
		super('main')
	}

	preload() {
		this.load.image('hex', '/hex.svg')
		this.load.image('hex1', '/hex_1.svg')
		this.load.image('head', '/head1.png' )
		this.load.image('body', '/body1.png' )
		this.load.image('foodPink', '/food/glowy-pink.png')
		this.load.image('foodBlue', '/food/glowy-blue.png')
		this.load.image('foodLime', '/food/glowy-lime.png')
		this.load.image('foodRed', '/food/glowy-red.png')
		this.load.image('foodGreen', '/food/glowy-green.png')
		this.load.image('coin', '/coin.png')


	}

	create() {
		this.createHex()
		this.scaleDiagonalHexagons(1)
		this.createPlayer()
		this.createFood()
	}

	update(time: number, delta: number): void {
		if(this.physics.collide(this.player?.snakeHead as any, this.foodGroup as any, this._handleFoodCollision, this._processhandler, this)){}
		
		
		// update player
		this.player?.update()

		// update other players
		for (let i = 0; i < this.players.length; i++) {
					
			if(this.players[i].snakeHead?.active){
				this.players[i].update()
				if(this.physics.collide(this.players[i]?.snakeHead as any, this.foodGroup as any, this._handlePlayerCollision, this._processhandler, this)){}

			}
		}
	}

	_processhandler(head: any,food:any){

    return true;
	}

	_handleFoodCollision(player: Phaser.GameObjects.GameObject, foodObject: Phaser.GameObjects.GameObject){
		this.player?.grow(foodObject as Food)
    foodObject.destroy()
	}

	_handlePlayerCollision (me: Phaser.GameObjects.GameObject, them: Phaser.GameObjects.GameObject) {
    console.log('_handlePlayerColision', me, them)
  }


	_onSocketConnected(){
		console.log('_onSocketConnected')
		// Reset enemies on reconnect

    this.players = [];

    // Send local player data to the game server
	}


	createPlayer(){
		const center = getCenter(this)
		this.player = new Player({
			index:0,
			scene: this,
			x: center.x,
			y: center.y,
			
			numSnakeSections: 30,
			assets: {
				head: 'head',
				body: 'body'
			}
		})
		this.cameras.main.setBounds(0,0, GameMeta.boundX, GameMeta.boundY );
		this.cameras.main.startFollow(this.player.snakeHead as any)
	}

	createFood(){
		this.foodGroup = this.physics.add.group()
		const items = generateFood(GameMeta.boundX, GameMeta.boundY);
		this._onFoodEvent(items);
	}
	
	_onFoodEvent(items: Array<FoodItem>){
		items.forEach((item)=>{
			const food = new Food({
			scene: this, x: item.x, y: item.y,
			size: item.size,
			id: item.id,
			})


			this.foodGroup?.add(food)
		})
	}


	createHex(){
		this.hexConeHeight = (Math.tan(Math.PI / 6) * this.hexWidth) / 2
		this.hexGroup = this.add.group()
		this.gridSizeX = Math.floor(GameMeta.boundX / this.hexWidth)
		this.gridSizeY = Math.ceil(
			GameMeta.boundY / (this.hexHeight - this.hexConeHeight)
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
				delay += Phaser.Math.Between(2, 4)
				this.add.tween({
					targets: hexagon,
					alpha: Phaser.Math.Between(70, 89) / 100,
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
