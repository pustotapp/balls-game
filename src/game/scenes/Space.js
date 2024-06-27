import { Scene } from "phaser";
import { EventBus } from "../EventBus.js";
import { backgroundTexture } from "./background.js";
import { getCharacterTexture } from "./character.js";
import { getParticleTexture } from "./particles.js";

const {Between, RandomXY} = Phaser.Math;

const GRAV_FORCE = 1e6;
const GRAV_MAX = 1e3;
const MAX_BALLS_IN_GAME = 30;
const BALLS_POOL = 1000;

const idGenerator = (first) => () => first++;
const getNextId = idGenerator(0);

export class Space extends Scene {
    constructor() {
        super('Space');
    }
    
    create() {
        this.createCamera();
        this.createPhysics();
        this.createBackground();
        this.createCharacter();
        this.createPointer();

        this.input.on('pointerdown', this.handlePointerDown, this)
        this.input.on('pointermove', this.handlePointerMove, this)
        this.input.on('pointerup', this.handlePointerUp, this)

        this.spawnBalls(MAX_BALLS_IN_GAME);

        this.createScore();
        
        this.createCollider();
    }
    
    createCamera() {
        this.cameras.main.setBackgroundColor(0x555555);
    }

    createPhysics() {
        this.physics.world.setBounds(-100, -100, this.cameras.main.width + 200, this.cameras.main.height + 200);
    }
    
