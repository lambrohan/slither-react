import Phaser from 'phaser'
export interface SneakHeadOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  texture: string | Phaser.Textures.Texture
}
export class SnakeHead extends Phaser.GameObjects.Sprite {
  constructor({scene, x,y, texture}: SneakHeadOptions){
    super(scene, x, y, texture)
    this.setOrigin(0.5,0.5)
    console.log(this)
  }

  update(...args: any[]): void {
      
  }
}