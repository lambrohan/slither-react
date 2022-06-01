export interface FoodItemOptions {
  x:number;
  y:number;
  size:number;
  color:string
  id:number|string
}
export class FoodItem {
  x:number=0;
  y:number=0;
  size:number=0;
  color:string=''
  id:number|string=0

  constructor({
    id,x,y,color,size
  }: FoodItemOptions){
    this.id = id
    this.x = x
    this.y = y
    this.color = color
    this.size = size
  }
}