    createBackground() {
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, backgroundTexture(this, 200, 200, 10))
            .setOrigin(0)
            .setScrollFactor(0, 1);
    }

    createCharacter() {
        this.character = this.add.sprite(100, 100, getCharacterTexture(this));
        this.physics.add.existing(this.character, false);
        this.character.body.setCircle(12)
        this.character.body.onCollide = true;
        this.character.body.setMass(10);
        
        this.character.name = 'character'

        const texture = getParticleTexture(this)
        const emitter = this.add.particles(0, 0, texture, {
            speed: {
                onEmit: (particle, key, t, value) => this.character.body.speed / 2
            },
            lifespan: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.character.body.speed, 0, 200) * 500
            },
            alpha: {
                onEmit: (particle, key, t, value) => Phaser.Math.Percent(this.character.body.speed, 0, 500) * 100
            },
            scale: { start: 3.0, end: 0 },
            blendMode: 'ADD'
        });
        emitter.startFollow(this.character);

        this.characterGroup = this.physics.add.group(this.character, {
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true,
        });
    }

    createPointer() {
        this.pointedTarget = new Phaser.Math.Vector2();
    }
    
    spawnBall() {
        const anotherBall = this.add.circle(0, 0, 7, 0xff0000);
        this.physics.add.existing(anotherBall, false);
        this.ballsGroup.add(anotherBall);

        const direction = RandomXY(new Phaser.Math.Vector2(), 30);

        anotherBall.body.onCollide = true;
        anotherBall.body.setCollideWorldBounds(true);
        anotherBall.body.setBounce(1);
        anotherBall.body.setFriction(10, 10);
        anotherBall.body.setVelocity(direction.x, direction.y);
        anotherBall.body.setMass(.5);
        anotherBall.body.setMaxSpeed(this.game.MAX_SPEED);

        anotherBall.setRandomPosition(0, 0, this.cameras.main.width, this.cameras.main.height);

        anotherBall.name = `ball-${getNextId()}`;
        anotherBall.energy = this.game.MAX_ENERGY;
    }

    spawnBalls(count) {
        this.ballsGroup = this.physics.add.group();
        for (let i = 0; i < count; i++) {
            this.spawnBall();
        }
        this.ballsRemaining = BALLS_POOL;
    }

    createScore() {
        this.ballsRemainingField = this.add.text(10, 10, 'Balls remaining: 0', {
            fontSize: '16px',
            color: '#0A6'
        }).setScrollFactor(0);
    }
    
    updateScore() {
        this.ballsRemainingField.setText(`Balls remaining: ${this.ballsRemaining}`);
    }

    createCollider() {
        this.collider = this.physics.add.collider(this.characterGroup, this.ballsGroup);
        this.ballsCollided = this.physics.add.collider(this.ballsGroup, this.ballsGroup);

        this.physics.world.on('collide', (gameObject1, gameObject2, body1, body2) => {
            if (gameObject1 === this.character && this.game.maxFollowers + 1 > this.characterGroup.children.size) {
                this.ballsGroup.remove(gameObject2);
                this.characterGroup.add(gameObject2);

                gameObject2.body.onCollide = true;
                gameObject2.body.setCollideWorldBounds(true);
                gameObject2.body.setBounce(0.8);

                gameObject2.setRadius(5)

                this.collider.destroy();
                this.collider = this.physics.add.collider(this.characterGroup, this.ballsGroup);

                this.ballsCollided.destroy();
                this.ballsCollided = this.physics.add.collider(this.ballsGroup, this.ballsGroup);
                
                EventBus.emit('character.follower.added');
            }
            
            if (this.characterGroup.contains(gameObject1)) {
                EventBus.emit('character.bounced', { energy: gameObject2.energy, speed: gameObject2.body.speed });
                gameObject2.energy -= Math.ceil(gameObject2.energy * gameObject2.body.speed / this.game.MAX_SPEED);
                if (gameObject2.energy < 0) {
                    gameObject2.destroy();
                    EventBus.emit('ball.destroyed');
                    this.ballsRemaining -= 1;
                    if (this.ballsRemaining > 0) {
                        this.spawnBall();
                    }
                }
            }

            if (this.characterGroup.contains(gameObject2) && !this.characterGroup.contains(gameObject1)) {
                EventBus.emit('character.follower.bounced', { energy: gameObject1.energy, speed: gameObject1.body.speed });
                gameObject1.energy -= Math.ceil(gameObject1.energy * gameObject1.body.speed / this.game.MAX_SPEED);
                if (gameObject1.energy < 0) {
                    gameObject1.energy = 0;
                }
            }
        });
    }

    update () {
        this.background.setTilePosition(this.cameras.main.scrollX);
        
        const tolerance = 3;

        const distance = Phaser.Math.Distance.BetweenPoints(this.character, this.pointedTarget);

        if (this.character.body.speed > 0)
        {
            this.physics.moveToObject(this.character, this.pointedTarget, distance);

            this.character.body.velocity.scale(
                Phaser.Math.SmoothStep(distance, 0, distance) + 1
            );

            if (distance < tolerance) {
                this.character.body.reset(this.pointedTarget.x, this.pointedTarget.y);
            }
        }

        const force = new Phaser.Math.Vector2();
        this.characterGroup.children.iterate((ball, index) => {
            if (ball === this.character) {
                return 
            }

            ball.body.gravity.reset();

            force
                .copy(ball.body.position)
                .subtract(this.character.body.position)
                .scale((GRAV_FORCE * ball.body.mass * this.character.body.mass) / force.lengthSq())
                .limit(GRAV_MAX);

            ball.body.gravity.subtract(force);
        });
        
        this.ballsGroup.children.iterate((ball) => {
            if (ball.energy < this.game.MAX_ENERGY) {
                ball.energy += .1 * ball.energy + .1;
            }
            
            if (this.cameras.main.worldView.contains(ball.body.position.x, ball.body.position.y)) {
                return;
            }

           if (
               this.cameras.main.worldView.contains(ball.body.position.x + 50, ball.body.position.y)
                || this.cameras.main.worldView.contains(ball.body.position.x - 50, ball.body.position.y)
                || this.cameras.main.worldView.contains(ball.body.position.x, ball.body.position.y + 50)
                || this.cameras.main.worldView.contains(ball.body.position.x, ball.body.position.y - 50)
           ) {
               return;
           }

            const direction = new Phaser.Math.Vector2().copy(this.character.body.position).subtract(ball.body.position).normalize().scale(ball.body.speed);
            ball.body.setVelocity(direction.x, direction.y);
        });
        
        this.updateScore()
    }

    handlePointerDown(pointer) {
        this.isMovementActive = true;
        this.pointedTarget.x = pointer.x;
        this.pointedTarget.y = pointer.y;
    }

    handlePointerMove(pointer) {
        if (!this.isMovementActive) {
            return;
        }

        this.pointedTarget.x = pointer.x;
        this.pointedTarget.y = pointer.y;

        this.physics.moveToObject(this.character, this.pointedTarget, 500);
    }

    handlePointerUp() {
        this.isMovementActive = false;
        const distance = Phaser.Math.Distance.BetweenPoints(this.character, this.pointedTarget);
        this.character.body.velocity.scale(
            Phaser.Math.SmoothStep(distance / 100, 0, distance)
        );
    }
}
