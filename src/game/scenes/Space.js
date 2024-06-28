import { Scene } from "phaser";
import { EventBus } from "../EventBus.js";
import { loadTextures } from "../textures/index.js";
import { backgroundTexture } from "./background.js";
import { BallGroup } from "./ball-group.js";
import { getCharacterTexture } from "./character.js";
import { Follower } from "./follower.js";
import { getParticleTexture } from "./particles.js";

const GRAV_FORCE = 1e6;
const GRAV_MAX = 1e3;
const MAX_BALLS_IN_GAME = 30;

export class Space extends Scene {
    constructor() {
        super("Space");
    }

    preload() {
        loadTextures(this);
    }

    create() {
        this.createCamera();
        this.createPhysics();
        this.createBackground();
        this.createCharacter();
        this.createFollowersGroup();
        this.createPointer();

        this.input.on("pointerdown", this.handlePointerDown, this);
        this.input.on("pointermove", this.handlePointerMove, this);
        this.input.on("pointerup", this.handlePointerUp, this);

        this.ballsGroup = new BallGroup(this);
        this.ballsGroup.spawnBalls(MAX_BALLS_IN_GAME);

        this.createCollider();
    }

    createCamera() {
        this.cameras.main.setBackgroundColor(0x555555);
    }

    createPhysics() {
        this.physics.world.setBounds(-150, -150, this.cameras.main.width + 300, this.cameras.main.height + 300);
    }

    createBackground() {
        this.background = this.add.tileSprite(0, 0, this.cameras.main.width, this.cameras.main.height, backgroundTexture(this, 300, 300, 20))
            .setOrigin(0)
            .setScrollFactor(0, 1);
    }

    createCharacter() {
        this.character = this.add.sprite(100, 100, getCharacterTexture(this));
        this.physics.add.existing(this.character, false);
        this.character.body.setCircle(12);
        this.character.body.onCollide = true;
        this.character.body.setMass(10);

        this.character.name = "character";

        const texture = getParticleTexture(this);
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
            blendMode: "ADD"
        });
        emitter.startFollow(this.character);

        this.characterGroup = this.physics.add.group(this.character, {
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });
    }

    createFollowersGroup() {
        this.followersGroup = this.physics.add.group({
            bounceX: 1,
            bounceY: 1,
            collideWorldBounds: true
        });
    }

    createPointer() {
        this.pointedTarget = new Phaser.Math.Vector2();
    }

    createCollider() {
        this.collider = this.physics.add.collider(this.characterGroup, this.ballsGroup);
        this.followersCollider = this.physics.add.collider(this.followersGroup, this.ballsGroup);
        this.ballsCollided = this.physics.add.collider(this.ballsGroup, this.ballsGroup);

        this.physics.world.on("collide", (gameObject1, gameObject2, body1, body2) => {
            if (gameObject1 === this.character && this.game.satellites.max > this.followersGroup.children.size && !gameObject2.kind) {
                const follower = Follower.fromBall(gameObject2);

                this.followersGroup.add(follower);

                gameObject2.destroy();

                this.followersCollider.destroy();
                this.followersCollider = this.physics.add.collider(this.followersGroup, this.ballsGroup);

                this.ballsCollided.destroy();
                this.ballsCollided = this.physics.add.collider(this.ballsGroup, this.ballsGroup);

                EventBus.emit("character.satellite.added");

                return;
            }

            if (gameObject1 === this.character) {
                EventBus.emit("character.bounced", { energy: gameObject2.energy, speed: gameObject2.body.speed });
                gameObject2.energy -= Math.ceil(gameObject2.energy * gameObject2.body.speed / this.game.MAX_SPEED);
                if (gameObject2.energy < 0) {
                    EventBus.emit("ball.destroyed", { type: gameObject2.kind });
                    gameObject2.destroy();
                    if (this.game.energy.value > 0) {
                        this.ballsGroup.spawnBall();
                    }
                }

                return;
            }

            if (this.followersGroup.contains(gameObject1) && !gameObject2.kind) {
                EventBus.emit("character.satellite.bounced", {
                    energy: gameObject2.energy,
                    speed: gameObject2.body.speed
                });
                const elementCreated = gameObject1.maybeCreateElement(gameObject2);
                if (elementCreated) {
                    this.ballsGroup.remove(gameObject2);
                    this.ballsGroup.add(elementCreated);
                    gameObject2.destroy();

                    return;
                }

                gameObject2.energy -= Math.ceil(gameObject2.energy * gameObject2.body.speed / this.game.MAX_SPEED);
                if (gameObject2.energy < 0) {
                    gameObject2.energy = 0;
                }
            }
        });
    }

    update() {
        this.background.setTilePosition(this.cameras.main.scrollX);

        const tolerance = 3;

        const distance = Phaser.Math.Distance.BetweenPoints(this.character, this.pointedTarget);

        if (this.character.body.speed > 0) {
            this.physics.moveToObject(this.character, this.pointedTarget, distance);

            this.character.body.velocity.scale(
                Phaser.Math.SmoothStep(distance, 0, distance) + 1
            );

            if (distance < tolerance) {
                this.character.body.reset(this.pointedTarget.x, this.pointedTarget.y);
            }
        }

        const force = new Phaser.Math.Vector2();
        this.followersGroup.children.iterate((ball, index) => {
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
