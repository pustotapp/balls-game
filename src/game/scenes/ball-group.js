import { Ball } from "./ball.js";

const {Between, RandomXY} = Phaser.Math;

export class BallGroup extends Phaser.Physics.Arcade.Group {
    constructor(scene) {
        super(scene.physics.world, scene);
    }
    
    spawnBall() {
        const ball = new Ball(this.scene);
        this.add(ball);

        const direction = RandomXY(new Phaser.Math.Vector2(), 30);

        ball.body.onCollide = true;
        ball.body.setCollideWorldBounds(true);
        ball.body.setBounce(1);
        ball.body.setFriction(10, 10);
        ball.body.setVelocity(direction.x, direction.y);
        ball.body.setMass(.5);
        ball.body.setMaxSpeed(this.scene.game.MAX_SPEED);
    }
    
    spawnBalls(count) {
        for (let i = 0; i < count; i++) {
            this.spawnBall();
        }
    }
}