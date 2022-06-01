import { FoodItem } from "../Game/Models"

export const GameQualityOptions = ['Low', 'Medium', 'High']

export function isMobileDevice(gameCtx: any): boolean {
	return gameCtx.device.os.desktop === false
}

export function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min
}

export function getCenter(scene:any): {x: number, y: number}{
	return {
		x: scene.sys.canvas.width/2,
		y: scene.sys.canvas.height/2
	}
}

export const GameMeta = {
	boundX: 3000,
	boundY: 3000,
	boundPadding: 20,
}


export function generateFood(canvasW: number, canvasY: number) {
	const foodGroup = []
  for (var i = 0; i < 100; i++) {
    foodGroup.push(new FoodItem({
      id: 'pink' + i,
      x: getRandomArbitrary(0, canvasW), 
      y: getRandomArbitrary(0, canvasY), 
      color: 'foodPink',
      size: 1
    }))
  }

  for (var i = 0; i < 40; i++) {
    foodGroup.push(new FoodItem({
      id: 'blue' + i,
      x: getRandomArbitrary(0, canvasW), 
      y: getRandomArbitrary(0, canvasY), 
      color: 'foodBlue',
      size: 5
    }))

    foodGroup.push(new FoodItem({
      id: 'green' + i,
      x: getRandomArbitrary(0, canvasW), 
      y: getRandomArbitrary(0, canvasY), 
      color: 'foodGreen',
      size: 5
    }))
  }

  for (var i = 0; i < 20; i++) {
    foodGroup.push(new FoodItem({
      id: 'lime' + i,
      x: getRandomArbitrary(0, canvasW), 
      y: getRandomArbitrary(0, canvasY), 
      color: 'foodLime',
      size: 10
    }))
  }

  for (var i = 0; i < 10; i++) {
    foodGroup.push(new FoodItem({
      id: 'red' + i,
      x: getRandomArbitrary(0, canvasW), 
      y: getRandomArbitrary(0, canvasY), 
      color: 'foodRed',
      size: 15
    }))
  }

	return foodGroup
}

function getRandomArbitrary(min:number, max: number) {
  return Math.random() * (max - min) + min;
}
