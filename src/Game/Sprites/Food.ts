import Phaser from 'phaser'

export interface FoodOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  color: string;
  size: number;
  id: string|number;
}


export class Food extends Phaser.Physics.Arcade.Sprite  {
  x: number=0;
  y: number=0;
  color: string='';
  size: number=0;
  id: string|number=0;
  constructor({scene,x,y,color, size, id}: FoodOptions){
    super(scene, x,y,color)
    this.id = id;
    this.size = size;
    this.scene = scene
    this.x = x;
    this.y = y
    this.color = color;
    this.init()

  }

  init(){
    this.scene.add.existing(this)
    this.scene.physics.add.existing(this)

  }


}