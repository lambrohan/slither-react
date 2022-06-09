import { FoodItem } from '../Game/Models'

export const GameQualityOptions = ['Low', 'Medium', 'High']

export function isMobileDevice(gameCtx: any): boolean {
	return gameCtx.device.os.desktop === false
}

export function getRandomNumber(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min)) + min
}

export function getCenter(scene: any): { x: number; y: number } {
	return {
		x: scene.sys.canvas.width / 2,
		y: scene.sys.canvas.height / 2,
	}
}

export const GameMeta = {
	boundX: 3000,
	boundY: 3000,
	boundPadding: 20,
}

export function generateFood(canvasW: number, canvasY: number) {
	const foodGroup: Array<any> = []
	for (var i = 0; i < 400; i++) {
		foodGroup.push(
			new FoodItem({
				id: 'pink' + i,
				x: getRandomArbitrary(0, canvasW),
				y: getRandomArbitrary(0, canvasY),
				size: 1,
			})
		)
	}
	return foodGroup
}

function getRandomArbitrary(min: number, max: number) {
	return Math.random() * (max - min) + min
}

export enum SPRITE_LABELS {
	'HEAD' = 'head',
	'FOOD' = 'food',
}

/*
 * Calculate distance between two points
 * @param  {Number} x1 first point
 * @param  {Number} y1 first point
 * @param  {Number} x2 second point
 * @param  {Number} y2 second point
 */
export function distanceFormula(
	x1: number,
	y1: number,
	x2: number,
	y2: number
) {
	var withinRoot = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)
	var dist = Math.pow(withinRoot, 0.5)
	return dist
}

export function velocityFromAngle(angle: number, speed = 1) {
	const rad = degToRad(angle)
	return new Phaser.Math.Vector2(Math.cos(rad) * speed, Math.sin(rad) * speed)
}

export function degToRad(angle: number): number {
	return (angle * Math.PI) / 180
}

export const CONSTANTS = {
	SNAKE_SPEED: 4,
	FOOD_RADIUS_MULTIPLIER: 1,
}

export class Point {
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}
	x: number
	y: number

	setTo(x: number, y: number) {
		this.x = x
		this.y = y
	}
}
