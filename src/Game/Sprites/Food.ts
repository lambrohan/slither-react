import Phaser from 'phaser'

export interface FoodOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  asset?: string;
  size: number;
  id: string|number;
}


export class Food extends Phaser.Physics.Arcade.Sprite  {
  x: number=0;
  y: number=0;
  asset: string='coin';
  size: number=0;
  id: string|number=0;
  constructor({scene,x,y,asset='coin', size, id}: FoodOptions){
    super(scene, x,y,asset)
    this.id = id;
    this.size = size;
    this.scene = scene
    this.x = x;
    this.y = y
    this.asset = asset
    this.init()

  }

  init(){
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

  }


}