export class GamePhy {
	static moveRight(obj: Phaser.Physics.Matter.Sprite, speed: number) {
		obj.body.velocity.x = this.pxmi(speed)
	}

	static moveLeft(obj: Phaser.GameObjects.GameObject, speed: number) {
		obj.body.velocity.x = this.pxmi(-speed)
	}

	static moveUp(obj: Phaser.GameObjects.GameObject, speed: number) {
		obj.body.velocity.y = this.pxmi(-speed)
	}

	static moveDown(obj: Phaser.GameObjects.GameObject, speed: number) {
		obj.body.velocity.y = this.pxmi(speed)
	}

	static moveForwad(
		obj: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Sprite,
		speed: number
	) {
		var magnitude = 2
		var angle = obj.angle
		console.log(angle)
		obj.setVelocity(magnitude * Math.cos(angle), magnitude * Math.sin(angle))
	}

	static rotateRight(obj: Phaser.Physics.Matter.Sprite, speed: number) {
		obj.setAngularVelocity(10)
	}

	static rotateLeft(obj: Phaser.Physics.Matter.Sprite, speed: number) {
		obj.setAngularVelocity(-10)
	}

	static pxmi(v: number) {
		return v * -0.05
	}
}
